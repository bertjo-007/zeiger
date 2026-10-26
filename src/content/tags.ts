/**
 * Template-Tags für Inhalte.
 *
 * - `c` für C-Code: Backslashes bleiben erhalten (`"\n"` steht als zwei Zeichen
 *   im Code), gemeinsame Einrückung wird entfernt, am Ende steht ein Zeilenumbruch.
 * - `md` für Markdown: dasselbe ohne abschliessenden Zeilenumbruch. Inline-Code
 *   schreibt man als \`code\`; Codeblöcke innerhalb von Markdown mit ~~~c … ~~~.
 */

export function dedent(text: string): string {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  if (lines.length > 0 && lines[0].trim() === '') lines.shift();
  if (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
  const indents = lines.filter((l) => l.trim() !== '').map((l) => /^ */.exec(l)![0].length);
  const indent = indents.length > 0 ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(indent).replace(/\s+$/, '')).join('\n');
}

function raw(strings: TemplateStringsArray, values: unknown[]): string {
  return String.raw({ raw: strings.raw }, ...values).replace(/\\`/g, '`');
}

export function md(strings: TemplateStringsArray, ...values: unknown[]): string {
  return dedent(raw(strings, values));
}

export function c(strings: TemplateStringsArray, ...values: unknown[]): string {
  return dedent(raw(strings, values)) + '\n';
}

/** Ausgabe eines Programms (wie im Terminal), ohne Einrückung und mit abschliessendem Zeilenumbruch. */
export function out(strings: TemplateStringsArray, ...values: unknown[]): string {
  return dedent(raw(strings, values)) + '\n';
}
