import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'main',
    name: 'main',
    kategorie: 'konstrukt',
    kurz: md`Die Hauptfunktion. Hier beginnt jedes C-Programm. Der Rückgabewert meldet dem Betriebssystem Erfolg (\`0\`) oder einen Fehler.`,
    syntax: c`
      int main(void) { … }
      int main(int argc, char *argv[]) { … }
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("Programm gestartet\n");
            return 0;
        }
      `,
      ausgabe: out`
        Programm gestartet
      `,
    },
    fehler: [md`\`void main()\` ist kein Standard-C. Richtig ist \`int main(void)\`.`, md`\`return 0;\` vergessen: In \`main\` ist das seit C99 erlaubt (dann gilt 0), in anderen Funktionen ein Fehler.`],
    lektionen: ['k01-l01'],
    stichwoerter: ['Hauptfunktion', 'Start', 'Einstiegspunkt'],
  },
];
