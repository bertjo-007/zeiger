/**
 * Eingabe-Bausteine für die kurzen Aufgabentypen. Kontrolliert: Antwort und
 * Bewertung kommen von aussen. So funktionieren sie in Übungen (sofortige
 * Rückmeldung) und in Tests (Auswertung am Ende) gleich.
 */
import { ArrowDown, ArrowUp, Check, Minus, Plus, X } from '@phosphor-icons/react';
import { Fragment, useMemo } from 'react';
import type { Auswahl, Eingabe, Luecke, Puzzle, Vorhersage, WahrFalsch, Zuordnen } from '../content/types.ts';
import { CodeBlock, OutputBlock } from '../ui/code/CodeBlock.tsx';
import { highlightLines } from '../ui/code/highlight.ts';
import { Inline, Markdown } from '../ui/Markdown.tsx';
import type { Antwort, Bewertung } from './bewerte.ts';

/** Stabile, aber nicht triviale Reihenfolge pro Aufgabe. */
export function mischen<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  // Nie genau die Ausgangsreihenfolge zeigen, sofern es mehr als ein Element gibt.
  if (out.length > 1 && out.every((x, i) => x === items[i])) out.push(out.shift()!);
  return out;
}

interface Props<A, X extends Antwort> {
  aufgabe: A;
  antwort: X;
  setAntwort(a: X): void;
  bewertung?: Bewertung;
  disabled?: boolean;
}

export function AuswahlEingabe({ aufgabe, antwort, setAntwort, bewertung, disabled }: Props<Auswahl, Extract<Antwort, { typ: 'auswahl' }>>) {
  const zeige = bewertung !== undefined;
  return (
    <div className="stack" style={{ gap: '0.75rem' }}>
      <Markdown text={aufgabe.frage} />
      {aufgabe.code && <CodeBlock code={aufgabe.code} numbered copy={false} />}
      {aufgabe.mehrfach && <p className="muted" style={{ fontSize: '0.88rem' }}>Mehrere Antworten können richtig sein.</p>}
      <div className="options" role={aufgabe.mehrfach ? 'group' : 'radiogroup'}>
        {aufgabe.optionen.map((o, i) => {
          const gewaehlt = antwort.gewaehlt.includes(i);
          let cls = 'option' + (aufgabe.mehrfach ? ' multi' : '');
          if (zeige) {
            if (o.richtig) cls += ' correct';
            else if (gewaehlt) cls += ' wrong';
          } else if (gewaehlt) cls += ' selected';
          return (
            <button
              key={i}
              type="button"
              className={cls}
              disabled={disabled || zeige}
              role={aufgabe.mehrfach ? 'checkbox' : 'radio'}
              aria-checked={gewaehlt}
              onClick={() => {
                if (aufgabe.mehrfach) setAntwort({ typ: 'auswahl', gewaehlt: gewaehlt ? antwort.gewaehlt.filter((g) => g !== i) : [...antwort.gewaehlt, i] });
                else setAntwort({ typ: 'auswahl', gewaehlt: [i] });
              }}
            >
              <span className="mark">{zeige ? o.richtig ? <Check size={13} weight="bold" color="var(--ok)" /> : gewaehlt ? <X size={13} weight="bold" color="var(--err)" /> : null : gewaehlt ? <Check size={13} weight="bold" /> : null}</span>
              <span>
                <Inline text={o.text} />
              </span>
              {zeige && o.warum && (gewaehlt || o.richtig) && (
                <span className="option-why">
                  <Inline text={o.warum} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function WahrFalschEingabe({ aufgabe, antwort, setAntwort, bewertung, disabled }: Props<WahrFalsch, Extract<Antwort, { typ: 'wahrfalsch' }>>) {
  const zeige = bewertung !== undefined;
  return (
    <div className="stack" style={{ gap: '0.75rem' }}>
      <Markdown text={aufgabe.aussage} />
      {aufgabe.code && <CodeBlock code={aufgabe.code} numbered copy={false} />}
      <div className="options" role="radiogroup" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {[true, false].map((wert) => {
          const gewaehlt = antwort.wert === wert;
          let cls = 'option';
          if (zeige) {
            if (aufgabe.richtig === wert) cls += ' correct';
            else if (gewaehlt) cls += ' wrong';
          } else if (gewaehlt) cls += ' selected';
          return (
            <button key={String(wert)} type="button" role="radio" aria-checked={gewaehlt} className={cls} disabled={disabled || zeige} onClick={() => setAntwort({ typ: 'wahrfalsch', wert })}>
              <span className="mark">{gewaehlt ? <Check size={13} weight="bold" /> : null}</span>
              <span>{wert ? 'Richtig' : 'Falsch'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TextEingabe({ aufgabe, antwort, setAntwort, bewertung, disabled }: Props<Eingabe, Extract<Antwort, { typ: 'eingabe' }>>) {
  const zeige = bewertung !== undefined;
  return (
    <div className="stack" style={{ gap: '0.75rem' }}>
      <Markdown text={aufgabe.frage} />
      {aufgabe.code && <CodeBlock code={aufgabe.code} numbered copy={false} />}
      <div className="field">
        <label className="field-label" htmlFor={`in-${aufgabe.id}`}>
          Deine Antwort
        </label>
        <input
          id={`in-${aufgabe.id}`}
          className={`input mono${zeige ? (bewertung.richtig ? ' gap-input correct' : ' gap-input wrong') : ''}`}
          style={{ height: 'auto' }}
          value={antwort.text}
          disabled={disabled || zeige}
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => setAntwort({ typ: 'eingabe', text: e.target.value })}
        />
      </div>
      {zeige && !bewertung.richtig && (
        <p style={{ fontSize: '0.92rem' }}>
          Richtig wäre: <code className="mono">{aufgabe.antworten[0]}</code>
        </p>
      )}
    </div>
  );
}

export function VorhersageEingabe({ aufgabe, antwort, setAntwort, bewertung, disabled }: Props<Vorhersage, Extract<Antwort, { typ: 'vorhersage' }>>) {
  const zeige = bewertung !== undefined;
  return (
    <div className="stack" style={{ gap: '0.75rem' }}>
      <Markdown text={aufgabe.frage ?? 'Was gibt dieses Programm aus? Schreibe die Ausgabe genau so, wie sie im Terminal erscheint.'} />
      <CodeBlock code={aufgabe.code} numbered copy={false} />
      {aufgabe.stdin && (
        <p className="muted" style={{ fontSize: '0.88rem' }}>
          Eingabe beim Ausführen: <code className="mono">{aufgabe.stdin.trim().replace(/\n/g, ' ⏎ ')}</code>
        </p>
      )}
      <div className="field">
        <label className="field-label" htmlFor={`vh-${aufgabe.id}`}>
          Deine Vorhersage
        </label>
        <textarea
          id={`vh-${aufgabe.id}`}
          className="textarea"
          rows={Math.max(2, aufgabe.ausgabe.split('\n').length)}
          value={antwort.text}
          disabled={disabled || zeige}
          spellCheck={false}
          onChange={(e) => setAntwort({ typ: 'vorhersage', text: e.target.value })}
        />
      </div>
      {zeige && (
        <div>
          <div className="field-label" style={{ marginBottom: '0.3rem' }}>
            Tatsächliche Ausgabe
          </div>
          <OutputBlock text={aufgabe.ausgabe} stdin={aufgabe.stdin} />
        </div>
      )}
    </div>
  );
}

const BUCHSTABEN = 'ABCDEFGHIJKLMNOP';

export function ZuordnenEingabe({ aufgabe, antwort, setAntwort, bewertung, disabled }: Props<Zuordnen, Extract<Antwort, { typ: 'zuordnen' }>>) {
  const zeige = bewertung !== undefined;
  // Rechte Seite gemischt; der Wert jeder Auswahl ist der echte Index des Paars.
  const rechts = useMemo(() => mischen(aufgabe.paare.map((p, i) => ({ text: p.rechts, i })), aufgabe.id), [aufgabe]);
  const buchstabe = (i: number) => BUCHSTABEN[rechts.findIndex((r) => r.i === i)];
  return (
    <div className="stack" style={{ gap: '0.75rem' }}>
      <Markdown text={aufgabe.frage} />
      <div className="match-grid">
        <div className="match-col">
          {aufgabe.paare.map((p, i) => {
            const ok = bewertung?.teile?.[i];
            return (
              <label key={i} className={`match-item${zeige ? (ok ? ' correct' : ' wrong') : antwort.zuordnung[i] !== null ? ' paired' : ''}`} style={{ cursor: 'default' }}>
                <span style={{ flex: 1 }}>
                  <Inline text={p.links} />
                </span>
                <select
                  className="select mono"
                  style={{ width: '4.2rem', minHeight: 32, padding: '0 0.4rem' }}
                  aria-label={`Zuordnung für ${p.links.replace(/`/g, '')}`}
                  value={antwort.zuordnung[i] ?? ''}
                  disabled={disabled || zeige}
                  onChange={(e) => {
                    const next = antwort.zuordnung.slice();
                    next[i] = e.target.value === '' ? null : Number(e.target.value);
                    setAntwort({ typ: 'zuordnen', zuordnung: next });
                  }}
                >
                  <option value="">?</option>
                  {rechts.map((r, j) => (
                    <option key={r.i} value={r.i}>
                      {BUCHSTABEN[j]}
                    </option>
                  ))}
                </select>
                {zeige && !ok && <span className="match-tag">{buchstabe(i)}</span>}
              </label>
            );
          })}
        </div>
        <div className="match-col">
          {rechts.map((r, j) => (
            <div key={r.i} className="match-item" style={{ cursor: 'default' }}>
              <span className="match-tag">{BUCHSTABEN[j]}</span>
              <span>
                <Inline text={r.text} />
              </span>
            </div>
          ))}
        </div>
      </div>
      {zeige && !bewertung.richtig && <p className="muted" style={{ fontSize: '0.88rem' }}>Bei falschen Zuordnungen steht rechts der richtige Buchstabe.</p>}
    </div>
  );
}

export function LueckeEingabe({ aufgabe, antwort, setAntwort, bewertung, disabled }: Props<Luecke, Extract<Antwort, { typ: 'luecke' }>>) {
  const zeige = bewertung !== undefined;
  // Code in Stücke zerlegen: Text, Lücke, Text, …
  const teile = useMemo(() => aufgabe.code.replace(/\n$/, '').split(/__(\d+)__/), [aufgabe.code]);
  const textHtml = (text: string, key: number) => {
    const lines = highlightLines(text);
    return (
      <Fragment key={key}>
        {lines.map((line, li) => (
          <Fragment key={li}>
            {li > 0 && '\n'}
            {line.map((s, si) => (s.cls ? <span key={si} className={s.cls}>{s.text}</span> : s.text))}
          </Fragment>
        ))}
      </Fragment>
    );
  };
  return (
    <div className="stack" style={{ gap: '0.75rem' }}>
      <Markdown text={aufgabe.frage} />
      <pre className="gap-code">
        {teile.map((t, i) => {
          if (i % 2 === 0) return textHtml(t, i);
          const nr = Number(t) - 1;
          const ok = bewertung?.teile?.[nr];
          const breite = Math.max(4, ...aufgabe.luecken[nr].map((x) => x.length)) + 1;
          return (
            <input
              key={i}
              className={`gap-input${zeige ? (ok ? ' correct' : ' wrong') : ''}`}
              style={{ width: `${breite + 1}ch` }}
              value={antwort.werte[nr] ?? ''}
              disabled={disabled || zeige}
              aria-label={`Lücke ${nr + 1}`}
              spellCheck={false}
              autoComplete="off"
              onChange={(e) => {
                const next = antwort.werte.slice();
                next[nr] = e.target.value;
                setAntwort({ typ: 'luecke', werte: next });
              }}
            />
          );
        })}
      </pre>
      {zeige && !bewertung.richtig && (
        <div style={{ fontSize: '0.92rem' }}>
          Richtig wäre:{' '}
          {aufgabe.luecken.map((l, i) => (
            <span key={i}>
              {i > 0 && ', '}
              Lücke {i + 1}: <code className="mono">{l[0]}</code>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function PuzzleEingabe({ aufgabe, antwort, setAntwort, bewertung, disabled }: Props<Puzzle, Extract<Antwort, { typ: 'puzzle' }>>) {
  const zeige = bewertung !== undefined;
  const alle = useMemo(() => mischen([...aufgabe.zeilen, ...(aufgabe.ablenker ?? [])].map((text, i) => ({ text, key: i })), aufgabe.id), [aufgabe]);
  // Bereits verwendete Zeilen (bei gleichen Zeilen zählt die Anzahl).
  const verwendet = new Map<string, number>();
  for (const z of antwort.reihenfolge) verwendet.set(z, (verwendet.get(z) ?? 0) + 1);
  const rest: { text: string; key: number }[] = [];
  const zaehler = new Map(verwendet);
  for (const z of alle) {
    const n = zaehler.get(z.text) ?? 0;
    if (n > 0) zaehler.set(z.text, n - 1);
    else rest.push(z);
  }
  const setze = (r: string[]) => setAntwort({ typ: 'puzzle', reihenfolge: r });
  return (
    <div className="puzzle">
      <Markdown text={aufgabe.frage} />
      <div>
        <div className="field-label" style={{ marginBottom: '0.35rem' }}>
          Dein Programm
        </div>
        <div className="puzzle-list" aria-label="Dein Programm">
          {antwort.reihenfolge.length === 0 && <span className="muted" style={{ fontSize: '0.88rem', padding: '0.4rem' }}>Klicke unten auf die Zeilen in der richtigen Reihenfolge.</span>}
          {antwort.reihenfolge.map((z, i) => (
            <div key={i} className={`puzzle-line${zeige ? (bewertung.teile?.[i] ? ' correct' : ' wrong') : ''}`}>
              <code>{z}</code>
              {!zeige && !disabled && (
                <>
                  <button type="button" className="btn btn-ghost btn-sm btn-icon" aria-label="Nach oben" disabled={i === 0} onClick={() => setze(antwort.reihenfolge.map((x, j) => (j === i - 1 ? z : j === i ? antwort.reihenfolge[i - 1] : x)))}>
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-icon"
                    aria-label="Nach unten"
                    disabled={i === antwort.reihenfolge.length - 1}
                    onClick={() => setze(antwort.reihenfolge.map((x, j) => (j === i + 1 ? z : j === i ? antwort.reihenfolge[i + 1] : x)))}
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm btn-icon" aria-label="Entfernen" onClick={() => setze(antwort.reihenfolge.filter((_, j) => j !== i))}>
                    <Minus size={14} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {!zeige && (
        <div>
          <div className="field-label" style={{ marginBottom: '0.35rem' }}>
            Verfügbare Zeilen{aufgabe.ablenker?.length ? ' (nicht alle gehören dazu)' : ''}
          </div>
          <div className="puzzle-list" style={{ borderStyle: 'solid' }}>
            {rest.length === 0 && <span className="muted" style={{ fontSize: '0.88rem', padding: '0.4rem' }}>Alle Zeilen verwendet.</span>}
            {rest.map((z) => (
              <div key={z.key} className="puzzle-line">
                <code>{z.text}</code>
                <button type="button" className="btn btn-ghost btn-sm btn-icon" aria-label="Hinzufügen" disabled={disabled} onClick={() => setze([...antwort.reihenfolge, z.text])}>
                  <Plus size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {zeige && !bewertung.richtig && (
        <div>
          <div className="field-label" style={{ marginBottom: '0.35rem' }}>
            Richtige Reihenfolge
          </div>
          <CodeBlock code={aufgabe.zeilen.join('\n') + '\n'} numbered copy={false} />
        </div>
      )}
    </div>
  );
}
