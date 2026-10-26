/**
 * Eine Aufgabe mit allem, was zum Üben gehört: Eingabe, Prüfen, gestufte
 * Hinweise, Musterlösung und Rückmeldung. Speichert den Lernstand.
 */
import { ArrowCounterClockwise, ArrowSquareOut, CheckCircle, Eye, Lightbulb, SealCheck } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { Diagnostic } from '../compiler/types.ts';
import { STUFEN, isCodeAufgabe, type Aufgabe, type AufgabenTyp, type Programm } from '../content/types.ts';
import type { Quelle } from '../progress/db.ts';
import { antwortAuswerten, hinweisGenutzt, loesungAngezeigt, speichereAntwort, speichereDateien, speichereEntwurf } from '../progress/actions.ts';
import { CodeBlock } from '../ui/code/CodeBlock.tsx';
import { useAufgabeStand, useDebounced } from '../ui/hooks.ts';
import { Markdown } from '../ui/Markdown.tsx';
import { Workbench } from '../editor/Workbench.tsx';
import { bewerte, istBeantwortet, leereAntwort, type Antwort, type Bewertung } from './bewerte.ts';
import { browserExecutor } from './browser-executor.ts';
import { dateienAus } from './checker.ts';
import { AuswahlEingabe, LueckeEingabe, PuzzleEingabe, TextEingabe, VorhersageEingabe, WahrFalschEingabe, ZuordnenEingabe } from './Eingaben.tsx';
import { Hinweise, LoesungGesperrt, PruefungsErgebnis, Rueckmeldung } from './Ergebnisse.tsx';

export const TYP_NAMEN: Record<AufgabenTyp, string> = {
  auswahl: 'Auswahl',
  wahrfalsch: 'Richtig oder falsch',
  eingabe: 'Kurze Antwort',
  vorhersage: 'Ausgabe vorhersagen',
  zuordnen: 'Zuordnen',
  luecke: 'Lückentext',
  puzzle: 'Code-Puzzle',
  programm: 'Programm schreiben',
  fehlersuche: 'Fehler finden',
  erweitern: 'Programm erweitern',
};

/** Eingabe-Baustein passend zum Typ. */
export function AufgabeEingabe({ aufgabe, antwort, setAntwort, bewertung, disabled }: { aufgabe: Aufgabe; antwort: Antwort; setAntwort(a: Antwort): void; bewertung?: Bewertung; disabled?: boolean }) {
  switch (aufgabe.typ) {
    case 'auswahl':
      return <AuswahlEingabe aufgabe={aufgabe} antwort={antwort as Extract<Antwort, { typ: 'auswahl' }>} setAntwort={setAntwort} bewertung={bewertung} disabled={disabled} />;
    case 'wahrfalsch':
      return <WahrFalschEingabe aufgabe={aufgabe} antwort={antwort as Extract<Antwort, { typ: 'wahrfalsch' }>} setAntwort={setAntwort} bewertung={bewertung} disabled={disabled} />;
    case 'eingabe':
      return <TextEingabe aufgabe={aufgabe} antwort={antwort as Extract<Antwort, { typ: 'eingabe' }>} setAntwort={setAntwort} bewertung={bewertung} disabled={disabled} />;
    case 'vorhersage':
      return <VorhersageEingabe aufgabe={aufgabe} antwort={antwort as Extract<Antwort, { typ: 'vorhersage' }>} setAntwort={setAntwort} bewertung={bewertung} disabled={disabled} />;
    case 'zuordnen':
      return <ZuordnenEingabe aufgabe={aufgabe} antwort={antwort as Extract<Antwort, { typ: 'zuordnen' }>} setAntwort={setAntwort} bewertung={bewertung} disabled={disabled} />;
    case 'luecke':
      return <LueckeEingabe aufgabe={aufgabe} antwort={antwort as Extract<Antwort, { typ: 'luecke' }>} setAntwort={setAntwort} bewertung={bewertung} disabled={disabled} />;
    case 'puzzle':
      return <PuzzleEingabe aufgabe={aufgabe} antwort={antwort as Extract<Antwort, { typ: 'puzzle' }>} setAntwort={setAntwort} bewertung={bewertung} disabled={disabled} />;
    default:
      return null;
  }
}

/** Wann darf die Musterlösung angezeigt werden? Erst nach einem Hinweis oder zwei Fehlversuchen. */
function loesungFrei(hinweiseGezeigt: number, hinweiseGesamt: number, fehlversuche: number) {
  return hinweiseGezeigt > 0 || fehlversuche >= 2 || hinweiseGesamt === 0;
}

interface KarteProps {
  aufgabe: Aufgabe;
  quelle: Quelle;
  /** Nummer in der Liste (z. B. «Übung 2»). */
  titel?: ReactNode;
  /** Nach jeder Auswertung (z. B. Wiederholung: weiter zur nächsten Karte). */
  onAusgewertet?(richtig: boolean, hinweise: number): void;
  /** Programmieraufgaben nur als Verweis auf die Übungsseite anzeigen. */
  kompakt?: boolean;
}

export function AufgabeKarte({ aufgabe, quelle, titel, onAusgewertet, kompakt }: KarteProps) {
  if (isCodeAufgabe(aufgabe)) {
    return kompakt ? <ProgrammVerweis aufgabe={aufgabe} titel={titel} /> : <ProgrammAufgabe aufgabe={aufgabe} quelle={quelle} titel={titel} onAusgewertet={onAusgewertet} />;
  }
  return <KurzAufgabe aufgabe={aufgabe} quelle={quelle} titel={titel} onAusgewertet={onAusgewertet} />;
}

function KopfZeile({ aufgabe, titel, geloest }: { aufgabe: Aufgabe; titel?: ReactNode; geloest: boolean }) {
  return (
    <div className="task-head">
      <span className="task-title">{titel ?? aufgabe.titel ?? TYP_NAMEN[aufgabe.typ]}</span>
      <span className="chip">{TYP_NAMEN[aufgabe.typ]}</span>
      {aufgabe.stufe && <span className="chip">{STUFEN[aufgabe.stufe]}</span>}
      <span className="spacer" />
      {geloest && (
        <span className="chip chip-ok">
          <SealCheck size={14} weight="fill" /> gelöst
        </span>
      )}
    </div>
  );
}

function KurzAufgabe({ aufgabe, quelle, titel, onAusgewertet }: KarteProps) {
  const stand = useAufgabeStand(aufgabe.id);
  const [antwort, setAntwort] = useState<Antwort>(() => leereAntwort(aufgabe));
  const [bewertung, setBewertung] = useState<Bewertung>();
  const [hinweise, setHinweise] = useState(0);
  const [fehlversuche, setFehlversuche] = useState(0);
  const [pruefe, setPruefe] = useState(false);
  const alleHinweise = aufgabe.hinweise ?? [];

  const pruefen = async () => {
    setPruefe(true);
    try {
      const b = await bewerte(aufgabe, antwort, browserExecutor);
      setBewertung(b);
      if (!b.richtig) setFehlversuche((n) => n + 1);
      await antwortAuswerten(aufgabe, b.richtig, quelle, hinweise);
      await speichereAntwort(aufgabe.id, antwort);
      onAusgewertet?.(b.richtig, hinweise);
    } finally {
      setPruefe(false);
    }
  };

  return (
    <div className="task">
      {quelle !== 'wiederholung' && <KopfZeile aufgabe={aufgabe} titel={titel} geloest={!!stand?.geloest} />}
      <div className="task-body">
        <AufgabeEingabe aufgabe={aufgabe} antwort={antwort} setAntwort={setAntwort} bewertung={bewertung} />
        {!bewertung && <Hinweise hinweise={alleHinweise} gezeigt={hinweise} />}
        {bewertung && (
          <Rueckmeldung
            richtig={bewertung.richtig}
            text={bewertung.meldung}
            erklaerung={aufgabe.erklaerung}
          />
        )}
      </div>
      <div className="task-foot">
        {!bewertung ? (
          <>
            <button type="button" className="btn btn-primary" disabled={!istBeantwortet(aufgabe, antwort) || pruefe} onClick={() => void pruefen()}>
              <CheckCircle size={16} /> {pruefe ? 'Wird geprüft …' : 'Prüfen'}
            </button>
            {hinweise < alleHinweise.length && (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setHinweise((n) => n + 1);
                  void hinweisGenutzt(aufgabe.id, hinweise + 1);
                }}
              >
                <Lightbulb size={16} /> Hinweis {alleHinweise.length > 1 ? `${hinweise + 1}/${alleHinweise.length}` : ''}
              </button>
            )}
          </>
        ) : (
          <>
            {quelle !== 'wiederholung' && (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setBewertung(undefined);
                  setAntwort(leereAntwort(aufgabe));
                }}
              >
                <ArrowCounterClockwise size={16} /> Nochmals
              </button>
            )}
          </>
        )}
        {!bewertung && fehlversuche > 0 && <span className="muted" style={{ fontSize: '0.85rem' }}>{fehlversuche} Fehlversuch{fehlversuche > 1 ? 'e' : ''}</span>}
      </div>
    </div>
  );
}

/** In der Lektion: Programmieraufgabe als Karte mit Verweis auf die Übungsseite. */
function ProgrammVerweis({ aufgabe, titel }: { aufgabe: Programm; titel?: ReactNode }) {
  const stand = useAufgabeStand(aufgabe.id);
  return (
    <div className="task">
      <KopfZeile aufgabe={aufgabe} titel={titel} geloest={!!stand?.geloest} />
      <div className="task-body">
        <Markdown text={aufgabe.aufgabe} />
      </div>
      <div className="task-foot">
        <Link className="btn btn-primary" to={`/uebung/${aufgabe.id}`}>
          <ArrowSquareOut size={16} /> {stand?.code ? 'Weiterarbeiten' : 'Im Editor bearbeiten'}
        </Link>
        {stand && stand.versuche > 0 && !stand.geloest && <span className="muted" style={{ fontSize: '0.85rem' }}>{stand.versuche} Prüfung{stand.versuche > 1 ? 'en' : ''}, noch nicht gelöst</span>}
      </div>
    </div>
  );
}

export function ProgrammAufgabe({ aufgabe, quelle, titel, onAusgewertet, wide = false }: KarteProps & { aufgabe: Programm; wide?: boolean }) {
  const stand = useAufgabeStand(aufgabe.id);
  const start = useMemo(() => dateienAus(aufgabe.start), [aufgabe]);
  const [dateien, setDateien] = useState<Record<string, string> | null>(null);
  const [daten, setDaten] = useState<Record<string, string> | null>(null);
  const [bewertung, setBewertung] = useState<Bewertung>();
  const [pruefe, setPruefe] = useState(false);
  const [hinweise, setHinweise] = useState(0);
  const [fehlversuche, setFehlversuche] = useState(0);
  const [zeigeLoesung, setZeigeLoesung] = useState(false);
  const [meldungen, setMeldungen] = useState<{ zeit: number; diagnostics: Diagnostic[] }>();
  const ergebnisRef = useRef<HTMLDivElement>(null);
  const alleHinweise = aufgabe.hinweise ?? [];
  const loesung = useMemo(() => dateienAus(aufgabe.loesung), [aufgabe]);

  // Gespeicherten Entwurf übernehmen, sobald der Stand geladen ist (null = noch nie bearbeitet).
  useEffect(() => {
    if (dateien !== null || stand === undefined) return;
    setDateien(stand?.code ?? start);
    setDaten(stand?.dateien ?? aufgabe.dateien ?? null);
    setHinweise(stand?.hinweise ?? 0);
  }, [stand, dateien, start, aufgabe.dateien]);

  const entwurf = useDebounced(dateien, 600);
  useEffect(() => {
    if (entwurf && JSON.stringify(entwurf) !== JSON.stringify(stand?.code ?? start)) void speichereEntwurf(aufgabe.id, entwurf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entwurf]);

  if (!dateien) return <div className="task task-body muted">Lädt …</div>;

  const pruefen = async () => {
    setPruefe(true);
    setBewertung(undefined);
    try {
      const b = await bewerte(aufgabe, { typ: 'programm', dateien }, browserExecutor);
      setBewertung(b);
      if (b.pruefung) setMeldungen({ zeit: Date.now(), diagnostics: b.pruefung.compile.diagnostics });
      if (!b.richtig) setFehlversuche((n) => n + 1);
      await antwortAuswerten(aufgabe, b.richtig, quelle, hinweise);
      onAusgewertet?.(b.richtig, hinweise);
      setTimeout(() => ergebnisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    } finally {
      setPruefe(false);
    }
  };

  const frei = loesungFrei(hinweise, alleHinweise.length, fehlversuche + (stand && !stand.geloest ? stand.versuche : 0));

  return (
    <div className="stack" style={{ gap: '1rem' }}>
      {!wide && (
        <div className="task">
          <KopfZeile aufgabe={aufgabe} titel={titel} geloest={!!stand?.geloest} />
          <div className="task-body">
            <Markdown text={aufgabe.aufgabe} />
          </div>
        </div>
      )}
      <Workbench
        files={dateien}
        initialFiles={start}
        onFilesChange={setDateien}
        stdin={aufgabe.stdin ?? aufgabe.tests[0]?.stdin}
        dataFiles={daten ?? undefined}
        onDataFilesChange={(d) => {
          setDaten(d);
          void speichereDateien(aufgabe.id, d);
        }}
        wide={wide}
        editorHeight={wide ? 'min(62vh, 40rem)' : 'auto'}
        minLines={wide ? 18 : 10}
        externeMeldungen={meldungen}
        label={`Code für ${aufgabe.titel ?? 'die Übung'}`}
        actions={
          <button type="button" className="btn btn-sm" disabled={pruefe} onClick={() => void pruefen()} title="Mit den Tests prüfen">
            <CheckCircle size={15} /> {pruefe ? 'Prüft …' : 'Prüfen'}
          </button>
        }
      />
      <div ref={ergebnisRef} className="stack" style={{ gap: '0.75rem' }}>
        {bewertung?.pruefung && <PruefungsErgebnis pruefung={bewertung.pruefung} />}
        {bewertung && bewertung.richtig && <Rueckmeldung richtig titel="Alle Tests bestanden" erklaerung={aufgabe.erklaerung} />}
        <Hinweise hinweise={alleHinweise} gezeigt={hinweise} />
        <div className="row">
          {hinweise < alleHinweise.length && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setHinweise((n) => n + 1);
                void hinweisGenutzt(aufgabe.id, hinweise + 1);
              }}
            >
              <Lightbulb size={16} /> Hinweis {alleHinweise.length > 1 ? `${hinweise + 1}/${alleHinweise.length}` : ''}
            </button>
          )}
          {frei || stand?.geloest ? (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setZeigeLoesung((z) => !z);
                if (!zeigeLoesung) void loesungAngezeigt(aufgabe.id);
              }}
            >
              <Eye size={16} /> {zeigeLoesung ? 'Musterlösung ausblenden' : 'Musterlösung zeigen'}
            </button>
          ) : (
            <LoesungGesperrt grund="Musterlösung nach einem Hinweis oder zwei Prüfungen" />
          )}
        </div>
        {zeigeLoesung && (
          <div className="stack" style={{ gap: '0.6rem' }}>
            <div className="compare">
              {Object.keys(loesung).map((name) => (
                <div key={`l-${name}`}>
                  <div className="compare-label good">Musterlösung {Object.keys(loesung).length > 1 ? name : ''}</div>
                  <CodeBlock code={loesung[name]} numbered />
                </div>
              ))}
              {Object.keys(loesung).map((name) => (
                <div key={`e-${name}`}>
                  <div className="compare-label">Dein Code {Object.keys(loesung).length > 1 ? name : ''}</div>
                  <CodeBlock code={dateien[name] ?? ''} numbered copy={false} />
                </div>
              ))}
            </div>
            <p className="muted" style={{ fontSize: '0.88rem' }}>
              Es gibt oft mehrere richtige Wege. Vergleiche, statt zu kopieren: Was macht die Musterlösung anders, und warum?
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
