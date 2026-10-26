import { c, md, out } from '../tags.ts';
import type { Aufgabe } from '../types.ts';

/** Fragenpool für den Kapiteltest 10. */
export const test: Aufgabe[] = [
  {
    id: 'k10-t01',
    typ: 'auswahl',
    themen: ['speicher'],
    frage: 'Wie reserviert man Platz für `n` Werte vom Typ `double`?',
    optionen: [
      { text: '`double *w = malloc(n * sizeof *w);`', richtig: true },
      { text: '`double *w = malloc(n);`', warum: 'Das sind n Byte, nicht n Werte.' },
      { text: '`double w = malloc(n * sizeof(double));`', warum: 'Das Ergebnis ist eine Adresse und gehört in einen Zeiger.' },
    ],
  },
  {
    id: 'k10-t02',
    typ: 'wahrfalsch',
    themen: ['speicher'],
    aussage: 'Der Inhalt eines neuen Blocks aus `malloc` ist mit Nullen gefüllt.',
    richtig: false,
    erklaerung: 'Nur `calloc` füllt mit Nullen.',
  },
  {
    id: 'k10-t03',
    typ: 'vorhersage',
    themen: ['speicher'],
    code: c`
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int *a = calloc(4, sizeof *a);
          if (a == NULL) {
              return 1;
          }
          for (int i = 0; i < 4; i += 2) {
              a[i] = i + 1;
          }
          int *b = realloc(a, 6 * sizeof *a);
          if (b == NULL) {
              free(a);
              return 1;
          }
          b[5] = 9;
          printf("%d %d %d %d %d\n", b[0], b[1], b[2], b[3], b[5]);
          free(b);
          return 0;
      }
    `,
    ausgabe: out`
      1 0 3 0 9
    `,
  },
  {
    id: 'k10-t04',
    typ: 'auswahl',
    themen: ['speicher', 'fehler'],
    frage: 'Warum schreibt man das Ergebnis von `realloc` zuerst in einen Hilfszeiger?',
    optionen: [
      { text: 'Bei `NULL` bleibt der alte Block gültig und kann noch freigegeben werden.', richtig: true },
      { text: 'Weil `realloc` den alten Zeiger sonst auf `NULL` setzt.' },
      { text: 'Weil die Zuweisung an denselben Zeiger nicht kompiliert.' },
    ],
  },
  {
    id: 'k10-t05',
    typ: 'eingabe',
    themen: ['speicher'],
    frage: 'In welchem Header stehen `malloc` und `free`?',
    antworten: ['stdlib.h', '<stdlib.h>'],
  },
  {
    id: 'k10-t06',
    typ: 'zuordnen',
    themen: ['speicher'],
    frage: 'Ordne die Funktionen zu.',
    paare: [
      { links: '`malloc`', rechts: 'reserviert, Inhalt zufällig' },
      { links: '`calloc`', rechts: 'reserviert und füllt mit Nullen' },
      { links: '`realloc`', rechts: 'ändert die Grösse, behält den Inhalt' },
      { links: '`free`', rechts: 'gibt einen Block zurück' },
    ],
  },
  {
    id: 'k10-t07',
    typ: 'auswahl',
    themen: ['speicher', 'fehler'],
    frage: 'Welche Zeile erzeugt ein Speicherleck?',
    code: c`
      char *p = malloc(32);
      char *q = malloc(32);
      p = q;
      free(q);
    `,
    optionen: [
      { text: '`p = q;`, denn danach ist die Adresse des ersten Blocks verloren.', richtig: true },
      { text: '`free(q);`' },
      { text: 'Keine, beide Blöcke werden freigegeben.' },
    ],
  },
  {
    id: 'k10-t08',
    typ: 'wahrfalsch',
    themen: ['speicher', 'funktionen'],
    aussage: 'Eine Funktion darf einen Zeiger auf einen Block aus `malloc` zurückgeben; der Aufrufer gibt ihn dann frei.',
    richtig: true,
  },
  {
    id: 'k10-t09',
    typ: 'auswahl',
    themen: ['speicher', 'fehler'],
    frage: 'Was passiert bei `free(p); free(p);` ohne `p = NULL;` dazwischen?',
    optionen: [{ text: 'Doppeltes `free`: undefiniertes Verhalten, oft ein Absturz', richtig: true }, { text: 'Nichts, das zweite `free` wird ignoriert' }, { text: 'Der Block wird doppelt so gross' }],
  },
  {
    id: 'k10-t10',
    typ: 'eingabe',
    themen: ['zeiger'],
    frage: 'Ein Programm wird mit `prog a b` gestartet. Welchen Wert hat `argc`?',
    antworten: ['3'],
  },
  {
    id: 'k10-t11',
    typ: 'luecke',
    themen: ['speicher'],
    frage: 'Ergänze das sichere Vergrössern.',
    code: c`
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int *w = malloc(2 * sizeof *w);
          if (w == NULL) {
              return 1;
          }
          int *neu = __1__(w, 4 * sizeof *w);
          if (neu == __2__) {
              free(w);
              return 1;
          }
          w = neu;
          w[3] = 7;
          printf("%d\n", w[3]);
          free(w);
          return 0;
      }
    `,
    luecken: [['realloc'], ['NULL']],
    ausgabe: '7\n',
  },
  {
    id: 'k10-t12',
    typ: 'vorhersage',
    themen: ['zeiger'],
    code: c`
      #include <stdio.h>

      int main(void) {
          int a = 3;
          int *p = &a;
          int **pp = &p;
          **pp = 10;
          printf("%d %d\n", a, *p + 1);
          return 0;
      }
    `,
    ausgabe: out`
      10 11
    `,
  },
  {
    id: 'k10-t13',
    typ: 'auswahl',
    themen: ['speicher'],
    frage: 'Wann ist ein Block aus `malloc` besser als ein Array auf dem Stack?',
    mehrfach: true,
    optionen: [
      { text: 'Wenn die Grösse erst zur Laufzeit feststeht', richtig: true },
      { text: 'Wenn die Daten das Ende der Funktion überleben sollen', richtig: true },
      { text: 'Wenn das Array nur drei Elemente hat' },
    ],
  },
  {
    id: 'k10-t14',
    typ: 'programm',
    themen: ['speicher', 'strings'],
    aufgabe: md`
      Schreibe \`char *gross(const char *s)\`. Sie liefert eine neue Kopie von \`s\`, in der alle Kleinbuchstaben a bis z durch Grossbuchstaben ersetzt sind, oder \`NULL\` bei fehlendem Speicher. Das Original bleibt unverändert.
    `,
    start: c`
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          char *g = gross("Motor 3 ein");
          if (g != NULL) {
              printf("%s\n", g);
              free(g);
          }
          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>
      #include <stdlib.h>
      #include <string.h>
      #include <ctype.h>

      char *gross(const char *s) {
          size_t n = strlen(s);
          char *g = malloc(n + 1);
          if (g == NULL) {
              return NULL;
          }
          for (size_t i = 0; i <= n; i++) {
              g[i] = (char)toupper((unsigned char)s[i]);
          }
          return g;
      }

      int main(void) {
          char *g = gross("Motor 3 ein");
          if (g != NULL) {
              printf("%s\n", g);
              free(g);
          }
          return 0;
      }
    `,
    harness: c`
      #undef main
      #include <stdio.h>
      #include <stdlib.h>
      char *gross(const char *s);
      int main(void) {
          const char *o = "Motor 3 ein";
          char *g = gross(o);
          char *l = gross("");
          printf("[%s] [%s] [%s]\n", g, l, o);
          free(g);
          free(l);
          return 0;
      }
    `,
    tests: [{ name: 'Text und leerer Text', erwartet: { stdout: '[MOTOR 3 EIN] [] [Motor 3 ein]\n', sauber: true } }],
  },
  {
    id: 'k10-t15',
    typ: 'fehlersuche',
    themen: ['speicher', 'fehler'],
    aufgabe: md`
      Das Programm gibt die richtige Summe aus, hinterlässt aber ein Speicherleck. Behebe es, ohne die Ausgabe zu ändern.
    `,
    start: c`
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int n = 0;
          if (scanf("%d", &n) != 1 || n < 1) {
              return 1;
          }
          int *w = malloc((size_t)n * sizeof *w);
          if (w == NULL) {
              return 1;
          }
          int summe = 0;
          for (int i = 0; i < n; i++) {
              if (scanf("%d", &w[i]) != 1) {
                  return 1;
              }
              summe += w[i];
          }
          printf("%d\n", summe);
          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int n = 0;
          if (scanf("%d", &n) != 1 || n < 1) {
              return 1;
          }
          int *w = malloc((size_t)n * sizeof *w);
          if (w == NULL) {
              return 1;
          }
          int summe = 0;
          for (int i = 0; i < n; i++) {
              if (scanf("%d", &w[i]) != 1) {
                  free(w);
                  return 1;
              }
              summe += w[i];
          }
          printf("%d\n", summe);
          free(w);
          return 0;
      }
    `,
    tests: [
      { name: 'Vollständige Eingabe', stdin: '3\n4 5 6\n', erwartet: { stdout: '15\n', sauber: true } },
      { name: 'Abgebrochene Eingabe', stdin: '3\n4 x\n', erwartet: { stdout: '', exitCode: 1, sauber: true }, tipp: md`Auch der vorzeitige Ausstieg muss den Block freigeben.` },
    ],
  },
];
