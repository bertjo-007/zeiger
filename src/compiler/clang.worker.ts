/**
 * Compiler-Worker: hält Clang warm. Der erste Aufruf lädt rund 100 MB
 * (danach aus dem Cache des Service Workers) und übersetzt die Laufzeit-Hilfen.
 */
import support from './laufzeit.c?raw';
import { compile, locate, warmup } from './toolchain.ts';
import type { ClangRequest, ClangResponse } from './protocol.ts';

const ctx = self as unknown as DedicatedWorkerGlobalScope;
const post = (msg: ClangResponse, transfer: Transferable[] = []) => ctx.postMessage(msg, transfer);
const onFetchProgress = (done: number, total: number) => post({ type: 'progress', done, total });

// Nacheinander abarbeiten: Clang selbst ist nicht für parallele Aufrufe gebaut.
let queue: Promise<unknown> = Promise.resolve();

ctx.onmessage = (event: MessageEvent<ClangRequest>) => {
  const msg = event.data;
  queue = queue.then(() => handle(msg)).catch((e: unknown) => post({ type: 'failed', id: msg.id, message: e instanceof Error ? e.message : String(e) }));
};

async function handle(msg: ClangRequest) {
  switch (msg.type) {
    case 'warmup':
      await warmup(support, onFetchProgress);
      post({ type: 'ready', id: msg.id });
      break;
    case 'compile': {
      const result = await compile(msg.files, { support, ...msg.options, onFetchProgress });
      post({ type: 'compiled', id: msg.id, result }, result.wasm ? [result.wasm.buffer] : []);
      break;
    }
    case 'locate': {
      const { frames, reason } = await locate(msg.wasm, msg.offsets);
      post({ type: 'located', id: msg.id, frames, reason });
      break;
    }
  }
}
