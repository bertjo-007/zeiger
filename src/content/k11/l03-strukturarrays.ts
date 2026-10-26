import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k11-l03',
  titel: 'Arrays aus Strukturen',
  dauer: 25,
  stichwoerter: ['Array von Strukturen', 'Tabelle', 'Datensätze', 'Lager', 'suchen', 'sortieren nach Komponente', 'qsort'],
  lernziele: [
    'Tabellen als Arrays aus Strukturen anlegen und durchlaufen',
    'Datensätze nach einer Komponente suchen und auswerten',
    'Arrays aus Strukturen mit `qsort` nach einer Komponente sortieren',
  ],
  erklaerung: md`
    Ein Array aus Strukturen ist eine Tabelle: Jedes Element ist eine Zeile, jede Komponente eine Spalte.

    ~~~c
    Artikel lager[] = {
        {"Kugellager", 40, 3.20},
        {"Zahnriemen", 6, 18.50},
    };
    ~~~

    Der Zugriff kombiniert Index und Punkt: \`lager[1].bestand\` ist der Bestand der zweiten Zeile, \`lager[1].name[0]\` der erste Buchstabe ihres Namens.

    Alles aus den Kapiteln über Arrays gilt weiter: Die Anzahl berechnet \`sizeof lager / sizeof lager[0]\`, eine Funktion bekommt die Adresse und die Länge, und Grenzen prüft niemand für dich.

    ### Typische Aufgaben

    - **Summieren und zählen:** durchlaufen und eine Komponente aufaddieren.
    - **Suchen:** in einer Schleife eine Komponente vergleichen, bei Texten mit \`strcmp\`. Ergebnis ist der Index oder −1.
    - **Sortieren:** \`qsort\` mit einer Vergleichsfunktion, die zwei Elemente nach der gewünschten Komponente vergleicht. Ein ganzes Element wird dabei verschoben, alle Komponenten bleiben zusammen.

    > [!praxis] Auf dem Mikrocontroller
    > Parametertabellen sind oft konstante Arrays aus Strukturen, etwa \`const Kennlinie punkte[] = {{0, 0}, {500, 1200}, …};\`. Mit \`const\` landen sie im Flash statt im knappen RAM.
  `,
  syntax: [
    {
      code: c`
        Typ tabelle[] = {{…}, {…}};
        size_t n = sizeof tabelle / sizeof tabelle[0];
        tabelle[i].komponente
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <string.h>

      typedef struct {
          char name[16];
          int bestand;
          double preis;
      } Artikel;

      int main(void) {
          Artikel lager[] = {
              {"Kugellager", 40, 3.20},
              {"Zahnriemen", 6, 18.50},
              {"Endschalter", 12, 7.90},
              {"Kupplung", 3, 24.00},
          };
          int anzahl = (int)(sizeof lager / sizeof lager[0]);

          double wert = 0.0;
          for (int i = 0; i < anzahl; i++) {
              wert += lager[i].bestand * lager[i].preis;
          }
          printf("Lagerwert: %.2f Fr.\n", wert);

          printf("Nachbestellen:\n");
          for (int i = 0; i < anzahl; i++) {
              if (lager[i].bestand < 10) {
                  printf("  %-12s %3d Stück\n", lager[i].name, lager[i].bestand);
              }
          }

          int idx = -1;
          for (int i = 0; i < anzahl; i++) {
              if (strcmp(lager[i].name, "Endschalter") == 0) {
                  idx = i;
              }
          }
          if (idx >= 0) {
              lager[idx].bestand -= 2;
              printf("%s: noch %d\n", lager[idx].name, lager[idx].bestand);
          }
          return 0;
      }
    `,
    ausgabe: 'Lagerwert: 405.80 Fr.\nNachbestellen:\n  Zahnriemen     6 Stück\n  Kupplung       3 Stück\nEndschalter: noch 10\n',
  },
  zeilen: [
    { zeilen: '11-16', text: md`Vier Datensätze, jeder in eigenen geschweiften Klammern.` },
    { zeilen: '17', text: md`Die Anzahl ergibt sich aus den Grössen; ein neuer Artikel braucht keine Anpassung.` },
    { zeilen: '21', text: md`Index und Punkt kombiniert: Bestand mal Preis der Zeile \`i\`.` },
    { zeilen: '27-29', text: md`Nur Zeilen mit kleinem Bestand ausgeben, als Tabelle mit Feldbreiten.` },
    { zeilen: '34', text: md`Suche nach dem Namen mit \`strcmp\`.` },
    { zeilen: '39', text: md`Über den gefundenen Index wird der Datensatz im Array geändert.` },
  ],
  ergebnis: md`
    Der Lagerwert ist die Summe aus Bestand mal Preis aller vier Artikel. Zwei Artikel liegen unter 10 Stück. Der Endschalter wird gefunden und sein Bestand im Array von 12 auf 10 gesenkt.
  `,
  fehler: [
    {
      titel: 'Punkt und Index vertauscht',
      text: md`\`lager.bestand[i]\` versucht, \`bestand\` als Array zu verwenden. Richtig ist zuerst der Index, dann die Komponente.`,
      falsch: c`lager.bestand[i]`,
      richtig: c`lager[i].bestand`,
    },
    {
      titel: 'Fehlende innere Klammern',
      text: md`Ohne die inneren \`{ }\` verteilt der Compiler die Werte der Reihe nach auf die Komponenten. Das funktioniert manchmal zufällig, Clang warnt aber («suggest braces around initialization of subobject»).`,
    },
    {
      titel: 'Vergleichsfunktion vergleicht Zeiger',
      text: md`Bei \`qsort\` zeigen die Parameter auf **Elemente**. Erst in \`const Artikel *\` umwandeln, dann die Komponente lesen.`,
    },
  ],
  uebungen: [
    {
      id: 'k11-l03-u1',
      typ: 'vorhersage',
      titel: 'Durch die Tabelle',
      stufe: 1,
      themen: ['strukturen', 'arrays'],
      code: c`
        #include <stdio.h>

        typedef struct {
            int id;
            int wert;
        } Messung;

        int main(void) {
            Messung m[3] = {{1, 20}, {2, 35}, {3, 15}};
            int summe = 0;
            for (int i = 0; i < 3; i++) {
                if (m[i].wert > 18) {
                    summe += m[i].id;
                }
            }
            m[2] = m[0];
            printf("%d %d %d\n", summe, m[2].id, m[2].wert);
            return 0;
        }
      `,
      ausgabe: out`
        3 1 20
      `,
    },
    {
      id: 'k11-l03-u2',
      typ: 'programm',
      titel: 'Teuerster Artikel',
      stufe: 2,
      themen: ['strukturen', 'arrays', 'funktionen'],
      aufgabe: md`
        Schreibe \`int teuerster(const Artikel a[], int n)\`. Sie liefert den Index des Artikels mit dem höchsten Preis, bei Gleichstand den ersten, und −1, wenn \`n\` kleiner als 1 ist.
      `,
      start: c`
        #include <stdio.h>

        typedef struct {
            char name[16];
            int bestand;
            double preis;
        } Artikel;

        int main(void) {
            Artikel l[3] = {{"Lager", 40, 3.2}, {"Riemen", 6, 18.5}, {"Kupplung", 3, 24.0}};
            int i = teuerster(l, 3);
            printf("%s\n", l[i].name);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        typedef struct {
            char name[16];
            int bestand;
            double preis;
        } Artikel;

        int teuerster(const Artikel a[], int n) {
            if (n < 1) {
                return -1;
            }
            int beste = 0;
            for (int i = 1; i < n; i++) {
                if (a[i].preis > a[beste].preis) {
                    beste = i;
                }
            }
            return beste;
        }

        int main(void) {
            Artikel l[3] = {{"Lager", 40, 3.2}, {"Riemen", 6, 18.5}, {"Kupplung", 3, 24.0}};
            int i = teuerster(l, 3);
            printf("%s\n", l[i].name);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        typedef struct {
            char name[16];
            int bestand;
            double preis;
        } Artikel;
        int teuerster(const Artikel a[], int n);
        int main(void) {
            Artikel l[4] = {{"Lager", 40, 3.2}, {"Riemen", 6, 18.5}, {"Kupplung", 3, 24.0}, {"Sensor", 9, 24.0}};
            printf("%d %d %d\n", teuerster(l, 4), teuerster(l, 2), teuerster(l, 0));
            return 0;
        }
      `,
      tests: [{ name: 'Gleichstand, Teilbereich, leer', erwartet: { stdout: '2 1 -1\n' }, tipp: md`Bei Gleichstand bleibt der erste: nur bei \`>\` wechseln.` }],
      hinweise: [md`Merke dir den Index des bisher teuersten Artikels und vergleiche \`a[i].preis > a[beste].preis\`.`],
    },
    {
      id: 'k11-l03-u3',
      typ: 'programm',
      titel: 'Nach Bestand sortieren',
      stufe: 3,
      themen: ['strukturen', 'arrays', 'zeiger'],
      aufgabe: md`
        Schreibe die Vergleichsfunktion \`int nach_bestand(const void *a, const void *b)\` für \`qsort\`. Sortiert wird aufsteigend nach \`bestand\`, bei gleichem Bestand alphabetisch nach \`name\`.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>
        #include <string.h>

        typedef struct {
            char name[16];
            int bestand;
            double preis;
        } Artikel;

        int main(void) {
            Artikel l[3] = {{"Lager", 40, 3.2}, {"Riemen", 6, 18.5}, {"Kupplung", 3, 24.0}};
            qsort(l, 3, sizeof l[0], nach_bestand);
            printf("%s %s %s\n", l[0].name, l[1].name, l[2].name);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdlib.h>
        #include <string.h>

        typedef struct {
            char name[16];
            int bestand;
            double preis;
        } Artikel;

        int nach_bestand(const void *a, const void *b) {
            const Artikel *x = a;
            const Artikel *y = b;
            if (x->bestand != y->bestand) {
                return (x->bestand > y->bestand) - (x->bestand < y->bestand);
            }
            return strcmp(x->name, y->name);
        }

        int main(void) {
            Artikel l[3] = {{"Lager", 40, 3.2}, {"Riemen", 6, 18.5}, {"Kupplung", 3, 24.0}};
            qsort(l, 3, sizeof l[0], nach_bestand);
            printf("%s %s %s\n", l[0].name, l[1].name, l[2].name);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        #include <stdlib.h>
        typedef struct {
            char name[16];
            int bestand;
            double preis;
        } Artikel;
        int nach_bestand(const void *a, const void *b);
        int main(void) {
            Artikel l[5] = {{"Lager", 40, 3.2}, {"Riemen", 6, 18.5}, {"Kupplung", 3, 24.0}, {"Sensor", 9, 7.0}, {"Achse", 6, 1.0}};
            qsort(l, 5, sizeof l[0], nach_bestand);
            for (int i = 0; i < 5; i++) {
                printf("%s ", l[i].name);
            }
            printf("\n");
            return 0;
        }
      `,
      tests: [{ name: 'Mit gleichem Bestand', erwartet: { stdout: 'Kupplung Achse Riemen Sensor Lager\n' }, tipp: md`«Achse» und «Riemen» haben beide 6 Stück; dann entscheidet \`strcmp\`.` }],
      hinweise: [
        md`\`const Artikel *x = a;\` wandelt den \`void\`-Zeiger um. Zugriff dann mit \`x->bestand\` (Lektion 4) oder \`(*x).bestand\`.`,
        md`Erst die Bestände vergleichen; nur wenn sie gleich sind, \`strcmp\` auf die Namen.`,
      ],
    },
  ],
  wissenscheck: [
    {
      id: 'k11-l03-c1',
      typ: 'auswahl',
      themen: ['strukturen', 'arrays'],
      frage: 'Wie liest man den Preis des dritten Artikels in `Artikel lager[10]`?',
      optionen: [{ text: '`lager[2].preis`', richtig: true }, { text: '`lager.preis[2]`' }, { text: '`lager[3].preis`' }],
    },
    {
      id: 'k11-l03-c2',
      typ: 'wahrfalsch',
      themen: ['strukturen', 'arrays'],
      aussage: '`qsort` verschiebt beim Sortieren ganze Strukturen, die Komponenten eines Datensatzes bleiben zusammen.',
      richtig: true,
    },
    {
      id: 'k11-l03-c3',
      typ: 'eingabe',
      themen: ['strukturen', 'strings'],
      frage: 'Welche Funktion vergleicht beim Suchen den Namen eines Datensatzes mit einem Text?',
      antworten: ['strcmp'],
    },
  ],
  zusammenfassung: [
    'Ein Array aus Strukturen ist eine Tabelle: Elemente sind Zeilen, Komponenten Spalten.',
    'Zugriff: `tabelle[i].komponente`.',
    'Suchen mit einer Schleife, bei Texten mit `strcmp`.',
    'Sortieren mit `qsort` und einer Vergleichsfunktion für die gewünschte Komponente.',
  ],
  referenz: ['struct', 'qsort', 'array'],
};
