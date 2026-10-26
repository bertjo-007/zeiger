import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'malloc',
    name: 'malloc',
    kategorie: 'funktion',
    header: 'stdlib.h',
    kurz: md`Reserviert einen Block auf dem Heap und liefert seine Adresse, bei Misserfolg \`NULL\`. Der Inhalt ist nicht initialisiert. Freigeben mit \`free\`.`,
    syntax: c`void *malloc(size_t groesse);`,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int n = 5;
            int *w = malloc((size_t)n * sizeof *w);
            if (w == NULL) {
                return 1;
            }
            for (int i = 0; i < n; i++) {
                w[i] = i * i;
            }
            printf("%d\n", w[4]);
            free(w);
            return 0;
        }
      `,
      ausgabe: out`
        16
      `,
    },
    fehler: [md`\`sizeof\` vergessen: \`malloc(n)\` sind n Byte.`, md`Ergebnis nicht auf \`NULL\` geprüft.`, md`\`free\` vergessen (Speicherleck).`],
    lektionen: ['k10-l01', 'k10-l03'],
    stichwoerter: ['Speicher reservieren', 'Heap', 'dynamisch', 'allozieren'],
  },
  {
    id: 'calloc',
    name: 'calloc',
    kategorie: 'funktion',
    header: 'stdlib.h',
    kurz: md`Reserviert Platz für \`anzahl\` Elemente der Grösse \`groesse\` und füllt ihn mit Nullen. Bei Misserfolg \`NULL\`.`,
    syntax: c`void *calloc(size_t anzahl, size_t groesse);`,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int *zaehler = calloc(3, sizeof *zaehler);
            if (zaehler == NULL) {
                return 1;
            }
            zaehler[1]++;
            printf("%d %d %d\n", zaehler[0], zaehler[1], zaehler[2]);
            free(zaehler);
            return 0;
        }
      `,
      ausgabe: out`
        0 1 0
      `,
    },
    fehler: [md`Argumente vertauscht: zuerst Anzahl, dann Grösse.`],
    lektionen: ['k10-l02', 'k10-l05'],
    stichwoerter: ['Nullen', 'Speicher reservieren', 'Zähler'],
  },
  {
    id: 'realloc',
    name: 'realloc',
    kategorie: 'funktion',
    header: 'stdlib.h',
    kurz: md`Ändert die Grösse eines Blocks und behält den Inhalt; die Adresse kann sich ändern. Bei Misserfolg \`NULL\`, der alte Block bleibt dann gültig. \`realloc(NULL, n)\` wirkt wie \`malloc(n)\`.`,
    syntax: c`void *realloc(void *zeiger, size_t neue_groesse);`,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int *w = malloc(2 * sizeof *w);
            if (w == NULL) {
                return 1;
            }
            w[0] = 1;
            w[1] = 2;
            int *neu = realloc(w, 3 * sizeof *w);
            if (neu == NULL) {
                free(w);
                return 1;
            }
            w = neu;
            w[2] = 3;
            printf("%d %d %d\n", w[0], w[1], w[2]);
            free(w);
            return 0;
        }
      `,
      ausgabe: out`
        1 2 3
      `,
    },
    fehler: [md`\`p = realloc(p, …)\`: Bei \`NULL\` ist der alte Block verloren.`, md`Alte Zeiger in den Block nach \`realloc\` weiterverwenden.`],
    lektionen: ['k10-l02', 'k10-l05'],
    stichwoerter: ['vergrössern', 'verkleinern', 'wachsendes Array'],
  },
  {
    id: 'free',
    name: 'free',
    kategorie: 'funktion',
    header: 'stdlib.h',
    kurz: md`Gibt einen Block aus \`malloc\`, \`calloc\` oder \`realloc\` zurück. \`free(NULL)\` ist erlaubt. Danach darf der Block nicht mehr verwendet werden.`,
    syntax: c`
      void free(void *zeiger);
      free(p);
      p = NULL;
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            char *puffer = malloc(16);
            if (puffer == NULL) {
                return 1;
            }
            snprintf(puffer, 16, "ok");
            printf("%s\n", puffer);
            free(puffer);
            puffer = NULL;
            free(puffer);
            return 0;
        }
      `,
      ausgabe: out`
        ok
      `,
    },
    fehler: [md`Doppeltes \`free\`.`, md`Zugriff nach \`free\`.`, md`\`free\` auf Adressen, die nicht von \`malloc\` stammen.`],
    lektionen: ['k10-l01', 'k10-l04'],
    stichwoerter: ['freigeben', 'Speicher zurückgeben', 'Leck'],
  },
  {
    id: 'zeiger-auf-zeiger',
    name: 'Zeiger auf Zeiger (typ **)',
    kategorie: 'konstrukt',
    kurz: md`Speichert die Adresse eines Zeigers. Gebraucht für Arrays von Zeigern (\`char **argv\`), dynamische Tabellen und Funktionen, die einen Zeiger des Aufrufers ändern.`,
    syntax: c`
      int **pp = &p;
      **pp = 5;
      void setzen(int **ziel);
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        void auf_zweites(int **p, int *werte) {
            *p = &werte[1];
        }

        int main(void) {
            int werte[3] = {5, 6, 7};
            int *p = werte;
            auf_zweites(&p, werte);
            printf("%d\n", *p);
            return 0;
        }
      `,
      ausgabe: out`
        6
      `,
    },
    fehler: [md`\`*pp[i]\` statt \`(*pp)[i]\`.`, md`Dynamische Tabellen in falscher Reihenfolge freigeben.`],
    lektionen: ['k10-l05'],
    stichwoerter: ['Doppelzeiger', 'int **', 'argv', 'Matrix'],
  },
];
