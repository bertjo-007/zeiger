/**
 * Schnelle Strukturprüfung der Inhalte ohne Compiler. Ob die Programme
 * stimmen, prüft `npm run validate` mit dem echten Clang.
 */
import { describe, expect, it } from 'vitest';
import { alleAufgaben, findeKapitel, findeLektion, KAPITEL, LEKTIONEN, THEMEN } from '../src/content/kurs.ts';
import { REFERENZ } from '../src/content/referenz/index.ts';
import { LERNPFADE, lektionImPfad, pfadLektionen } from '../src/content/lernpfade.ts';
import { isCodeAufgabe } from '../src/content/types.ts';
import { LUECKE } from '../src/exercises/checker.ts';

describe('Kursaufbau', () => {
  it('hat fortlaufend nummerierte Kapitel', () => {
    expect(KAPITEL.map((k) => k.nr)).toEqual(KAPITEL.map((_, i) => i + 1));
  });

  it('vergibt jede ID nur einmal', () => {
    const ids = [...KAPITEL.map((k) => k.id), ...LEKTIONEN.map((l) => l.id), ...alleAufgaben().map((o) => o.aufgabe.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(LEKTIONEN.map((l) => [l.id, l] as const))('%s hat alle zehn Teile', (_, l) => {
    expect(l.lernziele.length).toBeGreaterThan(0);
    expect(l.erklaerung.trim().length).toBeGreaterThan(100);
    expect(l.syntax.length).toBeGreaterThan(0);
    expect(l.beispiel.code).toBeTruthy();
    expect(l.zeilen.length).toBeGreaterThan(0);
    expect(l.ergebnis.trim().length).toBeGreaterThan(0);
    expect(l.fehler.length).toBeGreaterThan(0);
    expect(l.uebungen.length).toBeGreaterThanOrEqual(2);
    expect(l.wissenscheck.length).toBeGreaterThanOrEqual(2);
    expect(l.zusammenfassung.length).toBeGreaterThan(0);
  });

  it('hat in jedem Kapitel genug Testfragen und mindestens eine Programmieraufgabe', () => {
    for (const k of KAPITEL) {
      expect(k.test.length, k.id).toBeGreaterThanOrEqual(12);
      expect(k.test.some(isCodeAufgabe), k.id).toBe(true);
    }
  });
});

describe('Aufgaben', () => {
  const aufgaben = alleAufgaben().map((o) => o.aufgabe);

  it('verwendet nur bekannte Themen', () => {
    for (const a of aufgaben) for (const t of a.themen) expect(THEMEN[t], `${a.id}: ${t}`).toBeDefined();
  });

  it('hat bei Lückentexten so viele Antworten wie Lücken', () => {
    for (const a of aufgaben) {
      if (a.typ !== 'luecke') continue;
      const nummern = new Set([...a.code.matchAll(LUECKE)].map((m) => m[1]));
      expect(a.luecken.length, a.id).toBe(nummern.size);
    }
  });

  it('hat bei Programmieraufgaben Tests und gültige Harnesses', () => {
    for (const a of aufgaben) {
      if (!isCodeAufgabe(a)) continue;
      expect(a.tests.length, a.id).toBeGreaterThan(0);
      if (a.harness) expect(a.harness.trimStart().startsWith('#undef main'), a.id).toBe(true);
      expect(a.start, a.id).not.toEqual(a.loesung);
    }
  });

  it('hat bei Auswahlfragen mindestens eine richtige Option', () => {
    for (const a of aufgaben) if (a.typ === 'auswahl') expect(a.optionen.some((o) => o.richtig), a.id).toBe(true);
  });
});

describe('Bibliothek', () => {
  const lektionIds = new Set(LEKTIONEN.map((l) => l.id));
  const refIds = new Set(REFERENZ.map((r) => r.id));

  it('verweist nur auf vorhandene Lektionen und umgekehrt', () => {
    for (const r of REFERENZ) for (const l of r.lektionen) expect(lektionIds.has(l), `${r.id} → ${l}`).toBe(true);
    for (const l of LEKTIONEN) for (const r of l.referenz ?? []) expect(refIds.has(r), `${l.id} → ${r}`).toBe(true);
  });

  it('enthält alle 44 Schlüsselwörter von C17', () => {
    const woerter =
      'auto break case char const continue default do double else enum extern float for goto if inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while _Alignas _Alignof _Atomic _Bool _Complex _Generic _Imaginary _Noreturn _Static_assert _Thread_local'.split(' ');
    expect(woerter).toHaveLength(44);
    const text = REFERENZ.map((r) => `${r.name} ${(r.stichwoerter ?? []).join(' ')} ${r.syntax}`).join('\n');
    for (const w of woerter) expect(new RegExp(`(^|[^\\w])${w}([^\\w]|$)`, 'm').test(text), w).toBe(true);
  });
});

describe('Lernpfade', () => {
  it('verweisen nur auf vorhandene Kapitel und Lektionen im richtigen Kapitel', () => {
    for (const p of LERNPFADE) {
      for (const a of p.abschnitte) {
        expect(findeKapitel(a.kapitel), `${p.id}: ${a.kapitel}`).toBeDefined();
        for (const id of a.lektionen ?? []) expect(findeLektion(id)?.kapitel.id, `${p.id}: ${id}`).toBe(a.kapitel);
      }
      for (const k of Object.keys(p.auslassen)) {
        expect(findeKapitel(k), `${p.id}: ${k}`).toBeDefined();
        expect(p.abschnitte.some((a) => a.kapitel === k), `${p.id}: ${k} ist markiert und ausgelassen`).toBe(false);
      }
    }
  });

  it('markiert jedes Kapitel höchstens einmal', () => {
    for (const p of LERNPFADE) {
      const ks = p.abschnitte.map((a) => a.kapitel);
      expect(new Set(ks).size).toBe(ks.length);
    }
  });

  it('löst Amitruck richtig auf', () => {
    const p = LERNPFADE.find((x) => x.id === 'amitruck')!;
    const ids = pfadLektionen(p).map((l) => l.id);
    expect(ids).toContain('k11-l06');
    expect(ids).toContain('k09-l05');
    expect(ids).not.toContain('k09-l04');
    expect(ids.some((id) => id.startsWith('k03-') || id.startsWith('k10-'))).toBe(false);
    expect(lektionImPfad(p, 'k08-l04')?.kapitel).toBe('k08');
    expect(lektionImPfad(p, 'k08-l05')).toBeUndefined();
  });
});
