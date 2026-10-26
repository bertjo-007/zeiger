import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'sqrt',
    name: 'sqrt',
    kategorie: 'funktion',
    header: 'math.h',
    kurz: md`Quadratwurzel einer Zahl.`,
    syntax: c`double sqrt(double x);`,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <math.h>

        int main(void) {
            printf("%.2f\n", sqrt(30.25));
            return 0;
        }
      `,
      ausgabe: out`
        5.50
      `,
    },
    fehler: [md`Negative Zahlen ergeben keine reelle Wurzel; das Ergebnis ist \`nan\`.`, md`\`<math.h>\` vergessen.`],
    lektionen: ['k01-l05'],
    stichwoerter: ['Wurzel', 'Quadratwurzel'],
  },
  {
    id: 'pow',
    name: 'pow',
    kategorie: 'funktion',
    header: 'math.h',
    kurz: md`Potenz: \`pow(x, y)\` berechnet x hoch y.`,
    syntax: c`double pow(double basis, double exponent);`,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <math.h>

        int main(void) {
            printf("%.0f\n", pow(2.0, 12.0));
            return 0;
        }
      `,
      ausgabe: out`
        4096
      `,
    },
    fehler: [md`\`^\` ist in C kein Potenzoperator, sondern das bitweise XOR. \`2 ^ 3\` ergibt 1, nicht 8.`, md`Für ganzzahlige Potenzen von 2 ist \`1 << n\` schneller und exakt (Kapitel 14).`],
    lektionen: ['k01-l05'],
    stichwoerter: ['Potenz', 'hoch', 'Exponent'],
  },
];
