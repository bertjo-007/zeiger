import { CheckCircle, Circle, CircleHalf, Exam, Truck } from '@phosphor-icons/react';
import { Link, useParams } from 'react-router';
import { findeKapitel } from '../../content/kurs.ts';
import { lektionImPfad, pfadAbschnitt } from '../../content/lernpfade.ts';
import { BESTANDEN_AB, kapitelFortschritt } from '../../progress/stats.ts';
import { useAufgabeStaende, useLektionStaende, useLernpfad, useTests } from '../hooks.ts';
import { Inline, Markdown } from '../Markdown.tsx';
import { NotFound } from './NotFound.tsx';

export function KapitelPage() {
  const { id = '' } = useParams();
  const k = findeKapitel(id);
  const lektionen = useLektionStaende();
  const aufgaben = useAufgabeStaende();
  const tests = useTests();
  const pfad = useLernpfad();
  if (!k) return <NotFound />;
  const f = kapitelFortschritt(k, lektionen, aufgaben, tests);
  const abschnitt = pfad ? pfadAbschnitt(pfad, k.id) : undefined;
  const auslassen = pfad?.auslassen[k.id];

  return (
    <div className="page-narrow">
      <header className="page-head">
        <span className="muted mono">Kapitel {k.nr}</span>
        <h1>{k.titel}</h1>
        <Markdown text={k.kurz} />
      </header>
      {pfad && abschnitt && (
        <div className="notice notice-pfad" style={{ marginBottom: '1rem' }}>
          <Truck size={18} />
          <span>
            <strong>Für {pfad.titel}:</strong> <Inline text={abschnitt.wofuer} />.{' '}
            {abschnitt.lektionen ? 'Nötig sind die markierten Lektionen.' : 'Das ganze Kapitel ist nötig.'}
          </span>
        </div>
      )}
      {pfad && auslassen && (
        <div className="notice" style={{ marginBottom: '1rem' }}>
          <Truck size={18} />
          <span>
            <strong>Für {pfad.titel} nicht nötig.</strong> <Inline text={auslassen} />
          </span>
        </div>
      )}
      <div className="panel panel-pad stack" style={{ gap: '0.6rem', marginBottom: '1.5rem' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <strong>{Math.round(f.anteil * 100)} % erledigt</strong>
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            Lektionen {f.lektionen.fertig}/{f.lektionen.gesamt} · Übungen {f.uebungen.geloest}/{f.uebungen.gesamt}
          </span>
        </div>
        <div className={`bar${f.anteil >= 0.999 ? ' bar-ok' : ''}`}>
          <span style={{ width: `${Math.round(f.anteil * 100)}%` }} />
        </div>
      </div>
      <div className="lesson-rows">
        {k.lektionen.map((l, i) => {
          const s = lektionen.get(l.id);
          const geloest = l.uebungen.filter((u) => aufgaben.get(u.id)?.geloest).length;
          return (
            <Link key={l.id} to={`/lektion/${l.id}`} className="lesson-row">
              <span className="idx">{s?.abgeschlossen ? <CheckCircle size={20} weight="fill" className="done" /> : s ? <CircleHalf size={20} color="var(--text-3)" /> : <Circle size={20} color="var(--text-3)" />}</span>
              <span>
                <div style={{ fontWeight: 560 }}>
                  {k.nr}.{i + 1} {l.titel}
                  {pfad && lektionImPfad(pfad, l.id) && (
                    <span className="chip chip-accent pfad-chip">
                      <Truck size={12} /> {pfad.titel}
                    </span>
                  )}
                </div>
                <div className="sub">
                  etwa {l.dauer} Min. · Übungen {geloest}/{l.uebungen.length}
                </div>
              </span>
              <span className="muted" style={{ fontSize: '0.85rem' }}>
                {s?.abgeschlossen ? 'abgeschlossen' : s ? 'begonnen' : ''}
              </span>
            </Link>
          );
        })}
        <Link to={`/test/${k.id}`} className="lesson-row">
          <span className="idx">{f.test.bestanden ? <CheckCircle size={20} weight="fill" className="done" /> : <Exam size={20} color="var(--accent)" />}</span>
          <span>
            <div style={{ fontWeight: 560 }}>Kapiteltest</div>
            <div className="sub">
              {Math.min(12, k.test.length)} Fragen · bestanden ab {Math.round(BESTANDEN_AB * 100)} %
            </div>
          </span>
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            {f.test.beste !== null ? `beste: ${Math.round(f.test.beste * 100)} %` : 'noch nicht gemacht'}
          </span>
        </Link>
      </div>
    </div>
  );
}
