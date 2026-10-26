import { CheckCircle, Lightbulb, Lock, XCircle } from '@phosphor-icons/react';
import { useState } from 'react';
import type { Md } from '../content/types.ts';
import { Problems } from '../editor/OutputPanel.tsx';
import { Inline, Markdown } from '../ui/Markdown.tsx';
import { normalisiereAusgabe, type Pruefung } from './checker.ts';

/** Zeigt erwartete und tatsächliche Ausgabe nebeneinander; abweichende Zeilen sind markiert. */
export function Diff({ erwartet, ist }: { erwartet: string; ist: string }) {
  const a = normalisiereAusgabe(erwartet).split('\n');
  const b = normalisiereAusgabe(ist).split('\n');
  return (
    <div className="diff">
      <div className="diff-col">
        <div className="label">Erwartet</div>
        <pre>
          {a.map((l, i) => (
            <span key={i} className={b[i] === l ? undefined : 'good-line'}>
              {l || ' '}
              {'\n'}
            </span>
          ))}
        </pre>
      </div>
      <div className="diff-col">
        <div className="label">Dein Programm</div>
        <pre>
          {b.length === 1 && b[0] === '' ? (
            <span className="muted">(keine Ausgabe)</span>
          ) : (
            b.map((l, i) => (
              <span key={i} className={a[i] === l ? undefined : 'bad-line'}>
                {l || ' '}
                {'\n'}
              </span>
            ))
          )}
        </pre>
      </div>
    </div>
  );
}

export function PruefungsErgebnis({ pruefung, onJump }: { pruefung: Pruefung; onJump?(line: number, file: string): void }) {
  const fehler = pruefung.compile.diagnostics.filter((d) => d.severity === 'error');
  if (!pruefung.compile.ok) {
    return (
      <div className="stack" style={{ gap: '0.6rem' }}>
        <div className="feedback err">
          <XCircle size={20} weight="fill" />
          <div>
            <span className="fb-title">Dein Code kompiliert noch nicht</span>
            <span>{fehler.length > 0 ? 'Behebe zuerst die Fehler des Compilers. Der erste Fehler ist meistens der wichtigste; spätere sind oft nur Folgefehler.' : 'Der Compiler hat abgebrochen.'}</span>
          </div>
        </div>
        <Problems diagnostics={pruefung.compile.diagnostics} onJump={(line, file) => onJump?.(line, file)} />
      </div>
    );
  }
  const bestanden = pruefung.tests.filter((t) => t.ok).length;
  const warnungen = pruefung.compile.diagnostics.filter((d) => d.severity === 'warning');
  return (
    <div className="stack" style={{ gap: '0.6rem' }}>
      <div className="row" style={{ fontSize: '0.92rem' }}>
        <strong>
          {bestanden} von {pruefung.tests.length} Tests bestanden
        </strong>
        {pruefung.regeln.some((r) => !r.ok) && <span className="chip chip-warn">Vorgabe nicht erfüllt</span>}
        {warnungen.length > 0 && <span className="chip chip-warn">{warnungen.length} Warnung{warnungen.length > 1 ? 'en' : ''}</span>}
      </div>
      {pruefung.regeln
        .filter((r) => !r.ok)
        .map((r, i) => (
          <div key={i} className="feedback err">
            <XCircle size={20} weight="fill" />
            <div>
              <span className="fb-title">Vorgabe</span>
              <Inline text={r.regel.meldung} />
            </div>
          </div>
        ))}
      <div className="test-results">
        {pruefung.tests.map((t, i) => (
          <TestZeile key={i} t={t} offen={!t.ok && pruefung.tests.findIndex((x) => !x.ok) === i} />
        ))}
      </div>
      {warnungen.length > 0 && (
        <details>
          <summary style={{ cursor: 'pointer', fontSize: '0.9rem' }}>Warnungen des Compilers ansehen</summary>
          <Problems diagnostics={warnungen} onJump={(line, file) => onJump?.(line, file)} />
        </details>
      )}
    </div>
  );
}

function TestZeile({ t, offen }: { t: Pruefung['tests'][number]; offen: boolean }) {
  const [auf, setAuf] = useState(offen);
  return (
    <div className="test-result">
      <button type="button" className="test-result-head" style={{ width: '100%', border: 0, background: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={() => setAuf((x) => !x)} aria-expanded={auf}>
        {t.ok ? <CheckCircle size={18} weight="fill" className="ok" /> : <XCircle size={18} weight="fill" className="err" />}
        <Inline text={t.test.name} />
      </button>
      {auf && (
        <div className="test-result-body">
          {t.test.stdin !== undefined && t.test.stdin !== '' && (
            <div>
              <span className="muted">Eingabe: </span>
              <code className="mono">{t.test.stdin.trim().replace(/\n/g, ' ⏎ ')}</code>
            </div>
          )}
          {t.test.args && t.test.args.length > 0 && (
            <div>
              <span className="muted">Argumente: </span>
              <code className="mono">{t.test.args.join(' ')}</code>
            </div>
          )}
          {t.gruende.map((g, i) => (
            <div key={i}>{g}</div>
          ))}
          {t.run && t.test.erwartet.stdout !== undefined && !t.ok && <Diff erwartet={t.test.erwartet.stdout} ist={t.run.stdout} />}
          {t.run && t.test.erwartet.stdout === undefined && !t.ok && (
            <div>
              <div className="field-label" style={{ marginBottom: '0.25rem' }}>
                Ausgabe deines Programms
              </div>
              <pre className="output-block">{t.run.stdout || '(keine Ausgabe)'}</pre>
            </div>
          )}
          {t.ok && t.run && <pre className="output-block">{t.run.stdout || '(keine Ausgabe)'}</pre>}
          {!t.ok && t.test.tipp && (
            <div className="hint">
              <Lightbulb size={18} weight="fill" />
              <Inline text={t.test.tipp} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Gestufte Hinweise. Danach wird die Lösung freigegeben. */
export function Hinweise({ hinweise, gezeigt }: { hinweise: Md[]; gezeigt: number }) {
  if (gezeigt === 0) return null;
  return (
    <div className="hints">
      {hinweise.slice(0, gezeigt).map((h, i) => (
        <div key={i} className="hint">
          <Lightbulb size={18} weight="fill" />
          <div>
            <strong style={{ fontWeight: 620 }}>Hinweis {i + 1}: </strong>
            <Inline text={h} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoesungGesperrt({ grund }: { grund: string }) {
  return (
    <span className="muted row" style={{ fontSize: '0.85rem', gap: '0.3rem' }}>
      <Lock size={14} /> {grund}
    </span>
  );
}

export function Rueckmeldung({ richtig, titel, text, erklaerung }: { richtig: boolean; titel?: string; text?: Md; erklaerung?: Md }) {
  return (
    <div className={`feedback ${richtig ? 'ok' : 'err'}`}>
      {richtig ? <CheckCircle size={20} weight="fill" /> : <XCircle size={20} weight="fill" />}
      <div>
        <span className="fb-title">{titel ?? (richtig ? 'Richtig' : 'Noch nicht richtig')}</span>
        {text && <Markdown text={text} className="prose" />}
        {erklaerung && <Markdown text={erklaerung} className="prose" />}
      </div>
    </div>
  );
}
