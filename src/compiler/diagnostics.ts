import type { Diagnostic, Severity } from './types.ts';

const HEAD = /^(.+?):(\d+):(\d+): (fatal error|error|warning|note): (.*?)(?: \[(-W[^\],]+)(?:,[^\]]*)?\])?$/;
const LINKER = /^wasm-ld: error: (?:.*?\.o: )?(.*)$/;
const SUMMARY = /^\d+ (warning|error)s? generated\.$|^clang: error: linker command failed/;

function severityOf(s: string): Severity {
  return s === 'fatal error' ? 'error' : (s as Severity);
}

/** Zerlegt die Ausgabe von Clang in einzelne Meldungen. Notizen hängen an der Meldung davor. */
export function parseDiagnostics(stderr: string): Diagnostic[] {
  const result: Diagnostic[] = [];
  let current: Diagnostic | null = null;
  let includedFrom: string[] = [];

  for (const line of stderr.split('\n')) {
    if (line.trim() === '' || SUMMARY.test(line)) {
      current = null;
      continue;
    }
    if (line.startsWith('In file included from')) {
      includedFrom.push(line);
      continue;
    }
    const head = HEAD.exec(line);
    if (head) {
      const diag: Diagnostic = {
        file: head[1].replace(/^\.?\//, ''),
        line: Number(head[2]),
        column: Number(head[3]),
        severity: severityOf(head[4]),
        message: head[5],
        flag: head[6],
        raw: [...includedFrom, line].join('\n'),
      };
      includedFrom = [];
      if (diag.severity === 'note') {
        const parent = result[result.length - 1];
        if (parent) {
          (parent.notes ??= []).push(diag);
          current = diag;
          continue;
        }
      }
      result.push(diag);
      current = diag;
      continue;
    }
    const linker = LINKER.exec(line);
    if (linker) {
      current = { file: '', line: 0, column: 0, severity: 'error', message: linker[1], raw: line, linker: true };
      result.push(current);
      continue;
    }
    if (current) {
      current.raw += '\n' + line;
    }
  }
  return result;
}

export function countBySeverity(diags: Diagnostic[]) {
  return {
    errors: diags.filter((d) => d.severity === 'error').length,
    warnings: diags.filter((d) => d.severity === 'warning').length,
  };
}
