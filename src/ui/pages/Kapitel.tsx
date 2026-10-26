import { CheckCircle, Circle, CircleHalf, Exam } from '@phosphor-icons/react';
import { Link, useParams } from 'react-router';
import { findeKapitel } from '../../content/kurs.ts';
import { BESTANDEN_AB, kapitelFortschritt } from '../../progress/stats.ts';
import { useAufgabeStaende, useLektionStaende, useTests } from '../hooks.ts';
import { Markdown } from '../Markdown.tsx';
import { NotFound } from './NotFound.tsx';

export function KapitelPage() {
  const { id = '' } = useParams();
  const k = findeKapitel(id);
  const lektionen = useLektionStaende();
  const aufgaben = useAufgabeStaende();
  const tests = useTests();
  if (!k) return <NotFound />;
  const f = kapitelFortschritt(k, lektionen, aufgaben, tests);

  return (
    <div className="page-narrow">
      <header className="page-head">
        <span className="muted mono">Kapitel {k.nr}</span>
        <h1>{k.titel}</h1>
        <Markdown text={k.kurz} />
      </header>
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
