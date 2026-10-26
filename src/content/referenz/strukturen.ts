import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'struct',
    name: 'struct',
    kategorie: 'schluesselwort',
    kurz: md`Definiert einen Strukturtyp aus mehreren Komponenten verschiedener Typen. Kopieren mit \`=\` geht, Vergleichen mit \`==\` nicht.`,
    syntax: c`
      struct Name {
          typ komponente;
      };
      struct Name v = {wert};
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        struct Messung {
            int kanal;
            double wert;
        };

        int main(void) {
            struct Messung m = {2, 3.75};
            m.wert *= 2;
            printf("Kanal %d: %.2f\n", m.kanal, m.wert);
            return 0;
        }
      `,
      ausgabe: out`
        Kanal 2: 7.50
      `,
    },
    fehler: [md`Semikolon nach der Definition vergessen.`, md`Ohne \`typedef\` das Wort \`struct\` beim Typ weglassen.`, md`Füllbytes übersehen; Grösse immer mit \`sizeof\`.`],
    lektionen: ['k11-l01', 'k11-l02', 'k11-l03', 'k11-l04'],
    stichwoerter: ['Struktur', 'Verbund', 'Datensatz', 'Record'],
  },
  {
    id: 'typedef',
    name: 'typedef',
    kategorie: 'schluesselwort',
    kurz: md`Gibt einem Typ einen zusätzlichen Namen. Häufig bei Strukturen, Aufzählungen und Funktionszeigern.`,
    syntax: c`
      typedef unsigned char Byte;
      typedef struct { double x; double y; } Punkt;
      typedef int (*Vergleich)(const void *, const void *);
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        typedef int Millivolt;

        typedef struct {
            Millivolt min;
            Millivolt max;
        } Bereich;

        int main(void) {
            Bereich b = {.min = 500, .max = 4500};
            printf("%d mV\n", b.max - b.min);
            return 0;
        }
      `,
      ausgabe: out`
        4000 mV
      `,
    },
    fehler: [md`Den Typnamen wie eine Variable verwenden.`],
    lektionen: ['k11-l02'],
    stichwoerter: ['Typname', 'Alias', 'Typ umbenennen'],
  },
  {
    id: 'punkt-pfeil',
    name: '. und -> (Komponentenzugriff)',
    kategorie: 'operator',
    kurz: md`\`v.k\` greift auf die Komponente \`k\` einer Strukturvariable zu, \`p->k\` über einen Zeiger. \`p->k\` ist dasselbe wie \`(*p).k\`.`,
    syntax: c`
      variable.komponente
      zeiger->komponente
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        typedef struct {
            int nummer;
            int offen;
        } Ventil;

        void oeffnen(Ventil *v) {
            v->offen = 1;
        }

        int main(void) {
            Ventil a = {4, 0};
            oeffnen(&a);
            printf("Ventil %d: %d\n", a.nummer, a.offen);
            return 0;
        }
      `,
      ausgabe: out`
        Ventil 4: 1
      `,
    },
    fehler: [md`Punkt bei einem Zeiger verwenden.`, md`\`*p.k\` ohne Klammern bedeutet \`*(p.k)\`.`],
    lektionen: ['k11-l01', 'k11-l04'],
    stichwoerter: ['Punktoperator', 'Pfeiloperator', 'Member', 'Komponente'],
  },
  {
    id: 'enum',
    name: 'enum',
    kategorie: 'schluesselwort',
    kurz: md`Definiert benannte ganzzahlige Konstanten. Zählung ab 0, oder ab dem zuletzt festgelegten Wert weiter.`,
    syntax: c`
      typedef enum {
          AUS,
          EIN,
          BLINKEN = 10
      } Modus;
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        typedef enum { LED_AUS, LED_EIN, LED_BLINKEN } Led;

        int main(void) {
            Led l = LED_BLINKEN;
            switch (l) {
                case LED_AUS:
                    printf("aus\n");
                    break;
                case LED_EIN:
                    printf("ein\n");
                    break;
                case LED_BLINKEN:
                    printf("blinkt (%d)\n", l);
                    break;
            }
            return 0;
        }
      `,
      ausgabe: out`
        blinkt (2)
      `,
    },
    fehler: [md`Gleicher Name in zwei Aufzählungen.`, md`Zahlen statt Namen verwenden.`],
    lektionen: ['k11-l05'],
    stichwoerter: ['Aufzählung', 'Aufzählungstyp', 'Zustand', 'Konstante'],
  },
  {
    id: 'union',
    name: 'union',
    kategorie: 'schluesselwort',
    kurz: md`Wie eine Struktur, aber alle Komponenten liegen an derselben Adresse. So gross wie die grösste Komponente.`,
    syntax: c`
      union Name {
          typ1 a;
          typ2 b;
      };
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stdint.h>

        int main(void) {
            union {
                uint32_t wert;
                uint8_t bytes[4];
            } u = {.wert = 0x01020304};
            printf("%d %zu\n", u.bytes[0], sizeof u);
            return 0;
        }
      `,
      ausgabe: out`
        4 4
      `,
    },
    fehler: [md`Zwei Komponenten gleichzeitig nutzen wollen.`, md`Eine bestimmte Byte-Reihenfolge annehmen.`],
    lektionen: ['k11-l06'],
    stichwoerter: ['Variante', 'Speicher teilen', 'Byte-Reihenfolge'],
  },
  {
    id: 'bitfeld',
    name: 'Bitfeld ( : n )',
    kategorie: 'konstrukt',
    kurz: md`Eine Komponente einer Struktur, die nur n Bits belegt. Wertebereich 0 bis 2ⁿ − 1 bei \`unsigned int\`. Die Anordnung im Speicher hängt vom Compiler ab.`,
    syntax: c`
      struct {
          unsigned int flag : 1;
          unsigned int modus : 3;
      } s;
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        struct Status {
            unsigned int bereit : 1;
            unsigned int stufe : 3;
        };

        int main(void) {
            struct Status s = {1, 5};
            printf("%d %d %zu\n", s.bereit, s.stufe, sizeof s);
            return 0;
        }
      `,
      ausgabe: out`
        1 5 4
      `,
    },
    fehler: [md`Adresse eines Bitfelds nehmen.`, md`Werte zuweisen, die nicht in die Bits passen.`],
    lektionen: ['k11-l06'],
    stichwoerter: ['Bits', 'Flags', 'kompakt'],
  },
  {
    id: 'memcpy',
    name: 'memcpy / memset',
    kategorie: 'funktion',
    header: 'string.h',
    kurz: md`\`memcpy\` kopiert n Bytes von einer Adresse an eine andere (die Bereiche dürfen sich nicht überlappen). \`memset\` füllt n Bytes mit einem Wert.`,
    syntax: c`
      void *memcpy(void *ziel, const void *quelle, size_t n);
      void *memset(void *ziel, int wert, size_t n);
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <string.h>

        int main(void) {
            int a[4] = {1, 2, 3, 4};
            int b[4];
            memcpy(b, a, sizeof a);
            memset(a, 0, sizeof a);
            printf("%d %d | %d %d\n", a[0], a[3], b[0], b[3]);
            return 0;
        }
      `,
      ausgabe: out`
        0 0 | 1 4
      `,
    },
    fehler: [md`Anzahl Elemente statt Bytes angeben.`, md`\`memset\` mit einem Wert wie 1 für \`int\`-Arrays: jedes **Byte** wird 1.`],
    lektionen: ['k10-l03', 'k10-l04'],
    stichwoerter: ['kopieren', 'Bytes', 'füllen', 'nullen'],
  },
];
