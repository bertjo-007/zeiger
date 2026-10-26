import { c, md } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'fmt-prozent',
    name: '%%',
    kategorie: 'format',
    kurz: md`Gibt in \`printf\` ein echtes Prozentzeichen aus.`,
    syntax: c`printf("50 %%\n");`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("Akku: 80 %%\n");
            return 0;
        }
      `,
      ausgabe: 'Akku: 80 %\n',
    },
    fehler: [md`Ein einzelnes \`%\` hält printf für einen Platzhalter. Clang warnt, die Ausgabe ist unvorhersehbar.`],
    lektionen: ['k01-l03'],
    stichwoerter: ['Prozent', 'Prozentzeichen'],
  },
];
