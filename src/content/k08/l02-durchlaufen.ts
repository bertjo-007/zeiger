import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k08-l02',
  titel: 'Arrays durchlaufen und an Funktionen übergeben',
  dauer: 30,
  stichwoerter: ['Array durchlaufen', 'Funktion', 'Array-Parameter', 'Länge übergeben', 'const', 'suchen', 'kopieren', 'size_t'],
  lernziele: [
    'Arrays mit Schleifen verarbeiten: summieren, suchen, kopieren',
    'Arrays an Funktionen übergeben, immer zusammen mit ihrer Länge',
    'erklären, warum eine Funktion die Elemente des Originals verändern kann',
  ],
  erklaerung: md`
    Fast jede Arbeit mit Arrays folgt demselben Muster: eine \`for\`-Schleife über alle Indizes. Damit lassen sich alle Muster aus Kapitel 6 anwenden: Summe, Mittelwert, Minimum, Maximum, Zählen.

    ### Arrays an Funktionen

    Ein Array-Parameter wird mit leeren eckigen Klammern geschrieben. Die Funktion **weiss nicht**, wie lang das Array ist, deshalb gibt man die Länge **immer als zusätzlichen Parameter** mit:

    ~~~c
    double mittelwert(const double werte[], size_t anzahl);
    ~~~

    Aufgerufen wird mit dem Array-Namen ohne Klammern: \`mittelwert(temperatur, 8)\`.

    ### Keine Kopie

    Anders als einfache Variablen wird ein Array **nicht kopiert**. Die Funktion bekommt die **Adresse** des ersten Elements (warum, erklärt Kapitel 9) und arbeitet direkt auf dem Original. Ändert sie \`werte[i]\`, ist das Array des Aufrufers verändert.

    Das ist gewollt, wenn eine Funktion ein Array füllen oder bearbeiten soll. Soll sie es nur lesen, schreibt man **\`const\`** vor den Typ. Dann meldet der Compiler einen Fehler, falls die Funktion doch schreibt, und der Aufrufer sieht im Prototyp, dass sein Array sicher ist.

    ### sizeof funktioniert hier nicht

    In der Funktion ist \`werte\` in Wahrheit ein Zeiger. \`sizeof werte\` liefert darum die Grösse eines Zeigers (hier 4 Byte), nicht die des Arrays. Clang warnt sogar davor. Genau deshalb gehört die Länge in einen Parameter.

    > [!tipp] size_t für Längen
    > Grössen und Indizes von Arrays haben in C üblicherweise den Typ \`size_t\` (ohne Vorzeichen, Ausgabe mit \`%zu\`). \`int\` funktioniert für kleine Arrays auch; mische die beiden aber nicht in Vergleichen.
  `,
  syntax: [
    {
      code: c`
        void fuelle(int ziel[], size_t n, int wert);           // darf schreiben
        double summe(const double werte[], size_t n);          // nur lesen

        summe(messwerte, ANZAHL);                              // Aufruf ohne []
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      double mittelwert(const double werte[], size_t n) {
          double summe = 0.0;
          for (size_t i = 0; i < n; i++) {
              summe += werte[i];
          }
          return n > 0 ? summe / n : 0.0;
      }

      int finde(const double werte[], size_t n, double grenze) {
          for (size_t i = 0; i < n; i++) {
              if (werte[i] > grenze) {
                  return (int)i;          // erster Treffer
              }
          }
          return -1;                      // nichts gefunden
      }

      void skaliere(double werte[], size_t n, double faktor) {
          for (size_t i = 0; i < n; i++) {
              werte[i] *= faktor;         // ändert das Original
          }
      }

      int main(void) {
          double spannung[5] = {11.8, 12.1, 12.6, 13.4, 12.2};
          const size_t N = sizeof spannung / sizeof spannung[0];

          printf("Mittel: %.2f V\n", mittelwert(spannung, N));
          printf("Erster Wert über 13 V: Index %d\n", finde(spannung, N, 13.0));

          skaliere(spannung, N, 1000.0);  // Volt in Millivolt
          printf("Erster Wert jetzt: %.0f mV\n", spannung[0]);
          return 0;
      }
    `,
    ausgabe: out`
      Mittel: 12.42 V
      Erster Wert über 13 V: Index 3
      Erster Wert jetzt: 11800 mV
    `,
  },
  zeilen: [
    { zeilen: '3', text: md`Array-Parameter mit \`const\`: Die Funktion liest nur. Die Länge kommt als eigener Parameter.` },
    { zeilen: '11-18', text: md`Suche: Beim ersten Treffer wird der Index zurückgegeben; \`-1\` bedeutet «nicht gefunden».` },
    { zeilen: '20-24', text: md`Ohne \`const\`: Die Funktion verändert die Elemente des Originals.` },
    { zeilen: '28', text: md`Die Länge wird einmal dort berechnet, wo das Array deklariert ist.` },
    { zeilen: '33-34', text: md`Nach dem Aufruf ist das Array in \`main\` verändert, anders als bei einfachen \`int\`-Parametern.` },
  ],
  ergebnis: md`
    Mittelwert und Suche lesen nur, \`skaliere\` verändert das Array in \`main\`. Versuche, in \`mittelwert\` ein Element zu ändern: Wegen \`const\` meldet Clang einen Fehler.
  `,
  fehler: [
    {
      titel: 'sizeof auf einem Array-Parameter',
      text: md`In der Funktion liefert \`sizeof werte\` die Grösse eines Zeigers. Clang warnt: «sizeof on array function parameter will return size of 'const double *'».`,
      falsch: c`
        double summe(const double werte[]) {
            size_t n = sizeof werte / sizeof werte[0];   // falsch
            …
        }
      `,
      richtig: c`
        double summe(const double werte[], size_t n) {
            …
        }
      `,
    },
    {
      titel: 'Länge nicht mitgegeben',
      text: md`Ohne Längenparameter muss die Funktion eine feste Länge annehmen und versagt bei anderen Arrays.`,
    },
    {
      titel: 'Aufruf mit [] oder einem Element',
      text: md`\`summe(werte[], 5)\` ist ein Syntaxfehler, \`summe(werte[0], 5)\` übergibt nur ein Element. Richtig: \`summe(werte, 5)\`.`,
    },
  ],
  uebungen: [
    {
      id: 'k08-l02-u1',
      typ: 'programm',
      titel: 'Anzahl über Grenzwert',
      stufe: 2,
      themen: ['arrays', 'funktionen'],
      aufgabe: md`
        Schreibe \`int zaehle_ueber(const int werte[], size_t n, int grenze)\`, die zählt, wie viele Werte **grösser** als \`grenze\` sind. Sie gibt nichts aus.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int druck[6] = {5, 9, 7, 11, 8, 12};
            printf("%d\n", zaehle_ueber(druck, 6, 8));
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int zaehle_ueber(const int werte[], size_t n, int grenze) {
            int anzahl = 0;
            for (size_t i = 0; i < n; i++) {
                if (werte[i] > grenze) {
                    anzahl++;
                }
            }
            return anzahl;
        }

        int main(void) {
            int druck[6] = {5, 9, 7, 11, 8, 12};
            printf("%d\n", zaehle_ueber(druck, 6, 8));
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        #include <stddef.h>
        int zaehle_ueber(const int werte[], size_t n, int grenze);
        int main(void) {
            int a[6] = {5, 9, 7, 11, 8, 12};
            int b[3] = {-1, -2, -3};
            printf("%d %d %d %d\n", zaehle_ueber(a, 6, 8), zaehle_ueber(a, 6, 100), zaehle_ueber(b, 3, -3), zaehle_ueber(a, 0, 0));
            return 0;
        }
      `,
      tests: [{ name: 'Verschiedene Arrays und Grenzen', erwartet: { stdout: '3 0 2 0\n' } }],
      hinweise: [md`Ein Zähler, eine Schleife bis \`n\`, ein \`if\`.`],
    },
    {
      id: 'k08-l02-u2',
      typ: 'programm',
      titel: 'Array umkehren',
      stufe: 3,
      themen: ['arrays', 'funktionen'],
      aufgabe: md`
        Schreibe \`void umkehren(int werte[], size_t n)\`, die die Reihenfolge der Elemente **im Array selbst** umkehrt (kein zweites Array). Tausche dazu das erste mit dem letzten Element, das zweite mit dem vorletzten usw.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int a[5] = {1, 2, 3, 4, 5};
            umkehren(a, 5);
            for (int i = 0; i < 5; i++) {
                printf("%d ", a[i]);
            }
            printf("\n");
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        void umkehren(int werte[], size_t n) {
            for (size_t i = 0; i < n / 2; i++) {
                int tmp = werte[i];
                werte[i] = werte[n - 1 - i];
                werte[n - 1 - i] = tmp;
            }
        }

        int main(void) {
            int a[5] = {1, 2, 3, 4, 5};
            umkehren(a, 5);
            for (int i = 0; i < 5; i++) {
                printf("%d ", a[i]);
            }
            printf("\n");
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        #include <stddef.h>
        void umkehren(int werte[], size_t n);
        int main(void) {
            int a[5] = {1, 2, 3, 4, 5};
            int b[4] = {10, 20, 30, 40};
            int c[1] = {7};
            umkehren(a, 5);
            umkehren(b, 4);
            umkehren(c, 1);
            printf("%d %d %d %d %d | %d %d %d %d | %d\n", a[0], a[1], a[2], a[3], a[4], b[0], b[1], b[2], b[3], c[0]);
            return 0;
        }
      `,
      tests: [{ name: 'Ungerade, gerade und eine Länge', erwartet: { stdout: '5 4 3 2 1 | 40 30 20 10 | 7\n' }, tipp: md`Nur bis zur Mitte tauschen, sonst tauschst du alles wieder zurück.` }],
      hinweise: [md`Die Schleife läuft nur bis \`n / 2\`.`, md`Das Gegenstück zu Index \`i\` ist \`n - 1 - i\`.`],
    },
    {
      id: 'k08-l02-u3',
      typ: 'fehlersuche',
      titel: 'Falsche Länge in der Funktion',
      stufe: 2,
      themen: ['arrays', 'funktionen'],
      aufgabe: md`
        Die Summe von 6 Werten soll \`Summe: 21\` ergeben, aber die Funktion summiert nur einen Teil. Clang warnt. Gib die Länge als Parameter mit.
      `,
      start: c`
        #include <stdio.h>

        int summe(const int werte[]) {
            int s = 0;
            for (size_t i = 0; i < sizeof werte / sizeof werte[0]; i++) {
                s += werte[i];
            }
            return s;
        }

        int main(void) {
            int a[6] = {1, 2, 3, 4, 5, 6};
            printf("Summe: %d\n", summe(a));
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int summe(const int werte[], size_t n) {
            int s = 0;
            for (size_t i = 0; i < n; i++) {
                s += werte[i];
            }
            return s;
        }

        int main(void) {
            int a[6] = {1, 2, 3, 4, 5, 6};
            printf("Summe: %d\n", summe(a, sizeof a / sizeof a[0]));
            return 0;
        }
      `,
      tests: [{ name: 'Summe 21', erwartet: { stdout: 'Summe: 21\n' } }],
      hinweise: [md`In der Funktion ist \`werte\` ein Zeiger; \`sizeof\` liefert dessen Grösse.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k08-l02-c1',
      typ: 'wahrfalsch',
      themen: ['arrays', 'funktionen'],
      aussage: 'Ändert eine Funktion ein Element ihres Array-Parameters, ist das Array des Aufrufers verändert.',
      richtig: true,
    },
    {
      id: 'k08-l02-c2',
      typ: 'auswahl',
      themen: ['arrays', 'funktionen'],
      frage: 'Was bewirkt `const` in `double summe(const double werte[], size_t n)`?',
      optionen: [{ text: 'Die Funktion darf die Elemente nicht verändern.', richtig: true }, { text: 'Das Array ist kürzer.' }, { text: 'Die Länge ist fest.' }],
    },
    {
      id: 'k08-l02-c3',
      typ: 'auswahl',
      themen: ['arrays', 'funktionen'],
      frage: 'Wie ruft man `double summe(const double w[], size_t n)` mit `double daten[10]` auf?',
      optionen: [{ text: '`summe(daten, 10)`', richtig: true }, { text: '`summe(daten[], 10)`' }, { text: '`summe(daten[10], 10)`', warum: 'Das wäre ein einzelnes (sogar ungültiges) Element.' }],
    },
  ],
  zusammenfassung: [
    'Arrays verarbeitet man mit einer `for`-Schleife über alle Indizes.',
    'An Funktionen: Array ohne `[]` übergeben und die Länge als eigenen Parameter.',
    'Arrays werden nicht kopiert; die Funktion arbeitet auf dem Original.',
    '`const` im Parameter verspricht: nur lesen. `sizeof` funktioniert in der Funktion nicht.',
  ],
  referenz: ['array'],
};
