import { c, md, out } from '../tags.ts';
import type { Aufgabe } from '../types.ts';

/** Fragenpool für den Kapiteltest 2. */
export const test: Aufgabe[] = [
  {
    id: 'k02-t01',
    typ: 'vorhersage',
    themen: ['variablen'],
    code: c`
      #include <stdio.h>

      int main(void) {
          int x = 4;
          int y = x * 3;
          x = y - x;
          printf("%d %d\n", x, y);
          return 0;
      }
    `,
    ausgabe: out`
      8 12
    `,
  },
  {
    id: 'k02-t02',
    typ: 'auswahl',
    themen: ['datentypen'],
    frage: 'Ein Temperaturfühler liefert Werte wie 21.37 Grad. Welcher Typ passt?',
    optionen: [{ text: '`double`', richtig: true }, { text: '`int`', warum: 'Die Nachkommastellen gingen verloren.' }, { text: '`char`', warum: 'Ein Zeichen, keine Kommazahl.' }],
  },
  {
    id: 'k02-t03',
    typ: 'eingabe',
    themen: ['datentypen'],
    frage: 'Wie viele Byte belegt ein `uint16_t`?',
    antworten: ['2'],
  },
  {
    id: 'k02-t04',
    typ: 'vorhersage',
    themen: ['typumwandlung'],
    code: c`
      #include <stdio.h>

      int main(void) {
          int a = 11, b = 4;
          printf("%d %.2f\n", a / b, (double)a / b);
          return 0;
      }
    `,
    ausgabe: out`
      2 2.75
    `,
  },
  {
    id: 'k02-t05',
    typ: 'zuordnen',
    themen: ['format'],
    frage: 'Welche Ausgabe erzeugt welches Format für den Wert 5?',
    paare: [
      { links: '`%3d`', rechts: '`  5` (rechtsbündig, 3 breit)' },
      { links: '`%-3d`', rechts: '`5  ` (linksbündig, 3 breit)' },
      { links: '`%03d`', rechts: '`005`' },
      { links: '`%+d`', rechts: '`+5`' },
    ],
  },
  {
    id: 'k02-t06',
    typ: 'eingabe',
    themen: ['zahlensysteme'],
    frage: 'Welche Dezimalzahl ist `0x2A`?',
    antworten: ['42'],
  },
  {
    id: 'k02-t07',
    typ: 'wahrfalsch',
    themen: ['datentypen'],
    aussage: 'Der Überlauf eines `uint8_t` von 255 auf 0 ist in C genau festgelegt.',
    richtig: true,
    erklaerung: 'Bei `unsigned`-Typen ist der Überlauf definiert: Die Zählung beginnt wieder bei 0. Undefiniert ist er nur bei Typen mit Vorzeichen.',
  },
  {
    id: 'k02-t08',
    typ: 'vorhersage',
    themen: ['datentypen'],
    code: c`
      #include <stdio.h>

      int main(void) {
          char c = 'a';
          printf("%c%c%d\n", c, c - 32, 'b' - c);
          return 0;
      }
    `,
    ausgabe: out`
      aA1
    `,
  },
  {
    id: 'k02-t09',
    typ: 'auswahl',
    themen: ['konstanten', 'variablen'],
    frage: 'Welche Deklaration ist **ungültig**?',
    optionen: [
      { text: '`int 3d_druck = 1;`', richtig: true, warum: 'Ein Name darf nicht mit einer Ziffer beginnen.' },
      { text: '`const int MAX_ACHSEN = 3;`' },
      { text: '`double laenge_mm = 0.5;`' },
    ],
  },
  {
    id: 'k02-t10',
    typ: 'luecke',
    themen: ['format', 'zahlensysteme'],
    frage: 'Das Programm soll `Wert: 0x0C` ausgeben. Ergänze das Format.',
    code: c`
      #include <stdio.h>

      int main(void) {
          int wert = 12;
          printf("Wert: 0x__1__\n", wert);
          return 0;
      }
    `,
    luecken: [['%02X']],
    ausgabe: 'Wert: 0x0C\n',
  },
  {
    id: 'k02-t11',
    typ: 'wahrfalsch',
    themen: ['datentypen'],
    aussage: '`double x = 2,5;` speichert die Zahl zweieinhalb in `x`.',
    richtig: false,
    erklaerung: 'Kommazahlen werden mit Punkt geschrieben: `2.5`. Mit Komma meldet der Compiler einen Fehler.',
  },
  {
    id: 'k02-t12',
    typ: 'auswahl',
    themen: ['typumwandlung'],
    frage: 'Welche Zeile berechnet den Mittelwert von `int summe = 7` und `int n = 2` korrekt als 3.5?',
    optionen: [
      { text: '`double m = (double)summe / n;`', richtig: true },
      { text: '`double m = summe / n;`', warum: 'Ganzzahldivision: 3.0.' },
      { text: '`double m = (double)(summe / n);`', warum: 'Der Cast kommt zu spät: 3.0.' },
    ],
  },
  {
    id: 'k02-t13',
    typ: 'eingabe',
    themen: ['format'],
    frage: 'Welchen Platzhalter brauchst du für das Ergebnis von `sizeof`?',
    antworten: ['%zu'],
    exakt: true,
  },
  {
    id: 'k02-t14',
    typ: 'vorhersage',
    themen: ['konstanten', 'format'],
    code: c`
      #include <stdio.h>

      int main(void) {
          const double RADIUS_M = 2.0;
          const double PI = 3.14159;
          printf("%.1f m\n", 2 * PI * RADIUS_M);
          return 0;
      }
    `,
    ausgabe: out`
      12.6 m
    `,
  },
  {
    id: 'k02-t15',
    typ: 'programm',
    themen: ['variablen', 'format'],
    aufgabe: md`
      Ein Akku hat 2600 mAh Kapazität, das Gerät braucht 350 mA. Berechne die Laufzeit in Stunden als Kommazahl und gib sie mit zwei Nachkommastellen aus:

      ~~~text
      Laufzeit: 7.43 h
      ~~~
    `,
    start: c`
      #include <stdio.h>

      int main(void) {
          int kapazitaet_mah = 2600;
          int strom_ma = 350;

          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      int main(void) {
          int kapazitaet_mah = 2600;
          int strom_ma = 350;

          double laufzeit_h = (double)kapazitaet_mah / strom_ma;
          printf("Laufzeit: %.2f h\n", laufzeit_h);
          return 0;
      }
    `,
    tests: [{ name: 'Laufzeit stimmt', erwartet: { stdout: 'Laufzeit: 7.43 h\n' } }],
  },
  {
    id: 'k02-t16',
    typ: 'programm',
    themen: ['zahlensysteme', 'datentypen', 'format'],
    aufgabe: md`
      Gib den Wert \`uint8_t status = 0xA5;\` dezimal, hexadezimal (zweistellig, Grossbuchstaben) und als Zeichen aus. Der Zeichencode 165 ist kein ASCII-Zeichen, gib darum stattdessen das Zeichen für \`status - 100\` aus.

      ~~~text
      dezimal 165, hex A5, Zeichen A
      ~~~
    `,
    start: c`
      #include <stdio.h>
      #include <stdint.h>

      int main(void) {
          uint8_t status = 0xA5;

          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>
      #include <stdint.h>

      int main(void) {
          uint8_t status = 0xA5;

          printf("dezimal %d, hex %02X, Zeichen %c\n", status, status, status - 100);
          return 0;
      }
    `,
    tests: [{ name: 'Alle drei Darstellungen', erwartet: { stdout: 'dezimal 165, hex A5, Zeichen A\n' } }],
  },
];
