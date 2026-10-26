/**
 * Die sichtbare Befehlszeile des Compilers. Eigene Datei ohne Clang-Import,
 * damit die Oberfläche sie anzeigen kann, ohne Clang ins Hauptbundle zu ziehen.
 */
import type { SourceFiles } from './types.ts';

/** Die Flags, die auch auf einem eigenen PC sinnvoll wären (werden angezeigt). */
export const VISIBLE_FLAGS = ['-std=c17', '-Wall', '-Wextra', '-pedantic', '-g'];

export function sourceNames(files: SourceFiles): string[] {
  return Object.keys(files).filter((f) => f.endsWith('.c'));
}

export function displayCommand(files: SourceFiles): string {
  return ['clang', ...VISIBLE_FLAGS, ...sourceNames(files), '-o', 'programm'].join(' ');
}
