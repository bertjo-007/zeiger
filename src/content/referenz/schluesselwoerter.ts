import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'return',
    name: 'return',
    kategorie: 'schluesselwort',
    kurz: md`Beendet die aktuelle Funktion und gibt einen Wert an den Aufrufer zurück. In \`main\` geht der Wert an das Betriebssystem.`,
    syntax: c`
      return ausdruck;   // in Funktionen mit Rückgabewert
      return;            // in void-Funktionen
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("Selbsttest ok\n");
            return 0;
        }
      `,
      ausgabe: out`
        Selbsttest ok
      `,
    },
    fehler: [md`Code nach \`return\` wird nie ausgeführt.`, md`In einer Funktion mit Rückgabetyp fehlt auf einem Weg das \`return\`. Clang warnt: «non-void function does not return a value».`],
    lektionen: ['k01-l02'],
    stichwoerter: ['zurückgeben', 'beenden', 'Rückgabewert'],
  },
];
