import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k09-l04',
  titel: 'Zeiger und Arrays, Zeigerarithmetik',
  dauer: 30,
  stichwoerter: ['Zeigerarithmetik', 'Array', 'p++', 'p + i', 'a[i]', '*(a + i)', 'ptrdiff_t', '%td', 'Abstand'],
  lernziele: [
    'erklären, warum ein Arrayname wie ein Zeiger auf das erste Element wirkt',
    'mit `p + i`, `p++` und Zeigerdifferenzen rechnen',
    'Arrays und Texte mit Zeigern durchlaufen',
  ],
  erklaerung: md`
    Verwendet man den Namen eines Arrays in einem Ausdruck, wird er zu einem **Zeiger auf das erste Element**. Darum ist

    ~~~c
    int werte[5] = {10, 20, 30, 40, 50};
    int *p = werte;      // gleich wie &werte[0]
    ~~~

    erlaubt. Das ist auch der Grund, warum Funktionen Arrays nicht kopiert bekommen: Übergeben wird nur diese Adresse.

    ### Rechnen mit Zeigern

    Zählt man zu einem Zeiger eine Zahl dazu, rückt er um so viele **Elemente** weiter, nicht um Bytes. Der Compiler kennt den Typ und rechnet die Bytes selbst aus.

    | Ausdruck | zeigt auf | Wert |
    |---|---|---|
    | \`p\` | \`werte[0]\` | 10 |
    | \`p + 2\` | \`werte[2]\` | \`*(p + 2)\` ist 30 |
    | \`p++\` | danach \`werte[1]\` | 20 |

    Die eckigen Klammern sind nur eine Abkürzung: **\`a[i]\` bedeutet \`*(a + i)\`**. Darum funktioniert \`p[3]\` mit einem Zeiger genauso wie mit einem Array.

    Zwei Zeiger ins selbe Array kann man **subtrahieren**: \`ende - anfang\` ist die Anzahl Elemente dazwischen (Typ \`ptrdiff_t\`, Platzhalter \`%td\`). Vergleichen mit \`<\` geht ebenfalls.

    ### Grenzen

    Ein Zeiger darf auf jedes Element zeigen und auf die Stelle **direkt hinter** dem letzten Element (zum Vergleichen, nicht zum Lesen). Alles darüber hinaus ist undefiniertes Verhalten, genau wie ein falscher Index.

    > [!info] Array ist nicht gleich Zeiger
    > Ein Array ist ein Speicherblock, ein Zeiger eine Variable mit einer Adresse. \`sizeof werte\` liefert 20 Byte (das ganze Array), \`sizeof p\` nur die Grösse einer Adresse. Und einem Array kann man nichts zuweisen: \`werte = p;\` ist ein Fehler.
  `,
  syntax: [
    {
      code: c`
        int *p = array;          // Zeiger auf das erste Element
        *(p + i)                 // gleich wie p[i] und array[i]
        p++;                     // ein Element weiter
        ende - anfang            // Anzahl Elemente dazwischen (%td)
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int werte[5] = {10, 20, 30, 40, 50};
          int *p = werte;

          printf("%d %d\n", *p, *(p + 2));
          printf("%d\n", p[3]);

          p++;
          printf("nach p++: %d\n", *p);

          int *ende = werte + 5;
          int summe = 0;
          for (int *q = werte; q < ende; q++) {
              summe += *q;
          }
          printf("Summe: %d\n", summe);
          printf("Abstand: %td Elemente\n", ende - werte);

          const char *text = "Motor";
          int n = 0;
          while (*text != '\0') {
              n++;
              text++;
          }
          printf("Länge: %d\n", n);
          return 0;
      }
    `,
    ausgabe: out`
      10 30
      40
      nach p++: 20
      Summe: 150
      Abstand: 5 Elemente
      Länge: 5
    `,
  },
  zeilen: [
    { zeilen: '5', text: md`Der Arrayname wird zum Zeiger auf \`werte[0]\`.` },
    { zeilen: '7', text: md`\`*(p + 2)\` springt zwei Elemente weiter, also 8 Byte, und liest 30.` },
    { zeilen: '8', text: md`\`p[3]\` ist dasselbe wie \`*(p + 3)\`.` },
    { zeilen: '10', text: md`\`p\` rückt um ein Element vor und zeigt jetzt auf 20.` },
    { zeilen: '13', text: md`\`ende\` zeigt direkt hinter das letzte Element. Lesen darf man dort nicht, vergleichen schon.` },
    { zeilen: '15-17', text: md`Durchlaufen mit einem Zeiger statt mit einem Index.` },
    { zeilen: '19', text: md`Die Differenz zweier Zeiger zählt Elemente, nicht Bytes.` },
    { zeilen: '23-26', text: md`Typisches Muster für Texte: weiterrücken, bis das Endzeichen erreicht ist.` },
  ],
  ergebnis: md`
    Alle Zugriffe landen auf den erwarteten Elementen, obwohl die Adressen jeweils um 4 Byte auseinanderliegen. Der Zeiger \`text\` läuft über die fünf Buchstaben und hält beim Endzeichen an.
  `,
  fehler: [
    {
      titel: 'Über das Ende hinaus lesen',
      text: md`\`*ende\` liest hinter dem Array. Die Schleife muss \`q < ende\` prüfen, nicht \`q <= ende\`.`,
      falsch: c`for (int *q = werte; q <= ende; q++)`,
      richtig: c`for (int *q = werte; q < ende; q++)`,
    },
    {
      titel: 'Zeiger und Wert verwechseln',
      text: md`\`*p++\` liest den Wert und rückt danach den Zeiger weiter. \`(*p)++\` erhöht dagegen den Wert. Im Zweifel in zwei Anweisungen aufteilen.`,
    },
    {
      titel: 'Zeiger in verschiedene Arrays vergleichen',
      text: md`Differenzen und \`<\` sind nur für Zeiger ins selbe Array definiert.`,
    },
  ],
  uebungen: [
    {
      id: 'k09-l04-u1',
      typ: 'vorhersage',
      titel: 'Zeiger wandern lassen',
      stufe: 1,
      themen: ['zeiger', 'arrays'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int a[6] = {4, 8, 15, 16, 23, 42};
            int *p = a + 1;
            p += 2;
            printf("%d %d %td\n", *p, p[-1], p - a);
            return 0;
        }
      `,
      ausgabe: out`
        16 15 3
      `,
      erklaerung: md`\`p\` startet bei \`a[1]\` und rückt um 2 weiter auf \`a[3]\` (16). \`p[-1]\` ist \`a[2]\`, der Abstand zum Anfang ist 3.`,
    },
    {
      id: 'k09-l04-u2',
      typ: 'programm',
      titel: 'Zeichen zählen mit Zeiger',
      stufe: 2,
      themen: ['zeiger', 'strings'],
      aufgabe: md`
        Schreibe \`int zaehle(const char *s, char gesucht)\`, die zählt, wie oft \`gesucht\` in \`s\` vorkommt. Durchlaufe den Text mit dem Zeiger, **ohne eckige Klammern**.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            printf("%d\n", zaehle("Rollenlager", 'l'));
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int zaehle(const char *s, char gesucht) {
            int n = 0;
            while (*s != '\0') {
                if (*s == gesucht) {
                    n++;
                }
                s++;
            }
            return n;
        }

        int main(void) {
            printf("%d\n", zaehle("Rollenlager", 'l'));
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        int zaehle(const char *s, char gesucht);
        int main(void) {
            printf("%d %d %d\n", zaehle("Rollenlager", 'l'), zaehle("", 'x'), zaehle("aaa", 'a'));
            return 0;
        }
      `,
      tests: [{ name: 'Drei Texte', erwartet: { stdout: '3 0 3\n' } }],
      regeln: [{ darfNicht: '\\[', meldung: 'Löse die Aufgabe mit Zeigerarithmetik, ohne `[ ]`.' }],
      hinweise: [md`\`while (*s != '\0')\` und am Ende jeder Runde \`s++\`.`],
    },
    {
      id: 'k09-l04-u3',
      typ: 'programm',
      titel: 'Umkehren zwischen zwei Zeigern',
      stufe: 3,
      themen: ['zeiger', 'arrays'],
      aufgabe: md`
        Schreibe \`void umkehren(int *anfang, int *ende)\`. \`anfang\` zeigt auf das erste Element, \`ende\` direkt **hinter** das letzte. Die Funktion kehrt die Reihenfolge der Elemente dazwischen um. Ist der Bereich leer, passiert nichts.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int a[5] = {1, 2, 3, 4, 5};
            umkehren(a, a + 5);
            for (int i = 0; i < 5; i++) {
                printf("%d ", a[i]);
            }
            printf("\n");
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        void umkehren(int *anfang, int *ende) {
            while (anfang < ende) {
                ende--;
                if (anfang >= ende) {
                    break;
                }
                int tmp = *anfang;
                *anfang = *ende;
                *ende = tmp;
                anfang++;
            }
        }

        int main(void) {
            int a[5] = {1, 2, 3, 4, 5};
            umkehren(a, a + 5);
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
        void umkehren(int *anfang, int *ende);
        int main(void) {
            int a[5] = {1, 2, 3, 4, 5};
            int b[4] = {7, 8, 9, 10};
            umkehren(a, a + 5);
            umkehren(b + 1, b + 3);
            umkehren(b, b);
            printf("%d %d %d %d %d | %d %d %d %d\n", a[0], a[1], a[2], a[3], a[4], b[0], b[1], b[2], b[3]);
            return 0;
        }
      `,
      tests: [{ name: 'Ganz, Teilbereich, leer', erwartet: { stdout: '5 4 3 2 1 | 7 9 8 10\n' }, tipp: md`\`ende\` zeigt hinter das letzte Element; vor dem ersten Tausch \`ende--\`.` }],
      hinweise: [md`Solange \`anfang < ende\`: zuerst \`ende--\`, dann \`*anfang\` und \`*ende\` tauschen, dann \`anfang++\`.`, md`Prüfe nach \`ende--\` erneut, ob sich die Zeiger getroffen haben.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k09-l04-c1',
      typ: 'eingabe',
      themen: ['zeiger', 'arrays'],
      frage: 'Wie schreibt man `a[i]` mit Zeigerarithmetik?',
      antworten: ['*(a + i)', '*(a+i)', '*(i + a)', '*(i+a)'],
    },
    {
      id: 'k09-l04-c2',
      typ: 'auswahl',
      themen: ['zeiger'],
      frage: '`double *p` zeigt auf ein Array. Um wie viele Byte rückt `p++` weiter?',
      optionen: [{ text: 'Um 8 Byte, die Grösse eines `double`', richtig: true }, { text: 'Um 1 Byte' }, { text: 'Um 4 Byte, die Grösse einer Adresse' }],
    },
    {
      id: 'k09-l04-c3',
      typ: 'wahrfalsch',
      themen: ['zeiger', 'arrays'],
      aussage: 'Ein Zeiger darf direkt hinter das letzte Element zeigen, aber dort nicht gelesen werden.',
      richtig: true,
    },
  ],
  zusammenfassung: [
    'Ein Arrayname wird im Ausdruck zum Zeiger auf das erste Element.',
    '`a[i]` ist dasselbe wie `*(a + i)`.',
    '`p + i` und `p++` rechnen in Elementen, nicht in Bytes.',
    'Die Differenz zweier Zeiger zählt Elemente (`%td`).',
  ],
  referenz: ['zeigerarithmetik', 'array', 'zeiger'],
};
