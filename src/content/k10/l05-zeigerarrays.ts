import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k10-l05',
  titel: 'Zeiger auf Zeiger und Arrays von Zeigern',
  dauer: 30,
  stichwoerter: ['Zeiger auf Zeiger', 'int **', 'char *argv[]', 'Array von Zeigern', 'dynamische Matrix', 'argc', 'argv', 'Doppelzeiger'],
  lernziele: [
    'Arrays von Zeigern lesen und verwenden, etwa `char *argv[]`',
    'eine dynamische Tabelle mit `int **` anlegen und vollständig freigeben',
    'über einen Zeiger auf einen Zeiger den Zeiger des Aufrufers ändern',
  ],
  erklaerung: md`
    Zeiger sind Variablen, also haben sie selbst eine Adresse. Ein **Zeiger auf einen Zeiger** speichert diese Adresse: \`int **pp\`. Das klingt verschachtelt, kommt aber in drei Situationen ständig vor.

    ### 1. Arrays von Zeigern

    \`const char *achsen[] = {"X", "Y", "Z"};\` ist ein Array aus drei Zeigern, jeder zeigt auf einen Text. Auch \`main\` bekommt so ein Array: In \`int main(int argc, char *argv[])\` enthält \`argv\` die Programmargumente als Texte, \`argc\` ihre Anzahl. \`argv[0]\` ist der Programmname, die eigentlichen Argumente beginnen bei \`argv[1]\`. Als Parameter ist \`char *argv[]\` dasselbe wie \`char **argv\`.

    ### 2. Dynamische Tabellen

    Für eine Tabelle, deren Grösse erst zur Laufzeit feststeht, reserviert man zuerst ein Array von Zeilenzeigern und dann jede Zeile:

    ~~~c
    int **m = calloc(zeilen, sizeof *m);        // Zeilenzeiger
    m[z] = calloc(spalten, sizeof *m[z]);       // eine Zeile
    m[z][s] = 5;                                // Zugriff wie bei einem 2D-Array
    ~~~

    Freigeben in umgekehrter Reihenfolge: erst jede Zeile, dann das Array der Zeilenzeiger.

    ### 3. Den Zeiger des Aufrufers ändern

    Soll eine Funktion einen Zeiger des Aufrufers umsetzen, etwa nach einem \`realloc\`, braucht sie seine Adresse, also einen Zeiger auf den Zeiger:

    ~~~c
    int anhaengen(int **werte, size_t *anzahl, int neu);
    anhaengen(&werte, &anzahl, 42);
    ~~~

    In der Funktion ist \`*werte\` dann der Zeiger des Aufrufers und \`(*werte)[i]\` ein Element.
  `,
  syntax: [
    {
      code: c`
        typ **pp = &p;                    // Zeiger auf Zeiger
        **pp                              // Wert, auf den p zeigt
        int main(int argc, char *argv[])  // Programmargumente
        int **m = calloc(zeilen, sizeof *m);
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdlib.h>

      void freigeben(int **m, int zeilen) {
          for (int z = 0; z < zeilen; z++) {
              free(m[z]);
          }
          free(m);
      }

      int **matrix_anlegen(int zeilen, int spalten) {
          int **m = calloc((size_t)zeilen, sizeof *m);
          if (m == NULL) {
              return NULL;
          }
          for (int z = 0; z < zeilen; z++) {
              m[z] = calloc((size_t)spalten, sizeof *m[z]);
              if (m[z] == NULL) {
                  freigeben(m, zeilen);
                  return NULL;
              }
          }
          return m;
      }

      int main(void) {
          const char *achsen[] = {"X", "Y", "Z"};
          int **pos = matrix_anlegen(3, 4);
          if (pos == NULL) {
              return 1;
          }

          for (int z = 0; z < 3; z++) {
              for (int s = 0; s < 4; s++) {
                  pos[z][s] = (z + 1) * 10 * s;
              }
          }

          for (int z = 0; z < 3; z++) {
              printf("%s:", achsen[z]);
              for (int s = 0; s < 4; s++) {
                  printf(" %3d", pos[z][s]);
              }
              printf("\n");
          }

          freigeben(pos, 3);
          return 0;
      }
    `,
    ausgabe: out`
      X:   0  10  20  30
      Y:   0  20  40  60
      Z:   0  30  60  90
    `,
  },
  zeilen: [
    { zeilen: '4-9', text: md`Erst jede Zeile freigeben, dann das Array der Zeilenzeiger.` },
    { zeilen: '12', text: md`Das Array der Zeilenzeiger kommt aus \`calloc\`: Alle Zeiger sind zunächst \`NULL\`.` },
    { zeilen: '17-21', text: md`Scheitert eine Zeile, wird alles Bisherige freigegeben. Weil die übrigen Zeiger \`NULL\` sind, ist \`free\` auf ihnen harmlos.` },
    { zeilen: '27', text: md`Ein Array von drei Zeigern auf Texte.` },
    { zeilen: '35', text: md`Zugriff mit zwei Indizes wie bei einem gewöhnlichen 2D-Array.` },
    { zeilen: '47', text: md`Alles in einem Aufruf zurückgeben.` },
  ],
  ergebnis: md`
    Die Tabelle hat drei Zeilen zu je vier Werten, ihre Grösse wurde erst zur Laufzeit festgelegt. Die Achsennamen kommen aus dem Array von Zeigern. Am Ende sind alle vier Blöcke (drei Zeilen und die Zeilenzeiger) freigegeben.
  `,
  fehler: [
    {
      titel: 'In falscher Reihenfolge freigeben',
      text: md`Wer zuerst \`free(m)\` aufruft, kann danach \`m[z]\` nicht mehr lesen; die Zeilen bleiben als Lecks zurück.`,
    },
    {
      titel: 'argv[0] für das erste Argument halten',
      text: md`\`argv[0]\` ist der Programmname. Das erste Argument steht in \`argv[1]\`, und es gibt nur \`argc - 1\` davon.`,
    },
    {
      titel: '*werte[i] statt (*werte)[i]',
      text: md`\`[]\` bindet stärker als \`*\`. Bei \`int **werte\` ist \`*werte[i]\` dasselbe wie \`*(werte[i])\`, gemeint ist aber \`(*werte)[i]\`.`,
    },
  ],
  uebungen: [
    {
      id: 'k10-l05-u1',
      typ: 'vorhersage',
      titel: 'Zeiger auf Texte',
      stufe: 1,
      themen: ['zeiger', 'strings'],
      code: c`
        #include <stdio.h>

        void weiter(const char **p) {
            (*p)++;
        }

        int main(void) {
            const char *namen[3] = {"Pumpe", "Ventil", "Motor"};
            const char *s = namen[1];
            weiter(&s);
            printf("%s %c %s\n", s, namen[2][0], namen[0] + 3);
            return 0;
        }
      `,
      ausgabe: out`
        entil M pe
      `,
      erklaerung: md`\`weiter\` rückt den Zeiger \`s\` des Aufrufers um ein Zeichen vor. \`namen[2][0]\` ist das erste Zeichen von «Motor», \`namen[0] + 3\` zeigt auf «pe».`,
    },
    {
      id: 'k10-l05-u2',
      typ: 'programm',
      titel: 'Argumente rückwärts',
      stufe: 2,
      themen: ['zeiger', 'strings', 'funktionen'],
      aufgabe: md`
        Gib die Programmargumente in umgekehrter Reihenfolge aus, eines pro Zeile, ohne den Programmnamen. Ohne Argumente gibt das Programm \`keine Argumente\` aus. Zum Ausprobieren trägst du Argumente über den Knopf «Eingabe» im Feld «Programm-Argumente» ein.
      `,
      start: c`
        #include <stdio.h>

        int main(int argc, char *argv[]) {
            printf("%d Argumente nach %s\n", argc - 1, argv[0]);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(int argc, char *argv[]) {
            if (argc < 2) {
                printf("keine Argumente\n");
                return 0;
            }
            for (int i = argc - 1; i >= 1; i--) {
                printf("%s\n", argv[i]);
            }
            return 0;
        }
      `,
      tests: [
        { name: 'Drei Argumente', args: ['rot', 'gruen', 'blau'], erwartet: { stdout: 'blau\ngruen\nrot\n' } },
        { name: 'Keine Argumente', args: [], erwartet: { stdout: 'keine Argumente\n' }, tipp: md`\`argc\` ist mindestens 1, weil \`argv[0]\` der Programmname ist.` },
      ],
      hinweise: [md`Die Argumente stehen in \`argv[1]\` bis \`argv[argc - 1]\`.`, md`\`for (int i = argc - 1; i >= 1; i--)\`.`],
    },
    {
      id: 'k10-l05-u3',
      typ: 'programm',
      titel: 'Anhängen über Doppelzeiger',
      stufe: 3,
      themen: ['zeiger', 'speicher', 'funktionen'],
      aufgabe: md`
        Schreibe \`int anhaengen(int **werte, size_t *anzahl, int neu)\`. Sie vergrössert das Array des Aufrufers mit \`realloc\` um ein Element, hängt \`neu\` an, erhöht \`*anzahl\` und liefert 1. Gelingt das Vergrössern nicht, bleibt alles unverändert und sie liefert 0.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int *w = NULL;
            size_t n = 0;
            anhaengen(&w, &n, 4);
            anhaengen(&w, &n, 8);
            printf("%zu: %d %d\n", n, w[0], w[1]);
            free(w);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdlib.h>

        int anhaengen(int **werte, size_t *anzahl, int neu) {
            int *groesser = realloc(*werte, (*anzahl + 1) * sizeof **werte);
            if (groesser == NULL) {
                return 0;
            }
            groesser[*anzahl] = neu;
            *werte = groesser;
            (*anzahl)++;
            return 1;
        }

        int main(void) {
            int *w = NULL;
            size_t n = 0;
            anhaengen(&w, &n, 4);
            anhaengen(&w, &n, 8);
            printf("%zu: %d %d\n", n, w[0], w[1]);
            free(w);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        #include <stdlib.h>
        int anhaengen(int **werte, size_t *anzahl, int neu);
        int main(void) {
            int *w = NULL;
            size_t n = 0;
            anhaengen(&w, &n, 4);
            anhaengen(&w, &n, 8);
            int ok = anhaengen(&w, &n, 15);
            printf("%d %zu:", ok, n);
            for (size_t i = 0; i < n; i++) {
                printf(" %d", w[i]);
            }
            printf("\n");
            free(w);
            return 0;
        }
      `,
      tests: [{ name: 'Drei Werte anhängen', erwartet: { stdout: '1 3: 4 8 15\n', sauber: true }, tipp: md`Nach dem \`realloc\` muss \`*werte\` auf den neuen Block zeigen.` }],
      hinweise: [
        md`\`realloc(*werte, (*anzahl + 1) * sizeof **werte)\`. Mit \`*werte == NULL\` wirkt es wie \`malloc\`.`,
        md`Klammern beachten: \`(*anzahl)++\`, nicht \`*anzahl++\`.`,
      ],
    },
  ],
  wissenscheck: [
    {
      id: 'k10-l05-c1',
      typ: 'auswahl',
      themen: ['zeiger', 'funktionen'],
      frage: 'Was steht in `argv[0]`?',
      optionen: [{ text: 'Der Programmname', richtig: true }, { text: 'Das erste Argument' }, { text: 'Die Anzahl der Argumente' }],
    },
    {
      id: 'k10-l05-c2',
      typ: 'wahrfalsch',
      themen: ['zeiger'],
      aussage: 'Damit eine Funktion einen Zeiger des Aufrufers ändern kann, braucht sie einen Zeiger auf diesen Zeiger.',
      richtig: true,
    },
    {
      id: 'k10-l05-c3',
      typ: 'auswahl',
      themen: ['speicher'],
      frage: 'In welcher Reihenfolge gibt man eine Tabelle `int **m` frei?',
      optionen: [{ text: 'Erst alle Zeilen `m[z]`, dann `m`', richtig: true }, { text: 'Erst `m`, dann alle Zeilen' }, { text: 'Nur `m`, die Zeilen werden mitgenommen' }],
    },
  ],
  zusammenfassung: [
    'Ein Zeiger auf einen Zeiger (`int **`) speichert die Adresse eines Zeigers.',
    '`char *argv[]` ist ein Array von Texten; `argv[0]` ist der Programmname.',
    'Dynamische Tabellen: Zeilenzeiger plus eine Reservierung pro Zeile; umgekehrt freigeben.',
    'Mit `int **` kann eine Funktion den Zeiger des Aufrufers umsetzen.',
  ],
  referenz: ['zeiger-auf-zeiger', 'main', 'calloc'],
};
