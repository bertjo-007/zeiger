# Zeiger – Arbeitsstand

Plan: `C:\Users\bertj\.claude\plans\pasted-content-id-1011-projekt-synchronous-marble.md`

## Konventionen für Inhalte

- Eine Lektion = eine Datei `src/content/kNN/lMM-name.ts`, exportiert `lektion: Lektion`.
  Kapitel-Index `kNN/index.ts`, Testpool `kNN/test.ts` (Ziel: 15 bis 20 Fragen).
- IDs: Lektion `kNN-lMM`, Übung `kNN-lMM-uX`, Wissenscheck `kNN-lMM-cX`, Test `kNN-tXX`.
- Tags: `c` für C-Code, `md` für Markdown, `out` für Programmausgaben.
  - In `c`/`md`/`out`-Templates gilt String.raw: C-Escapes einfach schreiben (`\n`),
    Backticks als \` escapen, Codeblöcke in Markdown mit `~~~c … ~~~`.
  - In normalen JS-Strings ('…'): `\\n` für ein sichtbares `\n`; echte Zeilenumbrüche
    in Test-Erwartungen (`stdout: 'a\n'`) sind gewollt.
- Ausgaben inklusive Eingabe-Echo: Bei Beispielen mit `stdin` steht in `ausgabe` die
  Terminal-Ansicht (Eingabe erscheint nach der Aufforderung, mit Zeilenumbruch).
- Schweizer Schreibweise (ss), keine Gedankenstriche (— –) im sichtbaren Text.
- Themen-Schlagwörter nur aus `THEMEN` in `src/content/kurs.ts`.
- Beispiele aus Technik/Automation/Mikrocontroller (Sensoren, Motoren, Encoder, Ampel,
  Förderband, Tank, RC-Truck). Keine Namen wie «John Doe».
- Jede Lektion: Lernziele ≥ 2, Syntax, Beispiel (vollständig + `ausgabe`), Zeilen ≥ 3,
  Fehler ≥ 2, Übungen ≥ 3 (mind. eine Programmieraufgabe, Stufen 1 bis 3),
  Wissenscheck ≥ 3, Zusammenfassung ≥ 3.
- Nach jedem Kapitel: `node scripts/validate-content.ts kNN`.

## Kursgliederung (Soll)

1. Einstieg in C: l01 Was ist C? · l02 Aufbau, main · l03 printf und Escape-Sequenzen ·
   l04 Kommentare · l05 Header und #include · l06 Kompilieren und Ausführen (inkl. Windows-Setup) ·
   l07 Erstes eigenes Programm
2. Variablen und Datentypen: l01 Variablen · l02 Ganzzahlen (inkl. stdint) · l03 float/double ·
   l04 char und ASCII · l05 Bits, Bytes, Binär/Hex · l06 Konstanten und Namensregeln ·
   l07 Platzhalter/Formatierung · l08 Typumwandlung
3. Benutzereingaben: l01 scanf · l02 Leerzeichen/Zeilenumbrüche/Puffer · l03 Eingaben prüfen ·
   l04 fgets und strtol
4. Operatoren: l01 Arithmetik · l02 Zuweisung, ++/-- · l03 Vergleiche · l04 Logik ·
   l05 Rangfolge und math.h
5. Bedingungen: l01 if · l02 else/else if/verschachtelt · l03 switch · l04 ternär ·
   l05 Zustandsautomat
6. Schleifen: l01 while · l02 do-while · l03 for · l04 Zähler/Summen/Min/Max ·
   l05 verschachtelt · l06 break/continue/Endlosschleifen
7. Funktionen: l01 eigene Funktionen · l02 Parameter, Rückgabe, void · l03 Prototypen ·
   l04 lokal/global · l05 Wertübergabe · l06 Aufteilen und main(argc, argv)
8. Arrays und Zeichenketten: l01 Arrays · l02 durchlaufen, an Funktionen · l03 mehrdimensional ·
   l04 Arraygrenzen · l05 Strings als char-Arrays · l06 string.h · l07 suchen, zerlegen, umwandeln
9. Pointer: l01 Speicher und Adressen · l02 & und * · l03 Pointer als Parameter ·
   l04 Pointer und Arrays · l05 Funktionszeiger · l06 häufige Pointerfehler
10. Speicherverwaltung: l01 Stack und Heap · l02 malloc/free · l03 calloc/realloc ·
    l04 Speicherlecks · l05 Fehler erkennen
11. Strukturen: l01 struct · l02 typedef · l03 Arrays aus Strukturen · l04 Pointer auf Strukturen ·
    l05 enum · l06 union und Bitfelder
12. Dateien: l01 fopen/fclose · l02 zeichen-/zeilenweise · l03 fprintf/fscanf ·
    l04 Fehlerbehandlung · l05 Projekt Messwert-Logger
13. Präprozessor: l01 #define und Makros · l02 bedingte Kompilierung, vordefinierte Makros ·
    l03 eigene Header · l04 mehrere C-Dateien · l05 Kompilieren, Linken, Makefiles
14. Weitere Grundlagen: l01 Gültigkeit und Lebensdauer · l02 static/extern · l03 Rekursion ·
    l04 Bitoperatoren · l05 Fehlerbehandlung · l06 Zeit und Zufall · l07 Warnungen und Stil
15. Ausblick Mikrocontroller: l01 Register und volatile · l02 Superloop und Zustandsautomat ·
    l03 Interrupts · l04 Ringpuffer · l05 Entprellen und Encoder
16. Abschlussprojekte: l01 Lagerverwaltung · l02 Motorsteuerung · l03 Messwert-Statistik

## Stand

- Plattform, Compiler, Prüfskript: fertig (siehe README).
- Inhalte: siehe Tabelle unten (wird nachgeführt).

| Kapitel | Lektionen | Test | Geprüft |
|---|---|---|---|
| 1 | 1/7 | 3/15 | ja |
