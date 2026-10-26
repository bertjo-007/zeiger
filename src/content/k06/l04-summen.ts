import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k06-l04',
  titel: 'Zähler, Summen, Minimum und Maximum',
  dauer: 30,
  stichwoerter: ['Summe', 'Mittelwert', 'Durchschnitt', 'Minimum', 'Maximum', 'Zähler', 'Akkumulator', 'Statistik', 'Messreihe', 'Schwellwert'],
  lernziele: [
    'mit Schleifen Summen, Mittelwerte und Anzahlen berechnen',
    'Minimum und Maximum einer Messreihe bestimmen',
    'die richtigen Startwerte für solche Berechnungen wählen',
  ],
  erklaerung: md`
    Messreihen auswerten gehört zu den häufigsten Aufgaben: Wie hoch war die mittlere Temperatur? Wie oft wurde ein Grenzwert überschritten? Was war der höchste Druck? Alle diese Fragen beantwortet ein und dasselbe Muster:

    1. **Vor** der Schleife Variablen mit einem passenden Startwert anlegen.
    2. **In** der Schleife jeden Wert verarbeiten.
    3. **Nach** der Schleife das Ergebnis ausgeben.

    ### Die Grundmuster

    | Frage | Start | in der Schleife |
    |---|---|---|
    | Anzahl | \`anzahl = 0\` | \`anzahl++\` |
    | Summe | \`summe = 0\` | \`summe += wert\` |
    | Anzahl mit Bedingung | \`treffer = 0\` | \`if (wert > grenze) treffer++\` |
    | Maximum | erster Wert | \`if (wert > max) max = wert\` |
    | Minimum | erster Wert | \`if (wert < min) min = wert\` |

    Der **Mittelwert** ergibt sich danach aus Summe und Anzahl: \`(double)summe / anzahl\`. Den Cast nicht vergessen, und bei einer Anzahl von 0 nicht teilen.

    ### Startwert für Minimum und Maximum

    Ein häufiger Fehler ist \`max = 0\`. Sind alle Werte negativ (etwa Temperaturen im Winter), bleibt das Maximum fälschlich 0. Richtig ist, mit dem **ersten Wert** zu starten. Steht der erste Wert noch nicht fest, kann man auch mit einer Hilfsvariable \`bool erster = true\` arbeiten oder mit den Grenzwerten aus \`<limits.h>\` starten (\`max = INT_MIN\`).

    > [!praxis] Kennzahlen in der Produktion
    > Ausschussquote, mittlere Taktzeit, Spitzenlast, Anzahl Störungen pro Schicht: Das sind alles Summen, Anzahlen, Mittelwerte und Extremwerte über eine Reihe von Werten. Mit diesem Muster lassen sie sich alle berechnen.
  `,
  syntax: [
    {
      code: c`
        int anzahl = 0, summe = 0, max = erster_wert;
        while (/* weiterer wert */) {
            anzahl++;
            summe += wert;
            if (wert > max) { max = wert; }
        }
        double mittel = (double)summe / anzahl;
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          double wert = 0.0;
          int anzahl = 0;
          int ueber_grenze = 0;
          double summe = 0.0, min = 0.0, max = 0.0;
          const double GRENZE = 60.0;

          while (scanf("%lf", &wert) == 1) {
              if (anzahl == 0) {
                  min = wert;     // erster Wert: Startwert für min und max
                  max = wert;
              }
              anzahl++;
              summe += wert;
              if (wert < min) {
                  min = wert;
              }
              if (wert > max) {
                  max = wert;
              }
              if (wert > GRENZE) {
                  ueber_grenze++;
              }
          }

          if (anzahl == 0) {
              printf("Keine Messwerte\n");
              return 1;
          }
          printf("Anzahl: %d\n", anzahl);
          printf("Mittel: %.2f\n", summe / anzahl);
          printf("Min: %.1f, Max: %.1f\n", min, max);
          printf("Über %.0f: %d Mal\n", GRENZE, ueber_grenze);
          return 0;
      }
    `,
    stdin: '58.2 61.5 59.9 63.0 57.4\n',
    ausgabe: out`
      58.2 61.5 59.9 63.0 57.4
      Anzahl: 5
      Mittel: 60.00
      Min: 57.4, Max: 63.0
      Über 60: 2 Mal
    `,
  },
  zeilen: [
    { zeilen: '5-7', text: md`Zähler und Summe starten bei 0. Für \`min\` und \`max\` steht der Startwert erst fest, wenn der erste Wert da ist.` },
    { zeilen: '11-14', text: md`Beim ersten Wert werden \`min\` und \`max\` gesetzt. So funktioniert es auch, wenn alle Werte negativ sind.` },
    { zeilen: '15-16', text: md`Zählen und Aufsummieren.` },
    { zeilen: '17-25', text: md`Drei unabhängige \`if\`: neues Minimum, neues Maximum, Grenzwert überschritten.` },
    { zeilen: '28-31', text: md`Ohne Werte kein Mittelwert, sonst Division durch 0.` },
  ],
  ergebnis: md`
    Aus fünf Temperaturen werden Mittelwert, Minimum, Maximum und die Anzahl Überschreitungen berechnet. Gib unter «Eingabe» nur negative Werte ein, etwa \`-5 -2 -9\`: Das Maximum ist dann korrekt −2, nicht 0.
  `,
  fehler: [
    {
      titel: 'max mit 0 starten',
      text: md`Bei lauter negativen Werten bleibt das Maximum 0, ein Wert, der gar nicht vorkam.`,
      falsch: c`int max = 0;`,
      richtig: c`int max = erster_wert;   // oder INT_MIN aus <limits.h>`,
    },
    {
      titel: 'Summe nicht initialisiert',
      text: md`\`int summe;\` ohne Startwert enthält Zufall, und die Summe ist falsch.`,
    },
    {
      titel: 'Ganzzahliger Mittelwert',
      text: md`\`summe / anzahl\` mit zwei \`int\` schneidet die Nachkommastellen ab.`,
      falsch: c`double mittel = summe / anzahl;`,
      richtig: c`double mittel = (double)summe / anzahl;`,
    },
  ],
  uebungen: [
    {
      id: 'k06-l04-u1',
      typ: 'programm',
      titel: 'Ausschussquote',
      stufe: 2,
      themen: ['schleifen'],
      aufgabe: md`
        Für jedes geprüfte Teil wird eine Zahl eingegeben: 1 für gut, 0 für Ausschuss. Lies alle Werte bis zum Ende der Eingabe und gib aus:

        ~~~text
        geprüft: 8, Ausschuss: 2, Quote: 25.0 %
        ~~~

        Bei 0 geprüften Teilen: \`keine Teile\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int wert = 0;

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int wert = 0;
            int geprueft = 0;
            int ausschuss = 0;

            while (scanf("%d", &wert) == 1) {
                geprueft++;
                if (wert == 0) {
                    ausschuss++;
                }
            }
            if (geprueft == 0) {
                printf("keine Teile\n");
                return 0;
            }
            printf("geprüft: %d, Ausschuss: %d, Quote: %.1f %%\n", geprueft, ausschuss, 100.0 * ausschuss / geprueft);
            return 0;
        }
      `,
      tests: [
        { name: '8 Teile, 2 Ausschuss', stdin: '1 1 0 1 1 0 1 1\n', erwartet: { stdout: 'geprüft: 8, Ausschuss: 2, Quote: 25.0 %\n' } },
        { name: 'Alles gut', stdin: '1 1 1\n', erwartet: { stdout: 'geprüft: 3, Ausschuss: 0, Quote: 0.0 %\n' } },
        { name: 'Keine Teile', stdin: '', erwartet: { stdout: 'keine Teile\n' } },
      ],
      hinweise: [md`Zwei Zähler: alle Teile und nur die Ausschussteile.`, md`Quote: \`100.0 * ausschuss / geprueft\`.`],
    },
    {
      id: 'k06-l04-u2',
      typ: 'fehlersuche',
      titel: 'Winter-Maximum',
      stufe: 2,
      themen: ['schleifen'],
      aufgabe: md`
        Das Programm soll die höchste von fünf Wintertemperaturen ausgeben. Bei \`-8 -3 -12 -5 -4\` erscheint aber \`Max: 0\`. Korrigiere den Startwert.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int t = 0;
            int max = 0;
            for (int i = 0; i < 5; i++) {
                scanf("%d", &t);
                if (t > max) {
                    max = t;
                }
            }
            printf("Max: %d\n", max);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int t = 0;
            int max = 0;
            for (int i = 0; i < 5; i++) {
                scanf("%d", &t);
                if (i == 0 || t > max) {
                    max = t;
                }
            }
            printf("Max: %d\n", max);
            return 0;
        }
      `,
      tests: [
        { name: 'Nur negativ', stdin: '-8 -3 -12 -5 -4\n', erwartet: { stdout: 'Max: -3\n' } },
        { name: 'Gemischt', stdin: '4 -1 9 2 0\n', erwartet: { stdout: 'Max: 9\n' } },
      ],
      hinweise: [md`Der erste Wert soll in jedem Fall das vorläufige Maximum werden.`, md`\`if (i == 0 || t > max)\``],
    },
    {
      id: 'k06-l04-u3',
      typ: 'programm',
      titel: 'Spannweite und Mittelwert',
      stufe: 3,
      themen: ['schleifen', 'eingabe'],
      aufgabe: md`
        Zuerst wird eingegeben, wie viele Messwerte folgen (n ≥ 1), dann die n Werte (ganze Zahlen). Gib Mittelwert (2 Nachkommastellen) und Spannweite (Maximum − Minimum) aus. Bei \`4  10 14 7 13\`:

        ~~~text
        Mittel 11.00, Spannweite 7
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int n = 0;
            scanf("%d", &n);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int n = 0;
            scanf("%d", &n);

            int summe = 0, min = 0, max = 0;
            for (int i = 0; i < n; i++) {
                int w = 0;
                scanf("%d", &w);
                if (i == 0 || w < min) {
                    min = w;
                }
                if (i == 0 || w > max) {
                    max = w;
                }
                summe += w;
            }
            printf("Mittel %.2f, Spannweite %d\n", (double)summe / n, max - min);
            return 0;
        }
      `,
      tests: [
        { name: '4 Werte', stdin: '4\n10 14 7 13\n', erwartet: { stdout: 'Mittel 11.00, Spannweite 7\n' } },
        { name: '1 Wert', stdin: '1\n-5\n', erwartet: { stdout: 'Mittel -5.00, Spannweite 0\n' } },
        { name: '3 Werte', stdin: '3\n1 2 2\n', erwartet: { stdout: 'Mittel 1.67, Spannweite 1\n' } },
      ],
      regeln: [{ muss: '\\bfor\\b', meldung: 'Verwende eine `for`-Schleife über die n Werte.' }],
      hinweise: [md`Die Anzahl steht vorher fest: ein Fall für \`for\`.`, md`Min und Max beim ersten Wert (\`i == 0\`) setzen.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k06-l04-c1',
      typ: 'auswahl',
      themen: ['schleifen'],
      frage: 'Mit welchem Wert sollte das Maximum einer Messreihe starten?',
      optionen: [{ text: 'Mit dem ersten Messwert', richtig: true }, { text: 'Mit 0', warum: 'Bei lauter negativen Werten wäre 0 falsch.' }, { text: 'Mit dem letzten Messwert', warum: 'Der ist beim Start noch nicht bekannt.' }],
    },
    {
      id: 'k06-l04-c2',
      typ: 'vorhersage',
      themen: ['schleifen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int summe = 0;
            for (int i = 1; i <= 4; i++) {
                summe += i * i;
            }
            printf("%d\n", summe);
            return 0;
        }
      `,
      ausgabe: out`
        30
      `,
      erklaerung: md`1 + 4 + 9 + 16 = 30.`,
    },
    {
      id: 'k06-l04-c3',
      typ: 'wahrfalsch',
      themen: ['schleifen'],
      aussage: 'Eine Summe muss vor der Schleife mit 0 initialisiert werden.',
      richtig: true,
    },
  ],
  zusammenfassung: [
    'Muster: vor der Schleife initialisieren, in der Schleife verarbeiten, danach ausgeben.',
    'Anzahl und Summe starten bei 0, Minimum und Maximum beim ersten Wert.',
    'Mittelwert mit Cast und nur, wenn die Anzahl nicht 0 ist.',
    'Bedingte Zähler (`if (…) treffer++`) beantworten «wie oft».',
  ],
  referenz: ['for', 'while'],
};
