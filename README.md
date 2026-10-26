# Zeiger

Interaktives Lernprogramm für die Programmiersprache C (Standard C17). Lektionen mit
einheitlichem Aufbau, ein echter C-Compiler im Browser, Übungen mit automatischer
Prüfung, Kapiteltests, Wiederholung nach Schwächen und eine durchsuchbare
Befehlsbibliothek. Die Beispiele stammen aus Sensorik, Motoren und Steuerungen.

**Live:** https://bertjo-007.github.io/zeiger/

## Was drin ist

- **11 Kapitel, 65 Lektionen:** von «Was ist C?» bis zu Strukturen, `enum`, `union`
  und Bitfeldern. Jede Lektion hat zehn Teile: Lernziel, Erklärung, Syntax,
  Codebeispiel, Zeile für Zeile, Ergebnis, häufige Fehler, Übungen, Wissenscheck und
  Zusammenfassung.
- **580 Aufgaben**, davon 157 Programmieraufgaben. Code schreiben, Fehler finden,
  Ausgabe vorhersagen, Lückentexte, Codepuzzle, Zuordnen, Auswahl. Programme werden
  mit Testfällen, statischen Regeln und bei Funktionsaufgaben mit einem versteckten
  Test-Harness geprüft. Hinweise kommen gestuft, danach die Musterlösung.
- **Kapiteltests** (12 aus 15 bis 18 Fragen, bestanden ab 80 %) und ein **Gesamttest**.
- **Wiederholen** mit FSRS: Falsches kommt bald wieder, Sicheres gelegentlich.
  Dazu ein Schwächen-Training nach Themen.
- **Befehlsbibliothek** mit 106 Einträgen: alle 44 Schlüsselwörter von C17,
  Operatoren, Datentypen, Bibliotheksfunktionen, Formatangaben, Escape-Sequenzen,
  Sprachkonstrukte und eine ASCII-Tabelle. Suche überall mit `Strg+K`.
- **Spielwiese** für eigene Programme, auch mit mehreren Dateien.

## Der Compiler im Browser

Kompiliert wird mit echtem Clang 22 als WebAssembly (`@yowasp/clang`), ausgeführt
mit `@bjorn3/browser_wasi_shim`. Es wird nichts installiert und kein Code an einen
Server geschickt.

```
clang -std=c17 -Wall -Wextra -pedantic -g main.c -o programm
```

Dazu kommen intern `--target=wasm32-wasip1 -O0` und
`-fsanitize=undefined -fsanitize-trap=undefined`. Damit meldet die App:

- Compilerfehler und Warnungen im Original plus deutscher Erklärung (rund 80 Muster)
- Laufzeitfehler mit Zeile und Grund: Arraygrenze, Nullzeiger, Überlauf,
  Division durch 0, zu tiefe Rekursion
- Speicherlecks, doppeltes `free` und nicht geschlossene Dateien
- Endlosschleifen nach einem einstellbaren Zeitlimit

Interaktives `scanf` funktioniert über `SharedArrayBuffer`. Dafür braucht die Seite
Cross-Origin-Isolation; auf GitHub Pages setzt der Service Worker die nötigen Header
(beim allerersten Besuch lädt die Seite einmal neu). Ohne Isolation gibt es ein Feld
für Eingaben vorab.

Der Compiler ist rund 100 MB gross und wird beim ersten Mal geladen, danach kommt er
aus dem Cache. Die App läuft dann auch offline.

Hinweis: Adressen und `long` haben hier 32 Bit. Auf einem 64-Bit-PC ist ein Zeiger
8 Byte gross. Die Lektionen sagen das an den betreffenden Stellen.

## Lernstand

Alles bleibt lokal im Browser (IndexedDB). Kein Konto, kein Server. Unter
Einstellungen lässt sich der Stand als JSON sichern und auf einem anderen Gerät
wieder einlesen.

## Entwicklung

```
npm ci
npm run dev          # http://127.0.0.1:5177
npm test             # Unit-Tests (Vitest)
npm run validate     # alle Beispiele und Lösungen mit dem echten Clang prüfen
npm run e2e          # Ablauftest mit Edge (startet den Dev-Server bei Bedarf)
npm run build:pages  # Build für GitHub Pages nach dist/pages
```

`npm run validate kNN` prüft ein einzelnes Kapitel, `npm run validate ref` die
Bibliothek. Das Skript kompiliert jedes Beispiel und vergleicht die Ausgabe, prüft,
dass jede Musterlösung ihre Tests besteht und jeder Startcode nicht, und dass
Lösungen ohne Warnung kompilieren.

### Aufbau

| Ordner | Inhalt |
|---|---|
| `src/compiler` | Compiler- und Laufzeit-Worker, Diagnosen, Laufzeitfehler, Speicherprüfung (`laufzeit.c`) |
| `src/editor` | CodeMirror-Editor, Ausgabebereich, Workbench |
| `src/exercises` | Auswertung der Aufgaben und ihre Oberfläche |
| `src/content` | Kapitel (`kNN/`), Bibliothek (`referenz/`), Typen |
| `src/progress` | Dexie-Datenbank, FSRS, Statistik, Sicherung |
| `src/ui` | Seiten und Shell |
| `scripts` | Inhaltsprüfung, Service-Worker-Vorlage, Icons |
| `tests`, `e2e` | Unit- und Browser-Tests |

Konventionen für neue Inhalte stehen in `PROGRESS.md`.

## Veröffentlichung

Jeder Push auf `main` läuft durch `.github/workflows/pages.yml`: Unit-Tests,
Inhaltsprüfung, Build und Deploy auf GitHub Pages.
