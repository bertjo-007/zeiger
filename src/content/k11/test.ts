import { c, md, out } from '../tags.ts';
import type { Aufgabe } from '../types.ts';

/** Fragenpool für den Kapiteltest 11. */
export const test: Aufgabe[] = [
  {
    id: 'k11-t01',
    typ: 'vorhersage',
    themen: ['strukturen'],
    code: c`
      #include <stdio.h>

      typedef struct {
          int x;
          int y;
      } Punkt;

      Punkt verschoben(Punkt p, int d) {
          p.x += d;
          p.y -= d;
          return p;
      }

      int main(void) {
          Punkt a = {.y = 5};
          Punkt b = verschoben(a, 2);
          printf("%d %d %d %d\n", a.x, a.y, b.x, b.y);
          return 0;
      }
    `,
    ausgabe: out`
      0 5 2 3
    `,
  },
  {
    id: 'k11-t02',
    typ: 'auswahl',
    themen: ['strukturen', 'zeiger'],
    frage: '`m` ist ein `Motor *`. Wie setzt man die Komponente `drehzahl` auf 0?',
    optionen: [{ text: '`m->drehzahl = 0;`', richtig: true }, { text: '`m.drehzahl = 0;`' }, { text: '`*m.drehzahl = 0;`' }],
  },
  {
    id: 'k11-t03',
    typ: 'wahrfalsch',
    themen: ['strukturen'],
    aussage: 'Zwei Strukturvariablen kann man mit `==` vergleichen.',
    richtig: false,
  },
  {
    id: 'k11-t04',
    typ: 'eingabe',
    themen: ['strukturen'],
    frage: 'Welchen Wert hat `C` in `enum { A = 5, B, C };`?',
    antworten: ['7'],
  },
  {
    id: 'k11-t05',
    typ: 'zuordnen',
    themen: ['strukturen'],
    frage: 'Ordne die Begriffe zu.',
    paare: [
      { links: '`struct`', rechts: 'mehrere Komponenten nebeneinander' },
      { links: '`union`', rechts: 'Komponenten teilen sich den Speicher' },
      { links: '`enum`', rechts: 'benannte ganzzahlige Konstanten' },
      { links: '`typedef`', rechts: 'zusätzlicher Name für einen Typ' },
    ],
  },
  {
    id: 'k11-t06',
    typ: 'vorhersage',
    themen: ['strukturen', 'arrays'],
    code: c`
      #include <stdio.h>

      typedef struct {
          char kanal;
          int wert;
      } Messung;

      int main(void) {
          Messung m[] = {{'A', 12}, {'B', 7}, {'C', 30}, {'D', 7}};
          int n = (int)(sizeof m / sizeof m[0]);
          int min = 0;
          for (int i = 1; i < n; i++) {
              if (m[i].wert < m[min].wert) {
                  min = i;
              }
          }
          printf("%d %c\n", n, m[min].kanal);
          return 0;
      }
    `,
    ausgabe: out`
      4 B
    `,
  },
  {
    id: 'k11-t07',
    typ: 'auswahl',
    themen: ['strukturen'],
    frage: 'Wie gross ist eine `union` mit den Komponenten `int a;` und `double b;` hier?',
    optionen: [{ text: '8 Byte', richtig: true }, { text: '12 Byte' }, { text: '4 Byte' }],
  },
  {
    id: 'k11-t08',
    typ: 'luecke',
    themen: ['strukturen'],
    frage: 'Ergänze die Typdefinition.',
    code: c`
      #include <stdio.h>

      __1__ struct {
          int nummer;
          double wert;
      } Kanal;

      int main(void) {
          Kanal k = {.nummer = 3, .wert = 1.5};
          printf("%d %.1f\n", k.nummer, k.wert);
          return 0;
      }
    `,
    luecken: [['typedef']],
    ausgabe: '3 1.5\n',
  },
  {
    id: 'k11-t09',
    typ: 'wahrfalsch',
    themen: ['strukturen', 'funktionen'],
    aussage: 'Übergibt man einer Funktion eine Struktur ohne Zeiger, kann sie das Original des Aufrufers verändern.',
    richtig: false,
  },
  {
    id: 'k11-t10',
    typ: 'vorhersage',
    themen: ['strukturen'],
    code: c`
      #include <stdio.h>

      typedef struct {
          unsigned int a : 2;
          unsigned int b : 3;
      } Bits;

      int main(void) {
          Bits x = {0};
          x.a = 3;
          x.b = 6;
          x.a++;
          x.b++;
          printf("%d %d\n", x.a, x.b);
          return 0;
      }
    `,
    ausgabe: out`
      0 7
    `,
  },
  {
    id: 'k11-t11',
    typ: 'auswahl',
    themen: ['strukturen', 'zeiger'],
    frage: 'Warum braucht eine Struktur für eine verkettete Liste einen Namen (`struct Knoten`)?',
    optionen: [
      { text: 'Sie enthält einen Zeiger auf ihren eigenen Typ, und das `typedef` ist an dieser Stelle noch nicht bekannt.', richtig: true },
      { text: 'Strukturen ohne Namen können keine Zeiger enthalten.' },
      { text: 'Sonst lässt sie sich nicht mit `malloc` anlegen.' },
    ],
  },
  {
    id: 'k11-t12',
    typ: 'eingabe',
    themen: ['strukturen', 'arrays'],
    frage: 'Wie greift man auf die Komponente `name` des ersten Elements von `Artikel lager[5]` zu?',
    antworten: ['lager[0].name'],
  },
  {
    id: 'k11-t13',
    typ: 'auswahl',
    themen: ['strukturen'],
    frage: 'Was ist der Vorteil von `{.wert = 3}` gegenüber `{0, 3}`?',
    optionen: [
      { text: 'Die Zuordnung hängt nicht von der Reihenfolge der Komponenten ab.', richtig: true },
      { text: 'Es ist schneller.' },
      { text: 'Nur so werden die übrigen Komponenten 0.' },
    ],
  },
  {
    id: 'k11-t14',
    typ: 'programm',
    themen: ['strukturen', 'zeiger', 'arrays'],
    aufgabe: md`
      Schreibe \`int nachfuellen(Artikel a[], int n, int grenze, int menge)\`. Bei jedem Artikel mit \`bestand\` unter \`grenze\` erhöht sie den Bestand um \`menge\`. Zurück gibt sie die Anzahl nachgefüllter Artikel.
    `,
    start: c`
      #include <stdio.h>

      typedef struct {
          char name[16];
          int bestand;
      } Artikel;

      int main(void) {
          Artikel l[3] = {{"Lager", 40}, {"Riemen", 6}, {"Kupplung", 3}};
          int n = nachfuellen(l, 3, 10, 20);
          printf("%d: %d %d %d\n", n, l[0].bestand, l[1].bestand, l[2].bestand);
          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      typedef struct {
          char name[16];
          int bestand;
      } Artikel;

      int nachfuellen(Artikel a[], int n, int grenze, int menge) {
          int anzahl = 0;
          for (int i = 0; i < n; i++) {
              if (a[i].bestand < grenze) {
                  a[i].bestand += menge;
                  anzahl++;
              }
          }
          return anzahl;
      }

      int main(void) {
          Artikel l[3] = {{"Lager", 40}, {"Riemen", 6}, {"Kupplung", 3}};
          int n = nachfuellen(l, 3, 10, 20);
          printf("%d: %d %d %d\n", n, l[0].bestand, l[1].bestand, l[2].bestand);
          return 0;
      }
    `,
    harness: c`
      #undef main
      #include <stdio.h>
      typedef struct {
          char name[16];
          int bestand;
      } Artikel;
      int nachfuellen(Artikel a[], int n, int grenze, int menge);
      int main(void) {
          Artikel l[4] = {{"Lager", 40}, {"Riemen", 6}, {"Kupplung", 10}, {"Sensor", 0}};
          int n = nachfuellen(l, 4, 10, 25);
          printf("%d: %d %d %d %d\n", n, l[0].bestand, l[1].bestand, l[2].bestand, l[3].bestand);
          return 0;
      }
    `,
    tests: [{ name: 'Vier Artikel', erwartet: { stdout: '2: 40 31 10 25\n' } }],
  },
  {
    id: 'k11-t15',
    typ: 'programm',
    themen: ['strukturen', 'zeiger'],
    aufgabe: md`
      Schreibe \`int laenge(const Knoten *kopf)\`, die die Anzahl der Knoten einer verketteten Liste zählt. Eine leere Liste (\`NULL\`) hat die Länge 0.
    `,
    start: c`
      #include <stdio.h>
      #include <stddef.h>

      typedef struct Knoten {
          int wert;
          struct Knoten *naechster;
      } Knoten;

      int main(void) {
          Knoten c = {3, NULL};
          Knoten b = {2, &c};
          Knoten a = {1, &b};
          printf("%d\n", laenge(&a));
          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>
      #include <stddef.h>

      typedef struct Knoten {
          int wert;
          struct Knoten *naechster;
      } Knoten;

      int laenge(const Knoten *kopf) {
          int n = 0;
          for (const Knoten *k = kopf; k != NULL; k = k->naechster) {
              n++;
          }
          return n;
      }

      int main(void) {
          Knoten c = {3, NULL};
          Knoten b = {2, &c};
          Knoten a = {1, &b};
          printf("%d\n", laenge(&a));
          return 0;
      }
    `,
    harness: c`
      #undef main
      #include <stdio.h>
      #include <stddef.h>
      typedef struct Knoten {
          int wert;
          struct Knoten *naechster;
      } Knoten;
      int laenge(const Knoten *kopf);
      int main(void) {
          Knoten c = {3, NULL};
          Knoten b = {2, &c};
          Knoten a = {1, &b};
          printf("%d %d %d\n", laenge(&a), laenge(&c), laenge(NULL));
          return 0;
      }
    `,
    tests: [{ name: 'Drei Listen', erwartet: { stdout: '3 1 0\n' } }],
  },
];
