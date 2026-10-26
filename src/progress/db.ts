import Dexie, { type EntityTable } from 'dexie';
import type { FsrsData } from './srs.ts';

/**
 * Lokale Datenbank (IndexedDB über Dexie). Alles bleibt in diesem Browser;
 * es gibt keinen Server und kein Konto. Sicherung über Export/Import (backup.ts).
 */

export type Quelle = 'uebung' | 'check' | 'test' | 'wiederholung';

export interface LektionStand {
  id: string;
  /** Zuletzt geöffnet (ms). */
  besucht: number;
  /** Abgeschlossen am (ms) oder null. */
  abgeschlossen: number | null;
}

export interface AufgabeStand {
  id: string;
  versuche: number;
  /** Zum ersten Mal richtig gelöst am (ms) oder null. */
  geloest: number | null;
  /** Anzahl genutzter Hinweise. */
  hinweise: number;
  loesungGezeigt: boolean;
  /** Entwurf bei Code-Aufgaben: Dateiname → Inhalt. */
  code?: Record<string, string>;
  /** Letzte Antwort bei anderen Aufgaben (für die Anzeige beim erneuten Öffnen). */
  antwort?: unknown;
  /** Arbeitsordner bei Datei-Übungen. */
  dateien?: Record<string, string>;
  geaendert: number;
}

/** Jede Auswertung einer Antwort. Daraus entstehen Schwächen und Statistik. */
export interface Ereignis {
  id?: number;
  zeit: number;
  aufgabe: string;
  richtig: boolean;
  hinweise: number;
  quelle: Quelle;
  themen: string[];
}

export interface TestErgebnis {
  id?: number;
  /** Kapitel-ID oder «gesamt». */
  kapitel: string;
  zeit: number;
  punkte: number;
  max: number;
  bestanden: boolean;
  antworten: { id: string; richtig: boolean }[];
}

export interface KartenStand {
  /** ID der Aufgabe. */
  id: string;
  fsrs: FsrsData;
  due: number;
  themen: string[];
}

export interface Einstellung {
  key: string;
  value: unknown;
}

export interface SpielwieseDatei {
  id: string;
  name: string;
  dateien: Record<string, string>;
  geaendert: number;
}

export class ZeigerDB extends Dexie {
  lektionen!: EntityTable<LektionStand, 'id'>;
  aufgaben!: EntityTable<AufgabeStand, 'id'>;
  ereignisse!: EntityTable<Ereignis, 'id'>;
  tests!: EntityTable<TestErgebnis, 'id'>;
  karten!: EntityTable<KartenStand, 'id'>;
  einstellungen!: EntityTable<Einstellung, 'key'>;
  spielwiese!: EntityTable<SpielwieseDatei, 'id'>;

  constructor(name = 'zeiger') {
    super(name);
    this.version(1).stores({
      lektionen: 'id, besucht, abgeschlossen',
      aufgaben: 'id, geloest, geaendert',
      ereignisse: '++id, aufgabe, zeit, quelle',
      tests: '++id, kapitel, zeit',
      karten: 'id, due',
      einstellungen: 'key',
      spielwiese: 'id, geaendert',
    });
  }
}

export const db = new ZeigerDB();
