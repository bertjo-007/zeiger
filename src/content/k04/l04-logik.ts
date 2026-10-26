import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k04-l04',
  titel: 'Logische Operatoren',
  dauer: 25,
  stichwoerter: ['logisch', '&&', '||', '!', 'und', 'oder', 'nicht', 'Kurzschluss', 'Wahrheitstabelle', 'De Morgan', 'Freigabe', 'Verriegelung'],
  lernziele: [
    'Bedingungen mit `&&` (und), `||` (oder) und `!` (nicht) verknüpfen',
    'Wahrheitstabellen lesen und Bereichsprüfungen formulieren',
    'die Kurzschlussauswertung nutzen, etwa um eine Division durch 0 zu verhindern',
  ],
  erklaerung: md`
    Eine Maschine darf nur anlaufen, wenn der Not-Aus **nicht** gedrückt ist **und** die Schutztür zu ist **und** entweder der Automatikbetrieb **oder** der Tippbetrieb gewählt ist. Solche zusammengesetzten Bedingungen baust du mit den **logischen Operatoren**.

    | Operator | Bedeutung | wahr, wenn … |
    |---|---|---|
    | \`a && b\` | und | **beide** wahr sind |
    | \`a \|\| b\` | oder | **mindestens einer** wahr ist |
    | \`!a\` | nicht | \`a\` falsch ist |

    ### Wahrheitstabelle

    | a | b | \`a && b\` | \`a \|\| b\` | \`!a\` |
    |---|---|---|---|---|
    | 0 | 0 | 0 | 0 | 1 |
    | 0 | 1 | 0 | 1 | 1 |
    | 1 | 0 | 0 | 1 | 0 |
    | 1 | 1 | 1 | 1 | 0 |

    ### Rangfolge

    \`!\` bindet am stärksten, dann \`&&\`, dann \`||\`. Wie Punkt vor Strich gilt also «und vor oder». Setze im Zweifel Klammern, das macht die Absicht klar:

    ~~~c
    bool freigabe = !not_aus && tuer_zu && (automatik || tippbetrieb);
    ~~~

    ### Kurzschlussauswertung

    C wertet von links nach rechts aus und **hört auf, sobald das Ergebnis feststeht**:

    - Bei \`a && b\`: Ist \`a\` falsch, wird \`b\` gar nicht mehr ausgewertet.
    - Bei \`a || b\`: Ist \`a\` wahr, wird \`b\` gar nicht mehr ausgewertet.

    Das ist nützlich, um gefährliche Rechnungen zu schützen:

    ~~~c
    if (anzahl != 0 && summe / anzahl > 10) …   // keine Division durch 0
    ~~~

    ### Die Regeln von De Morgan

    Manchmal will man eine Bedingung umkehren. Dabei gilt:

    - \`!(a && b)\` ist dasselbe wie \`!a || !b\`
    - \`!(a || b)\` ist dasselbe wie \`!a && !b\`

    «Nicht im Bereich 10 bis 20» ist also \`!(t >= 10 && t <= 20)\`, gleichbedeutend mit \`t < 10 || t > 20\`.

    > [!praxis] Logik wie in der SPS
    > In der Steuerungstechnik heissen diese Verknüpfungen UND, ODER und NICHT, im Kontaktplan Reihen- und Parallelschaltung. Die Logik ist dieselbe: Eine Freigabe ist eine UND-Verknüpfung aller Sicherheitsbedingungen.
  `,
  syntax: [
    {
      code: c`
        bedingung1 && bedingung2     // und
        bedingung1 || bedingung2     // oder
        !bedingung                   // nicht
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdbool.h>

      int main(void) {
          bool not_aus_gedrueckt = false;
          bool tuer_zu = true;
          bool automatik = false;
          bool tippbetrieb = true;

          bool freigabe = !not_aus_gedrueckt && tuer_zu && (automatik || tippbetrieb);
          printf("Freigabe: %d\n", freigabe);

          int temperatur = 72;
          bool im_bereich = temperatur >= 20 && temperatur <= 70;
          bool ausserhalb = temperatur < 20 || temperatur > 70;
          printf("Im Bereich: %d, ausserhalb: %d\n", im_bereich, ausserhalb);

          int teile = 0, gewicht = 120;
          bool schwer = teile != 0 && gewicht / teile > 50;
          printf("Durchschnitt schwer: %d\n", schwer);
          return 0;
      }
    `,
    ausgabe: out`
      Freigabe: 1
      Im Bereich: 0, ausserhalb: 1
      Durchschnitt schwer: 0
    `,
  },
  zeilen: [
    { zeilen: '10', text: md`Alle Sicherheitsbedingungen mit UND, die Betriebsart mit ODER in Klammern. \`!\` kehrt «Not-Aus gedrückt» um.` },
    { zeilen: '14', text: md`Bereichsprüfung: grösser gleich 20 **und** kleiner gleich 70.` },
    { zeilen: '15', text: md`Das Gegenteil: kleiner als 20 **oder** grösser als 70 (De Morgan).` },
    { zeilen: '19', text: md`Kurzschluss: Weil \`teile != 0\` falsch ist, wird die Division gar nicht ausgeführt. Ohne diesen Schutz käme es zu einer Division durch 0.` },
  ],
  ergebnis: md`
    Die Freigabe ist 1, weil der Not-Aus nicht gedrückt, die Tür zu und der Tippbetrieb gewählt ist. 72 Grad liegen ausserhalb von 20 bis 70. In der letzten Zeile verhindert die Kurzschlussauswertung einen Absturz: Vertausche zum Test die beiden Teile der Bedingung und führe das Programm aus.
  `,
  fehler: [
    {
      titel: '& und | statt && und ||',
      text: md`Einfache \`&\` und \`|\` sind **Bitoperatoren**. Sie liefern bei 0/1-Werten oft zufällig dasselbe, werten aber immer beide Seiten aus, und bei anderen Zahlen kommt Unsinn heraus. Für Bedingungen immer \`&&\` und \`||\`.`,
      falsch: c`if (tuer_zu & motor_bereit)`,
      richtig: c`if (tuer_zu && motor_bereit)`,
    },
    {
      titel: 'Und und oder verwechselt',
      text: md`«Temperatur unter 0 **und** über 100» ist nie wahr. Im Deutschen sagt man oft «und», wo logisch «oder» gemeint ist. Prüfe die Bedingung mit zwei, drei Beispielwerten.`,
    },
    {
      titel: 'Fehlende Klammern bei gemischtem && und ||',
      text: md`\`a || b && c\` heisst \`a || (b && c)\`. War \`(a || b) && c\` gemeint, sind Klammern Pflicht. Clang warnt hier mit \`-Wlogical-op-parentheses\`.`,
    },
  ],
  uebungen: [
    {
      id: 'k04-l04-u1',
      typ: 'vorhersage',
      titel: 'Logik auswerten',
      stufe: 1,
      themen: ['operatoren'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int a = 1, b = 0, c = 1;
            printf("%d %d %d %d\n", a && b, a || b, !c, !(a && c) || b);
            return 0;
        }
      `,
      ausgabe: out`
        0 1 0 0
      `,
      erklaerung: md`\`a && b\` ist 0, \`a || b\` ist 1, \`!c\` ist 0. \`a && c\` ist 1, also \`!(…)\` 0, und \`0 || b\` ist 0.`,
    },
    {
      id: 'k04-l04-u2',
      typ: 'programm',
      titel: 'Zweihandbedienung',
      stufe: 2,
      themen: ['operatoren', 'eingabe'],
      aufgabe: md`
        Eine Presse darf nur auslösen, wenn **beide** Taster gedrückt sind **und** das Lichtgitter **nicht** unterbrochen ist. Lies drei Werte (je 0 oder 1, in dieser Reihenfolge): linker Taster, rechter Taster, Lichtgitter unterbrochen. Gib \`Auslösen: 1\` oder \`Auslösen: 0\` aus.
      `,
      start: c`
        #include <stdio.h>
        #include <stdbool.h>

        int main(void) {
            int links = 0, rechts = 0, gitter = 0;
            scanf("%d %d %d", &links, &rechts, &gitter);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdbool.h>

        int main(void) {
            int links = 0, rechts = 0, gitter = 0;
            scanf("%d %d %d", &links, &rechts, &gitter);

            bool ausloesen = links && rechts && !gitter;
            printf("Auslösen: %d\n", ausloesen);
            return 0;
        }
      `,
      tests: [
        { name: 'Beide Taster, Gitter frei', stdin: '1 1 0\n', erwartet: { stdout: 'Auslösen: 1\n' } },
        { name: 'Nur links', stdin: '1 0 0\n', erwartet: { stdout: 'Auslösen: 0\n' } },
        { name: 'Beide Taster, Gitter unterbrochen', stdin: '1 1 1\n', erwartet: { stdout: 'Auslösen: 0\n' } },
        { name: 'Nichts gedrückt', stdin: '0 0 0\n', erwartet: { stdout: 'Auslösen: 0\n' } },
      ],
      hinweise: [md`Drei Bedingungen, alle mit UND verknüpft.`, md`«Lichtgitter **nicht** unterbrochen» ist \`!gitter\`.`],
    },
    {
      id: 'k04-l04-u3',
      typ: 'luecke',
      titel: 'Bereich umkehren',
      stufe: 2,
      themen: ['operatoren'],
      frage: 'Beide Variablen sollen dasselbe bedeuten: «Drehzahl nicht zwischen 800 und 1500 (einschliesslich)». Ergänze nach De Morgan.',
      code: c`
        #include <stdio.h>

        int main(void) {
            int n = 1600;
            int a = !(n >= 800 && n <= 1500);
            int b = n __1__ 800 __2__ n __3__ 1500;
            printf("%d %d\n", a, b);
            return 0;
        }
      `,
      luecken: [['<'], ['||'], ['>']],
      ausgabe: '1 1\n',
    },
    {
      id: 'k04-l04-u4',
      typ: 'fehlersuche',
      titel: 'Alarm, der nie kommt',
      stufe: 2,
      themen: ['operatoren'],
      aufgabe: md`
        Ein Alarm soll ausgelöst werden, wenn der Füllstand unter 10 % **oder** über 90 % liegt. Das Programm zeigt aber nie einen Alarm. Bei 95 soll \`Alarm: 1\` erscheinen, bei 50 \`Alarm: 0\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int prozent = 0;
            scanf("%d", &prozent);
            int alarm = prozent < 10 && prozent > 90;
            printf("Alarm: %d\n", alarm);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int prozent = 0;
            scanf("%d", &prozent);
            int alarm = prozent < 10 || prozent > 90;
            printf("Alarm: %d\n", alarm);
            return 0;
        }
      `,
      tests: [
        { name: '95 %', stdin: '95\n', erwartet: { stdout: 'Alarm: 1\n' } },
        { name: '5 %', stdin: '5\n', erwartet: { stdout: 'Alarm: 1\n' } },
        { name: '50 %', stdin: '50\n', erwartet: { stdout: 'Alarm: 0\n' } },
      ],
      hinweise: [md`Kann eine Zahl gleichzeitig kleiner als 10 und grösser als 90 sein?`],
    },
  ],
  wissenscheck: [
    {
      id: 'k04-l04-c1',
      typ: 'auswahl',
      themen: ['operatoren'],
      frage: 'Wann ist `a || b` falsch?',
      optionen: [{ text: 'Nur wenn `a` und `b` beide falsch sind', richtig: true }, { text: 'Wenn einer von beiden falsch ist', warum: 'Das gilt für `&&`.' }, { text: 'Wenn beide wahr sind' }],
    },
    {
      id: 'k04-l04-c2',
      typ: 'wahrfalsch',
      themen: ['operatoren'],
      aussage: 'Bei `x != 0 && 10 / x > 2` wird die Division nicht ausgeführt, wenn `x` gleich 0 ist.',
      richtig: true,
      erklaerung: 'Kurzschlussauswertung: Ist die linke Seite von `&&` falsch, steht das Ergebnis fest.',
    },
    {
      id: 'k04-l04-c3',
      typ: 'auswahl',
      themen: ['operatoren'],
      frage: 'Was ist gleichbedeutend mit `!(a && b)`?',
      optionen: [{ text: '`!a || !b`', richtig: true }, { text: '`!a && !b`', warum: 'Das ist `!(a || b)`.' }, { text: '`a || b`' }],
    },
  ],
  zusammenfassung: [
    '`&&` (und) ist wahr, wenn beide Seiten wahr sind; `||` (oder), wenn mindestens eine wahr ist; `!` kehrt um.',
    'Rangfolge: `!` vor `&&` vor `||`. Klammern machen die Absicht klar.',
    'Kurzschluss: Die rechte Seite wird nur ausgewertet, wenn sie das Ergebnis noch ändern kann.',
    'De Morgan: `!(a && b)` ist `!a || !b`, `!(a || b)` ist `!a && !b`.',
  ],
  referenz: ['op-logik'],
};
