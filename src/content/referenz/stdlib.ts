import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'strtol',
    name: 'strtol / strtod',
    kategorie: 'funktion',
    header: 'stdlib.h',
    kurz: md`Wandeln Text in eine ganze Zahl (\`long\`) bzw. Kommazahl (\`double\`) um. Über den Zeiger \`ende\` erkennt man, ob und wie weit umgewandelt wurde.`,
    syntax: c`
      long strtol(const char *text, char **ende, int basis);
      double strtod(const char *text, char **ende);
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            const char *text = "0x1F Rest";
            char *ende;
            long wert = strtol(text, &ende, 16);
            printf("%ld, danach: \"%s\"\n", wert, ende);
            printf("%.2f\n", strtod("3.75 V", &ende));
            return 0;
        }
      `,
      ausgabe: out`
        31, danach: " Rest"
        3.75
      `,
    },
    fehler: [md`Nicht prüfen, ob \`ende == text\` ist: Dann bleibt «keine Zahl» unbemerkt.`, md`Basis 0 statt 10: Dann wird «010» als Oktalzahl 8 gelesen.`],
    veraltet: md`\`atoi\` und \`atof\` melden keine Fehler (\`atoi("abc")\` ist 0). Für geprüfte Eingaben \`strtol\`/\`strtod\` verwenden.`,
    lektionen: ['k03-l04'],
    stichwoerter: ['umwandeln', 'Text in Zahl', 'atoi', 'atof', 'parsen'],
  },
];
