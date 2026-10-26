import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k06-l06',
  titel: 'break, continue und Endlosschleifen',
  dauer: 25,
  stichwoerter: ['break', 'continue', 'Endlosschleife', 'while (1)', 'for (;;)', 'Superloop', 'abbrechen', 'überspringen', 'Suche'],
  lernziele: [
    'eine Schleife mit `break` vorzeitig verlassen',
    'mit `continue` einzelne Durchläufe überspringen',
    'ungewollte Endlosschleifen erkennen und gewollte sicher einsetzen',
  ],
  erklaerung: md`
    ### break: sofort raus

    \`break\` beendet die **innerste** Schleife sofort; das Programm macht hinter ihr weiter. Typisch bei einer **Suche**: Ist der gesuchte Wert gefunden, braucht man den Rest nicht mehr anzuschauen.

    ~~~c
    for (int i = 0; i < 100; i++) {
        scanf("%d", &wert);
        if (wert < 0) {
            break;          // Ende-Markierung erreicht
        }
        …
    }
    ~~~

    ### continue: diesen Durchlauf überspringen

    \`continue\` springt direkt zum nächsten Durchlauf. Bei \`for\` wird dabei noch der Schritt (\`i++\`) ausgeführt. Damit lassen sich ungültige Werte überspringen, ohne den restlichen Rumpf einrücken zu müssen.

    ~~~c
    if (wert > 1000) {
        continue;           // Messfehler ignorieren
    }
    ~~~

    > [!achtung] continue in while
    > In einer \`while\`-Schleife steht das Hochzählen meist am Ende des Rumpfs. Springt \`continue\` darüber hinweg, wird nicht hochgezählt, und die Schleife hängt. In \`for\`-Schleifen passiert das nicht, weil der Schritt im Kopf steht.

    ### Ungewollte Endlosschleifen

    Typische Ursachen:

    - der Zähler wird nicht verändert oder in die falsche Richtung (\`i--\` statt \`i++\`);
    - die Bedingung kann nie falsch werden, etwa \`while (x != 10)\` bei \`x += 3\` ab 0;
    - \`continue\` überspringt das Hochzählen;
    - eine Eingabeschleife prüft \`EOF\` nicht.

    ### Gewollte Endlosschleifen

    Auf einem Mikrocontroller soll das Programm **nie** enden: Es liest ständig Sensoren, rechnet und schaltet Ausgänge. Dieses Muster heisst **Superloop**:

    ~~~c
    while (1) {        // oder: for (;;)
        sensoren_lesen();
        regeln();
        ausgaenge_setzen();
    }
    ~~~

    Am PC verlässt man eine solche Schleife mit \`break\`, sobald ein Ende-Signal kommt. In Kapitel 15 siehst du die Superloop auf dem Mikrocontroller.
  `,
  syntax: [
    {
      code: c`
        while (1) {
            if (fertig) {
                break;      // Schleife verlassen
            }
            if (ueberspringen) {
                continue;   // nächster Durchlauf
            }
            …
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int wert = 0;
          int summe = 0, gueltig = 0, ignoriert = 0;

          // Messwerte bis zur Ende-Markierung -1; Werte über 1000 sind Messfehler
          while (1) {
              if (scanf("%d", &wert) != 1 || wert == -1) {
                  break;
              }
              if (wert < 0 || wert > 1000) {
                  ignoriert++;
                  continue;
              }
              summe += wert;
              gueltig++;
          }
          printf("%d gültige Werte, Summe %d, %d ignoriert\n", gueltig, summe, ignoriert);

          // Suche: erstes Vielfaches von 7 über 50
          for (int n = 51; n < 100; n++) {
              if (n % 7 == 0) {
                  printf("Gefunden: %d\n", n);
                  break;
              }
          }
          return 0;
      }
    `,
    stdin: '120 5000 340 -7 85 -1 999\n',
    ausgabe: out`
      120 5000 340 -7 85 -1 999
      3 gültige Werte, Summe 545, 2 ignoriert
      Gefunden: 56
    `,
  },
  zeilen: [
    { zeilen: '8', text: md`Gewollte Endlosschleife; sie wird nur über \`break\` verlassen.` },
    { zeilen: '9-11', text: md`Ende der Eingabe oder Ende-Markierung −1: Schleife verlassen. Die 999 danach wird gar nicht mehr gelesen.` },
    { zeilen: '12-15', text: md`Ungültige Werte werden gezählt und übersprungen; der Rest des Rumpfs läuft für sie nicht.` },
    { zeilen: '22-27', text: md`Suche mit \`break\`: Nach dem ersten Treffer wird nicht weitergesucht.` },
  ],
  ergebnis: md`
    Von den Werten vor der −1 werden 120, 340 und 85 gezählt, 5000 und −7 ignoriert. Die Suche findet 56 = 8 · 7 und hört dann auf.
  `,
  fehler: [
    {
      titel: 'continue überspringt das Hochzählen',
      text: md`In \`while\` steht \`i++\` oft am Ende; \`continue\` springt darüber hinweg.`,
      falsch: c`
        int i = 0;
        while (i < 10) {
            if (i % 2 == 0) {
                continue;     // i bleibt 0: Endlosschleife
            }
            printf("%d\n", i);
            i++;
        }
      `,
      richtig: c`
        for (int i = 0; i < 10; i++) {
            if (i % 2 == 0) {
                continue;
            }
            printf("%d\n", i);
        }
      `,
    },
    {
      titel: 'break in verschachtelten Schleifen',
      text: md`\`break\` verlässt nur die innerste Schleife. Um aus beiden herauszukommen, braucht es eine \`bool\`-Variable, die auch die äussere prüft, oder eine eigene Funktion mit \`return\` (Kapitel 7).`,
    },
    {
      titel: 'Bedingung, die nie falsch wird',
      text: md`\`for (int x = 0; x != 10; x += 3)\` springt über die 10 hinweg (0, 3, 6, 9, 12, …). Mit \`<\` statt \`!=\` endet sie sicher.`,
    },
  ],
  uebungen: [
    {
      id: 'k06-l06-u1',
      typ: 'vorhersage',
      titel: 'break und continue',
      stufe: 1,
      themen: ['schleifen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            for (int i = 1; i <= 10; i++) {
                if (i == 3) {
                    continue;
                }
                if (i == 6) {
                    break;
                }
                printf("%d ", i);
            }
            printf("\n");
            return 0;
        }
      `,
      ausgabe: out`
        1 2 4 5
      `,
    },
    {
      id: 'k06-l06-u2',
      typ: 'fehlersuche',
      titel: 'Endlos statt ungerade',
      stufe: 2,
      themen: ['schleifen'],
      aufgabe: md`
        Das Programm soll die ungeraden Zahlen von 1 bis 9 ausgeben (\`1 3 5 7 9\`), hängt aber in einer Endlosschleife. Behebe den Fehler.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int i = 0;
            while (i < 10) {
                if (i % 2 == 0) {
                    continue;
                }
                printf("%d ", i);
                i++;
            }
            printf("\n");
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            for (int i = 0; i < 10; i++) {
                if (i % 2 == 0) {
                    continue;
                }
                printf("%d ", i);
            }
            printf("\n");
            return 0;
        }
      `,
      tests: [{ name: 'Ungerade Zahlen', erwartet: { stdout: '1 3 5 7 9\n' } }],
      hinweise: [md`Was passiert mit \`i\`, wenn \`continue\` ausgeführt wird?`, md`Mit einer \`for\`-Schleife wird der Schritt auch nach \`continue\` ausgeführt.`],
    },
    {
      id: 'k06-l06-u3',
      typ: 'programm',
      titel: 'Erster Überdruck',
      stufe: 2,
      themen: ['schleifen', 'eingabe'],
      aufgabe: md`
        Lies Druckwerte (Kommazahlen) bis zum Ende der Eingabe. Sobald ein Wert über 8.0 bar liegt, gib \`Überdruck bei Messung <n>: <wert> bar\` aus (n ab 1, Wert mit einer Nachkommastelle) und beende das Einlesen. Kommt kein solcher Wert, gib \`kein Überdruck\` aus.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double p = 0.0;

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdbool.h>

        int main(void) {
            double p = 0.0;
            int nr = 0;
            bool gefunden = false;

            while (scanf("%lf", &p) == 1) {
                nr++;
                if (p > 8.0) {
                    printf("Überdruck bei Messung %d: %.1f bar\n", nr, p);
                    gefunden = true;
                    break;
                }
            }
            if (!gefunden) {
                printf("kein Überdruck\n");
            }
            return 0;
        }
      `,
      tests: [
        { name: 'Überdruck bei Messung 3', stdin: '6.5 7.9 8.4 9.1\n', erwartet: { stdout: 'Überdruck bei Messung 3: 8.4 bar\n' } },
        { name: 'Kein Überdruck', stdin: '5 6 8\n', erwartet: { stdout: 'kein Überdruck\n' } },
      ],
      regeln: [{ muss: '\\bbreak\\b', meldung: 'Beende das Einlesen mit `break`.' }],
      hinweise: [md`Eine \`bool\`-Variable merkt sich, ob etwas gefunden wurde.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k06-l06-c1',
      typ: 'auswahl',
      themen: ['schleifen'],
      frage: 'Was macht `continue` in einer `for`-Schleife?',
      optionen: [{ text: 'Springt zum Schritt und zum nächsten Durchlauf', richtig: true }, { text: 'Beendet die Schleife', warum: 'Das macht `break`.' }, { text: 'Beendet das Programm' }],
    },
    {
      id: 'k06-l06-c2',
      typ: 'wahrfalsch',
      themen: ['schleifen'],
      aussage: '`break` in einer inneren Schleife beendet auch die äussere.',
      richtig: false,
    },
    {
      id: 'k06-l06-c3',
      typ: 'auswahl',
      themen: ['schleifen', 'mikrocontroller'],
      frage: 'Wozu dient `while (1) { … }` auf einem Mikrocontroller?',
      optionen: [{ text: 'Als Hauptschleife, die Sensoren liest und Ausgänge setzt, solange das Gerät läuft', richtig: true }, { text: 'Es ist immer ein Fehler.', warum: 'Auf Mikrocontrollern ist das gewollt.' }, { text: 'Es läuft genau einmal.' }],
    },
  ],
  zusammenfassung: [
    '`break` verlässt die innerste Schleife sofort, `continue` springt zum nächsten Durchlauf.',
    'In `while` kann `continue` das Hochzählen überspringen; `for` ist hier sicherer.',
    'Ungewollte Endlosschleifen: Änderung, Richtung und Abbruchbedingung prüfen.',
    'Gewollte Endlosschleife `while (1)` ist das Grundmuster von Mikrocontroller-Programmen.',
  ],
  referenz: ['break', 'continue'],
};
