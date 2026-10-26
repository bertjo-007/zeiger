/**
 * Sicherung des Lernstands als JSON-Datei. Damit lässt sich der Stand auf ein
 * anderes Gerät oder einen anderen Browser mitnehmen.
 */
import { db } from './db.ts';

const TABELLEN = ['lektionen', 'aufgaben', 'ereignisse', 'tests', 'karten', 'einstellungen', 'spielwiese'] as const;

export interface Sicherung {
  app: 'zeiger';
  version: 1;
  exportiert: string;
  tabellen: Record<(typeof TABELLEN)[number], unknown[]>;
}

export async function exportiere(): Promise<Sicherung> {
  const tabellen = {} as Sicherung['tabellen'];
  for (const t of TABELLEN) tabellen[t] = await db.table(t).toArray();
  return { app: 'zeiger', version: 1, exportiert: new Date().toISOString(), tabellen };
}

export function istSicherung(x: unknown): x is Sicherung {
  if (!x || typeof x !== 'object') return false;
  const s = x as Partial<Sicherung>;
  return s.app === 'zeiger' && s.version === 1 && !!s.tabellen && TABELLEN.every((t) => Array.isArray(s.tabellen![t]));
}

/** Ersetzt den gesamten Lernstand durch die Sicherung. */
export async function importiere(s: Sicherung) {
  await db.transaction('rw', TABELLEN.map((t) => db.table(t)), async () => {
    for (const t of TABELLEN) {
      await db.table(t).clear();
      await db.table(t).bulkPut(s.tabellen[t]);
    }
  });
}

export async function allesLoeschen() {
  await db.transaction('rw', TABELLEN.map((t) => db.table(t)), async () => {
    for (const t of TABELLEN) await db.table(t).clear();
  });
}
