import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'main',
    name: 'main',
    kategorie: 'konstrukt',
    kurz: md`Die Hauptfunktion. Hier beginnt jedes C-Programm. Der Rückgabewert meldet dem Betriebssystem Erfolg (\`0\`) oder einen Fehler.`,
    syntax: c`
      int main(void) { … }
      int main(int argc, char *argv[]) { … }
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("Programm gestartet\n");
            return 0;
        }
      `,
      ausgabe: out`
        Programm gestartet
      `,
    },
    fehler: [md`\`void main()\` ist kein Standard-C. Richtig ist \`int main(void)\`.`, md`\`return 0;\` vergessen: In \`main\` ist das seit C99 erlaubt (dann gilt 0), in anderen Funktionen ein Fehler.`],
    lektionen: ['k01-l01', 'k01-l02'],
    stichwoerter: ['Hauptfunktion', 'Start', 'Einstiegspunkt'],
  },
  {
    id: 'kommentar',
    name: '// und /* */',
    kategorie: 'konstrukt',
    kurz: md`Kommentare: Text für Menschen, den der Compiler ignoriert. \`//\` bis zum Zeilenende, \`/* … */\` auch über mehrere Zeilen.`,
    syntax: c`
      // einzeilig
      /* mehrzeilig
         bis hierher */
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            // Grenzwert laut Datenblatt
            printf("Maximal 85 Grad\n");
            /* printf("Testausgabe\n"); */
            return 0;
        }
      `,
      ausgabe: out`
        Maximal 85 Grad
      `,
    },
    fehler: [md`\`/* … */\` lässt sich nicht verschachteln.`, md`Vergessenes \`*/\` verschluckt den folgenden Code.`],
    lektionen: ['k01-l04'],
    stichwoerter: ['Kommentar', 'auskommentieren'],
  },
  {
    id: 'funktion',
    name: 'Funktion',
    kategorie: 'konstrukt',
    kurz: md`Benannter Code mit Parametern und Rückgabewert. Prototyp (\`;\`) kündigt an, Definition (\`{ … }\`) liefert den Code. Argumente werden als Kopie übergeben.`,
    syntax: c`
      int summe(int a, int b);            // Prototyp
      int summe(int a, int b) {           // Definition
          return a + b;
      }
      int x = summe(3, 4);                // Aufruf
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        double flaeche(double l, double b) {
            return l * b;
        }

        int main(void) {
            printf("%.1f m2\n", flaeche(4.0, 2.5));
            return 0;
        }
      `,
      ausgabe: out`
        10.0 m2
      `,
    },
    fehler: [md`Aufruf vor Deklaration: «call to undeclared function».`, md`Fehlendes \`return\` auf einem Weg.`, md`Prototyp und Definition passen nicht zusammen.`],
    lektionen: ['k07-l01', 'k07-l02', 'k07-l03', 'k07-l05', 'k07-l06'],
    stichwoerter: ['Prototyp', 'Parameter', 'Aufruf', 'Definition', 'Unterprogramm'],
  },
  {
    id: 'gueltigkeit',
    name: 'Gültigkeitsbereich',
    kategorie: 'konstrukt',
    kurz: md`Lokale Variablen gelten in ihrem Block und leben, solange er läuft. Globale Variablen stehen ausserhalb aller Funktionen und leben das ganze Programm.`,
    syntax: c`
      int global = 0;
      void f(void) {
          int lokal = 1;
      }
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int aufrufe = 0;

        void f(void) {
            int lokal = 0;
            lokal++;
            aufrufe++;
            printf("lokal %d, aufrufe %d\n", lokal, aufrufe);
        }

        int main(void) {
            f();
            f();
            return 0;
        }
      `,
      ausgabe: out`
        lokal 1, aufrufe 1
        lokal 1, aufrufe 2
      `,
    },
    fehler: [md`Variable nach dem Block verwenden, in dem sie deklariert wurde.`, md`Globale Variable durch gleichnamige lokale überdeckt.`],
    lektionen: ['k07-l04', 'k14-l01'],
    stichwoerter: ['lokal', 'global', 'Scope', 'Lebensdauer'],
  },
];
