/**
 * Der ganze Kurs: Kapitel in Lernreihenfolge und Nachschlage-Indizes.
 * Läuft auch in Node (Prüfskript).
 */
import type { Aufgabe, Kapitel, Lektion } from './types.ts';
import { kapitel as k01 } from './k01/index.ts';
import { kapitel as k02 } from './k02/index.ts';
import { kapitel as k03 } from './k03/index.ts';
import { kapitel as k04 } from './k04/index.ts';
import { kapitel as k05 } from './k05/index.ts';
import { kapitel as k06 } from './k06/index.ts';
import { kapitel as k07 } from './k07/index.ts';
import { kapitel as k08 } from './k08/index.ts';
import { kapitel as k09 } from './k09/index.ts';
import { kapitel as k10 } from './k10/index.ts';
import { kapitel as k11 } from './k11/index.ts';

export const KAPITEL: Kapitel[] = [k01, k02, k03, k04, k05, k06, k07, k08, k09, k10, k11];

export interface AufgabeOrt {
  aufgabe: Aufgabe;
  kapitel: Kapitel;
  lektion?: Lektion;
  /** Wo die Aufgabe steht. */
  teil: 'uebung' | 'wissenscheck' | 'test';
}

const lektionIndex = new Map<string, { lektion: Lektion; kapitel: Kapitel; index: number }>();
const aufgabeIndex = new Map<string, AufgabeOrt>();
export const LEKTIONEN: Lektion[] = [];

for (const k of KAPITEL) {
  for (const l of k.lektionen) {
    lektionIndex.set(l.id, { lektion: l, kapitel: k, index: LEKTIONEN.length });
    LEKTIONEN.push(l);
    for (const a of l.uebungen) aufgabeIndex.set(a.id, { aufgabe: a, kapitel: k, lektion: l, teil: 'uebung' });
    for (const a of l.wissenscheck) aufgabeIndex.set(a.id, { aufgabe: a, kapitel: k, lektion: l, teil: 'wissenscheck' });
  }
  for (const a of k.test) aufgabeIndex.set(a.id, { aufgabe: a, kapitel: k, teil: 'test' });
}

export function findeLektion(id: string) {
  return lektionIndex.get(id);
}

export function findeKapitel(id: string) {
  return KAPITEL.find((k) => k.id === id);
}

export function findeAufgabe(id: string) {
  return aufgabeIndex.get(id);
}

export function alleAufgaben(): AufgabeOrt[] {
  return [...aufgabeIndex.values()];
}

/** Vorherige und nächste Lektion in Kursreihenfolge. */
export function nachbarn(id: string): { vorher?: Lektion; nachher?: Lektion } {
  const hit = lektionIndex.get(id);
  if (!hit) return {};
  return { vorher: LEKTIONEN[hit.index - 1], nachher: LEKTIONEN[hit.index + 1] };
}

/** Alle Themen-Schlagwörter mit lesbarem Namen. */
export const THEMEN: Record<string, string> = {
  grundlagen: 'Aufbau eines Programms',
  ausgabe: 'Ausgabe mit printf',
  kommentare: 'Kommentare',
  praeprozessor: 'Präprozessor und #include',
  kompilieren: 'Kompilieren und Ausführen',
  variablen: 'Variablen',
  datentypen: 'Datentypen',
  zahlensysteme: 'Bits, Bytes und Zahlensysteme',
  konstanten: 'Konstanten',
  format: 'Formatangaben',
  typumwandlung: 'Typumwandlung',
  eingabe: 'Eingabe mit scanf',
  operatoren: 'Operatoren',
  rangfolge: 'Rangfolge der Operatoren',
  bedingungen: 'Bedingungen',
  switch: 'switch und case',
  schleifen: 'Schleifen',
  funktionen: 'Funktionen',
  gueltigkeit: 'Gültigkeitsbereiche',
  arrays: 'Arrays',
  strings: 'Zeichenketten',
  zeiger: 'Zeiger',
  speicher: 'Dynamischer Speicher',
  strukturen: 'Strukturen und Typen',
  dateien: 'Dateien',
  makros: 'Makros und Header',
  rekursion: 'Rekursion',
  bits: 'Bitoperatoren',
  fehler: 'Fehlerbehandlung',
  stil: 'Programmierstil',
  mikrocontroller: 'Mikrocontroller',
};

export function themaName(id: string): string {
  return THEMEN[id] ?? id;
}
