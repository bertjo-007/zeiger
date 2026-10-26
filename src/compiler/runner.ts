/**
 * Führt ein kompiliertes Programm (WASI) aus. Läuft im Run-Worker des Browsers
 * und in Node; die Eingabe kommt über eine austauschbare Quelle, damit sie im
 * Browser blockierend (SharedArrayBuffer) und in Tests vorab gefüllt sein kann.
 */
import { Directory, Fd, File, PreopenDirectory, WASI, wasi as defs } from '@bjorn3/browser_wasi_shim';
import { classify } from './runtime-errors.ts';
import type { EndReason, MemFinding, RunOptions, RunResult, Segment, StreamName, TrapInfo } from './types.ts';

export interface StdinSource {
  /** Liefert bis zu `max` Bytes, höchstens eine Zeile. Leeres Array = Ende der Eingabe. */
  read(max: number): Uint8Array;
}

export interface RunHooks {
  stdin: StdinSource;
  /** Laufende Ausgabe, z. B. für das Terminal. */
  onOutput?: (segment: Segment) => void;
}

export class OutputLimitError extends Error {}
export class StoppedError extends Error {}

const MARKER = '\u0001ZEIGER:';

/** Eingabe aus einem festen Text, zeilenweise wie in einem Terminal. */
export function textStdin(text: string): StdinSource {
  const bytes = new TextEncoder().encode(text);
  let pos = 0;
  return {
    read(max) {
      if (pos >= bytes.length) return new Uint8Array();
      // Bis einschliesslich zum nächsten Zeilenumbruch.
      const nl = bytes.indexOf(0x0a, pos);
      const stop = Math.min(nl === -1 ? bytes.length : nl + 1, pos + max);
      const chunk = bytes.slice(pos, stop);
      pos = stop;
      return chunk;
    },
  };
}

class StdinFd extends Fd {
  source: StdinSource;
  echo: (bytes: Uint8Array) => void;
  constructor(source: StdinSource, echo: (bytes: Uint8Array) => void) {
    super();
    this.source = source;
    this.echo = echo;
  }
  fd_fdstat_get() {
    const fdstat = new defs.Fdstat(defs.FILETYPE_CHARACTER_DEVICE, 0);
    fdstat.fs_rights_base = BigInt(defs.RIGHTS_FD_READ);
    return { ret: 0, fdstat };
  }
  fd_filestat_get() {
    return { ret: 0, filestat: new defs.Filestat(0n, defs.FILETYPE_CHARACTER_DEVICE, 0n) };
  }
  fd_read(size: number) {
    const data = this.source.read(size);
    if (data.length > 0) this.echo(data);
    return { ret: 0, data };
  }
}

class OutFd extends Fd {
  write: (bytes: Uint8Array) => void;
  constructor(write: (bytes: Uint8Array) => void) {
    super();
    this.write = write;
  }
  fd_fdstat_get() {
    const fdstat = new defs.Fdstat(defs.FILETYPE_CHARACTER_DEVICE, 0);
    fdstat.fs_rights_base = BigInt(defs.RIGHTS_FD_WRITE);
    return { ret: 0, fdstat };
  }
  fd_filestat_get() {
    return { ret: 0, filestat: new defs.Filestat(0n, defs.FILETYPE_CHARACTER_DEVICE, 0n) };
  }
  fd_write(data: Uint8Array) {
    this.write(data);
    return { ret: 0, nwritten: data.byteLength };
  }
}

function parseMarker(line: string): MemFinding | undefined {
  const [kind, ...rest] = line.split(' ');
  switch (kind) {
    case 'LECK':
      return { kind: 'leak', nummer: Number(rest[0]), bytes: Number(rest[1]) };
    case 'DATEI_OFFEN':
      return { kind: 'file-open', name: rest.join(' ') };
    case 'DOPPELT':
      return { kind: 'double-free', fn: rest[0] ?? 'free' };
    case 'UNGUELTIG':
      return { kind: 'invalid-free', fn: rest[0] ?? 'free' };
    case 'FCLOSE_NULL':
      return { kind: 'fclose-null' };
    case 'UNVOLLSTAENDIG':
      return { kind: 'incomplete' };
  }
  return undefined;
}

/** Wasm-Offsets und Funktionsnamen aus einem Stack-Trace (V8 und Firefox). */
export function parseStack(stack: string): { offsets: number[]; recursive?: string } {
  const offsets: number[] = [];
  const names: string[] = [];
  for (const line of stack.split('\n')) {
    const m = /wasm-function\[\d+\]:0x([0-9a-f]+)/.exec(line);
    if (!m) continue;
    offsets.push(parseInt(m[1], 16));
    const name = /at (?:programm\.)?([\w$.]+) \(/.exec(line)?.[1] ?? /^([\w$.]+)@/.exec(line.trim())?.[1];
    if (name) names.push(name.replace(/^programm\./, ''));
  }
  const top = names[0];
  const same = top ? names.filter((n) => n === top).length : 0;
  const recursive = same >= 8 ? (top === '__original_main' ? 'main' : top) : undefined;
  return { offsets: offsets.slice(0, 4), recursive };
}

function utf8Args(wasi: WASI, args: string[]) {
  const enc = new TextEncoder();
  const encoded = args.map((a) => enc.encode(a + '\0'));
  const memory = () => (wasi.inst.exports.memory as WebAssembly.Memory).buffer;
  wasi.wasiImport.args_sizes_get = (argc: number, size: number) => {
    const view = new DataView(memory());
    view.setUint32(argc, encoded.length, true);
    view.setUint32(size, encoded.reduce((s, e) => s + e.length, 0), true);
    return 0;
  };
  wasi.wasiImport.args_get = (argv: number, buf: number) => {
    const view = new DataView(memory());
    const bytes = new Uint8Array(memory());
    let p = buf;
    encoded.forEach((e, i) => {
      view.setUint32(argv + i * 4, p, true);
      bytes.set(e, p);
      p += e.length;
    });
    return 0;
  };
}

export async function runProgram(program: Uint8Array | WebAssembly.Module, options: RunOptions, hooks: RunHooks): Promise<RunResult> {
  const started = performance.now();
  const limit = options.outputLimit ?? 256 * 1024;
  const transcript: Segment[] = [];
  const memory: MemFinding[] = [];
  let stdout = '';
  let stderr = '';
  let total = 0;
  const dec: Record<StreamName, TextDecoder> = {
    stdout: new TextDecoder('utf-8', { fatal: false }),
    stderr: new TextDecoder('utf-8', { fatal: false }),
    stdin: new TextDecoder('utf-8', { fatal: false }),
  };

  const emit = (stream: StreamName, text: string) => {
    if (!text) return;
    if (stream === 'stdout') stdout += text;
    if (stream === 'stderr') stderr += text;
    const last = transcript[transcript.length - 1];
    if (last && last.stream === stream) last.text += text;
    else transcript.push({ stream, text });
    hooks.onOutput?.({ stream, text });
  };

  // stderr enthält auch die Meldungen der Speicherprüfung; sie beginnen am Zeilenanfang mit MARKER.
  let errLine = '';
  let inMarker = false;
  const handleErr = (text: string) => {
    for (const ch of text) {
      if (inMarker) {
        if (ch === '\n') {
          const finding = parseMarker(errLine.slice(MARKER.length));
          if (finding) memory.push(finding);
          errLine = '';
          inMarker = false;
        } else errLine += ch;
        continue;
      }
      if (ch === '\u0001') {
        inMarker = true;
        errLine = ch;
        continue;
      }
      emit('stderr', ch);
    }
  };

  const write = (stream: 'stdout' | 'stderr') => (bytes: Uint8Array) => {
    total += bytes.length;
    const text = dec[stream].decode(bytes, { stream: true });
    if (stream === 'stdout') emit('stdout', text);
    else handleErr(text);
    if (total > limit) throw new OutputLimitError();
  };

  const enc = new TextEncoder();
  const contents = new Map<string, File | Directory>();
  for (const [name, data] of Object.entries(options.files ?? {})) {
    contents.set(name, new File(typeof data === 'string' ? enc.encode(data) : data));
  }
  const root = new PreopenDirectory('.', contents);
  const fds = [
    new StdinFd(hooks.stdin, (bytes) => emit('stdin', dec.stdin.decode(bytes, { stream: true }))),
    new OutFd(write('stdout')),
    new OutFd(write('stderr')),
    root,
  ];
  const args = ['programm', ...(options.args ?? [])];
  const wasi = new WASI(args, [], fds, { debug: false });
  utf8Args(wasi, args);

  const module = program instanceof WebAssembly.Module ? program : await WebAssembly.compile(program as BufferSource);
  const instance = await WebAssembly.instantiate(module, { wasi_snapshot_preview1: wasi.wasiImport });

  let end: EndReason = 'exit';
  let exitCode: number | null = null;
  let trap: TrapInfo | undefined;
  const previousLimit = (Error as { stackTraceLimit?: number }).stackTraceLimit;
  (Error as { stackTraceLimit?: number }).stackTraceLimit = 40;
  try {
    exitCode = wasi.start(instance as unknown as { exports: { memory: WebAssembly.Memory; _start: () => unknown } });
  } catch (e) {
    if (e instanceof OutputLimitError) end = 'output-limit';
    else if (e instanceof StoppedError) end = 'stopped';
    else {
      end = 'trap';
      const message = e instanceof Error ? e.message : String(e);
      const { offsets, recursive } = parseStack(e instanceof Error ? (e.stack ?? '') : '');
      trap = { kind: classify(message, undefined, recursive), message, offsets, recursive };
    }
  } finally {
    (Error as { stackTraceLimit?: number }).stackTraceLimit = previousLimit;
  }
  if (memory.some((m) => m.kind === 'double-free' || m.kind === 'invalid-free' || m.kind === 'fclose-null')) end = 'crash';

  const files: Record<string, Uint8Array> = {};
  for (const [name, entry] of root.dir.contents) {
    if (entry instanceof File) files[name] = entry.data;
  }
  return { end, exitCode, stdout, stderr, transcript, trap, memory, files, ms: performance.now() - started };
}
