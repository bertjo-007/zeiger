import { c, md, out } from '../tags.ts';
import type { Aufgabe } from '../types.ts';

/** Fragenpool für den Kapiteltest 6. */
export const test: Aufgabe[] = [
  {
    id: 'k06-t01',
    typ: 'vorhersage',
    themen: ['schleifen'],
    code: c`
      #include <stdio.h>

      int main(void) {
          int i = 1;
          while (i < 30) {
              printf("%d ", i);
              i *= 3;
          }
          printf("\n");
          return 0;
      }
    `,
    ausgabe: out`
      1 3 9 27
    `,
  },
  {
    id: 'k06-t02',
    typ: 'eingabe',
    themen: ['schleifen'],
    frage: 'Wie oft läuft `for (int i = 10; i > 0; i -= 2)` durch?',
    antworten: ['5'],
  },
  {
    id: 'k06-t03',
    typ: 'wahrfalsch',
    themen: ['schleifen'],
    aussage: 'Der Rumpf einer `do … while`-Schleife wird mindestens einmal ausgeführt.',
    richtig: true,
  },
  {
    id: 'k06-t04',
    typ: 'vorhersage',
    themen: ['schleifen'],
    code: c`
      #include <stdio.h>

      int main(void) {
          int s = 0;
          for (int i = 1; i <= 5; i++) {
              if (i % 2 == 0) {
                  continue;
              }
              s += i;
          }
          printf("%d\n", s);
          return 0;
      }
    `,
    ausgabe: out`
      9
    `,
  },
  {
    id: 'k06-t05',
    typ: 'auswahl',
    themen: ['schleifen'],
    frage: 'Warum endet `for (int x = 0; x != 10; x += 4)` nie?',
    optionen: [{ text: 'x nimmt die Werte 0, 4, 8, 12 … an und ist nie genau 10.', richtig: true }, { text: 'Weil x nicht verändert wird.' }, { text: 'Sie endet nach drei Durchläufen.' }],
  },
  {
    id: 'k06-t06',
    typ: 'eingabe',
    themen: ['schleifen'],
    frage: 'Wie oft wird `printf` ausgeführt? `for (int a = 0; a < 3; a++) for (int b = 0; b < 4; b++) printf("x");`',
    antworten: ['12'],
  },
  {
    id: 'k06-t07',
    typ: 'auswahl',
    themen: ['schleifen'],
    frage: 'Mit welchem Startwert bestimmt man das Maximum einer Messreihe am sichersten?',
    optionen: [{ text: 'Mit dem ersten Messwert', richtig: true }, { text: 'Mit 0' }, { text: 'Mit 100' }],
  },
  {
    id: 'k06-t08',
    typ: 'luecke',
    themen: ['schleifen'],
    frage: 'Ergänze die Schleife, sodass 0, 5, 10, 15, 20 ausgegeben wird.',
    code: c`
      #include <stdio.h>

      int main(void) {
          for (int i = 0; i __1__ 20; i __2__ 5) {
              printf("%d\n", i);
          }
          return 0;
      }
    `,
    luecken: [['<=', '<'], ['+=']],
    ausgabe: '0\n5\n10\n15\n20\n',
  },
  {
    id: 'k06-t09',
    typ: 'zuordnen',
    themen: ['schleifen'],
    frage: 'Welche Schleife oder welches Schlüsselwort passt?',
    paare: [
      { links: 'Anzahl Durchläufe steht vorher fest', rechts: '`for`' },
      { links: 'Eingabe wiederholen, bis sie gültig ist', rechts: '`do … while`' },
      { links: 'Werte lesen bis zum Ende der Eingabe', rechts: '`while`' },
      { links: 'Schleife bei einem Treffer verlassen', rechts: '`break`' },
      { links: 'Ungültigen Wert überspringen', rechts: '`continue`' },
    ],
  },
  {
    id: 'k06-t10',
    typ: 'vorhersage',
    themen: ['schleifen'],
    code: c`
      #include <stdio.h>

      int main(void) {
          for (int r = 1; r <= 3; r++) {
              for (int k = 0; k < r; k++) {
                  printf("%d", r);
              }
              printf("\n");
          }
          return 0;
      }
    `,
    ausgabe: out`
      1
      22
      333
    `,
  },
  {
    id: 'k06-t11',
    typ: 'wahrfalsch',
    themen: ['schleifen'],
    aussage: '`while (1) { … }` ist immer ein Programmierfehler.',
    richtig: false,
    erklaerung: 'Auf Mikrocontrollern ist die gewollte Endlosschleife (Superloop) das Grundmuster; am PC wird sie mit `break` verlassen.',
  },
  {
    id: 'k06-t12',
    typ: 'auswahl',
    themen: ['schleifen'],
    frage: 'Was ist der Fehler in `while (n > 0); { n--; }`?',
    optionen: [{ text: 'Der Strichpunkt macht die Schleife leer; bei n > 0 hängt das Programm.', richtig: true }, { text: 'n wird zweimal verringert.' }, { text: 'Kein Fehler.' }],
  },
  {
    id: 'k06-t13',
    typ: 'eingabe',
    themen: ['schleifen'],
    frage: 'Welches Schlüsselwort springt zum nächsten Schleifendurchlauf?',
    antworten: ['continue'],
  },
  {
    id: 'k06-t14',
    typ: 'programm',
    themen: ['schleifen'],
    aufgabe: md`
      Lies n und gib die Summe aller Zahlen von 1 bis n aus, die durch 3 **oder** durch 5 teilbar sind. Bei 10: \`Summe: 33\` (3 + 5 + 6 + 9 + 10).
    `,
    start: c`
      #include <stdio.h>

      int main(void) {
          int n = 0;
          scanf("%d", &n);

          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      int main(void) {
          int n = 0;
          scanf("%d", &n);

          int summe = 0;
          for (int i = 1; i <= n; i++) {
              if (i % 3 == 0 || i % 5 == 0) {
                  summe += i;
              }
          }
          printf("Summe: %d\n", summe);
          return 0;
      }
    `,
    tests: [
      { name: '10', stdin: '10\n', erwartet: { stdout: 'Summe: 33\n' } },
      { name: '2', stdin: '2\n', erwartet: { stdout: 'Summe: 0\n' } },
      { name: '15', stdin: '15\n', erwartet: { stdout: 'Summe: 60\n' } },
    ],
  },
  {
    id: 'k06-t15',
    typ: 'programm',
    themen: ['schleifen', 'eingabe'],
    aufgabe: md`
      Lies Temperaturen (ganze Zahlen) bis zum Ende der Eingabe. Gib die tiefste aus: \`Tiefstwert: <t>\`. Ohne Werte: \`keine Werte\`.
    `,
    start: c`
      #include <stdio.h>

      int main(void) {
          int t = 0;

          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      int main(void) {
          int t = 0;
          int min = 0;
          int anzahl = 0;

          while (scanf("%d", &t) == 1) {
              if (anzahl == 0 || t < min) {
                  min = t;
              }
              anzahl++;
          }
          if (anzahl == 0) {
              printf("keine Werte\n");
          } else {
              printf("Tiefstwert: %d\n", min);
          }
          return 0;
      }
    `,
    tests: [
      { name: 'Gemischt', stdin: '12 -4 7 -9 3\n', erwartet: { stdout: 'Tiefstwert: -9\n' } },
      { name: 'Nur positiv', stdin: '18 21 15\n', erwartet: { stdout: 'Tiefstwert: 15\n' } },
      { name: 'Leer', stdin: '', erwartet: { stdout: 'keine Werte\n' } },
    ],
  },
];
