/**
 * Syntaxhervorhebung für C. Dieselbe Grammatik (Lezer) und dieselben Klassen
 * wie im Editor, damit statischer Code und Editor gleich aussehen.
 */
import { cppLanguage } from '@codemirror/lang-cpp';
import { highlightCode, tagHighlighter, tags as t } from '@lezer/highlight';

export const classHighlighter = tagHighlighter([
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.modifier, t.bool, t.null, t.self], class: 'tok-keyword' },
  { tag: [t.typeName, t.standard(t.typeName), t.className, t.namespace], class: 'tok-type' },
  { tag: [t.string, t.character, t.special(t.string), t.escape], class: 'tok-string' },
  { tag: [t.number, t.integer, t.float], class: 'tok-number' },
  { tag: [t.comment, t.lineComment, t.blockComment], class: 'tok-comment' },
  { tag: [t.processingInstruction, t.meta, t.macroName, t.special(t.variableName)], class: 'tok-pre' },
  { tag: [t.function(t.variableName), t.function(t.definition(t.variableName)), t.function(t.propertyName)], class: 'tok-func' },
  { tag: [t.operator, t.derefOperator, t.arithmeticOperator, t.logicOperator, t.bitwiseOperator, t.compareOperator, t.updateOperator], class: 'tok-op' },
]);

export interface Span {
  text: string;
  cls: string;
}

/** Zerlegt Code in Zeilen aus gefärbten Abschnitten. */
export function highlightLines(code: string): Span[][] {
  const source = code.replace(/\n$/, '');
  const tree = cppLanguage.parser.parse(source);
  const lines: Span[][] = [[]];
  highlightCode(
    source,
    tree,
    classHighlighter,
    (text, cls) => lines[lines.length - 1].push({ text, cls }),
    () => lines.push([]),
  );
  return lines;
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Für Markdown: Code als HTML mit gefärbten Abschnitten (ohne Zeilennummern). */
export function highlightHtml(code: string): string {
  return highlightLines(code)
    .map((line) => `<span class="ln">${line.map((s) => (s.cls ? `<span class="${s.cls}">${escapeHtml(s.text)}</span>` : escapeHtml(s.text))).join('') || ' '}</span>`)
    .join('');
}
