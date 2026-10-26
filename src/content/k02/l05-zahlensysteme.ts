import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k02-l05',
  titel: 'Bits, Bytes, Binär- und Hexadezimalzahlen',
  dauer: 30,
  stichwoerter: ['Bit', 'Byte', 'binär', 'Dualsystem', 'hexadezimal', 'Hex', '0x', '%x', '%X', '%#x', '%02X', 'oktal', 'Nibble', 'Zahlensystem', 'Register'],
  lernziele: [
    'erklären, was Bits und Bytes sind und wie viele Werte n Bit darstellen können',
    'zwischen Dezimal-, Binär- und Hexadezimalschreibweise umrechnen',
    'Hexadezimalzahlen in C schreiben und mit `%x` ausgeben',
  ],
  erklaerung: md`
    Der Computer speichert alles mit zwei Zuständen: Spannung an oder aus, 1 oder 0. Eine solche Stelle heisst **Bit**. Acht Bit bilden ein **Byte**.

    Mit n Bit lassen sich 2ⁿ verschiedene Werte darstellen: 1 Bit = 2 Werte, 4 Bit = 16, 8 Bit = 256, 16 Bit = 65 536. Daher stammen die Grenzen der Typen aus der letzten Lektion.

    ### Das Binärsystem

    Im Dezimalsystem hat jede Stelle den zehnfachen Wert der rechten Nachbarstelle (1, 10, 100 …). Im **Binärsystem** (Dualsystem) ist es der **doppelte** Wert:

    | Stelle | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
    |---|---|---|---|---|---|---|---|---|
    | Wert | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
    | Bits von 200 | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 0 |

    200 = 128 + 64 + 8, also binär \`11001000\`. Die Stellen werden von rechts ab **0** gezählt; Bit 0 ist das niederwertigste.

    ### Das Hexadezimalsystem

    Lange Bitfolgen sind schwer lesbar. Darum fasst man je **4 Bit** zu einer **Hexadezimalziffer** zusammen. Sie hat 16 Werte: 0 bis 9 und A bis F (A = 10 … F = 15).

    | Binär | Hex | | Binär | Hex |
    |---|---|---|---|---|
    | 0000 | 0 | | 1000 | 8 |
    | 0011 | 3 | | 1010 | A |
    | 0101 | 5 | | 1100 | C |
    | 0111 | 7 | | 1111 | F |

    \`1100 1000\` wird so zu **C8**. Ein Byte entspricht immer genau zwei Hex-Ziffern, von \`00\` bis \`FF\` (255).

    ### In C

    - **Hex-Konstanten** beginnen mit \`0x\`: \`0xC8\` ist 200, \`0xFF\` ist 255.
    - **Ausgabe:** \`%x\` (Kleinbuchstaben), \`%X\` (Grossbuchstaben), \`%#x\` mit Präfix \`0x\`, \`%02X\` immer zweistellig mit führender Null.
    - **Achtung, oktal:** Eine Zahl mit führender \`0\` ist in C **oktal** (Basis 8)! \`010\` ist 8, nicht 10.
    - **Binärkonstanten** wie \`0b11001000\` sind erst ab C23 Standard. In C17 sind sie nur eine Erweiterung der Compiler, darum verwendet dieser Kurs Hex.

    > [!praxis] Warum Hex überall auftaucht
    > Datenblätter von Mikrocontrollern geben Register und Adressen in Hex an: «Schreibe 0x3F in das Register PORTB». Jede Hex-Ziffer steht für vier Pins. \`0x3F\` = \`0011 1111\` schaltet also die Pins 0 bis 5 ein und 6 und 7 aus. In Kapitel 14 und 15 setzt du das mit Bitoperatoren um.
  `,
  syntax: [
    {
      code: c`
        int a = 0xC8;            // hexadezimal: 200
        printf("%x\n", 200);     // c8
        printf("%X\n", 200);     // C8
        printf("%#x\n", 200);    // 0xc8
        printf("%02X\n", 10);    // 0A
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int dezimal = 200;
          int hex = 0xC8;       // dieselbe Zahl in Hex
          int oktal = 0310;     // Vorsicht: führende 0 heisst oktal

          printf("%d %d %d\n", dezimal, hex, oktal);
          printf("200 in Hex: %x, gross: %X, mit Präfix: %#x\n", dezimal, dezimal, dezimal);
          printf("255 = 0x%02X, 15 = 0x%02X\n", 255, 15);
          printf("Register PORTB = 0x%02X\n", 0x3F);
          return 0;
      }
    `,
    ausgabe: out`
      200 200 200
      200 in Hex: c8, gross: C8, mit Präfix: 0xc8
      255 = 0xFF, 15 = 0x0F
      Register PORTB = 0x3F
    `,
  },
  zeilen: [
    { zeilen: '4-6', text: md`Dreimal dieselbe Zahl in verschiedenen Schreibweisen. \`0310\` ist oktal: 3 · 64 + 1 · 8 + 0 = 200.` },
    { zeilen: '8', text: md`Intern ist es dieselbe Zahl, darum gibt \`%d\` dreimal 200 aus.` },
    { zeilen: '9', text: md`Drei Hex-Formate für denselben Wert.` },
    { zeilen: '10', text: md`\`%02X\` füllt auf zwei Stellen mit Nullen auf: 15 wird zu \`0F\`. So wird ein Byte immer gleich breit angezeigt.` },
  ],
  ergebnis: md`
    Die erste Zeile beweist: \`200\`, \`0xC8\` und \`0310\` sind derselbe Wert. Die anderen Zeilen zeigen die Hex-Formate. In Datenblättern und Debug-Ausgaben siehst du Bytes fast immer in der Form \`0x3F\`.
  `,
  fehler: [
    {
      titel: 'Führende Null',
      text: md`Wer Zahlen «schön ausrichten» will und \`int pin = 08;\` schreibt, bekommt einen Fehler, weil 8 keine Oktalziffer ist. \`010\` ist sogar gültig, bedeutet aber 8. Ganze Zahlen nie mit führender Null schreiben.`,
      falsch: c`int menge = 010;   // 8!`,
      richtig: c`int menge = 10;`,
    },
    {
      titel: 'Binärkonstanten in C17',
      text: md`\`0b1010\` übersetzen gcc und clang zwar, mit \`-pedantic\` warnen sie aber, dass das erst ab C23 Standard ist. Für Code nach C17: Hex verwenden, \`0xA\`.`,
    },
    {
      titel: 'Hex-Ziffern verwechselt',
      text: md`\`0x10\` ist 16, nicht 10. Jede Stelle zählt das 16-fache der rechten Nachbarstelle.`,
    },
  ],
  uebungen: [
    {
      id: 'k02-l05-u1',
      typ: 'zuordnen',
      titel: 'Gleiche Werte',
      stufe: 1,
      themen: ['zahlensysteme'],
      frage: 'Welche Schreibweisen bezeichnen denselben Wert?',
      paare: [
        { links: 'binär `1010`', rechts: 'dezimal 10' },
        { links: 'hex `0xFF`', rechts: 'dezimal 255' },
        { links: 'hex `0x10`', rechts: 'dezimal 16' },
        { links: 'binär `1000 0000`', rechts: 'dezimal 128' },
        { links: 'hex `0x3F`', rechts: 'binär `0011 1111`' },
      ],
    },
    {
      id: 'k02-l05-u2',
      typ: 'eingabe',
      titel: 'Umrechnen',
      stufe: 1,
      themen: ['zahlensysteme'],
      frage: 'Welche Dezimalzahl ist binär `0110 0100`?',
      antworten: ['100'],
      erklaerung: '64 + 32 + 4 = 100.',
    },
    {
      id: 'k02-l05-u3',
      typ: 'programm',
      titel: 'Registerwerte anzeigen',
      stufe: 2,
      themen: ['zahlensysteme', 'format'],
      aufgabe: md`
        Ein Diagnoseprogramm soll drei Registerwerte dezimal und hexadezimal anzeigen. Die Hex-Werte sollen zweistellig und mit Grossbuchstaben erscheinen:

        ~~~text
        DDRB  =  63 = 0x3F
        PORTB = 160 = 0xA0
        PINB  =   5 = 0x05
        ~~~

        Die Dezimalwerte sind rechtsbündig auf drei Stellen ausgerichtet (\`%3d\`).
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int ddrb = 63;
            int portb = 160;
            int pinb = 5;

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int ddrb = 63;
            int portb = 160;
            int pinb = 5;

            printf("DDRB  = %3d = 0x%02X\n", ddrb, ddrb);
            printf("PORTB = %3d = 0x%02X\n", portb, portb);
            printf("PINB  = %3d = 0x%02X\n", pinb, pinb);
            return 0;
        }
      `,
      tests: [{ name: 'Tabelle stimmt', erwartet: { stdout: 'DDRB  =  63 = 0x3F\nPORTB = 160 = 0xA0\nPINB  =   5 = 0x05\n' } }],
      regeln: [{ darfNicht: '0x3F|0xA0|0x05', meldung: 'Lass `printf` die Hex-Werte aus den Variablen erzeugen.' }],
      hinweise: [md`Jede Variable wird zweimal ausgegeben: einmal mit \`%3d\`, einmal mit \`%02X\`.`, md`Das \`0x\` davor ist normaler Text im Formatstring: \`"0x%02X"\`.`],
    },
    {
      id: 'k02-l05-u4',
      typ: 'vorhersage',
      titel: 'Schreibweisen',
      stufe: 2,
      themen: ['zahlensysteme'],
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("%d\n", 0x1F);
            printf("%d\n", 017);
            printf("%x\n", 255);
            printf("%#X\n", 4096);
            return 0;
        }
      `,
      ausgabe: out`
        31
        15
        ff
        0X1000
      `,
      erklaerung: md`\`0x1F\` = 16 + 15 = 31. \`017\` ist oktal: 8 + 7 = 15. 255 ist \`ff\`. 4096 = 16³ ist \`1000\` in Hex; \`%#X\` setzt \`0X\` davor.`,
    },
  ],
  wissenscheck: [
    {
      id: 'k02-l05-c1',
      typ: 'eingabe',
      themen: ['zahlensysteme'],
      frage: 'Wie viele verschiedene Werte lassen sich mit 4 Bit darstellen?',
      antworten: ['16'],
    },
    {
      id: 'k02-l05-c2',
      typ: 'auswahl',
      themen: ['zahlensysteme'],
      frage: 'Was bedeutet in C die Konstante `012`?',
      optionen: [
        { text: 'Die Oktalzahl 12, also dezimal 10', richtig: true },
        { text: 'Die Dezimalzahl 12', warum: 'Die führende Null macht sie oktal.' },
        { text: 'Die Binärzahl 12', warum: 'Binärzahlen bestehen nur aus 0 und 1; `012` ist oktal.' },
      ],
    },
    {
      id: 'k02-l05-c3',
      typ: 'eingabe',
      themen: ['zahlensysteme'],
      frage: 'Schreibe die Dezimalzahl 255 als C-Hexkonstante.',
      antworten: ['0xFF', '0xff'],
      exakt: false,
    },
  ],
  zusammenfassung: [
    '8 Bit sind ein Byte; n Bit stellen 2ⁿ Werte dar.',
    'Binär hat jede Stelle den doppelten Wert der rechten, Bit 0 ist ganz rechts.',
    'Eine Hex-Ziffer fasst 4 Bit zusammen; ein Byte sind zwei Hex-Ziffern (`00` bis `FF`).',
    'In C: `0xC8` für Hex, `%x`/`%X`/`%02X` zur Ausgabe. Eine führende `0` macht eine Zahl oktal.',
  ],
  referenz: ['fmt-x'],
};
