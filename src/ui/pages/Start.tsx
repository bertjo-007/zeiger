import { ArrowRight, BookOpen, CheckCircle, HardDrives, Repeat, Target, Truck } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { Link } from 'react-router';
import { findeKapitel, findeLektion, KAPITEL, LEKTIONEN, themaName } from '../../content/kurs.ts';
import { abschnittLektionen, pfadAbschnitt, pfadLektionen, type Lernpfad } from '../../content/lernpfade.ts';
import type { LektionStand } from '../../progress/db.ts';
import { gesamtFortschritt, kapitelFortschritt, themenStatistik } from '../../progress/stats.ts';
import { useAufgabeStaende, useEreignisse, useFaellig, useLektionStaende, useLernpfad, useTests, useZuletzt } from '../hooks.ts';
import { Inline } from '../Markdown.tsx';

/** Anzeige mit Leerzeichen (Schweizer Schreibweise), Breite für CSS ohne. */
const pct = (x: number) => `${Math.round(x * 100)} %`;
const breite = (x: number) => `${Math.round(x * 100)}%`;

function LernpfadPanel({ pfad, lektionen }: { pfad: Lernpfad; lektionen: Map<string, LektionStand> }) {
  const alle = pfadLektionen(pfad);
  const fertig = alle.filter((l) => lektionen.get(l.id)?.abgeschlossen).length;
  const naechste = alle.find((l) => !lektionen.get(l.id)?.abgeschlossen);
  const anteil = alle.length ? fertig / alle.length : 0;

  return (
    <section className="panel panel-pad pfad-panel" aria-label={`Lernpfad ${pfad.titel}`}>
      <div className="pfad-kopf">
        <p className="pfad-kurz">{pfad.kurz}</p>
        <div className="pfad-stand">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>
              {fertig}/{alle.length} Lektionen
            </strong>
            <span className="muted" style={{ fontSize: '0.85rem' }}>
              {pct(anteil)}
            </span>
          </div>
          <div className={`bar${anteil >= 0.999 ? ' bar-ok' : ''}`}>
            <span style={{ width: breite(anteil) }} />
          </div>
          {naechste ? (
            <Link to={`/lektion/${naechste.id}`} className="btn btn-sm" style={{ justifySelf: 'start' }}>
              Weiter: {naechste.titel}
              <ArrowRight size={14} />
            </Link>
          ) : (
            <span className="row" style={{ gap: '0.4rem', color: 'var(--ok)', fontSize: '0.9rem' }}>
              <CheckCircle size={16} weight="fill" /> Alle Lektionen des Pfads abgeschlossen
            </span>
          )}
        </div>
      </div>
      <ul className="pfad-liste">
        {pfad.abschnitte.map((a) => {
          const k = findeKapitel(a.kapitel);
          if (!k) return null;
          const ls = abschnittLektionen(a);
          const erledigt = ls.filter((l) => lektionen.get(l.id)?.abgeschlossen).length;
          const nummern = a.lektionen?.map((id) => `${k.nr}.${k.lektionen.findIndex((l) => l.id === id) + 1}`);
          return (
            <li key={a.kapitel}>
              <Link to={`/kapitel/${k.id}`} className="pfad-zeile">
                <span className="nr">K{String(k.nr).padStart(2, '0')}</span>
                <span>
                  <span className="t">{k.titel}</span>
                  {nummern && <span className="muted"> · Lektion {nummern.join(', ')}</span>}
                  <span className="sub">
                    <Inline text={a.wofuer} />
                  </span>
                </span>
                <span className={`zahl${erledigt === ls.length ? ' ok' : ''}`}>
                  {erledigt}/{ls.length}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="pfad-fehlt">
        <strong>Noch nicht im Kurs, aber für {pfad.titel} wichtig:</strong>
        <ul>
          {pfad.fehlt.map((t) => (
            <li key={t}>
              <Inline text={t} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function StartPage() {
  const lektionen = useLektionStaende();
  const aufgaben = useAufgabeStaende();
  const tests = useTests();
  const ereignisse = useEreignisse();
  const faellig = useFaellig();
  const zuletzt = useZuletzt();
  const pfad = useLernpfad();

  const teile = useMemo(() => KAPITEL.map((k) => ({ k, f: kapitelFortschritt(k, lektionen, aufgaben, tests) })), [lektionen, aufgaben, tests]);
  const gesamt = gesamtFortschritt(teile.map((t) => t.f));
  const lektionenFertig = teile.reduce((s, t) => s + t.f.lektionen.fertig, 0);
  const uebungenGeloest = teile.reduce((s, t) => s + t.f.uebungen.geloest, 0);
  const uebungenGesamt = teile.reduce((s, t) => s + t.f.uebungen.gesamt, 0);
  const testsBestanden = teile.filter((t) => t.f.test.bestanden).length;
  const schwaechen = useMemo(() => themenStatistik(ereignisse).filter((t) => t.schwach).slice(0, 4), [ereignisse]);

  const weiter = zuletzt ? findeLektion(zuletzt.lektion) : undefined;
  const ersteOffene = LEKTIONEN.find((l) => !lektionen.get(l.id)?.abgeschlossen);
  const ziel = weiter && !lektionen.get(weiter.lektion.id)?.abgeschlossen ? weiter.lektion : (ersteOffene ?? weiter?.lektion);
  const zielKapitel = ziel ? findeLektion(ziel.id)?.kapitel : undefined;
  const neu = lektionen.size === 0;

  return (
    <div className="page">
      <header className="page-head">
        <h1>{neu ? 'C lernen, Schritt für Schritt' : 'Dein Lernstand'}</h1>
        <p>
          {neu
            ? 'Vom ersten printf bis zu Zeigern, Dateien und Mikrocontroller-Code. Jedes Beispiel läuft hier im Browser mit einem echten C-Compiler.'
            : 'Mach dort weiter, wo du aufgehört hast, oder wiederhole, was noch nicht sitzt.'}
        </p>
      </header>

      <div className="home-grid">
        <section className="continue-card" aria-label="Weiterlernen">
          <div className="row" style={{ alignItems: 'flex-end', gap: '1rem' }}>
            <div>
              <div className="big-number">{pct(gesamt)}</div>
              <div className="muted" style={{ fontSize: '0.88rem' }}>
                des Kurses
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '10rem' }}>
              <div className="bar" style={{ height: 6 }}>
                <span style={{ width: breite(gesamt) }} />
              </div>
            </div>
          </div>
          <div className="stat-row">
            <div className="stat">
              <span className="v">
                {lektionenFertig}/{LEKTIONEN.length}
              </span>
              <span className="k">Lektionen abgeschlossen</span>
            </div>
            <div className="stat">
              <span className="v">
                {uebungenGeloest}/{uebungenGesamt}
              </span>
              <span className="k">Übungen gelöst</span>
            </div>
            <div className="stat">
              <span className="v">
                {testsBestanden}/{KAPITEL.length}
              </span>
              <span className="k">Kapiteltests bestanden</span>
            </div>
          </div>
          {ziel && zielKapitel && (
            <Link to={`/lektion/${ziel.id}`} className="btn btn-primary" style={{ justifySelf: 'start', minHeight: 44, padding: '0 1.1rem' }}>
              <BookOpen size={18} />
              {neu ? 'Mit Lektion 1 beginnen' : `Weiter: ${ziel.titel}`}
              <ArrowRight size={16} />
            </Link>
          )}
          {ziel && zielKapitel && (
            <p className="muted" style={{ fontSize: '0.85rem', marginTop: '-0.4rem' }}>
              Kapitel {zielKapitel.nr}: {zielKapitel.titel}
            </p>
          )}
        </section>

        <div className="stack">
          <section className="panel panel-pad stack" style={{ gap: '0.75rem' }} aria-label="Wiederholen">
            <div className="row">
              <Repeat size={20} color="var(--accent)" />
              <h2 style={{ fontSize: '1.05rem' }}>Wiederholen</h2>
            </div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.93rem' }}>
              {faellig > 0
                ? `${faellig} Frage${faellig > 1 ? 'n sind' : ' ist'} heute fällig. Schwieriges kommt öfter, Beherrschtes nur gelegentlich.`
                : 'Gerade ist nichts fällig. Fragen kommen in die Wiederholung, sobald du sie im Wissenscheck oder in einem Test beantwortet hast.'}
            </p>
            <Link to="/wiederholen" className={`btn${faellig > 0 ? ' btn-primary' : ''}`} style={{ justifySelf: 'start' }}>
              {faellig > 0 ? 'Jetzt wiederholen' : 'Wiederholung öffnen'}
            </Link>
          </section>

          <section className="panel panel-pad stack" style={{ gap: '0.6rem' }} aria-label="Schwächen">
            <div className="row">
              <Target size={20} color="var(--warn)" />
              <h2 style={{ fontSize: '1.05rem' }}>Noch nicht sicher</h2>
            </div>
            {schwaechen.length === 0 ? (
              <p className="muted" style={{ fontSize: '0.92rem' }}>
                Keine Schwächen erkannt. Themen landen hier, wenn Antworten dazu öfter falsch sind.
              </p>
            ) : (
              <>
                <ul className="list-plain">
                  {schwaechen.map((s) => (
                    <li key={s.thema} className="list-link" style={{ cursor: 'default' }}>
                      {themaName(s.thema)}
                      <span className="muted">
                        {s.richtig}/{s.gesamt} richtig
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to="/wiederholen?modus=schwaechen" className="btn btn-sm" style={{ justifySelf: 'start' }}>
                  Schwächen üben
                </Link>
              </>
            )}
          </section>

          <div className="notice">
            <HardDrives size={18} />
            <span>
              Alles bleibt lokal in diesem Browser. Kein Konto, kein Server. <Link to="/einstellungen#daten">Sicherung</Link>
            </span>
          </div>
        </div>
      </div>

      {pfad && (
        <>
          <h2 className="section-title">
            <Truck size={20} color="var(--accent)" /> Lernpfad {pfad.titel}
          </h2>
          <LernpfadPanel pfad={pfad} lektionen={lektionen} />
        </>
      )}

      <h2 className="section-title">Kapitel</h2>
      <div className="chapter-grid">
        {teile.map(({ k, f }) => (
          <Link key={k.id} to={`/kapitel/${k.id}`} className="chapter-card">
            <span className="nr">
              Kapitel {k.nr}
              {pfad && pfadAbschnitt(pfad, k.id) && <Truck size={15} className="pfad-marke" alt={`Für ${pfad.titel}`} />}
            </span>
            <span className="t">{k.titel}</span>
            <div className={`bar${f.anteil >= 0.999 ? ' bar-ok' : ''}`}>
              <span style={{ width: breite(f.anteil) }} />
            </div>
            <span className="meta">
              {f.lektionen.fertig}/{f.lektionen.gesamt} Lektionen{f.test.bestanden ? ', Test bestanden' : ''}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
