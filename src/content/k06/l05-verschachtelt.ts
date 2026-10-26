import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k06-l05',
  titel: 'Verschachtelte Schleifen',
  dauer: 25,
  stichwoerter: ['verschachtelt', 'innere Schleife', 'äussere Schleife', 'Tabelle', 'Raster', 'Matrix', 'Muster', 'Einmaleins'],
  lernziele: [
    'Schleifen ineinander verschachteln und den Ablauf nachvollziehen',
    'Tabellen und Raster mit zwei Zählern ausgeben',
    'die Anzahl Durchläufe einer verschachtelten Schleife abschätzen',
  ],
  erklaerung: md`
    Ein Regallager hat Reihen und in jeder Reihe Fächer. Eine Leiterplatte hat Zeilen und Spalten von Lötpunkten. Für solche **zweidimensionalen** Aufgaben steckt man eine Schleife in eine andere:

    ~~~c
    for (int reihe = 1; reihe <= 3; reihe++) {        // äussere Schleife
        for (int fach = 1; fach <= 4; fach++) {       // innere Schleife
            printf("R%d-F%d ", reihe, fach);
        }
        printf("\n");
    }
    ~~~

    Für **jeden** Durchlauf der äusseren Schleife läuft die innere **vollständig** durch. Die innere ist also bei jeder Reihe wieder bei Fach 1. Insgesamt gibt es 3 · 4 = 12 innere Durchläufe.

    ### Ablauf

    | äusserer Zähler | innere Durchläufe |
    |---|---|
    | reihe = 1 | fach = 1, 2, 3, 4, dann Zeilenumbruch |
    | reihe = 2 | fach = 1, 2, 3, 4, dann Zeilenumbruch |
    | reihe = 3 | fach = 1, 2, 3, 4, dann Zeilenumbruch |

    ### Worauf achten

    - **Verschiedene Zählernamen:** Innen und aussen darf nicht derselbe Name (z. B. zweimal \`i\`) verwendet werden, sonst stören sich die Schleifen. Sprechende Namen wie \`reihe\` und \`fach\` machen den Code verständlicher als \`i\` und \`j\`.
    - **Aufwand:** Die Anzahl Durchläufe multipliziert sich. 1000 · 1000 sind eine Million. Bei drei verschachtelten Schleifen wird es schnell zu viel.
    - **Innere Grenze kann vom äusseren Zähler abhängen:** \`for (int j = 0; j <= i; j++)\` erzeugt Dreiecke.
  `,
  syntax: [
    {
      code: c`
        for (int zeile = 0; zeile < ZEILEN; zeile++) {
            for (int spalte = 0; spalte < SPALTEN; spalte++) {
                // für jede Kombination aus zeile und spalte
            }
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          // Lagerplätze: 3 Reihen mit je 4 Fächern
          for (int reihe = 1; reihe <= 3; reihe++) {
              for (int fach = 1; fach <= 4; fach++) {
                  printf("R%d-F%d ", reihe, fach);
              }
              printf("\n");
          }

          // Einmaleins-Ausschnitt mit Feldbreite
          printf("\n");
          for (int a = 1; a <= 4; a++) {
              for (int b = 1; b <= 5; b++) {
                  printf("%4d", a * b);
              }
              printf("\n");
          }
          return 0;
      }
    `,
    ausgabe: out`
      R1-F1 R1-F2 R1-F3 R1-F4
      R2-F1 R2-F2 R2-F3 R2-F4
      R3-F1 R3-F2 R3-F3 R3-F4

         1   2   3   4   5
         2   4   6   8  10
         3   6   9  12  15
         4   8  12  16  20
    `,
  },
  zeilen: [
    { zeilen: '5', text: md`Die äussere Schleife zählt die Reihen.` },
    { zeilen: '6-8', text: md`Die innere Schleife läuft für jede Reihe von Fach 1 bis 4.` },
    { zeilen: '9', text: md`Nach jeder Reihe ein Zeilenumbruch: Er steht in der äusseren, nicht in der inneren Schleife.` },
    { zeilen: '16', text: md`\`%4d\` sorgt für gleich breite Spalten.` },
  ],
  ergebnis: md`
    Die Lagerplätze erscheinen als Raster aus 3 × 4 Einträgen, darunter eine Multiplikationstabelle. Verschiebe testweise das \`printf("\n")\` aus Zeile 9 in die innere Schleife: Dann steht jeder Platz auf einer eigenen Zeile.
  `,
  fehler: [
    {
      titel: 'Gleicher Zähler innen und aussen',
      text: md`Verändern beide Schleifen dieselbe Variable, endet die äussere zu früh oder nie.`,
      falsch: c`
        int i;
        for (i = 0; i < 3; i++) {
            for (i = 0; i < 4; i++) { … }
        }
      `,
      richtig: c`
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 4; j++) { … }
        }
      `,
    },
    {
      titel: 'Zeilenumbruch an der falschen Stelle',
      text: md`Das \`\n\` für das Zeilenende gehört nach der inneren Schleife, nicht in sie hinein.`,
    },
  ],
  uebungen: [
    {
      id: 'k06-l05-u1',
      typ: 'vorhersage',
      titel: 'Dreieck',
      stufe: 1,
      themen: ['schleifen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            for (int i = 1; i <= 4; i++) {
                for (int j = 1; j <= i; j++) {
                    printf("*");
                }
                printf("\n");
            }
            return 0;
        }
      `,
      ausgabe: out`
        *
        **
        ***
        ****
      `,
    },
    {
      id: 'k06-l05-u2',
      typ: 'programm',
      titel: 'Lötraster',
      stufe: 2,
      themen: ['schleifen', 'eingabe'],
      aufgabe: md`
        Lies Zeilen und Spalten einer Lochrasterplatine ein und zeichne sie aus \`o\`. Bei \`3 5\`:

        ~~~text
        ooooo
        ooooo
        ooooo
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int zeilen = 0, spalten = 0;
            scanf("%d %d", &zeilen, &spalten);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int zeilen = 0, spalten = 0;
            scanf("%d %d", &zeilen, &spalten);

            for (int z = 0; z < zeilen; z++) {
                for (int s = 0; s < spalten; s++) {
                    printf("o");
                }
                printf("\n");
            }
            return 0;
        }
      `,
      tests: [
        { name: '3 x 5', stdin: '3 5\n', erwartet: { stdout: 'ooooo\nooooo\nooooo\n' } },
        { name: '1 x 2', stdin: '1 2\n', erwartet: { stdout: 'oo\n' } },
      ],
      hinweise: [md`Aussen die Zeilen, innen die Spalten, nach der inneren Schleife \`\n\`.`],
    },
    {
      id: 'k06-l05-u3',
      typ: 'programm',
      titel: 'Schachbrett-Prüfmuster',
      stufe: 3,
      themen: ['schleifen', 'operatoren'],
      aufgabe: md`
        Ein Display wird mit einem Schachbrettmuster getestet. Lies eine Grösse n und gib n × n Zeichen aus: \`#\`, wenn Zeile + Spalte gerade ist, sonst \`.\` (Zeilen und Spalten ab 0 gezählt). Bei 4:

        ~~~text
        #.#.
        .#.#
        #.#.
        .#.#
        ~~~
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

            for (int z = 0; z < n; z++) {
                for (int s = 0; s < n; s++) {
                    printf("%c", (z + s) % 2 == 0 ? '#' : '.');
                }
                printf("\n");
            }
            return 0;
        }
      `,
      tests: [
        { name: '4', stdin: '4\n', erwartet: { stdout: '#.#.\n.#.#\n#.#.\n.#.#\n' } },
        { name: '3', stdin: '3\n', erwartet: { stdout: '#.#\n.#.\n#.#\n' } },
      ],
      hinweise: [md`\`(z + s) % 2 == 0\` entscheidet über das Zeichen.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k06-l05-c1',
      typ: 'eingabe',
      themen: ['schleifen'],
      frage: 'Wie oft wird der innere Rumpf ausgeführt? `for (int i = 0; i < 5; i++) for (int j = 0; j < 6; j++) { … }`',
      antworten: ['30'],
    },
    {
      id: 'k06-l05-c2',
      typ: 'wahrfalsch',
      themen: ['schleifen'],
      aussage: 'Die innere Schleife läuft für jeden Durchlauf der äusseren Schleife vollständig durch.',
      richtig: true,
    },
    {
      id: 'k06-l05-c3',
      typ: 'auswahl',
      themen: ['schleifen'],
      frage: 'Wo gehört das `printf("\\n")` hin, damit ein Raster entsteht?',
      optionen: [{ text: 'In die äussere Schleife, nach der inneren', richtig: true }, { text: 'In die innere Schleife' }, { text: 'Nach beiden Schleifen' }],
    },
  ],
  zusammenfassung: [
    'Bei verschachtelten Schleifen läuft die innere für jeden äusseren Durchlauf komplett.',
    'Die Anzahl Durchläufe multipliziert sich.',
    'Innen und aussen verschiedene Zählernamen verwenden, am besten sprechende.',
    'Zeilenumbruch nach der inneren Schleife ergibt ein Raster.',
  ],
  referenz: ['for'],
};
