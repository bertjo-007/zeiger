import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'sizeof',
    name: 'sizeof',
    kategorie: 'operator',
    kurz: md`Liefert die Grösse eines Typs oder einer Variable in Byte. Ergebnis vom Typ \`size_t\`, ausgegeben mit \`%zu\`. \`sizeof\` ist ein Schlüsselwort und ein Operator, keine Funktion.`,
    syntax: c`
      sizeof(typ)
      sizeof variable
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            double werte[10];
            printf("%zu %zu\n", sizeof(double), sizeof werte);
            return 0;
        }
      `,
      ausgabe: out`
        8 80
      `,
    },
    fehler: [md`Bei einem Array-Parameter in einer Funktion liefert \`sizeof\` die Grösse eines Zeigers, nicht des Arrays.`, md`\`%d\` statt \`%zu\` für das Ergebnis.`],
    lektionen: ['k02-l02'],
    stichwoerter: ['Grösse', 'Byte', 'size_t'],
  },
  {
    id: 'cast',
    name: '(typ) Cast',
    kategorie: 'operator',
    kurz: md`Wandelt einen Wert ausdrücklich in einen anderen Typ um. Häufigster Einsatz: \`(double)\` vor einer Ganzzahldivision.`,
    syntax: c`(zieltyp) ausdruck`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int summe = 17, n = 4;
            printf("%.2f\n", (double)summe / n);
            printf("%d\n", (int)3.99);
            return 0;
        }
      `,
      ausgabe: out`
        4.25
        3
      `,
    },
    fehler: [md`Cast um das Ergebnis statt an einen Operanden: \`(double)(a / b)\` ist schon ganzzahlig geteilt.`, md`\`(int)\` schneidet ab, statt zu runden.`],
    lektionen: ['k02-l08'],
    stichwoerter: ['Typumwandlung', 'umwandeln', 'casten'],
  },
];
