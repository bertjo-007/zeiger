/** Alle Schreibzugriffe auf den Lernstand an einer Stelle. */
import { isCodeAufgabe, type Aufgabe } from '../content/types.ts';
import { db, type AufgabeStand, type Quelle, type TestErgebnis } from './db.ts';
import { applyGrade, gradeFor } from './srs.ts';

const now = () => Date.now();

function leererStand(id: string): AufgabeStand {
  return { id, versuche: 0, geloest: null, hinweise: 0, loesungGezeigt: false, geaendert: now() };
}

async function aendereAufgabe(id: string, fn: (s: AufgabeStand) => void) {
  await db.transaction('rw', db.aufgaben, async () => {
    const s = (await db.aufgaben.get(id)) ?? leererStand(id);
    fn(s);
    s.geaendert = now();
    await db.aufgaben.put(s);
  });
}

export async function besucheLektion(id: string) {
  const t = now();
  await db.transaction('rw', db.lektionen, db.einstellungen, async () => {
    const s = await db.lektionen.get(id);
    await db.lektionen.put({ id, besucht: t, abgeschlossen: s?.abgeschlossen ?? null });
    await db.einstellungen.put({ key: 'zuletzt', value: { lektion: id, zeit: t } });
  });
}

export async function setzeLektionAbgeschlossen(id: string, fertig: boolean) {
  await db.transaction('rw', db.lektionen, async () => {
    const s = await db.lektionen.get(id);
    await db.lektionen.put({ id, besucht: s?.besucht ?? now(), abgeschlossen: fertig ? (s?.abgeschlossen ?? now()) : null });
  });
}

export async function speichereEntwurf(id: string, code: Record<string, string>) {
  await aendereAufgabe(id, (s) => {
    s.code = code;
  });
}

export async function speichereDateien(id: string, dateien: Record<string, string>) {
  await aendereAufgabe(id, (s) => {
    s.dateien = dateien;
  });
}

export async function speichereAntwort(id: string, antwort: unknown) {
  await aendereAufgabe(id, (s) => {
    s.antwort = antwort;
  });
}

export async function hinweisGenutzt(id: string, anzahl: number) {
  await aendereAufgabe(id, (s) => {
    s.hinweise = Math.max(s.hinweise, anzahl);
  });
}

export async function loesungAngezeigt(id: string) {
  await aendereAufgabe(id, (s) => {
    s.loesungGezeigt = true;
  });
}

/** Kommt eine Aufgabe in die Wiederholung? Kurze Fragen ja, grosse Programmieraufgaben nein. */
export function wiederholbar(a: Aufgabe): boolean {
  return !isCodeAufgabe(a);
}

/**
 * Hält eine ausgewertete Antwort fest: Ereignis für Statistik und Schwächen,
 * Stand der Aufgabe, und bei wiederholbaren Aufgaben die FSRS-Karte.
 */
export async function antwortAuswerten(aufgabe: Aufgabe, richtig: boolean, quelle: Quelle, hinweise = 0) {
  const t = now();
  await db.transaction('rw', db.ereignisse, db.aufgaben, db.karten, async () => {
    await db.ereignisse.add({ zeit: t, aufgabe: aufgabe.id, richtig, hinweise, quelle, themen: aufgabe.themen });
    const s = (await db.aufgaben.get(aufgabe.id)) ?? leererStand(aufgabe.id);
    s.versuche += 1;
    if (richtig && !s.geloest) s.geloest = t;
    s.geaendert = t;
    await db.aufgaben.put(s);
    if (wiederholbar(aufgabe)) {
      const karte = await db.karten.get(aufgabe.id);
      const fsrs = applyGrade(karte?.fsrs ?? null, gradeFor(richtig, hinweise), t);
      await db.karten.put({ id: aufgabe.id, fsrs, due: fsrs.due, themen: aufgabe.themen });
    }
  });
}

export async function speichereTest(ergebnis: Omit<TestErgebnis, 'id'>) {
  await db.tests.add(ergebnis);
}

export async function leseEinstellung<T>(key: string, fallback: T): Promise<T> {
  const e = await db.einstellungen.get(key);
  return e ? (e.value as T) : fallback;
}

export async function setzeEinstellung(key: string, value: unknown) {
  await db.einstellungen.put({ key, value });
}
