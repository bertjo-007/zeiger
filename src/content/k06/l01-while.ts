import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k06-l01',
  titel: 'Die while-Schleife',
  dauer: 25,
  stichwoerter: ['while', 'Schleife', 'wiederholen', 'solange', 'Bedingung', 'kopfgesteuert', 'Durchlauf', 'Iteration'],
  lernziele: [
    'Anweisungen mit `while` wiederholen, solange eine Bedingung gilt',
    'eine Schleife so schreiben, dass sie sicher endet',
    'den Ablauf einer Schleife Schritt für Schritt nachvollziehen',
  ],
  erklaerung: md`
    Steuerungen tun fast alles wiederholt: Messwerte lesen, bis ein Tank voll ist; Impulse zählen, bis eine Position erreicht ist; Eingaben verarbeiten, bis keine mehr kommen. Dafür gibt es **Schleifen**. Die einfachste ist **\`while\`** («solange»):

    ~~~c
    while (fuellstand < 1000) {
        fuellstand += zufluss;
    }
    ~~~

    1. Die **Bedingung** wird geprüft.
    2. Ist sie wahr, wird der **Block** einmal ausgeführt (ein **Durchlauf**).
    3. Danach geht es zurück zu Schritt 1.
    4. Ist die Bedingung falsch, geht das Programm hinter der Schleife weiter.

    Weil die Bedingung **vor** jedem Durchlauf geprüft wird, kann es sein, dass der Block **gar nicht** ausgeführt wird: Ist der Tank schon voll, wird nichts nachgefüllt. Man nennt \`while\` deshalb **kopfgesteuert**.

    ### Die Schleife muss enden

    Im Block muss sich etwas ändern, das die Bedingung irgendwann falsch macht. Sonst entsteht eine **Endlosschleife**: Das Programm hängt. Prüfe bei jeder Schleife drei Dinge:

    - **Start:** Haben die Variablen der Bedingung einen sinnvollen Anfangswert?
    - **Änderung:** Ändert jeder Durchlauf etwas an der Bedingung?
    - **Ende:** Wird die Bedingung sicher irgendwann falsch?

    Zeiger bricht ein Programm nach einigen Sekunden Rechenzeit ab und meldet eine vermutliche Endlosschleife.

    ### Eingaben in einer Schleife

    \`scanf\` gibt bei Ende der Eingabe \`EOF\` zurück, bei einer ungültigen Eingabe 0. Damit lassen sich beliebig viele Werte einlesen:

    ~~~c
    while (scanf("%d", &wert) == 1) {
        summe += wert;
    }
    ~~~

    > [!tipp] Ende der Eingabe in Zeiger
    > Im Terminal beendest du eine Eingabe mit «Eingabe beenden» oder <kbd>Strg</kbd>+<kbd>D</kbd>. Die Tests der Übungen liefern ihre Eingaben automatisch und enden dann von selbst.
  `,
  syntax: [
    {
      code: c`
        while (bedingung) {
            anweisungen;   // werden wiederholt, solange bedingung wahr ist
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int fuellstand_l = 640;
          const int ZIEL_L = 1000;
          const int ZUFLUSS_L = 85;     // pro Minute
          int minuten = 0;

          while (fuellstand_l < ZIEL_L) {
              fuellstand_l += ZUFLUSS_L;
              minuten++;
              printf("Minute %d: %d l\n", minuten, fuellstand_l);
          }
          printf("Voll nach %d Minuten\n", minuten);
          return 0;
      }
    `,
    ausgabe: out`
      Minute 1: 725 l
      Minute 2: 810 l
      Minute 3: 895 l
      Minute 4: 980 l
      Minute 5: 1065 l
      Voll nach 5 Minuten
    `,
  },
  zeilen: [
    { zeilen: '4-7', text: md`Startwerte: Füllstand, Ziel, Zufluss und ein Zähler für die Minuten.` },
    { zeilen: '9', text: md`Vor jedem Durchlauf: Ist der Tank noch nicht voll?` },
    { zeilen: '10-11', text: md`Diese Änderung sorgt dafür, dass die Schleife endet: Der Füllstand steigt jede Minute.` },
    { zeilen: '12', text: md`Eine Ausgabe pro Durchlauf zeigt den Ablauf.` },
    { zeilen: '14', text: md`Hinter der Schleife: Hier ist die Bedingung sicher falsch, der Tank also voll.` },
  ],
  ergebnis: md`
    Nach fünf Durchläufen liegt der Füllstand mit 1065 l über dem Ziel, die Bedingung ist falsch, und die Schleife endet. Setze den Startwert auf 1200: Dann wird der Block kein einziges Mal ausgeführt.
  `,
  fehler: [
    {
      titel: 'Änderung vergessen',
      text: md`Ändert sich nichts an der Bedingung, läuft die Schleife ewig.`,
      falsch: c`
        int i = 0;
        while (i < 5) {
            printf("%d\n", i);
        }
      `,
      richtig: c`
        int i = 0;
        while (i < 5) {
            printf("%d\n", i);
            i++;
        }
      `,
    },
    {
      titel: 'Strichpunkt nach while',
      text: md`\`while (x < 10);\` ist eine Schleife mit leerem Rumpf. Ändert sich \`x\` darin nicht, hängt das Programm sofort.`,
    },
    {
      titel: 'Ein Durchlauf zu viel oder zu wenig',
      text: md`\`<\` oder \`<=\`? Spiele die Schleife für die ersten und letzten Werte im Kopf durch.`,
    },
  ],
  uebungen: [
    {
      id: 'k06-l01-u1',
      typ: 'vorhersage',
      titel: 'Halbieren',
      stufe: 1,
      themen: ['schleifen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int n = 40;
            while (n > 4) {
                printf("%d ", n);
                n /= 2;
            }
            printf("Ende %d\n", n);
            return 0;
        }
      `,
      ausgabe: out`
        40 20 10 5 Ende 2
      `,
    },
    {
      id: 'k06-l01-u2',
      typ: 'programm',
      titel: 'Summe aller Eingaben',
      stufe: 2,
      themen: ['schleifen', 'eingabe'],
      aufgabe: md`
        Lies ganze Zahlen ein, bis die Eingabe endet oder keine Zahl mehr kommt. Gib danach die Anzahl und die Summe aus. Bei \`4 10 7\`:

        ~~~text
        3 Werte, Summe 21
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int wert = 0;
            int anzahl = 0;
            int summe = 0;

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int wert = 0;
            int anzahl = 0;
            int summe = 0;

            while (scanf("%d", &wert) == 1) {
                summe += wert;
                anzahl++;
            }
            printf("%d Werte, Summe %d\n", anzahl, summe);
            return 0;
        }
      `,
      tests: [
        { name: '4 10 7', stdin: '4 10 7\n', erwartet: { stdout: '3 Werte, Summe 21\n' } },
        { name: 'Auf mehreren Zeilen', stdin: '100\n-30\n5\n2\n', erwartet: { stdout: '4 Werte, Summe 77\n' } },
        { name: 'Keine Eingabe', stdin: '', erwartet: { stdout: '0 Werte, Summe 0\n' } },
      ],
      hinweise: [md`\`while (scanf("%d", &wert) == 1) { … }\``],
    },
    {
      id: 'k06-l01-u3',
      typ: 'fehlersuche',
      titel: 'Countdown hängt',
      stufe: 2,
      themen: ['schleifen'],
      aufgabe: md`
        Ein Countdown soll \`3 2 1 Start\` ausgeben, hängt aber. Finde den Fehler.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int n = 3;
            while (n > 0) {
                printf("%d ", n);
            }
            printf("Start\n");
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int n = 3;
            while (n > 0) {
                printf("%d ", n);
                n--;
            }
            printf("Start\n");
            return 0;
        }
      `,
      tests: [{ name: 'Countdown', erwartet: { stdout: '3 2 1 Start\n' } }],
      hinweise: [md`Was ändert sich in der Schleife an \`n\`?`],
    },
    {
      id: 'k06-l01-u4',
      typ: 'programm',
      titel: 'Ziffern zählen',
      stufe: 3,
      themen: ['schleifen', 'operatoren'],
      aufgabe: md`
        Lies eine positive ganze Zahl und gib aus, wie viele Ziffern sie hat. Teile dazu in einer \`while\`-Schleife wiederholt durch 10. Bei 40961: \`5 Ziffern\`. Die Zahl 0 hat 1 Ziffer.
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

            int ziffern = 1;
            while (n >= 10) {
                n /= 10;
                ziffern++;
            }
            printf("%d Ziffern\n", ziffern);
            return 0;
        }
      `,
      tests: [
        { name: '40961', stdin: '40961\n', erwartet: { stdout: '5 Ziffern\n' } },
        { name: '7', stdin: '7\n', erwartet: { stdout: '1 Ziffern\n' } },
        { name: '0', stdin: '0\n', erwartet: { stdout: '1 Ziffern\n' } },
        { name: '100', stdin: '100\n', erwartet: { stdout: '3 Ziffern\n' } },
      ],
      regeln: [{ muss: '\\bwhile\\b', meldung: 'Verwende eine `while`-Schleife.' }],
      hinweise: [md`Starte mit 1 Ziffer und teile, solange die Zahl mindestens 10 ist.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k06-l01-c1',
      typ: 'wahrfalsch',
      themen: ['schleifen'],
      aussage: 'Der Rumpf einer `while`-Schleife wird mindestens einmal ausgeführt.',
      richtig: false,
      erklaerung: 'Die Bedingung wird vorher geprüft. Ist sie gleich zu Beginn falsch, läuft der Rumpf nie.',
    },
    {
      id: 'k06-l01-c2',
      typ: 'eingabe',
      themen: ['schleifen'],
      frage: 'Wie oft läuft `int i = 0; while (i < 4) { i++; }` durch?',
      antworten: ['4'],
    },
    {
      id: 'k06-l01-c3',
      typ: 'auswahl',
      themen: ['schleifen'],
      frage: 'Was passiert bei `while (n > 0);` gefolgt von einem Block?',
      optionen: [{ text: 'Bei n > 0 hängt das Programm in einer leeren Endlosschleife.', richtig: true }, { text: 'Der Block wird wiederholt.' }, { text: 'Compilerfehler.', warum: 'Es ist gültig, Clang warnt nur.' }],
    },
  ],
  zusammenfassung: [
    '`while (bedingung) { … }` wiederholt den Block, solange die Bedingung wahr ist.',
    'Die Bedingung wird vor jedem Durchlauf geprüft; eventuell läuft die Schleife nie.',
    'Jeder Durchlauf muss die Bedingung dem Ende näher bringen, sonst droht eine Endlosschleife.',
    '`while (scanf(...) == 1)` liest beliebig viele Werte bis zum Ende der Eingabe.',
  ],
  referenz: ['while'],
};
