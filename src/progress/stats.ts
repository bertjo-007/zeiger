/**
 * Fortschritt und Schwächen, berechnet aus dem gespeicherten Stand.
 * Reine Funktionen ohne Datenbankzugriff, damit sie testbar sind.
 */
import type { Kapitel } from '../content/types.ts';
import type { AufgabeStand, Ereignis, LektionStand, TestErgebnis } from './db.ts';

export interface KapitelFortschritt {
  lektionen: { fertig: number; gesamt: number };
  uebungen: { geloest: number; gesamt: number };
  test: { bestanden: boolean; beste: number | null };
  /** 0 bis 1. Gewichtung: Lektionen 50 %, Übungen 30 %, Kapiteltest 20 %. */
  anteil: number;
}

export const BESTANDEN_AB = 0.8;

export function kapitelFortschritt(
  kapitel: Kapitel,
  lektionen: Map<string, LektionStand>,
  aufgaben: Map<string, AufgabeStand>,
  tests: TestErgebnis[],
): KapitelFortschritt {
  const lGesamt = kapitel.lektionen.length;
  const lFertig = kapitel.lektionen.filter((l) => lektionen.get(l.id)?.abgeschlossen).length;
  const uebungen = kapitel.lektionen.flatMap((l) => l.uebungen);
  const uGeloest = uebungen.filter((u) => aufgaben.get(u.id)?.geloest).length;
  const eigene = tests.filter((t) => t.kapitel === kapitel.id);
  const beste = eigene.length > 0 ? Math.max(...eigene.map((t) => t.punkte / t.max)) : null;
  const bestanden = eigene.some((t) => t.bestanden);
  const anteil =
    0.5 * (lGesamt > 0 ? lFertig / lGesamt : 0) + 0.3 * (uebungen.length > 0 ? uGeloest / uebungen.length : 0) + 0.2 * (bestanden ? 1 : 0);
  return {
    lektionen: { fertig: lFertig, gesamt: lGesamt },
    uebungen: { geloest: uGeloest, gesamt: uebungen.length },
    test: { bestanden, beste },
    anteil,
  };
}

export function gesamtFortschritt(teile: KapitelFortschritt[]): number {
  if (teile.length === 0) return 0;
  return teile.reduce((s, t) => s + t.anteil, 0) / teile.length;
}

export interface ThemaStatistik {
  thema: string;
  richtig: number;
  gesamt: number;
  /** Trefferquote der letzten bis zu 8 Antworten. */
  quote: number;
  zuletzt: number;
  schwach: boolean;
}

/**
 * Ein Thema gilt als schwach, wenn von den letzten (bis zu 8) Antworten weniger
 * als 70 % stimmen oder die letzten beiden falsch waren. So verschwindet eine
 * Schwäche wieder, sobald Joshua das Thema mehrmals richtig beantwortet.
 */
export function themenStatistik(ereignisse: Ereignis[]): ThemaStatistik[] {
  const nachThema = new Map<string, Ereignis[]>();
  for (const e of ereignisse) {
    for (const t of e.themen) {
      const list = nachThema.get(t) ?? [];
      list.push(e);
      nachThema.set(t, list);
    }
  }
  const result: ThemaStatistik[] = [];
  for (const [thema, list] of nachThema) {
    list.sort((a, b) => a.zeit - b.zeit);
    const letzte = list.slice(-8);
    const quote = letzte.filter((e) => e.richtig).length / letzte.length;
    const zweiFalsch = list.length >= 2 && !list[list.length - 1].richtig && !list[list.length - 2].richtig;
    result.push({
      thema,
      richtig: list.filter((e) => e.richtig).length,
      gesamt: list.length,
      quote,
      zuletzt: list[list.length - 1].zeit,
      schwach: (letzte.length >= 2 && quote < 0.7) || zweiFalsch || (list.length === 1 && !list[0].richtig),
    });
  }
  return result.sort((a, b) => a.quote - b.quote || b.zuletzt - a.zuletzt);
}
