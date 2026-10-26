import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k05-l01',
  titel: 'Bedingungen mit if',
  dauer: 20,
  stichwoerter: ['if', 'Bedingung', 'Verzweigung', 'Block', 'geschweifte Klammern', 'wenn', 'Entscheidung'],
  lernziele: [
    'Anweisungen mit `if` nur unter einer Bedingung ausführen',
    'Bedingungen aus Vergleichen und logischen Operatoren bilden',
    'erklären, warum geschweifte Klammern auch bei einer einzigen Anweisung sinnvoll sind',
  ],
  erklaerung: md`
    Bisher lief jedes Programm stur von oben nach unten. Mit **\`if\`** («wenn») wird ein Block nur ausgeführt, wenn eine Bedingung zutrifft:

    ~~~c
    if (temperatur > 80) {
        printf("Übertemperatur!\n");
        heizung = 0;
    }
    ~~~

    1. Die **Bedingung** steht in runden Klammern. Sie ist ein Ausdruck, der wahr (ungleich 0) oder falsch (0) ergibt, meist ein Vergleich wie \`temperatur > 80\`.
    2. Ist sie wahr, wird der **Block** in geschweiften Klammern ausgeführt.
    3. Ist sie falsch, wird der Block **übersprungen**, und das Programm macht danach weiter.

    In der Bedingung darf alles stehen, was du aus Kapitel 4 kennst: \`if (tuer_zu && !not_aus)\`, \`if (anzahl % 2 == 0)\`, \`if (scanf("%d", &x) != 1)\`. Auch eine \`bool\`-Variable allein ist eine Bedingung: \`if (motor_laeuft)\`.

    ### Immer geschweifte Klammern

    Besteht der Block aus nur einer Anweisung, dürfen die Klammern formal fehlen:

    ~~~c
    if (fehler) printf("Fehler\n");
    ~~~

    Das ist eine bekannte Fehlerquelle. Fügt man später eine zweite Zeile hinzu, gehört sie **nicht** mehr zum \`if\`, auch wenn sie gleich eingerückt ist. Dieser Kurs schreibt deshalb **immer** geschweifte Klammern.

    > [!achtung] Kein Strichpunkt nach der Bedingung
    > \`if (x > 5);\` ist ein \`if\` mit einer **leeren** Anweisung. Der folgende Block wird dann **immer** ausgeführt. Clang warnt: «if statement has empty body».

    > [!praxis] Grenzwertüberwachung
    > Sehr viele Zeilen in Steuerungsprogrammen sehen so aus: Wenn ein Messwert eine Grenze überschreitet, dann Alarm setzen und Aktor abschalten. Genau das ist ein \`if\`.
  `,
  syntax: [
    {
      code: c`
        if (bedingung) {
            anweisungen;   // nur wenn bedingung wahr ist
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int drehzahl = 0;
          const int MAX_DREHZAHL = 3200;

          printf("Drehzahl: ");
          scanf("%d", &drehzahl);

          if (drehzahl > MAX_DREHZAHL) {
              printf("Warnung: Überdrehzahl, Motor wird gebremst\n");
              drehzahl = MAX_DREHZAHL;
          }

          if (drehzahl == 0) {
              printf("Motor steht\n");
          }

          printf("Aktuelle Drehzahl: %d\n", drehzahl);
          return 0;
      }
    `,
    stdin: '3500\n',
    ausgabe: out`
      Drehzahl: 3500
      Warnung: Überdrehzahl, Motor wird gebremst
      Aktuelle Drehzahl: 3200
    `,
  },
  zeilen: [
    { zeilen: '10', text: md`Die Bedingung: Ist die Drehzahl grösser als das Maximum?` },
    { zeilen: '11-12', text: md`Der Block wird nur ausgeführt, wenn die Bedingung wahr ist. Er besteht aus zwei Anweisungen.` },
    { zeilen: '15-17', text: md`Ein zweites, unabhängiges \`if\`. Bei 3500 ist es falsch, der Block wird übersprungen.` },
    { zeilen: '19', text: md`Diese Zeile steht nach den \`if\`-Blöcken und wird immer ausgeführt.` },
  ],
  ergebnis: md`
    Bei 3500 greift die Begrenzung: Warnung, und die Drehzahl wird auf 3200 gesetzt. Probiere 1500 (keine Meldung) und 0 (Motor steht). Die letzte Zeile erscheint in allen Fällen.
  `,
  fehler: [
    {
      titel: 'Strichpunkt nach der Bedingung',
      text: md`Der Strichpunkt beendet das \`if\` sofort; der Block danach läuft immer.`,
      falsch: c`
        if (druck > 8);
        {
            ventil_auf();
        }
      `,
      richtig: c`
        if (druck > 8) {
            ventil_auf();
        }
      `,
    },
    {
      titel: 'Fehlende Klammern',
      text: md`Ohne Klammern gehört nur die erste Anweisung zum \`if\`. Die Einrückung täuscht.`,
      falsch: c`
        if (fehler)
            printf("Fehler\n");
            motor = 0;      // läuft IMMER
      `,
      richtig: c`
        if (fehler) {
            printf("Fehler\n");
            motor = 0;
        }
      `,
    },
    {
      titel: '= statt ==',
      text: md`\`if (modus = 2)\` weist 2 zu und ist immer wahr. Clang warnt.`,
    },
  ],
  uebungen: [
    {
      id: 'k05-l01-u1',
      typ: 'vorhersage',
      titel: 'Welche Zeilen erscheinen?',
      stufe: 1,
      themen: ['bedingungen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int x = 7;
            if (x > 5) {
                printf("A\n");
            }
            if (x > 10) {
                printf("B\n");
            }
            if (x % 2 == 1) {
                printf("C\n");
            }
            printf("D\n");
            return 0;
        }
      `,
      ausgabe: out`
        A
        C
        D
      `,
    },
    {
      id: 'k05-l01-u2',
      typ: 'programm',
      titel: 'Frostwarnung',
      stufe: 1,
      themen: ['bedingungen'],
      aufgabe: md`
        Lies eine Aussentemperatur (Kommazahl). Liegt sie **unter 3.0** Grad, gib \`Frostwarnung\` aus. Danach in jedem Fall \`Messung beendet\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double t = 0.0;
            scanf("%lf", &t);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            double t = 0.0;
            scanf("%lf", &t);

            if (t < 3.0) {
                printf("Frostwarnung\n");
            }
            printf("Messung beendet\n");
            return 0;
        }
      `,
      tests: [
        { name: '-2.5 Grad', stdin: '-2.5\n', erwartet: { stdout: 'Frostwarnung\nMessung beendet\n' } },
        { name: '12 Grad', stdin: '12\n', erwartet: { stdout: 'Messung beendet\n' } },
        { name: 'Genau 3 Grad', stdin: '3\n', erwartet: { stdout: 'Messung beendet\n' }, tipp: md`3.0 ist nicht **unter** 3.0.` },
      ],
      hinweise: [md`\`if (t < 3.0) { … }\`, danach das zweite \`printf\` ausserhalb des Blocks.`],
    },
    {
      id: 'k05-l01-u3',
      typ: 'fehlersuche',
      titel: 'Ventil immer offen',
      stufe: 2,
      themen: ['bedingungen'],
      aufgabe: md`
        Das Ventil soll sich nur öffnen, wenn der Druck **über** 6 bar liegt. Es öffnet sich aber immer. Bei 4 bar soll nur \`Druck 4 bar\` erscheinen, bei 7 bar zusätzlich vorher \`Ventil offen\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int druck = 0;
            scanf("%d", &druck);
            if (druck > 6);
            {
                printf("Ventil offen\n");
            }
            printf("Druck %d bar\n", druck);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int druck = 0;
            scanf("%d", &druck);
            if (druck > 6) {
                printf("Ventil offen\n");
            }
            printf("Druck %d bar\n", druck);
            return 0;
        }
      `,
      tests: [
        { name: '4 bar', stdin: '4\n', erwartet: { stdout: 'Druck 4 bar\n' } },
        { name: '7 bar', stdin: '7\n', erwartet: { stdout: 'Ventil offen\nDruck 7 bar\n' } },
      ],
      hinweise: [md`Lies die Warnung des Compilers zur Zeile mit \`if\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k05-l01-c1',
      typ: 'wahrfalsch',
      themen: ['bedingungen'],
      aussage: 'Eine Zahl ungleich 0 gilt in einer `if`-Bedingung als wahr.',
      richtig: true,
    },
    {
      id: 'k05-l01-c2',
      typ: 'auswahl',
      themen: ['bedingungen'],
      frage: 'Was passiert bei `if (x > 5); { a = 1; }`?',
      optionen: [{ text: '`a = 1` wird immer ausgeführt.', richtig: true }, { text: '`a = 1` wird nur bei x > 5 ausgeführt.', warum: 'Der Strichpunkt beendet das `if`.' }, { text: 'Der Compiler meldet einen Fehler.', warum: 'Es ist gültig, Clang warnt nur.' }],
    },
    {
      id: 'k05-l01-c3',
      typ: 'luecke',
      themen: ['bedingungen'],
      frage: 'Ergänze, sodass «Alarm» nur bei einem Druck über 10 erscheint.',
      code: c`
        #include <stdio.h>

        int main(void) {
            int druck = 12;
            __1__ (druck __2__ 10) {
                printf("Alarm\n");
            }
            return 0;
        }
      `,
      luecken: [['if'], ['>']],
      ausgabe: 'Alarm\n',
    },
  ],
  zusammenfassung: [
    '`if (bedingung) { … }` führt den Block nur aus, wenn die Bedingung wahr ist.',
    'Die Bedingung ist ein Ausdruck: 0 ist falsch, alles andere wahr.',
    'Immer geschweifte Klammern setzen, auch bei einer einzelnen Anweisung.',
    'Kein Strichpunkt direkt nach `if (…)`.',
  ],
  referenz: ['if-else'],
};
