import 'fake-indexeddb/auto';
import { Rating } from 'ts-fsrs';
import { beforeEach, describe, expect, it } from 'vitest';
import { allesLoeschen, exportiere, importiere, istSicherung } from '../src/progress/backup.ts';
import { db } from '../src/progress/db.ts';
import { applyGrade, gradeFor } from '../src/progress/srs.ts';

describe('Bewertung für die Wiederholung', () => {
  it('leitet die Bewertung aus Ergebnis und Hinweisen ab', () => {
    expect(gradeFor(false, 0)).toBe(Rating.Again);
    expect(gradeFor(false, 2)).toBe(Rating.Again);
    expect(gradeFor(true, 1)).toBe(Rating.Hard);
    expect(gradeFor(true, 0)).toBe(Rating.Good);
  });

  it('plant Gewusstes später ein als Vergessenes', () => {
    const jetzt = Date.UTC(2026, 9, 26, 8);
    let gut = applyGrade(null, Rating.Good, jetzt);
    let schlecht = applyGrade(null, Rating.Again, jetzt);
    for (let i = 1; i <= 3; i++) {
      gut = applyGrade(gut, Rating.Good, gut.due);
      schlecht = applyGrade(schlecht, Rating.Again, schlecht.due);
    }
    expect(gut.due).toBeGreaterThan(schlecht.due);
    expect(gut.reps).toBe(4);
  });
});

describe('Sicherung', () => {
  beforeEach(async () => {
    await allesLoeschen();
  });

  it('stellt den Lernstand nach Export und Import vollständig wieder her', async () => {
    const jetzt = Date.now();
    await db.lektionen.put({ id: 'k01-l01', besucht: jetzt, abgeschlossen: jetzt });
    await db.aufgaben.put({ id: 'k01-l01-u1', versuche: 2, geloest: jetzt, hinweise: 1, loesungGezeigt: false, code: { 'main.c': 'int main(void) { return 0; }' }, geaendert: jetzt });
    await db.ereignisse.add({ zeit: jetzt, aufgabe: 'k01-l01-u1', richtig: true, hinweise: 1, quelle: 'uebung', themen: ['ausgabe'] });
    await db.einstellungen.put({ key: 'thema', value: 'dunkel' });

    const sicherung = JSON.parse(JSON.stringify(await exportiere())) as unknown;
    expect(istSicherung(sicherung)).toBe(true);

    await allesLoeschen();
    expect(await db.lektionen.count()).toBe(0);

    if (!istSicherung(sicherung)) throw new Error('keine Sicherung');
    await importiere(sicherung);
    expect(await db.lektionen.get('k01-l01')).toMatchObject({ abgeschlossen: jetzt });
    expect((await db.aufgaben.get('k01-l01-u1'))?.code?.['main.c']).toContain('main');
    expect(await db.ereignisse.count()).toBe(1);
    expect((await db.einstellungen.get('thema'))?.value).toBe('dunkel');
  });

  it('erkennt fremde Dateien', () => {
    expect(istSicherung({ app: 'grapnel', version: 1, tabellen: {} })).toBe(false);
    expect(istSicherung(null)).toBe(false);
  });
});
