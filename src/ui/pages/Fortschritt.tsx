import { CheckCircle, Exam } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { Link } from 'react-router';
import { findeLektion, KAPITEL, themaName } from '../../content/kurs.ts';
import { kapitelFortschritt, themenStatistik } from '../../progress/stats.ts';
import { useAufgabeStaende, useEreignisse, useLektionStaende, useTests } from '../hooks.ts';

const datum = (ms: number) => new Date(ms).toLocaleDateString('de-CH', { day: 'numeric', month: 'short' });

export function FortschrittPage() {
  const lektionen = useLektionStaende();
  const aufgaben = useAufgabeStaende();
  const tests = useTests();
  const ereignisse = useEreignisse();
  const themen = useMemo(() => themenStatistik(ereignisse), [ereignisse]);
  const abgeschlossen = useMemo(
    () =>
      [...lektionen.values()]
        .filter((l) => l.abgeschlossen)
        .sort((a, b) => (b.abgeschlossen ?? 0) - (a.abgeschlossen ?? 0))
        .map((l) => ({ s: l, hit: findeLektion(l.id) }))
        .filter((x) => x.hit),
    [lektionen],
  );
  const woche = Date.now() - 7 * 86400000;
  const letzteWoche = ereignisse.filter((e) => e.zeit >= woche);

  return (
    <div className="page">
      <header className="page-head">
        <h1>Fortschritt</h1>
        <p>Was du schon gelernt hast, wo du sicher bist und was du noch üben solltest.</p>
      </header>

      <div className="stat-row panel panel-pad" style={{ marginBottom: '1.5rem' }}>
        <div className="stat">
          <span className="v">{letzteWoche.length}</span>
          <span className="k">Antworten in den letzten 7 Tagen</span>
        </div>
        <div className="stat">
          <span className="v">{letzteWoche.length > 0 ? `${Math.round((letzteWoche.filter((e) => e.richtig).length / letzteWoche.length) * 100)} %` : 'keine'}</span>
          <span className="k">davon richtig</span>
        </div>
        <div className="stat">
          <span className="v">{tests.length}</span>
          <span className="k">Testdurchgänge</span>
        </div>
      </div>

      <h2 className="section-title">Kapitel</h2>
      <div className="panel" style={{ overflowX: 'auto' }}>
        <table className="prose" style={{ display: 'table', fontSize: '0.92rem', margin: 0 }}>
          <thead>
            <tr>
              <th>Kapitel</th>
              <th>Lektionen</th>
              <th>Übungen</th>
              <th>Test</th>
              <th style={{ width: '22%' }}>Fortschritt</th>
            </tr>
          </thead>
          <tbody>
            {KAPITEL.map((k) => {
              const f = kapitelFortschritt(k, lektionen, aufgaben, tests);
              return (
                <tr key={k.id}>
                  <td>
                    <Link to={`/kapitel/${k.id}`}>
                      {k.nr}. {k.titel}
                    </Link>
                  </td>
                  <td>
                    {f.lektionen.fertig}/{f.lektionen.gesamt}
                  </td>
                  <td>
                    {f.uebungen.geloest}/{f.uebungen.gesamt}
                  </td>
                  <td>{f.test.bestanden ? <span className="chip chip-ok">bestanden</span> : f.test.beste !== null ? `${Math.round(f.test.beste * 100)} %` : <span className="muted">offen</span>}</td>
                  <td>
                    <div className={`bar${f.anteil >= 0.999 ? ' bar-ok' : ''}`}>
                      <span style={{ width: `${Math.round(f.anteil * 100)}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="muted" style={{ fontSize: '0.84rem', marginTop: '0.5rem' }}>
        Der Fortschritt eines Kapitels setzt sich zusammen aus abgeschlossenen Lektionen (50 %), gelösten Übungen (30 %) und dem bestandenen Kapiteltest (20 %).
      </p>

      <div className="home-grid" style={{ marginTop: '1rem' }}>
        <section>
          <h2 className="section-title">Themen</h2>
          {themen.length === 0 ? (
            <div className="empty">Noch keine Antworten. Sobald du Übungen, Wissenschecks oder Tests beantwortest, siehst du hier, welche Themen sitzen.</div>
          ) : (
            <div className="panel" style={{ padding: '0.5rem' }}>
              {themen.map((t) => (
                <div key={t.thema} className="list-link" style={{ cursor: 'default', display: 'grid', gridTemplateColumns: '1fr 7rem 5.5rem', gap: '0.75rem' }}>
                  <span>
                    {themaName(t.thema)} {t.schwach && <span className="chip chip-warn">üben</span>}
                  </span>
                  <div className={`bar${t.quote >= 0.8 ? ' bar-ok' : ''}`}>
                    <span style={{ width: `${Math.round(t.quote * 100)}%` }} />
                  </div>
                  <span className="muted" style={{ textAlign: 'right', fontSize: '0.84rem' }}>
                    {t.richtig}/{t.gesamt} richtig
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
        <section>
          <h2 className="section-title">Abgeschlossene Lektionen</h2>
          {abgeschlossen.length === 0 ? (
            <div className="empty">Noch keine Lektion abgeschlossen. Am Ende jeder Lektion kannst du sie als abgeschlossen markieren.</div>
          ) : (
            <ul className="list-plain panel" style={{ padding: '0.5rem' }}>
              {abgeschlossen.map(({ s, hit }) => (
                <li key={s.id}>
                  <Link to={`/lektion/${s.id}`} className="list-link">
                    <CheckCircle size={16} weight="fill" color="var(--ok)" />
                    {hit!.kapitel.nr}. {hit!.lektion.titel}
                    <span className="muted">{datum(s.abgeschlossen!)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {tests.length > 0 && (
            <>
              <h2 className="section-title">Letzte Tests</h2>
              <ul className="list-plain panel" style={{ padding: '0.5rem' }}>
                {tests
                  .slice()
                  .reverse()
                  .slice(0, 8)
                  .map((t) => {
                    const k = KAPITEL.find((x) => x.id === t.kapitel);
                    return (
                      <li key={t.id}>
                        <Link to={`/test/${t.kapitel}`} className="list-link">
                          <Exam size={16} color={t.bestanden ? 'var(--ok)' : 'var(--text-3)'} />
                          {k ? `Kapitel ${k.nr}` : 'Gesamttest'}: {Math.round((t.punkte / t.max) * 100)} %
                          <span className="muted">{datum(t.zeit)}</span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
