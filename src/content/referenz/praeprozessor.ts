import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'include',
    name: '#include',
    kategorie: 'praeprozessor',
    kurz: md`Fügt den Inhalt einer Header-Datei an dieser Stelle ein. \`<…>\` sucht in den Systemverzeichnissen, \`"…"\` zuerst im eigenen Projekt.`,
    syntax: c`
      #include <stdio.h>
      #include "motor.h"
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <math.h>

        int main(void) {
            printf("Wurzel aus 2: %.3f\n", sqrt(2.0));
            return 0;
        }
      `,
      ausgabe: out`
        Wurzel aus 2: 1.414
      `,
    },
    fehler: [md`Header vergessen: Der Compiler kennt die Funktion dann nicht (\`call to undeclared library function\`).`, md`Tippfehler im Namen, z. B. \`studio.h\` statt \`stdio.h\`.`],
    lektionen: ['k01-l01'],
    stichwoerter: ['Header', 'einbinden', 'Bibliothek'],
  },
];
