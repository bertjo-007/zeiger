import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k08-l01',
  titel: 'Eindimensionale Arrays',
  dauer: 25,
  stichwoerter: ['Array', 'Feld', 'Index', 'Element', 'Initialisierung', 'sizeof', 'Länge', '[ ]', 'Messreihe'],
  lernziele: [
    'ein Array deklarieren, initialisieren und auf einzelne Elemente zugreifen',
    'erklären, warum der erste Index 0 ist und der letzte n − 1',
    'die Anzahl Elemente mit `sizeof` berechnen',
  ],
  erklaerung: md`
    Acht Temperaturfühler, 24 Stundenwerte, 6 Achsen eines Roboters: Für viele gleichartige Werte wären einzelne Variablen (\`t1\`, \`t2\`, …) mühsam. Ein **Array** (deutsch auch **Feld**) speichert mehrere Werte **desselben Typs** unter **einem** Namen, direkt hintereinander im Speicher.

    ~~~c
    double temperatur[8];          // 8 double-Werte
    ~~~

    ### Index

    Die einzelnen **Elemente** erreichst du über einen **Index** in eckigen Klammern. Gezählt wird **ab 0**:

    | Element | \`temperatur[0]\` | \`temperatur[1]\` | … | \`temperatur[7]\` |
    |---|---|---|---|---|
    | Position | 1. Wert | 2. Wert | … | 8. Wert |

    Ein Array mit n Elementen hat also die Indizes **0 bis n − 1**. \`temperatur[8]\` gibt es nicht. Der Index darf eine Variable oder eine Rechnung sein, z. B. \`temperatur[i]\` oder \`temperatur[i + 1]\`. Genau das macht Arrays zusammen mit Schleifen so mächtig.

    ### Initialisieren

    ~~~c
    int werte[5] = {12, 7, 3, 9, 4};   // alle Werte angegeben
    int nullen[5] = {0};               // alle Elemente 0
    int teil[5] = {1, 2};              // 1, 2, 0, 0, 0
    int auto_laenge[] = {4, 8, 15};    // Länge 3 vom Compiler gezählt
    ~~~

    Ohne Initialisierung enthält ein lokales Array, wie jede lokale Variable, zufällige Werte.

    ### Die Länge berechnen

    \`sizeof werte\` ist die Grösse des ganzen Arrays in Byte, \`sizeof werte[0]\` die eines Elements. Daraus ergibt sich die Anzahl Elemente:

    ~~~c
    size_t anzahl = sizeof werte / sizeof werte[0];
    ~~~

    Das funktioniert nur, wo das Array selbst deklariert ist, nicht in einer Funktion, die es als Parameter bekommt (nächste Lektion). Für feste Grössen nimmt man oft eine Konstante: \`#define ANZAHL_SENSOREN 8\` (Kapitel 13) und dann \`double temperatur[ANZAHL_SENSOREN];\`.

    > [!achtung] Kein Schutz vor falschen Indizes
    > C prüft nicht, ob ein Index gültig ist. \`werte[10]\` bei 5 Elementen liest oder überschreibt fremden Speicher. Zeiger erkennt solche Zugriffe und meldet einen Laufzeitfehler; auf einem PC oder Mikrocontroller passiert das oft unbemerkt. Lektion 8.4 behandelt das ausführlich.
  `,
  syntax: [
    {
      code: c`
        typ name[ANZAHL];                  // Deklaration
        typ name[ANZAHL] = {w0, w1, …};    // mit Startwerten
        name[index] = wert;                // schreiben, index 0 bis ANZAHL-1
        x = name[index];                   // lesen
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int stueck_pro_stunde[6] = {118, 124, 0, 131, 127, 122};
          size_t anzahl = sizeof stueck_pro_stunde / sizeof stueck_pro_stunde[0];

          printf("%zu Stunden erfasst\n", anzahl);
          printf("Erste Stunde: %d, letzte Stunde: %d\n", stueck_pro_stunde[0], stueck_pro_stunde[anzahl - 1]);

          stueck_pro_stunde[2] = 97;     // Wert für Stunde 3 nachgetragen

          int summe = 0;
          for (size_t i = 0; i < anzahl; i++) {
              printf("Stunde %zu: %d\n", i + 1, stueck_pro_stunde[i]);
              summe += stueck_pro_stunde[i];
          }
          printf("Total: %d\n", summe);
          return 0;
      }
    `,
    ausgabe: out`
      6 Stunden erfasst
      Erste Stunde: 118, letzte Stunde: 122
      Stunde 1: 118
      Stunde 2: 124
      Stunde 3: 97
      Stunde 4: 131
      Stunde 5: 127
      Stunde 6: 122
      Total: 719
    `,
  },
  zeilen: [
    { zeilen: '4', text: md`Ein Array mit 6 \`int\`-Werten, gleich initialisiert.` },
    { zeilen: '5', text: md`Anzahl Elemente: Gesamtgrösse geteilt durch die Grösse eines Elements. Ergebnis 6.` },
    { zeilen: '8', text: md`Das erste Element hat den Index 0, das letzte \`anzahl - 1\`, also 5.` },
    { zeilen: '10', text: md`Ein einzelnes Element überschreiben: die dritte Stunde hat Index 2.` },
    { zeilen: '13-16', text: md`Die Schleife läuft von 0 bis \`anzahl - 1\`. Für die Anzeige wird \`i + 1\` ausgegeben, weil Menschen ab 1 zählen.` },
  ],
  ergebnis: md`
    Alle sechs Stundenwerte erscheinen der Reihe nach, mit dem nachgetragenen Wert 97 in Stunde 3. Ändere die Schleife zu \`i <= anzahl\`: Zeiger meldet dann einen Zugriff ausserhalb des Arrays.
  `,
  fehler: [
    {
      titel: 'Index ab 1 gezählt',
      text: md`Das erste Element ist \`[0]\`. Wer bei 1 beginnt und bis n zählt, überspringt das erste und greift hinter das letzte.`,
      falsch: c`for (int i = 1; i <= 6; i++) summe += werte[i];`,
      richtig: c`for (int i = 0; i < 6; i++) summe += werte[i];`,
    },
    {
      titel: 'Zu viele Startwerte',
      text: md`\`int a[3] = {1, 2, 3, 4};\` meldet Clang als Fehler («excess elements in array initializer»).`,
    },
    {
      titel: 'Arrays mit = kopieren',
      text: md`\`b = a;\` funktioniert bei Arrays nicht. Man kopiert Element für Element in einer Schleife (oder mit \`memcpy\`).`,
    },
  ],
  uebungen: [
    {
      id: 'k08-l01-u1',
      typ: 'vorhersage',
      titel: 'Indizes lesen',
      stufe: 1,
      themen: ['arrays'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int a[5] = {10, 20, 30};
            a[4] = a[0] + a[2];
            printf("%d %d %d %d %d\n", a[0], a[1], a[2], a[3], a[4]);
            return 0;
        }
      `,
      ausgabe: out`
        10 20 30 0 40
      `,
      erklaerung: md`Nicht angegebene Startwerte sind 0. \`a[4]\` wird zu 10 + 30.`,
    },
    {
      id: 'k08-l01-u2',
      typ: 'programm',
      titel: 'Messwerte einlesen und rückwärts ausgeben',
      stufe: 2,
      themen: ['arrays', 'schleifen'],
      aufgabe: md`
        Lies genau 5 ganze Zahlen in ein Array und gib sie in **umgekehrter** Reihenfolge aus, durch Leerzeichen getrennt, mit Zeilenumbruch am Ende. Bei \`1 2 3 4 5\`: \`5 4 3 2 1\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int werte[5];

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int werte[5];

            for (int i = 0; i < 5; i++) {
                scanf("%d", &werte[i]);
            }
            for (int i = 4; i >= 0; i--) {
                printf("%d", werte[i]);
                if (i > 0) {
                    printf(" ");
                }
            }
            printf("\n");
            return 0;
        }
      `,
      tests: [
        { name: '1 2 3 4 5', stdin: '1 2 3 4 5\n', erwartet: { stdout: '5 4 3 2 1\n' } },
        { name: 'Gemischt', stdin: '42 -7 0 13 8\n', erwartet: { stdout: '8 13 0 -7 42\n' } },
      ],
      hinweise: [md`Einlesen mit \`scanf("%d", &werte[i]);\` in einer Schleife.`, md`Rückwärts: \`for (int i = 4; i >= 0; i--)\`.`],
    },
    {
      id: 'k08-l01-u3',
      typ: 'programm',
      titel: 'Höchster Sensor',
      stufe: 2,
      themen: ['arrays', 'schleifen'],
      aufgabe: md`
        Die Temperaturen von 8 Fühlern sind im Array vorgegeben. Finde den Fühler mit der **höchsten** Temperatur und gib seine Nummer (ab 1 gezählt) und den Wert aus:

        ~~~text
        Fühler 6: 74.2 Grad
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double t[8] = {61.5, 58.0, 70.1, 66.4, 59.9, 74.2, 72.8, 63.3};

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            double t[8] = {61.5, 58.0, 70.1, 66.4, 59.9, 74.2, 72.8, 63.3};

            int max_index = 0;
            for (int i = 1; i < 8; i++) {
                if (t[i] > t[max_index]) {
                    max_index = i;
                }
            }
            printf("Fühler %d: %.1f Grad\n", max_index + 1, t[max_index]);
            return 0;
        }
      `,
      tests: [{ name: 'Fühler 6', erwartet: { stdout: 'Fühler 6: 74.2 Grad\n' } }],
      hinweise: [md`Merke dir nicht den Wert, sondern den **Index** des bisher grössten.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k08-l01-c1',
      typ: 'eingabe',
      themen: ['arrays'],
      frage: 'Welchen Index hat das letzte Element von `int a[10]`?',
      antworten: ['9'],
    },
    {
      id: 'k08-l01-c2',
      typ: 'wahrfalsch',
      themen: ['arrays'],
      aussage: 'C prüft automatisch, ob ein Array-Index gültig ist, und meldet sonst einen Fehler.',
      richtig: false,
      erklaerung: 'C prüft das nicht. Ungültige Zugriffe lesen oder überschreiben fremden Speicher.',
    },
    {
      id: 'k08-l01-c3',
      typ: 'auswahl',
      themen: ['arrays'],
      frage: 'Was enthält `int a[4] = {5};`?',
      optionen: [{ text: '5, 0, 0, 0', richtig: true }, { text: '5, 5, 5, 5' }, { text: '5 und drei zufällige Werte' }],
    },
  ],
  zusammenfassung: [
    'Ein Array speichert mehrere Werte gleichen Typs unter einem Namen: `int a[5];`.',
    'Indizes laufen von 0 bis n − 1; der Index darf eine Variable sein.',
    'Initialisierung mit `{…}`; fehlende Werte werden 0.',
    'Anzahl Elemente: `sizeof a / sizeof a[0]` (nur wo das Array deklariert ist).',
    'C prüft Indizes nicht: Grenzen selbst einhalten.',
  ],
  referenz: ['array', 'sizeof'],
};
