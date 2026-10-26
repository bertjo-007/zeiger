/** Quelldateien eines Programms: Dateiname → Inhalt. */
export type SourceFiles = Record<string, string>;

export type Severity = 'error' | 'warning' | 'note';

export interface Diagnostic {
  file: string;
  line: number;
  column: number;
  severity: Severity;
  message: string;
  /** Warnungsgruppe wie `-Wformat`, falls Clang eine nennt. */
  flag?: string;
  /** Originaltext inklusive Codeausschnitt und Markierung. */
  raw: string;
  /** Kommt vom Linker statt vom Compiler (z. B. fehlende Funktion). */
  linker?: boolean;
  /** Ergänzende Hinweise von Clang («note: …»). */
  notes?: Diagnostic[];
}

export interface CompileResult {
  ok: boolean;
  wasm?: Uint8Array;
  /** Ausgabe von `clang -E`, nur bei der Präprozessor-Ansicht. */
  preprocessed?: string;
  stderr: string;
  diagnostics: Diagnostic[];
  /** Der vereinfachte Befehl, wie er auf einem eigenen PC aussähe. */
  command: string;
  ms: number;
}

export interface Frame {
  function: string;
  file?: string;
  line?: number;
}

export type TrapKind =
  | 'bounds'
  | 'null'
  | 'overflow'
  | 'divzero'
  | 'shift'
  | 'unreachable'
  | 'memory'
  | 'stack'
  | 'ub'
  | 'unknown';

export interface TrapInfo {
  kind: TrapKind;
  /** Rohe Meldung der WebAssembly-Laufzeit. */
  message: string;
  /** Grund aus der Debug-Info von Clang, z. B. «Array index out of bounds». */
  reason?: string;
  /** Aufrufkette, innerste Funktion zuerst. Erst nach `locate` gefüllt. */
  frames?: Frame[];
  /** Wasm-Offsets aus dem Stack, für die Zuordnung zu Zeilen. */
  offsets: number[];
  /** Viele gleiche Rahmen: sehr wahrscheinlich zu tiefe Rekursion. */
  recursive?: string;
}

export type MemFinding =
  | { kind: 'leak'; nummer: number; bytes: number }
  | { kind: 'file-open'; name: string }
  | { kind: 'double-free'; fn: string }
  | { kind: 'invalid-free'; fn: string }
  | { kind: 'fclose-null' }
  | { kind: 'incomplete' };

export type StreamName = 'stdout' | 'stderr' | 'stdin';

/** Ein Abschnitt im Terminal, damit stdout, stderr und Eingaben in der richtigen Reihenfolge stehen. */
export interface Segment {
  stream: StreamName;
  text: string;
}

export type EndReason = 'exit' | 'trap' | 'timeout' | 'stopped' | 'output-limit' | 'crash';

export interface RunResult {
  end: EndReason;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  transcript: Segment[];
  trap?: TrapInfo;
  memory: MemFinding[];
  /** Dateien im virtuellen Arbeitsordner nach dem Lauf. */
  files: Record<string, Uint8Array>;
  ms: number;
}

export interface RunOptions {
  args?: string[];
  files?: Record<string, Uint8Array | string>;
  /** Maximale Ausgabe in Bytes, danach wird abgebrochen. */
  outputLimit?: number;
}
