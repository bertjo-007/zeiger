import { createHash } from 'node:crypto';
import { copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Dateien aus public/, die der Service Worker zusätzlich vorhält (relativ zur Basis). */
const PUBLIC_FILES = ['manifest.webmanifest', 'favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'apple-touch-icon.png'];

/** Schriften nur als woff2 und nur latin/latin-ext – die übrigen lädt der Browser nie. */
const isNeededFile = (f: string) => !/\.(woff|ttf|eot)$/.test(f) && !(/\.woff2$/.test(f) && !/-latin-/.test(f));

/** Der Compiler (rund 100 MB) wird nicht beim Installieren geladen, sondern beim ersten Gebrauch gespeichert. */
const isCompilerFile = (f: string) => /llvm[^/]*\.(wasm|tar)$/.test(f);

/** Header für SharedArrayBuffer (blockierende Eingabe für scanf). */
const ISOLATION = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

/**
 * Erzeugt beim Build sw.js aus scripts/sw-template.js mit der Liste aller gebauten
 * Dateien (Muster aus Grapnel). Die Version ist ein Hash über Dateiliste und Vorlage.
 */
function serviceWorker(base: string): Plugin {
  return {
    name: 'zeiger-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      if (this.environment?.name !== 'client') return;
      const files = Object.keys(bundle).filter((f) => !f.endsWith('.map') && !f.startsWith('.') && f !== 'index.html' && isNeededFile(f) && !isCompilerFile(f));
      const compiler = Object.keys(bundle).filter(isCompilerFile);
      const precache = ['', ...files, ...PUBLIC_FILES].map((f) => base + f);
      const template = readFileSync('scripts/sw-template.js', 'utf8');
      const version = createHash('sha256').update(precache.join('|')).update(compiler.join('|')).update(template).digest('hex').slice(0, 12);
      const source = template
        .replaceAll('__PRECACHE__', JSON.stringify(precache))
        .replaceAll('__COMPILER__', JSON.stringify(compiler.map((f) => base + f)))
        .replaceAll('__VERSION__', version)
        .replaceAll('__BASE__', JSON.stringify(base));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

/** GitHub Pages kennt keinen SPA-Fallback, liefert aber 404.html für jede unbekannte Adresse. */
function spaFallback(): Plugin {
  return {
    name: 'zeiger-404',
    apply: 'build',
    writeBundle(options) {
      if (options.dir) copyFileSync(join(options.dir, 'index.html'), join(options.dir, '404.html'));
    },
  };
}

/**
 * - Standard: lokale Entwicklung und Build unter «/».
 * - `--mode pages`: statische App für GitHub Pages unter /zeiger/.
 */
export default defineConfig(({ mode }) => {
  const pages = mode === 'pages';
  const base = pages ? (process.env.ZEIGER_BASE ?? '/zeiger/') : '/';
  return {
    base,
    plugins: [react(), serviceWorker(base), spaFallback()],
    // Clang lädt seine Dateien über new URL(…, import.meta.url); das Vorbündeln würde die Pfade zerstören.
    optimizeDeps: { exclude: ['@yowasp/clang'] },
    worker: { format: 'es' },
    assetsInclude: ['**/*.tar'],
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 1500,
      assetsInlineLimit: (file: string) => (isCompilerFile(file) ? false : undefined),
      ...(pages ? { outDir: 'dist/pages' } : {}),
    },
    server: {
      // Fest auf IPv4: unter Windows lauscht Vite sonst nur auf ::1.
      host: '127.0.0.1',
      port: 5177,
      strictPort: true,
      headers: ISOLATION,
    },
    preview: {
      host: '127.0.0.1',
      port: 4177,
      strictPort: true,
      headers: ISOLATION,
    },
  };
});
