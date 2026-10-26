import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'exit-success',
    name: 'EXIT_SUCCESS / EXIT_FAILURE',
    kategorie: 'makro',
    header: 'stdlib.h',
    kurz: md`Lesbare Namen für den Rückgabewert von \`main\` und für \`exit\`: Erfolg (0) oder Fehler.`,
    syntax: c`
      return EXIT_SUCCESS;
      return EXIT_FAILURE;
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            printf("Konfiguration fehlt\n");
            return EXIT_FAILURE;
        }
      `,
      ausgabe: out`
        Konfiguration fehlt
      `,
    },
    fehler: [md`\`<stdlib.h>\` vergessen: Dann sind die Namen unbekannt.`],
    lektionen: ['k01-l02', 'k01-l06'],
    stichwoerter: ['Rückgabewert', 'Exit-Code', 'Erfolg', 'Fehler'],
  },
];
