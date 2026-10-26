import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k08-l04',
  titel: 'Arraygrenzen und typische Fehler',
  dauer: 25,
  stichwoerter: ['Arraygrenze', 'Pufferüberlauf', 'Buffer Overflow', 'Off-by-one', 'undefiniertes Verhalten', 'Index prüfen', 'Speicherplatz'],
  lernziele: [
    'erklären, was bei einem Zugriff ausserhalb eines Arrays passiert',
    'Off-by-one-Fehler und ungeprüfte Indizes erkennen',
    'Indizes aus Eingaben vor dem Zugriff prüfen',
  ],
  erklaerung: md`
    Der gefährlichste Fehler mit Arrays ist der Zugriff **ausserhalb** der Grenzen. C prüft Indizes nicht. \`werte[5]\` bei einem Array mit 5 Elementen greift einfach auf die Speicherstelle **hinter** dem Array zu, egal was dort liegt.

    ### Was dann passiert

    Das Verhalten ist **undefiniert**. In der Praxis heisst das:

    - **Lesen** liefert einen zufälligen Wert, oft den einer anderen Variable.
    - **Schreiben** überschreibt eine andere Variable, die Rücksprungadresse einer Funktion oder Daten des Betriebssystems. Das Programm verhält sich dann rätselhaft oder stürzt an einer ganz anderen Stelle ab.
    - Solche **Pufferüberläufe** sind eine der häufigsten Ursachen von Sicherheitslücken: Angreifer schreiben gezielt über das Ende eines Arrays hinaus.

    Auf einem Mikrocontroller gibt es oft keinerlei Schutz. Ein überschriebener Wert kann dort einen Ausgang falsch schalten.

    > [!info] Hilfe von Zeiger
    > Zeiger übersetzt deine Programme mit zusätzlichen Prüfungen. Ein Zugriff ausserhalb eines Arrays bekannter Grösse wird deshalb als Laufzeitfehler mit Zeilennummer gemeldet. Auf deinem PC ohne diese Prüfungen läuft das Programm einfach mit falschen Werten weiter. Mit \`clang -fsanitize=address\` lässt sich Ähnliches auch dort einschalten.

    ### Die typischen Ursachen

    1. **Off-by-one:** \`for (i = 0; i <= n; i++)\` läuft einmal zu oft.
    2. **Ungeprüfte Eingaben:** Ein Benutzer gibt Fach 7 ein, das Array hat 6 Fächer.
    3. **Falsche Grösse nach Änderungen:** Das Array wird verkleinert, eine Schleife benutzt noch die alte Zahl. Abhilfe: Grösse nur an einer Stelle festlegen (Konstante, \`sizeof\`).
    4. **Zu kleine Arrays für Text:** Für «Hallo» braucht es 6 Plätze (Endzeichen, nächste Lektion).

    ### Index prüfen

    Kommt ein Index von aussen, wird er **vor** dem Zugriff geprüft:

    ~~~c
    if (fach < 0 || fach >= ANZAHL) {
        printf("Fach %d existiert nicht\n", fach);
        return 1;
    }
    bestand[fach]++;
    ~~~
  `,
  syntax: [
    {
      code: c`
        // gültig: 0 <= index < ANZAHL
        if (index >= 0 && index < ANZAHL) {
            array[index] = wert;
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      #define ANZAHL 6

      int main(void) {
          int bestand[ANZAHL] = {4, 0, 7, 2, 9, 1};
          int fach = 0;

          printf("Fach (1-%d) für eine Entnahme: ", ANZAHL);
          if (scanf("%d", &fach) != 1) {
              return 1;
          }
          int index = fach - 1;            // Menschen zählen ab 1
          if (index < 0 || index >= ANZAHL) {
              printf("Fach %d existiert nicht\n", fach);
              return 1;
          }
          if (bestand[index] == 0) {
              printf("Fach %d ist leer\n", fach);
              return 1;
          }
          bestand[index]--;
          printf("Entnommen, Fach %d hat noch %d\n", fach, bestand[index]);
          return 0;
      }
    `,
    stdin: '7\n',
    ausgabe: out`
      Fach (1-6) für eine Entnahme: 7
      Fach 7 existiert nicht
    `,
  },
  zeilen: [
    { zeilen: '13', text: md`Umrechnung von der Nummer für Menschen (1 bis 6) auf den Index (0 bis 5).` },
    { zeilen: '14-17', text: md`Prüfung **vor** dem Zugriff. Ohne sie würde \`bestand[6]\` hinter das Array greifen.` },
    { zeilen: '18-21', text: md`Erst nach der Prüfung ist \`bestand[index]\` sicher.` },
  ],
  ergebnis: md`
    Fach 7 wird abgelehnt, statt fremden Speicher zu verändern. Probiere Fach 3 (gültig) und Fach 2 (leer). Entferne dann die Prüfung in Zeile 14 und gib 7 ein: Zeiger meldet den Zugriff ausserhalb des Arrays.
  `,
  fehler: [
    {
      titel: '<= statt <',
      text: md`Bei n Elementen ist \`n\` selbst kein gültiger Index.`,
      falsch: c`for (int i = 0; i <= ANZAHL; i++) bestand[i] = 0;`,
      richtig: c`for (int i = 0; i < ANZAHL; i++) bestand[i] = 0;`,
    },
    {
      titel: 'Nur obere Grenze geprüft',
      text: md`\`if (index < ANZAHL)\` lässt negative Indizes durch. Prüfe beide Seiten.`,
    },
    {
      titel: 'Grösse doppelt hingeschrieben',
      text: md`\`int a[8];\` und später \`for (i = 0; i < 10; i++)\`: Nach einer Änderung passt die Zahl nicht mehr. Eine Konstante für beides verwenden.`,
    },
  ],
  uebungen: [
    {
      id: 'k08-l04-u1',
      typ: 'fehlersuche',
      titel: 'Ein Kanal zu viel',
      stufe: 1,
      themen: ['arrays'],
      aufgabe: md`
        Ein Datenlogger hat 4 Kanäle. Das Programm soll alle auf 0 setzen und ausgeben: \`0 0 0 0\`. Zeiger meldet einen Laufzeitfehler. Behebe ihn.
      `,
      start: c`
        #include <stdio.h>

        #define KANAELE 4

        int main(void) {
            int wert[KANAELE];
            for (int i = 0; i <= KANAELE; i++) {
                wert[i] = 0;
            }
            for (int i = 0; i < KANAELE; i++) {
                printf("%d ", wert[i]);
            }
            printf("\n");
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        #define KANAELE 4

        int main(void) {
            int wert[KANAELE];
            for (int i = 0; i < KANAELE; i++) {
                wert[i] = 0;
            }
            for (int i = 0; i < KANAELE; i++) {
                printf("%d ", wert[i]);
            }
            printf("\n");
            return 0;
        }
      `,
      tests: [{ name: 'Vier Nullen', erwartet: { stdout: '0 0 0 0\n' } }],
      hinweise: [md`Welche Indizes hat ein Array mit 4 Elementen?`],
    },
    {
      id: 'k08-l04-u2',
      typ: 'programm',
      titel: 'Sicherer Zugriff',
      stufe: 2,
      themen: ['arrays', 'fehler'],
      aufgabe: md`
        Lies eine Kanalnummer (0 bis 4) ein und gib den Messwert des Kanals aus: \`Kanal 2: 3.30 V\`. Bei einer ungültigen Nummer oder Eingabe: \`ungültiger Kanal\` und Rückgabewert 1.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double spannung[5] = {0.0, 1.65, 3.30, 4.95, 2.48};
            int kanal = 0;

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            double spannung[5] = {0.0, 1.65, 3.30, 4.95, 2.48};
            int kanal = 0;

            if (scanf("%d", &kanal) != 1 || kanal < 0 || kanal >= 5) {
                printf("ungültiger Kanal\n");
                return 1;
            }
            printf("Kanal %d: %.2f V\n", kanal, spannung[kanal]);
            return 0;
        }
      `,
      tests: [
        { name: 'Kanal 2', stdin: '2\n', erwartet: { stdout: 'Kanal 2: 3.30 V\n' } },
        { name: 'Kanal 4', stdin: '4\n', erwartet: { stdout: 'Kanal 4: 2.48 V\n' } },
        { name: 'Kanal 5', stdin: '5\n', erwartet: { stdout: 'ungültiger Kanal\n', exitCode: 1 } },
        { name: 'Kanal -1', stdin: '-1\n', erwartet: { stdout: 'ungültiger Kanal\n', exitCode: 1 } },
      ],
      hinweise: [md`Prüfe \`kanal < 0 || kanal >= 5\`, bevor du zugreifst.`],
    },
    {
      id: 'k08-l04-u3',
      typ: 'auswahl',
      titel: 'Was ist gefährlich?',
      stufe: 2,
      mehrfach: true,
      themen: ['arrays'],
      frage: 'Gegeben: `int a[10];`. Welche Zugriffe sind ausserhalb der Grenzen? (Mehrere Antworten)',
      optionen: [
        { text: '`a[10]`', richtig: true },
        { text: '`a[0]`' },
        { text: '`a[-1]`', richtig: true },
        { text: '`a[9]`' },
        { text: '`a[i]` mit `i = 5 + 5`', richtig: true },
      ],
    },
  ],
  wissenscheck: [
    {
      id: 'k08-l04-c1',
      typ: 'wahrfalsch',
      themen: ['arrays'],
      aussage: 'Ein Schreibzugriff hinter das Ende eines Arrays kann eine andere Variable verändern.',
      richtig: true,
    },
    {
      id: 'k08-l04-c2',
      typ: 'auswahl',
      themen: ['arrays'],
      frage: 'Welche Prüfung macht `a[i]` bei `int a[N]` sicher?',
      optionen: [{ text: '`i >= 0 && i < N`', richtig: true }, { text: '`i <= N`' }, { text: '`i < N`', warum: 'Negative Werte gehen durch.' }],
    },
    {
      id: 'k08-l04-c3',
      typ: 'eingabe',
      themen: ['arrays'],
      frage: 'Wie heisst der Fehler, bei dem eine Schleife genau einmal zu oft oder zu wenig läuft? (Englisch, mit Bindestrichen)',
      antworten: ['off-by-one', 'Off-by-one'],
    },
  ],
  zusammenfassung: [
    'C prüft Arraygrenzen nicht; Zugriffe ausserhalb sind undefiniertes Verhalten.',
    'Schreiben über das Ende hinaus zerstört andere Daten und ist eine klassische Sicherheitslücke.',
    'Off-by-one vermeiden: `i < n`, nicht `i <= n`.',
    'Indizes aus Eingaben vorher auf `0 <= i < n` prüfen; Grössen nur an einer Stelle festlegen.',
  ],
  referenz: ['array'],
};
