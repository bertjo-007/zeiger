import { describe, expect, it } from 'vitest';
import type { RunResult } from '../src/compiler/types.ts';
import type { Auswahl, Eingabe, Luecke, Zuordnen } from '../src/content/types.ts';
import {
  fuelleLuecken,
  normalisiereAntwort,
  normalisiereAusgabe,
  nurCode,
  pruefeAuswahl,
  pruefeEingabe,
  pruefeLueckenText,
  pruefeRegeln,
  pruefeVorhersage,
  pruefeZuordnen,
  vergleiche,
} from '../src/exercises/checker.ts';

function lauf(teil: Partial<RunResult>): RunResult {
  return { end: 'exit', exitCode: 0, stdout: '', stderr: '', transcript: [], memory: [], files: {}, ms: 1, ...teil };
}

describe('normalisiereAusgabe', () => {
  it('ignoriert Zeilenenden, Leerzeichen am Zeilenende und Leerzeilen am Schluss', () => {
    expect(normalisiereAusgabe('a  \r\nb\t\n\n\n')).toBe('a\nb');
  });
  it('lässt Leerzeichen am Zeilenanfang stehen', () => {
    expect(normalisiereAusgabe('  x\n')).toBe('  x');
  });
});

describe('normalisiereAntwort', () => {
  it('ignoriert Gross/Klein und Leerzeichen um Satzzeichen', () => {
    expect(normalisiereAntwort('  *( a + i ) ')).toBe(normalisiereAntwort('*(a+i)'));
    expect(normalisiereAntwort('NULL')).toBe('null');
  });
  it('beachtet Gross/Klein im exakten Modus', () => {
    expect(normalisiereAntwort('NULL', true)).toBe('NULL');
  });
});

describe('nurCode', () => {
  it('entfernt Kommentare und Textinhalte, behält Zeichenkonstanten', () => {
    const src = 'int a = 1; // for\n/* while */ printf("for %d", a); char c = \'[\';';
    const code = nurCode(src);
    expect(code).not.toMatch(/\bfor\b/);
    expect(code).not.toMatch(/\bwhile\b/);
    expect(code).toContain("'['");
  });
  it('behält Textinhalte auf Wunsch', () => {
    expect(nurCode('printf("%-8s", s);', true)).toContain('%-8s');
  });
});

describe('pruefeRegeln', () => {
  it('prüft muss und darfNicht ohne Kommentare', () => {
    const ergebnis = pruefeRegeln({ 'main.c': '// for (;;)\nwhile (x) {}' }, [
      { muss: '\\bwhile\\b', meldung: 'while' },
      { darfNicht: '\\bfor\\b', meldung: 'kein for' },
    ]);
    expect(ergebnis.map((r) => r.ok)).toEqual([true, true]);
  });
  it('findet verbotene Muster', () => {
    const [r] = pruefeRegeln({ 'main.c': 'for (int i = 0; i < 3; i++) {}' }, [{ darfNicht: '\\bfor\\b', meldung: 'kein for' }]);
    expect(r.ok).toBe(false);
  });
});

describe('vergleiche', () => {
  it('akzeptiert passende Ausgabe', () => {
    expect(vergleiche(lauf({ stdout: '42 \n' }), { stdout: '42\n' })).toEqual([]);
  });
  it('meldet falsche Ausgabe und falschen Rückgabewert', () => {
    const gruende = vergleiche(lauf({ stdout: '41\n', exitCode: 1 }), { stdout: '42\n', exitCode: 0 });
    expect(gruende).toHaveLength(2);
  });
  it('meldet Abbrüche statt Ausgabevergleich', () => {
    const [grund] = vergleiche(lauf({ end: 'timeout', exitCode: null }), { stdout: '' });
    expect(grund).toMatch(/Endlosschleife/);
  });
  it('prüft enthaelt, enthaeltNicht und regex', () => {
    const r = lauf({ stdout: 'Motor an\nTemperatur: 21.5\n' });
    expect(vergleiche(r, { enthaelt: ['Motor an'], enthaeltNicht: ['Fehler'], regex: '^Temperatur: \\d+\\.\\d$' })).toEqual([]);
    expect(vergleiche(r, { enthaelt: ['Motor aus'] })).toHaveLength(1);
  });
  it('meldet Speicherlecks nur, wenn sauber verlangt ist', () => {
    const r = lauf({ stdout: 'ok\n', memory: [{ kind: 'leak', nummer: 1, bytes: 16 }] });
    expect(vergleiche(r, { stdout: 'ok\n' })).toEqual([]);
    expect(vergleiche(r, { stdout: 'ok\n', sauber: true })).toHaveLength(1);
  });
  it('vergleicht erzeugte Dateien', () => {
    const r = lauf({ files: { 'log.txt': new TextEncoder().encode('a\nb\n') } });
    expect(vergleiche(r, { dateien: { 'log.txt': 'a\nb' } })).toEqual([]);
    expect(vergleiche(r, { dateien: { 'fehlt.txt': '' } })).toHaveLength(1);
  });
});

describe('kurze Antworten', () => {
  const auswahl: Auswahl = {
    id: 'x',
    typ: 'auswahl',
    themen: [],
    frage: '?',
    mehrfach: true,
    optionen: [{ text: 'a', richtig: true }, { text: 'b' }, { text: 'c', richtig: true }],
  };
  it('verlangt bei Mehrfachauswahl genau die richtigen Optionen', () => {
    expect(pruefeAuswahl(auswahl, [0, 2])).toBe(true);
    expect(pruefeAuswahl(auswahl, [2, 0])).toBe(true);
    expect(pruefeAuswahl(auswahl, [0])).toBe(false);
    expect(pruefeAuswahl(auswahl, [0, 1, 2])).toBe(false);
  });
  it('akzeptiert alternative Schreibweisen bei Eingaben', () => {
    const e: Eingabe = { id: 'e', typ: 'eingabe', themen: [], frage: '?', antworten: ['stdlib.h', '<stdlib.h>'] };
    expect(pruefeEingabe(e, ' STDLIB.H ')).toBe(true);
    expect(pruefeEingabe(e, 'stdio.h')).toBe(false);
  });
  it('vergleicht Vorhersagen wie Programmausgaben', () => {
    expect(pruefeVorhersage('1 2\n3\n', '1 2  \n3')).toBe(true);
    expect(pruefeVorhersage('1 2\n', '12')).toBe(false);
  });
  it('wertet Zuordnungen paarweise aus', () => {
    const z: Zuordnen = { id: 'z', typ: 'zuordnen', themen: [], frage: '?', paare: [{ links: 'a', rechts: '1' }, { links: 'b', rechts: '2' }] };
    expect(pruefeZuordnen(z, [0, 1])).toEqual([true, true]);
    expect(pruefeZuordnen(z, [1, 0])).toEqual([false, false]);
  });
});

describe('Lückentexte', () => {
  const l: Luecke = { id: 'l', typ: 'luecke', themen: [], frage: '?', code: 'int __1__ = &x;\n__2__ = 5;', luecken: [['*p'], ['*p']] };
  it('füllt Lücken der Reihe nach', () => {
    expect(fuelleLuecken(l.code, ['*p', '*q'])).toBe('int *p = &x;\n*q = 5;');
  });
  it('prüft jede Lücke einzeln und ignoriert Leerzeichen', () => {
    expect(pruefeLueckenText(l, ['* p', '*q'])).toEqual([true, false]);
  });
});
