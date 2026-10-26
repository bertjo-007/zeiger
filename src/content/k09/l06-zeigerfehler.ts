import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k09-l06',
  titel: 'Häufige Zeigerfehler',
  dauer: 25,
  stichwoerter: ['NULL', 'Nullzeiger', 'wilder Zeiger', 'uninitialisiert', 'hängender Zeiger', 'dangling pointer', 'Segmentation fault', 'Absturz'],
  lernziele: [
    'Zeiger mit `NULL` vorbelegen und vor dem Zugriff prüfen',
    'uninitialisierte und hängende Zeiger erkennen',
    'Funktionen schreiben, die «nichts gefunden» mit `NULL` melden',
  ],
  erklaerung: md`
    Zeiger sind mächtig, aber ein falscher Zeiger schreibt an eine beliebige Stelle im Speicher. Die Folgen reichen von falschen Werten bis zum Absturz, oft weit weg von der eigentlichen Ursache. Fast alle Zeigerfehler gehören zu vier Mustern.

    **1. Nullzeiger.** \`NULL\` (aus \`<stddef.h>\`, auch über \`<stdio.h>\` und \`<stdlib.h>\` verfügbar) bedeutet «zeigt auf nichts». Funktionen melden damit oft «nicht gefunden» oder «fehlgeschlagen». Liest man über \`NULL\`, stürzt das Programm ab. Darum vor jedem Zugriff prüfen: \`if (p != NULL)\`.

    **2. Uninitialisierte Zeiger.** \`int *p;\` enthält irgendeine Adresse. \`*p = 5;\` schreibt dann irgendwohin. Darum jeden Zeiger sofort belegen: mit einer Adresse oder mit \`NULL\`.

    **3. Hängende Zeiger** (*dangling pointer*). Ein Zeiger auf eine Variable, die nicht mehr existiert. Klassiker: eine Funktion gibt die Adresse einer lokalen Variable zurück. Nach dem \`return\` ist diese Variable weg, der Zeiger zeigt ins Leere. Clang warnt: «address of stack memory associated with local variable returned».

    **4. Grenzen überschreiten.** Ein Zeiger, der über das Array hinausläuft, ist genauso falsch wie ein zu grosser Index.

    > [!tipp] Wie die App hilft
    > Liest dein Programm über einen Nullzeiger, meldet die App «Zugriff über einen Nullzeiger» mit der Zeile. Auf dem PC heisst dieselbe Situation meist «Segmentation fault» oder «Zugriffsverletzung», ohne Zeilenangabe.

    > [!praxis] Auf dem Mikrocontroller
    > Dort gibt es oft keinen Speicherschutz. Ein Schreibzugriff über einen falschen Zeiger stürzt nicht ab, sondern verändert still andere Variablen oder sogar Hardware-Register. Sorgfalt mit Zeigern ist dort noch wichtiger.
  `,
  syntax: [
    {
      code: c`
        int *p = NULL;           // zeigt bewusst auf nichts
        if (p != NULL) {         // vor dem Zugriff prüfen
            *p = 5;
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stddef.h>

      int *finde(int *werte, int n, int gesucht) {
          for (int i = 0; i < n; i++) {
              if (werte[i] == gesucht) {
                  return &werte[i];
              }
          }
          return NULL;
      }

      int main(void) {
          int fehlercodes[4] = {12, 40, 7, 40};

          int *treffer = finde(fehlercodes, 4, 7);
          if (treffer != NULL) {
              *treffer = 0;
              printf("Code 7 quittiert\n");
          }

          int *keiner = finde(fehlercodes, 4, 99);
          if (keiner == NULL) {
              printf("Code 99 nicht gefunden\n");
          }

          for (int i = 0; i < 4; i++) {
              printf("%d ", fehlercodes[i]);
          }
          printf("\n");
          return 0;
      }
    `,
    ausgabe: out`
      Code 7 quittiert
      Code 99 nicht gefunden
      12 40 0 40
    `,
  },
  zeilen: [
    { zeilen: '4', text: md`Die Funktion liefert einen Zeiger auf das gefundene Element.` },
    { zeilen: '7', text: md`Die Adresse eines Elements aus dem Array des Aufrufers. Das Array lebt weiter, der Zeiger bleibt gültig.` },
    { zeilen: '10', text: md`Nichts gefunden: \`NULL\` statt einer erfundenen Adresse.` },
    { zeilen: '17-20', text: md`Zugriff nur, wenn der Zeiger nicht \`NULL\` ist. Über den Zeiger wird das Element im Array auf 0 gesetzt.` },
    { zeilen: '23', text: md`Der zweite Aufruf findet nichts, der Fall wird sauber behandelt.` },
  ],
  ergebnis: md`
    Der Fehlercode 7 wurde über den zurückgegebenen Zeiger direkt im Array auf 0 gesetzt. Für 99 kam \`NULL\` zurück, und das Programm hat diesen Fall geprüft, statt abzustürzen.
  `,
  fehler: [
    {
      titel: 'Uninitialisierter Zeiger',
      text: md`\`p\` enthält eine zufällige Adresse. Clang warnt («variable 'p' is uninitialized when used here»).`,
      falsch: c`
        int *p;
        *p = 5;
      `,
      richtig: c`
        int wert = 0;
        int *p = &wert;
        *p = 5;
      `,
    },
    {
      titel: 'Adresse einer lokalen Variable zurückgeben',
      text: md`Nach dem \`return\` existiert \`summe\` nicht mehr. Gib den Wert zurück, nicht seine Adresse, oder lass den Aufrufer den Speicher stellen.`,
      falsch: c`
        int *summieren(int a, int b) {
            int summe = a + b;
            return &summe;
        }
      `,
      richtig: c`
        int summieren(int a, int b) {
            return a + b;
        }
      `,
    },
    {
      titel: 'NULL nicht prüfen',
      text: md`Funktionen wie \`strchr\`, \`fopen\` oder \`malloc\` liefern bei Misserfolg \`NULL\`. Wer das Ergebnis ungeprüft verwendet, stürzt im Fehlerfall ab.`,
      falsch: c`printf("%s\n", strchr(zeile, ':') + 1);`,
      richtig: c`
        const char *doppelpunkt = strchr(zeile, ':');
        if (doppelpunkt != NULL) {
            printf("%s\n", doppelpunkt + 1);
        }
      `,
    },
  ],
  uebungen: [
    {
      id: 'k09-l06-u1',
      typ: 'fehlersuche',
      titel: 'Absturz bei unbekanntem Code',
      stufe: 1,
      themen: ['zeiger', 'fehler'],
      aufgabe: md`
        Das Programm liest einen Fehlercode und gibt seine Position im Array aus. Bei einem unbekannten Code stürzt es ab. Repariere es so, dass dann \`unbekannt\` ausgegeben wird.
      `,
      start: c`
        #include <stdio.h>
        #include <stddef.h>

        int *finde(int *werte, int n, int gesucht) {
            for (int i = 0; i < n; i++) {
                if (werte[i] == gesucht) {
                    return &werte[i];
                }
            }
            return NULL;
        }

        int main(void) {
            int codes[5] = {12, 40, 7, 33, 18};
            int gesucht = 0;
            if (scanf("%d", &gesucht) != 1) {
                return 1;
            }
            int *p = finde(codes, 5, gesucht);
            printf("Position %td: %d\n", p - codes, *p);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stddef.h>

        int *finde(int *werte, int n, int gesucht) {
            for (int i = 0; i < n; i++) {
                if (werte[i] == gesucht) {
                    return &werte[i];
                }
            }
            return NULL;
        }

        int main(void) {
            int codes[5] = {12, 40, 7, 33, 18};
            int gesucht = 0;
            if (scanf("%d", &gesucht) != 1) {
                return 1;
            }
            int *p = finde(codes, 5, gesucht);
            if (p == NULL) {
                printf("unbekannt\n");
            } else {
                printf("Position %td: %d\n", p - codes, *p);
            }
            return 0;
        }
      `,
      stdin: '99\n',
      tests: [
        { name: 'Bekannter Code', stdin: '33\n', erwartet: { stdout: 'Position 3: 33\n' } },
        { name: 'Unbekannter Code', stdin: '99\n', erwartet: { stdout: 'unbekannt\n' }, tipp: md`\`finde\` liefert dann \`NULL\`. Prüfe das vor dem \`printf\`.` },
      ],
      hinweise: [md`Was liefert \`finde\`, wenn es nichts findet?`, md`\`if (p == NULL) { … } else { … }\` um das \`printf\`.`],
    },
    {
      id: 'k09-l06-u2',
      typ: 'auswahl',
      titel: 'Was ist hier falsch?',
      stufe: 1,
      themen: ['zeiger', 'fehler'],
      frage: 'Was ist das Problem?',
      code: c`
        int *p;
        *p = 42;
      `,
      optionen: [
        { text: '`p` ist nicht initialisiert und zeigt auf eine zufällige Stelle.', richtig: true },
        { text: 'Man darf über einen Zeiger keine Zahl schreiben.' },
        { text: 'Es fehlt ein `&` vor 42.' },
      ],
    },
    {
      id: 'k09-l06-u3',
      typ: 'programm',
      titel: 'Zeiger auf das Maximum',
      stufe: 2,
      themen: ['zeiger', 'arrays'],
      aufgabe: md`
        Schreibe \`int *groesstes(int *a, int n)\`. Sie liefert einen Zeiger auf das grösste Element (bei Gleichstand das erste) oder \`NULL\`, wenn \`n\` kleiner als 1 ist.
      `,
      start: c`
        #include <stdio.h>
        #include <stddef.h>

        int main(void) {
            int w[4] = {5, 9, 2, 9};
            int *m = groesstes(w, 4);
            if (m != NULL) {
                *m = 0;
            }
            printf("%d %d %d %d\n", w[0], w[1], w[2], w[3]);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stddef.h>

        int *groesstes(int *a, int n) {
            if (n < 1) {
                return NULL;
            }
            int *max = a;
            for (int i = 1; i < n; i++) {
                if (a[i] > *max) {
                    max = &a[i];
                }
            }
            return max;
        }

        int main(void) {
            int w[4] = {5, 9, 2, 9};
            int *m = groesstes(w, 4);
            if (m != NULL) {
                *m = 0;
            }
            printf("%d %d %d %d\n", w[0], w[1], w[2], w[3]);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        #include <stddef.h>
        int *groesstes(int *a, int n);
        int main(void) {
            int w[4] = {5, 9, 2, 9};
            int *m = groesstes(w, 4);
            printf("%td ", m - w);
            printf("%d\n", groesstes(w, 0) == NULL);
            return 0;
        }
      `,
      tests: [{ name: 'Position und leeres Array', erwartet: { stdout: '1 1\n' }, tipp: md`Bei Gleichstand das erste Maximum: nur bei \`>\` weiterspringen, nicht bei \`>=\`.` }],
      hinweise: [md`Starte mit \`int *max = a;\` und vergleiche \`a[i] > *max\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k09-l06-c1',
      typ: 'wahrfalsch',
      themen: ['zeiger', 'fehler'],
      aussage: 'Eine Funktion darf die Adresse einer ihrer lokalen Variablen zurückgeben, wenn der Aufrufer sie sofort verwendet.',
      richtig: false,
      erklaerung: 'Die Variable existiert nach dem `return` nicht mehr; der Zeiger hängt.',
    },
    {
      id: 'k09-l06-c2',
      typ: 'auswahl',
      themen: ['zeiger', 'fehler'],
      frage: 'Womit belegt man einen Zeiger, der noch auf nichts zeigen soll?',
      optionen: [{ text: '`NULL`', richtig: true }, { text: '`0.0`' }, { text: '`\'\\0\'`' }],
    },
    {
      id: 'k09-l06-c3',
      typ: 'auswahl',
      themen: ['zeiger', 'fehler'],
      frage: 'Welche Prüfung gehört vor `*p = 1;`, wenn `p` von einer Suchfunktion kommt?',
      optionen: [{ text: '`if (p != NULL)`', richtig: true }, { text: '`if (*p != NULL)`' }, { text: '`if (p > 0)`' }],
    },
  ],
  zusammenfassung: [
    'Zeiger sofort belegen: mit einer Adresse oder mit `NULL`.',
    'Vor jedem Zugriff über einen möglicherweise leeren Zeiger auf `NULL` prüfen.',
    'Nie die Adresse einer lokalen Variable zurückgeben.',
    'Funktionen melden «nicht gefunden» oft mit `NULL`.',
  ],
  referenz: ['null', 'zeiger'],
};
