import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k10-l03',
  titel: 'Speicher aus Funktionen zurückgeben',
  dauer: 25,
  stichwoerter: ['Besitz', 'Ownership', 'Rückgabe', 'Aufrufer gibt frei', 'strdup', 'dynamischer String'],
  lernziele: [
    'in einer Funktion Speicher reservieren und an den Aufrufer zurückgeben',
    'klar festlegen, wer einen Block freigibt',
    'zwischen «Funktion reserviert» und «Aufrufer stellt Puffer» abwägen',
  ],
  erklaerung: md`
    In Kapitel 9 war die Regel: Nie die Adresse einer lokalen Variable zurückgeben, denn sie verschwindet mit dem \`return\`. Ein Block aus \`malloc\` dagegen lebt weiter, bis jemand \`free\` aufruft. Eine Funktion darf ihn also zurückgeben.

    ~~~c
    char *verbinden(const char *a, const char *b);   // Ergebnis mit free freigeben
    ~~~

    ### Wer räumt auf?

    Damit kein Leck entsteht, muss für jeden Block klar sein, wer ihn freigibt. Man sagt auch: Wer den Block **besitzt**. Die übliche Regel:

    - Liefert eine Funktion einen Zeiger auf neuen Speicher, **besitzt der Aufrufer** ihn danach und muss ihn freigeben.
    - Das gehört in den Kommentar über der Funktion. Der Compiler prüft es nicht.

    ### Zwei Bauarten

    | Bauart | Beispiel | Vorteil |
    |---|---|---|
    | Funktion reserviert | \`char *verbinden(a, b)\` | Grösse passt immer |
    | Aufrufer stellt Puffer | \`snprintf(ziel, groesse, …)\` | kein \`malloc\`, kein Leck möglich |

    Die Standardbibliothek nutzt meist die zweite Bauart. Für eigene Funktionen ist sie oft ebenfalls die bessere Wahl, vor allem auf Mikrocontrollern.

    > [!info] strdup
    > Die Funktion \`strdup\` (Text in neuen Speicher kopieren) gibt es auf vielen Systemen schon lange, im C-Standard aber erst seit C23. In C17 schreibt man sie selbst, wie in der Übung unten.
  `,
  syntax: [
    {
      code: c`
        /* Liefert neuen Speicher; der Aufrufer gibt ihn mit free frei. */
        typ *erzeugen(…) {
            typ *p = malloc(…);
            if (p == NULL) {
                return NULL;
            }
            …
            return p;
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdlib.h>
      #include <string.h>

      char *verbinden(const char *a, const char *b) {
          size_t laenge = strlen(a) + strlen(b) + 1;
          char *s = malloc(laenge);
          if (s == NULL) {
              return NULL;
          }
          snprintf(s, laenge, "%s%s", a, b);
          return s;
      }

      int *messreihe(int n, int start, int schritt) {
          int *r = malloc((size_t)n * sizeof *r);
          if (r == NULL) {
              return NULL;
          }
          for (int i = 0; i < n; i++) {
              r[i] = start + i * schritt;
          }
          return r;
      }

      int main(void) {
          char *name = verbinden("Motor_", "links");
          int *reihe = messreihe(4, 100, 25);
          if (name == NULL || reihe == NULL) {
              free(name);
              free(reihe);
              return 1;
          }

          printf("%s: %d %d %d %d\n", name, reihe[0], reihe[1], reihe[2], reihe[3]);

          free(name);
          free(reihe);
          return 0;
      }
    `,
    ausgabe: out`
      Motor_links: 100 125 150 175
    `,
  },
  zeilen: [
    { zeilen: '6', text: md`Platz für beide Texte plus Endzeichen.` },
    { zeilen: '11', text: md`\`snprintf\` setzt die Texte zusammen, ohne über den Block hinauszuschreiben.` },
    { zeilen: '12', text: md`Der Block überlebt das \`return\`. Ab jetzt gehört er dem Aufrufer.` },
    { zeilen: '29-33', text: md`Ging eine Reservierung schief, werden beide Zeiger freigegeben. \`free(NULL)\` ist erlaubt und tut nichts.` },
    { zeilen: '37-38', text: md`Der Aufrufer gibt beide Blöcke frei.` },
  ],
  ergebnis: md`
    Beide Funktionen liefern Speicher, der nach ihrem Ende weiterlebt. \`main\` verwendet ihn und gibt ihn danach zurück, die Speicherprüfung meldet nichts.
  `,
  fehler: [
    {
      titel: 'Rückgabe nicht freigeben',
      text: md`Wer \`printf("%s\n", verbinden(a, b));\` schreibt, verliert die Adresse sofort und erzeugt ein Leck. Das Ergebnis erst in einer Variable speichern, dann verwenden und freigeben.`,
    },
    {
      titel: 'Platz für das Endzeichen vergessen',
      text: md`\`malloc(strlen(a) + strlen(b))\` ist ein Byte zu klein. Das \`+ 1\` für \`'\0'\` gehört immer dazu.`,
    },
    {
      titel: 'Unklarer Besitz',
      text: md`Gibt mal die Funktion frei und mal der Aufrufer, entstehen doppelte \`free\` oder Lecks. Lege die Regel einmal fest und schreibe sie über die Funktion.`,
    },
  ],
  uebungen: [
    {
      id: 'k10-l03-u1',
      typ: 'auswahl',
      titel: 'Wer gibt frei?',
      stufe: 1,
      themen: ['speicher', 'funktionen'],
      frage: '`int *liste_laden(void)` liefert einen Block aus `malloc`. Wer muss ihn freigeben?',
      optionen: [
        { text: 'Der Aufrufer, sobald er die Liste nicht mehr braucht', richtig: true },
        { text: '`liste_laden` selbst, vor dem `return`', warum: 'Dann wäre der zurückgegebene Zeiger sofort ungültig.' },
        { text: 'Niemand, das passiert automatisch' },
      ],
    },
    {
      id: 'k10-l03-u2',
      typ: 'programm',
      titel: 'Text kopieren',
      stufe: 2,
      themen: ['speicher', 'strings'],
      aufgabe: md`
        Schreibe \`char *kopiere(const char *s)\`. Sie reserviert genau so viel Speicher wie nötig, kopiert \`s\` hinein und liefert den neuen Text. Bei fehlendem Speicher liefert sie \`NULL\`. Der Aufrufer gibt das Ergebnis frei.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>
        #include <string.h>

        int main(void) {
            char *k = kopiere("Förderband");
            if (k != NULL) {
                printf("%s\n", k);
                free(k);
            }
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdlib.h>
        #include <string.h>

        char *kopiere(const char *s) {
            size_t groesse = strlen(s) + 1;
            char *k = malloc(groesse);
            if (k == NULL) {
                return NULL;
            }
            memcpy(k, s, groesse);
            return k;
        }

        int main(void) {
            char *k = kopiere("Förderband");
            if (k != NULL) {
                printf("%s\n", k);
                free(k);
            }
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        #include <stdlib.h>
        char *kopiere(const char *s);
        int main(void) {
            char quelle[] = "Achse";
            char *k = kopiere(quelle);
            quelle[0] = 'X';
            char *leer = kopiere("");
            printf("[%s] [%s] %d\n", k, leer, k != quelle);
            free(k);
            free(leer);
            return 0;
        }
      `,
      tests: [{ name: 'Eigene Kopie', erwartet: { stdout: '[Achse] [] 1\n', sauber: true }, tipp: md`Die Kopie muss ein eigener Block sein; Änderungen am Original dürfen sie nicht betreffen.` }],
      regeln: [{ muss: '\\bmalloc\\s*\\(', meldung: 'Reserviere den Speicher mit `malloc`.' }],
      hinweise: [md`Grösse: \`strlen(s) + 1\`.`, md`Kopieren mit \`memcpy(k, s, groesse)\` oder \`snprintf(k, groesse, "%s", s)\`.`],
    },
    {
      id: 'k10-l03-u3',
      typ: 'programm',
      titel: 'Zahlenbereich erzeugen',
      stufe: 3,
      themen: ['speicher', 'funktionen', 'zeiger'],
      aufgabe: md`
        Schreibe \`int *bereich(int von, int bis, int *anzahl)\`. Sie liefert ein neues Array mit allen Zahlen von \`von\` bis \`bis\` (beide eingeschlossen) und schreibt die Anzahl nach \`*anzahl\`. Ist \`bis\` kleiner als \`von\`, liefert sie \`NULL\` und setzt \`*anzahl\` auf 0.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int n = 0;
            int *b = bereich(3, 7, &n);
            for (int i = 0; i < n; i++) {
                printf("%d ", b[i]);
            }
            printf("\n");
            free(b);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdlib.h>

        int *bereich(int von, int bis, int *anzahl) {
            *anzahl = 0;
            if (bis < von) {
                return NULL;
            }
            int n = bis - von + 1;
            int *r = malloc((size_t)n * sizeof *r);
            if (r == NULL) {
                return NULL;
            }
            for (int i = 0; i < n; i++) {
                r[i] = von + i;
            }
            *anzahl = n;
            return r;
        }

        int main(void) {
            int n = 0;
            int *b = bereich(3, 7, &n);
            for (int i = 0; i < n; i++) {
                printf("%d ", b[i]);
            }
            printf("\n");
            free(b);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        #include <stdlib.h>
        int *bereich(int von, int bis, int *anzahl);
        int main(void) {
            int n1 = -1, n2 = -1, n3 = -1;
            int *a = bereich(3, 7, &n1);
            int *b = bereich(-2, -2, &n2);
            int *c = bereich(5, 1, &n3);
            printf("%d: %d..%d | %d: %d | %d %d\n", n1, a[0], a[n1 - 1], n2, b[0], n3, c == NULL);
            free(a);
            free(b);
            return 0;
        }
      `,
      tests: [{ name: 'Normal, ein Wert, leer', erwartet: { stdout: '5: 3..7 | 1: -2 | 0 1\n', sauber: true }, tipp: md`Die Anzahl ist \`bis - von + 1\`. Bei \`bis < von\` muss \`*anzahl\` trotzdem auf 0 gesetzt werden.` }],
      hinweise: [md`Setze zuerst \`*anzahl = 0;\` und prüfe dann \`bis < von\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k10-l03-c1',
      typ: 'wahrfalsch',
      themen: ['speicher', 'funktionen'],
      aussage: 'Eine Funktion darf einen Zeiger auf einen Block aus `malloc` zurückgeben.',
      richtig: true,
      erklaerung: 'Der Block lebt bis zum `free`, anders als eine lokale Variable.',
    },
    {
      id: 'k10-l03-c2',
      typ: 'auswahl',
      themen: ['speicher', 'strings'],
      frage: 'Wie viele Byte braucht eine Kopie von `"Motor"`?',
      optionen: [{ text: '6', richtig: true }, { text: '5' }, { text: '4' }],
    },
    {
      id: 'k10-l03-c3',
      typ: 'auswahl',
      themen: ['speicher'],
      frage: 'Welche Bauart vermeidet `malloc` in der Funktion ganz?',
      optionen: [{ text: 'Der Aufrufer übergibt einen Puffer und dessen Grösse.', richtig: true }, { text: 'Die Funktion gibt die Adresse einer lokalen Variable zurück.' }, { text: 'Die Funktion verwendet `calloc` statt `malloc`.' }],
    },
  ],
  zusammenfassung: [
    'Blöcke aus `malloc` überleben das `return` und dürfen zurückgegeben werden.',
    'Wer neuen Speicher bekommt, besitzt ihn und gibt ihn frei.',
    'Die Besitzregel gehört als Kommentar über die Funktion.',
    'Alternative ohne `malloc`: Der Aufrufer stellt Puffer und Grösse.',
  ],
  referenz: ['malloc', 'free', 'snprintf'],
};
