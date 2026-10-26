import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k01-l05',
  titel: 'Header-Dateien und #include',
  dauer: 20,
  stichwoerter: ['#include', 'Header', 'Headerdatei', '.h', 'Präprozessor', 'Standardbibliothek', 'stdio.h', 'stdlib.h', 'math.h', 'string.h', 'Deklaration'],
  lernziele: [
    'erklären, was der Präprozessor bei `#include` macht',
    'die wichtigsten Header der Standardbibliothek und ihre Funktionen kennen',
    '`#include <…>` und `#include "…"` unterscheiden',
  ],
  erklaerung: md`
    Wenn du \`printf\` aufrufst, muss der Compiler wissen, dass es diese Funktion gibt, welche Werte sie erwartet und was sie zurückgibt. Diese Beschreibung, die **Deklaration**, steht in einer **Header-Datei** mit der Endung \`.h\`. Mit \`#include\` holst du sie in dein Programm.

    ### Was #include genau tut

    Bevor der eigentliche Compiler loslegt, läuft der **Präprozessor** über den Quelltext. Er bearbeitet alle Zeilen, die mit \`#\` beginnen. Bei \`#include <stdio.h>\` ersetzt er diese Zeile wörtlich durch den Inhalt der Datei \`stdio.h\`. Erst danach wird übersetzt.

    > [!tipp] Selbst nachsehen
    > Klicke in der Werkbank auf «Präprozessor». Du siehst den Code so, wie ihn der Compiler bekommt: einige Hundert Zeilen aus \`stdio.h\` und ganz am Ende dein Programm.

    Der Header enthält nur die Beschreibung, nicht den Code der Funktion selbst. Der fertige Code von \`printf\` liegt in der **C-Standardbibliothek** und wird beim **Linken** dazugenommen (nächste Lektion).

    ### Wichtige Header der Standardbibliothek

    | Header | Enthält zum Beispiel |
    |---|---|
    | \`<stdio.h>\` | \`printf\`, \`puts\`, \`scanf\`, \`fopen\` (Ein- und Ausgabe) |
    | \`<stdlib.h>\` | \`EXIT_SUCCESS\`, \`malloc\`, \`free\`, \`rand\`, \`abs\` |
    | \`<math.h>\` | \`sqrt\`, \`pow\`, \`sin\`, \`fabs\`, \`round\` |
    | \`<string.h>\` | \`strlen\`, \`strcpy\`, \`strcmp\` (Zeichenketten) |
    | \`<ctype.h>\` | \`isdigit\`, \`toupper\` (einzelne Zeichen prüfen) |
    | \`<stdbool.h>\` | \`bool\`, \`true\`, \`false\` |
    | \`<stdint.h>\` | Typen mit fester Breite wie \`uint8_t\` (wichtig für Mikrocontroller) |
    | \`<limits.h>\` | Grenzwerte wie \`INT_MAX\` |
    | \`<time.h>\` | \`time\`, \`clock\` |

    Du musst sie nicht auswendig lernen. Die Befehlsbibliothek nennt bei jeder Funktion ihren Header.

    ### Spitze Klammern oder Anführungszeichen?

    - \`#include <stdio.h>\` sucht in den Verzeichnissen des Compilers. So bindest du Header der **Standardbibliothek** ein.
    - \`#include "motor.h"\` sucht **zuerst im eigenen Projekt**. So bindest du **eigene** Header ein.

    > [!praxis] Header bei Mikrocontrollern
    > Hersteller liefern Header mit, die Register und Pins beschreiben, etwa \`<avr/io.h>\` für AVR-Chips oder \`"stm32f4xx.h"\` für STM32. Das Prinzip ist genau dasselbe.
  `,
  syntax: [
    {
      code: c`
        #include <stdio.h>     // Header der Standardbibliothek
        #include "motor.h"     // eigener Header im Projekt
      `,
      text: md`Eine \`#include\`-Zeile pro Header, ganz oben in der Datei. **Kein** Strichpunkt am Ende: \`#include\` ist keine C-Anweisung, sondern ein Befehl an den Präprozessor.`,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>   // printf
      #include <math.h>    // sqrt, pow
      #include <stdlib.h>  // EXIT_SUCCESS

      int main(void) {
          printf("Wurzel aus 2: %.3f\n", sqrt(2.0));
          printf("2 hoch 10: %.0f\n", pow(2.0, 10.0));
          return EXIT_SUCCESS;
      }
    `,
    ausgabe: out`
      Wurzel aus 2: 1.414
      2 hoch 10: 1024
    `,
  },
  zeilen: [
    { zeilen: '1-3', text: md`Drei Header. Die Kommentare nennen, wofür jeder gebraucht wird. Das ist eine gute Gewohnheit.` },
    { zeilen: '6', text: md`\`sqrt\` aus \`<math.h>\` berechnet die Quadratwurzel. \`%.3f\` ist ein Platzhalter für eine Kommazahl mit 3 Nachkommastellen; genaueres folgt in Kapitel 2.` },
    { zeilen: '7', text: md`\`pow(2.0, 10.0)\` rechnet 2 hoch 10. \`%.0f\` gibt die Zahl ohne Nachkommastellen aus.` },
    { zeilen: '8', text: md`\`EXIT_SUCCESS\` kommt aus \`<stdlib.h>\` und hat den Wert 0.` },
  ],
  ergebnis: md`
    Die Wurzel aus 2 erscheint auf drei Stellen gerundet, 2 hoch 10 als ganze Zahl. Lösche zum Ausprobieren die Zeile \`#include <math.h>\` und führe das Programm aus: Clang meldet, dass \`sqrt\` und \`pow\` unbekannt sind, und schlägt den passenden Header vor.
  `,
  fehler: [
    {
      titel: 'Header vergessen',
      text: md`Ohne den passenden Header kennt der Compiler die Funktion nicht. Clang meldet «call to undeclared library function» und nennt in einer Notiz den fehlenden Header.`,
      falsch: c`
        int main(void) {
            printf("Hallo\n");
            return 0;
        }
      `,
      richtig: c`
        #include <stdio.h>

        int main(void) {
            printf("Hallo\n");
            return 0;
        }
      `,
    },
    {
      titel: 'Tippfehler im Namen',
      text: md`\`studio.h\` statt \`stdio.h\` ist ein Klassiker. Die Abkürzung steht für «standard input/output». Clang meldet «file not found».`,
      falsch: c`#include <studio.h>`,
      richtig: c`#include <stdio.h>`,
    },
    {
      titel: 'Strichpunkt nach #include',
      text: md`Präprozessor-Anweisungen enden ohne \`;\`. Ein Strichpunkt dahinter führt zu einer Warnung, weil er als überzähliges Zeichen gilt.`,
      falsch: c`#include <stdio.h>;`,
      richtig: c`#include <stdio.h>`,
    },
  ],
  uebungen: [
    {
      id: 'k01-l05-u1',
      typ: 'zuordnen',
      titel: 'Welcher Header?',
      stufe: 1,
      themen: ['praeprozessor'],
      frage: 'Welcher Header enthält die jeweilige Funktion oder Konstante?',
      paare: [
        { links: '`printf`', rechts: '`<stdio.h>`' },
        { links: '`sqrt`', rechts: '`<math.h>`' },
        { links: '`strlen`', rechts: '`<string.h>`' },
        { links: '`EXIT_FAILURE`', rechts: '`<stdlib.h>`' },
        { links: '`uint8_t`', rechts: '`<stdint.h>`' },
      ],
    },
    {
      id: 'k01-l05-u2',
      typ: 'fehlersuche',
      titel: 'Fehlende Header',
      stufe: 1,
      themen: ['praeprozessor'],
      aufgabe: md`
        Dieses Programm berechnet die Diagonale eines 3 × 4 Meter grossen Feldes, lässt sich aber nicht kompilieren. Ergänze die fehlenden Header. Erwartete Ausgabe:

        ~~~text
        Diagonale: 5.0 m
        ~~~
      `,
      start: c`
        int main(void) {
            printf("Diagonale: %.1f m\n", sqrt(3.0 * 3.0 + 4.0 * 4.0));
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <math.h>

        int main(void) {
            printf("Diagonale: %.1f m\n", sqrt(3.0 * 3.0 + 4.0 * 4.0));
            return 0;
        }
      `,
      tests: [{ name: 'Diagonale wird ausgegeben', erwartet: { stdout: 'Diagonale: 5.0 m\n' } }],
      hinweise: [md`Klicke auf «Ausführen» und lies die Notizen unter den Fehlermeldungen: Clang nennt den fehlenden Header.`, md`Du brauchst \`<stdio.h>\` für \`printf\` und \`<math.h>\` für \`sqrt\`.`],
    },
    {
      id: 'k01-l05-u3',
      typ: 'programm',
      titel: 'Potenzen von 2',
      stufe: 2,
      themen: ['praeprozessor', 'ausgabe'],
      aufgabe: md`
        Ein 8-Bit-Register kann 2⁸ verschiedene Werte speichern, ein 16-Bit-Register 2¹⁶. Gib mit \`pow\` aus \`<math.h>\` genau diese zwei Zeilen aus:

        ~~~text
        8 Bit: 256 Werte
        16 Bit: 65536 Werte
        ~~~

        Verwende den Platzhalter \`%.0f\` wie im Beispiel.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <math.h>

        int main(void) {
            printf("8 Bit: %.0f Werte\n", pow(2.0, 8.0));
            printf("16 Bit: %.0f Werte\n", pow(2.0, 16.0));
            return 0;
        }
      `,
      tests: [{ name: 'Beide Zeilen', erwartet: { stdout: '8 Bit: 256 Werte\n16 Bit: 65536 Werte\n' } }],
      regeln: [{ muss: '\\bpow\\s*\\(', meldung: 'Berechne die Werte mit `pow`, statt sie direkt hinzuschreiben.' }],
      hinweise: [md`\`pow(2.0, 8.0)\` liefert 256. Vergiss \`#include <math.h>\` nicht.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k01-l05-c1',
      typ: 'eingabe',
      themen: ['praeprozessor'],
      frage: 'Welche Header-Datei brauchst du für `printf`? (nur der Dateiname)',
      antworten: ['stdio.h', '<stdio.h>'],
    },
    {
      id: 'k01-l05-c2',
      typ: 'wahrfalsch',
      themen: ['praeprozessor'],
      aussage: 'Eine `#include`-Zeile muss mit einem Strichpunkt enden.',
      richtig: false,
      erklaerung: '`#include` ist eine Präprozessor-Anweisung, keine C-Anweisung. Sie endet ohne `;`.',
    },
    {
      id: 'k01-l05-c3',
      typ: 'auswahl',
      themen: ['praeprozessor'],
      frage: 'Was macht der Präprozessor mit `#include <stdio.h>`?',
      optionen: [
        { text: 'Er ersetzt die Zeile durch den Inhalt der Datei `stdio.h`.', richtig: true },
        { text: 'Er lädt `printf` beim Programmstart aus dem Internet.', warum: 'Das Einbinden geschieht vor dem Übersetzen, ganz ohne Netz.' },
        { text: 'Er übersetzt `stdio.h` in Maschinencode.', warum: 'Der Header enthält nur Deklarationen; übersetzt wird später.' },
      ],
    },
  ],
  zusammenfassung: [
    'Header-Dateien (`.h`) beschreiben Funktionen, Typen und Konstanten.',
    '`#include` fügt den Inhalt eines Headers ein, bevor übersetzt wird. Das erledigt der Präprozessor.',
    '`<…>` für die Standardbibliothek, `"…"` für eigene Header.',
    'Fehlt ein Header, kennt der Compiler die Funktion nicht. Clang nennt in der Notiz meist den richtigen.',
  ],
  referenz: ['include', 'sqrt', 'pow'],
};
