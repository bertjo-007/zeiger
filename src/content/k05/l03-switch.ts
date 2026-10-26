import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k05-l03',
  titel: 'switch und case',
  dauer: 25,
  stichwoerter: ['switch', 'case', 'break', 'default', 'Fallthrough', 'Mehrfachauswahl', 'Menü', 'Befehl'],
  lernziele: [
    'eine Mehrfachauswahl mit `switch`, `case` und `default` schreiben',
    'die Rolle von `break` erklären und mehrere Fälle gezielt zusammenfassen',
    'entscheiden, wann `switch` und wann eine `if`-Kette besser passt',
  ],
  erklaerung: md`
    Wenn ein einzelner Wert mit vielen **festen** Möglichkeiten verglichen wird, etwa ein Befehlsbuchstabe oder eine Menünummer, ist **\`switch\`** übersichtlicher als eine lange \`else if\`-Kette:

    ~~~c
    switch (befehl) {
        case 'S':
            printf("Start\n");
            break;
        case 'H':
            printf("Halt\n");
            break;
        default:
            printf("Unbekannter Befehl\n");
            break;
    }
    ~~~

    - In den Klammern steht der Wert, der verglichen wird. Er muss eine **ganze Zahl** sein; dazu zählen auch \`char\` und Aufzählungen (\`enum\`, Kapitel 11).
    - Jedes \`case\` nennt einen **konstanten** Wert. Das Programm springt zu dem \`case\`, das passt.
    - **\`default\`** fängt alle Werte ab, für die es kein \`case\` gibt, wie das \`else\` am Ende einer Kette.

    ### break nicht vergessen

    \`switch\` ist eine Sprungtabelle: Es springt zum passenden \`case\` und läuft von dort **weiter nach unten**, bis ein **\`break\`** kommt oder der Block endet. Fehlt das \`break\`, werden auch die Anweisungen der folgenden Fälle ausgeführt. Das nennt man **Fallthrough**.

    Gezielt eingesetzt ist das praktisch, um mehrere Werte zusammenzufassen:

    ~~~c
    case 'h':
    case 'H':
        printf("Halt\n");
        break;
    ~~~

    Unabsichtlich ist es ein häufiger Fehler. Schreibe deshalb nach jedem Fall ein \`break\`, auch nach dem letzten.

    ### Grenzen von switch

    - Keine **Bereiche**: \`case 1 ... 5:\` ist kein Standard-C. Bereiche prüfst du mit \`if\`.
    - Keine **Kommazahlen** und keine **Zeichenketten** als Fälle.
    - Die \`case\`-Werte müssen zur Übersetzungszeit feststehen: Zahlen, Zeichen, \`enum\`-Konstanten, aber keine Variablen.

    > [!praxis] Befehle über die serielle Schnittstelle
    > Ein Mikrocontroller empfängt einen Buchstaben und reagiert darauf: \`'F'\` vorwärts, \`'B'\` rückwärts, \`'S'\` stopp. Ein \`switch\` über das empfangene Zeichen ist dafür die klassische Lösung, zum Beispiel für ein ferngesteuertes Fahrzeug.
  `,
  syntax: [
    {
      code: c`
        switch (ausdruck) {
            case WERT1:
                anweisungen;
                break;
            case WERT2:
            case WERT3:          // zwei Werte, gleiche Aktion
                anweisungen;
                break;
            default:
                anweisungen;
                break;
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          char befehl = '?';
          printf("Befehl (F/B/L/R/S): ");
          scanf(" %c", &befehl);

          switch (befehl) {
              case 'F':
              case 'f':
                  printf("Fahrzeug fährt vorwärts\n");
                  break;
              case 'B':
              case 'b':
                  printf("Fahrzeug fährt rückwärts\n");
                  break;
              case 'L':
              case 'R':
                  printf("Lenkung: %c\n", befehl);
                  break;
              case 'S':
                  printf("Stopp\n");
                  break;
              default:
                  printf("Unbekannter Befehl '%c'\n", befehl);
                  break;
          }
          return 0;
      }
    `,
    stdin: 'b\n',
    ausgabe: out`
      Befehl (F/B/L/R/S): b
      Fahrzeug fährt rückwärts
    `,
  },
  zeilen: [
    { zeilen: '8', text: md`Der Wert von \`befehl\`, ein Zeichen und damit eine kleine Zahl, wird mit den Fällen verglichen.` },
    { zeilen: '9-12', text: md`Zwei Fälle teilen sich eine Aktion: \`'F'\` hat keine eigenen Anweisungen und «fällt» zu \`'f'\` durch. So funktionieren Gross- und Kleinbuchstaben.` },
    { zeilen: '17-20', text: md`Auch hier zwei Fälle zusammengefasst; die Ausgabe zeigt, welcher es war.` },
    { zeilen: '24-26', text: md`\`default\` reagiert auf alles andere, zum Beispiel einen Tippfehler.` },
  ],
  ergebnis: md`
    Der Kleinbuchstabe \`b\` landet bei «rückwärts». Probiere \`L\`, \`S\` und \`x\`. Entferne dann im Beispiel das \`break\` nach «rückwärts» und gib \`b\` ein: Jetzt erscheint auch die Lenkungsmeldung, weil das Programm in den nächsten Fall durchläuft.
  `,
  fehler: [
    {
      titel: 'break vergessen',
      text: md`Ohne \`break\` läuft die Ausführung in den nächsten Fall weiter. Clang kann mit \`-Wimplicit-fallthrough\` davor warnen.`,
      falsch: c`
        case 1:
            printf("Stufe 1\n");
        case 2:
            printf("Stufe 2\n");
            break;
      `,
      richtig: c`
        case 1:
            printf("Stufe 1\n");
            break;
        case 2:
            printf("Stufe 2\n");
            break;
      `,
    },
    {
      titel: 'Bereiche in case',
      text: md`\`case x > 10:\` ist kein Bereich, sondern vergleicht mit dem Wert 0 oder 1. Für Bereiche gibt es \`if\`.`,
    },
    {
      titel: 'Text in case',
      text: md`\`case "start":\` ist nicht erlaubt. Für Texte vergleicht man mit \`strcmp\` in einer \`if\`-Kette (Kapitel 8).`,
    },
  ],
  uebungen: [
    {
      id: 'k05-l03-u1',
      typ: 'vorhersage',
      titel: 'Durchgefallen',
      stufe: 1,
      themen: ['switch'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int stufe = 2;
            switch (stufe) {
                case 1:
                    printf("eins\n");
                case 2:
                    printf("zwei\n");
                case 3:
                    printf("drei\n");
                    break;
                default:
                    printf("andere\n");
            }
            return 0;
        }
      `,
      ausgabe: out`
        zwei
        drei
      `,
      erklaerung: md`Das Programm springt zu \`case 2\`. Weil dort das \`break\` fehlt, läuft es in \`case 3\` weiter und stoppt erst beim \`break\`.`,
    },
    {
      id: 'k05-l03-u2',
      typ: 'programm',
      titel: 'Betriebsarten',
      stufe: 2,
      themen: ['switch'],
      aufgabe: md`
        Lies eine Ziffer für die Betriebsart ein und gib den Namen aus. Verwende \`switch\`:

        | Eingabe | Ausgabe |
        |---|---|
        | 0 | \`Aus\` |
        | 1 | \`Hand\` |
        | 2 | \`Automatik\` |
        | 3 oder 4 | \`Service\` |
        | sonst | \`Ungueltig\` |
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int modus = 0;
            scanf("%d", &modus);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int modus = 0;
            scanf("%d", &modus);

            switch (modus) {
                case 0:
                    printf("Aus\n");
                    break;
                case 1:
                    printf("Hand\n");
                    break;
                case 2:
                    printf("Automatik\n");
                    break;
                case 3:
                case 4:
                    printf("Service\n");
                    break;
                default:
                    printf("Ungueltig\n");
                    break;
            }
            return 0;
        }
      `,
      tests: [
        { name: '0', stdin: '0\n', erwartet: { stdout: 'Aus\n' } },
        { name: '2', stdin: '2\n', erwartet: { stdout: 'Automatik\n' } },
        { name: '3', stdin: '3\n', erwartet: { stdout: 'Service\n' } },
        { name: '4', stdin: '4\n', erwartet: { stdout: 'Service\n' } },
        { name: '7', stdin: '7\n', erwartet: { stdout: 'Ungueltig\n' } },
      ],
      regeln: [{ muss: '\\bswitch\\b', meldung: 'Löse die Aufgabe mit `switch`.' }],
      hinweise: [md`Für 3 und 4 zwei \`case\`-Marken direkt untereinander.`, md`Nach jedem Fall ein \`break\`.`],
    },
    {
      id: 'k05-l03-u3',
      typ: 'fehlersuche',
      titel: 'Zu viele Meldungen',
      stufe: 2,
      themen: ['switch'],
      aufgabe: md`
        Je nach Fehlercode soll **genau eine** Meldung erscheinen. Bei Code 1 erscheinen aber drei. Korrigiere das Programm.

        | Code | Meldung |
        |---|---|
        | 1 | \`Sensor fehlt\` |
        | 2 | \`Kabelbruch\` |
        | sonst | \`Unbekannt\` |
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int code = 0;
            scanf("%d", &code);
            switch (code) {
                case 1:
                    printf("Sensor fehlt\n");
                case 2:
                    printf("Kabelbruch\n");
                default:
                    printf("Unbekannt\n");
            }
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int code = 0;
            scanf("%d", &code);
            switch (code) {
                case 1:
                    printf("Sensor fehlt\n");
                    break;
                case 2:
                    printf("Kabelbruch\n");
                    break;
                default:
                    printf("Unbekannt\n");
                    break;
            }
            return 0;
        }
      `,
      tests: [
        { name: 'Code 1', stdin: '1\n', erwartet: { stdout: 'Sensor fehlt\n' } },
        { name: 'Code 2', stdin: '2\n', erwartet: { stdout: 'Kabelbruch\n' } },
        { name: 'Code 9', stdin: '9\n', erwartet: { stdout: 'Unbekannt\n' } },
      ],
      hinweise: [md`Nach jedem Fall fehlt dasselbe Wort.`],
    },
    {
      id: 'k05-l03-u4',
      typ: 'programm',
      titel: 'Taschenrechner für die Werkstatt',
      stufe: 3,
      themen: ['switch', 'eingabe', 'operatoren'],
      aufgabe: md`
        Lies eine Rechnung der Form \`Zahl Operator Zahl\` ein, z. B. \`12.5 * 4\` (Kommazahlen, Operator als Zeichen). Berechne sie mit \`switch\` über den Operator (\`+\`, \`-\`, \`*\`, \`/\`) und gib das Ergebnis mit zwei Nachkommastellen aus: \`= 50.00\`.

        Sonderfälle: Bei Division durch 0 gib \`Fehler: Division durch 0\` aus, bei einem unbekannten Operator \`Fehler: Operator\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double a = 0.0, b = 0.0;
            char op = '?';
            scanf("%lf %c %lf", &a, &op, &b);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            double a = 0.0, b = 0.0;
            char op = '?';
            scanf("%lf %c %lf", &a, &op, &b);

            switch (op) {
                case '+':
                    printf("= %.2f\n", a + b);
                    break;
                case '-':
                    printf("= %.2f\n", a - b);
                    break;
                case '*':
                    printf("= %.2f\n", a * b);
                    break;
                case '/':
                    if (b == 0.0) {
                        printf("Fehler: Division durch 0\n");
                    } else {
                        printf("= %.2f\n", a / b);
                    }
                    break;
                default:
                    printf("Fehler: Operator\n");
                    break;
            }
            return 0;
        }
      `,
      tests: [
        { name: '12.5 * 4', stdin: '12.5 * 4\n', erwartet: { stdout: '= 50.00\n' } },
        { name: '10 / 4', stdin: '10 / 4\n', erwartet: { stdout: '= 2.50\n' } },
        { name: '3 - 7.5', stdin: '3 - 7.5\n', erwartet: { stdout: '= -4.50\n' } },
        { name: 'Division durch 0', stdin: '5 / 0\n', erwartet: { stdout: 'Fehler: Division durch 0\n' } },
        { name: 'Unbekannter Operator', stdin: '5 x 2\n', erwartet: { stdout: 'Fehler: Operator\n' } },
      ],
      regeln: [{ muss: '\\bswitch\\b', meldung: 'Verwende `switch` über den Operator.' }],
      hinweise: [md`Vier \`case\`-Zweige mit Zeichenkonstanten wie \`'+'\` und ein \`default\`.`, md`Im Fall \`'/'\` brauchst du zusätzlich ein \`if\` für den Teiler 0.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k05-l03-c1',
      typ: 'auswahl',
      themen: ['switch'],
      frage: 'Wofür steht `default` in einem `switch`?',
      optionen: [{ text: 'Für alle Werte, für die es kein passendes `case` gibt', richtig: true }, { text: 'Für den ersten Fall' }, { text: 'Für den Wert 0' }],
    },
    {
      id: 'k05-l03-c2',
      typ: 'wahrfalsch',
      themen: ['switch'],
      aussage: '`switch` kann auch Kommazahlen und Zeichenketten vergleichen.',
      richtig: false,
      erklaerung: 'Nur ganzzahlige Werte wie `int`, `char` und `enum`.',
    },
    {
      id: 'k05-l03-c3',
      typ: 'eingabe',
      themen: ['switch'],
      frage: 'Welches Schlüsselwort beendet einen Fall, damit nicht in den nächsten weitergelaufen wird?',
      antworten: ['break'],
    },
  ],
  zusammenfassung: [
    '`switch` vergleicht einen ganzzahligen Wert mit festen `case`-Werten.',
    'Nach jedem Fall `break`, sonst läuft das Programm in den nächsten Fall weiter.',
    'Mehrere `case`-Marken untereinander fassen Werte mit gleicher Aktion zusammen.',
    '`default` behandelt alle übrigen Werte. Für Bereiche, Kommazahlen und Texte `if` verwenden.',
  ],
  referenz: ['switch', 'break'],
};
