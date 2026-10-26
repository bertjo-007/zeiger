import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k05-l02',
  titel: 'else, else if und verschachtelte Bedingungen',
  dauer: 25,
  stichwoerter: ['else', 'else if', 'verschachtelt', 'Kette', 'Stufen', 'Bereiche', 'dangling else', 'Schutzbedingung'],
  lernziele: [
    'mit `else` eine Alternative ausführen',
    'mit `else if` einen Wert in mehrere Bereiche einteilen',
    'Bedingungen verschachteln und dabei lesbar bleiben',
  ],
  erklaerung: md`
    ### else: sonst

    Oft gibt es zwei Möglichkeiten: Entweder die Bedingung ist wahr, oder eben nicht. Für den zweiten Fall gibt es **\`else\`**:

    ~~~c
    if (tank_voll) {
        printf("Pumpe aus\n");
    } else {
        printf("Pumpe an\n");
    }
    ~~~

    Genau **einer** der beiden Blöcke wird ausgeführt, nie beide und nie keiner.

    ### else if: mehrere Bereiche

    Soll ein Wert in mehr als zwei Fälle eingeteilt werden, hängt man Bedingungen mit **\`else if\`** aneinander. C prüft sie **von oben nach unten** und führt **nur den ersten** passenden Block aus. Der Rest wird übersprungen. Das abschliessende \`else\` fängt alles auf, was keine Bedingung erfüllt hat.

    ~~~c
    if (temperatur < 0) {
        stufe = 0;          // Frost
    } else if (temperatur < 20) {
        stufe = 1;          // kühl: 0 bis unter 20
    } else if (temperatur < 40) {
        stufe = 2;          // warm: 20 bis unter 40
    } else {
        stufe = 3;          // heiss: ab 40
    }
    ~~~

    Weil die Prüfung beim ersten Treffer endet, muss die zweite Bedingung nicht noch einmal \`temperatur >= 0\` prüfen: Das ist an dieser Stelle schon sicher. Die **Reihenfolge** ist deshalb entscheidend.

    ### Verschachteln

    Innerhalb eines Blocks darf wieder ein \`if\` stehen. Das braucht man, wenn eine Frage erst nach einer anderen Sinn ergibt:

    ~~~c
    if (motor_laeuft) {
        if (drehzahl > MAX) {
            printf("Überdrehzahl\n");
        }
    } else {
        printf("Motor steht\n");
    }
    ~~~

    Mehr als zwei, drei Ebenen werden schnell unübersichtlich. Oft lässt sich die Verschachtelung mit \`&&\` oder einer **Schutzbedingung** flach halten: Ungültige Fälle zuerst mit \`return\` abfangen, danach muss der restliche Code nicht mehr eingerückt werden.

    > [!achtung] Zu welchem if gehört das else?
    > Ein \`else\` gehört immer zum **nächsten offenen** \`if\` darüber, egal wie eingerückt ist. Mit konsequenten geschweiften Klammern gibt es dieses Problem («dangling else») nicht.
  `,
  syntax: [
    {
      code: c`
        if (bedingung1) {
            …
        } else if (bedingung2) {
            …
        } else {
            …   // keine Bedingung traf zu
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int fuellstand = 0;   // Prozent
          printf("Füllstand: ");
          if (scanf("%d", &fuellstand) != 1 || fuellstand < 0 || fuellstand > 100) {
              printf("Ungültiger Messwert\n");
              return 1;
          }

          if (fuellstand < 10) {
              printf("Kritisch leer, Anlage stoppen\n");
          } else if (fuellstand < 30) {
              printf("Niedrig, Nachfüllen anfordern\n");
          } else if (fuellstand <= 90) {
              printf("Normal\n");
          } else {
              printf("Fast voll, Zulauf drosseln\n");
          }
          return 0;
      }
    `,
    stdin: '24\n',
    ausgabe: out`
      Füllstand: 24
      Niedrig, Nachfüllen anfordern
    `,
  },
  zeilen: [
    { zeilen: '6-9', text: md`Schutzbedingung: Ungültige Eingaben werden zuerst abgefangen. Danach ist sicher, dass der Wert zwischen 0 und 100 liegt.` },
    { zeilen: '11-12', text: md`Erster Bereich: unter 10.` },
    { zeilen: '13-14', text: md`Wird nur geprüft, wenn der erste nicht zutraf. Hier ist also sicher \`fuellstand >= 10\`, und die Bedingung prüft nur noch die Obergrenze.` },
    { zeilen: '15-16', text: md`30 bis 90 einschliesslich.` },
    { zeilen: '17-18', text: md`\`else\` fängt den Rest auf: über 90.` },
  ],
  ergebnis: md`
    24 % liegt im zweiten Bereich. Probiere die Grenzwerte aus: 9, 10, 29, 30, 90 und 91. An den Grenzen sieht man, ob \`<\` oder \`<=\` richtig gewählt ist. Genau dort entstehen die meisten Fehler.
  `,
  fehler: [
    {
      titel: 'Falsche Reihenfolge',
      text: md`Steht der weiteste Bereich zuerst, werden die engeren nie erreicht. \`if (x < 30)\` vor \`else if (x < 10)\` macht den zweiten Fall unmöglich.`,
      falsch: c`
        if (x < 30) { niedrig(); }
        else if (x < 10) { kritisch(); }   // nie erreicht
      `,
      richtig: c`
        if (x < 10) { kritisch(); }
        else if (x < 30) { niedrig(); }
      `,
    },
    {
      titel: 'Mehrere if statt else if',
      text: md`Mit einzelnen \`if\` werden alle Bedingungen geprüft; bei überlappenden Bereichen erscheinen dann mehrere Meldungen. Für «genau eine von mehreren» gehört \`else if\` dazwischen.`,
    },
    {
      titel: 'Lücken an den Grenzen',
      text: md`\`if (t < 20) … else if (t > 20) …\` vergisst genau den Wert 20. Mit \`else\` am Ende oder durchgehend \`<\` an den Grenzen sind alle Werte abgedeckt.`,
    },
  ],
  uebungen: [
    {
      id: 'k05-l02-u1',
      typ: 'programm',
      titel: 'Gerade oder ungerade',
      stufe: 1,
      themen: ['bedingungen'],
      aufgabe: md`
        Lies eine ganze Zahl und gib \`gerade\` oder \`ungerade\` aus. Verwende \`if\` und \`else\`.
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

            if (n % 2 == 0) {
                printf("gerade\n");
            } else {
                printf("ungerade\n");
            }
            return 0;
        }
      `,
      tests: [
        { name: '8', stdin: '8\n', erwartet: { stdout: 'gerade\n' } },
        { name: '13', stdin: '13\n', erwartet: { stdout: 'ungerade\n' } },
        { name: '-7', stdin: '-7\n', erwartet: { stdout: 'ungerade\n' }, tipp: md`\`-7 % 2\` ist −1, nicht 1. Prüfe darum auf \`== 0\`.` },
        { name: '0', stdin: '0\n', erwartet: { stdout: 'gerade\n' } },
      ],
      regeln: [{ muss: '\\belse\\b', meldung: 'Verwende `else` für den zweiten Fall.' }],
      hinweise: [md`Prüfe \`n % 2 == 0\`. Warum ist \`n % 2 == 1\` bei negativen Zahlen falsch?`],
    },
    {
      id: 'k05-l02-u2',
      typ: 'programm',
      titel: 'Akkuanzeige',
      stufe: 2,
      themen: ['bedingungen'],
      aufgabe: md`
        Ein Akku mit 12 V Nennspannung wird nach seiner gemessenen Spannung (Kommazahl) eingestuft:

        | Spannung | Ausgabe |
        |---|---|
        | ab 12.6 | \`voll\` |
        | ab 12.2 bis unter 12.6 | \`gut\` |
        | ab 11.8 bis unter 12.2 | \`schwach\` |
        | unter 11.8 | \`leer\` |
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double u = 0.0;
            scanf("%lf", &u);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            double u = 0.0;
            scanf("%lf", &u);

            if (u >= 12.6) {
                printf("voll\n");
            } else if (u >= 12.2) {
                printf("gut\n");
            } else if (u >= 11.8) {
                printf("schwach\n");
            } else {
                printf("leer\n");
            }
            return 0;
        }
      `,
      tests: [
        { name: '12.8 V', stdin: '12.8\n', erwartet: { stdout: 'voll\n' } },
        { name: '12.6 V (Grenze)', stdin: '12.6\n', erwartet: { stdout: 'voll\n' } },
        { name: '12.3 V', stdin: '12.3\n', erwartet: { stdout: 'gut\n' } },
        { name: '11.8 V (Grenze)', stdin: '11.8\n', erwartet: { stdout: 'schwach\n' } },
        { name: '10.5 V', stdin: '10.5\n', erwartet: { stdout: 'leer\n' } },
      ],
      hinweise: [md`Beginne beim höchsten Bereich und arbeite dich mit \`else if\` nach unten.`],
    },
    {
      id: 'k05-l02-u3',
      typ: 'fehlersuche',
      titel: 'Lüfterstufen',
      stufe: 2,
      themen: ['bedingungen'],
      aufgabe: md`
        Ein Lüfter soll ab 30 Grad auf Stufe 1, ab 45 Grad auf Stufe 2 und ab 60 Grad auf Stufe 3 laufen, darunter auf Stufe 0. Das Programm zeigt bei 70 Grad aber Stufe 1. Bringe die Bedingungen in die richtige Reihenfolge.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int t = 0;
            scanf("%d", &t);
            int stufe = 0;
            if (t >= 30) {
                stufe = 1;
            } else if (t >= 45) {
                stufe = 2;
            } else if (t >= 60) {
                stufe = 3;
            }
            printf("Stufe %d\n", stufe);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int t = 0;
            scanf("%d", &t);
            int stufe = 0;
            if (t >= 60) {
                stufe = 3;
            } else if (t >= 45) {
                stufe = 2;
            } else if (t >= 30) {
                stufe = 1;
            }
            printf("Stufe %d\n", stufe);
            return 0;
        }
      `,
      tests: [
        { name: '70 Grad', stdin: '70\n', erwartet: { stdout: 'Stufe 3\n' } },
        { name: '50 Grad', stdin: '50\n', erwartet: { stdout: 'Stufe 2\n' } },
        { name: '30 Grad', stdin: '30\n', erwartet: { stdout: 'Stufe 1\n' } },
        { name: '20 Grad', stdin: '20\n', erwartet: { stdout: 'Stufe 0\n' } },
      ],
      hinweise: [md`70 ist auch grösser gleich 30. Welche Bedingung trifft darum zuerst zu?`],
    },
    {
      id: 'k05-l02-u4',
      typ: 'programm',
      titel: 'Zugangskontrolle',
      stufe: 3,
      themen: ['bedingungen', 'operatoren'],
      aufgabe: md`
        Lies einen Ausweis-Code (ganze Zahl) und eine Uhrzeit (Stunde 0 bis 23). Entscheide:

        - Code 1000 bis 1999 (Mitarbeitende): Zutritt von 6 bis 19 Uhr (Stunde 6 bis 19 einschliesslich), sonst \`ausserhalb der Zeit\`.
        - Code 9000 bis 9099 (Wartung): immer Zutritt.
        - alle anderen Codes: \`unbekannt\`.

        Ausgabe: \`Zutritt\`, \`ausserhalb der Zeit\` oder \`unbekannt\`. Eine Stunde ausserhalb von 0 bis 23 ergibt \`ungueltige Zeit\` (vor allen anderen Prüfungen).
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int code = 0, stunde = 0;
            scanf("%d %d", &code, &stunde);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int code = 0, stunde = 0;
            scanf("%d %d", &code, &stunde);

            if (stunde < 0 || stunde > 23) {
                printf("ungueltige Zeit\n");
            } else if (code >= 1000 && code <= 1999) {
                if (stunde >= 6 && stunde <= 19) {
                    printf("Zutritt\n");
                } else {
                    printf("ausserhalb der Zeit\n");
                }
            } else if (code >= 9000 && code <= 9099) {
                printf("Zutritt\n");
            } else {
                printf("unbekannt\n");
            }
            return 0;
        }
      `,
      tests: [
        { name: 'Mitarbeiter um 8 Uhr', stdin: '1234 8\n', erwartet: { stdout: 'Zutritt\n' } },
        { name: 'Mitarbeiter um 22 Uhr', stdin: '1234 22\n', erwartet: { stdout: 'ausserhalb der Zeit\n' } },
        { name: 'Mitarbeiter um 19 Uhr (Grenze)', stdin: '1999 19\n', erwartet: { stdout: 'Zutritt\n' } },
        { name: 'Wartung um 3 Uhr', stdin: '9050 3\n', erwartet: { stdout: 'Zutritt\n' } },
        { name: 'Unbekannter Code', stdin: '5000 10\n', erwartet: { stdout: 'unbekannt\n' } },
        { name: 'Ungültige Stunde', stdin: '1234 25\n', erwartet: { stdout: 'ungueltige Zeit\n' } },
      ],
      hinweise: [md`Prüfe zuerst die Zeit, dann die Code-Bereiche mit \`else if\`.`, md`Bei den Mitarbeitenden braucht es ein verschachteltes \`if\` für die Uhrzeit.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k05-l02-c1',
      typ: 'vorhersage',
      themen: ['bedingungen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int x = 25;
            if (x > 10) {
                printf("A\n");
            } else if (x > 20) {
                printf("B\n");
            } else {
                printf("C\n");
            }
            return 0;
        }
      `,
      ausgabe: out`
        A
      `,
      erklaerung: md`Nur der erste passende Zweig wird ausgeführt. 25 > 10 trifft zu, der Rest wird übersprungen.`,
    },
    {
      id: 'k05-l02-c2',
      typ: 'wahrfalsch',
      themen: ['bedingungen'],
      aussage: 'In einer `if`/`else if`/`else`-Kette kann höchstens ein Block ausgeführt werden.',
      richtig: true,
    },
    {
      id: 'k05-l02-c3',
      typ: 'auswahl',
      themen: ['bedingungen'],
      frage: 'Zu welchem `if` gehört ein `else` ohne geschweifte Klammern?',
      optionen: [{ text: 'Zum nächsten offenen `if` darüber', richtig: true }, { text: 'Zu dem `if`, das gleich weit eingerückt ist', warum: 'Die Einrückung ist dem Compiler egal.' }, { text: 'Immer zum ersten `if` der Funktion' }],
    },
  ],
  zusammenfassung: [
    '`if … else`: genau einer von zwei Blöcken wird ausgeführt.',
    '`else if`-Ketten werden von oben geprüft; nur der erste Treffer zählt. Reihenfolge beachten.',
    'Das abschliessende `else` fängt alle übrigen Fälle auf.',
    'Verschachtelung sparsam einsetzen; ungültige Fälle früh mit einer Schutzbedingung abfangen.',
    'Grenzwerte gezielt testen: dort entscheidet `<` oder `<=`.',
  ],
  referenz: ['if-else'],
};
