import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'zeiger',
    name: 'Zeiger (typ *)',
    kategorie: 'konstrukt',
    kurz: md`Eine Variable, die eine Adresse speichert. Der Typ sagt, was an der Adresse liegt. Lesen und schreiben über \`*p\`.`,
    syntax: c`
      int *p = &x;
      *p = 5;
      const int *nur_lesen = &x;
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int druck = 3;
            int *p = &druck;
            *p = *p * 2;
            printf("%d\n", druck);
            return 0;
        }
      `,
      ausgabe: out`
        6
      `,
    },
    fehler: [md`\`int *p, q;\`: nur \`p\` ist ein Zeiger.`, md`Uninitialisierte Zeiger verwenden.`, md`Adresse einer lokalen Variable zurückgeben.`],
    lektionen: ['k09-l02', 'k09-l03', 'k09-l04', 'k09-l06'],
    stichwoerter: ['Pointer', 'Adresse', 'Zeigervariable'],
  },
  {
    id: 'adressoperator',
    name: '& (Adressoperator)',
    kategorie: 'operator',
    kurz: md`Liefert die Adresse einer Variable. Nötig bei \`scanf\` und überall, wo eine Funktion eine Variable des Aufrufers ändern soll.`,
    syntax: c`&variable`,
    beispiel: {
      code: c`
        #include <stdio.h>

        void verdoppeln(int *x) {
            *x *= 2;
        }

        int main(void) {
            int n = 21;
            verdoppeln(&n);
            printf("%d\n", n);
            return 0;
        }
      `,
      ausgabe: out`
        42
      `,
    },
    fehler: [md`\`&\` bei \`scanf\` vergessen.`, md`Nicht verwechseln mit dem bitweisen UND \`a & b\` (zwei Operanden).`],
    lektionen: ['k09-l01', 'k09-l02'],
    stichwoerter: ['Adresse', 'Referenz', 'kaufmännisches Und'],
  },
  {
    id: 'dereferenzierung',
    name: '* (Inhaltsoperator)',
    kategorie: 'operator',
    kurz: md`Greift auf den Wert zu, auf den ein Zeiger zeigt. In einer Deklaration bedeutet \`*\` dagegen «ist ein Zeiger».`,
    syntax: c`
      *zeiger           // lesen
      *zeiger = wert;   // schreiben
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            double temperatur = 19.5;
            double *p = &temperatur;
            *p += 1.0;
            printf("%.1f %.1f\n", *p, temperatur);
            return 0;
        }
      `,
      ausgabe: out`
        20.5 20.5
      `,
    },
    fehler: [md`Über \`NULL\` oder einen uninitialisierten Zeiger lesen.`, md`\`*p++\` erhöht den Zeiger, \`(*p)++\` den Wert.`],
    lektionen: ['k09-l02'],
    stichwoerter: ['Dereferenzierung', 'Stern', 'Wert an Adresse'],
  },
  {
    id: 'null',
    name: 'NULL',
    kategorie: 'makro',
    header: 'stddef.h',
    kurz: md`Nullzeiger: zeigt auf nichts. Funktionen wie \`fopen\`, \`malloc\` oder \`strchr\` melden damit einen Misserfolg. Auch über \`<stdio.h>\` und \`<stdlib.h>\` verfügbar.`,
    syntax: c`
      int *p = NULL;
      if (p != NULL) { … }
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <string.h>

        int main(void) {
            const char *treffer = strchr("Ventil", 'x');
            if (treffer == NULL) {
                printf("nicht gefunden\n");
            }
            return 0;
        }
      `,
      ausgabe: out`
        nicht gefunden
      `,
    },
    fehler: [md`Zugriff über \`NULL\` führt zum Absturz.`, md`\`NULL\` ist ein Zeiger, kein Endzeichen \`'\0'\`.`],
    lektionen: ['k09-l06'],
    stichwoerter: ['Nullzeiger', 'nullptr', 'leerer Zeiger'],
  },
  {
    id: 'zeigerarithmetik',
    name: 'Zeigerarithmetik',
    kategorie: 'operator',
    kurz: md`\`p + i\`, \`p++\` und \`p - q\` rechnen in Elementen des Zeigertyps, nicht in Bytes. \`a[i]\` ist definiert als \`*(a + i)\`.`,
    syntax: c`
      *(p + i)      // gleich wie p[i]
      p++;          // ein Element weiter
      ende - anfang // Anzahl Elemente, Typ ptrdiff_t (%td)
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int w[4] = {3, 6, 9, 12};
            int s = 0;
            for (const int *p = w; p < w + 4; p++) {
                s += *p;
            }
            printf("%d\n", s);
            return 0;
        }
      `,
      ausgabe: out`
        30
      `,
    },
    fehler: [md`Über das Arrayende hinaus lesen.`, md`Zeiger in verschiedene Arrays subtrahieren oder vergleichen.`],
    lektionen: ['k09-l04'],
    stichwoerter: ['p++', 'Zeiger addieren', 'ptrdiff_t', 'Zeigerdifferenz'],
  },
  {
    id: 'funktionszeiger',
    name: 'Funktionszeiger',
    kategorie: 'konstrukt',
    kurz: md`Speichert die Adresse einer Funktion. Damit kann man Funktionen als Parameter übergeben (Callbacks) oder Tabellen von Funktionen bauen.`,
    syntax: c`
      int (*f)(int, int) = addiere;
      int r = f(2, 3);
      typedef void (*Handler)(int);
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int doppelt(int x) { return 2 * x; }
        int quadrat(int x) { return x * x; }

        int main(void) {
            int (*f)(int) = doppelt;
            printf("%d ", f(5));
            f = quadrat;
            printf("%d\n", f(5));
            return 0;
        }
      `,
      ausgabe: out`
        10 25
      `,
    },
    fehler: [md`Klammern vergessen: \`int *f(int)\` ist eine Funktion, die einen Zeiger liefert.`, md`Funktion beim Übergeben aufrufen statt nur den Namen zu nennen.`],
    lektionen: ['k09-l05'],
    stichwoerter: ['Callback', 'Rückruf', 'Funktionspointer', 'Sprungtabelle'],
  },
  {
    id: 'qsort',
    name: 'qsort',
    kategorie: 'funktion',
    header: 'stdlib.h',
    kurz: md`Sortiert ein beliebiges Array. Braucht Anzahl, Elementgrösse und eine Vergleichsfunktion, die negativ, 0 oder positiv liefert.`,
    syntax: c`void qsort(void *array, size_t anzahl, size_t groesse, int (*vergleich)(const void *, const void *));`,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stdlib.h>

        int aufsteigend(const void *a, const void *b) {
            double x = *(const double *)a;
            double y = *(const double *)b;
            return (x > y) - (x < y);
        }

        int main(void) {
            double w[4] = {2.5, -1.0, 7.25, 0.5};
            qsort(w, 4, sizeof w[0], aufsteigend);
            printf("%.2f %.2f %.2f %.2f\n", w[0], w[1], w[2], w[3]);
            return 0;
        }
      `,
      ausgabe: out`
        -1.00 0.50 2.50 7.25
      `,
    },
    fehler: [md`\`return x - y;\` kann überlaufen und funktioniert bei \`double\` nicht.`, md`Falsche Elementgrösse angegeben.`],
    lektionen: ['k09-l05'],
    stichwoerter: ['sortieren', 'Vergleichsfunktion', 'Quicksort'],
  },
  {
    id: 'fmt-p',
    name: '%p',
    kategorie: 'format',
    kurz: md`Gibt eine Adresse aus, meist hexadezimal. Das Argument muss den Typ \`void *\` haben.`,
    syntax: c`printf("%p\n", (void *)&x);`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int x = 0;
            int *p = &x;
            printf("%d\n", (void *)p == (void *)&x);
            printf("%p\n", (void *)p);
            return 0;
        }
      `,
      ausgabe: out`
        1
        0xffeec
      `,
      ausgabeVariabel: true,
    },
    fehler: [md`Adressen mit \`%d\` oder \`%x\` ausgeben.`],
    lektionen: ['k09-l01'],
    stichwoerter: ['Adresse ausgeben', 'Pointer ausgeben'],
  },
];
