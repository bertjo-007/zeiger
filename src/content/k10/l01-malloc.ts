import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k10-l01',
  titel: 'Stack und Heap, malloc und free',
  dauer: 30,
  stichwoerter: ['malloc', 'free', 'Heap', 'Stack', 'dynamischer Speicher', 'Speicher reservieren', 'stdlib.h', 'sizeof *p'],
  lernziele: [
    'den Unterschied zwischen automatischem Speicher (Stack) und dynamischem Speicher (Heap) erklären',
    'Speicher mit `malloc` reservieren und das Ergebnis auf `NULL` prüfen',
    'Speicher mit `free` zurückgeben',
  ],
  erklaerung: md`
    Bisher stand die Grösse jedes Arrays schon beim Schreiben fest: \`double werte[100];\`. Oft weiss man sie aber erst, wenn das Programm läuft, etwa weil der Benutzer die Anzahl Messwerte eingibt.

    ### Zwei Arten von Speicher

    | | Stack (automatisch) | Heap (dynamisch) |
    |---|---|---|
    | Anlegen | durch die Deklaration | mit \`malloc\` |
    | Grösse | beim Kompilieren bekannt | zur Laufzeit wählbar |
    | Lebensdauer | bis zum Ende des Blocks | bis zum \`free\` |
    | Aufräumen | automatisch | **selbst** mit \`free\` |

    Lokale Variablen liegen auf dem **Stack**. Er ist schnell, aber klein und räumt am Blockende von selbst auf. Der **Heap** ist ein grosser Speicherbereich, aus dem das Programm während der Laufzeit Blöcke anfordert und wieder zurückgibt.

    ### malloc und free

    \`malloc(anzahl_bytes)\` aus \`<stdlib.h>\` reserviert einen Block und liefert seine Adresse als \`void *\`. Diese Adresse speichert man in einem passenden Zeiger. Die Grösse rechnet man immer mit \`sizeof\` aus:

    ~~~c
    double *werte = malloc(n * sizeof *werte);
    ~~~

    \`sizeof *werte\` ist die Grösse eines Elements, hier 8 Byte. Ändert sich später der Typ, stimmt die Rechnung trotzdem.

    Ist kein Speicher mehr frei, liefert \`malloc\` **\`NULL\`**. Das muss man prüfen, bevor man den Block verwendet. Der Inhalt eines neuen Blocks ist **nicht** initialisiert, er enthält zufällige Werte.

    Mit \`free(werte)\` gibt man den Block zurück, sobald er nicht mehr gebraucht wird. Danach darf man ihn nicht mehr verwenden. Viele setzen den Zeiger deshalb gleich auf \`NULL\`.

    > [!info] Arrays variabler Länge
    > C99 erlaubt \`double werte[n];\` mit einem \`n\` zur Laufzeit (VLA). Seit C11 ist das optional, und bei grossen \`n\` läuft der Stack über, ohne dass man es prüfen kann. Für Daten unbekannter Grösse ist \`malloc\` die sichere Wahl.

    > [!praxis] Auf dem Mikrocontroller
    > Auf kleinen Controllern mit wenigen Kilobyte RAM verzichtet man oft ganz auf \`malloc\`: Der Heap kann zerstückeln, und ein \`NULL\` mitten im Betrieb ist schwer zu behandeln. Dort reserviert man alles fest beim Start.
  `,
  syntax: [
    {
      code: c`
        #include <stdlib.h>
        typ *p = malloc(anzahl * sizeof *p);
        if (p == NULL) { /* kein Speicher */ }
        free(p);
        p = NULL;
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int n = 0;
          printf("Anzahl Messwerte: ");
          if (scanf("%d", &n) != 1 || n <= 0) {
              return 1;
          }

          double *werte = malloc((size_t)n * sizeof *werte);
          if (werte == NULL) {
              printf("Kein Speicher\n");
              return 1;
          }

          double summe = 0.0;
          for (int i = 0; i < n; i++) {
              if (scanf("%lf", &werte[i]) != 1) {
                  free(werte);
                  return 1;
              }
              summe += werte[i];
          }
          double mittel = summe / n;

          printf("Mittelwert: %.2f\n", mittel);
          printf("Darüber:");
          for (int i = 0; i < n; i++) {
              if (werte[i] > mittel) {
                  printf(" %.1f", werte[i]);
              }
          }
          printf("\n");

          free(werte);
          werte = NULL;
          return 0;
      }
    `,
    stdin: '4\n20.5 21.0 19.5 22.0\n',
    ausgabe: out`
      Anzahl Messwerte: 4
      20.5 21.0 19.5 22.0
      Mittelwert: 20.75
      Darüber: 21.0 22.0
    `,
  },
  zeilen: [
    { zeilen: '2', text: md`\`malloc\` und \`free\` stehen in \`<stdlib.h>\`.` },
    { zeilen: '11', text: md`Platz für \`n\` Werte. \`(size_t)\` macht aus dem \`int\` die Grösse, die \`malloc\` erwartet.` },
    { zeilen: '12-15', text: md`Ohne freien Speicher kommt \`NULL\` zurück. Dann wird nichts geschrieben.` },
    { zeilen: '19-22', text: md`Auch bei einem Abbruch mitten im Einlesen wird der Block zurückgegeben.` },
    { zeilen: '23', text: md`Der Block wird wie ein normales Array verwendet: \`werte[i]\`.` },
    { zeilen: '36-37', text: md`Block zurückgeben und den Zeiger auf \`NULL\` setzen, damit er nicht versehentlich weiterverwendet wird.` },
  ],
  ergebnis: md`
    Das Programm kennt die Anzahl erst nach der ersten Eingabe und reserviert dann genau so viel Speicher. Der Mittelwert ist 20.75; nur zwei Werte liegen darüber. Am Ende ist der Block wieder freigegeben. Die App prüft das: Fehlt ein \`free\`, meldet sie nach dem Lauf ein Speicherleck.
  `,
  fehler: [
    {
      titel: 'sizeof vergessen',
      text: md`\`malloc(n)\` reserviert n **Byte**, nicht n Elemente. Bei \`double\` ist das ein Achtel des nötigen Platzes, und das Programm schreibt über das Ende hinaus.`,
      falsch: c`double *w = malloc(n);`,
      richtig: c`double *w = malloc(n * sizeof *w);`,
    },
    {
      titel: 'NULL nicht prüfen',
      text: md`Liefert \`malloc\` \`NULL\` und das Programm schreibt trotzdem, stürzt es ab. Die Prüfung gehört direkt hinter jeden Aufruf.`,
    },
    {
      titel: 'free vergessen',
      text: md`Ohne \`free\` bleibt der Block belegt, bis das Programm endet: ein **Speicherleck**. In einer Steuerung, die tagelang läuft, ist der Speicher irgendwann voll.`,
    },
  ],
  uebungen: [
    {
      id: 'k10-l01-u1',
      typ: 'auswahl',
      titel: 'Wenn kein Speicher frei ist',
      stufe: 1,
      themen: ['speicher'],
      frage: 'Was liefert `malloc`, wenn es keinen Speicher mehr reservieren kann?',
      optionen: [{ text: '`NULL`', richtig: true }, { text: 'Einen Block der Grösse 0' }, { text: 'Das Programm wird sofort beendet.' }],
    },
    {
      id: 'k10-l01-u2',
      typ: 'luecke',
      titel: 'Reservieren und freigeben',
      stufe: 1,
      themen: ['speicher'],
      frage: 'Ergänze die beiden Funktionsnamen.',
      code: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int *p = __1__(3 * sizeof *p);
            if (p == NULL) {
                return 1;
            }
            p[0] = 7;
            p[1] = 8;
            p[2] = 9;
            printf("%d\n", p[0] + p[1] + p[2]);
            __2__(p);
            return 0;
        }
      `,
      luecken: [['malloc'], ['free']],
      ausgabe: '24\n',
    },
    {
      id: 'k10-l01-u3',
      typ: 'programm',
      titel: 'Rückwärts ausgeben',
      stufe: 2,
      themen: ['speicher', 'arrays'],
      aufgabe: md`
        Lies zuerst die Anzahl \`n\` und dann \`n\` ganze Zahlen. Gib sie in umgekehrter Reihenfolge aus, durch Leerzeichen getrennt, in einer Zeile. Reserviere das Array mit \`malloc\` und gib es am Ende frei. Bei ungültiger Anzahl (kleiner als 1) gibt das Programm nichts aus.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int n = 0;
            if (scanf("%d", &n) != 1 || n < 1) {
                return 1;
            }

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

            int *werte = malloc((size_t)n * sizeof *werte);
            if (werte == NULL) {
                return 1;
            }
            for (int i = 0; i < n; i++) {
                if (scanf("%d", &werte[i]) != 1) {
                    free(werte);
                    return 1;
                }
            }
            for (int i = n - 1; i >= 0; i--) {
                printf("%d ", werte[i]);
            }
            printf("\n");
            free(werte);
            return 0;
        }
      `,
      stdin: '5\n1 2 3 4 5\n',
      tests: [
        { name: 'Fünf Werte', stdin: '5\n1 2 3 4 5\n', erwartet: { stdout: '5 4 3 2 1\n', sauber: true }, tipp: md`Vergiss das \`free\` am Ende nicht.` },
        { name: 'Ein Wert', stdin: '1\n42\n', erwartet: { stdout: '42\n', sauber: true } },
      ],
      regeln: [{ muss: '\\bmalloc\\s*\\(', meldung: 'Reserviere das Array mit `malloc`.' }, { muss: '\\bfree\\s*\\(', meldung: 'Gib den Speicher mit `free` zurück.' }],
      hinweise: [md`\`int *werte = malloc((size_t)n * sizeof *werte);\` und danach auf \`NULL\` prüfen.`, md`Rückwärts: \`for (int i = n - 1; i >= 0; i--)\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k10-l01-c1',
      typ: 'wahrfalsch',
      themen: ['speicher'],
      aussage: 'Speicher aus `malloc` wird am Ende der Funktion automatisch freigegeben.',
      richtig: false,
      erklaerung: 'Er bleibt belegt, bis `free` aufgerufen wird oder das Programm endet.',
    },
    {
      id: 'k10-l01-c2',
      typ: 'eingabe',
      themen: ['speicher'],
      frage: 'Wie viele Byte reserviert `malloc(10 * sizeof *p)` für `int *p` hier in der App?',
      antworten: ['40'],
    },
    {
      id: 'k10-l01-c3',
      typ: 'auswahl',
      themen: ['speicher'],
      frage: 'Wo liegen lokale Variablen einer Funktion?',
      optionen: [{ text: 'Auf dem Stack; sie verschwinden am Ende des Blocks.', richtig: true }, { text: 'Auf dem Heap; man muss sie mit `free` freigeben.' }, { text: 'In einer Datei.' }],
    },
  ],
  zusammenfassung: [
    'Lokale Variablen liegen auf dem Stack und verschwinden am Blockende.',
    '`malloc(n * sizeof *p)` reserviert Platz auf dem Heap; Ergebnis auf `NULL` prüfen.',
    'Zu jedem `malloc` gehört genau ein `free`.',
    'Neuer Speicher aus `malloc` ist nicht initialisiert.',
  ],
  referenz: ['malloc', 'free'],
};
