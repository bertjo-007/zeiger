/**
 * Datenmodell der Lerninhalte.
 *
 * Jede Lektion hat dieselben zehn Teile; der Typ erzwingt sie, damit keine
 * Lektion einen Teil vergisst. Texte sind Markdown (`Md`). Code steht in
 * Template-Strings mit dem Tag `c` bzw. `md` (siehe tags.ts), damit `\n` in
 * C-Strings erhalten bleibt.
 *
 * Diese Datei läuft auch in Node (Prüfskript) und darf darum nur Typen und
 * reines TypeScript ohne Enums oder Parameter-Properties enthalten.
 */

/** Markdown-Text. Unterstützt Inline-Code, Listen, Tabellen, Codeblöcke und Hinweis-Kästen (`> [!tipp]`). */
export type Md = string;

/** Schwierigkeitsstufe einer Übung. */
export type Stufe = 1 | 2 | 3;

export const STUFEN: Record<Stufe, string> = { 1: 'Einstieg', 2: 'Anwendung', 3: 'Anspruchsvoll' };

/** Quelldateien: Dateiname → Inhalt. Ein einzelner String steht für `main.c`. */
export type Code = string | Record<string, string>;

export interface Beispiel {
  /** Vollständiges Programm (ausführbar) oder Ausschnitt (nur Anzeige). */
  code: Code;
  /** Ausschnitt: wird angezeigt, aber nicht ausgeführt. */
  ausschnitt?: boolean;
  /** Eingabe, die beim Ausführen vorab eingetragen wird. */
  stdin?: string;
  args?: string[];
  /** Dateien im Arbeitsordner vor dem Lauf. */
  dateien?: Record<string, string>;
  /**
   * Erwartete Ausgabe, so wie sie im Terminal steht (inklusive der Eingaben).
   * Das Prüfskript vergleicht sie mit einem echten Lauf.
   */
  ausgabe?: string;
  /** Die Ausgabe hängt von Zeit oder Zufall ab und wird nicht verglichen. */
  ausgabeVariabel?: boolean;
  /** Das Beispiel zeigt absichtlich einen Fehler (Warnung, Compilerfehler oder Absturz). */
  fehlerErwartet?: 'warnung' | 'compiler' | 'laufzeit';
}

export interface Zeilenerklaerung {
  /** Zeilennummer oder Bereich, z. B. "4" oder "6-8". */
  zeilen: string;
  text: Md;
}

export interface HaeufigerFehler {
  titel: string;
  text: Md;
  falsch?: string;
  richtig?: string;
}

/** Vergleich eines Testlaufs. Alle angegebenen Bedingungen müssen stimmen. */
export interface Erwartung {
  /** Exakte Ausgabe (Leerzeichen am Zeilenende und Leerzeilen am Ende zählen nicht). */
  stdout?: string;
  /** Diese Textstücke müssen in der Ausgabe vorkommen. */
  enthaelt?: string[];
  /** Diese Textstücke dürfen nicht vorkommen. */
  enthaeltNicht?: string[];
  /** Regulärer Ausdruck (JavaScript-Syntax), der auf die ganze Ausgabe passen muss. */
  regex?: string;
  exitCode?: number;
  /** Erwarteter Inhalt von Dateien nach dem Lauf. */
  dateien?: Record<string, string>;
  /** Das Programm darf keine Speicherlecks und keine offenen Dateien hinterlassen. */
  sauber?: boolean;
}

export interface Testfall {
  name: string;
  stdin?: string;
  args?: string[];
  dateien?: Record<string, string>;
  erwartet: Erwartung;
  /** Hinweis, der erscheint, wenn genau dieser Test scheitert. */
  tipp?: Md;
}

/** Statische Regel über den Quelltext (Kommentare und Strings werden vorher entfernt). */
export interface Regel {
  /** Regulärer Ausdruck, der vorkommen muss. */
  muss?: string;
  /** Regulärer Ausdruck, der nicht vorkommen darf. */
  darfNicht?: string;
  /** Auch den Inhalt von Zeichenketten prüfen (z. B. Formatangaben wie `%-8s`). */
  inTexten?: boolean;
  meldung: Md;
}

interface AufgabeBasis {
  id: string;
  /** Kurzer Titel (für Übungen und Listen). */
  titel?: string;
  /** Themen-Schlagwörter für Schwächen und Wiederholung, z. B. "schleifen", "zeiger". */
  themen: string[];
  /** Erklärung, die nach der Auswertung erscheint. */
  erklaerung?: Md;
  /** Gestufte Hinweise. Danach wird die Musterlösung freigegeben. */
  hinweise?: Md[];
  stufe?: Stufe;
}

export interface Auswahl extends AufgabeBasis {
  typ: 'auswahl';
  frage: Md;
  code?: string;
  optionen: { text: Md; richtig?: boolean; warum?: Md }[];
  /** Mehrere richtige Antworten möglich. */
  mehrfach?: boolean;
}

export interface WahrFalsch extends AufgabeBasis {
  typ: 'wahrfalsch';
  aussage: Md;
  code?: string;
  richtig: boolean;
}

/** Kurze Freitextantwort, z. B. ein Platzhalter oder ein Wert. */
export interface Eingabe extends AufgabeBasis {
  typ: 'eingabe';
  frage: Md;
  code?: string;
  /** Akzeptierte Antworten (Gross-/Kleinschreibung und Leerzeichen am Rand egal). */
  antworten: string[];
  /** Gross-/Kleinschreibung beachten. */
  exakt?: boolean;
}

export interface Vorhersage extends AufgabeBasis {
  typ: 'vorhersage';
  frage?: Md;
  code: string;
  stdin?: string;
  /** Erwartete Ausgabe; wird vom Prüfskript mit einem echten Lauf verglichen. */
  ausgabe: string;
}

export interface Zuordnen extends AufgabeBasis {
  typ: 'zuordnen';
  frage: Md;
  paare: { links: Md; rechts: Md }[];
}

export interface Luecke extends AufgabeBasis {
  typ: 'luecke';
  frage: Md;
  /** Code mit Lücken als `__1__`, `__2__` … */
  code: string;
  /** Pro Lücke die akzeptierten Antworten (Leerzeichen werden normalisiert). */
  luecken: string[][];
  /**
   * Optional: Der ausgefüllte Code wird kompiliert und ausgeführt. Passt die
   * Ausgabe, gilt auch eine andere Schreibweise als richtig.
   */
  ausgabe?: string;
  stdin?: string;
}

export interface Puzzle extends AufgabeBasis {
  typ: 'puzzle';
  frage: Md;
  /** Zeilen in der richtigen Reihenfolge. */
  zeilen: string[];
  /** Zeilen, die nicht dazugehören. */
  ablenker?: string[];
  /** Erwartete Ausgabe des zusammengesetzten Programms (alternative Reihenfolgen gelten, wenn sie stimmt). */
  ausgabe?: string;
}

export interface Programm extends AufgabeBasis {
  typ: 'programm' | 'fehlersuche' | 'erweitern';
  aufgabe: Md;
  start: Code;
  loesung: Code;
  tests: Testfall[];
  regeln?: Regel[];
  /**
   * Test-Harness für Funktionsaufgaben. Wird mit `-Dmain=__schueler_main`
   * dazukompiliert; muss mit `#undef main` beginnen und ein eigenes main haben.
   */
  harness?: string;
  /** Dateien im Arbeitsordner (für Datei-Übungen). */
  dateien?: Record<string, string>;
  /** Eingabe, die beim freien Ausführen vorgeschlagen wird. */
  stdin?: string;
}

export type Aufgabe = Auswahl | WahrFalsch | Eingabe | Vorhersage | Zuordnen | Luecke | Puzzle | Programm;
export type AufgabenTyp = Aufgabe['typ'];

export const isCodeAufgabe = (a: Aufgabe): a is Programm => a.typ === 'programm' || a.typ === 'fehlersuche' || a.typ === 'erweitern';

export interface Lektion {
  id: string;
  titel: string;
  /** Ungefähre Dauer in Minuten. */
  dauer: number;
  /** Begriffe für die Suche. */
  stichwoerter: string[];
  /** 1. Lernziel: Was kann ich danach? */
  lernziele: Md[];
  /** 2. Einfache Erklärung. */
  erklaerung: Md;
  /** 3. Syntax: grundlegende Schreibweise. */
  syntax: { code: string; text?: Md }[];
  /** 4. Codebeispiel. */
  beispiel: Beispiel;
  /** 5. Zeile-für-Zeile-Erklärung. */
  zeilen: Zeilenerklaerung[];
  /** 6. Ergebnis: Was die Ausgabe zeigt (die Ausgabe selbst steht im Beispiel). */
  ergebnis: Md;
  /** 7. Häufige Fehler. */
  fehler: HaeufigerFehler[];
  /** 8. Übungen. */
  uebungen: Aufgabe[];
  /** 9. Wissenscheck. */
  wissenscheck: Aufgabe[];
  /** 10. Zusammenfassung. */
  zusammenfassung: Md[];
  /** Verwandte Einträge der Befehlsbibliothek. */
  referenz?: string[];
}

export interface Kapitel {
  id: string;
  nr: number;
  titel: string;
  kurz: Md;
  lektionen: Lektion[];
  /** Fragenpool für den Kapiteltest. */
  test: Aufgabe[];
}

export type ReferenzKategorie =
  | 'schluesselwort'
  | 'operator'
  | 'datentyp'
  | 'praeprozessor'
  | 'funktion'
  | 'makro'
  | 'format'
  | 'escape'
  | 'konstrukt';

export const KATEGORIEN: Record<ReferenzKategorie, { titel: string; text: string }> = {
  schluesselwort: { titel: 'Schlüsselwort', text: 'Fest eingebautes Wort der Sprache C.' },
  operator: { titel: 'Operator', text: 'Zeichen, das Werte verknüpft oder verändert.' },
  datentyp: { titel: 'Datentyp', text: 'Art eines Werts und sein Speicherbedarf.' },
  praeprozessor: { titel: 'Präprozessor', text: 'Anweisung an den Präprozessor, läuft vor dem Kompilieren.' },
  funktion: { titel: 'Bibliotheksfunktion', text: 'Funktion aus der Standardbibliothek, kein Teil der Sprache selbst.' },
  makro: { titel: 'Makro oder Konstante', text: 'Vordefinierter Wert aus einem Header der Standardbibliothek, z. B. EXIT_SUCCESS oder INT_MAX.' },
  format: { titel: 'Formatangabe', text: 'Platzhalter in den Formattexten von printf und scanf.' },
  escape: { titel: 'Escape-Sequenz', text: 'Sonderzeichen in Zeichen- und Textkonstanten.' },
  konstrukt: { titel: 'Sprachkonstrukt', text: 'Aufbau aus mehreren Teilen der Sprache.' },
};

export interface ReferenzEintrag {
  id: string;
  name: string;
  kategorie: ReferenzKategorie;
  /** Header-Datei, bei Bibliotheksfunktionen und Typen aus der Bibliothek. */
  header?: string;
  kurz: Md;
  syntax: string;
  beispiel?: Beispiel;
  fehler?: Md[];
  /** IDs der Lektionen, in denen das Thema behandelt wird. */
  lektionen: string[];
  /** Begriffe für die Suche. */
  stichwoerter?: string[];
  /** Veraltet oder unsicher: Erklärung und bessere Alternative. */
  veraltet?: Md;
}
