# Zeiger: Arbeitsstand

Plan: `C:\Users\bertj\.claude\plans\pasted-content-id-1011-projekt-synchronous-marble.md`

## Konventionen für Inhalte

- Eine Lektion = eine Datei `src/content/kNN/lMM-name.ts`, exportiert `lektion: Lektion`.
  Kapitel-Index `kNN/index.ts`, Testpool `kNN/test.ts` (Ziel: 15 bis 20 Fragen).
  Neues Kapitel in `src/content/kurs.ts` eintragen.
- IDs: Lektion `kNN-lMM`, Übung `kNN-lMM-uX`, Wissenscheck `kNN-lMM-cX`, Test `kNN-tXX`.
- Tags: `c` für C-Code, `md` für Markdown, `out` für Programmausgaben.
  - In `c`/`md`/`out`-Templates gilt String.raw: C-Escapes einfach schreiben (`\n`),
    Backticks als \` escapen, Codeblöcke in Markdown mit `~~~c … ~~~`.
  - In normalen JS-Strings ('…'): `\\n` für ein sichtbares `\n`; echte Zeilenumbrüche
    in Test-Erwartungen (`stdout: 'a\n'`) sind gewollt.
  - `out` entfernt die gemeinsame Einrückung. Beginnen **alle** Ausgabezeilen mit
    Leerzeichen, einen normalen String nehmen.
- Ausgaben inklusive Eingabe-Echo: Bei Beispielen mit `stdin` steht in `ausgabe` die
  Terminal-Ansicht (Eingabe erscheint nach der Aufforderung, mit Zeilenumbruch).
- Zeilenangaben in `zeilen` zählen ab der ersten Codezeile (`#include` = 1).
- Funktionsaufgaben: `harness` beginnt mit `#undef main`, deklariert Typen und
  Prototypen selbst und hat ein eigenes `main`.
- Speicher: `erwartet.sauber: true` verlangt, dass kein Block und keine Datei offen bleibt.
- Schweizer Schreibweise (ss), keine Gedankenstriche im sichtbaren Text.
- Themen-Schlagwörter nur aus `THEMEN` in `src/content/kurs.ts`.
- Beispiele aus Technik/Automation/Mikrocontroller (Sensoren, Motoren, Encoder, Ampel,
  Förderband, Tank). Keine Namen wie «John Doe».
- Vorhersage-Aufgaben: keine Parameter, die nur gesetzt und nie gelesen werden
  (`-Wunused-but-set-parameter`); die Prüfung verlangt null Warnungen.
- Nach jedem Kapitel: `node scripts/validate-content.ts kNN` und `npm test`.

## Stand (26.10.2026)

Umfang auf Wunsch von Joshua: bis und mit Kapitel 11 (strukturierte Datentypen).

| Kapitel | Titel | Lektionen | Übungen | Testpool |
|---|---|---|---|---|
| 1 | Einstieg in C | 7 | 27 | 18 |
| 2 | Variablen und Datentypen | 8 | 30 | 16 |
| 3 | Benutzereingaben | 4 | 13 | 15 |
| 4 | Operatoren | 5 | 17 | 16 |
| 5 | Bedingungen | 5 | 17 | 15 |
| 6 | Schleifen | 6 | 20 | 15 |
| 7 | Funktionen | 6 | 19 | 15 |
| 8 | Arrays und Zeichenketten | 7 | 21 | 15 |
| 9 | Pointer | 6 | 18 | 15 |
| 10 | Speicherverwaltung | 5 | 15 | 15 |
| 11 | Strukturen und weitere Datentypen | 6 | 18 | 15 |

Bibliothek: 106 Einträge, alle 44 Schlüsselwörter von C17. Alle Inhalte mit
`validate-content` geprüft, Unit-Tests und E2E grün.

## Mögliche Fortsetzung

Nicht geschrieben, aber vorbereitet (Plattform kann Dateien, mehrere Quelldateien und
Präprozessor-Ansicht bereits):

12. Dateien: fopen/fclose · zeichen-/zeilenweise · fprintf/fscanf · Fehlerbehandlung ·
    Projekt Messwert-Logger (`Beispiel.dateien`, `Programm.dateien`, `Erwartung.dateien`)
13. Präprozessor: #define und Makros · bedingte Kompilierung · eigene Header ·
    mehrere C-Dateien (`Code` als Record) · Kompilieren, Linken, Makefiles
14. Weitere Grundlagen: Gültigkeit und Lebensdauer · static/extern · Rekursion ·
    Bitoperatoren · Fehlerbehandlung · Zeit und Zufall · Warnungen und Stil
15. Ausblick Mikrocontroller: Register und volatile · Superloop · Interrupts ·
    Ringpuffer · Entprellen und Encoder
16. Abschlussprojekte: Lagerverwaltung · Motorsteuerung · Messwert-Statistik

Vorverweise auf diese Kapitel sind im Text neutral formuliert («später»), damit
nichts ins Leere zeigt.
