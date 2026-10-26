/*
 * Service Worker für Zeiger – macht die App offline nutzbar (Muster aus Grapnel).
 * Wird beim Build aus dieser Vorlage erzeugt (vite.config.ts → sw.js).
 *
 * - Installation: die App selbst wird gespeichert (klein).
 * - Der Compiler (rund 100 MB) kommt beim ersten Gebrauch in einen eigenen
 *   Cache. Er bleibt über App-Updates hinweg erhalten, solange sich seine
 *   Dateien nicht ändern.
 * - Seitenaufrufe: zuerst Netz (neueste Version), ohne Netz die gespeicherte App.
 * - Jede Antwort bekommt die Header für Cross-Origin-Isolation. GitHub Pages
 *   setzt sie nicht selbst; ohne sie gäbe es keinen SharedArrayBuffer und damit
 *   keine interaktive Eingabe für scanf.
 *
 * Ein neuer Worker übernimmt NICHT automatisch: Mitten in einer Übung soll die
 * App nicht unter den Händen neu laden. Die App zeigt einen Hinweis und schickt
 * erst auf Wunsch SKIP_WAITING.
 */
const VERSION = '__VERSION__';
const PRECACHE = __PRECACHE__;
const COMPILER = __COMPILER__;
// Pfad, unter dem die App liegt: «/» lokal, «/zeiger/» bei GitHub Pages.
const BASE = __BASE__;
const CACHE = `zeiger-${VERSION}`;
const COMPILER_CACHE = 'zeiger-compiler';
const NAV_TIMEOUT_MS = 3500;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('zeiger-') && k !== CACHE && k !== COMPILER_CACHE).map((k) => caches.delete(k)));
      // Alte Compiler-Dateien (anderer Hash im Namen) wegräumen.
      const compiler = await caches.open(COMPILER_CACHE);
      const wanted = new Set(COMPILER.map((p) => new URL(p, self.location.origin).href));
      for (const request of await compiler.keys()) {
        if (!wanted.has(request.url)) await compiler.delete(request);
      }
      await self.clients.claim();
    })(),
  );
});

function isolated(response) {
  if (!response || response.status === 0 || response.type === 'opaque') return response;
  const headers = new Headers(response.headers);
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);
}

async function fromCompilerCache(request) {
  const cache = await caches.open(COMPILER_CACHE);
  const hit = await cache.match(request, { ignoreVary: true });
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      withTimeout(fetch(request), NAV_TIMEOUT_MS)
        .then((response) => {
          // GitHub Pages liefert Unterseiten als 404.html mit Status 404 aus; das ist trotzdem die App.
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(BASE, copy));
          }
          return isolated(response);
        })
        .catch(() => caches.match(BASE, { ignoreVary: true }).then((hit) => (hit ? isolated(hit) : Response.error()))),
    );
    return;
  }

  if (COMPILER.includes(url.pathname)) {
    event.respondWith(fromCompilerCache(request).then(isolated));
    return;
  }

  event.respondWith(
    caches
      .match(request, { ignoreVary: true })
      .then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            if (response.ok && url.pathname.startsWith(`${BASE}assets/`)) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      )
      .then(isolated),
  );
});
