import { ArrowLeft, ArrowRight, SealCheck } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { findeAufgabe } from '../../content/kurs.ts';
import { isCodeAufgabe, STUFEN } from '../../content/types.ts';
import { ProgrammAufgabe, TYP_NAMEN } from '../../exercises/AufgabeKarte.tsx';
import { useAufgabeStand } from '../hooks.ts';
import { Markdown } from '../Markdown.tsx';
import { NotFound } from './NotFound.tsx';

/** Arbeitsplatz für Programmieraufgaben: Aufgabe links, Editor und Ausgabe rechts. */
export function UebungPage() {
  const { id = '' } = useParams();
  const hit = findeAufgabe(id);
  const stand = useAufgabeStand(id);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  if (!hit || !isCodeAufgabe(hit.aufgabe) || !hit.lektion) return <NotFound />;
  const { aufgabe, lektion } = hit;
  const liste = lektion.uebungen;
  const idx = liste.findIndex((u) => u.id === id);
  const naechste = liste.slice(idx + 1).find(isCodeAufgabe) ?? undefined;

  return (
    <div className="exercise-layout">
      <aside className="exercise-brief">
        <Link to={`/lektion/${lektion.id}#uebungen`} className="row muted" style={{ textDecoration: 'none', fontSize: '0.88rem' }}>
          <ArrowLeft size={14} /> {lektion.titel}
        </Link>
        <div className="stack" style={{ gap: '0.5rem' }}>
          <div className="row">
            <span className="chip">{TYP_NAMEN[aufgabe.typ]}</span>
            {aufgabe.stufe && <span className="chip">{STUFEN[aufgabe.stufe]}</span>}
            {stand?.geloest && (
              <span className="chip chip-ok">
                <SealCheck size={14} weight="fill" /> gelöst
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.4rem' }}>
            Übung {idx + 1}
            {aufgabe.titel ? `: ${aufgabe.titel}` : ''}
          </h1>
        </div>
        <Markdown text={aufgabe.aufgabe} />
        <div className="notice" style={{ fontSize: '0.86rem' }}>
          <span>
            «Ausführen» startet dein Programm zum Ausprobieren. «Prüfen» lässt es gegen {aufgabe.tests.length} Test{aufgabe.tests.length > 1 ? 's' : ''} laufen. Dein Code wird automatisch gespeichert.
          </span>
        </div>
        {naechste && (
          <Link to={`/uebung/${naechste.id}`} className="btn" style={{ justifySelf: 'start' }}>
            Nächste Übung <ArrowRight size={15} />
          </Link>
        )}
      </aside>
      <div style={{ minWidth: 0 }}>
        <ProgrammAufgabe key={id} aufgabe={aufgabe} quelle="uebung" wide />
      </div>
    </div>
  );
}
