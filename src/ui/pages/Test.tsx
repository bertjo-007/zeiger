import { ArrowLeft, ArrowRight, CaretDown, CaretRight, CheckCircle, Exam, Repeat, Trophy, XCircle } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { alleAufgaben, findeKapitel, KAPITEL, themaName } from '../../content/kurs.ts';
import { isCodeAufgabe, type Aufgabe, type Programm } from '../../content/types.ts';
import { Workbench } from '../../editor/Workbench.tsx';
import { AufgabeEingabe, TYP_NAMEN } from '../../exercises/AufgabeKarte.tsx';
import { bewerte, istBeantwortet, leereAntwort, type Antwort, type Bewertung } from '../../exercises/bewerte.ts';
import { browserExecutor } from '../../exercises/browser-executor.ts';
import { dateienAus } from '../../exercises/checker.ts';
import { PruefungsErgebnis } from '../../exercises/Ergebnisse.tsx';
import { antwortAuswerten, speichereTest } from '../../progress/actions.ts';
import { BESTANDEN_AB } from '../../progress/stats.ts';
import { useTests } from '../hooks.ts';
import { Markdown } from '../Markdown.tsx';
import { NotFound } from './NotFound.tsx';

const KAPITELTEST_FRAGEN = 12;
const GESAMTTEST_FRAGEN = 40;
const GESAMTTEST_PROGRAMME = 3;

function mische<T>(xs: T[]): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Zieht Fragen: höchstens zwei Programmieraufgaben pro Kapiteltest, im Gesamttest gleichmässig über alle Kapitel. */
function ziehe(id: string): Aufgabe[] {
  if (id === 'gesamt') {
    const proKapitel = Math.ceil(GESAMTTEST_FRAGEN / KAPITEL.length);
    const kurz = KAPITEL.flatMap((k) => mische(k.test.filter((a) => !isCodeAufgabe(a))).slice(0, proKapitel));
    const code = mische(KAPITEL.flatMap((k) => k.test.filter(isCodeAufgabe))).slice(0, GESAMTTEST_PROGRAMME);
    return [...mische(kurz).slice(0, GESAMTTEST_FRAGEN), ...code];
  }
  const k = findeKapitel(id);
  if (!k) return [];
  const code = mische(k.test.filter(isCodeAufgabe)).slice(0, 2);
  const kurz = mische(k.test.filter((a) => !isCodeAufgabe(a))).slice(0, KAPITELTEST_FRAGEN - code.length);
  return [...mische(kurz), ...code];
}

/** Lektionen, in denen ein Thema geübt wird (für die Empfehlungen nach dem Test). */
function lektionenZuThema(thema: string) {
  const treffer = new Map<string, string>();
  for (const o of alleAufgaben()) if (o.lektion && o.aufgabe.themen.includes(thema)) treffer.set(o.lektion.id, o.lektion.titel);
  return [...treffer.entries()].slice(0, 3);
}

function ProgrammAntwort({ aufgabe, antwort, setAntwort }: { aufgabe: Programm; antwort: Antwort; setAntwort(a: Antwort): void }) {
  const start = useMemo(() => dateienAus(aufgabe.start), [aufgabe]);
  const dateien = antwort.typ === 'programm' ? antwort.dateien : start;
  return (
    <div className="stack">
      <Markdown text={aufgabe.aufgabe} />
      <Workbench files={dateien} initialFiles={start} onFilesChange={(d) => setAntwort({ typ: 'programm', dateien: d })} stdin={aufgabe.stdin ?? aufgabe.tests[0]?.stdin} dataFiles={aufgabe.dateien} minLines={12} />
      <p className="muted" style={{ fontSize: '0.86rem' }}>
        Du darfst dein Programm beliebig oft ausführen. Geprüft wird es erst bei der Auswertung des Tests.
      </p>
    </div>
  );
}

export function TestPage() {
  const { id = '' } = useParams();
  const gesamt = id === 'gesamt';
  const kapitel = gesamt ? undefined : findeKapitel(id);
  const verlauf = useTests().filter((t) => t.kapitel === id);
  const [phase, setPhase] = useState<'start' | 'laeuft' | 'auswertung' | 'ergebnis'>('start');
  const [fragen, setFragen] = useState<Aufgabe[]>([]);
  const [antworten, setAntworten] = useState<Record<string, Antwort>>({});
  const [index, setIndex] = useState(0);
  const [bewertungen, setBewertungen] = useState<Record<string, Bewertung>>({});
  const [fortschritt, setFortschritt] = useState(0);
  const [offen, setOffen] = useState<Set<string>>(new Set());

  useEffect(() => {
    setPhase('start');
    window.scrollTo(0, 0);
  }, [id]);

  if (!gesamt && !kapitel) return <NotFound />;
  const titel = gesamt ? 'Gesamttest' : `Kapiteltest: ${kapitel!.titel}`;
  const poolGroesse = gesamt ? KAPITEL.reduce((s, k) => s + k.test.length, 0) : kapitel!.test.length;

  const starte = () => {
    const f = ziehe(id);
    setFragen(f);
    setAntworten(Object.fromEntries(f.map((a) => [a.id, leereAntwort(a)])));
    setBewertungen({});
    setIndex(0);
    setOffen(new Set());
    setPhase('laeuft');
    window.scrollTo(0, 0);
  };

  const auswerten = async () => {
    const offeneFragen = fragen.filter((a) => !istBeantwortet(a, antworten[a.id])).length;
    if (offeneFragen > 0 && !window.confirm(`${offeneFragen} Frage${offeneFragen > 1 ? 'n sind' : ' ist'} noch nicht beantwortet. Trotzdem auswerten?`)) return;
    setPhase('auswertung');
    setFortschritt(0);
    const b: Record<string, Bewertung> = {};
    for (const [i, a] of fragen.entries()) {
      const antwort = antworten[a.id];
      b[a.id] = istBeantwortet(a, antwort) || isCodeAufgabe(a) ? await bewerte(a, antwort, browserExecutor) : { richtig: false };
      setFortschritt(i + 1);
    }
    const punkte = fragen.filter((a) => b[a.id].richtig).length;
    await speichereTest({
      kapitel: id,
      zeit: Date.now(),
      punkte,
      max: fragen.length,
      bestanden: punkte / fragen.length >= BESTANDEN_AB,
      antworten: fragen.map((a) => ({ id: a.id, richtig: b[a.id].richtig })),
    });
    for (const a of fragen) await antwortAuswerten(a, b[a.id].richtig, 'test', 0);
    setBewertungen(b);
    setOffen(new Set(fragen.filter((a) => !b[a.id].richtig).slice(0, 1).map((a) => a.id)));
    setPhase('ergebnis');
    window.scrollTo(0, 0);
  };

  if (phase === 'start') {
    const beste = verlauf.length > 0 ? Math.max(...verlauf.map((t) => t.punkte / t.max)) : null;
    return (
      <div className="page-narrow">
        <header className="page-head">
          <span className="row muted">
            <Exam size={18} /> {gesamt ? 'Über alle Kapitel' : `Kapitel ${kapitel!.nr}`}
          </span>
          <h1>{titel}</h1>
          <p>
            {gesamt
              ? `Rund ${GESAMTTEST_FRAGEN} Fragen aus allen Kapiteln und ${GESAMTTEST_PROGRAMME} Programmieraufgaben.`
              : `${Math.min(KAPITELTEST_FRAGEN, poolGroesse)} Fragen, zufällig aus ${poolGroesse} gezogen. Jeder Durchgang ist etwas anders.`}{' '}
            Bestanden ab {Math.round(BESTANDEN_AB * 100)} %. Die Auswertung kommt am Schluss, mit Erklärungen zu allen falschen Antworten.
          </p>
        </header>
        <div className="row" style={{ marginBottom: '1.5rem' }}>
          <button type="button" className="btn btn-primary" onClick={starte} disabled={poolGroesse === 0}>
            Test starten <ArrowRight size={16} />
          </button>
          {beste !== null && <span className="muted">Bestes Ergebnis bisher: {Math.round(beste * 100)} %</span>}
        </div>
        {verlauf.length > 0 && (
          <section className="panel panel-pad">
            <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Bisherige Durchgänge</h2>
            <ul className="list-plain">
              {verlauf
                .slice()
                .reverse()
                .slice(0, 8)
                .map((t) => (
                  <li key={t.id} className="list-link" style={{ cursor: 'default' }}>
                    {t.bestanden ? <CheckCircle size={16} weight="fill" color="var(--ok)" /> : <XCircle size={16} weight="fill" color="var(--err)" />}
                    {t.punkte} von {t.max} ({Math.round((t.punkte / t.max) * 100)} %)
                    <span className="muted">{new Date(t.zeit).toLocaleDateString('de-CH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </li>
                ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  if (phase === 'laeuft') {
    const a = fragen[index];
    const beantwortet = fragen.filter((x) => istBeantwortet(x, antworten[x.id])).length;
    const setAntwort = (x: Antwort) => setAntworten((alt) => ({ ...alt, [a.id]: x }));
    return (
      <div className="page-narrow" style={{ maxWidth: isCodeAufgabe(a) ? '64rem' : undefined }}>
        <div className="test-progress">
          <span>
            Frage {index + 1} von {fragen.length}
          </span>
          <div className="bar">
            <span style={{ width: `${((index + 1) / fragen.length) * 100}%` }} />
          </div>
          <span>{beantwortet} beantwortet</span>
        </div>
        <div className="task">
          <div className="task-head">
            <span className="task-title">{TYP_NAMEN[a.typ]}</span>
            <span className="spacer" />
            <span className="chip">{a.themen.map(themaName).slice(0, 2).join(', ')}</span>
          </div>
          <div className="task-body">
            {isCodeAufgabe(a) ? <ProgrammAntwort key={a.id} aufgabe={a} antwort={antworten[a.id]} setAntwort={setAntwort} /> : <AufgabeEingabe key={a.id} aufgabe={a} antwort={antworten[a.id]} setAntwort={setAntwort} />}
          </div>
          <div className="task-foot">
            <button type="button" className="btn" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
              <ArrowLeft size={16} /> Zurück
            </button>
            <span className="spacer" />
            {index < fragen.length - 1 ? (
              <button type="button" className="btn btn-primary" onClick={() => setIndex((i) => i + 1)}>
                Weiter <ArrowRight size={16} />
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => void auswerten()}>
                Test auswerten
              </button>
            )}
          </div>
        </div>
        <div className="row" style={{ marginTop: '1rem', gap: '0.3rem' }} aria-label="Fragen">
          {fragen.map((x, i) => (
            <button
              key={x.id}
              type="button"
              className={`btn btn-sm btn-icon${i === index ? ' btn-primary' : ''}`}
              style={!istBeantwortet(x, antworten[x.id]) || i === index ? undefined : { background: 'var(--accent-soft)', borderColor: 'transparent' }}
              onClick={() => setIndex(i)}
              aria-label={`Frage ${i + 1}${istBeantwortet(x, antworten[x.id]) ? ', beantwortet' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <span className="spacer" />
          <button type="button" className="btn btn-sm" onClick={() => void auswerten()}>
            Jetzt auswerten
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'auswertung') {
    return (
      <div className="page-narrow">
        <div className="score">
          <h1 style={{ fontSize: '1.3rem' }}>Wird ausgewertet …</h1>
          <p className="muted">
            {fortschritt} von {fragen.length} Fragen. Programme werden dabei kompiliert und gegen ihre Tests laufen gelassen.
          </p>
          <div className="bar">
            <span style={{ width: `${(fortschritt / fragen.length) * 100}%` }} />
          </div>
        </div>
      </div>
    );
  }

  const punkte = fragen.filter((a) => bewertungen[a.id]?.richtig).length;
  const quote = punkte / fragen.length;
  const bestanden = quote >= BESTANDEN_AB;
  const schwach = [...new Set(fragen.filter((a) => !bewertungen[a.id]?.richtig).flatMap((a) => a.themen))];

  return (
    <div className="page-narrow" style={{ maxWidth: '56rem' }}>
      <div className={`score${bestanden ? ' pass' : ''}`}>
        <div className="row">
          {bestanden ? <Trophy size={28} color="var(--ok)" weight="fill" /> : <Exam size={28} color="var(--warn)" />}
          <h1 style={{ fontSize: '1.5rem' }}>{bestanden ? 'Bestanden' : 'Noch nicht bestanden'}</h1>
        </div>
        <div className="row" style={{ alignItems: 'baseline' }}>
          <span className="big-number">{Math.round(quote * 100)} %</span>
          <span className="muted">
            {punkte} von {fragen.length} richtig, bestanden ab {Math.round(BESTANDEN_AB * 100)} %
          </span>
        </div>
        {schwach.length > 0 && (
          <div className="stack" style={{ gap: '0.5rem' }}>
            <div className="field-label">Diese Themen solltest du wiederholen</div>
            <ul className="list-plain">
              {schwach.map((t) => (
                <li key={t} className="row" style={{ padding: '0.25rem 0' }}>
                  <strong style={{ fontWeight: 580 }}>{themaName(t)}</strong>
                  {lektionenZuThema(t).map(([lid, ltitel]) => (
                    <Link key={lid} to={`/lektion/${lid}`} className="chip chip-accent" style={{ textDecoration: 'none' }}>
                      {ltitel}
                    </Link>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={starte}>
            <Repeat size={16} /> Neuen Durchgang starten
          </button>
          {schwach.length > 0 && (
            <Link to="/wiederholen?modus=schwaechen" className="btn">
              Schwächen üben
            </Link>
          )}
          {kapitel && (
            <Link to={`/kapitel/${kapitel.id}`} className="btn btn-ghost">
              Zum Kapitel
            </Link>
          )}
        </div>
      </div>

      <h2 className="section-title">Alle Fragen</h2>
      <div className="stack" style={{ gap: '0.6rem' }}>
        {fragen.map((a, i) => {
          const b = bewertungen[a.id];
          const auf = offen.has(a.id);
          return (
            <div key={a.id} className="task">
              <button
                type="button"
                className="task-head"
                style={{ width: '100%', border: 0, background: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: auf ? undefined : 0 }}
                aria-expanded={auf}
                onClick={() =>
                  setOffen((o) => {
                    const n = new Set(o);
                    if (n.has(a.id)) n.delete(a.id);
                    else n.add(a.id);
                    return n;
                  })
                }
              >
                {b?.richtig ? <CheckCircle size={18} weight="fill" color="var(--ok)" /> : <XCircle size={18} weight="fill" color="var(--err)" />}
                <span className="task-title">Frage {i + 1}</span>
                <span className="chip">{TYP_NAMEN[a.typ]}</span>
                <span className="spacer" />
                {auf ? <CaretDown size={16} /> : <CaretRight size={16} />}
              </button>
              {auf && (
                <div className="task-body">
                  {isCodeAufgabe(a) ? (
                    <>
                      <Markdown text={a.aufgabe} />
                      {b?.pruefung && <PruefungsErgebnis pruefung={b.pruefung} />}
                    </>
                  ) : (
                    <AufgabeEingabe aufgabe={a} antwort={antworten[a.id]} setAntwort={() => {}} bewertung={b ?? { richtig: false }} disabled />
                  )}
                  {a.erklaerung && (
                    <div className={`feedback ${b?.richtig ? 'ok' : 'info'}`}>
                      <span />
                      <div>
                        <span className="fb-title">Erklärung</span>
                        <Markdown text={a.erklaerung} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
