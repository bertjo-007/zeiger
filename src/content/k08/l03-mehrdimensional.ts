import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k08-l03',
  titel: 'Mehrdimensionale Arrays',
  dauer: 25,
  stichwoerter: ['mehrdimensional', 'zweidimensional', 'Matrix', 'Tabelle', 'Zeile', 'Spalte', 'Raster', '[ ][ ]'],
  lernziele: [
    'zweidimensionale Arrays für Tabellen und Raster anlegen',
    'mit zwei verschachtelten Schleifen über Zeilen und Spalten laufen',
    'Zeilen- und Spaltensummen berechnen',
  ],
  erklaerung: md`
    Ein Lager mit 3 Regalen zu je 4 Fächern, Messwerte von 5 Sensoren über 24 Stunden, die Pixel eines kleinen Displays: Solche Daten haben zwei Dimensionen. Dafür gibt es **zweidimensionale Arrays**:

    ~~~c
    int bestand[3][4];        // 3 Zeilen (Regale), 4 Spalten (Fächer)
    ~~~

    Zugegriffen wird mit zwei Indizes: \`bestand[regal][fach]\`. Der erste wählt die **Zeile**, der zweite die **Spalte**. Beide zählen ab 0.

    ### Initialisieren

    ~~~c
    int bestand[3][4] = {
        {12,  0,  7,  3},     // Regal 0
        { 5,  8,  0, 11},     // Regal 1
        { 0,  2,  9,  4},     // Regal 2
    };
    ~~~

    ### Im Speicher

    Die Werte liegen **zeilenweise hintereinander**: erst alle Fächer von Regal 0, dann Regal 1 usw. Darum ist es am schnellsten, in der **inneren** Schleife über den **letzten** Index zu laufen.

    ### An Funktionen übergeben

    Bei mehrdimensionalen Arrays muss die Funktion die Grösse aller Dimensionen **ausser der ersten** kennen:

    ~~~c
    void zeige(const int tabelle[][4], size_t zeilen);
    ~~~

    Mehr als zwei Dimensionen (\`int wuerfel[4][4][4]\`) funktionieren genauso, kommen aber seltener vor.
  `,
  syntax: [
    {
      code: c`
        typ name[ZEILEN][SPALTEN];
        name[z][s] = wert;           // z: 0 bis ZEILEN-1, s: 0 bis SPALTEN-1

        for (int z = 0; z < ZEILEN; z++) {
            for (int s = 0; s < SPALTEN; s++) {
                … name[z][s] …
            }
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      #define REGALE 3
      #define FAECHER 4

      int main(void) {
          int bestand[REGALE][FAECHER] = {
              {12, 0, 7, 3},
              {5, 8, 0, 11},
              {0, 2, 9, 4},
          };

          int leer = 0;
          for (int r = 0; r < REGALE; r++) {
              int summe = 0;
              printf("Regal %d:", r + 1);
              for (int f = 0; f < FAECHER; f++) {
                  printf("%4d", bestand[r][f]);
                  summe += bestand[r][f];
                  if (bestand[r][f] == 0) {
                      leer++;
                  }
              }
              printf("  | Summe %d\n", summe);
          }
          printf("Leere Fächer: %d\n", leer);
          return 0;
      }
    `,
    ausgabe: out`
      Regal 1:  12   0   7   3  | Summe 22
      Regal 2:   5   8   0  11  | Summe 24
      Regal 3:   0   2   9   4  | Summe 15
      Leere Fächer: 3
    `,
  },
  zeilen: [
    { zeilen: '3-4', text: md`Die Grössen als Konstanten mit \`#define\`; so stehen sie nur an einer Stelle.` },
    { zeilen: '7-11', text: md`Initialisierung Zeile für Zeile, jede Zeile in eigenen geschweiften Klammern.` },
    { zeilen: '14', text: md`Die äussere Schleife läuft über die Regale (Zeilen).` },
    { zeilen: '17-23', text: md`Die innere Schleife über die Fächer (Spalten). \`bestand[r][f]\` ist Fach f in Regal r.` },
    { zeilen: '24', text: md`Die Zeilensumme wird nach der inneren Schleife ausgegeben.` },
  ],
  ergebnis: md`
    Das Lager erscheint als Tabelle mit einer Summe pro Regal, darunter die Zahl der leeren Fächer.
  `,
  fehler: [
    {
      titel: 'Indizes vertauscht',
      text: md`\`bestand[f][r]\` statt \`bestand[r][f]\` greift bei unterschiedlichen Grössen über die Grenzen und vertauscht sonst Zeilen und Spalten.`,
    },
    {
      titel: 'Komma statt zwei Klammerpaare',
      text: md`\`bestand[1, 2]\` ist in C nicht \`bestand[1][2]\`, sondern dank Komma-Operator \`bestand[2]\`, eine ganze Zeile. Clang warnt.`,
      falsch: c`x = bestand[1, 2];`,
      richtig: c`x = bestand[1][2];`,
    },
  ],
  uebungen: [
    {
      id: 'k08-l03-u1',
      typ: 'vorhersage',
      titel: 'Element finden',
      stufe: 1,
      themen: ['arrays'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
            printf("%d %d %d\n", m[0][2], m[1][0], m[1][1] + m[0][1]);
            return 0;
        }
      `,
      ausgabe: out`
        3 4 7
      `,
    },
    {
      id: 'k08-l03-u2',
      typ: 'programm',
      titel: 'Spaltensummen',
      stufe: 2,
      themen: ['arrays', 'schleifen'],
      aufgabe: md`
        Vier Maschinen (Spalten) produzieren in drei Schichten (Zeilen). Gib für jede Maschine die Summe über alle Schichten aus, durch Leerzeichen getrennt:

        ~~~text
        Summen: 330 275 410 0
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int teile[3][4] = {
                {120, 90, 140, 0},
                {110, 95, 130, 0},
                {100, 90, 140, 0},
            };

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int teile[3][4] = {
                {120, 90, 140, 0},
                {110, 95, 130, 0},
                {100, 90, 140, 0},
            };

            printf("Summen:");
            for (int m = 0; m < 4; m++) {
                int summe = 0;
                for (int s = 0; s < 3; s++) {
                    summe += teile[s][m];
                }
                printf(" %d", summe);
            }
            printf("\n");
            return 0;
        }
      `,
      tests: [{ name: 'Spaltensummen', erwartet: { stdout: 'Summen: 330 275 410 0\n' } }],
      hinweise: [md`Diesmal läuft die äussere Schleife über die Spalten, die innere über die Zeilen.`],
    },
    {
      id: 'k08-l03-u3',
      typ: 'programm',
      titel: 'Display-Matrix',
      stufe: 3,
      themen: ['arrays', 'schleifen'],
      aufgabe: md`
        Ein LED-Display hat 5 Zeilen und 5 Spalten. Lege ein Array \`int led[5][5]\` an, setze alle LEDs auf der **Diagonalen** von links oben nach rechts unten **und** auf der Gegendiagonalen auf 1, alle anderen auf 0. Gib das Display aus, \`#\` für 1 und \`.\` für 0:

        ~~~text
        #...#
        .#.#.
        ..#..
        .#.#.
        #...#
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int led[5][5] = {0};

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int led[5][5] = {0};

            for (int i = 0; i < 5; i++) {
                led[i][i] = 1;
                led[i][4 - i] = 1;
            }
            for (int z = 0; z < 5; z++) {
                for (int s = 0; s < 5; s++) {
                    printf("%c", led[z][s] ? '#' : '.');
                }
                printf("\n");
            }
            return 0;
        }
      `,
      tests: [{ name: 'X-Muster', erwartet: { stdout: '#...#\n.#.#.\n..#..\n.#.#.\n#...#\n' } }],
      regeln: [{ muss: 'led\\s*\\[', meldung: 'Speichere das Muster im Array `led`.' }],
      hinweise: [md`Diagonale: \`led[i][i]\`. Gegendiagonale: \`led[i][4 - i]\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k08-l03-c1',
      typ: 'eingabe',
      themen: ['arrays'],
      frage: 'Wie viele `int`-Elemente hat `int raster[4][6]`?',
      antworten: ['24'],
    },
    {
      id: 'k08-l03-c2',
      typ: 'auswahl',
      themen: ['arrays'],
      frage: 'Wie greift man in `double w[3][5]` auf das letzte Element zu?',
      optionen: [{ text: '`w[2][4]`', richtig: true }, { text: '`w[3][5]`', warum: 'Indizes zählen ab 0.' }, { text: '`w[2, 4]`' }],
    },
    {
      id: 'k08-l03-c3',
      typ: 'wahrfalsch',
      themen: ['arrays'],
      aussage: 'Ein zweidimensionales Array liegt zeilenweise hintereinander im Speicher.',
      richtig: true,
    },
  ],
  zusammenfassung: [
    '`typ name[ZEILEN][SPALTEN]` für Tabellen und Raster; Zugriff `name[z][s]`.',
    'Zwei verschachtelte Schleifen: aussen Zeilen, innen Spalten.',
    'Initialisierung zeilenweise mit verschachtelten `{…}`.',
    'An Funktionen alle Dimensionen ausser der ersten angeben: `int t[][4]`.',
  ],
  referenz: ['array'],
};
