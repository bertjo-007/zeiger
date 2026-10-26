/**
 * Einheitliche Auswertung aller Aufgabentypen. Läuft in Browser und Node;
 * die Ausführung von C-Code kommt über den Executor.
 */
import type { Aufgabe, Md } from '../content/types.ts';
import {
  dateienAus,
  fuelleLuecken,
  normalisiereAusgabe,
  pruefeAuswahl,
  pruefeEingabe,
  pruefeLueckenText,
  pruefeProgramm,
  pruefePuzzleReihenfolge,
  pruefeVorhersage,
  pruefeZuordnen,
  puzzleProgramm,
  type Executor,
  type Pruefung,
} from './checker.ts';

export type Antwort =
  | { typ: 'auswahl'; gewaehlt: number[] }
  | { typ: 'wahrfalsch'; wert: boolean | null }
  | { typ: 'eingabe'; text: string }
  | { typ: 'vorhersage'; text: string }
  | { typ: 'zuordnen'; zuordnung: (number | null)[] }
  | { typ: 'luecke'; werte: string[] }
  | { typ: 'puzzle'; reihenfolge: string[] }
  | { typ: 'programm'; dateien: Record<string, string> };

export interface Bewertung {
  richtig: boolean;
  /** Teilergebnisse: pro Lücke, Paar oder Zeile. */
  teile?: boolean[];
  meldung?: Md;
  pruefung?: Pruefung;
  /** Tatsächliche Ausgabe eines Laufs (Lückentext, Puzzle). */
  ausgabe?: string;
}

export function leereAntwort(a: Aufgabe): Antwort {
  switch (a.typ) {
    case 'auswahl':
      return { typ: 'auswahl', gewaehlt: [] };
    case 'wahrfalsch':
      return { typ: 'wahrfalsch', wert: null };
    case 'eingabe':
      return { typ: 'eingabe', text: '' };
    case 'vorhersage':
      return { typ: 'vorhersage', text: '' };
    case 'zuordnen':
      return { typ: 'zuordnen', zuordnung: a.paare.map(() => null) };
    case 'luecke':
      return { typ: 'luecke', werte: a.luecken.map(() => '') };
    case 'puzzle':
      return { typ: 'puzzle', reihenfolge: [] };
    default:
      return { typ: 'programm', dateien: dateienAus(a.start) };
  }
}

export function istBeantwortet(a: Aufgabe, x: Antwort): boolean {
  switch (x.typ) {
    case 'auswahl':
      return x.gewaehlt.length > 0;
    case 'wahrfalsch':
      return x.wert !== null;
    case 'eingabe':
    case 'vorhersage':
      return x.text.trim().length > 0;
    case 'zuordnen':
      return x.zuordnung.every((z) => z !== null);
    case 'luecke':
      return x.werte.every((w) => w.trim().length > 0);
    case 'puzzle':
      return x.reihenfolge.length > 0;
    case 'programm':
      return a.typ !== 'auswahl';
  }
}

async function laufeCode(code: string, stdin: string, exec: Executor): Promise<string | undefined> {
  const c = await exec.compile({ 'main.c': code });
  if (!c.ok || !c.wasm) return undefined;
  const r = await exec.run(c.wasm, { stdin, timeLimitMs: 3000 });
  return r.end === 'exit' ? r.stdout : undefined;
}

export async function bewerte(a: Aufgabe, x: Antwort, exec: Executor): Promise<Bewertung> {
  if (a.typ === 'auswahl' && x.typ === 'auswahl') return { richtig: pruefeAuswahl(a, x.gewaehlt) };
  if (a.typ === 'wahrfalsch' && x.typ === 'wahrfalsch') return { richtig: x.wert === a.richtig };
  if (a.typ === 'eingabe' && x.typ === 'eingabe') return { richtig: pruefeEingabe(a, x.text) };
  if (a.typ === 'vorhersage' && x.typ === 'vorhersage') return { richtig: pruefeVorhersage(a.ausgabe, x.text), ausgabe: a.ausgabe };
  if (a.typ === 'zuordnen' && x.typ === 'zuordnen') {
    const teile = pruefeZuordnen(a, x.zuordnung.map((z) => z ?? -1));
    return { richtig: teile.every(Boolean), teile };
  }
  if (a.typ === 'luecke' && x.typ === 'luecke') {
    const teile = pruefeLueckenText(a, x.werte);
    if (teile.every(Boolean)) return { richtig: true, teile };
    if (a.ausgabe !== undefined) {
      const out = await laufeCode(fuelleLuecken(a.code, x.werte), a.stdin ?? '', exec);
      if (out !== undefined && normalisiereAusgabe(out) === normalisiereAusgabe(a.ausgabe)) {
        return { richtig: true, teile: teile.map(() => true), ausgabe: out, meldung: 'Anders geschrieben als die Musterlösung, aber das Programm läuft und liefert genau die erwartete Ausgabe.' };
      }
      return { richtig: false, teile, ausgabe: out };
    }
    return { richtig: false, teile };
  }
  if (a.typ === 'puzzle' && x.typ === 'puzzle') {
    if (pruefePuzzleReihenfolge(a, x.reihenfolge)) return { richtig: true, teile: x.reihenfolge.map(() => true) };
    const teile = x.reihenfolge.map((z, i) => a.zeilen[i] === z);
    if (a.ausgabe !== undefined && x.reihenfolge.length === a.zeilen.length && !x.reihenfolge.some((z) => (a.ablenker ?? []).includes(z))) {
      const out = await laufeCode(puzzleProgramm(x.reihenfolge), '', exec);
      if (out !== undefined && normalisiereAusgabe(out) === normalisiereAusgabe(a.ausgabe)) {
        return { richtig: true, teile: teile.map(() => true), ausgabe: out, meldung: 'Deine Reihenfolge weicht ab, ergibt aber dieselbe Ausgabe. Auch richtig.' };
      }
      return { richtig: false, teile, ausgabe: out };
    }
    return { richtig: false, teile };
  }
  if ((a.typ === 'programm' || a.typ === 'fehlersuche' || a.typ === 'erweitern') && x.typ === 'programm') {
    const pruefung = await pruefeProgramm(a, x.dateien, exec);
    return { richtig: pruefung.bestanden, pruefung };
  }
  return { richtig: false };
}
