import { c, md, out } from '../tags.ts';
import type { Aufgabe } from '../types.ts';

/** Fragenpool für den Kapiteltest 5. */
export const test: Aufgabe[] = [
  {
    id: 'k05-t01',
    typ: 'vorhersage',
    themen: ['bedingungen'],
    code: c`
      #include <stdio.h>

      int main(void) {
          int t = 15;
          if (t > 20) {
              printf("warm\n");
          } else if (t > 10) {
              printf("mild\n");
          } else {
              printf("kalt\n");
          }
          return 0;
      }
    `,
    ausgabe: out`
      mild
    `,
  },
  {
    id: 'k05-t02',
    typ: 'wahrfalsch',
    themen: ['bedingungen'],
    aussage: '`if (x > 3); { y = 1; }` setzt y nur, wenn x grösser als 3 ist.',
    richtig: false,
    erklaerung: 'Der Strichpunkt nach der Bedingung ist eine leere Anweisung; der Block läuft immer.',
  },
  {
    id: 'k05-t03',
    typ: 'vorhersage',
    themen: ['switch'],
    code: c`
      #include <stdio.h>

      int main(void) {
          char c = 'b';
          switch (c) {
              case 'a':
                  printf("A");
                  break;
              case 'b':
                  printf("B");
              case 'c':
                  printf("C");
                  break;
              default:
                  printf("X");
          }
          printf("\n");
          return 0;
      }
    `,
    ausgabe: out`
      BC
    `,
  },
  {
    id: 'k05-t04',
    typ: 'eingabe',
    themen: ['bedingungen'],
    frage: 'Welchen Wert hat `(12 > 7) ? 1 : 2`?',
    antworten: ['1'],
  },
  {
    id: 'k05-t05',
    typ: 'auswahl',
    themen: ['switch'],
    frage: 'Welcher Wert ist als `case`-Marke **nicht** erlaubt?',
    optionen: [{ text: '`case 2.5:`', richtig: true, warum: 'Nur ganzzahlige Konstanten sind erlaubt.' }, { text: "`case 'X':`" }, { text: '`case 42:`' }],
  },
  {
    id: 'k05-t06',
    typ: 'auswahl',
    themen: ['bedingungen'],
    frage: 'Was ist an dieser Kette falsch?\n\n~~~c\nif (x > 0) { … }\nelse if (x > 100) { … }\n~~~',
    optionen: [{ text: 'Der zweite Zweig wird nie erreicht, weil jede Zahl über 100 auch über 0 ist.', richtig: true }, { text: 'Nichts.' }, { text: '`else if` darf nicht auf `if` folgen.' }],
  },
  {
    id: 'k05-t07',
    typ: 'wahrfalsch',
    themen: ['switch'],
    aussage: 'Fehlt in einem `case` das `break`, werden auch die Anweisungen des folgenden Falls ausgeführt.',
    richtig: true,
  },
  {
    id: 'k05-t08',
    typ: 'luecke',
    themen: ['bedingungen'],
    frage: 'Ergänze, sodass «klein» oder «gross» ausgegeben wird.',
    code: c`
      #include <stdio.h>

      int main(void) {
          int n = 3;
          if (n < 10) {
              printf("klein\n");
          } __1__ {
              printf("gross\n");
          }
          return 0;
      }
    `,
    luecken: [['else']],
    ausgabe: 'klein\n',
  },
  {
    id: 'k05-t09',
    typ: 'zuordnen',
    themen: ['bedingungen', 'switch'],
    frage: 'Welches Sprachmittel passt am besten?',
    paare: [
      { links: 'Temperatur in Bereiche einteilen', rechts: '`if` / `else if`' },
      { links: 'Menüauswahl 1 bis 5', rechts: '`switch`' },
      { links: 'Maximum zweier Werte in einer Zeile', rechts: '`?:`' },
      { links: 'Etwas nur bei Fehler ausgeben', rechts: '`if` allein' },
    ],
  },
  {
    id: 'k05-t10',
    typ: 'vorhersage',
    themen: ['bedingungen'],
    code: c`
      #include <stdio.h>

      int main(void) {
          int a = 5, b = 8;
          if (a > 3) {
              if (b < 5) {
                  printf("eins\n");
              } else {
                  printf("zwei\n");
              }
          }
          printf("%d\n", a > b ? a : b);
          return 0;
      }
    `,
    ausgabe: out`
      zwei
      8
    `,
  },
  {
    id: 'k05-t11',
    typ: 'auswahl',
    themen: ['switch', 'mikrocontroller'],
    frage: 'Ein Garagentor ist im Zustand «schliesst». Die Lichtschranke wird unterbrochen. Was ist richtig modelliert?',
    optionen: [{ text: 'Ereignis «Lichtschranke» führt zum Zustand «öffnet»', richtig: true }, { text: '«Lichtschranke unterbrochen» ist ein neuer Zustand', warum: 'Es ist ein Ereignis.' }, { text: 'Das Ereignis wird ignoriert', warum: 'Dann würde das Tor ein Hindernis einklemmen.' }],
  },
  {
    id: 'k05-t12',
    typ: 'wahrfalsch',
    themen: ['bedingungen'],
    aussage: 'Ein `else` gehört immer zu dem `if`, das gleich weit eingerückt ist.',
    richtig: false,
    erklaerung: 'Es gehört zum nächsten offenen `if` darüber; die Einrückung ist dem Compiler egal.',
  },
  {
    id: 'k05-t13',
    typ: 'eingabe',
    themen: ['switch'],
    frage: 'Mit welchem Schlüsselwort behandelt ein `switch` alle Werte ohne eigenes `case`?',
    antworten: ['default'],
  },
  {
    id: 'k05-t14',
    typ: 'programm',
    themen: ['bedingungen'],
    aufgabe: md`
      Lies eine Note (Kommazahl 1.0 bis 6.0). Gib \`genügend\` aus bei 4.0 oder mehr, sonst \`ungenügend\`. Werte ausserhalb von 1 bis 6 ergeben \`ungültig\`.
    `,
    start: c`
      #include <stdio.h>

      int main(void) {
          double note = 0.0;
          scanf("%lf", &note);

          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      int main(void) {
          double note = 0.0;
          scanf("%lf", &note);

          if (note < 1.0 || note > 6.0) {
              printf("ungültig\n");
          } else if (note >= 4.0) {
              printf("genügend\n");
          } else {
              printf("ungenügend\n");
          }
          return 0;
      }
    `,
    tests: [
      { name: '5.5', stdin: '5.5\n', erwartet: { stdout: 'genügend\n' } },
      { name: '4.0', stdin: '4\n', erwartet: { stdout: 'genügend\n' } },
      { name: '3.75', stdin: '3.75\n', erwartet: { stdout: 'ungenügend\n' } },
      { name: '7', stdin: '7\n', erwartet: { stdout: 'ungültig\n' } },
    ],
  },
  {
    id: 'k05-t15',
    typ: 'programm',
    themen: ['switch'],
    aufgabe: md`
      Lies einen Buchstaben für eine Drehrichtung: \`l\` oder \`L\` ergibt \`links\`, \`r\` oder \`R\` ergibt \`rechts\`, alles andere \`stopp\`. Verwende \`switch\`.
    `,
    start: c`
      #include <stdio.h>

      int main(void) {
          char c = '?';
          scanf(" %c", &c);

          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      int main(void) {
          char c = '?';
          scanf(" %c", &c);

          switch (c) {
              case 'l':
              case 'L':
                  printf("links\n");
                  break;
              case 'r':
              case 'R':
                  printf("rechts\n");
                  break;
              default:
                  printf("stopp\n");
                  break;
          }
          return 0;
      }
    `,
    tests: [
      { name: 'l', stdin: 'l\n', erwartet: { stdout: 'links\n' } },
      { name: 'R', stdin: 'R\n', erwartet: { stdout: 'rechts\n' } },
      { name: 'x', stdin: 'x\n', erwartet: { stdout: 'stopp\n' } },
    ],
    regeln: [{ muss: '\\bswitch\\b', meldung: 'Verwende `switch`.' }],
  },
];
