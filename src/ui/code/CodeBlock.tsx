import { Check, Copy } from '@phosphor-icons/react';
import { useMemo, useState, type ReactNode } from 'react';
import { highlightLines } from './highlight.ts';

/** Zeilenangaben wie "3", "5-7" oder "2,4" in eine Menge von Zeilennummern übersetzen. */
export function parseLines(spec: string | undefined): Set<number> {
  const set = new Set<number>();
  for (const part of (spec ?? '').split(',')) {
    const m = /^\s*(\d+)\s*(?:-\s*(\d+))?\s*$/.exec(part);
    if (!m) continue;
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    for (let i = a; i <= b; i++) set.add(i);
  }
  return set;
}

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        });
      }}
    >
      {done ? <Check size={15} /> : <Copy size={15} />}
      {done ? 'Kopiert' : 'Kopieren'}
    </button>
  );
}

interface Props {
  code: string;
  title?: ReactNode;
  numbered?: boolean;
  highlight?: Set<number>;
  actions?: ReactNode;
  copy?: boolean;
}

/** Gefärbter, nicht bearbeitbarer Code mit optionalen Zeilennummern. */
export function CodeBlock({ code, title, numbered = false, highlight, actions, copy = true }: Props) {
  const lines = useMemo(() => highlightLines(code), [code]);
  const hasHead = title !== undefined || actions !== undefined || copy;
  return (
    <div className={`codeblock${numbered ? ' numbered' : ''}`}>
      {hasHead && (
        <div className="codeblock-head">
          <span className="mono">{title}</span>
          <span className="spacer" />
          {actions}
          {copy && <CopyButton text={code} />}
        </div>
      )}
      <pre>
        <code>
          {lines.map((line, i) => (
            <span key={i} className={`ln${highlight?.has(i + 1) ? ' hl' : ''}`} data-n={i + 1}>
              {line.length === 0 ? ' ' : line.map((s, j) => (s.cls ? <span key={j} className={s.cls}>{s.text}</span> : s.text))}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/** Programmausgabe (z. B. «Ergebnis»). Eingaben aus stdin sind hervorgehoben, wenn sie bekannt sind. */
export function OutputBlock({ text, stdin }: { text: string; stdin?: string }) {
  const parts = useMemo(() => markInput(text, stdin), [text, stdin]);
  return (
    <pre className="output-block">
      {parts.map((p, i) => (p.input ? <span key={i} className="stdin-echo">{p.text}</span> : p.text))}
    </pre>
  );
}

/** Markiert in einer Terminal-Ausgabe die Zeilen aus stdin, der Reihe nach. */
function markInput(text: string, stdin: string | undefined): { text: string; input: boolean }[] {
  if (!stdin) return [{ text, input: false }];
  const inputs = stdin.split('\n').filter((l) => l.length > 0);
  const out: { text: string; input: boolean }[] = [];
  let rest = text;
  for (const line of inputs) {
    const idx = rest.indexOf(line + '\n');
    if (idx < 0) break;
    out.push({ text: rest.slice(0, idx), input: false }, { text: line, input: true });
    rest = rest.slice(idx + line.length);
  }
  out.push({ text: rest, input: false });
  return out;
}
