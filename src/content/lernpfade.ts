/**
 * Lernpfade markieren die Lektionen, die für ein bestimmtes Vorhaben zählen.
 * Läuft auch in Node (Tests).
 */
import { findeKapitel, findeLektion, LEKTIONEN } from './kurs.ts';
import type { Lektion } from './types.ts';

export interface PfadAbschnitt {
  kapitel: string;
  /** Lektions-IDs; fehlt die Liste, zählt das ganze Kapitel. */
  lektionen?: string[];
  /** Wofür das Vorhaben diesen Stoff braucht (Inline-Markdown). */
  wofuer: string;
}

export interface Lernpfad {
  id: string;
  titel: string;
  kurz: string;
  abschnitte: PfadAbschnitt[];
  /** Kapitel, die das Vorhaben nicht braucht, mit Begründung. */
  auslassen: Record<string, string>;
  /** Themen, die das Vorhaben braucht, die der Kurs aber noch nicht hat. */
  fehlt: string[];
}

export const AMITRUCK: Lernpfad = {
  id: 'amitruck',
  titel: 'Amitruck',
  kurz: 'RC-Truck mit ESP32: vier Radmotoren mit Encoder und PI-Regler, PCA9685 über I²C, vier Ultraschallsensoren, Gamecontroller und ein Roboterarm. Arduino auf dem ESP32 ist C++, aber alles aus diesen Lektionen gilt dort unverändert.',
  abschnitte: [
    { kapitel: 'k01', wofuer: 'Programmaufbau, `printf` für Debug-Ausgaben (auf dem ESP32 `Serial.printf`), Kompilieren' },
    { kapitel: 'k02', wofuer: 'Encoder-Ticks in `int32_t`, die Adresse `0x40` des PCA9685, `float` für den Regler, Ticks in km/h umrechnen' },
    { kapitel: 'k04', wofuer: 'PI-Regler rechnen, Stellwerte begrenzen' },
    { kapitel: 'k05', wofuer: 'Fahrmodi als Zustandsautomat: Fahren, Stopp vor Hindernis, Arm-Modus' },
    { kapitel: 'k06', wofuer: '`loop()` läuft endlos, `for` über die vier Räder' },
    { kapitel: 'k07', wofuer: 'Code in Funktionen aufteilen; globale Variablen für Interrupts' },
    { kapitel: 'k08', lektionen: ['k08-l01', 'k08-l02', 'k08-l04'], wofuer: 'Je vier Räder, Sensoren und Gelenke als Array; auf dem ESP32 schützt nichts vor einem Index ausserhalb' },
    { kapitel: 'k09', lektionen: ['k09-l01', 'k09-l02', 'k09-l03', 'k09-l05'], wofuer: 'Eine Funktion regelt jedes Rad über einen Zeiger; `attachInterrupt` und Bluepad32 nehmen Funktionszeiger' },
    { kapitel: 'k11', wofuer: '`struct Rad` mit Pin, Ticks, Soll, Ist und Integral, ein Array aus vier Rädern, `enum` für die Zustände' },
  ],
  auslassen: {
    k03: 'Auf dem ESP32 gibt es kein `scanf`. Die Eingaben kommen vom Gamecontroller.',
    k10: 'Auf Mikrocontrollern vermeidet man `malloc` und legt alles fest an.',
  },
  fehlt: [
    'Bitoperatoren `&`, `|` und `<<` für die Register des PCA9685',
    '`volatile` und Interrupts, um die Encoder-Impulse zu zählen',
    'Zeitsteuerung ohne `delay`, Superloop, Entprellen und Encoder auswerten',
    'Der PI-Regler selbst',
  ],
};

export const LERNPFADE: Lernpfad[] = [AMITRUCK];

export function findeLernpfad(id: string): Lernpfad | undefined {
  return LERNPFADE.find((p) => p.id === id);
}

export function abschnittLektionen(a: PfadAbschnitt): Lektion[] {
  if (a.lektionen) return a.lektionen.map((id) => findeLektion(id)?.lektion).filter((l) => l !== undefined);
  return findeKapitel(a.kapitel)?.lektionen ?? [];
}

/** Alle Lektionen des Pfads in Kursreihenfolge. */
export function pfadLektionen(p: Lernpfad): Lektion[] {
  const ids = new Set(p.abschnitte.flatMap((a) => abschnittLektionen(a).map((l) => l.id)));
  return LEKTIONEN.filter((l) => ids.has(l.id));
}

export function pfadAbschnitt(p: Lernpfad, kapitelId: string): PfadAbschnitt | undefined {
  return p.abschnitte.find((a) => a.kapitel === kapitelId);
}

/** Abschnitt, zu dem die Lektion gehört, oder undefined, wenn sie nicht im Pfad liegt. */
export function lektionImPfad(p: Lernpfad, lektionId: string): PfadAbschnitt | undefined {
  const k = findeLektion(lektionId)?.kapitel.id;
  const a = k ? pfadAbschnitt(p, k) : undefined;
  if (!a) return undefined;
  return !a.lektionen || a.lektionen.includes(lektionId) ? a : undefined;
}
