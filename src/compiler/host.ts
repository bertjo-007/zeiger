/**
 * Schnittstelle des Haupt-Threads zu Compiler und Ausführung.
 *
 * - Ein Compiler-Worker für die ganze App, der warm bleibt.
 * - Ein Run-Worker, der wiederverwendet und nur bei Zeitüberschreitung oder
 *   Stopp ersetzt wird.
 */
import { classify } from './runtime-errors.ts';
import { createStdinBuffer, EOF, sendInput, sendSignal, STOP } from './stdin-channel.ts';
import type { ClangRequest, ClangResponse, CompileRequestOptions, RunRequest, RunResponse } from './protocol.ts';
import type { CompileResult, Frame, RunOptions, RunResult, Segment, SourceFiles } from './types.ts';

export type CompilerStatus = { state: 'idle' | 'loading' | 'ready' | 'error'; done: number; total: number; message?: string };

type Pending = { resolve: (v: ClangResponse) => void; reject: (e: Error) => void };
type OhneId<T> = T extends unknown ? Omit<T, 'id'> : never;

/** Darf das Programm interaktiv von der Tastatur lesen? Braucht Cross-Origin-Isolation. */
export const interactiveInputAvailable = () => typeof SharedArrayBuffer !== 'undefined' && globalThis.crossOriginIsolated === true;

class CompilerHost {
  private worker?: Worker;
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private listeners = new Set<(s: CompilerStatus) => void>();
  private warming?: Promise<void>;
  status: CompilerStatus = { state: 'idle', done: 0, total: 0 };

  subscribe(fn: (s: CompilerStatus) => void) {
    this.listeners.add(fn);
    fn(this.status);
    return () => void this.listeners.delete(fn);
  }

  private setStatus(s: Partial<CompilerStatus>) {
    this.status = { ...this.status, ...s };
    for (const fn of this.listeners) fn(this.status);
  }

  private ensureWorker(): Worker {
    if (this.worker) return this.worker;
    const worker = new Worker(new URL('./clang.worker.ts', import.meta.url), { type: 'module', name: 'clang' });
    worker.onmessage = (event: MessageEvent<ClangResponse>) => {
      const msg = event.data;
      if (msg.type === 'progress') {
        if (this.status.state !== 'ready') this.setStatus({ state: 'loading', done: msg.done, total: msg.total });
        return;
      }
      const p = this.pending.get(msg.id);
      if (!p) return;
      this.pending.delete(msg.id);
      if (msg.type === 'failed') p.reject(new Error(msg.message));
      else p.resolve(msg);
    };
    worker.onerror = (event) => {
      const error = new Error(event.message || 'Der Compiler konnte nicht gestartet werden.');
      this.setStatus({ state: 'error', message: error.message });
      for (const p of this.pending.values()) p.reject(error);
      this.pending.clear();
    };
    this.worker = worker;
    return worker;
  }

  private request(msg: OhneId<ClangRequest>, transfer: Transferable[] = []): Promise<ClangResponse> {
    const id = this.nextId++;
    const worker = this.ensureWorker();
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      worker.postMessage({ ...msg, id } as ClangRequest, transfer);
    });
  }

  /** Lädt den Compiler im Hintergrund. Mehrfache Aufrufe teilen sich denselben Ladevorgang. */
  warmup(): Promise<void> {
    if (this.warming) return this.warming;
    if (this.status.state !== 'ready') this.setStatus({ state: 'loading' });
    this.warming = this.request({ type: 'warmup' }).then(
      () => this.setStatus({ state: 'ready' }),
      (e: Error) => {
        this.warming = undefined;
        this.setStatus({ state: 'error', message: e.message });
        throw e;
      },
    );
    return this.warming;
  }

  async compile(files: SourceFiles, options: CompileRequestOptions = {}): Promise<CompileResult> {
    const res = await this.request({ type: 'compile', files, options });
    if (res.type !== 'compiled') throw new Error('Unerwartete Antwort des Compilers');
    if (this.status.state !== 'ready') this.setStatus({ state: 'ready' });
    return res.result;
  }

  async locate(wasm: Uint8Array, offsets: number[]): Promise<{ frames: Frame[]; reason?: string }> {
    const res = await this.request({ type: 'locate', wasm: wasm.slice(), offsets });
    if (res.type !== 'located') return { frames: [] };
    return { frames: res.frames, reason: res.reason };
  }
}

export const compiler = new CompilerHost();

export interface RunHandlers {
  onOutput?: (segments: Segment[]) => void;
  /** Das Programm wartet auf eine Eingabe (nur interaktiv). */
  onWaiting?: (waiting: boolean) => void;
}

export interface RunConfig extends RunOptions {
  /** Interaktiv (Tastatur) oder ein fester Eingabetext. */
  stdin: { mode: 'interactive' } | { mode: 'text'; text: string };
  /** Höchste reine Rechenzeit in ms; Wartezeit auf Eingaben zählt nicht. */
  timeLimitMs?: number;
}

/** Eine laufende Ausführung. */
export class RunSession {
  readonly result: Promise<RunResult>;
  private stdinBuffer?: SharedArrayBuffer;
  private waiting = false;
  private finish!: (r: RunResult) => void;
  private stopRequested = false;

  private id: number;
  private handlers: RunHandlers;

  constructor(host: RunHost, id: number, wasm: Uint8Array, config: RunConfig, handlers: RunHandlers) {
    this.id = id;
    this.handlers = handlers;
    this.result = new Promise((resolve) => (this.finish = resolve));
    const transcript: Segment[] = [];
    const interactive = config.stdin.mode === 'interactive' && interactiveInputAvailable();
    if (interactive) this.stdinBuffer = createStdinBuffer();
    const limit = config.timeLimitMs ?? 5000;
    let active = 0;
    let lastTick = performance.now();
    let settled = false;

    const worker = host.acquire();
    const settle = (r: RunResult) => {
      if (settled) return;
      settled = true;
      clearInterval(timer);
      worker.onmessage = null;
      this.finish(r);
    };
    const partial = (end: RunResult['end']): RunResult => ({
      end,
      exitCode: null,
      stdout: transcript.filter((s) => s.stream === 'stdout').map((s) => s.text).join(''),
      stderr: transcript.filter((s) => s.stream === 'stderr').map((s) => s.text).join(''),
      transcript,
      memory: [],
      files: {},
      ms: active,
    });

    const timer = setInterval(() => {
      const now = performance.now();
      if (!this.waiting) active += now - lastTick;
      lastTick = now;
      if (active > limit) {
        host.discard(worker);
        settle(partial('timeout'));
      }
    }, 50);

    worker.onmessage = async (event: MessageEvent<RunResponse>) => {
      const msg = event.data;
      if (msg.id !== this.id) return;
      switch (msg.type) {
        case 'output':
          for (const s of msg.segments) {
            const tail = transcript[transcript.length - 1];
            if (tail && tail.stream === s.stream) tail.text += s.text;
            else transcript.push({ ...s });
          }
          this.handlers.onOutput?.(msg.segments);
          break;
        case 'need-input':
          this.setWaiting(true);
          break;
        case 'input-received':
          this.setWaiting(false);
          break;
        case 'done': {
          const r = msg.result;
          if (r.end === 'stopped') host.discard(worker);
          else host.release(worker);
          if (r.trap) {
            try {
              const loc = await compiler.locate(wasm, r.trap.offsets);
              r.trap.frames = loc.frames;
              r.trap.reason = loc.reason;
              r.trap.kind = classify(r.trap.message, loc.reason, r.trap.recursive);
            } catch {
              // Ohne Zeilenangabe ist die Meldung immer noch nützlich.
            }
          }
          settle(r);
          break;
        }
        case 'failed':
          host.discard(worker);
          settle({ ...partial('crash'), stderr: msg.message });
          break;
      }
    };
    worker.onerror = () => {
      host.discard(worker);
      settle(partial(this.stopRequested ? 'stopped' : 'crash'));
    };

    const request: RunRequest = {
      type: 'run',
      id,
      wasm: wasm.slice(),
      options: { args: config.args, files: config.files, outputLimit: config.outputLimit },
      stdinBuffer: this.stdinBuffer,
      stdinText: config.stdin.mode === 'text' ? config.stdin.text : interactive ? undefined : '',
    };
    worker.postMessage(request);
    this.stop = () => {
      this.stopRequested = true;
      if (this.stdinBuffer && this.waiting) sendSignal(this.stdinBuffer, STOP);
      else {
        host.discard(worker);
        settle(partial('stopped'));
      }
    };
  }

  get interactive() {
    return this.stdinBuffer !== undefined;
  }

  private setWaiting(w: boolean) {
    this.waiting = w;
    this.handlers.onWaiting?.(w);
  }

  /** Eine Zeile an das wartende Programm schicken (ohne \n, das wird ergänzt). */
  sendLine(text: string) {
    if (this.stdinBuffer && this.waiting) sendInput(this.stdinBuffer, text + '\n');
  }

  /** Ende der Eingabe (wie Strg+D im Terminal). */
  sendEof() {
    if (this.stdinBuffer && this.waiting) sendSignal(this.stdinBuffer, EOF);
  }

  stop: () => void = () => {};
}

class RunHost {
  private idle?: Worker;
  private nextId = 1;

  acquire(): Worker {
    const w = this.idle ?? new Worker(new URL('./run.worker.ts', import.meta.url), { type: 'module', name: 'programm' });
    this.idle = undefined;
    return w;
  }

  release(w: Worker) {
    if (this.idle) w.terminate();
    else this.idle = w;
  }

  discard(w: Worker) {
    w.terminate();
  }

  run(wasm: Uint8Array, config: RunConfig, handlers: RunHandlers = {}): RunSession {
    return new RunSession(this, this.nextId++, wasm, config, handlers);
  }
}

export const runner = new RunHost();
