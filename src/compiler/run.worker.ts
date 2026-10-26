/**
 * Run-Worker: führt ein übersetztes Programm aus. Der Haupt-Thread beendet ihn
 * bei Endlosschleifen mit terminate() und startet einen neuen.
 */
import { runProgram, StoppedError, textStdin, type StdinSource } from './runner.ts';
import { waitForInput } from './stdin-channel.ts';
import type { RunRequest, RunResponse } from './protocol.ts';
import type { Segment } from './types.ts';

const ctx = self as unknown as DedicatedWorkerGlobalScope;
const post = (msg: RunResponse, transfer: Transferable[] = []) => ctx.postMessage(msg, transfer);

/**
 * Ausgabe weiterreichen. Die ersten Ausgaben pro 100-ms-Fenster gehen sofort
 * raus – sonst bliebe z. B. ein «Start» vor einer Endlosschleife hängen, weil
 * der Worker danach nie mehr zum Senden kommt. Erst bei einer Flut (Schleife
 * mit printf) wird gesammelt, damit der Haupt-Thread nicht überläuft.
 */
function outputBatcher(id: number) {
  const WINDOW_MS = 100;
  const IMMEDIATE_PER_WINDOW = 20;
  let pending: Segment[] = [];
  let windowStart = performance.now();
  let sent = 0;
  const flush = () => {
    if (pending.length > 0) {
      post({ type: 'output', id, segments: pending });
      sent++;
    }
    pending = [];
  };
  const add = (segment: Segment) => {
    const tail = pending[pending.length - 1];
    if (tail && tail.stream === segment.stream) tail.text += segment.text;
    else pending.push({ ...segment });
    const now = performance.now();
    if (now - windowStart > WINDOW_MS) {
      windowStart = now;
      sent = 0;
    }
    if (sent < IMMEDIATE_PER_WINDOW) flush();
  };
  return { add, flush };
}

function interactiveStdin(buffer: SharedArrayBuffer, id: number, flush: () => void): StdinSource {
  let pending: Uint8Array = new Uint8Array();
  let eof = false;
  return {
    read(max) {
      if (pending.length === 0 && !eof) {
        flush();
        post({ type: 'need-input', id });
        const got = waitForInput(buffer);
        post({ type: 'input-received', id });
        if (got === 'stop') throw new StoppedError();
        if (got === 'eof') eof = true;
        else pending = got;
      }
      if (pending.length === 0) return new Uint8Array();
      const nl = pending.indexOf(0x0a);
      const stop = Math.min(nl === -1 ? pending.length : nl + 1, max);
      const chunk = pending.slice(0, stop);
      pending = pending.slice(stop);
      return chunk;
    },
  };
}

ctx.onmessage = async (event: MessageEvent<RunRequest>) => {
  const msg = event.data;
  const out = outputBatcher(msg.id);
  try {
    const stdin = msg.stdinBuffer ? interactiveStdin(msg.stdinBuffer, msg.id, out.flush) : textStdin(msg.stdinText ?? '');
    const result = await runProgram(msg.wasm, msg.options, { stdin, onOutput: out.add });
    out.flush();
    post({ type: 'done', id: msg.id, result });
  } catch (e) {
    out.flush();
    post({ type: 'failed', id: msg.id, message: e instanceof Error ? e.message : String(e) });
  }
};
