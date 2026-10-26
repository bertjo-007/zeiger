/** Executor für die App: Compiler-Worker und Run-Worker. */
import { compiler, runner } from '../compiler/host.ts';
import type { Executor } from './checker.ts';

export const browserExecutor: Executor = {
  compile: (files, options) => compiler.compile(files, options ?? {}),
  run: (wasm, config) =>
    runner.run(wasm, {
      stdin: { mode: 'text', text: config.stdin },
      args: config.args,
      files: config.files,
      timeLimitMs: config.timeLimitMs,
    }).result,
};
