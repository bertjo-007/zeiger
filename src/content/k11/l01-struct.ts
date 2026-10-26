import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k11-l01',
  titel: 'Strukturen definieren und verwenden',
  dauer: 25,
  stichwoerter: ['struct', 'Struktur', 'Komponente', 'Member', 'Punktoperator', 'Verbund', 'Datensatz', 'Padding'],
  lernziele: [
    'einen eigenen Strukturtyp mit `struct` definieren',
    'Strukturvariablen anlegen, initialisieren und mit `.` auf Komponenten zugreifen',
    'erklären, was beim Kopieren einer Struktur passiert',
  ],
  erklaerung: md`
    Ein Sensor hat einen Namen, einen Messwert und einen Zustand. Mit einzelnen Variablen wie \`name1\`, \`wert1\`, \`aktiv1\` wird das schnell unübersichtlich. Eine **Struktur** fasst zusammengehörige Werte verschiedener Typen zu einem neuen Typ zusammen:

    ~~~c
    struct Sensor {
        char name[12];
        double wert;
        int aktiv;
    };
    ~~~

    \`struct Sensor\` ist jetzt ein Typ wie \`int\`. Die Teile heissen **Komponenten** (englisch *members*). Die Definition endet mit einem Semikolon nach der schliessenden Klammer.

    ### Variablen und Zugriff

    ~~~c
    struct Sensor t1 = {"Vorlauf", 42.5, 1};   // Werte in der Reihenfolge der Komponenten
    t1.wert = 43.0;                            // Punktoperator
    ~~~

    Mit dem **Punktoperator** \`.\` greift man auf eine Komponente zu. \`t1.wert\` verhält sich wie eine gewöhnliche \`double\`-Variable.

    ### Kopieren und Vergleichen

    Strukturen lassen sich mit \`=\` als Ganzes **kopieren**, auch wenn sie Arrays enthalten. Danach sind es zwei unabhängige Variablen. **Vergleichen** mit \`==\` geht dagegen nicht; man vergleicht die Komponenten einzeln.

    ### Grösse

    \`sizeof\` einer Struktur ist oft grösser als die Summe ihrer Komponenten. Der Compiler fügt Füllbytes (*padding*) ein, damit z. B. ein \`double\` an einer durch 8 teilbaren Adresse liegt. Darum immer \`sizeof\` verwenden und nie selbst zusammenzählen.

    > [!praxis] Auf dem Mikrocontroller
    > Konfigurationen, Messpakete und Protokoll-Telegramme sind fast immer Strukturen. Wer sie über eine Schnittstelle schickt, muss die Füllbytes kennen; dazu mehr bei den Bitfeldern.
  `,
  syntax: [
    {
      code: c`
        struct Name {
            typ komponente1;
            typ komponente2;
        };

        struct Name variable = {wert1, wert2};
        variable.komponente1 = wert;
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      struct Sensor {
          char name[12];
          double wert;
          int aktiv;
      };

      int main(void) {
          struct Sensor t1 = {"Vorlauf", 42.5, 1};
          struct Sensor t2 = t1;

          t2.wert = 38.0;
          t2.aktiv = 0;

          printf("%s: %.1f °C, aktiv %d\n", t1.name, t1.wert, t1.aktiv);
          printf("%s: %.1f °C, aktiv %d\n", t2.name, t2.wert, t2.aktiv);
          printf("Grösse: %zu Byte\n", sizeof t1);
          return 0;
      }
    `,
    ausgabe: out`
      Vorlauf: 42.5 °C, aktiv 1
      Vorlauf: 38.0 °C, aktiv 0
      Grösse: 32 Byte
    `,
  },
  zeilen: [
    { zeilen: '3-7', text: md`Definition des Typs \`struct Sensor\` mit drei Komponenten. Noch wird kein Speicher belegt.` },
    { zeilen: '10', text: md`Eine Variable des neuen Typs, initialisiert in der Reihenfolge der Komponenten.` },
    { zeilen: '11', text: md`Kopie der ganzen Struktur, inklusive des Namens im Array.` },
    { zeilen: '13-14', text: md`Änderungen an der Kopie betreffen \`t1\` nicht.` },
    { zeilen: '18', text: md`12 + 8 + 4 = 24 Byte Inhalt, aber 32 Byte gesamt: Vor dem \`double\` und am Ende liegen Füllbytes.` },
  ],
  ergebnis: md`
    Beide Sensoren heissen «Vorlauf», weil \`t2\` als Kopie von \`t1\` entstanden ist. Wert und Zustand wurden nur bei \`t2\` geändert. Die Struktur belegt 32 Byte, obwohl ihre Komponenten zusammen nur 24 Byte brauchen.
  `,
  fehler: [
    {
      titel: 'Semikolon nach der Definition vergessen',
      text: md`Nach der schliessenden Klammer der Strukturdefinition gehört ein \`;\`. Ohne es meldet Clang einen Fehler in der **nächsten** Zeile, was verwirrend sein kann.`,
      falsch: c`
        struct Punkt {
            int x;
            int y;
        }
      `,
      richtig: c`
        struct Punkt {
            int x;
            int y;
        };
      `,
    },
    {
      titel: 'struct beim Typ vergessen',
      text: md`Ohne \`typedef\` heisst der Typ \`struct Sensor\`, nicht \`Sensor\`. Clang meldet «unknown type name 'Sensor'». Die nächste Lektion zeigt, wie \`typedef\` das abkürzt.`,
    },
    {
      titel: 'Strukturen mit == vergleichen',
      text: md`\`if (a == b)\` ist für Strukturen ein Compilerfehler («invalid operands to binary expression»). Vergleiche die Komponenten einzeln.`,
    },
  ],
  uebungen: [
    {
      id: 'k11-l01-u1',
      typ: 'vorhersage',
      titel: 'Kopie oder dieselbe Variable?',
      stufe: 1,
      themen: ['strukturen'],
      code: c`
        #include <stdio.h>

        struct Achse {
            char name;
            int position;
        };

        int main(void) {
            struct Achse a = {'X', 100};
            struct Achse b = a;
            b.position += 50;
            a.name = 'Y';
            printf("%c %d %c %d\n", a.name, a.position, b.name, b.position);
            return 0;
        }
      `,
      ausgabe: out`
        Y 100 X 150
      `,
      erklaerung: md`\`b\` ist eine unabhängige Kopie. Spätere Änderungen an \`a\` oder \`b\` wirken nur auf die jeweilige Variable.`,
    },
    {
      id: 'k11-l01-u2',
      typ: 'luecke',
      titel: 'Komponenten ansprechen',
      stufe: 1,
      themen: ['strukturen'],
      frage: 'Ergänze so, dass das Ventil geöffnet und seine Nummer ausgegeben wird.',
      code: c`
        #include <stdio.h>

        struct Ventil {
            int nummer;
            int offen;
        };

        int main(void) {
            struct Ventil v = {7, 0};
            v__1__offen = 1;
            printf("Ventil %d: %d\n", __2__, v.offen);
            return 0;
        }
      `,
      luecken: [['.'], ['v.nummer']],
      ausgabe: 'Ventil 7: 1\n',
    },
    {
      id: 'k11-l01-u3',
      typ: 'programm',
      titel: 'Weg eines Portals',
      stufe: 2,
      themen: ['strukturen', 'funktionen'],
      aufgabe: md`
        Ein Portal fährt nur parallel zu den Achsen. Definiere \`struct Punkt\` mit den Komponenten \`int x\` und \`int y\` und schreibe \`int manhattan(struct Punkt a, struct Punkt b)\`: die Summe der Beträge der Differenzen in x und in y.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            struct Punkt start = {1, 2};
            struct Punkt ziel = {4, -2};
            printf("%d\n", manhattan(start, ziel));
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdlib.h>

        struct Punkt {
            int x;
            int y;
        };

        int manhattan(struct Punkt a, struct Punkt b) {
            return abs(b.x - a.x) + abs(b.y - a.y);
        }

        int main(void) {
            struct Punkt start = {1, 2};
            struct Punkt ziel = {4, -2};
            printf("%d\n", manhattan(start, ziel));
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        struct Punkt {
            int x;
            int y;
        };
        int manhattan(struct Punkt a, struct Punkt b);
        int main(void) {
            struct Punkt a = {1, 2};
            struct Punkt b = {4, -2};
            struct Punkt c = {-3, 5};
            printf("%d %d %d\n", manhattan(a, b), manhattan(b, a), manhattan(c, c));
            return 0;
        }
      `,
      tests: [{ name: 'Drei Wege', erwartet: { stdout: '7 7 0\n' }, tipp: md`Die Differenzen können negativ sein. \`abs\` aus \`<stdlib.h>\` liefert den Betrag.` }],
      hinweise: [md`Die Definition gehört über die Funktion: \`struct Punkt { int x; int y; };\``, md`\`abs(b.x - a.x) + abs(b.y - a.y)\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k11-l01-c1',
      typ: 'auswahl',
      themen: ['strukturen'],
      frage: 'Mit welchem Operator greift man auf eine Komponente einer Strukturvariable zu?',
      optionen: [{ text: '`.`', richtig: true }, { text: '`:`' }, { text: '`#`' }],
    },
    {
      id: 'k11-l01-c2',
      typ: 'wahrfalsch',
      themen: ['strukturen'],
      aussage: '`sizeof` einer Struktur ist immer genau die Summe der Grössen ihrer Komponenten.',
      richtig: false,
      erklaerung: 'Der Compiler kann Füllbytes einfügen.',
    },
    {
      id: 'k11-l01-c3',
      typ: 'wahrfalsch',
      themen: ['strukturen'],
      aussage: 'Eine Struktur, die ein Array enthält, kann mit `=` kopiert werden.',
      richtig: true,
    },
  ],
  zusammenfassung: [
    '`struct Name { … };` definiert einen neuen Typ aus mehreren Komponenten.',
    'Zugriff mit dem Punktoperator: `variable.komponente`.',
    '`=` kopiert die ganze Struktur; `==` funktioniert nicht.',
    'Füllbytes machen Strukturen oft grösser als die Summe ihrer Teile.',
  ],
  referenz: ['struct', 'punkt-pfeil'],
};
