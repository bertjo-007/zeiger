/**
 * Ruft Clang (WebAssembly) auf. Läuft im Compiler-Worker und in Node
 * (Prüfskript, Tests); darum ohne DOM und ohne Vite-Eigenheiten.
 */
import * as yowasp from '@yowasp/clang';
import { displayCommand, sourceNames, VISIBLE_FLAGS } from './befehl.ts';
import { parseDiagnostics } from './diagnostics.ts';
import type { CompileResult, Frame, SourceFiles } from './types.ts';

export { displayCommand, sourceNames, VISIBLE_FLAGS };

// Das Paket exportiert runClang, seine Typdefinition kennt es aber (noch) nicht.
const runClang = (yowasp as unknown as { runClang: yowasp.Command }).runClang;
const runLLVM = yowasp.runLLVM;

export const SUPPORT_FILE = '__zeiger_laufzeit.c';
const SUPPORT_OBJECT = '__zeiger_laufzeit.o';

/** Zusätzliche Flags nur für die Lernumgebung (Ziel, Laufzeitprüfungen). */
const HIDDEN_COMPILE_FLAGS = ['--target=wasm32-wasip1', '-O0', '-fno-color-diagnostics', '-fsanitize=undefined', '-fsanitize-trap=undefined'];

const LINK_FLAGS = [
  '-Wl,--stack-first',
  '-Wl,-z,stack-size=1048576',
  '-Wl,--wrap=malloc,--wrap=calloc,--wrap=realloc,--wrap=free,--wrap=fopen,--wrap=fclose,--wrap=__main_argc_argv',
];

/**
 * Die Laufzeit-Hilfen einmal als Objektdatei übersetzen und danach nur noch
 * dazulinken. Sie jedes Mal mitzukompilieren kostet rund eine Sekunde.
 */
let supportObject: { source: string; object: Promise<Uint8Array> } | undefined;

export type FetchProgress = (done: number, total: number) => void;

/** Fasst den Fortschritt der einzelnen Downloads von Clang zu einer Zahl zusammen. */
function progressAdapter(onProgress?: FetchProgress) {
  if (!onProgress) return undefined;
  const parts = new Map<object, { done: number; total: number }>();
  return (event: { source: object; totalLength: number; doneLength: number }) => {
    parts.set(event.source, { done: event.doneLength, total: event.totalLength });
    let done = 0;
    let total = 0;
    for (const p of parts.values()) {
      done += p.done;
      total += p.total;
    }
    onProgress(done, total);
  };
}

function compiledSupport(source: string, onProgress?: FetchProgress): Promise<Uint8Array> {
  if (supportObject?.source === source) return supportObject.object;
  const object = (async () => {
    const err = collect();
    const out = (await runClang(['clang', ...VISIBLE_FLAGS, ...HIDDEN_COMPILE_FLAGS, '-c', SUPPORT_FILE, '-o', SUPPORT_OBJECT], { [SUPPORT_FILE]: source }, {
      stdout: err.sink,
      stderr: err.sink,
      fetchProgress: progressAdapter(onProgress),
    })) as Record<string, unknown> | undefined;
    const bytes = toBytes(out?.[SUPPORT_OBJECT]);
    if (!bytes) throw new Error('Laufzeit-Hilfen liessen sich nicht übersetzen:\n' + err.text());
    return bytes;
  })();
  supportObject = { source, object };
  object.catch(() => {
    if (supportObject?.object === object) supportObject = undefined;
  });
  return object;
}

/** Lädt Clang und übersetzt die Laufzeit-Hilfen, damit der erste echte Lauf schnell ist. */
export async function warmup(support: string, onProgress?: FetchProgress): Promise<void> {
  await compiledSupport(support, onProgress);
}

const decoder = () => new TextDecoder('utf-8', { fatal: false });

function collect() {
  const dec = decoder();
  let text = '';
  const sink = (bytes: Uint8Array | null) => {
    if (bytes) text += dec.decode(bytes, { stream: true });
  };
  return { sink, text: () => text };
}

function toBytes(tree: unknown): Uint8Array | undefined {
  return tree instanceof Uint8Array ? tree : undefined;
}

export interface CompileOptions {
  /** Quelltext der Laufzeit-Hilfen (laufzeit.c). */
  support: string;
  /** Nur Präprozessor laufen lassen (`clang -E`) für die angegebene Datei. */
  preprocess?: string;
  /** Zusätzliche Flags, z. B. `-Dmain=__schueler_main` für Funktionstests. */
  extraFlags?: string[];
  /** Zusätzliche Dateien, die mitkompiliert, aber nicht angezeigt werden (Test-Harness). */
  hiddenFiles?: SourceFiles;
  onFetchProgress?: FetchProgress;
}

export async function compile(files: SourceFiles, options: CompileOptions): Promise<CompileResult> {
  const started = performance.now();
  const err = collect();
  const command = displayCommand(files);
  const tree: Record<string, string | Uint8Array> = { ...files, ...options.hiddenFiles };

  if (options.preprocess) {
    const out = collect();
    try {
      await runClang(['clang', '--target=wasm32-wasip1', '-std=c17', '-E', '-P', options.preprocess], tree, {
        stdout: out.sink,
        stderr: err.sink,
        fetchProgress: progressAdapter(options.onFetchProgress),
      });
      return { ok: true, preprocessed: out.text(), stderr: err.text(), diagnostics: parseDiagnostics(err.text()), command, ms: performance.now() - started };
    } catch {
      return { ok: false, stderr: err.text(), diagnostics: parseDiagnostics(err.text()), command, ms: performance.now() - started };
    }
  }

  tree[SUPPORT_OBJECT] = await compiledSupport(options.support, options.onFetchProgress);
  const inputs = [...sourceNames(files), ...sourceNames(options.hiddenFiles ?? {}), SUPPORT_OBJECT];
  const args = ['clang', ...VISIBLE_FLAGS, ...HIDDEN_COMPILE_FLAGS, ...LINK_FLAGS, ...(options.extraFlags ?? []), ...inputs, '-o', 'programm'];
  try {
    const out = (await runClang(args, tree, { stdout: err.sink, stderr: err.sink })) as Record<string, unknown> | undefined;
    const wasm = toBytes(out?.programm);
    const stderr = err.text();
    return { ok: wasm !== undefined, wasm, stderr, diagnostics: parseDiagnostics(stderr), command, ms: performance.now() - started };
  } catch {
    const stderr = err.text();
    return { ok: false, stderr, diagnostics: parseDiagnostics(stderr), command, ms: performance.now() - started };
  }
}

/** Beginn der Code-Sektion im Modul. DWARF zählt Adressen ab hier, V8 ab Modulanfang. */
export function codeSectionStart(bytes: Uint8Array): number {
  let p = 8;
  const leb = () => {
    let result = 0;
    let shift = 0;
    let byte: number;
    do {
      byte = bytes[p++];
      result |= (byte & 0x7f) << shift;
      shift += 7;
    } while (byte & 0x80);
    return result >>> 0;
  };
  while (p < bytes.length) {
    const id = bytes[p++];
    const size = leb();
    if (id === 10) return p;
    p += size;
  }
  return 0;
}

const TRAP_PREFIX = '__clang_trap_msg$';

/**
 * Ordnet Wasm-Offsets über die Debug-Info Funktionen und Zeilen zu.
 * Liefert die Rahmen (innerste zuerst) und – falls vorhanden – den Grund
 * eines Sanitizer-Traps.
 */
export async function locate(wasm: Uint8Array, offsets: number[]): Promise<{ frames: Frame[]; reason?: string }> {
  const base = codeSectionStart(wasm);
  const addresses = offsets.map((o) => '0x' + Math.max(0, o - base).toString(16));
  if (addresses.length === 0) return { frames: [] };
  const out = collect();
  try {
    await runLLVM(['addr2line', '-f', '-i', '-e', 'programm', ...addresses], { programm: wasm }, { stdout: out.sink, stderr: out.sink });
  } catch {
    return { frames: [] };
  }
  const lines = out.text().split('\n').filter((l) => l.length > 0);
  const frames: Frame[] = [];
  let reason: string | undefined;
  for (let i = 0; i + 1 < lines.length; i += 2) {
    const fn = lines[i];
    const where = lines[i + 1];
    if (fn.startsWith(TRAP_PREFIX)) {
      reason ??= fn.split('$').slice(2).join('$');
      continue;
    }
    const m = /^\/?(.*):(\d+)$/.exec(where);
    const line = m ? Number(m[2]) : 0;
    const file = m && m[1] !== '??' ? m[1] : undefined;
    // Ohne Quelldatei stammt der Rahmen aus der C-Bibliothek (keine Debug-Info);
    // addr2line rät dann einen falschen Namen.
    if (!file || file === SUPPORT_FILE) continue;
    frames.push({ function: fn === '__original_main' ? 'main' : fn, file, line: line > 0 ? line : undefined });
  }
  return { frames, reason };
}
