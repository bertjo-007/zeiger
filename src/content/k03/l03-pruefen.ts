import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k03-l03',
  titel: 'Eingaben prüfen',
  dauer: 25,
  stichwoerter: ['Rückgabewert', 'scanf', 'Eingabe prüfen', 'Validierung', 'EOF', 'if', 'Bereich', 'ungültige Eingabe', 'Plausibilität'],
  lernziele: [
    'mit dem Rückgabewert von `scanf` erkennen, ob eine Eingabe gelesen werden konnte',
    'eingelesene Werte auf einen gültigen Bereich prüfen',
    'bei ungültigen Eingaben sauber mit einer Meldung und einem Fehlercode reagieren',
  ],
  erklaerung: md`
    Menschen vertippen sich. Statt «12» kommt «l2», statt einer Temperatur ein Wort, statt 0 bis 100 der Wert 1000. Ein Programm, das Eingaben ungeprüft verwendet, rechnet dann mit Unsinn weiter, oder schlimmer: Eine Steuerung fährt einen Motor auf eine unmögliche Position. **Jede Eingabe wird geprüft.**

    ### Der Rückgabewert von scanf

    \`scanf\` gibt zurück, **wie viele Werte es erfolgreich gelesen hat**:

    | Aufruf | Eingabe | Rückgabe |
    |---|---|---|
    | \`scanf("%d", &x)\` | \`42\` | 1 |
    | \`scanf("%d", &x)\` | \`abc\` | 0 (x bleibt unverändert) |
    | \`scanf("%d %d", &a, &b)\` | \`5 x\` | 1 (nur a gelesen) |
    | \`scanf("%d", &x)\` | Ende der Eingabe | \`EOF\` (meist −1) |

    Erwartest du einen Wert, prüfst du also, ob der Rückgabewert genau 1 ist.

    ### Vorgriff: Entscheiden mit if

    Für die Prüfung braucht es eine Entscheidung: «**Wenn** die Eingabe ungültig ist, **dann** Meldung ausgeben und abbrechen.» In C heisst das \`if\`. Kapitel 5 behandelt es ausführlich; für den Moment genügt diese Form:

    ~~~c
    if (scanf("%d", &anzahl) != 1) {
        printf("Fehler: keine Zahl\n");
        return 1;
    }
    ~~~

    Die Bedingung steht in runden Klammern. \`!=\` heisst «ungleich». Ist die Bedingung erfüllt, wird der Block in geschweiften Klammern ausgeführt, sonst übersprungen. \`return 1;\` in \`main\` beendet das Programm mit einem Fehlercode.

    ### Bereich prüfen

    Eine gelesene Zahl ist noch nicht unbedingt **plausibel**. Eine Füllhöhe von −5 cm oder ein Prozentwert von 250 sind Zahlen, aber keine sinnvollen Werte. Mit \`<\` und \`>\` und dem Wort \`||\` («oder») prüfst du den Bereich:

    ~~~c
    if (prozent < 0 || prozent > 100) {
        printf("Fehler: 0 bis 100 erwartet\n");
        return 1;
    }
    ~~~

    > [!tipp] Fehlermeldungen, die helfen
    > Eine gute Fehlermeldung sagt, **was** falsch war und **was** erwartet wird: «Fehler: Drehzahl 5000 ist zu hoch (höchstens 3200).» Fehlermeldungen schreibt man üblicherweise mit \`fprintf(stderr, …)\` auf die Fehlerausgabe. In Zeiger erscheint sie rot.

    > [!praxis] Plausibilität in Steuerungen
    > In der Automation prüft man nicht nur Benutzereingaben, sondern auch Sensorwerte. Ein Temperaturfühler, der plötzlich −273 Grad meldet, ist vermutlich defekt. Die Steuerung soll dann in einen sicheren Zustand gehen, statt weiterzuheizen.
  `,
  syntax: [
    {
      code: c`
        if (scanf("%d", &wert) != 1) {
            fprintf(stderr, "Fehler: keine gültige Zahl\n");
            return 1;
        }
        if (wert < MIN || wert > MAX) {
            fprintf(stderr, "Fehler: ausserhalb des Bereichs\n");
            return 1;
        }
      `,
      text: md`\`fprintf(stderr, …)\` funktioniert wie \`printf\`, schreibt aber auf die Fehlerausgabe.`,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int prozent = 0;

          printf("Ventilöffnung in Prozent: ");
          if (scanf("%d", &prozent) != 1) {
              fprintf(stderr, "Fehler: Bitte eine ganze Zahl eingeben.\n");
              return 1;
          }
          if (prozent < 0 || prozent > 100) {
              fprintf(stderr, "Fehler: %d liegt nicht zwischen 0 und 100.\n", prozent);
              return 2;
          }

          printf("Ventil wird auf %d %% gestellt.\n", prozent);
          return 0;
      }
    `,
    stdin: '75\n',
    ausgabe: out`
      Ventilöffnung in Prozent: 75
      Ventil wird auf 75 % gestellt.
    `,
  },
  zeilen: [
    { zeilen: '7', text: md`\`scanf\` wird direkt in der Bedingung aufgerufen. Liefert es nicht 1, war die Eingabe keine Zahl.` },
    { zeilen: '8-9', text: md`Fehlermeldung auf die Fehlerausgabe und Abbruch mit Code 1.` },
    { zeilen: '11', text: md`Bereichsprüfung: kleiner als 0 **oder** grösser als 100 ist ungültig.` },
    { zeilen: '12-13', text: md`Die Meldung nennt den falschen Wert und den erlaubten Bereich. Ein eigener Fehlercode 2 unterscheidet diesen Fall vom ersten.` },
    { zeilen: '16', text: md`Erst wenn beide Prüfungen bestanden sind, wird mit dem Wert gearbeitet.` },
  ],
  ergebnis: md`
    Mit der Eingabe 75 läuft alles normal. Probiere unter «Eingabe» andere Werte: \`abc\` führt zur ersten Fehlermeldung und Rückgabewert 1, \`250\` zur zweiten und Rückgabewert 2. Die Fehlermeldungen erscheinen rot, weil sie auf der Fehlerausgabe stehen.
  `,
  fehler: [
    {
      titel: 'Rückgabewert ignoriert',
      text: md`Ohne Prüfung rechnet das Programm bei «abc» mit dem alten Wert der Variable weiter, bei fehlender Initialisierung sogar mit Zufall. Clang kann das nicht erkennen; die Prüfung ist deine Aufgabe.`,
      falsch: c`
        scanf("%d", &anzahl);
        printf("%d Teile\n", anzahl * 2);
      `,
      richtig: c`
        if (scanf("%d", &anzahl) != 1) {
            return 1;
        }
        printf("%d Teile\n", anzahl * 2);
      `,
    },
    {
      titel: 'Bereich mit && statt ||',
      text: md`\`prozent < 0 && prozent > 100\` ist nie wahr, weil keine Zahl gleichzeitig kleiner als 0 und grösser als 100 ist. Ausserhalb des Bereichs heisst: kleiner **oder** grösser.`,
      falsch: c`if (prozent < 0 && prozent > 100)`,
      richtig: c`if (prozent < 0 || prozent > 100)`,
    },
    {
      titel: '= statt == im Vergleich',
      text: md`\`if (anzahl = 0)\` weist 0 zu, statt zu vergleichen. Vergleichen heisst \`==\`, ungleich \`!=\`. Clang warnt bei \`=\` in einer Bedingung.`,
    },
  ],
  uebungen: [
    {
      id: 'k03-l03-u1',
      typ: 'vorhersage',
      titel: 'Was liefert scanf?',
      stufe: 1,
      themen: ['eingabe'],
      frage: 'Die Eingabe lautet `7 Kisten`. Was gibt das Programm aus?',
      code: c`
        #include <stdio.h>

        int main(void) {
            int a = 0, b = 0;
            int gelesen = scanf("%d %d", &a, &b);
            printf("%d %d %d\n", gelesen, a, b);
            return 0;
        }
      `,
      stdin: '7 Kisten\n',
      ausgabe: out`
        1 7 0
      `,
      erklaerung: md`Die 7 wird gelesen, «Kisten» ist keine Zahl. \`scanf\` liefert darum 1, und \`b\` behält seinen Startwert 0.`,
    },
    {
      id: 'k03-l03-u2',
      typ: 'erweitern',
      titel: 'Ungültige Eingabe abfangen',
      stufe: 2,
      themen: ['eingabe', 'fehler'],
      aufgabe: md`
        Das Programm liest eine Anzahl Kisten und berechnet das Gewicht (12 kg pro Kiste). Ergänze eine Prüfung: Kann \`scanf\` keine Zahl lesen, soll das Programm \`Fehler: keine Zahl\` ausgeben (mit \`printf\`) und mit dem Rückgabewert 1 enden.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int kisten = 0;
            printf("Anzahl Kisten: ");
            scanf("%d", &kisten);
            printf("Gewicht: %d kg\n", kisten * 12);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int kisten = 0;
            printf("Anzahl Kisten: ");
            if (scanf("%d", &kisten) != 1) {
                printf("Fehler: keine Zahl\n");
                return 1;
            }
            printf("Gewicht: %d kg\n", kisten * 12);
            return 0;
        }
      `,
      tests: [
        { name: 'Gültige Eingabe 5', stdin: '5\n', erwartet: { stdout: 'Anzahl Kisten: Gewicht: 60 kg\n', exitCode: 0 } },
        { name: 'Ungültige Eingabe «viele»', stdin: 'viele\n', erwartet: { stdout: 'Anzahl Kisten: Fehler: keine Zahl\n', exitCode: 1 }, tipp: md`Prüfe den Rückgabewert: \`if (scanf(...) != 1)\`.` },
      ],
      hinweise: [md`Ersetze die Zeile mit \`scanf\` durch \`if (scanf("%d", &kisten) != 1) { … }\`.`, md`Im Block: \`printf\` mit der Meldung und \`return 1;\`.`],
    },
    {
      id: 'k03-l03-u3',
      typ: 'programm',
      titel: 'Sollwert für eine Heizung',
      stufe: 3,
      themen: ['eingabe', 'fehler'],
      aufgabe: md`
        Lies einen Temperatur-Sollwert als Kommazahl ein. Gültig sind Werte von 5.0 bis 30.0 Grad (einschliesslich). Gib je nach Fall genau eine dieser Zeilen aus und ende mit dem angegebenen Rückgabewert:

        | Fall | Ausgabe | Rückgabewert |
        |---|---|---|
        | keine Zahl | \`Fehler: keine Zahl\` | 1 |
        | ausserhalb 5 bis 30 | \`Fehler: 5 bis 30 Grad erlaubt\` | 2 |
        | gültig, z. B. 21.5 | \`Sollwert 21.5 Grad gesetzt\` | 0 |

        Gib vorher keine Eingabeaufforderung aus. Den Sollwert gibst du mit einer Nachkommastelle aus.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double soll = 0.0;

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            double soll = 0.0;

            if (scanf("%lf", &soll) != 1) {
                printf("Fehler: keine Zahl\n");
                return 1;
            }
            if (soll < 5.0 || soll > 30.0) {
                printf("Fehler: 5 bis 30 Grad erlaubt\n");
                return 2;
            }
            printf("Sollwert %.1f Grad gesetzt\n", soll);
            return 0;
        }
      `,
      tests: [
        { name: 'Gültig: 21.5', stdin: '21.5\n', erwartet: { stdout: 'Sollwert 21.5 Grad gesetzt\n', exitCode: 0 } },
        { name: 'Grenze: 30', stdin: '30\n', erwartet: { stdout: 'Sollwert 30.0 Grad gesetzt\n', exitCode: 0 }, tipp: md`30.0 ist noch erlaubt: «einschliesslich».` },
        { name: 'Zu hoch: 45', stdin: '45\n', erwartet: { stdout: 'Fehler: 5 bis 30 Grad erlaubt\n', exitCode: 2 } },
        { name: 'Zu tief: -3', stdin: '-3\n', erwartet: { stdout: 'Fehler: 5 bis 30 Grad erlaubt\n', exitCode: 2 } },
        { name: 'Keine Zahl', stdin: 'warm\n', erwartet: { stdout: 'Fehler: keine Zahl\n', exitCode: 1 } },
      ],
      hinweise: [md`Zwei Prüfungen nacheinander: zuerst der Rückgabewert von \`scanf\`, dann der Bereich.`, md`Ausserhalb heisst: \`soll < 5.0 || soll > 30.0\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k03-l03-c1',
      typ: 'auswahl',
      themen: ['eingabe'],
      frage: 'Was gibt `scanf("%d", &x)` zurück, wenn der Benutzer `Hallo` eingibt?',
      optionen: [{ text: '0', richtig: true, warum: 'Kein Wert konnte gelesen werden.' }, { text: '1' }, { text: 'Die Zahl 5, weil «Hallo» fünf Buchstaben hat', warum: '`scanf` zählt die erfolgreich gelesenen Werte.' }],
    },
    {
      id: 'k03-l03-c2',
      typ: 'wahrfalsch',
      themen: ['eingabe'],
      aussage: 'Wenn `scanf("%d", &x)` scheitert, setzt es `x` automatisch auf 0.',
      richtig: false,
      erklaerung: '`x` bleibt unverändert. Darum ist die Initialisierung und die Prüfung des Rückgabewerts so wichtig.',
    },
    {
      id: 'k03-l03-c3',
      typ: 'auswahl',
      themen: ['eingabe', 'operatoren'],
      frage: 'Welche Bedingung ist wahr, wenn `wert` **ausserhalb** von 1 bis 10 liegt?',
      optionen: [{ text: '`wert < 1 || wert > 10`', richtig: true }, { text: '`wert < 1 && wert > 10`', warum: 'Das ist nie wahr.' }, { text: '`wert > 1 || wert < 10`', warum: 'Das ist für jede Zahl wahr.' }],
    },
  ],
  zusammenfassung: [
    '`scanf` gibt die Anzahl erfolgreich gelesener Werte zurück, bei Ende der Eingabe `EOF`.',
    'Prüfe immer: `if (scanf("%d", &x) != 1) { … }`.',
    'Danach den Bereich prüfen: `if (x < MIN || x > MAX) { … }`.',
    'Bei Fehlern: verständliche Meldung (am besten mit `fprintf(stderr, …)`) und Rückgabewert ungleich 0.',
  ],
  referenz: ['scanf', 'fprintf'],
};
