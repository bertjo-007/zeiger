import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k05-l05',
  titel: 'Entscheidungsprogramme: Zustandsautomaten',
  dauer: 30,
  stichwoerter: ['Zustandsautomat', 'Zustand', 'Ereignis', 'Übergang', 'State Machine', 'Ampel', 'Motorsteuerung', 'switch', 'Zustandsdiagramm'],
  lernziele: [
    'erklären, was Zustände, Ereignisse und Übergänge sind',
    'einen Zustandsübergang mit `switch` und `if` programmieren',
    'eine einfache Steuerung als Zustandsautomat entwerfen',
  ],
  erklaerung: md`
    Viele technische Systeme verhalten sich je nach **Zustand** unterschiedlich. Eine Ampel ist entweder rot, rot-gelb, grün oder gelb. Ein Garagentor ist zu, öffnet, ist offen oder schliesst. Was beim Druck auf einen Taster passiert, hängt vom aktuellen Zustand ab: Ein schliessendes Tor soll wieder öffnen, ein offenes soll schliessen.

    Ein **Zustandsautomat** (englisch state machine) beschreibt so ein System mit drei Begriffen:

    - **Zustände:** endlich viele Situationen, in denen sich das System befinden kann;
    - **Ereignisse:** was von aussen passiert (Taster gedrückt, Endschalter erreicht, Zeit abgelaufen);
    - **Übergänge:** in welchem Zustand welches Ereignis zu welchem neuen Zustand führt.

    ### Als Tabelle

    | Zustand | Ereignis | neuer Zustand | Aktion |
    |---|---|---|---|
    | ZU | Taster | OEFFNET | Motor auf |
    | OEFFNET | Endschalter oben | OFFEN | Motor aus |
    | OEFFNET | Taster | SCHLIESST | Motor zu |
    | OFFEN | Taster | SCHLIESST | Motor zu |
    | SCHLIESST | Endschalter unten | ZU | Motor aus |
    | SCHLIESST | Lichtschranke | OEFFNET | Motor auf |

    Alle anderen Kombinationen ändern nichts.

    ### In C

    Die Zustände werden zu Zahlen mit Namen. Weil Aufzählungen (\`enum\`) erst in Kapitel 11 kommen, nehmen wir \`const int\`. Der aktuelle Zustand steht in einer Variable. Ein \`switch\` über den Zustand wählt aus, welche Ereignisse in diesem Zustand eine Rolle spielen, und ein \`if\` darin prüft das Ereignis:

    ~~~c
    switch (zustand) {
        case ZU:
            if (ereignis == TASTER) {
                zustand = OEFFNET;
            }
            break;
        …
    }
    ~~~

    Diese Lektion programmiert **einen** Übergang: Zustand und Ereignis gehen hinein, der neue Zustand kommt heraus. In Kapitel 6 wiederholst du das in einer Schleife für viele Ereignisse hintereinander. Auf einem Mikrocontroller läuft so ein Automat dauerhaft in einer Endlosschleife.

    > [!praxis] Warum Zustandsautomaten so verbreitet sind
    > Steuerungen mit vielen verschachtelten \`if\` werden schnell unübersichtlich und fehleranfällig. Ein Zustandsautomat zwingt dazu, jede Kombination aus Zustand und Ereignis bewusst zu behandeln. Fehler wie «Motor läuft auf, obwohl das Tor schon offen ist» werden so viel unwahrscheinlicher.
  `,
  syntax: [
    {
      code: c`
        const int ZUSTAND_A = 0, ZUSTAND_B = 1;
        int zustand = ZUSTAND_A;

        switch (zustand) {
            case 0:                          // ZUSTAND_A
                if (ereignis == …) { zustand = ZUSTAND_B; }
                break;
            case 1:                          // ZUSTAND_B
                …
                break;
        }
      `,
      text: md`\`case\` braucht konstante Werte. \`const int\`-Variablen zählen in C dafür nicht als Konstanten, darum stehen hier Zahlen mit Kommentar. Mit \`enum\` (Kapitel 11) geht das eleganter.`,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          // Zustände des Garagentors
          // 0 = ZU, 1 = OEFFNET, 2 = OFFEN, 3 = SCHLIESST
          int zustand = 0;
          char ereignis = '?';   // T = Taster, O = Endschalter oben,
                                 // U = Endschalter unten, L = Lichtschranke

          printf("Zustand (0-3) und Ereignis (T/O/U/L): ");
          scanf("%d %c", &zustand, &ereignis);

          switch (zustand) {
              case 0:   // ZU
                  if (ereignis == 'T') {
                      zustand = 1;
                      printf("Motor auf\n");
                  }
                  break;
              case 1:   // OEFFNET
                  if (ereignis == 'O') {
                      zustand = 2;
                      printf("Motor aus\n");
                  } else if (ereignis == 'T') {
                      zustand = 3;
                      printf("Motor zu\n");
                  }
                  break;
              case 2:   // OFFEN
                  if (ereignis == 'T') {
                      zustand = 3;
                      printf("Motor zu\n");
                  }
                  break;
              case 3:   // SCHLIESST
                  if (ereignis == 'U') {
                      zustand = 0;
                      printf("Motor aus\n");
                  } else if (ereignis == 'L' || ereignis == 'T') {
                      zustand = 1;
                      printf("Hindernis oder Taster: Motor auf\n");
                  }
                  break;
              default:
                  printf("Ungültiger Zustand\n");
                  return 1;
          }
          printf("Neuer Zustand: %d\n", zustand);
          return 0;
      }
    `,
    stdin: '3 L\n',
    ausgabe: out`
      Zustand (0-3) und Ereignis (T/O/U/L): 3 L
      Hindernis oder Taster: Motor auf
      Neuer Zustand: 1
    `,
  },
  zeilen: [
    { zeilen: '4-6', text: md`Die Zustände stehen als Zahlen mit Kommentar. Die Variable \`zustand\` speichert den aktuellen.` },
    { zeilen: '13', text: md`Der \`switch\` über den Zustand ist das Gerüst jedes Zustandsautomaten.` },
    { zeilen: '14-19', text: md`Im Zustand ZU interessiert nur der Taster. Alle anderen Ereignisse ändern nichts.` },
    { zeilen: '35-41', text: md`Sicherheitsfunktion: Unterbricht jemand beim Schliessen die Lichtschranke, öffnet das Tor wieder.` },
    { zeilen: '43-45', text: md`Ein ungültiger Zustand ist ein Programmfehler und führt zum Abbruch.` },
  ],
  ergebnis: md`
    Das Tor schliesst gerade (Zustand 3), und die Lichtschranke meldet ein Hindernis: Das Tor öffnet wieder (Zustand 1). Probiere andere Kombinationen, etwa \`0 T\`, \`1 O\` oder \`2 U\`. Bei \`2 U\` passiert nichts, weil ein offenes Tor den unteren Endschalter ignoriert.
  `,
  fehler: [
    {
      titel: 'Zustände vergessen',
      text: md`Fehlt ein \`case\`, bleibt das System in diesem Zustand hängen. Mit \`default\` erkennt man ungültige Zustände.`,
    },
    {
      titel: 'Ereignis und Zustand vermischt',
      text: md`«Taster gedrückt» ist ein Ereignis, kein Zustand. Wer es als Zustand speichert, bekommt Übergänge, die nur einmal funktionieren. Zustände beschreiben, **wo** das System ist; Ereignisse, **was** passiert.`,
    },
    {
      titel: 'Aktion ohne Zustandswechsel',
      text: md`Wird der Motor eingeschaltet, aber der Zustand nicht geändert, schaltet das Programm beim nächsten Durchlauf erneut. Aktion und neuer Zustand gehören immer zusammen.`,
    },
  ],
  uebungen: [
    {
      id: 'k05-l05-u1',
      typ: 'zuordnen',
      titel: 'Zustand oder Ereignis?',
      stufe: 1,
      themen: ['switch', 'mikrocontroller'],
      frage: 'Ordne die Begriffe einer Kaffeemaschine zu.',
      paare: [
        { links: '«Wasser wird aufgeheizt»', rechts: 'Zustand' },
        { links: '«Taste Espresso gedrückt»', rechts: 'Ereignis' },
        { links: '«Von Bereit nach Brühen, wenn die Taste kommt»', rechts: 'Übergang' },
        { links: '«Pumpe einschalten»', rechts: 'Aktion' },
      ],
    },
    {
      id: 'k05-l05-u2',
      typ: 'programm',
      titel: 'Fussgängerampel',
      stufe: 2,
      themen: ['switch', 'bedingungen'],
      aufgabe: md`
        Programmiere einen Übergang einer Fussgängerampel. Zustände: \`0\` = Autos grün, \`1\` = Autos gelb, \`2\` = Fussgänger grün. Ereignisse: \`K\` = Knopf gedrückt, \`Z\` = Zeit abgelaufen.

        | Zustand | Ereignis | neuer Zustand |
        |---|---|---|
        | 0 | K | 1 |
        | 1 | Z | 2 |
        | 2 | Z | 0 |

        Alle anderen Kombinationen ändern nichts. Lies Zustand und Ereignis (\`scanf("%d %c", …)\`) und gib \`Zustand: <neu>\` aus.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int zustand = 0;
            char ereignis = '?';
            scanf("%d %c", &zustand, &ereignis);

            printf("Zustand: %d\n", zustand);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int zustand = 0;
            char ereignis = '?';
            scanf("%d %c", &zustand, &ereignis);

            switch (zustand) {
                case 0:
                    if (ereignis == 'K') {
                        zustand = 1;
                    }
                    break;
                case 1:
                    if (ereignis == 'Z') {
                        zustand = 2;
                    }
                    break;
                case 2:
                    if (ereignis == 'Z') {
                        zustand = 0;
                    }
                    break;
            }
            printf("Zustand: %d\n", zustand);
            return 0;
        }
      `,
      tests: [
        { name: '0 K', stdin: '0 K\n', erwartet: { stdout: 'Zustand: 1\n' } },
        { name: '1 Z', stdin: '1 Z\n', erwartet: { stdout: 'Zustand: 2\n' } },
        { name: '2 Z', stdin: '2 Z\n', erwartet: { stdout: 'Zustand: 0\n' } },
        { name: '0 Z (keine Änderung)', stdin: '0 Z\n', erwartet: { stdout: 'Zustand: 0\n' } },
        { name: '2 K (keine Änderung)', stdin: '2 K\n', erwartet: { stdout: 'Zustand: 2\n' } },
      ],
      regeln: [{ muss: '\\bswitch\\b', meldung: 'Baue den Automaten mit `switch` über den Zustand.' }],
      hinweise: [md`Ein \`case\` pro Zustand, darin ein \`if\` für das passende Ereignis.`],
    },
    {
      id: 'k05-l05-u3',
      typ: 'programm',
      titel: 'Förderband mit Störung',
      stufe: 3,
      themen: ['switch', 'bedingungen'],
      aufgabe: md`
        Ein Förderband kennt die Zustände \`0\` = STOPP, \`1\` = LAEUFT, \`2\` = STOERUNG. Ereignisse: \`S\` = Start, \`H\` = Halt, \`F\` = Fehler, \`Q\` = Quittieren.

        - STOPP: \`S\` → LAEUFT (Ausgabe \`Band an\`)
        - LAEUFT: \`H\` → STOPP (\`Band aus\`), \`F\` → STOERUNG (\`Band aus, Störung\`)
        - STOERUNG: \`Q\` → STOPP (\`Störung quittiert\`). **Start ist in der Störung nicht möglich:** \`S\` gibt \`Erst quittieren\` aus und ändert nichts.
        - In jedem Zustand führt \`F\` zu STOERUNG; nur aus LAEUFT kommt dabei die Meldung \`Band aus, Störung\`, sonst \`Störung\`.

        Gib nach einer eventuellen Meldung immer \`Zustand: <neu>\` aus.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int zustand = 0;
            char e = '?';
            scanf("%d %c", &zustand, &e);

            printf("Zustand: %d\n", zustand);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int zustand = 0;
            char e = '?';
            scanf("%d %c", &zustand, &e);

            switch (zustand) {
                case 0:   // STOPP
                    if (e == 'S') {
                        zustand = 1;
                        printf("Band an\n");
                    } else if (e == 'F') {
                        zustand = 2;
                        printf("Störung\n");
                    }
                    break;
                case 1:   // LAEUFT
                    if (e == 'H') {
                        zustand = 0;
                        printf("Band aus\n");
                    } else if (e == 'F') {
                        zustand = 2;
                        printf("Band aus, Störung\n");
                    }
                    break;
                case 2:   // STOERUNG
                    if (e == 'Q') {
                        zustand = 0;
                        printf("Störung quittiert\n");
                    } else if (e == 'S') {
                        printf("Erst quittieren\n");
                    }
                    break;
            }
            printf("Zustand: %d\n", zustand);
            return 0;
        }
      `,
      tests: [
        { name: 'STOPP + Start', stdin: '0 S\n', erwartet: { stdout: 'Band an\nZustand: 1\n' } },
        { name: 'LAEUFT + Halt', stdin: '1 H\n', erwartet: { stdout: 'Band aus\nZustand: 0\n' } },
        { name: 'LAEUFT + Fehler', stdin: '1 F\n', erwartet: { stdout: 'Band aus, Störung\nZustand: 2\n' } },
        { name: 'STOERUNG + Start', stdin: '2 S\n', erwartet: { stdout: 'Erst quittieren\nZustand: 2\n' } },
        { name: 'STOERUNG + Quittieren', stdin: '2 Q\n', erwartet: { stdout: 'Störung quittiert\nZustand: 0\n' } },
        { name: 'STOPP + Fehler', stdin: '0 F\n', erwartet: { stdout: 'Störung\nZustand: 2\n' } },
        { name: 'STOPP + Halt (nichts)', stdin: '0 H\n', erwartet: { stdout: 'Zustand: 0\n' } },
      ],
      hinweise: [md`Zeichne dir zuerst die Tabelle: Zustand, Ereignis, neuer Zustand, Meldung.`, md`Im Zustand STOERUNG gibt es zwei interessante Ereignisse: \`Q\` und \`S\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k05-l05-c1',
      typ: 'auswahl',
      themen: ['switch'],
      frage: 'Worüber läuft der `switch` in einem klassischen Zustandsautomaten?',
      optionen: [{ text: 'Über den aktuellen Zustand', richtig: true }, { text: 'Über die Ausgabe' }, { text: 'Über die Anzahl der Ereignisse' }],
    },
    {
      id: 'k05-l05-c2',
      typ: 'wahrfalsch',
      themen: ['switch'],
      aussage: 'In einem Zustandsautomaten kann dasselbe Ereignis je nach Zustand etwas anderes bewirken.',
      richtig: true,
      erklaerung: 'Genau das ist der Sinn: Der Taster öffnet ein geschlossenes Tor und schliesst ein offenes.',
    },
    {
      id: 'k05-l05-c3',
      typ: 'auswahl',
      themen: ['switch'],
      frage: 'Was ist bei einer Garagentor-Steuerung ein **Ereignis**?',
      optionen: [{ text: 'Der Endschalter oben meldet', richtig: true }, { text: 'Das Tor ist offen', warum: 'Das ist ein Zustand.' }, { text: 'Das Tor schliesst gerade', warum: 'Auch ein Zustand.' }],
    },
  ],
  zusammenfassung: [
    'Ein Zustandsautomat besteht aus Zuständen, Ereignissen und Übergängen.',
    'Der aktuelle Zustand steht in einer Variable; `switch (zustand)` wählt den Fall, `if (ereignis …)` den Übergang.',
    'Aktion und Zustandswechsel gehören immer zusammen.',
    'Mit einer Tabelle oder einem Diagramm planen, dann programmieren.',
  ],
  referenz: ['switch'],
};
