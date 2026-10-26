import { c, md, out } from '../tags.ts';
import type { Aufgabe } from '../types.ts';

/** Fragenpool für den Kapiteltest 9. */
export const test: Aufgabe[] = [
  {
    id: 'k09-t01',
    typ: 'vorhersage',
    themen: ['zeiger'],
    code: c`
      #include <stdio.h>

      int main(void) {
          int x = 4;
          int y = 10;
          int *p = &x;
          *p += y;
          p = &y;
          *p = x * 2;
          printf("%d %d\n", x, y);
          return 0;
      }
    `,
    ausgabe: out`
      14 28
    `,
  },
  {
    id: 'k09-t02',
    typ: 'auswahl',
    themen: ['zeiger'],
    frage: 'Was bedeutet das `*` in `int *p = &x;`?',
    optionen: [{ text: '`p` ist ein Zeiger auf `int`.', richtig: true }, { text: 'Der Wert von `x` wird multipliziert.' }, { text: '`p` bekommt den Wert von `x`.' }],
  },
  {
    id: 'k09-t03',
    typ: 'wahrfalsch',
    themen: ['zeiger', 'arrays'],
    aussage: '`a[i]` und `*(a + i)` bedeuten dasselbe.',
    richtig: true,
  },
  {
    id: 'k09-t04',
    typ: 'vorhersage',
    themen: ['zeiger', 'funktionen'],
    code: c`
      #include <stdio.h>

      void a(int x) {
          x = 0;
          printf("a: %d\n", x);
      }

      void b(int *x) {
          *x = 0;
      }

      int main(void) {
          int m = 5;
          int n = 5;
          a(m);
          b(&n);
          printf("%d %d\n", m, n);
          return 0;
      }
    `,
    ausgabe: out`
      a: 0
      5 0
    `,
  },
  {
    id: 'k09-t05',
    typ: 'eingabe',
    themen: ['zeiger'],
    frage: 'Wie heisst der Wert, mit dem man einen Zeiger belegt, der auf nichts zeigt?',
    antworten: ['NULL'],
  },
  {
    id: 'k09-t06',
    typ: 'vorhersage',
    themen: ['zeiger', 'arrays'],
    code: c`
      #include <stdio.h>

      int main(void) {
          int a[5] = {2, 4, 6, 8, 10};
          int *p = a + 4;
          int s = 0;
          while (p >= a + 2) {
              s += *p;
              p--;
          }
          printf("%d\n", s);
          return 0;
      }
    `,
    ausgabe: out`
      24
    `,
  },
  {
    id: 'k09-t07',
    typ: 'auswahl',
    themen: ['zeiger', 'fehler'],
    frage: 'Was ist an dieser Funktion falsch?',
    code: c`
      int *neuer_wert(void) {
          int w = 42;
          return &w;
      }
    `,
    optionen: [
      { text: 'Sie gibt die Adresse einer lokalen Variable zurück, die nach dem `return` nicht mehr existiert.', richtig: true },
      { text: 'Funktionen dürfen keine Zeiger zurückgeben.' },
      { text: 'Es fehlt ein `*` vor `w`.' },
    ],
  },
  {
    id: 'k09-t08',
    typ: 'zuordnen',
    themen: ['zeiger'],
    frage: 'Ordne die Deklarationen zu.',
    paare: [
      { links: '`int *p`', rechts: 'Zeiger auf int' },
      { links: '`const int *p`', rechts: 'Zeiger, über den man nur liest' },
      { links: '`int (*f)(int)`', rechts: 'Zeiger auf eine Funktion' },
      { links: '`int *f(int)`', rechts: 'Funktion, die einen Zeiger liefert' },
    ],
  },
  {
    id: 'k09-t09',
    typ: 'eingabe',
    themen: ['zeiger', 'arrays'],
    frage: '`int a[10]; int *p = a + 7;` Welchen Wert hat `p - a`?',
    antworten: ['7'],
  },
  {
    id: 'k09-t10',
    typ: 'wahrfalsch',
    themen: ['zeiger'],
    aussage: 'Nach `int *p, q;` ist `q` ein Zeiger.',
    richtig: false,
  },
  {
    id: 'k09-t11',
    typ: 'luecke',
    themen: ['zeiger', 'funktionen'],
    frage: 'Ergänze die Parameter und den Aufruf, damit `nullen` den Zähler zurücksetzt.',
    code: c`
      #include <stdio.h>

      void nullen(int __1__) {
          *z = 0;
      }

      int main(void) {
          int zaehler = 17;
          nullen(__2__);
          printf("%d\n", zaehler);
          return 0;
      }
    `,
    luecken: [['*z'], ['&zaehler']],
    ausgabe: '0\n',
  },
  {
    id: 'k09-t12',
    typ: 'auswahl',
    themen: ['zeiger', 'funktionen'],
    frage: 'Was muss eine Vergleichsfunktion für `qsort` zurückgeben, wenn das erste Element vor das zweite gehört?',
    optionen: [{ text: 'Eine negative Zahl', richtig: true }, { text: '0' }, { text: 'Eine positive Zahl' }],
  },
  {
    id: 'k09-t13',
    typ: 'vorhersage',
    themen: ['zeiger', 'strings'],
    code: c`
      #include <stdio.h>

      int main(void) {
          const char *s = "Sensor";
          const char *p = s;
          while (*p != '\0') {
              p++;
          }
          printf("%td %c\n", p - s, *(p - 1));
          return 0;
      }
    `,
    ausgabe: out`
      6 r
    `,
  },
  {
    id: 'k09-t14',
    typ: 'programm',
    themen: ['zeiger', 'funktionen'],
    aufgabe: md`
      Schreibe \`void min_max(const int a[], int n, int *min, int *max)\`, die Minimum und Maximum über die Zeiger liefert. Du darfst annehmen, dass \`n\` mindestens 1 ist.
    `,
    start: c`
      #include <stdio.h>

      int main(void) {
          int w[5] = {7, -3, 12, 0, 5};
          int lo = 0, hi = 0;
          min_max(w, 5, &lo, &hi);
          printf("%d %d\n", lo, hi);
          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      void min_max(const int a[], int n, int *min, int *max) {
          *min = a[0];
          *max = a[0];
          for (int i = 1; i < n; i++) {
              if (a[i] < *min) {
                  *min = a[i];
              }
              if (a[i] > *max) {
                  *max = a[i];
              }
          }
      }

      int main(void) {
          int w[5] = {7, -3, 12, 0, 5};
          int lo = 0, hi = 0;
          min_max(w, 5, &lo, &hi);
          printf("%d %d\n", lo, hi);
          return 0;
      }
    `,
    harness: c`
      #undef main
      #include <stdio.h>
      void min_max(const int a[], int n, int *min, int *max);
      int main(void) {
          int w[5] = {7, -3, 12, 0, 5};
          int e[1] = {-9};
          int lo = 0, hi = 0, lo2 = 0, hi2 = 0;
          min_max(w, 5, &lo, &hi);
          min_max(e, 1, &lo2, &hi2);
          printf("%d %d %d %d\n", lo, hi, lo2, hi2);
          return 0;
      }
    `,
    tests: [{ name: 'Zwei Arrays', erwartet: { stdout: '-3 12 -9 -9\n' } }],
  },
  {
    id: 'k09-t15',
    typ: 'programm',
    themen: ['zeiger', 'strings'],
    aufgabe: md`
      Schreibe \`const char *nach_doppelpunkt(const char *s)\`. Sie liefert einen Zeiger auf das erste Zeichen **nach** dem ersten \`:\` in \`s\`, überspringt dabei folgende Leerzeichen, und liefert \`NULL\`, wenn es keinen Doppelpunkt gibt.
    `,
    start: c`
      #include <stdio.h>
      #include <stddef.h>

      int main(void) {
          const char *r = nach_doppelpunkt("Status:   bereit");
          printf("[%s]\n", r != NULL ? r : "-");
          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>
      #include <stddef.h>

      const char *nach_doppelpunkt(const char *s) {
          while (*s != '\0' && *s != ':') {
              s++;
          }
          if (*s == '\0') {
              return NULL;
          }
          s++;
          while (*s == ' ') {
              s++;
          }
          return s;
      }

      int main(void) {
          const char *r = nach_doppelpunkt("Status:   bereit");
          printf("[%s]\n", r != NULL ? r : "-");
          return 0;
      }
    `,
    harness: c`
      #undef main
      #include <stdio.h>
      #include <stddef.h>
      const char *nach_doppelpunkt(const char *s);
      int main(void) {
          const char *a = nach_doppelpunkt("Status:   bereit");
          const char *b = nach_doppelpunkt("T1:21.5");
          const char *c = nach_doppelpunkt("ohne");
          printf("[%s] [%s] %d\n", a, b, c == NULL);
          return 0;
      }
    `,
    tests: [{ name: 'Drei Texte', erwartet: { stdout: '[bereit] [21.5] 1\n' } }],
  },
];
