import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k07-l01',
  titel: 'Eigene Funktionen erstellen',
  dauer: 25,
  stichwoerter: ['Funktion', 'Definition', 'Aufruf', 'Funktionskopf', 'Funktionsrumpf', 'Wiederverwendung', 'Unterprogramm'],
  lernziele: [
    'eine eigene Funktion definieren und aufrufen',
    'erklären, warum Funktionen Programme übersichtlicher und sicherer machen',
    'den Ablauf beim Aufruf einer Funktion nachvollziehen',
  ],
  erklaerung: md`
    Bisher stand alles in \`main\`. Bei grösseren Programmen wird das schnell unübersichtlich, und gleicher Code steht an mehreren Stellen. **Funktionen** lösen beide Probleme: Ein Stück Code bekommt einen **Namen** und lässt sich beliebig oft **aufrufen**. \`printf\` und \`sqrt\` sind Funktionen, die andere geschrieben haben; jetzt schreibst du eigene.

    ~~~c
    void zeige_trennlinie(void) {
        printf("------------------------\n");
    }
    ~~~

    - \`void\` vorne heisst: Die Funktion gibt **keinen Wert** zurück.
    - \`zeige_trennlinie\` ist der **Name**; dieselben Regeln wie für Variablen.
    - \`(void)\` heisst: Sie nimmt **keine Parameter**.
    - Der **Rumpf** in geschweiften Klammern enthält die Anweisungen.

    **Aufgerufen** wird sie mit Name und Klammern: \`zeige_trennlinie();\`

    ### Was beim Aufruf passiert

    1. Das Programm merkt sich, wo es gerade ist.
    2. Es springt in die Funktion und führt ihren Rumpf aus.
    3. Am Ende (oder bei \`return\`) springt es zurück und macht direkt nach dem Aufruf weiter.

    ### Reihenfolge in der Datei

    Der Compiler liest von oben nach unten. Eine Funktion muss **vor** ihrem ersten Aufruf bekannt sein. Am einfachsten stehen eigene Funktionen darum **über** \`main\`. Eine zweite Möglichkeit, die Prototypen, lernst du in Lektion 7.3.

    ### Gute Funktionen

    - **Eine Aufgabe pro Funktion**, und der Name sagt, welche: \`zeige_status\`, \`berechne_mittelwert\`, \`motor_stoppen\`.
    - **Kurz**: Passt eine Funktion nicht mehr auf eine Bildschirmseite, lohnt es sich meist, sie aufzuteilen.

    > [!praxis] Funktionen in der Firmware
    > Mikrocontroller-Programme bestehen aus vielen kleinen Funktionen wie \`led_ein()\`, \`taster_lesen()\` oder \`motor_setzen(geschwindigkeit)\`. Die Hauptschleife ruft sie nur noch auf und liest sich dadurch fast wie ein Text.
  `,
  syntax: [
    {
      code: c`
        void name(void) {          // Definition
            anweisungen;
        }

        name();                    // Aufruf
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      void zeige_trennlinie(void) {
          printf("------------------------\n");
      }

      void zeige_kopf(void) {
          zeige_trennlinie();
          printf(" Prüfstand Getriebe G4\n");
          zeige_trennlinie();
      }

      int main(void) {
          zeige_kopf();
          printf("Drehmoment: ok\n");
          printf("Temperatur: ok\n");
          zeige_trennlinie();
          return 0;
      }
    `,
    ausgabe: out`
      ------------------------
       Prüfstand Getriebe G4
      ------------------------
      Drehmoment: ok
      Temperatur: ok
      ------------------------
    `,
  },
  zeilen: [
    { zeilen: '3-5', text: md`Definition einer Funktion ohne Rückgabewert und ohne Parameter.` },
    { zeilen: '7-11', text: md`Eine Funktion darf andere Funktionen aufrufen. \`zeige_trennlinie\` steht darüber und ist deshalb bekannt.` },
    { zeilen: '14', text: md`\`main\` ruft \`zeige_kopf\` auf. Danach geht es in Zeile 15 weiter.` },
    { zeilen: '17', text: md`Dieselbe Funktion ein drittes Mal; der Code dafür steht nur einmal im Programm.` },
  ],
  ergebnis: md`
    Die Trennlinie erscheint dreimal, obwohl sie nur einmal programmiert ist. Willst du sie ändern, etwa auf Gleichheitszeichen, änderst du eine einzige Zeile.
  `,
  fehler: [
    {
      titel: 'Klammern beim Aufruf vergessen',
      text: md`\`zeige_kopf;\` ruft nichts auf, es ist nur der Name. Clang warnt («expression result unused»).`,
      falsch: c`zeige_kopf;`,
      richtig: c`zeige_kopf();`,
    },
    {
      titel: 'Funktion nach main ohne Prototyp',
      text: md`Steht die Definition unter \`main\`, kennt der Compiler sie beim Aufruf noch nicht: «call to undeclared function».`,
    },
    {
      titel: 'Funktion in einer Funktion definiert',
      text: md`In C darf man Funktionen nicht ineinander definieren. Jede Funktion steht für sich auf oberster Ebene der Datei.`,
    },
  ],
  uebungen: [
    {
      id: 'k07-l01-u1',
      typ: 'vorhersage',
      titel: 'Reihenfolge der Aufrufe',
      stufe: 1,
      themen: ['funktionen'],
      code: c`
        #include <stdio.h>

        void a(void) {
            printf("A");
        }

        void b(void) {
            printf("B");
            a();
        }

        int main(void) {
            a();
            b();
            a();
            printf("\n");
            return 0;
        }
      `,
      ausgabe: out`
        ABAA
      `,
    },
    {
      id: 'k07-l01-u2',
      typ: 'erweitern',
      titel: 'Warnsignal',
      stufe: 1,
      themen: ['funktionen'],
      aufgabe: md`
        Schreibe eine Funktion \`void warnsignal(void)\`, die \`*** ACHTUNG ***\` ausgibt, und rufe sie in \`main\` an den beiden markierten Stellen auf.

        ~~~text
        *** ACHTUNG ***
        Roboter fährt an
        *** ACHTUNG ***
        ~~~
      `,
      start: c`
        #include <stdio.h>

        // hier die Funktion warnsignal

        int main(void) {
            // Aufruf
            printf("Roboter fährt an\n");
            // Aufruf
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        void warnsignal(void) {
            printf("*** ACHTUNG ***\n");
        }

        int main(void) {
            warnsignal();
            printf("Roboter fährt an\n");
            warnsignal();
            return 0;
        }
      `,
      tests: [{ name: 'Ausgabe mit zwei Warnsignalen', erwartet: { stdout: '*** ACHTUNG ***\nRoboter fährt an\n*** ACHTUNG ***\n' } }],
      regeln: [{ muss: 'void\\s+warnsignal\\s*\\(\\s*void\\s*\\)', meldung: 'Definiere `void warnsignal(void)`.' }, { muss: 'warnsignal\\s*\\(\\s*\\)\\s*;[\\s\\S]*warnsignal\\s*\\(\\s*\\)\\s*;', meldung: 'Rufe `warnsignal()` zweimal auf.' }],
      hinweise: [md`Die Funktion steht über \`main\` und enthält ein \`printf\`.`],
    },
    {
      id: 'k07-l01-u3',
      typ: 'fehlersuche',
      titel: 'Unbekannte Funktion',
      stufe: 2,
      themen: ['funktionen'],
      aufgabe: md`
        Das Programm soll \`Systemstart\` und dann \`Bereit\` ausgeben, lässt sich aber nicht übersetzen. Ordne die Funktionen so, dass es funktioniert.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            starten();
            return 0;
        }

        void starten(void) {
            printf("Systemstart\n");
            printf("Bereit\n");
        }
      `,
      loesung: c`
        #include <stdio.h>

        void starten(void) {
            printf("Systemstart\n");
            printf("Bereit\n");
        }

        int main(void) {
            starten();
            return 0;
        }
      `,
      tests: [{ name: 'Start und Bereit', erwartet: { stdout: 'Systemstart\nBereit\n' } }],
      hinweise: [md`Der Compiler liest von oben nach unten. Wo muss \`starten\` stehen?`],
    },
  ],
  wissenscheck: [
    {
      id: 'k07-l01-c1',
      typ: 'auswahl',
      themen: ['funktionen'],
      frage: 'Was bedeutet `void` vor dem Funktionsnamen?',
      optionen: [{ text: 'Die Funktion gibt keinen Wert zurück.', richtig: true }, { text: 'Die Funktion ist leer.' }, { text: 'Die Funktion wird nie aufgerufen.' }],
    },
    {
      id: 'k07-l01-c2',
      typ: 'wahrfalsch',
      themen: ['funktionen'],
      aussage: 'Nach dem Ende einer Funktion macht das Programm direkt hinter der Stelle weiter, an der sie aufgerufen wurde.',
      richtig: true,
    },
    {
      id: 'k07-l01-c3',
      typ: 'auswahl',
      themen: ['funktionen', 'stil'],
      frage: 'Welcher Funktionsname ist am besten?',
      optionen: [{ text: '`motor_stoppen`', richtig: true }, { text: '`f1`', warum: 'Sagt nichts aus.' }, { text: '`machAlles`', warum: 'Eine Funktion sollte eine Aufgabe haben.' }],
    },
  ],
  zusammenfassung: [
    'Eine Funktion ist benannter Code, der sich beliebig oft aufrufen lässt.',
    'Definition: `void name(void) { … }`, Aufruf: `name();`.',
    'Funktionen müssen vor dem ersten Aufruf bekannt sein; am einfachsten stehen sie über `main`.',
    'Eine Aufgabe pro Funktion, mit einem Namen, der sie beschreibt.',
  ],
  referenz: ['funktion', 'void'],
};
