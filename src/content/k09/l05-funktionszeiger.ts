import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k09-l05',
  titel: 'Zeiger auf Funktionen',
  dauer: 30,
  stichwoerter: ['Funktionszeiger', 'Callback', 'Rückruffunktion', 'qsort', 'Vergleichsfunktion', 'typedef', 'Sprungtabelle'],
  lernziele: [
    'einen Zeiger auf eine Funktion deklarieren und aufrufen',
    'einer Funktion eine andere Funktion als Parameter übergeben (Callback)',
    'ein Array mit `qsort` und einer eigenen Vergleichsfunktion sortieren',
  ],
  erklaerung: md`
    Auch Funktionen liegen im Speicher und haben eine Adresse. Ein **Funktionszeiger** speichert sie. So kann man festlegen, *welche* Funktion aufgerufen wird, während das Programm läuft.

    ~~~c
    double (*umrechnen)(double);         // Zeiger auf eine Funktion double → double
    umrechnen = celsius_zu_kelvin;       // Name ohne Klammern = Adresse
    double k = umrechnen(20.0);          // Aufruf über den Zeiger
    ~~~

    Die Klammern um \`(*umrechnen)\` sind nötig. Ohne sie hiesse \`double *umrechnen(double)\` «eine Funktion, die einen \`double *\` liefert».

    ### Callbacks

    Der häufigste Einsatz: Eine Funktion bekommt eine andere Funktion als Parameter und ruft sie an der richtigen Stelle auf. Die Funktion \`tabelle\` im Beispiel druckt eine Umrechnungstabelle und weiss nicht, *wie* umgerechnet wird; das entscheidet der Aufrufer.

    Mit \`typedef\` wird der Typ lesbarer:

    ~~~c
    typedef double (*Umrechnung)(double);
    void tabelle(const char *name, Umrechnung f);
    ~~~

    ### Sortieren mit qsort

    \`qsort\` aus \`<stdlib.h>\` sortiert beliebige Arrays. Woher weiss es, wie zwei Elemente verglichen werden? Man übergibt eine **Vergleichsfunktion**. Sie bekommt zwei \`const void *\` (Zeiger auf Elemente beliebigen Typs) und liefert eine negative Zahl, 0 oder eine positive Zahl, genau wie \`strcmp\`.

    > [!tipp] Vergleich ohne Überlauf
    > \`return x - y;\` sieht bequem aus, kann aber bei grossen Werten überlaufen. Sicher ist \`return (x > y) - (x < y);\`.

    > [!praxis] Auf dem Mikrocontroller
    > Interrupt-Vektoren sind Tabellen von Funktionszeigern. Und viele Treiber melden «Daten fertig» über einen Callback, den man beim Einrichten übergibt.
  `,
  syntax: [
    {
      code: c`
        rueckgabetyp (*name)(parametertypen);    // Funktionszeiger
        name = funktion;                         // ohne Klammern
        name(argumente);                         // Aufruf
        typedef int (*Vergleich)(const void *, const void *);
        qsort(array, anzahl, sizeof array[0], vergleich);
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdlib.h>

      double celsius_zu_fahrenheit(double c) {
          return c * 9.0 / 5.0 + 32.0;
      }

      double celsius_zu_kelvin(double c) {
          return c + 273.15;
      }

      void tabelle(const char *name, double (*umrechnen)(double)) {
          printf("%s:", name);
          for (int c = 0; c <= 100; c += 50) {
              printf(" %.2f", umrechnen(c));
          }
          printf("\n");
      }

      int vergleiche(const void *a, const void *b) {
          int x = *(const int *)a;
          int y = *(const int *)b;
          return (x > y) - (x < y);
      }

      int main(void) {
          tabelle("Fahrenheit", celsius_zu_fahrenheit);
          tabelle("Kelvin", celsius_zu_kelvin);

          int messwerte[6] = {42, 7, 19, 3, 25, 11};
          qsort(messwerte, 6, sizeof messwerte[0], vergleiche);
          for (int i = 0; i < 6; i++) {
              printf("%d ", messwerte[i]);
          }
          printf("\n");
          return 0;
      }
    `,
    ausgabe: out`
      Fahrenheit: 32.00 122.00 212.00
      Kelvin: 273.15 323.15 373.15
      3 7 11 19 25 42
    `,
  },
  zeilen: [
    { zeilen: '12', text: md`Der zweite Parameter ist ein Funktionszeiger: irgendeine Funktion, die ein \`double\` nimmt und eines liefert.` },
    { zeilen: '15', text: md`Aufruf über den Zeiger, als wäre es ein normaler Funktionsname.` },
    { zeilen: '20-24', text: md`Vergleichsfunktion für \`qsort\`: Die \`void\`-Zeiger werden in \`const int *\` umgewandelt und gelesen.` },
    { zeilen: '27-28', text: md`Dieselbe Funktion \`tabelle\`, zwei verschiedene Umrechnungen.` },
    { zeilen: '31', text: md`\`qsort\` bekommt Array, Anzahl, Elementgrösse und die Vergleichsfunktion.` },
  ],
  ergebnis: md`
    \`tabelle\` druckt zweimal drei Werte, einmal in Fahrenheit, einmal in Kelvin, ohne selbst zu wissen, wie umgerechnet wird. \`qsort\` sortiert die Messwerte aufsteigend.
  `,
  fehler: [
    {
      titel: 'Klammern um den Namen vergessen',
      text: md`\`int *f(int);\` deklariert eine Funktion, die einen Zeiger liefert. Für einen Funktionszeiger braucht es \`int (*f)(int);\`.`,
    },
    {
      titel: 'Funktion beim Übergeben aufrufen',
      text: md`\`tabelle("K", celsius_zu_kelvin(20))\` übergibt das Ergebnis, nicht die Funktion. Clang meldet einen Typfehler.`,
      falsch: c`tabelle("Kelvin", celsius_zu_kelvin(20.0));`,
      richtig: c`tabelle("Kelvin", celsius_zu_kelvin);`,
    },
    {
      titel: 'Falsche Signatur der Vergleichsfunktion',
      text: md`\`qsort\` verlangt genau \`int f(const void *, const void *)\`. Eine Funktion \`int f(int *, int *)\` passt nicht, auch wenn sie dasselbe tut.`,
    },
  ],
  uebungen: [
    {
      id: 'k09-l05-u1',
      typ: 'vorhersage',
      titel: 'Tabelle von Funktionen',
      stufe: 1,
      themen: ['zeiger', 'funktionen'],
      code: c`
        #include <stdio.h>

        int plus(int a, int b) { return a + b; }
        int minus(int a, int b) { return a - b; }
        int mal(int a, int b) { return a * b; }

        int main(void) {
            int (*rechne[3])(int, int) = {plus, minus, mal};
            int x = 6;
            for (int i = 0; i < 3; i++) {
                x = rechne[i](x, 2);
            }
            printf("%d\n", x);
            return 0;
        }
      `,
      ausgabe: out`
        12
      `,
      erklaerung: md`6 + 2 = 8, 8 − 2 = 6, 6 · 2 = 12.`,
    },
    {
      id: 'k09-l05-u2',
      typ: 'programm',
      titel: 'Auf alle Elemente anwenden',
      stufe: 2,
      themen: ['zeiger', 'funktionen', 'arrays'],
      aufgabe: md`
        Schreibe \`void fuer_alle(int a[], int n, int (*f)(int))\`, die jedes Element durch \`f(element)\` ersetzt.
      `,
      start: c`
        #include <stdio.h>

        int doppelt(int x) {
            return 2 * x;
        }

        int main(void) {
            int w[4] = {1, 2, 3, 4};
            fuer_alle(w, 4, doppelt);
            printf("%d %d %d %d\n", w[0], w[1], w[2], w[3]);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        void fuer_alle(int a[], int n, int (*f)(int)) {
            for (int i = 0; i < n; i++) {
                a[i] = f(a[i]);
            }
        }

        int doppelt(int x) {
            return 2 * x;
        }

        int main(void) {
            int w[4] = {1, 2, 3, 4};
            fuer_alle(w, 4, doppelt);
            printf("%d %d %d %d\n", w[0], w[1], w[2], w[3]);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        void fuer_alle(int a[], int n, int (*f)(int));
        static int quadrat(int x) { return x * x; }
        static int begrenzt(int x) { return x > 10 ? 10 : x; }
        int main(void) {
            int a[3] = {2, 3, 4};
            int b[3] = {5, 15, 25};
            fuer_alle(a, 3, quadrat);
            fuer_alle(b, 3, begrenzt);
            printf("%d %d %d | %d %d %d\n", a[0], a[1], a[2], b[0], b[1], b[2]);
            return 0;
        }
      `,
      tests: [{ name: 'Quadrat und Begrenzung', erwartet: { stdout: '4 9 16 | 5 10 10\n' } }],
      hinweise: [md`In der Schleife: \`a[i] = f(a[i]);\`.`],
    },
    {
      id: 'k09-l05-u3',
      typ: 'programm',
      titel: 'Absteigend sortieren',
      stufe: 3,
      themen: ['zeiger', 'funktionen', 'arrays'],
      aufgabe: md`
        Schreibe die Vergleichsfunktion \`int absteigend(const void *a, const void *b)\`, mit der \`qsort\` ein \`int\`-Array **absteigend** sortiert. Vermeide \`return y - x;\`, damit nichts überlaufen kann.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int w[5] = {3, 41, 7, 19, 2};
            qsort(w, 5, sizeof w[0], absteigend);
            for (int i = 0; i < 5; i++) {
                printf("%d ", w[i]);
            }
            printf("\n");
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdlib.h>

        int absteigend(const void *a, const void *b) {
            int x = *(const int *)a;
            int y = *(const int *)b;
            return (x < y) - (x > y);
        }

        int main(void) {
            int w[5] = {3, 41, 7, 19, 2};
            qsort(w, 5, sizeof w[0], absteigend);
            for (int i = 0; i < 5; i++) {
                printf("%d ", w[i]);
            }
            printf("\n");
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        #include <stdlib.h>
        #include <limits.h>
        int absteigend(const void *a, const void *b);
        int main(void) {
            int w[6] = {3, INT_MIN, 41, INT_MAX, -7, 3};
            qsort(w, 6, sizeof w[0], absteigend);
            for (int i = 0; i < 6; i++) {
                printf("%d ", w[i]);
            }
            printf("\n");
            return 0;
        }
      `,
      tests: [{ name: 'Mit Extremwerten', erwartet: { stdout: '2147483647 41 3 3 -7 -2147483648\n' }, tipp: md`Mit \`INT_MIN\` und \`INT_MAX\` läuft eine Subtraktion über. Vergleiche mit \`<\` und \`>\`.` }],
      hinweise: [md`Wandle zuerst um: \`int x = *(const int *)a;\`.`, md`Aufsteigend wäre \`(x > y) - (x < y)\`. Für absteigend die Vergleiche tauschen.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k09-l05-c1',
      typ: 'auswahl',
      themen: ['zeiger', 'funktionen'],
      frage: 'Welche Deklaration ist ein Zeiger auf eine Funktion, die ein `int` nimmt und ein `int` liefert?',
      optionen: [{ text: '`int (*f)(int);`', richtig: true }, { text: '`int *f(int);`', warum: 'Eine Funktion, die einen `int *` liefert.' }, { text: '`int f*(int);`' }],
    },
    {
      id: 'k09-l05-c2',
      typ: 'wahrfalsch',
      themen: ['zeiger', 'funktionen'],
      aussage: 'Beim Übergeben einer Funktion als Argument schreibt man ihren Namen ohne Klammern.',
      richtig: true,
    },
    {
      id: 'k09-l05-c3',
      typ: 'eingabe',
      themen: ['funktionen'],
      frage: 'In welchem Header steht `qsort`?',
      antworten: ['stdlib.h', '<stdlib.h>'],
    },
  ],
  zusammenfassung: [
    'Ein Funktionszeiger speichert die Adresse einer Funktion: `int (*f)(int)`.',
    'Callbacks: Eine Funktion bekommt eine andere als Parameter.',
    '`qsort` sortiert mit einer Vergleichsfunktion `int f(const void *, const void *)`.',
    '`typedef` macht Funktionszeigertypen lesbar.',
  ],
  referenz: ['funktionszeiger', 'qsort'],
};
