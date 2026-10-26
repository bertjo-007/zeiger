import { c, md, out } from '../tags.ts';
import type { Aufgabe } from '../types.ts';

/** Fragenpool für den Kapiteltest 8. */
export const test: Aufgabe[] = [
  {
    id: 'k08-t01',
    typ: 'vorhersage',
    themen: ['arrays'],
    code: c`
      #include <stdio.h>

      int main(void) {
          int a[4] = {3, 1, 4, 1};
          int s = 0;
          for (int i = 0; i < 4; i++) {
              s += a[i] * i;
          }
          printf("%d\n", s);
          return 0;
      }
    `,
    ausgabe: out`
      12
    `,
  },
  {
    id: 'k08-t02',
    typ: 'eingabe',
    themen: ['arrays'],
    frage: 'Wie viele Elemente hat `double w[] = {1.5, 2.5, 3.5, 4.5};`?',
    antworten: ['4'],
  },
  {
    id: 'k08-t03',
    typ: 'wahrfalsch',
    themen: ['arrays'],
    aussage: 'Bei `int a[5]` ist `a[5]` das letzte Element.',
    richtig: false,
  },
  {
    id: 'k08-t04',
    typ: 'auswahl',
    themen: ['strings'],
    frage: 'Wie viele `char` braucht ein Array mindestens für den Text «Lager»?',
    optionen: [{ text: '6', richtig: true, warum: '5 Zeichen plus Endzeichen.' }, { text: '5' }, { text: '4' }],
  },
  {
    id: 'k08-t05',
    typ: 'auswahl',
    themen: ['strings'],
    frage: 'Wie prüfst du, ob `char cmd[10]` den Text «reset» enthält?',
    optionen: [{ text: '`strcmp(cmd, "reset") == 0`', richtig: true }, { text: '`cmd == "reset"`', warum: 'Vergleicht Adressen.' }, { text: '`strcmp(cmd, "reset")`', warum: 'Das ist wahr, wenn die Texte verschieden sind.' }],
  },
  {
    id: 'k08-t06',
    typ: 'vorhersage',
    themen: ['strings'],
    code: c`
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          char s[20] = "Pumpe";
          s[0] = 'L';
          printf("%s %zu\n", s, strlen(s));
          return 0;
      }
    `,
    ausgabe: out`
      Lumpe 5
    `,
  },
  {
    id: 'k08-t07',
    typ: 'auswahl',
    themen: ['arrays', 'funktionen'],
    frage: 'Warum übergibt man einer Funktion neben dem Array auch die Länge?',
    optionen: [{ text: 'Weil die Funktion die Länge sonst nicht kennt; `sizeof` liefert dort nur die Grösse eines Zeigers.', richtig: true }, { text: 'Weil C das verlangt.' }, { text: 'Damit das Array kopiert wird.' }],
  },
  {
    id: 'k08-t08',
    typ: 'eingabe',
    themen: ['arrays'],
    frage: 'Auf welches Element zeigt `m[1][2]` in `int m[3][4]`? Gib die Position in Speicherreihenfolge an, ab 0 gezählt.',
    antworten: ['6'],
    erklaerung: 'Zeile 1 beginnt nach 4 Elementen; plus Spalte 2 ergibt Position 6.',
  },
  {
    id: 'k08-t09',
    typ: 'wahrfalsch',
    themen: ['strings'],
    aussage: '`snprintf(ziel, sizeof ziel, "%s", quelle)` setzt immer ein Endzeichen.',
    richtig: true,
  },
  {
    id: 'k08-t10',
    typ: 'zuordnen',
    themen: ['strings'],
    frage: 'Ordne die Funktionen ihrer Aufgabe zu.',
    paare: [
      { links: '`strlen`', rechts: 'Länge ohne Endzeichen' },
      { links: '`strcmp`', rechts: 'zwei Texte vergleichen' },
      { links: '`snprintf`', rechts: 'sicher kopieren und formatieren' },
      { links: '`strstr`', rechts: 'Teiltext suchen' },
      { links: '`toupper`', rechts: 'Zeichen in Grossbuchstaben' },
    ],
  },
  {
    id: 'k08-t11',
    typ: 'vorhersage',
    themen: ['arrays'],
    code: c`
      #include <stdio.h>

      void doppeln(int a[], int n) {
          for (int i = 0; i < n; i++) {
              a[i] *= 2;
          }
      }

      int main(void) {
          int w[3] = {1, 2, 3};
          doppeln(w, 3);
          printf("%d %d %d\n", w[0], w[1], w[2]);
          return 0;
      }
    `,
    ausgabe: out`
      2 4 6
    `,
  },
  {
    id: 'k08-t12',
    typ: 'luecke',
    themen: ['strings'],
    frage: 'Ergänze, damit das `\\n` von `fgets` entfernt wird.',
    code: c`
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          char z[32] = "Linie 4\n";
          z[__1__(z, "\n")] = '\0';
          printf("[%s]\n", z);
          return 0;
      }
    `,
    luecken: [['strcspn']],
    ausgabe: '[Linie 4]\n',
  },
  {
    id: 'k08-t13',
    typ: 'auswahl',
    themen: ['arrays'],
    frage: 'Ein Index `i` kommt aus einer Eingabe. Welche Prüfung schützt `a[i]` bei `int a[8]`?',
    optionen: [{ text: '`if (i >= 0 && i < 8)`', richtig: true }, { text: '`if (i <= 8)`' }, { text: '`if (i != 8)`' }],
  },
  {
    id: 'k08-t14',
    typ: 'programm',
    themen: ['arrays', 'funktionen'],
    aufgabe: md`
      Schreibe \`int index_minimum(const int a[], int n)\`: liefert den Index des kleinsten Elements (bei mehreren gleich kleinen den ersten). Für n ≤ 0 liefert sie −1.
    `,
    start: c`
      #include <stdio.h>

      int main(void) {
          int a[5] = {7, 3, 9, 3, 5};
          printf("%d\n", index_minimum(a, 5));
          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      int index_minimum(const int a[], int n) {
          if (n <= 0) {
              return -1;
          }
          int idx = 0;
          for (int i = 1; i < n; i++) {
              if (a[i] < a[idx]) {
                  idx = i;
              }
          }
          return idx;
      }

      int main(void) {
          int a[5] = {7, 3, 9, 3, 5};
          printf("%d\n", index_minimum(a, 5));
          return 0;
      }
    `,
    harness: c`
      #undef main
      #include <stdio.h>
      int index_minimum(const int a[], int n);
      int main(void) {
          int a[5] = {7, 3, 9, 3, 5};
          int b[3] = {-1, -8, 0};
          printf("%d %d %d\n", index_minimum(a, 5), index_minimum(b, 3), index_minimum(a, 0));
          return 0;
      }
    `,
    tests: [{ name: 'Drei Aufrufe', erwartet: { stdout: '1 1 -1\n' } }],
  },
  {
    id: 'k08-t15',
    typ: 'programm',
    themen: ['strings'],
    aufgabe: md`
      Lies ein Wort (höchstens 20 Zeichen) und gib aus, ob es ein Palindrom ist (vorwärts wie rückwärts gleich, Gross/Klein beachten): \`Palindrom\` oder \`kein Palindrom\`.
    `,
    start: c`
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          char w[21];
          scanf("%20s", w);

          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          char w[21];
          scanf("%20s", w);

          size_t n = strlen(w);
          int ok = 1;
          for (size_t i = 0; i < n / 2; i++) {
              if (w[i] != w[n - 1 - i]) {
                  ok = 0;
                  break;
              }
          }
          printf("%s\n", ok ? "Palindrom" : "kein Palindrom");
          return 0;
      }
    `,
    tests: [
      { name: 'rotor', stdin: 'rotor\n', erwartet: { stdout: 'Palindrom\n' } },
      { name: 'otto', stdin: 'otto\n', erwartet: { stdout: 'Palindrom\n' } },
      { name: 'motor', stdin: 'motor\n', erwartet: { stdout: 'kein Palindrom\n' } },
    ],
  },
];
