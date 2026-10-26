import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k02-l08',
  titel: 'Typumwandlung',
  dauer: 25,
  stichwoerter: ['Typumwandlung', 'Cast', 'implizit', 'explizit', '(double)', 'Ganzzahldivision', 'abschneiden', 'runden', 'round', 'Konvertierung', 'signed', 'unsigned'],
  lernziele: [
    'erklären, wann C Werte automatisch in einen anderen Typ umwandelt',
    'mit einem Cast wie `(double)` gezielt umwandeln',
    'typische Fehler durch Abschneiden und Ganzzahldivision vermeiden',
  ],
  erklaerung: md`
    In einer Rechnung stehen oft Werte verschiedener Typen: eine \`int\`-Anzahl und eine \`double\`-Länge, ein \`char\` und eine Zahl. C wandelt sie dann um. Wer weiss, wie, vermeidet einige der häufigsten Rechenfehler.

    ### Automatische (implizite) Umwandlung

    **In Rechnungen** wird der «kleinere» Typ zum «grösseren» erweitert, bevor gerechnet wird:

    - \`int\` mit \`double\` ergibt \`double\`: \`3 * 1.5\` ist \`4.5\`;
    - \`char\` und \`short\` werden in Rechnungen immer mindestens zu \`int\`.

    **Bei einer Zuweisung** wird der Wert in den Typ der Variable links umgewandelt:

    - \`double\` → \`int\`: Die Nachkommastellen werden **abgeschnitten**, nicht gerundet. \`int x = 3.99;\` ergibt 3. Clang warnt bei Konstanten.
    - Ein zu grosser Wert in einem kleinen Typ: Er wird abgeschnitten, wie beim Überlauf von \`uint8_t\`.

    ### Die Falle Ganzzahldivision

    Die Umwandlung passiert **erst, wenn ein \`double\` beteiligt ist**. Bei \`int / int\` wird ganzzahlig gerechnet, auch wenn das Ergebnis danach in einer \`double\`-Variable landet:

    ~~~c
    int summe = 17, anzahl = 4;
    double mittel = summe / anzahl;          // 4.0, nicht 4.25!
    ~~~

    ### Explizite Umwandlung: der Cast

    Mit einem **Cast**, dem Zieltyp in Klammern vor einem Wert, wandelst du gezielt um:

    ~~~c
    double mittel = (double)summe / anzahl;  // 4.25
    ~~~

    Der Cast wirkt nur auf den Wert direkt dahinter: \`summe\` wird zu 17.0, danach ist die Division eine Kommazahl-Division. \`(double)(summe / anzahl)\` wäre dagegen zu spät: Die Ganzzahldivision ist dann schon passiert.

    ### Runden statt abschneiden

    Für echtes Runden gibt es \`round\` aus \`<math.h>\`: \`round(3.6)\` ist 4.0, \`round(-2.5)\` ist −3.0. Das Ergebnis ist ein \`double\`; braucht man eine ganze Zahl, castet man danach: \`(int)round(x)\`.

    > [!achtung] signed und unsigned mischen
    > Vergleicht man eine negative \`int\` mit einer \`unsigned\`-Zahl, wird die \`int\` zu \`unsigned\` umgewandelt: Aus −1 wird 4 294 967 295. \`-1 < 1u\` ist deshalb **falsch**. Clang warnt mit \`-Wsign-compare\`. Am sichersten ist, Vorzeichen-Typen nicht zu mischen.
  `,
  syntax: [
    {
      code: c`
        (zieltyp) wert

        double d = (double)7 / 2;    // 3.5
        int i = (int)3.99;           // 3 (abgeschnitten)
        int r = (int)round(3.6);     // 4 (gerundet, braucht <math.h>)
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <math.h>

      int main(void) {
          int summe = 17;          // Summe von vier Messwerten
          int anzahl = 4;

          double falsch = summe / anzahl;
          double richtig = (double)summe / anzahl;
          printf("Mittel falsch: %.2f, richtig: %.2f\n", falsch, richtig);

          double prozent = 100.0 * 3 / 8;
          int abgeschnitten = (int)prozent;
          int gerundet = (int)round(prozent);
          printf("%.1f %% wird zu %d (abgeschnitten) oder %d (gerundet)\n", prozent, abgeschnitten, gerundet);

          char ziffer = '5';
          int wert = ziffer - '0';
          printf("Zeichen %c als Zahl: %d\n", ziffer, wert);
          return 0;
      }
    `,
    ausgabe: out`
      Mittel falsch: 4.00, richtig: 4.25
      37.5 % wird zu 37 (abgeschnitten) oder 38 (gerundet)
      Zeichen 5 als Zahl: 5
    `,
  },
  zeilen: [
    { zeilen: '8', text: md`\`17 / 4\` sind zwei \`int\`: Ergebnis 4. Erst danach wird es zu 4.0.` },
    { zeilen: '9', text: md`Der Cast macht \`summe\` zu 17.0, darum wird mit Kommazahlen geteilt: 4.25.` },
    { zeilen: '12', text: md`\`100.0\` ist ein \`double\`. Von links nach rechts: 100.0 · 3 = 300.0, dann / 8 = 37.5.` },
    { zeilen: '13-14', text: md`\`(int)\` schneidet ab, \`round\` rundet zuerst kaufmännisch.` },
    { zeilen: '17-18', text: md`Auch \`char\` und \`int\` werden umgewandelt: Das Zeichen \`'5'\` wird in der Rechnung zur Zahl 53, minus 48 ergibt 5.` },
  ],
  ergebnis: md`
    Die erste Zeile zeigt den klassischen Fehler: 4.00 statt 4.25. Die zweite zeigt den Unterschied zwischen Abschneiden und Runden. Probiere aus, \`100.0\` im Beispiel durch \`100\` zu ersetzen: Dann rechnet die ganze Zeile mit Ganzzahlen, und es kommt 37.0 heraus.
  `,
  fehler: [
    {
      titel: 'Cast zu spät',
      text: md`\`(double)(a / b)\` wandelt erst nach der Ganzzahldivision um. Der Rest ist dann schon verloren. Den Cast an einen der Operanden setzen.`,
      falsch: c`double q = (double)(7 / 2);   // 3.0`,
      richtig: c`double q = (double)7 / 2;     // 3.5`,
    },
    {
      titel: 'Abschneiden statt runden',
      text: md`\`(int)2.9\` ist 2. Wer z. B. eine Anzahl Kisten aus einer Kommazahl berechnet, bekommt so einen zu kleinen Wert. Mit \`round\` runden oder bewusst entscheiden.`,
    },
    {
      titel: 'Zu kleiner Zieltyp',
      text: md`Ein \`int\` mit 300 in einen \`uint8_t\` geschrieben ergibt 44 (300 − 256). C meldet dabei keinen Fehler. Zieltypen mit genug Platz wählen.`,
    },
  ],
  uebungen: [
    {
      id: 'k02-l08-u1',
      typ: 'vorhersage',
      titel: 'Was kommt heraus?',
      stufe: 1,
      themen: ['typumwandlung'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int a = 9, b = 2;
            double x = a / b;
            double y = (double)a / b;
            int z = (int)3.99;
            printf("%.1f %.1f %d\n", x, y, z);
            return 0;
        }
      `,
      ausgabe: out`
        4.0 4.5 3
      `,
    },
    {
      id: 'k02-l08-u2',
      typ: 'fehlersuche',
      titel: 'Auslastung in Prozent',
      stufe: 2,
      themen: ['typumwandlung'],
      aufgabe: md`
        Von 600 Plätzen eines Lagers sind 457 belegt. Das Programm soll die Auslastung mit einer Nachkommastelle ausgeben, zeigt aber 0.0 an. Korrigiere es mit einem Cast, ohne die Variablentypen zu ändern.

        ~~~text
        Auslastung: 76.2 %
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int belegt = 457;
            int plaetze = 600;
            double auslastung = belegt / plaetze * 100;
            printf("Auslastung: %.1f %%\n", auslastung);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int belegt = 457;
            int plaetze = 600;
            double auslastung = (double)belegt / plaetze * 100;
            printf("Auslastung: %.1f %%\n", auslastung);
            return 0;
        }
      `,
      tests: [{ name: 'Auslastung stimmt', erwartet: { stdout: 'Auslastung: 76.2 %\n' } }],
      regeln: [
        { muss: '\\(\\s*double\\s*\\)', meldung: 'Löse es mit einem Cast `(double)`.' },
        { muss: 'int\\s+belegt[\\s\\S]*int\\s+plaetze', meldung: 'Lass die Variablen vom Typ `int`.' },
      ],
      hinweise: [md`\`457 / 600\` ist als Ganzzahldivision 0.`, md`Setze \`(double)\` vor \`belegt\`.`],
    },
    {
      id: 'k02-l08-u3',
      typ: 'programm',
      titel: 'Paletten bestellen',
      stufe: 3,
      themen: ['typumwandlung'],
      aufgabe: md`
        Für 1250 Kartons werden Paletten gebraucht; auf eine Palette passen 48 Kartons. Gib aus, wie viele Paletten rechnerisch gefüllt werden (als Kommazahl mit 2 Stellen), wie viele **ganz voll** sind und wie viele man **bestellen** muss (aufgerundet):

        ~~~text
        Rechnerisch: 26.04 Paletten
        Ganz voll: 26
        Bestellen: 27
        ~~~

        Für das Aufrunden gibt es \`ceil\` aus \`<math.h>\`, das wie \`round\` funktioniert, aber immer aufrundet.
      `,
      start: c`
        #include <stdio.h>
        #include <math.h>

        int main(void) {
            int kartons = 1250;
            int pro_palette = 48;

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <math.h>

        int main(void) {
            int kartons = 1250;
            int pro_palette = 48;

            double rechnerisch = (double)kartons / pro_palette;
            int voll = kartons / pro_palette;
            int bestellen = (int)ceil(rechnerisch);
            printf("Rechnerisch: %.2f Paletten\n", rechnerisch);
            printf("Ganz voll: %d\n", voll);
            printf("Bestellen: %d\n", bestellen);
            return 0;
        }
      `,
      tests: [{ name: 'Alle drei Werte', erwartet: { stdout: 'Rechnerisch: 26.04 Paletten\nGanz voll: 26\nBestellen: 27\n' } }],
      hinweise: [md`Für «ganz voll» ist die Ganzzahldivision genau richtig.`, md`\`ceil\` liefert einen \`double\`; mit \`(int)\` wird daraus eine ganze Zahl.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k02-l08-c1',
      typ: 'auswahl',
      themen: ['typumwandlung'],
      frage: 'Welchen Wert hat `int x = 7.9;` danach?',
      optionen: [{ text: '7', richtig: true, warum: 'Bei der Umwandlung in `int` werden die Nachkommastellen abgeschnitten.' }, { text: '8', warum: 'C rundet hier nicht, es schneidet ab.' }, { text: 'Der Compiler meldet einen Fehler.', warum: 'Höchstens eine Warnung; übersetzt wird es.' }],
    },
    {
      id: 'k02-l08-c2',
      typ: 'eingabe',
      themen: ['typumwandlung'],
      frage: 'Welcher Wert steht nach `double q = (double)(5 / 2);` in `q`? (als Zahl mit Punkt)',
      antworten: ['2.0', '2', '2.00'],
    },
    {
      id: 'k02-l08-c3',
      typ: 'wahrfalsch',
      themen: ['typumwandlung'],
      aussage: 'In der Rechnung `3 * 1.5` wird die `3` automatisch zu `3.0` umgewandelt.',
      richtig: true,
    },
  ],
  zusammenfassung: [
    'In Rechnungen mit gemischten Typen wird zum grösseren Typ erweitert (`int` mit `double` ergibt `double`).',
    'Bei der Zuweisung an `int` werden Nachkommastellen abgeschnitten.',
    '`int / int` bleibt ganzzahlig. Den Cast `(double)` an einen Operanden setzen, nicht ums Ergebnis.',
    'Runden mit `round`, Aufrunden mit `ceil` aus `<math.h>`.',
    '`signed` und `unsigned` nicht mischen: −1 wird sonst zu einer riesigen Zahl.',
  ],
  referenz: ['cast', 'round'],
};
