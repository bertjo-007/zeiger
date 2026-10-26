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
  {
    id: 'int-max',
    name: 'INT_MAX / INT_MIN / UINT_MAX',
    kategorie: 'makro',
    header: 'limits.h',
    kurz: md`Grenzen der Ganzzahltypen auf dem aktuellen System. Weitere: \`SHRT_MAX\`, \`LONG_MAX\`, \`LLONG_MAX\`, \`CHAR_BIT\` (Bit pro Byte).`,
    syntax: c`
      #include <limits.h>
      int grenze = INT_MAX;
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <limits.h>

        int main(void) {
            printf("%d bis %d\n", INT_MIN, INT_MAX);
            printf("%d Bit pro Byte\n", CHAR_BIT);
            return 0;
        }
      `,
      ausgabe: out`
        -2147483648 bis 2147483647
        8 Bit pro Byte
      `,
    },
    fehler: [md`\`INT_MAX + 1\` ist ein Überlauf und damit undefiniertes Verhalten.`],
    lektionen: ['k02-l02'],
    stichwoerter: ['Grenzwert', 'Maximum', 'Minimum', 'limits'],
  },
];
