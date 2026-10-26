import { useCallback, useEffect, useRef, useState } from 'react';
import { compiler, interactiveInputAvailable, runner, type RunSession } from '../compiler/host.ts';
import type { CompileResult, RunResult, Segment, SourceFiles } from '../compiler/types.ts';

export type Phase = 'idle' | 'compiling' | 'running' | 'done';

export interface RunState {
  phase: Phase;
  compile?: CompileResult;
  transcript: Segment[];
  waiting: boolean;
  interactive: boolean;
  result?: RunResult;
  /** Ausgabe von clang -E, wenn die Präprozessor-Ansicht angefordert wurde. */
  preprocessed?: { file: string; text: string; ok: boolean; stderr: string };
  error?: string;
}

export interface RunOptions {
  stdinMode: 'interaktiv' | 'vorab';
  stdinText: string;
  args: string[];
  dataFiles: Record<string, string>;
  timeLimitMs: number;
  /** Zusätzliche Compiler-Optionen (Test-Harness). */
  extraFlags?: string[];
  hiddenFiles?: SourceFiles;
}

const initial: RunState = { phase: 'idle', transcript: [], waiting: false, interactive: false };

function append(transcript: Segment[], segments: Segment[]): Segment[] {
  const next = transcript.slice();
  for (const s of segments) {
    const tail = next[next.length - 1];
    if (tail && tail.stream === s.stream) next[next.length - 1] = { stream: s.stream, text: tail.text + s.text };
    else next.push({ ...s });
  }
  return next;
}

export function useRunner() {
  const [state, setState] = useState<RunState>(initial);
  const session = useRef<RunSession | null>(null);
  const generation = useRef(0);

  useEffect(
    () => () => {
      session.current?.stop();
    },
    [],
  );

  const run = useCallback(async (files: SourceFiles, opts: RunOptions): Promise<{ compile: CompileResult; result?: RunResult } | undefined> => {
    session.current?.stop();
    const gen = ++generation.current;
    setState({ ...initial, phase: 'compiling' });
    let compile: CompileResult;
    try {
      compile = await compiler.compile(files, { extraFlags: opts.extraFlags, hiddenFiles: opts.hiddenFiles });
    } catch (e) {
      if (gen === generation.current) setState({ ...initial, phase: 'done', error: e instanceof Error ? e.message : String(e) });
      return undefined;
    }
    if (gen !== generation.current) return undefined;
    if (!compile.ok || !compile.wasm) {
      setState({ ...initial, phase: 'done', compile });
      return { compile };
    }
    const interactive = opts.stdinMode === 'interaktiv' && interactiveInputAvailable();
    setState({ ...initial, phase: 'running', compile, interactive });
    const s = runner.run(
      compile.wasm,
      {
        stdin: interactive ? { mode: 'interactive' } : { mode: 'text', text: opts.stdinText },
        args: opts.args,
        files: opts.dataFiles,
        timeLimitMs: opts.timeLimitMs,
      },
      {
        onOutput: (segments) => {
          if (gen === generation.current) setState((st) => ({ ...st, transcript: append(st.transcript, segments) }));
        },
        onWaiting: (waiting) => {
          if (gen === generation.current) setState((st) => ({ ...st, waiting }));
        },
      },
    );
    session.current = s;
    const result = await s.result;
    if (gen === generation.current) {
      session.current = null;
      setState((st) => ({ ...st, phase: 'done', waiting: false, result, transcript: result.transcript.length >= st.transcript.length ? result.transcript : st.transcript }));
    }
    return { compile, result };
  }, []);

  const stop = useCallback(() => session.current?.stop(), []);
  const sendLine = useCallback((text: string) => session.current?.sendLine(text), []);
  const sendEof = useCallback(() => session.current?.sendEof(), []);

  const preprocess = useCallback(async (files: SourceFiles, file: string) => {
    const r = await compiler.compile(files, { preprocess: file });
    setState((st) => ({ ...st, preprocessed: { file, text: r.preprocessed ?? '', ok: r.ok, stderr: r.stderr } }));
  }, []);

  const reset = useCallback(() => {
    session.current?.stop();
    generation.current++;
    setState(initial);
  }, []);

  return { state, run, stop, sendLine, sendEof, preprocess, reset };
}
