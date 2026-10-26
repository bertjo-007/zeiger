import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k06-l02',
  titel: 'Die do-while-Schleife',
  dauer: 20,
  stichwoerter: ['do', 'while', 'do-while', 'fussgesteuert', 'mindestens einmal', 'Menü', 'Eingabe wiederholen'],
  lernziele: [
    'eine Schleife mit `do … while` schreiben, die mindestens einmal läuft',
    'eine Eingabe so lange wiederholen, bis sie gültig ist',
    'ein einfaches Menü mit Schleife und `switch` aufbauen',
  ],
  erklaerung: md`
    Bei \`while\` wird zuerst geprüft und dann gearbeitet. Manchmal muss man aber **zuerst etwas tun**, um überhaupt prüfen zu können: Eine Eingabe muss erst gelesen werden, bevor man weiss, ob sie gültig ist. Dafür gibt es **\`do … while\`**:

    ~~~c
    do {
        printf("Sollwert (0 bis 100): ");
        scanf("%d", &soll);
    } while (soll < 0 || soll > 100);
    ~~~

    Der Block läuft **mindestens einmal**. Erst danach wird die Bedingung geprüft; ist sie wahr, geht es von vorne los. Diese Schleife heisst **fussgesteuert**.

    > [!achtung] Strichpunkt am Ende
    > Nach \`while (…)\` steht bei \`do … while\` ein Strichpunkt, anders als bei der normalen \`while\`-Schleife.

    ### Menüs

    Ein Bedienmenü wird angezeigt, eine Auswahl gelesen und ausgeführt, und das wiederholt sich, bis «Beenden» gewählt wird. Auch hier soll das Menü mindestens einmal erscheinen: ein typischer Fall für \`do … while\` zusammen mit \`switch\`.

    ### Ende der Eingabe beachten

    Kommt keine Eingabe mehr, liefert \`scanf\` \`EOF\`, und die Variable bleibt unverändert. Eine Schleife, die auf eine gültige Eingabe wartet, würde dann ewig weiterlaufen. Robuste Programme prüfen darum auch den Rückgabewert und brechen bei \`EOF\` ab.
  `,
  syntax: [
    {
      code: c`
        do {
            anweisungen;          // läuft mindestens einmal
        } while (bedingung);      // Strichpunkt!
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int soll = -1;
          int versuche = 0;

          do {
              printf("Drehzahl in Prozent (0-100): ");
              if (scanf("%d", &soll) != 1) {
                  printf("\nKeine gültige Eingabe, Abbruch\n");
                  return 1;
              }
              versuche++;
              if (soll < 0 || soll > 100) {
                  printf("%d ist ausserhalb des Bereichs\n", soll);
              }
          } while (soll < 0 || soll > 100);

          printf("Sollwert %d %% nach %d Versuch(en)\n", soll, versuche);
          return 0;
      }
    `,
    stdin: '150\n-5\n75\n',
    ausgabe: out`
      Drehzahl in Prozent (0-100): 150
      150 ist ausserhalb des Bereichs
      Drehzahl in Prozent (0-100): -5
      -5 ist ausserhalb des Bereichs
      Drehzahl in Prozent (0-100): 75
      Sollwert 75 % nach 3 Versuch(en)
    `,
  },
  zeilen: [
    { zeilen: '7', text: md`\`do\` leitet den Block ein. Er läuft auf jeden Fall einmal.` },
    { zeilen: '9-12', text: md`Ist die Eingabe zu Ende oder keine Zahl, bricht das Programm ab, statt ewig zu fragen.` },
    { zeilen: '14-16', text: md`Eine Rückmeldung, warum der Wert abgelehnt wurde.` },
    { zeilen: '17', text: md`Die Bedingung am Ende: Ist der Wert ungültig, wird wiederholt. Beachte den Strichpunkt.` },
  ],
  ergebnis: md`
    150 und −5 werden abgelehnt, 75 wird akzeptiert. Die Frage erscheint dreimal, die Schleife endet beim ersten gültigen Wert.
  `,
  fehler: [
    {
      titel: 'Strichpunkt vergessen',
      text: md`\`} while (x < 0)\` ohne \`;\` ist ein Syntaxfehler.`,
      falsch: c`} while (wert < 0)`,
      richtig: c`} while (wert < 0);`,
    },
    {
      titel: 'Endlos bei Ende der Eingabe',
      text: md`Ohne Prüfung des Rückgabewerts fragt die Schleife bei \`EOF\` oder einer ungültigen Eingabe immer weiter, weil die Variable ihren ungültigen Wert behält.`,
    },
  ],
  uebungen: [
    {
      id: 'k06-l02-u1',
      typ: 'vorhersage',
      titel: 'Mindestens einmal',
      stufe: 1,
      themen: ['schleifen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int n = 10;
            do {
                printf("%d\n", n);
                n++;
            } while (n < 5);
            return 0;
        }
      `,
      ausgabe: out`
        10
      `,
      erklaerung: md`Der Block läuft einmal, obwohl \`10 < 5\` von Anfang an falsch ist.`,
    },
    {
      id: 'k06-l02-u2',
      typ: 'programm',
      titel: 'PIN abfragen',
      stufe: 2,
      themen: ['schleifen', 'eingabe'],
      aufgabe: md`
        Frage mit \`do … while\` so lange eine Zahl ab, bis die richtige PIN 4711 eingegeben wird. Gib bei jeder falschen PIN \`falsch\` aus und am Schluss \`entsperrt nach <n> Versuchen\`. Bricht die Eingabe vorher ab (\`scanf\` liefert nicht 1), gib \`abgebrochen\` aus und ende mit Rückgabewert 1. Keine Eingabeaufforderung.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int pin = 0;
            int versuche = 0;

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int pin = 0;
            int versuche = 0;

            do {
                if (scanf("%d", &pin) != 1) {
                    printf("abgebrochen\n");
                    return 1;
                }
                versuche++;
                if (pin != 4711) {
                    printf("falsch\n");
                }
            } while (pin != 4711);
            printf("entsperrt nach %d Versuchen\n", versuche);
            return 0;
        }
      `,
      tests: [
        { name: 'Beim dritten Mal richtig', stdin: '1234\n0000\n4711\n', erwartet: { stdout: 'falsch\nfalsch\nentsperrt nach 3 Versuchen\n', exitCode: 0 } },
        { name: 'Sofort richtig', stdin: '4711\n', erwartet: { stdout: 'entsperrt nach 1 Versuchen\n' } },
        { name: 'Eingabe endet', stdin: '1\n2\n', erwartet: { stdout: 'falsch\nfalsch\nabgebrochen\n', exitCode: 1 }, tipp: md`Ohne Prüfung des Rückgabewerts hängt die Schleife hier endlos.` },
      ],
      regeln: [{ muss: '\\bdo\\b', meldung: 'Verwende eine `do … while`-Schleife.' }],
      hinweise: [md`Im Block: einlesen, prüfen ob \`scanf\` 1 liefert, zählen, bei falscher PIN Meldung.`],
    },
    {
      id: 'k06-l02-u3',
      typ: 'programm',
      titel: 'Bedienmenü',
      stufe: 3,
      themen: ['schleifen', 'switch'],
      aufgabe: md`
        Ein Lüfter hat eine Stufe von 0 bis 3, Start bei 0. Lies in einer \`do … while\`-Schleife Befehle (Zeichen): \`+\` erhöht die Stufe (höchstens 3), \`-\` verringert sie (mindestens 0), \`q\` beendet. Gib nach jedem \`+\` oder \`-\` aus: \`Stufe <n>\`. Unbekannte Zeichen ignorierst du. Bei Ende der Eingabe endet das Programm ebenfalls. Zum Schluss: \`Ende\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int stufe = 0;
            char befehl = ' ';

            printf("Ende\n");
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int stufe = 0;
            char befehl = ' ';

            do {
                if (scanf(" %c", &befehl) != 1) {
                    break;
                }
                switch (befehl) {
                    case '+':
                        if (stufe < 3) {
                            stufe++;
                        }
                        printf("Stufe %d\n", stufe);
                        break;
                    case '-':
                        if (stufe > 0) {
                            stufe--;
                        }
                        printf("Stufe %d\n", stufe);
                        break;
                    default:
                        break;
                }
            } while (befehl != 'q');
            printf("Ende\n");
            return 0;
        }
      `,
      tests: [
        { name: '+ + + + - q', stdin: '+ + + + - q\n', erwartet: { stdout: 'Stufe 1\nStufe 2\nStufe 3\nStufe 3\nStufe 2\nEnde\n' } },
        { name: '- x + q', stdin: '-\nx\n+\nq\n', erwartet: { stdout: 'Stufe 0\nStufe 1\nEnde\n' } },
        { name: 'Ohne q', stdin: '+ +\n', erwartet: { stdout: 'Stufe 1\nStufe 2\nEnde\n' } },
      ],
      hinweise: [md`Lies mit \`scanf(" %c", &befehl)\` und verlasse die Schleife mit \`break\`, wenn nichts mehr kommt.`, md`Ein \`switch\` über den Befehl, darin die Grenzen mit \`if\` prüfen.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k06-l02-c1',
      typ: 'auswahl',
      themen: ['schleifen'],
      frage: 'Wann ist `do … while` besser geeignet als `while`?',
      optionen: [{ text: 'Wenn der Block mindestens einmal laufen muss, z. B. für eine Eingabe', richtig: true }, { text: 'Wenn die Schleife eventuell gar nicht laufen soll' }, { text: 'Immer, weil sie schneller ist' }],
    },
    {
      id: 'k06-l02-c2',
      typ: 'wahrfalsch',
      themen: ['schleifen'],
      aussage: 'Nach `} while (bedingung)` steht bei `do … while` ein Strichpunkt.',
      richtig: true,
    },
    {
      id: 'k06-l02-c3',
      typ: 'eingabe',
      themen: ['schleifen'],
      frage: 'Wie oft läuft `int i = 5; do { i++; } while (i < 3);` durch?',
      antworten: ['1'],
    },
  ],
  zusammenfassung: [
    '`do { … } while (bedingung);` prüft erst nach dem Durchlauf; der Block läuft mindestens einmal.',
    'Typisch für Eingaben, die wiederholt werden, bis sie gültig sind, und für Menüs.',
    'Strichpunkt am Ende nicht vergessen.',
    'Bei Eingabeschleifen immer auch das Ende der Eingabe abfangen.',
  ],
  referenz: ['do-while'],
};
