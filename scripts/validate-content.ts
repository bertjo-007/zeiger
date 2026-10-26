/**
 * Prüft alle Lerninhalte mit demselben Compiler wie die App.
 *
 *   npm run validate            alles
 *   npm run validate -- k03     nur Kapitel 3 (und die Bibliothek nicht)
 *   npm run validate -- ref     nur die Bibliothek
 *
 * Fehler lassen das Skript mit Code 1 enden, Warnungen nicht.
 */
import { readFileSync } from 'node:fs';
import { Worker } from 'node:worker_threads';
import { compile, locate } from '../src/compiler/toolchain.ts';
import type { CompileResult, RunResult, Segment } from '../src/compiler/types.ts';
import { KAPITEL, THEMEN } from '../src/content/kurs.ts';
import { REFERENZ } from '../src/content/referenz/index.ts';
import type { Aufgabe, Beispiel, Kapitel, Lektion } from '../src/content/types.ts';
import { dateienAus, fuelleLuecken, normalisiereAusgabe, pruefeProgramm, pruefeRegeln, puzzleProgramm, type Executor } from '../src/exercises/checker.ts';

const support = readFileSync('src/compiler/laufzeit.c', 'utf8');
const filter = process.argv[2];
const fehler: string[] = [];
const warnungen: string[] = [];
const err = (wo: string, text: string) => fehler.push(`✗ ${wo}: ${text}`);
const warn = (wo: string, text: string) => warnungen.push(`! ${wo}: ${text}`);

// ---------- Ausführung mit Zeitlimit ----------

let worker: Worker | null = null;
function neuerWorker() {
  worker = new Worker(new URL('./run-worker.ts', import.meta.url));
  return worker;
}

function laufe(wasm: Uint8Array, config: { stdin: string; args?: string[]; files?: Record<string, string>; timeLimitMs?: number }): Promise<RunResult> {
  const w = worker ?? neuerWorker();
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      w.removeAllListeners('message');
      void w.terminate();
      worker = null;
      resolve({ end: 'timeout', exitCode: null, stdout: '', stderr: '', transcript: [], memory: [], files: {}, ms: config.timeLimitMs ?? 5000 });
    }, config.timeLimitMs ?? 5000);
    w.once('message', (m: { ok: boolean; result?: RunResult; message?: string }) => {
      clearTimeout(timer);
      if (m.ok && m.result) resolve(m.result);
      else resolve({ end: 'crash', exitCode: null, stdout: '', stderr: m.message ?? '', transcript: [], memory: [], files: {}, ms: 0 });
    });
    w.postMessage({ wasm, stdin: config.stdin, args: config.args, files: config.files });
  });
}

const exec: Executor = {
  compile: (files, options) => compile(files, { support, ...options }),
  run: laufe,
};

const transcriptText = (t: Segment[]) => t.map((s) => s.text).join('');

function meldungen(c: CompileResult, art: 'error' | 'warning') {
  return c.diagnostics.filter((d) => d.severity === art).map((d) => `${d.file}:${d.line}: ${d.message}`);
}

// ---------- Texte ----------

/** Sichtbare Texte auf häufige Fehler prüfen (ohne Code-Teile). */
function pruefeText(wo: string, text: string | undefined) {
  if (!text) return;
  const ohneCode = text.replace(/~~~[\s\S]*?~~~/g, '').replace(/`[^`]*`/g, '');
  if (/[—–]/.test(ohneCode)) warn(wo, `Gedankenstrich im Text: «${ohneCode.match(/.{0,30}[—–].{0,30}/)?.[0]}»`);
  if (/\\\\[ntr0"']/.test(text)) err(wo, `doppelter Backslash (in md-Templates genügt einer): «${text.match(/.{0,20}\\\\[ntr0"'].{0,10}/)?.[0]}»`);
  if (/ß/.test(text)) err(wo, 'ß gefunden; Schweizer Schreibweise verlangt ss');
}

// ---------- Prüfungen ----------

async function pruefeBeispiel(wo: string, b: Beispiel) {
  if (b.ausschnitt) return;
  const dateien = dateienAus(b.code);
  const c = await exec.compile(dateien);
  const fehlerListe = meldungen(c, 'error');
  const warnListe = meldungen(c, 'warning');
  if (b.fehlerErwartet === 'compiler') {
    if (c.ok) err(wo, 'Compilerfehler erwartet, aber es kompiliert');
    return;
  }
  if (!c.ok || !c.wasm) return err(wo, `kompiliert nicht:\n    ${fehlerListe.join('\n    ') || c.stderr}`);
  if (warnListe.length > 0 && b.fehlerErwartet !== 'warnung') err(wo, `Warnungen:\n    ${warnListe.join('\n    ')}`);
  if (b.fehlerErwartet === 'warnung' && warnListe.length === 0) err(wo, 'Warnung erwartet, aber keine erhalten');
  const r = await exec.run(c.wasm, { stdin: b.stdin ?? '', args: b.args, files: b.dateien });
  if (b.fehlerErwartet === 'laufzeit') {
    if (r.end === 'exit' && r.memory.length === 0) err(wo, 'Laufzeitfehler erwartet, aber das Programm lief normal');
    return;
  }
  if (r.end !== 'exit') return err(wo, `Lauf endete mit «${r.end}»${r.trap ? ` (${r.trap.message})` : ''}\n    Ausgabe: ${JSON.stringify(transcriptText(r.transcript).slice(0, 200))}`);
  if (r.memory.length > 0) err(wo, `Speicherprüfung meldet: ${JSON.stringify(r.memory)}`);
  if (b.ausgabe !== undefined && !b.ausgabeVariabel) {
    const ist = normalisiereAusgabe(transcriptText(r.transcript));
    if (ist !== normalisiereAusgabe(b.ausgabe)) err(wo, `Ausgabe weicht ab.\n    erwartet: ${JSON.stringify(normalisiereAusgabe(b.ausgabe))}\n    ist:      ${JSON.stringify(ist)}`);
  }
  if (b.ausgabe === undefined && !b.ausgabeVariabel) warn(wo, 'Beispiel ohne erwartete Ausgabe');
}

async function pruefeAufgabe(wo: string, a: Aufgabe) {
  pruefeText(wo, a.erklaerung);
  for (const h of a.hinweise ?? []) pruefeText(wo, h);
  for (const t of a.themen) if (!THEMEN[t]) err(wo, `unbekanntes Thema «${t}»`);
  if (a.themen.length === 0) err(wo, 'keine Themen angegeben');
  switch (a.typ) {
    case 'auswahl': {
      pruefeText(wo, a.frage);
      const richtige = a.optionen.filter((o) => o.richtig).length;
      if (richtige === 0) err(wo, 'keine richtige Option');
      if (!a.mehrfach && richtige !== 1) err(wo, `Einfachauswahl mit ${richtige} richtigen Optionen`);
      if (a.code) await kompiliertOderAusschnitt(wo, a.code);
      break;
    }
    case 'wahrfalsch':
      pruefeText(wo, a.aussage);
      if (a.code) await kompiliertOderAusschnitt(wo, a.code);
      break;
    case 'eingabe':
      pruefeText(wo, a.frage);
      if (a.antworten.length === 0) err(wo, 'keine akzeptierten Antworten');
      break;
    case 'zuordnen': {
      pruefeText(wo, a.frage);
      if (a.paare.length < 3) warn(wo, 'weniger als 3 Paare');
      const rechts = new Set(a.paare.map((p) => p.rechts));
      if (rechts.size !== a.paare.length) err(wo, 'rechte Seiten nicht eindeutig');
      break;
    }
    case 'vorhersage': {
      const c = await exec.compile({ 'main.c': a.code });
      if (!c.ok || !c.wasm) return err(wo, `kompiliert nicht: ${meldungen(c, 'error').join('; ')}`);
      if (meldungen(c, 'warning').length > 0) warn(wo, `Warnungen: ${meldungen(c, 'warning').join('; ')}`);
      const r = await exec.run(c.wasm, { stdin: a.stdin ?? '' });
      // Vorhergesagt wird nur die Ausgabe des Programms, ohne das Echo der Eingabe.
      const ist = normalisiereAusgabe(r.stdout);
      if (r.end !== 'exit') err(wo, `Lauf endete mit ${r.end}`);
      else if (ist !== normalisiereAusgabe(a.ausgabe)) err(wo, `Ausgabe weicht ab.\n    erwartet: ${JSON.stringify(normalisiereAusgabe(a.ausgabe))}\n    ist:      ${JSON.stringify(ist)}`);
      break;
    }
    case 'luecke': {
      pruefeText(wo, a.frage);
      const anzahl = [...a.code.matchAll(/__(\d+)__/g)].length;
      if (anzahl !== a.luecken.length) err(wo, `${anzahl} Lücken im Code, aber ${a.luecken.length} Lösungen`);
      const code = fuelleLuecken(a.code, a.luecken.map((l) => l[0]));
      if (/\bmain\s*\(/.test(code)) {
        const c = await exec.compile({ 'main.c': code });
        if (!c.ok || !c.wasm) return err(wo, `ausgefüllter Code kompiliert nicht: ${meldungen(c, 'error').join('; ')}`);
        if (meldungen(c, 'warning').length > 0) warn(wo, `Warnungen: ${meldungen(c, 'warning').join('; ')}`);
        if (a.ausgabe !== undefined) {
          const r = await exec.run(c.wasm, { stdin: a.stdin ?? '' });
          if (normalisiereAusgabe(r.stdout) !== normalisiereAusgabe(a.ausgabe)) err(wo, `Ausgabe weicht ab: ${JSON.stringify(r.stdout)}`);
        }
      } else if (a.ausgabe !== undefined) err(wo, 'ausgabe angegeben, aber kein vollständiges Programm');
      break;
    }
    case 'puzzle': {
      pruefeText(wo, a.frage);
      const code = puzzleProgramm(a.zeilen);
      if (/\bmain\s*\(/.test(code)) {
        const c = await exec.compile({ 'main.c': code });
        if (!c.ok || !c.wasm) return err(wo, `Puzzle-Programm kompiliert nicht: ${meldungen(c, 'error').join('; ')}`);
        if (a.ausgabe !== undefined) {
          const r = await exec.run(c.wasm, { stdin: '' });
          if (normalisiereAusgabe(r.stdout) !== normalisiereAusgabe(a.ausgabe)) err(wo, `Ausgabe weicht ab: ${JSON.stringify(r.stdout)}`);
        }
      }
      if (new Set(a.zeilen).size !== a.zeilen.length) warn(wo, 'doppelte Zeilen im Puzzle (Reihenfolge nicht eindeutig)');
      break;
    }
    case 'programm':
    case 'fehlersuche':
    case 'erweitern': {
      pruefeText(wo, a.aufgabe);
      for (const t of a.tests) pruefeText(wo, t.tipp);
      if (a.tests.length === 0) err(wo, 'keine Tests');
      const loesung = await pruefeProgramm(a, dateienAus(a.loesung), exec);
      if (!loesung.compile.ok) return err(wo, `Musterlösung kompiliert nicht:\n    ${meldungen(loesung.compile, 'error').join('\n    ')}`);
      const w = meldungen(loesung.compile, 'warning');
      if (w.length > 0) err(wo, `Musterlösung hat Warnungen:\n    ${w.join('\n    ')}`);
      for (const t of loesung.tests) {
        if (!t.ok) {
          let extra = '';
          if (t.run?.trap) {
            const comp = await exec.compile(dateienAus(a.loesung));
            if (comp.wasm) extra = ` ${JSON.stringify((await locate(comp.wasm, t.run.trap.offsets)).frames)}`;
          }
          err(wo, `Musterlösung besteht Test «${t.test.name}» nicht: ${t.gruende.join(' ')}${extra}\n    Ausgabe: ${JSON.stringify(t.run?.stdout ?? '')}`);
        }
      }
      for (const r of pruefeRegeln(dateienAus(a.loesung), a.regeln)) if (!r.ok) err(wo, `Musterlösung verletzt Regel: ${r.regel.meldung}`);
      const start = await pruefeProgramm(a, dateienAus(a.start), exec);
      if (start.bestanden) err(wo, 'Startcode besteht bereits alle Tests');
      break;
    }
  }
}

async function kompiliertOderAusschnitt(wo: string, code: string) {
  if (!/\bmain\s*\(/.test(code)) return;
  const c = await exec.compile({ 'main.c': code });
  if (!c.ok) warn(wo, `Code in der Frage kompiliert nicht: ${meldungen(c, 'error').join('; ')}`);
}

function pruefeStruktur(l: Lektion) {
  const wo = l.id;
  if (l.lernziele.length < 2) err(wo, 'weniger als 2 Lernziele');
  if (l.erklaerung.length < 400) warn(wo, `Erklärung sehr kurz (${l.erklaerung.length} Zeichen)`);
  if (l.syntax.length === 0) err(wo, 'keine Syntax');
  if (l.zeilen.length < 3) err(wo, 'weniger als 3 Zeilenerklärungen');
  if (l.fehler.length < 2) err(wo, 'weniger als 2 häufige Fehler');
  if (l.uebungen.length < 3) err(wo, 'weniger als 3 Übungen');
  if (!l.uebungen.some((u) => u.typ === 'programm' || u.typ === 'fehlersuche' || u.typ === 'erweitern')) err(wo, 'keine Programmier-Übung');
  if (l.wissenscheck.length < 3) err(wo, 'weniger als 3 Fragen im Wissenscheck');
  if (l.zusammenfassung.length < 3) err(wo, 'weniger als 3 Punkte in der Zusammenfassung');
  if (!l.ergebnis.trim()) err(wo, 'Ergebnis fehlt');
  for (const t of [l.erklaerung, l.ergebnis, ...l.lernziele, ...l.zusammenfassung, ...l.syntax.map((s) => s.text ?? ''), ...l.zeilen.map((z) => z.text), ...l.fehler.map((f) => f.text + f.titel)]) pruefeText(wo, t);
  const code = Object.values(dateienAus(l.beispiel.code))[0];
  const zeilen = code.split('\n').length;
  for (const z of l.zeilen) {
    for (const teil of z.zeilen.split(',')) {
      const m = /^(\d+)(?:-(\d+))?$/.exec(teil.trim());
      if (!m) err(wo, `ungültige Zeilenangabe «${z.zeilen}»`);
      else if (Number(m[2] ?? m[1]) > zeilen) err(wo, `Zeilenangabe ${z.zeilen} liegt hinter dem Ende des Beispiels (${zeilen} Zeilen)`);
    }
  }
  const unstufen = l.uebungen.filter((u) => !u.stufe);
  if (unstufen.length > 0) warn(wo, `Übungen ohne Stufe: ${unstufen.map((u) => u.id).join(', ')}`);
}

// ---------- Ablauf ----------

const ids = new Set<string>();
const neueId = (id: string) => {
  if (ids.has(id)) err(id, 'ID doppelt vergeben');
  ids.add(id);
};
for (const k of KAPITEL) {
  neueId(k.id);
  for (const l of k.lektionen) {
    neueId(l.id);
    for (const a of [...l.uebungen, ...l.wissenscheck]) neueId(a.id);
  }
  for (const a of k.test) neueId(a.id);
}
const lektionIds = new Set(KAPITEL.flatMap((k) => k.lektionen.map((l) => l.id)));
const refIds = new Set<string>();
for (const r of REFERENZ) {
  if (refIds.has(r.id)) err(`ref:${r.id}`, 'ID doppelt vergeben');
  refIds.add(r.id);
  for (const l of r.lektionen) if (!lektionIds.has(l)) err(`ref:${r.id}`, `verweist auf unbekannte Lektion ${l}`);
}
for (const k of KAPITEL) for (const l of k.lektionen) for (const r of l.referenz ?? []) if (!refIds.has(r)) err(l.id, `verweist auf unbekannten Bibliothekseintrag ${r}`);

const started = performance.now();
let geprueft = 0;

async function pruefeKapitel(k: Kapitel) {
  for (const l of k.lektionen) {
    pruefeStruktur(l);
    await pruefeBeispiel(`${l.id} Beispiel`, l.beispiel);
    for (const a of [...l.uebungen, ...l.wissenscheck]) {
      await pruefeAufgabe(a.id, a);
      geprueft++;
    }
    process.stdout.write(`  ${l.id} ${l.titel}\n`);
  }
  if (k.test.length < 15) warn(k.id, `Testpool hat nur ${k.test.length} Fragen (Ziel: mindestens 15)`);
  for (const a of k.test) {
    await pruefeAufgabe(a.id, a);
    geprueft++;
  }
}

for (const k of KAPITEL) {
  if (filter && filter !== 'ref' && !k.id.startsWith(filter)) continue;
  if (filter === 'ref') continue;
  console.log(`Kapitel ${k.nr}: ${k.titel}`);
  await pruefeKapitel(k);
}
if (!filter || filter === 'ref') {
  console.log(`Bibliothek: ${REFERENZ.length} Einträge`);
  for (const r of REFERENZ) {
    pruefeText(`ref:${r.id}`, r.kurz);
    for (const f of r.fehler ?? []) pruefeText(`ref:${r.id}`, f);
    if (r.beispiel) await pruefeBeispiel(`ref:${r.id}`, r.beispiel);
    geprueft++;
  }
}

await (worker as Worker | null)?.terminate();
console.log(`\n${geprueft} Aufgaben und Einträge geprüft in ${Math.round((performance.now() - started) / 1000)} s.`);
if (warnungen.length) console.log(`\n${warnungen.length} Warnungen:\n${warnungen.join('\n')}`);
if (fehler.length) {
  console.log(`\n${fehler.length} Fehler:\n${fehler.join('\n')}`);
  process.exit(1);
}
console.log('Alles in Ordnung.');
