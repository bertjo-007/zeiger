import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k04-l05',
  titel: 'Rangfolge und Rechnen mit math.h',
  dauer: 30,
  stichwoerter: ['Rangfolge', 'Priorität', 'Präzedenz', 'Klammern', 'Assoziativität', 'math.h', 'sqrt', 'pow', 'sin', 'cos', 'fabs', 'abs', 'Formel', 'Bogenmass'],
  lernziele: [
    'die Rangfolge der wichtigsten Operatoren anwenden und mit Klammern steuern',
    'Formeln aus Physik und Technik korrekt in C umsetzen',
    'Funktionen aus `<math.h>` wie `sqrt`, `pow`, `sin` und `fabs` verwenden',
  ],
  erklaerung: md`
    In einem Ausdruck mit mehreren Operatoren entscheidet die **Rangfolge** (Priorität), was zuerst berechnet wird. Wie in der Mathematik gilt «Punkt vor Strich», und Klammern gehen vor allem anderen.

    ### Die wichtigsten Stufen (von stark nach schwach)

    | Stufe | Operatoren |
    |---|---|
    | 1 | Klammern \`( )\`, Funktionsaufrufe, \`x++\` \`x--\` |
    | 2 | \`!\` \`-x\` (Vorzeichen) \`++x\` \`--x\` Cast \`(typ)\` \`sizeof\` |
    | 3 | \`*\` \`/\` \`%\` |
    | 4 | \`+\` \`-\` |
    | 5 | \`<\` \`<=\` \`>\` \`>=\` |
    | 6 | \`==\` \`!=\` |
    | 7 | \`&&\` |
    | 8 | \`\|\|\` |
    | 9 | \`?:\` |
    | 10 | \`=\` \`+=\` \`-=\` usw. |

    Operatoren derselben Stufe werden meist **von links nach rechts** ausgewertet: \`20 / 4 * 2\` ist \`(20 / 4) * 2 = 10\`, nicht \`20 / 8\`. Die Zuweisungen sind die Ausnahme, sie werden von rechts nach links ausgewertet.

    Die vollständige Tabelle steht in der Befehlsbibliothek. Im Alltag gilt: **Setze Klammern, sobald du unsicher bist.** Sie kosten nichts und machen den Code lesbarer.

    ### Formeln umsetzen

    Ein Bruch wie \`(a + b) / (c − d)\` braucht in C **beide** Klammerpaare:

    ~~~c
    ergebnis = (a + b) / (c - d);   // ohne Klammern: a + (b / c) - d
    ~~~

    Achte ausserdem auf Ganzzahldivision (\`1 / 2\` ist 0) und auf Einheiten.

    ### Funktionen aus math.h

    | Funktion | berechnet |
    |---|---|
    | \`sqrt(x)\` | Quadratwurzel |
    | \`pow(x, y)\` | x hoch y |
    | \`fabs(x)\` | Betrag einer Kommazahl (\`abs\` aus \`<stdlib.h>\` für \`int\`) |
    | \`sin(x)\`, \`cos(x)\`, \`tan(x)\` | Winkelfunktionen, x im **Bogenmass** |
    | \`atan2(y, x)\` | Winkel eines Punkts (Bogenmass) |
    | \`round\`, \`floor\`, \`ceil\` | runden, abrunden, aufrunden |
    | \`exp(x)\`, \`log(x)\`, \`log10(x)\` | Exponentialfunktion, Logarithmen |

    Winkelfunktionen rechnen im **Bogenmass**: 180 Grad sind π. Umrechnen mit \`grad * PI / 180.0\`. Eine Konstante für π gehört nicht zum C-Standard; lege sie selbst an.

    > [!achtung] ^ ist keine Potenz
    > \`2 ^ 3\` ist in C **nicht** 8, sondern das bitweise XOR und ergibt 1. Potenzen rechnest du mit \`pow\` oder, bei kleinen Exponenten, mit Multiplikation: \`x * x\`.
  `,
  syntax: [
    {
      code: c`
        #include <math.h>
        double r = sqrt(x * x + y * y);
        double winkel_rad = winkel_grad * PI / 180.0;
        double h = laenge * sin(winkel_rad);
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <math.h>

      int main(void) {
          const double PI = 3.14159265358979;

          // Rangfolge
          printf("%d %d %d\n", 2 + 3 * 4, (2 + 3) * 4, 20 / 4 * 2);

          // Roboterarm: Abstand eines Punkts vom Ursprung
          double x = 30.0, y = 40.0;     // mm
          printf("Abstand: %.1f mm\n", sqrt(x * x + y * y));

          // Höhe einer Rampe mit 3 m Länge und 25 Grad Steigung
          double laenge_m = 3.0, winkel_grad = 25.0;
          double hoehe_m = laenge_m * sin(winkel_grad * PI / 180.0);
          printf("Höhe: %.2f m\n", hoehe_m);

          // Abweichung vom Sollwert, unabhängig von der Richtung
          double soll = 12.0, ist = 11.25;
          printf("Abweichung: %.2f\n", fabs(ist - soll));
          return 0;
      }
    `,
    ausgabe: out`
      14 20 10
      Abstand: 50.0 mm
      Höhe: 1.27 m
      Abweichung: 0.75
    `,
  },
  zeilen: [
    { zeilen: '5', text: md`π als eigene Konstante. Der C-Standard liefert keine.` },
    { zeilen: '8', text: md`Punkt vor Strich ergibt 14, mit Klammern 20, und \`20 / 4 * 2\` wird von links nach rechts gerechnet: 10.` },
    { zeilen: '12', text: md`Satz des Pythagoras: Wurzel aus x² + y².` },
    { zeilen: '16', text: md`Grad in Bogenmass umrechnen, dann \`sin\`. Höhe = Länge · sin(Winkel).` },
    { zeilen: '21', text: md`\`fabs\` liefert den Betrag; die Richtung der Abweichung spielt keine Rolle.` },
  ],
  ergebnis: md`
    Die erste Zeile zeigt drei Mal Rangfolge. Danach folgen drei typische technische Rechnungen. Mit einer Steigung von 90 Grad müsste die Höhe genau der Länge entsprechen: Probiere es aus.
  `,
  fehler: [
    {
      titel: 'Fehlende Klammern im Nenner',
      text: md`\`a / b * c\` ist \`(a / b) * c\`, nicht \`a / (b * c)\`. Bei Brüchen den Nenner immer einklammern.`,
      falsch: c`double mittel = summe / anzahl * 2;   // gemeint: summe / (anzahl * 2)`,
      richtig: c`double mittel = summe / (anzahl * 2);`,
    },
    {
      titel: 'Grad statt Bogenmass',
      text: md`\`sin(30)\` ist der Sinus von 30 **Bogenmass**, nicht von 30 Grad. Ergebnis −0,99 statt 0,5.`,
      falsch: c`double s = sin(30.0);`,
      richtig: c`double s = sin(30.0 * PI / 180.0);`,
    },
    {
      titel: '^ als Potenz',
      text: md`\`x ^ 2\` ist XOR. Für Quadrate \`x * x\` oder \`pow(x, 2.0)\`.`,
      falsch: c`double flaeche = r ^ 2 * PI;`,
      richtig: c`double flaeche = r * r * PI;`,
    },
  ],
  uebungen: [
    {
      id: 'k04-l05-u1',
      typ: 'vorhersage',
      titel: 'Was wird zuerst gerechnet?',
      stufe: 1,
      themen: ['rangfolge'],
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("%d\n", 10 - 4 - 2);
            printf("%d\n", 18 / 3 / 2);
            printf("%d\n", 2 + 10 % 4 * 3);
            printf("%d\n", 1 + 2 == 3 && 4 > 5);
            return 0;
        }
      `,
      ausgabe: out`
        4
        3
        8
        0
      `,
      erklaerung: md`Gleiche Stufe von links: \`(10 − 4) − 2 = 4\` und \`(18 / 3) / 2 = 3\`. Dann \`10 % 4 = 2\`, \`2 · 3 = 6\`, plus 2 ergibt 8. Zuletzt: \`3 == 3\` ist 1, \`4 > 5\` ist 0, und \`1 && 0\` ist 0.`,
    },
    {
      id: 'k04-l05-u2',
      typ: 'fehlersuche',
      titel: 'Reihenschaltung und Parallelschaltung',
      stufe: 2,
      themen: ['rangfolge', 'operatoren'],
      aufgabe: md`
        Zwei Widerstände R1 = 100 Ω und R2 = 300 Ω. Der Gesamtwiderstand der Parallelschaltung ist R = (R1 · R2) / (R1 + R2). Das Programm rechnet falsch. Erwartet:

        ~~~text
        Parallel: 75.0 Ohm
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double r1 = 100.0, r2 = 300.0;
            double r = r1 * r2 / r1 + r2;
            printf("Parallel: %.1f Ohm\n", r);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            double r1 = 100.0, r2 = 300.0;
            double r = (r1 * r2) / (r1 + r2);
            printf("Parallel: %.1f Ohm\n", r);
            return 0;
        }
      `,
      tests: [{ name: 'Parallelschaltung', erwartet: { stdout: 'Parallel: 75.0 Ohm\n' } }],
      hinweise: [md`Der Nenner \`r1 + r2\` braucht Klammern.`],
    },
    {
      id: 'k04-l05-u3',
      typ: 'programm',
      titel: 'Kraft an einer schiefen Ebene',
      stufe: 3,
      themen: ['rangfolge', 'datentypen'],
      aufgabe: md`
        Ein Wagen mit der Masse m (kg) steht auf einer Rampe mit dem Winkel α (Grad). Die Hangabtriebskraft ist F = m · g · sin(α) mit g = 9.81 m/s². Lies m und α (beides Kommazahlen, in einem \`scanf\`) und gib F mit einer Nachkommastelle aus. Bei 120 und 30:

        ~~~text
        F = 588.6 N
        ~~~
      `,
      start: c`
        #include <stdio.h>
        #include <math.h>

        int main(void) {
            const double PI = 3.14159265358979;
            const double G = 9.81;
            double masse = 0.0, winkel = 0.0;

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <math.h>

        int main(void) {
            const double PI = 3.14159265358979;
            const double G = 9.81;
            double masse = 0.0, winkel = 0.0;

            scanf("%lf %lf", &masse, &winkel);
            double kraft = masse * G * sin(winkel * PI / 180.0);
            printf("F = %.1f N\n", kraft);
            return 0;
        }
      `,
      tests: [
        { name: '120 kg, 30 Grad', stdin: '120 30\n', erwartet: { stdout: 'F = 588.6 N\n' } },
        { name: '50 kg, 90 Grad', stdin: '50 90\n', erwartet: { stdout: 'F = 490.5 N\n' } },
        { name: '80 kg, 0 Grad', stdin: '80 0\n', erwartet: { stdout: 'F = 0.0 N\n' } },
      ],
      hinweise: [md`\`sin\` erwartet Bogenmass: \`winkel * PI / 180.0\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k04-l05-c1',
      typ: 'eingabe',
      themen: ['rangfolge'],
      frage: 'Welchen Wert hat `3 + 4 * 2`?',
      antworten: ['11'],
    },
    {
      id: 'k04-l05-c2',
      typ: 'wahrfalsch',
      themen: ['rangfolge'],
      aussage: 'In C berechnet `2 ^ 3` die Potenz zwei hoch drei.',
      richtig: false,
      erklaerung: '`^` ist das bitweise XOR. Potenzen mit `pow`.',
    },
    {
      id: 'k04-l05-c3',
      typ: 'auswahl',
      themen: ['rangfolge'],
      frage: 'Welcher Ausdruck berechnet (a + b) geteilt durch 2 korrekt?',
      optionen: [{ text: '`(a + b) / 2.0`', richtig: true }, { text: '`a + b / 2.0`', warum: 'Hier wird nur b halbiert.' }, { text: '`a + b / 2`', warum: 'Nur b wird geteilt, eventuell sogar ganzzahlig.' }],
    },
  ],
  zusammenfassung: [
    'Punkt vor Strich; Vergleiche vor `&&`, `&&` vor `||`; Zuweisung zuletzt.',
    'Gleiche Stufe meist von links nach rechts: `20 / 4 * 2` ist 10.',
    'Im Zweifel Klammern setzen, bei Brüchen immer um Zähler und Nenner.',
    '`<math.h>`: `sqrt`, `pow`, `fabs`, `sin`/`cos` (Bogenmass), `round`. `^` ist keine Potenz.',
  ],
  referenz: ['rangfolge', 'sqrt', 'pow', 'trig', 'fabs'],
};
