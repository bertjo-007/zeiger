import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'printf',
    name: 'printf',
    kategorie: 'funktion',
    header: 'stdio.h',
    kurz: md`Gibt formatierten Text auf der Standardausgabe aus. Platzhalter wie \`%d\` werden durch die folgenden Werte ersetzt.`,
    syntax: c`int printf(const char *format, ...);`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int drehzahl = 1500;
            double temperatur = 21.5;
            printf("Drehzahl: %d U/min\n", drehzahl);
            printf("Temperatur: %.1f Grad\n", temperatur);
            return 0;
        }
      `,
      ausgabe: out`
        Drehzahl: 1500 U/min
        Temperatur: 21.5 Grad
      `,
    },
    fehler: [
      md`Platzhalter passt nicht zum Typ, z. B. \`%d\` für einen \`double\`. Die Ausgabe ist dann Unsinn; Clang warnt mit \`-Wformat\`.`,
      md`\`\n\` vergessen: Die nächste Ausgabe klebt an derselben Zeile.`,
      md`\`printf(text)\` mit einer Variablen als Formattext. Enthält sie ein \`%\`, liest printf Werte, die es nicht gibt. Besser: \`printf("%s", text)\`.`,
    ],
    lektionen: ['k01-l01'],
    stichwoerter: ['Ausgabe', 'formatieren', 'Bildschirm', 'Text ausgeben'],
  },
];
