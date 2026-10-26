import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k07-l03',
  titel: 'Funktionsprototypen',
  dauer: 20,
  stichwoerter: ['Prototyp', 'Deklaration', 'Definition', 'Signatur', 'Vorwärtsdeklaration', 'Funktionskopf', 'Header'],
  lernziele: [
    'den Unterschied zwischen Deklaration (Prototyp) und Definition erklären',
    'Prototypen schreiben, damit Funktionen in beliebiger Reihenfolge stehen können',
    'die Fehlermeldungen bei fehlenden oder falschen Prototypen deuten',
  ],
  erklaerung: md`
    Der Compiler muss eine Funktion kennen, bevor sie aufgerufen wird. Bisher haben wir sie deshalb über \`main\` geschrieben. Bei vielen Funktionen, die sich gegenseitig aufrufen, ist das unpraktisch; ausserdem möchte man \`main\` oft **oben** sehen, weil es den Überblick gibt.

    Die Lösung ist ein **Prototyp**: der Funktionskopf mit Strichpunkt, ohne Rumpf.

    ~~~c
    double leistung(double spannung, double strom);   // Prototyp (Deklaration)
    ~~~

    Er sagt dem Compiler: «Es gibt eine Funktion mit diesem Namen, diesen Parametertypen und diesem Rückgabetyp; der Code kommt später.» Damit kann er jeden Aufruf prüfen: Stimmen Anzahl und Typen der Argumente?

    | Begriff | Beispiel | Bedeutung |
    |---|---|---|
    | Deklaration (Prototyp) | \`int max(int a, int b);\` | Ankündigung, ohne Code |
    | Definition | \`int max(int a, int b) { … }\` | der eigentliche Code |

    Eine Funktion darf mehrfach deklariert, aber nur **einmal** definiert werden. Prototyp und Definition müssen genau zusammenpassen; sonst meldet Clang «conflicting types».

    ### Übliche Anordnung

    1. \`#include\`-Zeilen
    2. Konstanten
    3. Prototypen aller eigenen Funktionen
    4. \`main\`
    5. Definitionen der Funktionen

    Bei grösseren Projekten wandern die Prototypen in eine **eigene Header-Datei** (\`.h\`). Genau so funktionieren auch \`stdio.h\` und \`math.h\`: Sie enthalten die Prototypen von \`printf\`, \`sqrt\` usw. Mehr dazu in Kapitel 13.

    > [!tipp] Namen in Prototypen
    > Die Parameternamen im Prototyp sind formal optional (\`int max(int, int);\`). Sie helfen aber beim Lesen, und Editoren zeigen sie beim Aufruf an. Schreib sie hin.
  `,
  syntax: [
    {
      code: c`
        rueckgabetyp name(typ1 param1, typ2 param2);   // Prototyp, mit ;

        int main(void) {
            name(…);                                   // Aufruf
        }

        rueckgabetyp name(typ1 param1, typ2 param2) {  // Definition
            …
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      // Prototypen
      double mittelwert(int summe, int anzahl);
      void zeige_ergebnis(double wert);

      int main(void) {
          int summe = 0, anzahl = 0, wert = 0;
          while (scanf("%d", &wert) == 1) {
              summe += wert;
              anzahl++;
          }
          zeige_ergebnis(mittelwert(summe, anzahl));
          return 0;
      }

      // Definitionen
      double mittelwert(int summe, int anzahl) {
          if (anzahl == 0) {
              return 0.0;
          }
          return (double)summe / anzahl;
      }

      void zeige_ergebnis(double wert) {
          printf("Mittelwert: %.2f\n", wert);
      }
    `,
    stdin: '12 15 11 18\n',
    ausgabe: out`
      12 15 11 18
      Mittelwert: 14.00
    `,
  },
  zeilen: [
    { zeilen: '3-5', text: md`Die Prototypen kündigen beide Funktionen an. Ab hier darf man sie aufrufen.` },
    { zeilen: '7-15', text: md`\`main\` steht oben und gibt den Überblick über den Ablauf.` },
    { zeilen: '18-23', text: md`Die Definition muss genau zum Prototyp passen: gleicher Name, gleiche Typen.` },
  ],
  ergebnis: md`
    Obwohl die Funktionen erst nach \`main\` definiert sind, übersetzt das Programm fehlerfrei. Lösche zum Test die Prototypen: Dann meldet Clang «call to undeclared function».
  `,
  fehler: [
    {
      titel: 'Strichpunkt vergessen',
      text: md`Ohne \`;\` erwartet der Compiler nach dem Prototyp einen Rumpf.`,
    },
    {
      titel: 'Prototyp und Definition passen nicht',
      text: md`Ein anderer Typ eines Parameters oder des Rückgabewerts führt zu «conflicting types».`,
      falsch: c`
        int flaeche(int a, int b);
        double flaeche(double a, double b) { return a * b; }
      `,
      richtig: c`
        double flaeche(double a, double b);
        double flaeche(double a, double b) { return a * b; }
      `,
    },
    {
      titel: 'Nur Prototyp, keine Definition',
      text: md`Fehlt die Definition, übersetzt der Compiler zwar, aber der **Linker** meldet «undefined symbol».`,
    },
  ],
  uebungen: [
    {
      id: 'k07-l03-u1',
      typ: 'luecke',
      titel: 'Prototyp ergänzen',
      stufe: 1,
      themen: ['funktionen'],
      frage: 'Ergänze den Prototyp, damit das Programm übersetzt.',
      code: c`
        #include <stdio.h>

        __1__;

        int main(void) {
            printf("%d\n", doppelt(21));
            return 0;
        }

        int doppelt(int x) {
            return 2 * x;
        }
      `,
      luecken: [['int doppelt(int x)', 'int doppelt(int)']],
      ausgabe: '42\n',
    },
    {
      id: 'k07-l03-u2',
      typ: 'fehlersuche',
      titel: 'Widersprüchliche Typen',
      stufe: 2,
      themen: ['funktionen'],
      aufgabe: md`
        Das Programm rechnet Millimeter in Zoll um (1 Zoll = 25.4 mm) und soll \`50.0 mm = 1.97 Zoll\` ausgeben. Prototyp und Definition passen nicht zusammen. Korrigiere den Prototyp.
      `,
      start: c`
        #include <stdio.h>

        int mm_zu_zoll(int mm);

        int main(void) {
            printf("50.0 mm = %.2f Zoll\n", mm_zu_zoll(50.0));
            return 0;
        }

        double mm_zu_zoll(double mm) {
            return mm / 25.4;
        }
      `,
      loesung: c`
        #include <stdio.h>

        double mm_zu_zoll(double mm);

        int main(void) {
            printf("50.0 mm = %.2f Zoll\n", mm_zu_zoll(50.0));
            return 0;
        }

        double mm_zu_zoll(double mm) {
            return mm / 25.4;
        }
      `,
      tests: [{ name: 'Umrechnung', erwartet: { stdout: '50.0 mm = 1.97 Zoll\n' } }],
      hinweise: [md`Lies die Fehlermeldung «conflicting types» und vergleiche die beiden Köpfe.`],
    },
    {
      id: 'k07-l03-u3',
      typ: 'programm',
      titel: 'main zuerst',
      stufe: 2,
      themen: ['funktionen'],
      aufgabe: md`
        Schreibe ein Programm, in dem \`main\` **vor** den Funktionen steht. Es gibt es zwei Funktionen:

        - \`int sekunden(int stunden, int minuten)\` rechnet eine Zeit in Sekunden um;
        - \`void zeige(int s)\` gibt \`<s> s\` aus.

        \`main\` liest Stunden und Minuten ein und ruft beide auf. Bei \`1 30\`: \`5400 s\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int h = 0, m = 0;
            scanf("%d %d", &h, &m);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int sekunden(int stunden, int minuten);
        void zeige(int s);

        int main(void) {
            int h = 0, m = 0;
            scanf("%d %d", &h, &m);
            zeige(sekunden(h, m));
            return 0;
        }

        int sekunden(int stunden, int minuten) {
            return stunden * 3600 + minuten * 60;
        }

        void zeige(int s) {
            printf("%d s\n", s);
        }
      `,
      tests: [
        { name: '1 h 30 min', stdin: '1 30\n', erwartet: { stdout: '5400 s\n' } },
        { name: '0 h 1 min', stdin: '0 1\n', erwartet: { stdout: '60 s\n' } },
      ],
      regeln: [
        { muss: 'int\\s+sekunden\\s*\\([^)]*\\)\\s*;', meldung: 'Schreibe einen Prototyp für `sekunden`.' },
        { muss: 'int\\s+main[\\s\\S]*int\\s+sekunden\\s*\\([^)]*\\)\\s*\\{', meldung: 'Die Definition von `sekunden` soll nach `main` stehen.' },
      ],
      hinweise: [md`Prototypen über \`main\`, Definitionen darunter.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k07-l03-c1',
      typ: 'auswahl',
      themen: ['funktionen'],
      frage: 'Was ist ein Funktionsprototyp?',
      optionen: [{ text: 'Der Funktionskopf mit Strichpunkt, ohne Rumpf', richtig: true }, { text: 'Eine leere Funktion' }, { text: 'Die erste Version einer Funktion' }],
    },
    {
      id: 'k07-l03-c2',
      typ: 'wahrfalsch',
      themen: ['funktionen'],
      aussage: 'Eine Funktion darf mehrmals deklariert, aber nur einmal definiert werden.',
      richtig: true,
    },
    {
      id: 'k07-l03-c3',
      typ: 'auswahl',
      themen: ['funktionen', 'kompilieren'],
      frage: 'Es gibt einen Prototyp, aber keine Definition. Wer meldet den Fehler?',
      optionen: [{ text: 'Der Linker', richtig: true }, { text: 'Der Präprozessor' }, { text: 'Niemand' }],
    },
  ],
  zusammenfassung: [
    'Prototyp = Funktionskopf mit `;`; er kündigt die Funktion an.',
    'Mit Prototypen dürfen Definitionen in beliebiger Reihenfolge stehen.',
    'Prototyp und Definition müssen genau übereinstimmen.',
    'Header-Dateien wie `stdio.h` bestehen grösstenteils aus Prototypen.',
  ],
  referenz: ['funktion'],
};
