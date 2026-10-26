// Führt ein Programm im Worker-Thread aus, damit das Prüfskript Endlosschleifen abbrechen kann.
import { parentPort } from 'node:worker_threads';
import { runProgram, textStdin } from '../src/compiler/runner.ts';

parentPort!.on('message', async (msg: { wasm: Uint8Array; stdin: string; args?: string[]; files?: Record<string, string> }) => {
  try {
    const r = await runProgram(msg.wasm, { args: msg.args, files: msg.files }, { stdin: textStdin(msg.stdin) });
    parentPort!.postMessage({ ok: true, result: r });
  } catch (e) {
    parentPort!.postMessage({ ok: false, message: e instanceof Error ? e.message : String(e) });
  }
});
