import { c, md, out } from '../tags.ts';
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
  {
    id: 'fmt-d',
    name: '%d',
    kategorie: 'format',
    kurz: md`Ganze Zahl (\`int\`) dezimal. Verwandt: \`%u\` (unsigned), \`%ld\` (long), \`%lld\` (long long), \`%hd\` (short). In \`scanf\` liest \`%d\` eine ganze Zahl ein.`,
    syntax: c`printf("%d\n", wert);`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int a = -15;
            printf("[%d] [%5d] [%-5d] [%05d]\n", a, a, a, 42);
            return 0;
        }
      `,
      ausgabe: out`
        [-15] [  -15] [-15  ] [00042]
      `,
    },
    fehler: [md`Für \`double\` ist \`%d\` falsch; Clang warnt.`, md`Für \`long long\` braucht es \`%lld\`.`],
    lektionen: ['k02-l01', 'k02-l07'],
    stichwoerter: ['ganze Zahl', 'Platzhalter', '%i', '%u', '%lld'],
  },
  {
    id: 'fmt-f',
    name: '%f',
    kategorie: 'format',
    kurz: md`Kommazahl (\`double\`, \`float\`). \`%.2f\` begrenzt auf zwei Nachkommastellen, \`%8.2f\` zusätzlich auf 8 Zeichen Breite. Verwandt: \`%e\`, \`%g\`. **Achtung:** \`scanf\` braucht für \`double\` \`%lf\`.`,
    syntax: c`printf("%.2f\n", wert);`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            double x = 1234.5678;
            printf("%f | %.1f | %10.2f | %e | %g\n", x, x, x, x, x);
            return 0;
        }
      `,
      ausgabe: out`
        1234.567800 | 1234.6 |    1234.57 | 1.234568e+03 | 1234.57
      `,
    },
    fehler: [md`\`%f\` mit einem \`int\`-Wert ergibt Unsinn.`, md`\`%2.8f\` statt \`%8.2f\` (Breite und Genauigkeit vertauscht).`],
    lektionen: ['k02-l03', 'k02-l07'],
    stichwoerter: ['Kommazahl', 'Nachkommastellen', '%lf', '%e', '%g'],
  },
  {
    id: 'fmt-c',
    name: '%c',
    kategorie: 'format',
    kurz: md`Ein einzelnes Zeichen. In \`scanf\` liest \`" %c"\` (mit Leerzeichen davor) das nächste Zeichen, das kein Leerraum ist.`,
    syntax: c`printf("%c\n", zeichen);`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            char modus = 'M';
            printf("Modus %c\n", modus);
            return 0;
        }
      `,
      ausgabe: out`
        Modus M
      `,
    },
    lektionen: ['k02-l04'],
    stichwoerter: ['Zeichen'],
  },
  {
    id: 'fmt-s',
    name: '%s',
    kategorie: 'format',
    kurz: md`Zeichenkette. \`%-10s\` linksbündig auf 10 Zeichen, \`%.3s\` höchstens 3 Zeichen. In \`scanf\` immer mit Breite verwenden, z. B. \`%19s\`.`,
    syntax: c`printf("%s\n", text);`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("[%s] [%-8s] [%8s] [%.3s]\n", "Pumpe", "Pumpe", "Pumpe", "Pumpe");
            return 0;
        }
      `,
      ausgabe: out`
        [Pumpe] [Pumpe   ] [   Pumpe] [Pum]
      `,
    },
    fehler: [md`\`scanf("%s", …)\` ohne Breite kann über das Ende des Arrays schreiben.`],
    lektionen: ['k02-l07'],
    stichwoerter: ['Zeichenkette', 'String', 'Text'],
  },
  {
    id: 'fmt-x',
    name: '%x / %X',
    kategorie: 'format',
    kurz: md`Ganze Zahl hexadezimal, klein (\`%x\`) oder gross (\`%X\`). \`%#x\` mit Präfix \`0x\`, \`%02X\` zweistellig mit führender Null. Verwandt: \`%o\` (oktal).`,
    syntax: c`printf("0x%02X\n", byte);`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("%x %X %#x %02X\n", 255, 255, 255, 10);
            return 0;
        }
      `,
      ausgabe: out`
        ff FF 0xff 0A
      `,
    },
    lektionen: ['k02-l05'],
    stichwoerter: ['hexadezimal', 'Hex', '%o', 'oktal'],
  },
  {
    id: 'fmt-breite',
    name: 'Breite und Genauigkeit',
    kategorie: 'format',
    kurz: md`Zwischen \`%\` und dem Buchstaben: \`-\` linksbündig, \`0\` mit Nullen auffüllen, \`+\` Vorzeichen zeigen, Zahl = Mindestbreite, \`.Zahl\` = Nachkommastellen (bei \`%s\`: maximale Länge).`,
    syntax: c`%[-+0][Breite][.Genauigkeit]Art`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("|%-8s|%8.3f|%+05d|\n", "Achse", 3.14159, 42);
            return 0;
        }
      `,
      ausgabe: out`
        |Achse   |   3.142|+0042|
      `,
    },
    lektionen: ['k02-l07'],
    stichwoerter: ['Feldbreite', 'ausrichten', 'linksbündig', 'rechtsbündig', 'Tabelle'],
  },
];
