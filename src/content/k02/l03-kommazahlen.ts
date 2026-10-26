import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k02-l03',
  titel: 'Kommazahlen: float und double',
  dauer: 25,
  stichwoerter: ['float', 'double', 'Gleitkommazahl', 'Kommazahl', '%f', '%.2f', '%e', 'Rundungsfehler', 'Genauigkeit', 'Dezimalpunkt', 'fabs'],
  lernziele: [
    'Kommazahlen in `float` und `double` speichern und mit `%f` ausgeben',
    'die Anzahl Nachkommastellen bei der Ausgabe festlegen',
    'erklären, warum Kommazahlen nicht exakt sind und wie man sie richtig vergleicht',
  ],
  erklaerung: md`
    Für Werte mit Nachkommastellen, etwa Temperaturen, Spannungen oder Längen, gibt es die **Gleitkommatypen**:

    | Typ | Grösse | Genauigkeit | Konstante |
    |---|---|---|---|
    | \`float\` | 4 Byte | etwa 7 Stellen | \`21.5f\` |
    | \`double\` | 8 Byte | etwa 15 Stellen | \`21.5\` |

    In C schreibt man Kommazahlen mit **Punkt**: \`3.14\`, nicht \`3,14\`. Eine Konstante wie \`3.14\` ist automatisch ein \`double\`. Mit dem Anhang \`f\` wird sie ein \`float\`.

    Im Zweifel nimm **\`double\`**. \`float\` lohnt sich nur, wo Speicher knapp ist oder die Hardware nur \`float\` schnell rechnet, wie bei vielen Mikrocontrollern mit FPU.

    ### Ausgabe

    - \`%f\` gibt eine Kommazahl mit **6** Nachkommastellen aus: \`27.730000\`.
    - \`%.2f\` begrenzt auf 2 Nachkommastellen und **rundet**: \`27.73\`.
    - \`%e\` zeigt die Exponentialschreibweise: \`2.773000e+01\`, praktisch für sehr grosse oder sehr kleine Werte.

    \`%f\` funktioniert für \`float\` und \`double\`, weil \`float\` bei der Übergabe an \`printf\` automatisch zu \`double\` wird. Beim Einlesen mit \`scanf\` ist das anders (Kapitel 3).

    ### Kommazahlen sind nicht exakt

    Der Computer speichert Zahlen im Binärsystem. Viele Dezimalzahlen wie 0,1 lassen sich dort nur annähernd darstellen, so wie 1/3 im Dezimalsystem 0,3333… ist. Darum ergibt \`0.1 + 0.2\` nicht genau \`0.3\`, sondern \`0.30000000000000004\`.

    Für Messwerte spielt das meist keine Rolle. Problematisch wird es beim **Vergleichen**: \`if (summe == 0.3)\` kann falsch sein, obwohl der Wert praktisch 0,3 ist. Man prüft stattdessen, ob der Unterschied klein genug ist:

    ~~~c
    if (fabs(summe - 0.3) < 1e-9) { … }   // fabs aus <math.h>: Betrag
    ~~~

    > [!praxis] Geld und Zähler
    > Für Geldbeträge rechnet man in der Praxis oft in **Rappen** mit ganzen Zahlen (\`int\`), damit keine Rundungsfehler entstehen. Auch Stückzahlen und Impulse sind immer ganze Zahlen.
  `,
  syntax: [
    {
      code: c`
        double spannung = 11.8;
        float temperatur = 21.5f;
        printf("%f\n", spannung);     // 11.800000
        printf("%.1f\n", temperatur); // 21.5
        printf("%e\n", 0.00042);      // 4.200000e-04
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          double spannung = 11.8;     // Volt
          double strom = 2.35;        // Ampere
          float temperatur = 21.5f;   // Grad Celsius

          double leistung = spannung * strom;
          printf("Leistung: %f W\n", leistung);
          printf("Leistung: %.2f W\n", leistung);
          printf("Temperatur: %.1f Grad\n", temperatur);
          printf("0.1 + 0.2 = %.17f\n", 0.1 + 0.2);
          return 0;
      }
    `,
    ausgabe: out`
      Leistung: 27.730000 W
      Leistung: 27.73 W
      Temperatur: 21.5 Grad
      0.1 + 0.2 = 0.30000000000000004
    `,
  },
  zeilen: [
    { zeilen: '4-6', text: md`Zwei \`double\` und ein \`float\`. Das \`f\` hinter \`21.5\` macht die Konstante zum \`float\`.` },
    { zeilen: '8', text: md`Die Leistung P = U · I. Das Ergebnis wird direkt in einer neuen Variable gespeichert.` },
    { zeilen: '9-10', text: md`Ohne Angabe zeigt \`%f\` sechs Nachkommastellen, mit \`%.2f\` zwei.` },
    { zeilen: '11', text: md`Auch \`float\` wird mit \`%f\` ausgegeben.` },
    { zeilen: '12', text: md`Mit 17 Nachkommastellen sieht man den winzigen Rundungsfehler von \`0.1 + 0.2\`.` },
  ],
  ergebnis: md`
    Die Leistung erscheint einmal mit sechs und einmal mit zwei Nachkommastellen. Die letzte Zeile zeigt, dass \`0.1 + 0.2\` nicht exakt 0,3 ist. Mit \`%.2f\` wäre davon nichts zu sehen; der Fehler ist nur bei Vergleichen gefährlich.
  `,
  fehler: [
    {
      titel: 'Komma statt Punkt',
      text: md`\`3,5\` ist in C keine Kommazahl. Das Komma trennt Werte, darum versucht der Compiler, nach \`3\` eine zweite Variable namens \`5\` zu deklarieren, und meldet einen Fehler.`,
      falsch: c`double laenge = 3,5;`,
      richtig: c`double laenge = 3.5;`,
    },
    {
      titel: '%d für eine Kommazahl',
      text: md`\`%d\` erwartet eine ganze Zahl. Mit einem \`double\` kommt eine sinnlose Zahl heraus. Clang warnt: «format specifies type 'int' but the argument has type 'double'».`,
      falsch: c`printf("%d\n", 2.5);`,
      richtig: c`printf("%.1f\n", 2.5);`,
    },
    {
      titel: 'Ganzzahlen geteilt',
      text: md`Teilt man zwei ganze Zahlen, ist das Ergebnis ganzzahlig, der Rest fällt weg. Daran ändert auch eine \`double\`-Variable links nichts. Mindestens ein Wert muss eine Kommazahl sein.`,
      falsch: c`double mittel = 7 / 2;    // 3.0`,
      richtig: c`double mittel = 7.0 / 2;  // 3.5`,
    },
    {
      titel: 'Kommazahlen mit == vergleichen',
      text: md`Wegen der Rundungsfehler kann \`a == b\` falsch sein, obwohl beide praktisch gleich sind. Vergleiche mit einer kleinen Toleranz.`,
      falsch: c`if (0.1 + 0.2 == 0.3)`,
      richtig: c`if (fabs((0.1 + 0.2) - 0.3) < 1e-9)`,
    },
  ],
  uebungen: [
    {
      id: 'k02-l03-u1',
      typ: 'vorhersage',
      titel: 'Ganzzahl oder Kommazahl?',
      stufe: 1,
      themen: ['datentypen', 'typumwandlung'],
      code: c`
        #include <stdio.h>

        int main(void) {
            double a = 7 / 2;
            double b = 7.0 / 2;
            printf("%.1f %.1f\n", a, b);
            return 0;
        }
      `,
      ausgabe: out`
        3.0 3.5
      `,
      erklaerung: md`\`7 / 2\` sind zwei ganze Zahlen: Ergebnis 3, erst danach wird es zu 3.0. Bei \`7.0 / 2\` ist ein Wert ein \`double\`, also wird mit Komma gerechnet.`,
    },
    {
      id: 'k02-l03-u2',
      typ: 'programm',
      titel: 'Kreisfläche',
      stufe: 1,
      themen: ['datentypen', 'format'],
      aufgabe: md`
        Ein runder Tank hat einen Radius von 0.75 m. Berechne die Grundfläche A = π · r² mit \`double\` und gib sie mit **drei** Nachkommastellen aus. Für π verwendest du \`3.14159265\`.

        ~~~text
        Fläche: 1.767 m2
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double radius = 0.75;

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            double radius = 0.75;
            double pi = 3.14159265;
            double flaeche = pi * radius * radius;
            printf("Fläche: %.3f m2\n", flaeche);
            return 0;
        }
      `,
      tests: [{ name: 'Fläche mit drei Nachkommastellen', erwartet: { stdout: 'Fläche: 1.767 m2\n' } }],
      hinweise: [md`r² schreibst du als \`radius * radius\`.`, md`Drei Nachkommastellen: \`%.3f\`.`],
    },
    {
      id: 'k02-l03-u3',
      typ: 'fehlersuche',
      titel: 'Durchschnittstemperatur',
      stufe: 2,
      themen: ['datentypen', 'format'],
      aufgabe: md`
        Drei Temperaturfühler liefern 21.4, 22.1 und 20.9 Grad. Das Programm soll den Mittelwert mit einer Nachkommastelle ausgeben, enthält aber zwei Fehler.

        ~~~text
        Mittelwert: 21.5 Grad
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double t1 = 21.4, t2 = 22.1, t3 = 20,9;
            double mittel = (t1 + t2 + t3) / 3;
            printf("Mittelwert: %d Grad\n", mittel);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            double t1 = 21.4, t2 = 22.1, t3 = 20.9;
            double mittel = (t1 + t2 + t3) / 3;
            printf("Mittelwert: %.1f Grad\n", mittel);
            return 0;
        }
      `,
      tests: [{ name: 'Mittelwert mit einer Nachkommastelle', erwartet: { stdout: 'Mittelwert: 21.5 Grad\n' } }],
      hinweise: [md`Eine der Zahlen ist mit Komma statt Punkt geschrieben.`, md`Welcher Platzhalter passt zu \`double\` mit einer Nachkommastelle?`],
    },
    {
      id: 'k02-l03-u4',
      typ: 'programm',
      titel: 'Bremsweg',
      stufe: 3,
      themen: ['datentypen', 'format'],
      aufgabe: md`
        Ein Förderwagen fährt mit v = 1.8 m/s und bremst mit a = 0.6 m/s². Der Bremsweg ist s = v² / (2 · a), die Bremszeit t = v / a. Gib beide Werte mit zwei Nachkommastellen aus:

        ~~~text
        Bremsweg: 2.70 m
        Bremszeit: 3.00 s
        ~~~
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
            double v = 1.8;   // m/s
            double a = 0.6;   // m/s^2
            double s = (v * v) / (2 * a);
            double t = v / a;
            printf("Bremsweg: %.2f m\n", s);
            printf("Bremszeit: %.2f s\n", t);
            return 0;
        }
      `,
      tests: [{ name: 'Bremsweg und Bremszeit', erwartet: { stdout: 'Bremsweg: 2.70 m\nBremszeit: 3.00 s\n' } }],
      hinweise: [md`Klammern helfen: \`(v * v) / (2 * a)\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k02-l03-c1',
      typ: 'auswahl',
      themen: ['datentypen'],
      frage: 'Welcher Typ hat die Konstante `2.5` ohne Anhang?',
      optionen: [{ text: '`double`', richtig: true }, { text: '`float`', warum: 'Dafür bräuchte es `2.5f`.' }, { text: '`int`', warum: 'Ein Dezimalpunkt macht sie zur Gleitkommazahl.' }],
    },
    {
      id: 'k02-l03-c2',
      typ: 'eingabe',
      themen: ['format'],
      frage: 'Welcher Platzhalter gibt eine Kommazahl mit genau zwei Nachkommastellen aus?',
      antworten: ['%.2f', '%.2lf'],
      exakt: true,
    },
    {
      id: 'k02-l03-c3',
      typ: 'wahrfalsch',
      themen: ['datentypen'],
      aussage: '`0.1 + 0.2 == 0.3` ist in C immer wahr.',
      richtig: false,
      erklaerung: '0,1 und 0,2 lassen sich binär nicht exakt darstellen. Die Summe ist 0.30000000000000004.',
    },
  ],
  zusammenfassung: [
    '`double` (8 Byte, ~15 Stellen) ist die Standardwahl, `float` (4 Byte, ~7 Stellen) spart Speicher.',
    'Kommazahlen schreibt man mit Punkt; `2.5f` ist ein `float`, `2.5` ein `double`.',
    '`%f` gibt 6 Nachkommastellen aus, `%.2f` rundet auf zwei, `%e` zeigt die Exponentialschreibweise.',
    'Kommazahlen sind nicht exakt: nie mit `==` vergleichen, sondern mit einer Toleranz.',
    'Ganzzahl geteilt durch Ganzzahl ergibt eine Ganzzahl, auch wenn links `double` steht.',
  ],
  referenz: ['double', 'float', 'fmt-f'],
};
