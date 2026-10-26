/**
 * Auswertung von Antworten und Programmen. Rein und ohne DOM: läuft in der App
 * und im Prüfskript (Node). Die Ausführung kommt als `Executor` von aussen.
 */
import type { CompileResult, RunResult, SourceFiles } from '../compiler/types.ts';
import type { Auswahl, Code, Eingabe, Erwartung, Luecke, Programm, Puzzle, Regel, Testfall, Zuordnen } from '../content/types.ts';

// ---------- Hilfen ----------

export function dateienAus(code: Code): Record<string, string> {
  return typeof code === 'string' ? { 'main.c': code } : { ...code };
}

/** Ausgabe vergleichbar machen: Zeilenenden vereinheitlichen, Leerzeichen am Zeilenende und Leerzeilen am Schluss ignorieren. */
export function normalisiereAusgabe(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

/** Kurze Antworten vergleichbar machen: Leerzeichen um Satzzeichen weg, mehrfache Leerzeichen zu einem. */
export function normalisiereAntwort(text: string, exakt = false): string {
  const t = text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*([^\w\s])\s*/g, '$1');
  return exakt ? t : t.toLowerCase();
}

/** Entfernt Kommentare, Zeichen- und Textkonstanten, damit Regeln nur echten Code sehen. */
export function nurCode(source: string): string {
  let out = '';
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];
    if (ch === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && next === '*') {
      i += 2;
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i++;
      i += 2;
      out += ' ';
      continue;
    }
    if (ch === '"' || ch === "'") {
      const quote = ch;
      out += quote + quote;
      i++;
      while (i < source.length && source[i] !== quote && source[i] !== '\n') {
        if (source[i] === '\\') i++;
        i++;
      }
      i++;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

export function pruefeRegeln(dateien: Record<string, string>, regeln: Regel[] = []): { regel: Regel; ok: boolean }[] {
  const code = Object.entries(dateien)
    .filter(([name]) => name.endsWith('.c') || name.endsWith('.h'))
    .map(([, text]) => nurCode(text))
    .join('\n');
  return regeln.map((regel) => {
    const mussOk = regel.muss === undefined || new RegExp(regel.muss, 'm').test(code);
    const darfOk = regel.darfNicht === undefined || !new RegExp(regel.darfNicht, 'm').test(code);
    return { regel, ok: mussOk && darfOk };
  });
}

const dec = new TextDecoder('utf-8', { fatal: false });

export function dateiText(bytes: Uint8Array | undefined): string | undefined {
  return bytes === undefined ? undefined : dec.decode(bytes);
}

/** Warum ein Lauf nicht normal endete, in einem Satz. */
export function abbruchGrund(run: RunResult, zeitlimitS = 5): string | undefined {
  switch (run.end) {
    case 'timeout':
      return `Das Programm lief länger als ${zeitlimitS} s und wurde abgebrochen. Vermutlich eine Endlosschleife, oder es wartet auf eine Eingabe, die nicht kommt.`;
    case 'trap':
      return 'Das Programm ist mit einem Laufzeitfehler abgestürzt.';
    case 'output-limit':
      return 'Das Programm hat so viel ausgegeben, dass es abgebrochen wurde. Vermutlich eine Endlosschleife mit printf.';
    case 'crash':
      return 'Das Programm wurde wegen eines Speicherfehlers abgebrochen.';
    case 'stopped':
      return 'Das Programm wurde gestoppt.';
    default:
      return undefined;
  }
}

/** Vergleicht einen Lauf mit der Erwartung. Leere Liste = alles in Ordnung. */
export function vergleiche(run: RunResult, e: Erwartung): string[] {
  const gruende: string[] = [];
  const abbruch = abbruchGrund(run);
  if (abbruch) return [abbruch];
  if (e.exitCode !== undefined && run.exitCode !== e.exitCode) {
    gruende.push(`Das Programm hat mit dem Rückgabewert ${run.exitCode} geendet, erwartet war ${e.exitCode}.`);
  }
  const ist = normalisiereAusgabe(run.stdout);
  if (e.stdout !== undefined && ist !== normalisiereAusgabe(e.stdout)) {
    gruende.push('Die Ausgabe stimmt nicht mit der erwarteten überein.');
  }
  for (const teil of e.enthaelt ?? []) {
    if (!run.stdout.includes(teil)) gruende.push(`In der Ausgabe fehlt «${teil.trim()}».`);
  }
  for (const teil of e.enthaeltNicht ?? []) {
    if (run.stdout.includes(teil)) gruende.push(`Die Ausgabe enthält «${teil.trim()}», das sollte nicht vorkommen.`);
  }
  if (e.regex !== undefined && !new RegExp(e.regex, 'm').test(run.stdout)) {
    gruende.push('Die Ausgabe hat nicht die erwartete Form.');
  }
  for (const [name, inhalt] of Object.entries(e.dateien ?? {})) {
    const text = dateiText(run.files[name]);
    if (text === undefined) gruende.push(`Die Datei «${name}» wurde nicht angelegt.`);
    else if (normalisiereAusgabe(text) !== normalisiereAusgabe(inhalt)) gruende.push(`Der Inhalt von «${name}» stimmt nicht.`);
  }
  if (e.sauber) {
    const lecks = run.memory.filter((m) => m.kind === 'leak');
    const offen = run.memory.filter((m) => m.kind === 'file-open');
    if (lecks.length > 0) gruende.push(`${lecks.length} Speicherblock${lecks.length > 1 ? 'e wurden' : ' wurde'} nicht mit free freigegeben.`);
    for (const f of offen) if (f.kind === 'file-open') gruende.push(`Die Datei «${f.name}» wurde nicht mit fclose geschlossen.`);
  }
  return gruende;
}

// ---------- Programme ----------

export interface Executor {
  compile(files: SourceFiles, options?: { extraFlags?: string[]; hiddenFiles?: SourceFiles }): Promise<CompileResult>;
  run(wasm: Uint8Array, config: { stdin: string; args?: string[]; files?: Record<string, string>; timeLimitMs?: number }): Promise<RunResult>;
}

export interface TestResultat {
  test: Testfall;
  ok: boolean;
  gruende: string[];
  run?: RunResult;
}

export interface Pruefung {
  compile: CompileResult;
  regeln: { regel: Regel; ok: boolean }[];
  tests: TestResultat[];
  bestanden: boolean;
}

export const HARNESS_FILE = '__test.c';

export function harnessOptionen(aufgabe: Programm) {
  return aufgabe.harness ? { extraFlags: ['-Dmain=__schueler_main'], hiddenFiles: { [HARNESS_FILE]: aufgabe.harness } } : {};
}

export async function pruefeProgramm(aufgabe: Programm, dateien: Record<string, string>, exec: Executor): Promise<Pruefung> {
  const compile = await exec.compile(dateien, harnessOptionen(aufgabe));
  const regeln = pruefeRegeln(dateien, aufgabe.regeln);
  if (!compile.ok || !compile.wasm) {
    return { compile, regeln, tests: [], bestanden: false };
  }
  const tests: TestResultat[] = [];
  for (const test of aufgabe.tests) {
    const run = await exec.run(compile.wasm, {
      stdin: test.stdin ?? '',
      args: test.args,
      files: { ...aufgabe.dateien, ...test.dateien },
      timeLimitMs: 3000,
    });
    const gruende = vergleiche(run, test.erwartet);
    tests.push({ test, ok: gruende.length === 0, gruende, run });
  }
  const bestanden = tests.every((t) => t.ok) && regeln.every((r) => r.ok);
  return { compile, regeln, tests, bestanden };
}

// ---------- Kurze Aufgaben ----------

export function pruefeAuswahl(a: Auswahl, gewaehlt: number[]): boolean {
  const richtige = a.optionen.map((o, i) => (o.richtig ? i : -1)).filter((i) => i >= 0);
  const g = [...new Set(gewaehlt)].sort((x, y) => x - y);
  return g.length === richtige.length && g.every((v, i) => v === richtige[i]);
}

export function pruefeEingabe(a: Eingabe, antwort: string): boolean {
  const n = normalisiereAntwort(antwort, a.exakt);
  return a.antworten.some((x) => normalisiereAntwort(x, a.exakt) === n);
}

export function pruefeVorhersage(erwartet: string, antwort: string): boolean {
  return normalisiereAusgabe(antwort) === normalisiereAusgabe(erwartet);
}

/** `zuordnung[i]` = Index der rechten Seite, die links i zugeordnet wurde. */
export function pruefeZuordnen(a: Zuordnen, zuordnung: number[]): boolean[] {
  return a.paare.map((_, i) => zuordnung[i] === i);
}

export const LUECKE = /__(\d+)__/g;

export function lueckenAnzahl(a: Luecke): number {
  return [...a.code.matchAll(LUECKE)].length;
}

export function fuelleLuecken(code: string, antworten: string[]): string {
  return code.replace(LUECKE, (_, n: string) => antworten[Number(n) - 1] ?? '');
}

export function pruefeLueckenText(a: Luecke, antworten: string[]): boolean[] {
  return a.luecken.map((ok, i) => ok.some((x) => normalisiereAntwort(x, true) === normalisiereAntwort(antworten[i] ?? '', true)));
}

export function puzzleProgramm(zeilen: string[]): string {
  return zeilen.join('\n') + '\n';
}

export function pruefePuzzleReihenfolge(a: Puzzle, reihenfolge: string[]): boolean {
  return reihenfolge.length === a.zeilen.length && reihenfolge.every((z, i) => z === a.zeilen[i]);
}
