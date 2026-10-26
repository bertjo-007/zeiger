import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BracketsCurly,
  CheckCircle,
  CheckSquare,
  Clock,
  Code,
  Flag,
  ListChecks,
  ListNumbers,
  PencilSimpleLine,
  Target,
  Terminal,
  WarningCircle,
  XCircle,
} from '@phosphor-icons/react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { findeLektion, nachbarn } from '../../content/kurs.ts';
import { REFERENZ } from '../../content/referenz/index.ts';
import type { Lektion } from '../../content/types.ts';
import { AufgabeKarte } from '../../exercises/AufgabeKarte.tsx';
import { dateienAus } from '../../exercises/checker.ts';
import { besucheLektion, setzeLektionAbgeschlossen } from '../../progress/actions.ts';
import { CodeBeispiel } from '../CodeBeispiel.tsx';
import { CodeBlock, OutputBlock, parseLines } from '../code/CodeBlock.tsx';
import { useAufgabeStaende, useLektionStaende } from '../hooks.ts';
import { Inline, Markdown } from '../Markdown.tsx';
import { NotFound } from './NotFound.tsx';

const TEILE = [
  { id: 'ziel', titel: 'Lernziel', icon: Target, art: '' },
  { id: 'erklaerung', titel: 'Erklärung', icon: BookOpen, art: '' },
  { id: 'syntax', titel: 'Syntax', icon: BracketsCurly, art: 'code' },
  { id: 'beispiel', titel: 'Codebeispiel', icon: Code, art: 'code' },
  { id: 'zeilen', titel: 'Zeile für Zeile', icon: ListNumbers, art: 'code' },
  { id: 'ergebnis', titel: 'Ergebnis', icon: Terminal, art: 'code' },
  { id: 'fehler', titel: 'Häufige Fehler', icon: WarningCircle, art: 'warn' },
  { id: 'uebungen', titel: 'Übungen', icon: PencilSimpleLine, art: 'practice' },
  { id: 'wissenscheck', titel: 'Wissenscheck', icon: CheckSquare, art: 'check' },
  { id: 'zusammenfassung', titel: 'Zusammenfassung', icon: ListChecks, art: '' },
] as const;

function Teil({ id, children, untertitel }: { id: (typeof TEILE)[number]['id']; children: ReactNode; untertitel?: string }) {
  const t = TEILE.find((x) => x.id === id)!;
  const nr = TEILE.indexOf(t) + 1;
  const Icon = t.icon;
  return (
    <section id={id} className="lesson-section" aria-labelledby={`h-${id}`}>
      <div className="section-head">
        <span className={`section-icon ${t.art}`}>
          <Icon size={18} weight="bold" />
        </span>
        <div>
          <div className="section-kind">
            {nr}. Teil{untertitel ? `: ${untertitel}` : ''}
          </div>
          <h2 id={`h-${id}`}>{t.titel}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function useAktiverTeil() {
  const [aktiv, setAktiv] = useState<string>('ziel');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const sichtbar = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (sichtbar[0]) setAktiv(sichtbar[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );
    for (const t of TEILE) {
      const el = document.getElementById(t.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);
  return aktiv;
}

function ZeilenErklaerung({ lektion }: { lektion: Lektion }) {
  const [hl, setHl] = useState<string | undefined>();
  const dateien = dateienAus(lektion.beispiel.code);
  const name = Object.keys(dateien)[0];
  return (
    <div className="stack">
      <CodeBlock code={dateien[name]} numbered highlight={parseLines(hl)} title={Object.keys(dateien).length > 1 ? name : undefined} copy={false} />
      <dl className="line-notes">
        {lektion.zeilen.map((z, i) => (
          <div key={i} className="line-note" onMouseEnter={() => setHl(z.zeilen)} onMouseLeave={() => setHl(undefined)} onFocus={() => setHl(z.zeilen)} tabIndex={0}>
            <dt>
              {/[-,]/.test(z.zeilen) ? 'Zeilen' : 'Zeile'} {z.zeilen.replace(/-/g, ' bis ').replace(/,/g, ', ')}
            </dt>
            <dd>
              <Markdown text={z.text} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function LektionPage() {
  const { id = '' } = useParams();
  const hit = findeLektion(id);
  const staende = useLektionStaende();
  const aufgaben = useAufgabeStaende();
  const aktiv = useAktiverTeil();

  useEffect(() => {
    if (hit) void besucheLektion(id);
  }, [id, hit]);

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
    else document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
  }, [id]);

  const referenz = useMemo(() => (hit?.lektion.referenz ?? []).map((r) => REFERENZ.find((x) => x.id === r)).filter((x) => x !== undefined), [hit]);

  if (!hit) return <NotFound />;
  const { lektion: l, kapitel: k } = hit;
  const { vorher, nachher } = nachbarn(id);
  const fertig = !!staende.get(id)?.abgeschlossen;
  const uebGeloest = l.uebungen.filter((u) => aufgaben.get(u.id)?.geloest).length;
  const checkBeantwortet = l.wissenscheck.filter((u) => (aufgaben.get(u.id)?.versuche ?? 0) > 0).length;
  const checkRichtig = l.wissenscheck.filter((u) => aufgaben.get(u.id)?.geloest).length;

  return (
    <div className="lesson-layout">
      <article>
        <header className="lesson-head">
          <div className="lesson-meta">
            <Link to={`/kapitel/${k.id}`}>
              Kapitel {k.nr}: {k.titel}
            </Link>
            <span className="row" style={{ gap: '0.3rem' }}>
              <Clock size={14} /> etwa {l.dauer} Minuten
            </span>
            {fertig && (
              <span className="chip chip-ok">
                <CheckCircle size={14} weight="fill" /> abgeschlossen
              </span>
            )}
          </div>
          <h1>{l.titel}</h1>
        </header>

        <Teil id="ziel">
          <p style={{ marginBottom: '0.75rem', color: 'var(--text-2)' }}>Nach dieser Lektion kannst du:</p>
          <ul className="goal-list">
            {l.lernziele.map((z, i) => (
              <li key={i}>
                <Target size={16} />
                <span>
                  <Inline text={z} />
                </span>
              </li>
            ))}
          </ul>
        </Teil>

        <Teil id="erklaerung">
          <Markdown text={l.erklaerung} />
        </Teil>

        <Teil id="syntax">
          <div className="stack">
            {l.syntax.map((s, i) => (
              <div key={i} className="stack" style={{ gap: '0.5rem' }}>
                <CodeBlock code={s.code} copy={false} />
                {s.text && <Markdown text={s.text} />}
              </div>
            ))}
          </div>
        </Teil>

        <Teil id="beispiel" untertitel={l.beispiel.ausschnitt ? 'Ausschnitt' : 'zum Ausprobieren'}>
          <CodeBeispiel beispiel={l.beispiel} speicher={`${l.id}:beispiel`} titel={`Beispiel zu ${l.titel}`} />
        </Teil>

        <Teil id="zeilen">
          <ZeilenErklaerung lektion={l} />
        </Teil>

        <Teil id="ergebnis">
          <div className="stack">
            {l.beispiel.ausgabe !== undefined && (
              <div>
                <div className="field-label" style={{ marginBottom: '0.35rem' }}>
                  {l.beispiel.stdin ? 'Ausgabe im Terminal (hervorgehoben: deine Eingabe)' : 'Ausgabe im Terminal'}
                </div>
                <OutputBlock text={l.beispiel.ausgabe} stdin={l.beispiel.stdin} />
              </div>
            )}
            <Markdown text={l.ergebnis} />
          </div>
        </Teil>

        <Teil id="fehler">
          <div className="mistakes">
            {l.fehler.map((f, i) => (
              <div key={i} className="mistake">
                <div className="mistake-title">
                  <WarningCircle size={18} weight="fill" /> <Inline text={f.titel} />
                </div>
                <Markdown text={f.text} />
                {(f.falsch || f.richtig) && (
                  <div className="compare">
                    {f.falsch && (
                      <div>
                        <div className="compare-label bad">
                          <XCircle size={14} weight="fill" /> So nicht
                        </div>
                        <CodeBlock code={f.falsch} copy={false} />
                      </div>
                    )}
                    {f.richtig && (
                      <div>
                        <div className="compare-label good">
                          <CheckCircle size={14} weight="fill" /> So richtig
                        </div>
                        <CodeBlock code={f.richtig} copy={false} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Teil>

        <Teil id="uebungen" untertitel={`${uebGeloest} von ${l.uebungen.length} gelöst`}>
          {l.uebungen.map((a, i) => (
            <AufgabeKarte key={a.id} aufgabe={a} quelle="uebung" titel={`Übung ${i + 1}${a.titel ? `: ${a.titel}` : ''}`} kompakt />
          ))}
        </Teil>

        <Teil id="wissenscheck" untertitel={`${checkRichtig} von ${l.wissenscheck.length} richtig`}>
          {l.wissenscheck.map((a, i) => (
            <AufgabeKarte key={a.id} aufgabe={a} quelle="check" titel={`Frage ${i + 1}`} />
          ))}
        </Teil>

        <Teil id="zusammenfassung">
          <ul className="summary-list">
            {l.zusammenfassung.map((z, i) => (
              <li key={i}>
                <CheckCircle size={16} />
                <span>
                  <Inline text={z} />
                </span>
              </li>
            ))}
          </ul>
          {referenz.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <div className="field-label" style={{ marginBottom: '0.4rem' }}>
                In der Befehlsbibliothek
              </div>
              <div className="row">
                {referenz.map((r) => (
                  <Link key={r.id} to={`/bibliothek/${r.id}`} className="chip chip-accent mono" style={{ textDecoration: 'none' }}>
                    {r.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="lesson-foot">
            <div className="row" style={{ fontSize: '0.92rem', color: 'var(--text-2)' }}>
              <span>
                Übungen gelöst: {uebGeloest}/{l.uebungen.length}
              </span>
              <span>·</span>
              <span>
                Wissenscheck beantwortet: {checkBeantwortet}/{l.wissenscheck.length}
              </span>
            </div>
            <div className="row">
              {fertig ? (
                <>
                  <span className="chip chip-ok">
                    <CheckCircle size={14} weight="fill" /> Lektion abgeschlossen
                  </span>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => void setzeLektionAbgeschlossen(id, false)}>
                    Wieder als offen markieren
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => void setzeLektionAbgeschlossen(id, true)}>
                  <Flag size={16} /> Lektion abschliessen
                </button>
              )}
              {checkBeantwortet < l.wissenscheck.length && !fertig && <span className="muted" style={{ fontSize: '0.85rem' }}>Tipp: Beantworte vorher den Wissenscheck.</span>}
            </div>
          </div>
          <nav className="pager" aria-label="Weitere Lektionen">
            {vorher ? (
              <Link to={`/lektion/${vorher.id}`}>
                <span className="muted row" style={{ gap: '0.3rem' }}>
                  <ArrowLeft size={14} /> Vorherige Lektion
                </span>
                <span>{vorher.titel}</span>
              </Link>
            ) : (
              <span />
            )}
            {nachher ? (
              <Link to={`/lektion/${nachher.id}`} className="next">
                <span className="muted row" style={{ gap: '0.3rem', justifyContent: 'flex-end' }}>
                  Nächste Lektion <ArrowRight size={14} />
                </span>
                <span>{nachher.titel}</span>
              </Link>
            ) : (
              <Link to={`/test/${k.id}`} className="next">
                <span className="muted row" style={{ gap: '0.3rem', justifyContent: 'flex-end' }}>
                  Zum Abschluss <ArrowRight size={14} />
                </span>
                <span>Kapiteltest</span>
              </Link>
            )}
          </nav>
        </Teil>
      </article>
      <nav className="toc" aria-label="Auf dieser Seite">
        <div className="toc-title">Auf dieser Seite</div>
        {TEILE.map((t) => {
          const Icon = t.icon;
          return (
            <a key={t.id} href={`#${t.id}`} className={aktiv === t.id ? 'active' : undefined} onClick={(e) => {
              e.preventDefault();
              document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth' });
              history.replaceState(null, '', `#${t.id}`);
            }}>
              <Icon size={15} /> {t.titel}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
