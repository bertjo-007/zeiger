import { ArrowRight, CheckCircle, Repeat, Shuffle, Target } from '@phosphor-icons/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { findeAufgabe, themaName } from '../../content/kurs.ts';
import type { Aufgabe } from '../../content/types.ts';
import { AufgabeKarte } from '../../exercises/AufgabeKarte.tsx';
import { db } from '../../progress/db.ts';
import { themenStatistik } from '../../progress/stats.ts';
import { useEreignisse } from '../hooks.ts';

type Modus = 'faellig' | 'schwaechen' | 'gemischt';
const SITZUNG = 12;

const MODI: { id: Modus; titel: string; text: string; icon: typeof Repeat }[] = [
  { id: 'faellig', titel: 'Fällige Fragen', text: 'Was laut Wiederholungsplan heute dran ist.', icon: Repeat },
  { id: 'schwaechen', titel: 'Schwächen trainieren', text: 'Fragen zu Themen, die noch nicht sitzen.', icon: Target },
  { id: 'gemischt', titel: 'Gemischt', text: 'Querbeet durch alles Bisherige, auch Beherrschtes.', icon: Shuffle },
];

function mische<T>(xs: T[]): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function WiederholenPage() {
  const [params, setParams] = useSearchParams();
  const modus = (params.get('modus') as Modus) ?? 'faellig';
  const karten = useLiveQuery(() => db.karten.toArray(), []) ?? [];
  const ereignisse = useEreignisse();
  const [sitzung, setSitzung] = useState<Aufgabe[] | null>(null);
  const [pos, setPos] = useState(0);
  const [ergebnisse, setErgebnisse] = useState<boolean[]>([]);
  const [beantwortet, setBeantwortet] = useState(false);

  const jetzt = Date.now();
  const schwacheThemen = useMemo(() => new Set(themenStatistik(ereignisse).filter((t) => t.schwach).map((t) => t.thema)), [ereignisse]);
  const kandidaten = useMemo(() => {
    const mitAufgabe = karten.map((k) => ({ k, a: findeAufgabe(k.id)?.aufgabe })).filter((x): x is { k: (typeof karten)[number]; a: Aufgabe } => x.a !== undefined);
    if (modus === 'faellig') return mitAufgabe.filter((x) => x.k.due <= jetzt).sort((a, b) => a.k.due - b.k.due).map((x) => x.a);
    if (modus === 'schwaechen') return mitAufgabe.filter((x) => x.a.themen.some((t) => schwacheThemen.has(t))).sort((a, b) => b.k.fsrs.difficulty - a.k.fsrs.difficulty).map((x) => x.a);
    // Gemischt: zwei Drittel fällige oder schwierige, ein Drittel beherrschte – damit Gelerntes nicht verblasst.
    const schwer = mitAufgabe.filter((x) => x.k.due <= jetzt || x.k.fsrs.lapses > 0).map((x) => x.a);
    const sicher = mitAufgabe.filter((x) => !(x.k.due <= jetzt || x.k.fsrs.lapses > 0)).map((x) => x.a);
    return [...mische(schwer).slice(0, Math.ceil((SITZUNG * 2) / 3)), ...mische(sicher)].slice(0, SITZUNG);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [karten.length, modus, schwacheThemen]);

  const starte = () => {
    setSitzung(modus === 'gemischt' ? mische(kandidaten) : kandidaten.slice(0, SITZUNG));
    setPos(0);
    setErgebnisse([]);
    setBeantwortet(false);
  };

  if (sitzung && pos < sitzung.length) {
    const a = sitzung[pos];
    return (
      <div className="page-narrow">
        <div className="test-progress">
          <span>
            {pos + 1} von {sitzung.length}
          </span>
          <div className="bar">
            <span style={{ width: `${((pos + 1) / sitzung.length) * 100}%` }} />
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSitzung(null)}>
            Beenden
          </button>
        </div>
        <p className="muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          Thema: {a.themen.map(themaName).join(', ')}
        </p>
        <AufgabeKarte
          key={`${a.id}-${pos}`}
          aufgabe={a}
          quelle="wiederholung"
          onAusgewertet={(richtig) => {
            setErgebnisse((e) => [...e, richtig]);
            setBeantwortet(true);
          }}
        />
        <div className="row" style={{ marginTop: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!beantwortet}
            onClick={() => {
              setPos((p) => p + 1);
              setBeantwortet(false);
            }}
          >
            {pos + 1 < sitzung.length ? 'Nächste Frage' : 'Abschliessen'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (sitzung && pos >= sitzung.length) {
    const richtig = ergebnisse.filter(Boolean).length;
    return (
      <div className="page-narrow">
        <div className="score pass">
          <div className="row">
            <CheckCircle size={26} weight="fill" color="var(--ok)" />
            <h1 style={{ fontSize: '1.4rem' }}>Runde geschafft</h1>
          </div>
          <p>
            {richtig} von {ergebnisse.length} richtig. Falsch beantwortete Fragen kommen bald wieder, richtige erst später.
          </p>
          <div className="row">
            <button type="button" className="btn btn-primary" onClick={() => setSitzung(null)}>
              Zur Übersicht
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-narrow">
      <header className="page-head">
        <h1>Wiederholen</h1>
        <p>
          Jede Frage, die du im Wissenscheck oder in einem Test beantwortest, kommt in deinen Wiederholungsplan. Falsche Antworten kommen schon bald wieder, sichere erst nach Tagen oder
          Wochen. So bleibt das Gelernte, ohne dass du alles ständig wiederholen musst.
        </p>
      </header>
      <div className="options" role="radiogroup" style={{ marginBottom: '1.25rem' }}>
        {MODI.map((m) => {
          const Icon = m.icon;
          return (
            <button key={m.id} type="button" role="radio" aria-checked={modus === m.id} className={`option${modus === m.id ? ' selected' : ''}`} onClick={() => setParams({ modus: m.id })}>
              <Icon size={20} color="var(--accent)" />
              <span>
                <strong style={{ fontWeight: 600 }}>{m.titel}</strong>
                <br />
                <span className="muted" style={{ fontSize: '0.9rem' }}>
                  {m.text}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {karten.length === 0 ? (
        <div className="empty">
          <strong>Noch keine Fragen im Wiederholungsplan</strong>
          <span>Beantworte den Wissenscheck einer Lektion. Danach tauchen die Fragen hier auf.</span>
          <Link to="/" className="btn btn-sm">
            Zur ersten Lektion
          </Link>
        </div>
      ) : kandidaten.length === 0 ? (
        <div className="empty">
          <strong>{modus === 'faellig' ? 'Heute ist nichts fällig' : 'Keine Schwächen erkannt'}</strong>
          <span>{modus === 'faellig' ? 'Gut gemacht. Mit «Gemischt» kannst du trotzdem üben.' : 'Es gibt kein Thema, bei dem du öfter falsch liegst.'}</span>
          <button type="button" className="btn btn-sm" onClick={() => setParams({ modus: 'gemischt' })}>
            Gemischt üben
          </button>
        </div>
      ) : (
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={starte}>
            Runde starten <ArrowRight size={16} />
          </button>
          <span className="muted">{Math.min(kandidaten.length, SITZUNG)} Fragen in dieser Runde</span>
        </div>
      )}
      <p className="muted" style={{ fontSize: '0.86rem', marginTop: '1.5rem' }}>
        {karten.length} Fragen im Plan, davon {karten.filter((k) => k.due <= jetzt).length} fällig.
      </p>
    </div>
  );
}
