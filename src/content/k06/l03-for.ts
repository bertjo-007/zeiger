import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k06-l03',
  titel: 'Die for-Schleife',
  dauer: 25,
  stichwoerter: ['for', 'Zählschleife', 'Schleifenzähler', 'Initialisierung', 'Schritt', 'Off-by-one', 'rückwärts zählen', 'Schrittweite'],
  lernziele: [
    'eine Zählschleife mit `for` schreiben',
    'vorwärts, rückwärts und in beliebigen Schritten zählen',
    'Off-by-one-Fehler erkennen und vermeiden',
  ],
  erklaerung: md`
    Sehr viele Schleifen zählen: «für jede der 8 Achsen», «für jede Minute von 0 bis 59», «10 Messungen». Dafür ist **\`for\`** gemacht. Es fasst die drei Teile einer Zählschleife in einer Zeile zusammen:

    ~~~c
    for (int i = 0; i < 8; i++) {
        printf("Achse %d\n", i);
    }
    ~~~

    | Teil | Beispiel | wann |
    |---|---|---|
    | Initialisierung | \`int i = 0\` | einmal vor der Schleife |
    | Bedingung | \`i < 8\` | vor jedem Durchlauf |
    | Schritt | \`i++\` | nach jedem Durchlauf |

    Die Schleife oben ist gleichbedeutend mit:

    ~~~c
    int i = 0;
    while (i < 8) {
        printf("Achse %d\n", i);
        i++;
    }
    ~~~

    Wird der Zähler im Kopf deklariert (\`int i = 0\`), gilt er **nur innerhalb** der Schleife. Danach gibt es \`i\` nicht mehr.

    ### Zählen auf verschiedene Arten

    | Schleifenkopf | Werte |
    |---|---|
    | \`for (int i = 0; i < 5; i++)\` | 0 1 2 3 4 (fünf Durchläufe) |
    | \`for (int i = 1; i <= 5; i++)\` | 1 2 3 4 5 |
    | \`for (int i = 5; i > 0; i--)\` | 5 4 3 2 1 |
    | \`for (int i = 0; i <= 100; i += 25)\` | 0 25 50 75 100 |

    ### Off-by-one

    Der häufigste Schleifenfehler ist ein Durchlauf **zu viel oder zu wenig**. Die Regel «bei 0 anfangen, mit \`<\` aufhören» liefert genau n Durchläufe und passt zu Arrays (Kapitel 8). Prüfe im Zweifel den ersten und den letzten Wert.

    > [!tipp] while oder for?
    > Steht die Anzahl Durchläufe vorher fest oder wird ein Zähler hochgezählt, nimm \`for\`. Hängt das Ende von etwas ab, das erst im Durchlauf passiert (Eingabe, Messwert), ist \`while\` natürlicher.
  `,
  syntax: [
    {
      code: c`
        for (initialisierung; bedingung; schritt) {
            anweisungen;
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          // Rampe: PWM-Wert in 5 Schritten von 0 auf 200 erhöhen
          for (int schritt = 0; schritt <= 4; schritt++) {
              int pwm = schritt * 50;
              printf("Schritt %d: PWM %3d\n", schritt, pwm);
          }

          // Countdown
          for (int s = 3; s > 0; s--) {
              printf("%d... ", s);
          }
          printf("Start\n");

          // Messpunkte alle 0.5 m
          for (double pos = 0.0; pos <= 2.0; pos += 0.5) {
              printf("%.1f ", pos);
          }
          printf("m\n");
          return 0;
      }
    `,
    ausgabe: out`
      Schritt 0: PWM   0
      Schritt 1: PWM  50
      Schritt 2: PWM 100
      Schritt 3: PWM 150
      Schritt 4: PWM 200
      3... 2... 1... Start
      0.0 0.5 1.0 1.5 2.0 m
    `,
  },
  zeilen: [
    { zeilen: '5', text: md`Fünf Durchläufe: \`schritt\` ist 0 bis 4, weil \`<=\` die 4 einschliesst.` },
    { zeilen: '6', text: md`Der Zähler wird für eine Rechnung verwendet.` },
    { zeilen: '11', text: md`Rückwärts: Start bei 3, Schritt \`s--\`, Ende wenn \`s\` 0 erreicht.` },
    { zeilen: '17', text: md`Auch Kommazahlen sind möglich. 0.5 lässt sich binär exakt darstellen, darum klappt der Vergleich mit 2.0 hier. Bei 0.1 wäre das riskant.` },
  ],
  ergebnis: md`
    Die Rampe hat fünf Stufen, der Countdown drei, die Messpunkte fünf. Ändere die erste Bedingung zu \`schritt < 4\`: Dann fehlt die letzte Stufe (200), ein typischer Off-by-one-Fehler.
  `,
  fehler: [
    {
      titel: 'Komma statt Strichpunkt',
      text: md`Die drei Teile werden mit \`;\` getrennt.`,
      falsch: c`for (int i = 0, i < 10, i++)`,
      richtig: c`for (int i = 0; i < 10; i++)`,
    },
    {
      titel: 'Off-by-one',
      text: md`\`for (int i = 0; i <= 10; i++)\` läuft 11-mal. Für genau n Durchläufe ab 0: \`i < n\`.`,
    },
    {
      titel: 'Zähler im Rumpf verändert',
      text: md`Wer \`i\` im Rumpf zusätzlich ändert, macht die Schleife schwer verständlich und riskiert eine Endlosschleife. Den Zähler nur im Kopf ändern.`,
    },
  ],
  uebungen: [
    {
      id: 'k06-l03-u1',
      typ: 'vorhersage',
      titel: 'Schleifenköpfe lesen',
      stufe: 1,
      themen: ['schleifen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            for (int i = 2; i < 10; i += 3) {
                printf("%d ", i);
            }
            printf("\n");
            for (int j = 4; j >= 0; j -= 2) {
                printf("%d ", j);
            }
            printf("\n");
            return 0;
        }
      `,
      ausgabe: out`
        2 5 8
        4 2 0
      `,
    },
    {
      id: 'k06-l03-u2',
      typ: 'programm',
      titel: 'Umrechnungstabelle',
      stufe: 2,
      themen: ['schleifen', 'format'],
      aufgabe: md`
        Gib eine Tabelle von 0 bis 100 Grad Celsius in 20er-Schritten mit den Fahrenheit-Werten aus (F = C · 9 / 5 + 32), Fahrenheit mit einer Nachkommastelle, rechtsbündig auf 6 Zeichen:

        ~~~text
        0 C =   32.0 F
        20 C =   68.0 F
        40 C =  104.0 F
        60 C =  140.0 F
        80 C =  176.0 F
        100 C =  212.0 F
        ~~~

        Format pro Zeile: \`"%d C = %6.1f F\n"\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            for (int c = 0; c <= 100; c += 20) {
                printf("%d C = %6.1f F\n", c, c * 9.0 / 5 + 32);
            }
            return 0;
        }
      `,
      tests: [{ name: 'Tabelle', erwartet: { stdout: '0 C =   32.0 F\n20 C =   68.0 F\n40 C =  104.0 F\n60 C =  140.0 F\n80 C =  176.0 F\n100 C =  212.0 F\n' } }],
      regeln: [{ muss: '\\bfor\\b', meldung: 'Verwende eine `for`-Schleife.' }],
      hinweise: [md`\`for (int c = 0; c <= 100; c += 20)\``, md`Rechne mit \`9.0\`, sonst wird ganzzahlig geteilt.`],
    },
    {
      id: 'k06-l03-u3',
      typ: 'fehlersuche',
      titel: 'Ein Sensor zu viel',
      stufe: 2,
      themen: ['schleifen'],
      aufgabe: md`
        Eine Anlage hat 6 Sensoren mit den Nummern 1 bis 6. Das Programm soll \`Sensor 1\` bis \`Sensor 6\` ausgeben, je eine Zeile, gibt aber 7 Zeilen aus und beginnt bei 0.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            const int ANZAHL = 6;
            for (int i = 0; i <= ANZAHL; i++) {
                printf("Sensor %d\n", i);
            }
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            const int ANZAHL = 6;
            for (int i = 1; i <= ANZAHL; i++) {
                printf("Sensor %d\n", i);
            }
            return 0;
        }
      `,
      tests: [{ name: 'Sensor 1 bis 6', erwartet: { stdout: 'Sensor 1\nSensor 2\nSensor 3\nSensor 4\nSensor 5\nSensor 6\n' } }],
      hinweise: [md`Bei welchem Wert soll die Zählung beginnen?`],
    },
    {
      id: 'k06-l03-u4',
      typ: 'programm',
      titel: 'Fakultät',
      stufe: 3,
      themen: ['schleifen', 'datentypen'],
      aufgabe: md`
        Lies n (0 bis 20) ein und berechne n! = 1 · 2 · … · n mit einer \`for\`-Schleife. 0! ist 1. Ab 13! passt das Ergebnis nicht mehr in \`int\`; nimm \`long long\`. Ausgabe: \`10! = 3628800\`.
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

            long long fakultaet = 1;
            for (int i = 2; i <= n; i++) {
                fakultaet *= i;
            }
            printf("%d! = %lld\n", n, fakultaet);
            return 0;
        }
      `,
      tests: [
        { name: '10', stdin: '10\n', erwartet: { stdout: '10! = 3628800\n' } },
        { name: '0', stdin: '0\n', erwartet: { stdout: '0! = 1\n' } },
        { name: '20', stdin: '20\n', erwartet: { stdout: '20! = 2432902008176640000\n' }, tipp: md`Für 20! braucht es \`long long\` und \`%lld\`.` },
      ],
      hinweise: [md`Startwert 1, dann in der Schleife \`fakultaet *= i;\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k06-l03-c1',
      typ: 'eingabe',
      themen: ['schleifen'],
      frage: 'Wie oft läuft `for (int i = 0; i < 12; i++)` durch?',
      antworten: ['12'],
    },
    {
      id: 'k06-l03-c2',
      typ: 'zuordnen',
      themen: ['schleifen'],
      frage: 'Wann wird welcher Teil von `for (A; B; C)` ausgeführt?',
      paare: [
        { links: 'A', rechts: 'einmal vor der Schleife' },
        { links: 'B', rechts: 'vor jedem Durchlauf' },
        { links: 'C', rechts: 'nach jedem Durchlauf' },
      ],
    },
    {
      id: 'k06-l03-c3',
      typ: 'wahrfalsch',
      themen: ['schleifen'],
      aussage: 'Ein in `for (int i = 0; …)` deklarierter Zähler ist auch nach der Schleife noch verfügbar.',
      richtig: false,
    },
  ],
  zusammenfassung: [
    '`for (start; bedingung; schritt)` fasst eine Zählschleife in einer Zeile zusammen.',
    'Start einmal, Bedingung vor jedem, Schritt nach jedem Durchlauf.',
    'Für n Durchläufe: `for (int i = 0; i < n; i++)`.',
    'Ersten und letzten Wert prüfen, um Off-by-one-Fehler zu vermeiden.',
  ],
  referenz: ['for'],
};
