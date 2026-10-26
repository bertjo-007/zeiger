/** Nachrichten zwischen Haupt-Thread und den beiden Workern. */
import type { CompileResult, Frame, RunOptions, RunResult, Segment, SourceFiles } from './types.ts';

export interface CompileRequestOptions {
  preprocess?: string;
  extraFlags?: string[];
  hiddenFiles?: SourceFiles;
}

export type ClangRequest =
  | { type: 'warmup'; id: number }
  | { type: 'compile'; id: number; files: SourceFiles; options: CompileRequestOptions }
  | { type: 'locate'; id: number; wasm: Uint8Array; offsets: number[] };

export type ClangResponse =
  | { type: 'progress'; done: number; total: number }
  | { type: 'ready'; id: number }
  | { type: 'compiled'; id: number; result: CompileResult }
  | { type: 'located'; id: number; frames: Frame[]; reason?: string }
  | { type: 'failed'; id: number; message: string };

export type RunRequest = {
  type: 'run';
  id: number;
  wasm: Uint8Array;
  options: RunOptions;
  /** Gesetzt: interaktive Eingabe über diesen Puffer. Sonst gilt `stdinText`. */
  stdinBuffer?: SharedArrayBuffer;
  stdinText?: string;
};

export type RunResponse =
  | { type: 'output'; id: number; segments: Segment[] }
  | { type: 'need-input'; id: number }
  | { type: 'input-received'; id: number }
  | { type: 'done'; id: number; result: RunResult }
  | { type: 'failed'; id: number; message: string };
