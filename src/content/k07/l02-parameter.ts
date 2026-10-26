import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k07-l02',
  titel: 'Parameter, Rückgabewerte und void',
  dauer: 30,
  stichwoerter: ['Parameter', 'Argument', 'Rückgabewert', 'return', 'void', 'Rückgabetyp', 'Funktionskopf', 'bool-Funktion'],
  lernziele: [
    'Funktionen mit Parametern schreiben und mit Argumenten aufrufen',
    'mit `return` einen Wert zurückgeben und ihn beim Aufrufer verwenden',
    'zwischen Funktionen mit und ohne Rückgabewert (`void`) unterscheiden',
  ],
  erklaerung: md`
    Eine Funktion wird erst richtig nützlich, wenn sie **Werte bekommt** und **ein Ergebnis liefert**, so wie \`sqrt(2.0)\` die Zahl 2 bekommt und ihre Wurzel liefert.

    ~~~c
    double leistung(double spannung, double strom) {
        return spannung * strom;
    }
    ~~~

    - **Parameter** stehen im Funktionskopf, jeder mit Typ und Name, durch Kommas getrennt. Im Rumpf sind sie normale Variablen.
    - Der **Rückgabetyp** vorne (\`double\`) sagt, welchen Typ das Ergebnis hat.
    - **\`return\`** beendet die Funktion und liefert den Wert an den Aufrufer.

    Beim **Aufruf** stehen in den Klammern die **Argumente**, die konkreten Werte, in derselben Reihenfolge wie die Parameter:

    ~~~c
    double p = leistung(230.0, 1.5);   // spannung = 230.0, strom = 1.5
    ~~~

    Das Ergebnis kann man speichern, ausgeben oder direkt weiterverwenden: \`printf("%.1f\n", leistung(12.0, 2.0));\`

    ### return

    - Eine Funktion mit Rückgabetyp muss auf **jedem** Weg ein \`return\` mit Wert erreichen. Fehlt es, warnt Clang («non-void function does not return a value in all control paths»), und der Aufrufer bekommt einen zufälligen Wert.
    - Eine Funktion darf mehrere \`return\` haben, etwa in einem \`if\`. Das erste erreichte beendet sie.
    - In einer \`void\`-Funktion beendet ein \`return;\` ohne Wert die Funktion vorzeitig.

    ### Funktionen, die etwas prüfen

    Funktionen, die nur «ja» oder «nein» liefern, geben einen \`bool\` zurück und heissen wie eine Frage:

    ~~~c
    bool ist_im_bereich(int wert, int min, int max) {
        return wert >= min && wert <= max;
    }
    ~~~

    > [!tipp] Rechnen und Ausgeben trennen
    > Eine Funktion, die **rechnet** und das Ergebnis **zurückgibt**, ist vielseitiger als eine, die es selbst ausgibt. Der Aufrufer entscheidet dann, ob er es anzeigt, speichert oder weiterverarbeitet. Die Tests in den Übungen prüfen deine Funktionen genau so.
  `,
  syntax: [
    {
      code: c`
        rueckgabetyp name(typ1 param1, typ2 param2) {
            …
            return wert;
        }

        ergebnis = name(argument1, argument2);
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdbool.h>

      double leistung(double spannung, double strom) {
          return spannung * strom;
      }

      int maximum(int a, int b) {
          if (a > b) {
              return a;
          }
          return b;
      }

      bool ist_im_bereich(int wert, int min, int max) {
          return wert >= min && wert <= max;
      }

      void zeige_messwert(const char *name, double wert, const char *einheit) {
          printf("%-10s %8.2f %s\n", name, wert, einheit);
      }

      int main(void) {
          zeige_messwert("Leistung", leistung(24.0, 3.5), "W");
          zeige_messwert("Spitze", maximum(1450, 1520), "U/min");
          printf("1480 im Bereich 1400-1500: %d\n", ist_im_bereich(1480, 1400, 1500));
          return 0;
      }
    `,
    ausgabe: out`
      Leistung      84.00 W
      Spitze      1520.00 U/min
      1480 im Bereich 1400-1500: 1
    `,
  },
  zeilen: [
    { zeilen: '4-6', text: md`Zwei Parameter, Rückgabetyp \`double\`. Die Funktion rechnet nur und gibt das Ergebnis zurück.` },
    { zeilen: '8-13', text: md`Zwei \`return\`: Ist \`a\` grösser, endet die Funktion schon in Zeile 10.` },
    { zeilen: '15-17', text: md`Prüffunktion mit \`bool\` als Ergebnis.` },
    { zeilen: '19-21', text: md`Eine \`void\`-Funktion für die Ausgabe. \`const char *\` ist der Typ für einen Text; mehr dazu in Kapitel 8.` },
    { zeilen: '24', text: md`Das Ergebnis von \`leistung\` wird direkt als Argument weitergegeben. Das \`int\` von \`maximum\` wird dabei automatisch zu \`double\`.` },
  ],
  ergebnis: md`
    Jede Funktion erledigt genau eine Aufgabe: rechnen, vergleichen, prüfen oder ausgeben. \`main\` setzt sie nur noch zusammen.
  `,
  fehler: [
    {
      titel: 'return fehlt auf einem Weg',
      text: md`Wird kein \`return\` erreicht, ist das Ergebnis zufällig.`,
      falsch: c`
        int vorzeichen(int x) {
            if (x > 0) { return 1; }
            if (x < 0) { return -1; }
        }
      `,
      richtig: c`
        int vorzeichen(int x) {
            if (x > 0) { return 1; }
            if (x < 0) { return -1; }
            return 0;
        }
      `,
    },
    {
      titel: 'Rückgabewert ignoriert',
      text: md`\`leistung(24.0, 3.5);\` ohne Zuweisung berechnet zwar, verwirft das Ergebnis aber.`,
    },
    {
      titel: 'Argumente vertauscht oder zu wenige',
      text: md`Die Reihenfolge der Argumente entspricht der Reihenfolge der Parameter. Bei falscher Anzahl meldet Clang einen Fehler.`,
    },
  ],
  uebungen: [
    {
      id: 'k07-l02-u1',
      typ: 'programm',
      titel: 'Fläche eines Rechtecks',
      stufe: 1,
      themen: ['funktionen'],
      aufgabe: md`
        Schreibe die Funktion \`double flaeche(double laenge, double breite)\`, die die Fläche zurückgibt. Sie soll **nichts ausgeben**. Die Tests rufen sie mit verschiedenen Werten auf.
      `,
      start: c`
        #include <stdio.h>

        // hier die Funktion flaeche

        int main(void) {
            printf("%.2f\n", flaeche(2.0, 3.5));
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        double flaeche(double laenge, double breite) {
            return laenge * breite;
        }

        int main(void) {
            printf("%.2f\n", flaeche(2.0, 3.5));
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        double flaeche(double laenge, double breite);
        int main(void) {
            printf("%.2f\n", flaeche(2.0, 3.5));
            printf("%.2f\n", flaeche(0.5, 0.5));
            printf("%.2f\n", flaeche(12.0, 0.0));
            return 0;
        }
      `,
      tests: [{ name: 'flaeche(2.0, 3.5), flaeche(0.5, 0.5), flaeche(12.0, 0.0)', erwartet: { stdout: '7.00\n0.25\n0.00\n' } }],
      hinweise: [md`Der Rumpf besteht aus einer einzigen Zeile: \`return laenge * breite;\``],
    },
    {
      id: 'k07-l02-u2',
      typ: 'programm',
      titel: 'Maximum von drei Werten',
      stufe: 2,
      themen: ['funktionen', 'bedingungen'],
      aufgabe: md`
        Schreibe \`int max3(int a, int b, int c)\`, die den grössten der drei Werte zurückgibt. Sie soll nichts ausgeben.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            printf("%d\n", max3(3, 9, 4));
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int max3(int a, int b, int c) {
            int m = a;
            if (b > m) {
                m = b;
            }
            if (c > m) {
                m = c;
            }
            return m;
        }

        int main(void) {
            printf("%d\n", max3(3, 9, 4));
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        int max3(int a, int b, int c);
        int main(void) {
            printf("%d %d %d %d %d\n", max3(3, 9, 4), max3(9, 3, 4), max3(3, 4, 9), max3(-5, -2, -8), max3(7, 7, 7));
            return 0;
        }
      `,
      tests: [{ name: 'Verschiedene Reihenfolgen und negative Werte', erwartet: { stdout: '9 9 9 -2 7\n' }, tipp: md`Prüfe, ob das Maximum an jeder Position gefunden wird.` }],
      hinweise: [md`Starte mit \`int m = a;\` und vergleiche dann mit \`b\` und \`c\`.`],
    },
    {
      id: 'k07-l02-u3',
      typ: 'programm',
      titel: 'Gültige Drehzahl?',
      stufe: 2,
      themen: ['funktionen', 'operatoren'],
      aufgabe: md`
        Schreibe \`bool drehzahl_ok(int drehzahl, int max)\`. Sie liefert \`true\`, wenn die Drehzahl mindestens 0 und höchstens \`max\` ist.
      `,
      start: c`
        #include <stdio.h>
        #include <stdbool.h>

        int main(void) {
            printf("%d\n", drehzahl_ok(1500, 3000));
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdbool.h>

        bool drehzahl_ok(int drehzahl, int max) {
            return drehzahl >= 0 && drehzahl <= max;
        }

        int main(void) {
            printf("%d\n", drehzahl_ok(1500, 3000));
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        #include <stdbool.h>
        bool drehzahl_ok(int drehzahl, int max);
        int main(void) {
            printf("%d %d %d %d\n", drehzahl_ok(1500, 3000), drehzahl_ok(3000, 3000), drehzahl_ok(3001, 3000), drehzahl_ok(-1, 3000));
            return 0;
        }
      `,
      tests: [{ name: 'Mitte, Grenze, darüber, negativ', erwartet: { stdout: '1 1 0 0\n' } }],
      hinweise: [md`Gib den Vergleich direkt zurück: \`return … && …;\``],
    },
    {
      id: 'k07-l02-u4',
      typ: 'fehlersuche',
      titel: 'Rabattstufe',
      stufe: 3,
      themen: ['funktionen'],
      aufgabe: md`
        \`int rabatt(int menge)\` soll den Rabatt in Prozent liefern: ab 100 Stück 10, ab 50 Stück 5, sonst 0. Clang warnt, und bei kleinen Mengen kommt ein falscher Wert heraus. Korrigiere die Funktion.
      `,
      start: c`
        #include <stdio.h>

        int rabatt(int menge) {
            if (menge >= 100) {
                return 10;
            } else if (menge >= 50) {
                return 5;
            }
        }

        int main(void) {
            printf("%d %d %d\n", rabatt(120), rabatt(60), rabatt(10));
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int rabatt(int menge) {
            if (menge >= 100) {
                return 10;
            } else if (menge >= 50) {
                return 5;
            }
            return 0;
        }

        int main(void) {
            printf("%d %d %d\n", rabatt(120), rabatt(60), rabatt(10));
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        int rabatt(int menge);
        int main(void) {
            printf("%d %d %d %d\n", rabatt(120), rabatt(100), rabatt(60), rabatt(10));
            return 0;
        }
      `,
      tests: [{ name: 'Alle Stufen', erwartet: { stdout: '10 10 5 0\n' } }],
      hinweise: [md`Was gibt die Funktion zurück, wenn keine Bedingung zutrifft?`],
    },
  ],
  wissenscheck: [
    {
      id: 'k07-l02-c1',
      typ: 'zuordnen',
      themen: ['funktionen'],
      frage: 'Ordne die Begriffe zu: `double p = leistung(230.0, 2.0);` mit `double leistung(double u, double i)`.',
      paare: [
        { links: '`u` und `i`', rechts: 'Parameter' },
        { links: '`230.0` und `2.0`', rechts: 'Argumente' },
        { links: '`double` vor `leistung`', rechts: 'Rückgabetyp' },
        { links: '`p`', rechts: 'speichert den Rückgabewert' },
      ],
    },
    {
      id: 'k07-l02-c2',
      typ: 'vorhersage',
      themen: ['funktionen'],
      code: c`
        #include <stdio.h>

        int quadrat(int x) {
            return x * x;
        }

        int main(void) {
            printf("%d\n", quadrat(3) + quadrat(quadrat(2)));
            return 0;
        }
      `,
      ausgabe: out`
        25
      `,
      erklaerung: md`\`quadrat(3)\` ist 9, \`quadrat(2)\` ist 4, \`quadrat(4)\` ist 16; 9 + 16 = 25.`,
    },
    {
      id: 'k07-l02-c3',
      typ: 'wahrfalsch',
      themen: ['funktionen'],
      aussage: 'Eine `void`-Funktion kann mit `return 5;` einen Wert zurückgeben.',
      richtig: false,
    },
  ],
  zusammenfassung: [
    'Parameter im Funktionskopf, Argumente beim Aufruf, in derselben Reihenfolge.',
    '`return wert;` beendet die Funktion und liefert das Ergebnis; jeder Weg braucht ein `return`.',
    '`void` = kein Rückgabewert; `return;` beendet sie vorzeitig.',
    'Rechnende Funktionen geben zurück statt auszugeben; Prüffunktionen liefern `bool`.',
  ],
  referenz: ['funktion', 'return', 'void'],
};
