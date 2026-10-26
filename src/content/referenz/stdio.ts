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
    lektionen: ['k01-l01', 'k01-l03'],
    stichwoerter: ['Ausgabe', 'formatieren', 'Bildschirm', 'Text ausgeben'],
  },
  {
    id: 'puts',
    name: 'puts',
    kategorie: 'funktion',
    header: 'stdio.h',
    kurz: md`Gibt eine Zeichenkette aus und hängt automatisch einen Zeilenumbruch an. Kennt keine Platzhalter.`,
    syntax: c`int puts(const char *text);`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            puts("Motor an");
            puts("Motor aus");
            return 0;
        }
      `,
      ausgabe: out`
        Motor an
        Motor aus
      `,
    },
    fehler: [md`Zusätzliches \`\n\` im Text erzeugt eine Leerzeile, weil \`puts\` selbst schon einen Zeilenumbruch anhängt.`, md`Platzhalter wie \`%d\` werden nicht ersetzt, sondern wörtlich ausgegeben.`],
    lektionen: ['k01-l03', 'k01-l07'],
    stichwoerter: ['Ausgabe', 'Zeile ausgeben'],
  },
  {
    id: 'putchar',
    name: 'putchar',
    kategorie: 'funktion',
    header: 'stdio.h',
    kurz: md`Gibt genau ein Zeichen aus.`,
    syntax: c`int putchar(int zeichen);`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            putchar('O');
            putchar('K');
            putchar('\n');
            return 0;
        }
      `,
      ausgabe: out`
        OK
      `,
    },
    fehler: [md`Doppelte statt einfache Anführungszeichen: \`putchar("A")\` übergibt einen String, nicht ein Zeichen. Richtig ist \`putchar('A')\`.`],
    lektionen: ['k01-l03'],
    stichwoerter: ['Zeichen ausgeben'],
  },
];
