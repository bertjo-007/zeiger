import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k05-l04',
  titel: 'Der ternäre Operator',
  dauer: 15,
  stichwoerter: ['ternär', '?:', 'Bedingungsoperator', 'Kurzform', 'Minimum', 'Maximum', 'Begrenzung', 'clamp'],
  lernziele: [
    'den Bedingungsoperator `?:` lesen und schreiben',
    'mit ihm zwischen zwei Werten wählen, etwa für Minimum, Maximum oder einen Ausgabetext',
    'erkennen, wann ein `if` lesbarer ist',
  ],
  erklaerung: md`
    Oft hängt nur ein **Wert** von einer Bedingung ab: der grössere von zwei Messwerten, der Text «an» oder «aus», eine Begrenzung auf ein Maximum. Mit \`if\`/\`else\` braucht das vier Zeilen:

    ~~~c
    int groesser;
    if (a > b) {
        groesser = a;
    } else {
        groesser = b;
    }
    ~~~

    Der **Bedingungsoperator** \`?:\`, auch **ternärer Operator** genannt (weil er drei Teile hat), macht daraus einen Ausdruck:

    ~~~c
    int groesser = (a > b) ? a : b;
    ~~~

    Lies ihn so: «Ist \`a > b\`? Dann \`a\`, sonst \`b\`.» Es wird immer nur **einer** der beiden Werte ausgewertet.

    ### Typische Einsätze

    - **Minimum und Maximum:** \`(a < b) ? a : b\`
    - **Begrenzen** auf einen Bereich: \`(x > MAX) ? MAX : x\`
    - **Text auswählen** in \`printf\`:

    ~~~c
    printf("Pumpe %s\n", laeuft ? "an" : "aus");
    ~~~

    - **Einzahl und Mehrzahl:** \`printf("%d Teil%s\n", n, n == 1 ? "" : "e");\`

    ### Wann lieber if?

    Der Operator ist für die Auswahl eines **Werts** gedacht. Sobald Aktionen ausgeführt werden oder mehrere Bedingungen ineinander geschachtelt sind, ist \`if\` lesbarer. Verschachtelte Ausdrücke wie \`a ? b ? c : d : e\` sind gültig, aber kaum noch zu verstehen.

    > [!tipp] Klammern setzen
    > \`?:\` hat eine sehr niedrige Rangfolge. Klammern um die Bedingung und um den ganzen Ausdruck schaden nie, etwa in \`summe + (bonus ? 10 : 0)\`.
  `,
  syntax: [
    {
      code: c`
        ergebnis = (bedingung) ? wert_wenn_wahr : wert_wenn_falsch;
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdbool.h>

      int main(void) {
          int links = 1180, rechts = 1215;    // Drehzahlen zweier Räder
          const int MAX_PWM = 255;
          int pwm_wunsch = 300;
          bool motor_an = true;
          int fehler = 1;

          int hoechste = (links > rechts) ? links : rechts;
          int pwm = (pwm_wunsch > MAX_PWM) ? MAX_PWM : pwm_wunsch;

          printf("Höchste Drehzahl: %d\n", hoechste);
          printf("PWM begrenzt auf %d\n", pwm);
          printf("Motor %s\n", motor_an ? "an" : "aus");
          printf("%d Fehler%s gefunden\n", fehler, fehler == 1 ? "" : "s");
          return 0;
      }
    `,
    ausgabe: out`
      Höchste Drehzahl: 1215
      PWM begrenzt auf 255
      Motor an
      1 Fehler gefunden
    `,
  },
  zeilen: [
    { zeilen: '11', text: md`Maximum zweier Werte in einer Zeile.` },
    { zeilen: '12', text: md`Begrenzung: Ist der Wunsch grösser als das Maximum, wird das Maximum genommen.` },
    { zeilen: '16', text: md`\`?:\` wählt einen Text, der direkt an \`%s\` geht.` },
    { zeilen: '17', text: md`Bei genau einem Fehler kein Anhang, sonst ein «s». Probiere \`fehler = 3\`.` },
  ],
  ergebnis: md`
    Das rechte Rad dreht schneller, der PWM-Wunsch von 300 wird auf 255 begrenzt, und die Texte passen sich den Werten an. Ändere \`motor_an\` auf \`false\` und \`fehler\` auf 0.
  `,
  fehler: [
    {
      titel: 'Für Aktionen missbraucht',
      text: md`\`laeuft ? starte() : stoppe();\` ist zwar möglich, aber schwer lesbar. Für Aktionen ist \`if\`/\`else\` gemacht.`,
    },
    {
      titel: 'Zu tief verschachtelt',
      text: md`\`t < 0 ? "Frost" : t < 20 ? "kühl" : "warm"\` funktioniert, ist aber eine Kette, die als \`if\`/\`else if\` klarer wäre.`,
    },
    {
      titel: 'Klammern vergessen',
      text: md`\`summe + bonus ? 10 : 0\` heisst \`(summe + bonus) ? 10 : 0\`, weil \`?:\` schwächer bindet als \`+\`.`,
      falsch: c`int punkte = summe + bonus ? 10 : 0;`,
      richtig: c`int punkte = summe + (bonus ? 10 : 0);`,
    },
  ],
  uebungen: [
    {
      id: 'k05-l04-u1',
      typ: 'vorhersage',
      titel: 'Was wird gewählt?',
      stufe: 1,
      themen: ['bedingungen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int a = 4, b = 9;
            int m = (a < b) ? a : b;
            printf("%d %s\n", m, (b % 2 == 0) ? "gerade" : "ungerade");
            return 0;
        }
      `,
      ausgabe: out`
        4 ungerade
      `,
    },
    {
      id: 'k05-l04-u2',
      typ: 'erweitern',
      titel: 'Aus vier Zeilen wird eine',
      stufe: 2,
      themen: ['bedingungen'],
      aufgabe: md`
        Ersetze das \`if\`/\`else\` durch **einen** Ausdruck mit \`?:\`. Die Ausgabe bleibt gleich.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int temperatur = 0;
            scanf("%d", &temperatur);
            int luefter;
            if (temperatur > 40) {
                luefter = 100;
            } else {
                luefter = 30;
            }
            printf("Lüfter %d %%\n", luefter);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int temperatur = 0;
            scanf("%d", &temperatur);
            int luefter = (temperatur > 40) ? 100 : 30;
            printf("Lüfter %d %%\n", luefter);
            return 0;
        }
      `,
      tests: [
        { name: '55 Grad', stdin: '55\n', erwartet: { stdout: 'Lüfter 100 %\n' } },
        { name: '25 Grad', stdin: '25\n', erwartet: { stdout: 'Lüfter 30 %\n' } },
      ],
      regeln: [
        { muss: '\\?', meldung: 'Verwende den Operator `?:`.' },
        { darfNicht: '\\bif\\b|\\belse\\b', meldung: 'Entferne `if` und `else`.' },
      ],
      hinweise: [md`\`int luefter = (temperatur > 40) ? 100 : 30;\``],
    },
    {
      id: 'k05-l04-u3',
      typ: 'programm',
      titel: 'Wert begrenzen',
      stufe: 3,
      themen: ['bedingungen'],
      aufgabe: md`
        Ein Servomotor darf nur Winkel von 0 bis 180 Grad anfahren. Lies einen gewünschten Winkel (ganze Zahl) und begrenze ihn mit **zwei** \`?:\`-Ausdrücken auf diesen Bereich: zuerst nach unten auf 0, dann nach oben auf 180. Gib aus: \`Winkel: <wert>\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int winkel = 0;
            scanf("%d", &winkel);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int winkel = 0;
            scanf("%d", &winkel);

            winkel = (winkel < 0) ? 0 : winkel;
            winkel = (winkel > 180) ? 180 : winkel;
            printf("Winkel: %d\n", winkel);
            return 0;
        }
      `,
      tests: [
        { name: '90', stdin: '90\n', erwartet: { stdout: 'Winkel: 90\n' } },
        { name: '-15', stdin: '-15\n', erwartet: { stdout: 'Winkel: 0\n' } },
        { name: '200', stdin: '200\n', erwartet: { stdout: 'Winkel: 180\n' } },
        { name: '180', stdin: '180\n', erwartet: { stdout: 'Winkel: 180\n' } },
      ],
      regeln: [{ muss: '\\?[\\s\\S]*\\?', meldung: 'Verwende zwei `?:`-Ausdrücke.' }],
      hinweise: [md`Erster Schritt: \`winkel = (winkel < 0) ? 0 : winkel;\``],
    },
  ],
  wissenscheck: [
    {
      id: 'k05-l04-c1',
      typ: 'auswahl',
      themen: ['bedingungen'],
      frage: 'Was liefert `(x > 0) ? x : -x`?',
      optionen: [{ text: 'Den Betrag von x', richtig: true }, { text: 'Immer x' }, { text: 'Immer -x' }],
    },
    {
      id: 'k05-l04-c2',
      typ: 'eingabe',
      themen: ['bedingungen'],
      frage: 'Welchen Wert hat `(7 % 2 == 0) ? 10 : 20`?',
      antworten: ['20'],
    },
    {
      id: 'k05-l04-c3',
      typ: 'wahrfalsch',
      themen: ['bedingungen'],
      aussage: 'Bei `?:` werden immer beide Werte ausgewertet.',
      richtig: false,
      erklaerung: 'Nur der gewählte Wert wird ausgewertet.',
    },
  ],
  zusammenfassung: [
    '`(bedingung) ? a : b` liefert `a`, wenn die Bedingung wahr ist, sonst `b`.',
    'Ideal für die Auswahl eines Werts: Minimum, Maximum, Begrenzung, Text für `%s`.',
    'Für Aktionen und längere Ketten ist `if` lesbarer.',
    'Klammern setzen: `?:` bindet sehr schwach.',
  ],
  referenz: ['ternaer'],
};
