import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'int',
    name: 'int',
    kategorie: 'datentyp',
    kurz: md`Ganze Zahl mit Vorzeichen, die «natürliche» Grösse des Prozessors. Auf PCs 4 Byte (±2,1 Milliarden), auf 8-Bit-Mikrocontrollern oft nur 2 Byte.`,
    syntax: c`int name = 0;`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int teile = 120;
            teile = teile - 7;
            printf("%d Teile\n", teile);
            return 0;
        }
      `,
      ausgabe: out`
        113 Teile
      `,
    },
    fehler: [md`Überlauf über \`INT_MAX\` ist undefiniertes Verhalten.`, md`Annahme, \`int\` sei überall 4 Byte: Für feste Grössen \`int32_t\` verwenden.`],
    lektionen: ['k02-l01', 'k02-l02'],
    stichwoerter: ['Ganzzahl', 'integer'],
  },
  {
    id: 'unsigned',
    name: 'unsigned',
    kategorie: 'datentyp',
    kurz: md`Macht einen Ganzzahltyp vorzeichenlos: keine negativen Werte, dafür doppelt so weit nach oben. Überlauf ist definiert (Neubeginn bei 0).`,
    syntax: c`
      unsigned int zaehler = 0u;
      unsigned char byte = 255;
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            unsigned int impulse = 4000000000u;
            printf("%u\n", impulse);
            return 0;
        }
      `,
      ausgabe: out`
        4000000000
      `,
    },
    fehler: [md`Vergleich mit negativen \`int\`-Werten: \`-1 < 1u\` ist falsch, weil −1 zu einer riesigen \`unsigned\`-Zahl wird.`, md`Herunterzählen unter 0 ergibt eine riesige Zahl statt −1.`],
    lektionen: ['k02-l02'],
    stichwoerter: ['vorzeichenlos', '%u'],
  },
  {
    id: 'long',
    name: 'short / long / long long',
    kategorie: 'datentyp',
    kurz: md`Ganzzahltypen anderer Grösse: \`short\` mindestens 2 Byte, \`long\` mindestens 4 Byte, \`long long\` mindestens 8 Byte.`,
    syntax: c`
      short s = 100;
      long l = 100000L;
      long long ll = 10000000000LL;
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            long long millisekunden_pro_jahr = 365LL * 24 * 60 * 60 * 1000;
            printf("%lld\n", millisekunden_pro_jahr);
            return 0;
        }
      `,
      ausgabe: out`
        31536000000
      `,
    },
    fehler: [md`Platzhalter: \`%hd\` (short), \`%ld\` (long), \`%lld\` (long long).`, md`\`long\` ist unter Windows 4 Byte, unter 64-Bit-Linux 8 Byte.`],
    lektionen: ['k02-l02'],
    stichwoerter: ['short', 'long long', '%lld', '%ld'],
  },
  {
    id: 'stdint',
    name: 'int8_t … uint64_t',
    kategorie: 'datentyp',
    header: 'stdint.h',
    kurz: md`Ganzzahltypen mit garantierter Breite: \`int8_t\`, \`uint8_t\`, \`int16_t\`, \`uint16_t\`, \`int32_t\`, \`uint32_t\`, \`int64_t\`, \`uint64_t\`. Standard in der Mikrocontroller-Programmierung.`,
    syntax: c`
      #include <stdint.h>
      uint8_t register_wert = 0x3F;
      int16_t temperatur_zehntel = -125;
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stdint.h>

        int main(void) {
            uint8_t pwm = 200;
            int16_t temp = -125;      // -12.5 Grad in Zehnteln
            printf("PWM %d, Temperatur %.1f\n", pwm, temp / 10.0);
            return 0;
        }
      `,
      ausgabe: out`
        PWM 200, Temperatur -12.5
      `,
    },
    fehler: [md`\`uint8_t\` und \`uint16_t\` mit \`%d\` ausgeben (sie werden zu \`int\` erweitert); für \`uint32_t\` und \`uint64_t\` gibt es die Makros \`PRIu32\` und \`PRIu64\` aus \`<inttypes.h>\`.`],
    lektionen: ['k02-l02'],
    stichwoerter: ['uint8_t', 'uint16_t', 'uint32_t', 'int16_t', 'feste Breite', 'Mikrocontroller'],
  },
  {
    id: 'double',
    name: 'double',
    kategorie: 'datentyp',
    kurz: md`Gleitkommazahl doppelter Genauigkeit (8 Byte, etwa 15 Stellen). Standardwahl für Kommazahlen.`,
    syntax: c`double spannung = 11.8;`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            double u = 230.0, i = 1.5;
            printf("P = %.1f W\n", u * i);
            return 0;
        }
      `,
      ausgabe: out`
        P = 345.0 W
      `,
    },
    fehler: [md`Komma statt Punkt (\`2,5\`).`, md`Vergleich mit \`==\` trotz Rundungsfehlern.`, md`Einlesen mit \`scanf\` braucht \`%lf\`, nicht \`%f\`.`],
    lektionen: ['k02-l03'],
    stichwoerter: ['Kommazahl', 'Gleitkomma', 'floating point'],
  },
  {
    id: 'float',
    name: 'float',
    kategorie: 'datentyp',
    kurz: md`Gleitkommazahl einfacher Genauigkeit (4 Byte, etwa 7 Stellen). Spart Speicher; auf manchen Mikrocontrollern schneller.`,
    syntax: c`float temperatur = 21.5f;`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            float t = 21.5f;
            printf("%.1f Grad\n", t);
            return 0;
        }
      `,
      ausgabe: out`
        21.5 Grad
      `,
    },
    fehler: [md`Konstanten ohne \`f\` sind \`double\`.`, md`Für viele Rechenschritte reicht die Genauigkeit oft nicht; im Zweifel \`double\`.`],
    lektionen: ['k02-l03'],
    stichwoerter: ['Kommazahl'],
  },
  {
    id: 'char',
    name: 'char',
    kategorie: 'datentyp',
    kurz: md`Ein einzelnes Zeichen (1 Byte). Intern eine kleine Zahl nach der ASCII-Tabelle: \`'A'\` ist 65.`,
    syntax: c`char befehl = 'S';`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            char z = '7';
            printf("%c hat den Code %d und den Wert %d\n", z, z, z - '0');
            return 0;
        }
      `,
      ausgabe: out`
        7 hat den Code 55 und den Wert 7
      `,
    },
    fehler: [md`\`"A"\` (Zeichenkette) statt \`'A'\` (Zeichen).`, md`Umlaute passen in UTF-8 nicht in einen \`char\`.`],
    lektionen: ['k02-l04'],
    stichwoerter: ['Zeichen', 'ASCII', 'Buchstabe'],
  },
];
