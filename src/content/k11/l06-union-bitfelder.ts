import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k11-l06',
  titel: 'union und Bitfelder',
  dauer: 30,
  stichwoerter: ['union', 'Bitfeld', 'Bitfelder', 'Byte-Reihenfolge', 'Endianness', 'Little Endian', 'Register', 'Speicher teilen'],
  lernziele: [
    'erklären, wie sich die Komponenten einer `union` denselben Speicher teilen',
    'mit einer `union` die Bytes eines Werts ansehen',
    'Bitfelder deklarieren und ihre Grenzen kennen',
  ],
  erklaerung: md`
    ### union

    Eine \`union\` sieht aus wie eine Struktur, aber alle Komponenten liegen **an derselben Adresse**. Sie ist so gross wie ihre grösste Komponente, und es ist immer nur eine Komponente sinnvoll belegt.

    ~~~c
    typedef union {
        uint32_t wert;
        uint8_t bytes[4];
    } Wort;
    ~~~

    Schreibt man \`wert\`, kann man danach über \`bytes\` die einzelnen Bytes derselben Zahl lesen. So sieht man die **Byte-Reihenfolge** des Systems: Bei *Little Endian* (fast alle PCs, viele Mikrocontroller und auch WebAssembly) liegt das niederwertigste Byte zuerst.

    Unions werden verwendet, um Speicher zu sparen (ein Messpaket ist entweder Temperatur oder Druck) oder um Daten Byte für Byte über eine Schnittstelle zu schicken.

    ### Bitfelder

    In einer Struktur kann man festlegen, wie viele **Bits** eine Komponente belegt:

    ~~~c
    typedef struct {
        unsigned int bereit : 1;    // 0 oder 1
        unsigned int fehler : 1;
        unsigned int modus  : 2;    // 0 bis 3
    } Status;
    ~~~

    So passen mehrere kleine Werte in ein einziges Wort. Ein Bitfeld mit n Bits fasst Werte von 0 bis 2ⁿ − 1. Weist man mehr zu, gehen die oberen Bits verloren.

    > [!achtung] Bitfelder und Hardware
    > Die Reihenfolge der Bits im Speicher legt der C-Standard **nicht** fest, sie hängt vom Compiler ab. Für Hardware-Register und Protokolle nimmt man darum meistens Bitmasken mit \`&\`, \`|\` und \`<<\`. Bitfelder eignen sich für kompakte Daten innerhalb eines Programms.
  `,
  syntax: [
    {
      code: c`
        typedef union {
            typ1 a;
            typ2 b;          // a und b teilen sich den Speicher
        } Name;

        struct {
            unsigned int flag : 1;   // 1 Bit
            unsigned int wert : 4;   // 4 Bit, 0 bis 15
        } bits;
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdint.h>

      typedef union {
          uint32_t wert;
          uint8_t bytes[4];
      } Wort;

      typedef struct {
          unsigned int bereit : 1;
          unsigned int fehler : 1;
          unsigned int modus : 2;
          unsigned int zaehler : 4;
      } Status;

      int main(void) {
          Wort w;
          w.wert = 0x12345678;
          printf("Bytes: %02X %02X %02X %02X\n", w.bytes[0], w.bytes[1], w.bytes[2], w.bytes[3]);
          printf("Grösse Wort: %zu Byte\n", sizeof w);

          Status s = {0};
          s.bereit = 1;
          s.modus = 3;
          s.zaehler = 15;
          s.zaehler++;
          printf("bereit %d, fehler %d, modus %d, zaehler %d\n", s.bereit, s.fehler, s.modus, s.zaehler);
          printf("Grösse Status: %zu Byte\n", sizeof s);
          return 0;
      }
    `,
    ausgabe: out`
      Bytes: 78 56 34 12
      Grösse Wort: 4 Byte
      bereit 1, fehler 0, modus 3, zaehler 0
      Grösse Status: 4 Byte
    `,
  },
  zeilen: [
    { zeilen: '4-7', text: md`\`wert\` und \`bytes\` belegen dieselben 4 Byte.` },
    { zeilen: '10-13', text: md`Vier Bitfelder mit zusammen 8 Bit.` },
    { zeilen: '18-19', text: md`Als Zahl schreiben, als Bytes lesen: Das niederwertigste Byte \`78\` liegt vorne.` },
    { zeilen: '23', text: md`\`{0}\` setzt alle Bitfelder auf 0.` },
    { zeilen: '26-27', text: md`\`zaehler\` hat 4 Bit, also höchstens 15. \`15 + 1\` passt nicht mehr und wird zu 0.` },
    { zeilen: '29', text: md`Die Bitfelder belegen ein \`unsigned int\`, also 4 Byte.` },
  ],
  ergebnis: md`
    Die Bytes erscheinen in umgekehrter Reihenfolge: WebAssembly ist Little Endian. Die Statusbits brauchen zusammen nur 8 Bit, die Struktur belegt aber eine ganze Speichereinheit von 4 Byte. Der 4-Bit-Zähler läuft von 15 auf 0 über.
  `,
  fehler: [
    {
      titel: 'Zwei Komponenten einer union gleichzeitig nutzen',
      text: md`Schreibt man erst \`temperatur\` und dann \`druck\`, ist die Temperatur überschrieben. Meist merkt man sich in einer zusätzlichen Komponente (oft einem \`enum\`), welche gerade gilt.`,
    },
    {
      titel: 'Byte-Reihenfolge annehmen',
      text: md`Code, der die Bytes einer \`union\` liest, liefert auf einem Big-Endian-System andere Ergebnisse. Für Protokolle die Byte-Reihenfolge ausdrücklich festlegen.`,
    },
    {
      titel: 'Adresse eines Bitfelds',
      text: md`\`&s.modus\` ist ein Fehler («address of bit-field requested»), weil ein Bitfeld keine eigene Byte-Adresse hat. Darum kann man auch nicht direkt mit \`scanf\` hineinlesen.`,
    },
  ],
  uebungen: [
    {
      id: 'k11-l06-u1',
      typ: 'vorhersage',
      titel: 'Zwei Bytes',
      stufe: 1,
      themen: ['strukturen', 'zahlensysteme'],
      code: c`
        #include <stdio.h>
        #include <stdint.h>

        int main(void) {
            union {
                uint16_t wert;
                uint8_t bytes[2];
            } u;
            u.wert = 0x0A0B;
            printf("%d %d %zu\n", u.bytes[0], u.bytes[1], sizeof u);
            return 0;
        }
      `,
      ausgabe: out`
        11 10 2
      `,
      erklaerung: md`Little Endian: zuerst das niederwertige Byte 0x0B = 11, dann 0x0A = 10. Die union ist 2 Byte gross.`,
    },
    {
      id: 'k11-l06-u2',
      typ: 'eingabe',
      titel: 'Grösse einer union',
      stufe: 1,
      themen: ['strukturen'],
      frage: 'Wie viele Byte belegt `union { char c; double d; int i; }` hier?',
      antworten: ['8'],
      erklaerung: 'So viel wie die grösste Komponente, das `double`.',
    },
    {
      id: 'k11-l06-u3',
      typ: 'programm',
      titel: 'Bytes zum Senden',
      stufe: 2,
      themen: ['strukturen', 'zahlensysteme'],
      aufgabe: md`
        Schreibe \`void bytes_ausgeben(uint32_t w)\`. Sie gibt die vier Bytes von \`w\` in Speicherreihenfolge als zweistellige Hexzahlen in Grossbuchstaben aus, getrennt durch Leerzeichen, mit Zeilenumbruch am Ende. Verwende dafür eine \`union\`.
      `,
      start: c`
        #include <stdio.h>
        #include <stdint.h>

        int main(void) {
            bytes_ausgeben(0xDEADBEEF);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdint.h>

        void bytes_ausgeben(uint32_t w) {
            union {
                uint32_t wert;
                uint8_t bytes[4];
            } u;
            u.wert = w;
            printf("%02X %02X %02X %02X\n", u.bytes[0], u.bytes[1], u.bytes[2], u.bytes[3]);
        }

        int main(void) {
            bytes_ausgeben(0xDEADBEEF);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdint.h>
        void bytes_ausgeben(uint32_t w);
        int main(void) {
            bytes_ausgeben(0xDEADBEEF);
            bytes_ausgeben(1);
            return 0;
        }
      `,
      tests: [{ name: 'Zwei Werte', erwartet: { stdout: 'EF BE AD DE\n01 00 00 00\n' }, tipp: md`Zweistellig mit führender Null: \`%02X\`.` }],
      regeln: [{ muss: '\\bunion\\b', meldung: 'Löse die Aufgabe mit einer `union`.' }],
      hinweise: [md`Eine union mit \`uint32_t wert\` und \`uint8_t bytes[4]\`; \`wert\` schreiben, \`bytes\` lesen.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k11-l06-c1',
      typ: 'wahrfalsch',
      themen: ['strukturen'],
      aussage: 'Alle Komponenten einer `union` beginnen an derselben Adresse.',
      richtig: true,
    },
    {
      id: 'k11-l06-c2',
      typ: 'eingabe',
      themen: ['strukturen', 'zahlensysteme'],
      frage: 'Welchen grössten Wert fasst ein Bitfeld `unsigned int x : 3;`?',
      antworten: ['7'],
    },
    {
      id: 'k11-l06-c3',
      typ: 'auswahl',
      themen: ['strukturen'],
      frage: 'Warum nimmt man für Hardware-Register meist Bitmasken statt Bitfelder?',
      optionen: [{ text: 'Die Anordnung der Bits in Bitfeldern hängt vom Compiler ab.', richtig: true }, { text: 'Bitfelder sind langsamer als Variablen.' }, { text: 'Bitfelder gibt es nur in C++.' }],
    },
  ],
  zusammenfassung: [
    'In einer `union` teilen sich alle Komponenten denselben Speicher.',
    'Eine `union` ist so gross wie ihre grösste Komponente.',
    'Bitfelder (`: n`) packen kleine Werte in wenige Bits.',
    'Bitreihenfolge von Bitfeldern und Byte-Reihenfolge sind systemabhängig.',
  ],
  referenz: ['union', 'bitfeld', 'stdint'],
};
