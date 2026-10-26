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
  {
    id: 'round',
    name: 'round / ceil / floor',
    kategorie: 'funktion',
    header: 'math.h',
    kurz: md`Runden: \`round\` zur nächsten ganzen Zahl (0,5 weg von 0), \`ceil\` immer auf, \`floor\` immer ab. Ergebnis ist ein \`double\`.`,
    syntax: c`
      double round(double x);
      double ceil(double x);
      double floor(double x);
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <math.h>

        int main(void) {
            double x = 2.4;
            printf("%.0f %.0f %.0f\n", round(x), ceil(x), floor(x));
            printf("%d\n", (int)round(37.5));
            return 0;
        }
      `,
      ausgabe: out`
        2 3 2
        38
      `,
    },
    fehler: [md`\`(int)x\` schneidet nur ab und rundet nicht.`, md`Für eine ganze Zahl das Ergebnis noch casten: \`(int)round(x)\`.`],
    lektionen: ['k02-l08'],
    stichwoerter: ['runden', 'aufrunden', 'abrunden'],
  },
  {
    id: 'fabs',
    name: 'fabs',
    kategorie: 'funktion',
    header: 'math.h',
    kurz: md`Betrag einer Kommazahl. Für ganze Zahlen gibt es \`abs\` aus \`<stdlib.h>\`. Typischer Einsatz: Kommazahlen mit Toleranz vergleichen.`,
    syntax: c`double fabs(double x);`,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <math.h>

        int main(void) {
            double soll = 0.3, ist = 0.1 + 0.2;
            if (fabs(ist - soll) < 1e-9) {
                printf("praktisch gleich\n");
            }
            return 0;
        }
      `,
      ausgabe: out`
        praktisch gleich
      `,
    },
    lektionen: ['k02-l03'],
    stichwoerter: ['Betrag', 'abs', 'Toleranz'],
  },
];
