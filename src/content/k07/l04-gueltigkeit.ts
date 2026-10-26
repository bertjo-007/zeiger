import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k07-l04',
  titel: 'Lokale und globale Variablen',
  dauer: 20,
  stichwoerter: ['lokal', 'global', 'Gültigkeitsbereich', 'Scope', 'Block', 'Überdeckung', 'Shadowing', 'Lebensdauer'],
  lernziele: [
    'erklären, wo eine Variable gilt (Gültigkeitsbereich)',
    'lokale und globale Variablen unterscheiden',
    'begründen, warum globale Variablen sparsam eingesetzt werden',
  ],
  erklaerung: md`
    Jede Variable gilt nur in einem bestimmten Bereich des Programms, ihrem **Gültigkeitsbereich** (englisch scope).

    ### Lokale Variablen

    Eine Variable, die **in einem Block** \`{ … }\` deklariert wird, ist **lokal**: Sie gilt nur in diesem Block, ab der Deklaration. Das betrifft auch Parameter und den Zähler einer \`for\`-Schleife.

    - Zwei Funktionen dürfen lokale Variablen mit **gleichem Namen** haben; es sind verschiedene Variablen.
    - Eine lokale Variable **entsteht** beim Betreten des Blocks und **verschwindet** beim Verlassen. Beim nächsten Aufruf der Funktion ist ihr alter Wert weg.

    ### Globale Variablen

    Eine Variable **ausserhalb aller Funktionen** ist **global**: Alle Funktionen der Datei darunter können sie lesen und ändern. Sie existiert die ganze Programmlaufzeit und ist automatisch mit 0 initialisiert.

    ~~~c
    int fehlerzaehler = 0;     // global

    void melde_fehler(void) {
        fehlerzaehler++;
    }
    ~~~

    ### Warum sparsam mit globalen Variablen?

    Wenn jede Funktion eine Variable ändern kann, ist bei einem falschen Wert schwer herauszufinden, **welche** es war. Funktionen, die nur mit ihren Parametern und ihrem Rückgabewert arbeiten, sind leichter zu verstehen, zu testen und wiederzuverwenden. Faustregel: lokal, wo immer möglich; global nur für Werte, die wirklich das ganze Programm betreffen, und dann mit gutem Namen.

    ### Überdeckung

    Hat eine lokale Variable denselben Namen wie eine globale, **überdeckt** die lokale die globale: Im Block gilt nur die lokale. Das ist erlaubt, führt aber leicht zu Verwechslungen. Vermeide gleiche Namen.

    > [!praxis] Globale Variablen auf Mikrocontrollern
    > Auf Mikrocontrollern sind globale Variablen häufiger, weil Interrupt-Routinen (Kapitel 15) keine Parameter bekommen und Daten nur über globale Variablen mit dem Hauptprogramm austauschen können. Dort werden sie mit \`volatile\` gekennzeichnet.
  `,
  syntax: [
    {
      code: c`
        int global = 0;            // gilt in der ganzen Datei (ab hier)

        void f(int parameter) {    // parameter: lokal in f
            int lokal = 5;         // lokal in f
            for (int i = 0; i < 3; i++) {
                int ganz_lokal = i;   // nur in diesem Schleifenblock
            }
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int stoerungen = 0;     // global: zählt alle Störungen

      void pruefe_temperatur(int temperatur) {
          int grenze = 80;    // lokal
          if (temperatur > grenze) {
              stoerungen++;
              printf("Temperatur %d zu hoch\n", temperatur);
          }
      }

      void pruefe_druck(int druck) {
          int grenze = 8;     // anderes "grenze", ebenfalls lokal
          if (druck > grenze) {
              stoerungen++;
              printf("Druck %d zu hoch\n", druck);
          }
      }

      int main(void) {
          pruefe_temperatur(85);
          pruefe_druck(6);
          pruefe_druck(9);
          printf("Störungen gesamt: %d\n", stoerungen);
          return 0;
      }
    `,
    ausgabe: out`
      Temperatur 85 zu hoch
      Druck 9 zu hoch
      Störungen gesamt: 2
    `,
  },
  zeilen: [
    { zeilen: '3', text: md`Globale Variable, sichtbar in allen Funktionen darunter.` },
    { zeilen: '6', text: md`\`grenze\` ist lokal. Sie gibt es nur während \`pruefe_temperatur\` läuft.` },
    { zeilen: '14', text: md`Ein zweites \`grenze\` mit anderem Wert; die beiden stören sich nicht.` },
    { zeilen: '16', text: md`Beide Funktionen erhöhen dieselbe globale Variable.` },
  ],
  ergebnis: md`
    Zwei Grenzwerte wurden überschritten, und der globale Zähler zeigt 2. Die beiden lokalen \`grenze\`-Variablen sind unabhängig voneinander.
  `,
  fehler: [
    {
      titel: 'Variable ausserhalb ihres Blocks verwendet',
      text: md`Eine im \`if\`- oder Schleifenblock deklarierte Variable gibt es danach nicht mehr: «use of undeclared identifier».`,
      falsch: c`
        if (x > 0) {
            int ergebnis = x * 2;
        }
        printf("%d\n", ergebnis);
      `,
      richtig: c`
        int ergebnis = 0;
        if (x > 0) {
            ergebnis = x * 2;
        }
        printf("%d\n", ergebnis);
      `,
    },
    {
      titel: 'Lokale Variable behält ihren Wert nicht',
      text: md`Eine lokale Variable wird bei jedem Aufruf neu angelegt. Ein Zähler darin beginnt jedes Mal von vorn. Abhilfe: Rückgabewert, globale Variable oder \`static\` (Kapitel 14).`,
    },
    {
      titel: 'Überdeckte globale Variable',
      text: md`Ein lokales \`int stoerungen = 0;\` in einer Funktion versteckt die globale; Änderungen landen dann in der lokalen.`,
    },
  ],
  uebungen: [
    {
      id: 'k07-l04-u1',
      typ: 'vorhersage',
      titel: 'Welches x?',
      stufe: 2,
      themen: ['gueltigkeit', 'funktionen'],
      code: c`
        #include <stdio.h>

        int x = 1;

        void f(void) {
            int x = 10;
            x++;
            printf("f: %d\n", x);
        }

        void g(void) {
            x++;
            printf("g: %d\n", x);
        }

        int main(void) {
            f();
            g();
            f();
            printf("main: %d\n", x);
            return 0;
        }
      `,
      ausgabe: out`
        f: 11
        g: 2
        f: 11
        main: 2
      `,
      erklaerung: md`\`f\` arbeitet mit einem eigenen, lokalen \`x\`, das bei jedem Aufruf neu mit 10 beginnt. \`g\` ändert das globale \`x\`.`,
    },
    {
      id: 'k07-l04-u2',
      typ: 'fehlersuche',
      titel: 'Ergebnis verschwunden',
      stufe: 1,
      themen: ['gueltigkeit'],
      aufgabe: md`
        Das Programm soll bei einer positiven Eingabe ihr Doppeltes ausgeben, sonst 0. Es lässt sich nicht übersetzen. Bei 21: \`Ergebnis: 42\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int x = 0;
            scanf("%d", &x);
            if (x > 0) {
                int ergebnis = x * 2;
            }
            printf("Ergebnis: %d\n", ergebnis);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int x = 0;
            scanf("%d", &x);
            int ergebnis = 0;
            if (x > 0) {
                ergebnis = x * 2;
            }
            printf("Ergebnis: %d\n", ergebnis);
            return 0;
        }
      `,
      tests: [
        { name: '21', stdin: '21\n', erwartet: { stdout: 'Ergebnis: 42\n' } },
        { name: '-3', stdin: '-3\n', erwartet: { stdout: 'Ergebnis: 0\n' } },
      ],
      hinweise: [md`Wo endet der Gültigkeitsbereich von \`ergebnis\`?`, md`Deklariere \`ergebnis\` vor dem \`if\`.`],
    },
    {
      id: 'k07-l04-u3',
      typ: 'programm',
      titel: 'Ohne globale Variable',
      stufe: 3,
      themen: ['gueltigkeit', 'funktionen', 'stil'],
      aufgabe: md`
        Das Programm unten zählt Impulse über eine globale Variable. Baue es so um, dass **keine globale Variable** mehr nötig ist: \`int addiere_impulse(int bisher, int neu)\` bekommt den bisherigen Stand und gibt den neuen zurück. Die Ausgabe bleibt \`Impulse: 75\`.
      `,
      start: c`
        #include <stdio.h>

        int impulse = 0;

        void addiere_impulse(int neu) {
            impulse += neu;
        }

        int main(void) {
            addiere_impulse(30);
            addiere_impulse(45);
            printf("Impulse: %d\n", impulse);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int addiere_impulse(int bisher, int neu) {
            return bisher + neu;
        }

        int main(void) {
            int impulse = 0;
            impulse = addiere_impulse(impulse, 30);
            impulse = addiere_impulse(impulse, 45);
            printf("Impulse: %d\n", impulse);
            return 0;
        }
      `,
      tests: [{ name: 'Ausgabe unverändert', erwartet: { stdout: 'Impulse: 75\n' } }],
      regeln: [
        { darfNicht: '^int\\s+impulse\\s*=', meldung: 'Entferne die globale Variable `impulse`.' },
        { muss: 'int\\s+addiere_impulse\\s*\\(\\s*int\\s+\\w+\\s*,\\s*int\\s+\\w+\\s*\\)', meldung: 'Schreibe `int addiere_impulse(int bisher, int neu)`.' },
      ],
      hinweise: [md`\`impulse\` wird eine lokale Variable in \`main\`.`, md`Aufruf: \`impulse = addiere_impulse(impulse, 30);\``],
    },
  ],
  wissenscheck: [
    {
      id: 'k07-l04-c1',
      typ: 'wahrfalsch',
      themen: ['gueltigkeit'],
      aussage: 'Zwei verschiedene Funktionen dürfen je eine lokale Variable namens `summe` haben.',
      richtig: true,
    },
    {
      id: 'k07-l04-c2',
      typ: 'auswahl',
      themen: ['gueltigkeit'],
      frage: 'Wie lange existiert eine lokale Variable einer Funktion?',
      optionen: [{ text: 'Während die Funktion läuft', richtig: true }, { text: 'Die ganze Programmlaufzeit', warum: 'Das gilt für globale (und static) Variablen.' }, { text: 'Bis zum nächsten Aufruf' }],
    },
    {
      id: 'k07-l04-c3',
      typ: 'auswahl',
      themen: ['gueltigkeit', 'stil'],
      frage: 'Warum sollte man globale Variablen sparsam verwenden?',
      optionen: [{ text: 'Weil jede Funktion sie ändern kann und Fehler schwer zu finden sind', richtig: true }, { text: 'Weil sie langsamer sind' }, { text: 'Weil C sie nicht erlaubt' }],
    },
  ],
  zusammenfassung: [
    'Lokale Variablen gelten nur in ihrem Block und leben nur, solange er läuft.',
    'Globale Variablen stehen ausserhalb aller Funktionen, gelten überall darunter und leben das ganze Programm.',
    'Gleiche lokale Namen in verschiedenen Funktionen stören sich nicht.',
    'Lieber Parameter und Rückgabewerte als globale Variablen.',
  ],
  referenz: ['gueltigkeit'],
};
