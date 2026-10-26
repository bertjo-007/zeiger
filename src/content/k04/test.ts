import { c, md, out } from '../tags.ts';
import type { Aufgabe } from '../types.ts';

/** Fragenpool für den Kapiteltest 4. */
export const test: Aufgabe[] = [
  {
    id: 'k04-t01',
    typ: 'vorhersage',
    themen: ['operatoren'],
    code: c`
      #include <stdio.h>

      int main(void) {
          printf("%d %d\n", 47 / 10, 47 % 10);
          return 0;
      }
    `,
    ausgabe: out`
      4 7
    `,
  },
  {
    id: 'k04-t02',
    typ: 'eingabe',
    themen: ['operatoren'],
    frage: 'Welchen Wert hat `x` nach `int x = 6; x *= 3; x -= 4;`?',
    antworten: ['14'],
  },
  {
    id: 'k04-t03',
    typ: 'vorhersage',
    themen: ['operatoren'],
    code: c`
      #include <stdio.h>

      int main(void) {
          int i = 10;
          int a = i++;
          int b = ++i;
          printf("%d %d %d\n", a, b, i);
          return 0;
      }
    `,
    ausgabe: out`
      10 12 12
    `,
  },
  {
    id: 'k04-t04',
    typ: 'auswahl',
    themen: ['operatoren'],
    frage: 'Welcher Ausdruck prüft, ob `t` zwischen 18 und 24 liegt (einschliesslich)?',
    optionen: [{ text: '`t >= 18 && t <= 24`', richtig: true }, { text: '`18 <= t <= 24`', warum: 'Vergleichsketten funktionieren in C nicht wie in der Mathematik.' }, { text: '`t >= 18 || t <= 24`', warum: 'Das ist für jede Zahl wahr.' }],
  },
  {
    id: 'k04-t05',
    typ: 'wahrfalsch',
    themen: ['operatoren'],
    aussage: 'Bei `a || b` wird `b` nicht ausgewertet, wenn `a` wahr ist.',
    richtig: true,
  },
  {
    id: 'k04-t06',
    typ: 'eingabe',
    themen: ['rangfolge'],
    frage: 'Welchen Wert hat `20 - 2 * 3 + 4 / 2`?',
    antworten: ['16'],
  },
  {
    id: 'k04-t07',
    typ: 'zuordnen',
    themen: ['operatoren'],
    frage: 'Ordne die Ausdrücke ihrem Wert zu (alle Werte `int`).',
    paare: [
      { links: '`9 / 2`', rechts: '4' },
      { links: '`9 % 2`', rechts: '1' },
      { links: '`9 > 2`', rechts: '`1` (wahr)' },
      { links: '`!(9 > 2)`', rechts: '`0` (falsch)' },
      { links: '`9 - 2 * 2`', rechts: '5' },
    ],
  },
  {
    id: 'k04-t08',
    typ: 'auswahl',
    themen: ['operatoren'],
    frage: 'Was ist der Fehler in `if (druck = 5)`?',
    optionen: [{ text: 'Es ist eine Zuweisung statt eines Vergleichs; die Bedingung ist immer wahr.', richtig: true }, { text: 'Es fehlt ein Strichpunkt.' }, { text: 'Kein Fehler.', warum: 'Vergleichen heisst `==`.' }],
  },
  {
    id: 'k04-t09',
    typ: 'vorhersage',
    themen: ['operatoren'],
    code: c`
      #include <stdio.h>

      int main(void) {
          int a = 0, b = 3;
          printf("%d %d %d\n", a && b, a || b, !a && b > 2);
          return 0;
      }
    `,
    ausgabe: out`
      0 1 1
    `,
  },
  {
    id: 'k04-t10',
    typ: 'wahrfalsch',
    themen: ['rangfolge'],
    aussage: '`pow(2.0, 3.0)` und `2 ^ 3` liefern in C denselben Wert.',
    richtig: false,
    erklaerung: '`^` ist das bitweise XOR: `2 ^ 3` ist 1.',
  },
  {
    id: 'k04-t11',
    typ: 'luecke',
    themen: ['operatoren'],
    frage: 'Das Programm soll die letzte Ziffer von `n` ausgeben und sie danach abschneiden. Ergänze die Operatoren.',
    code: c`
      #include <stdio.h>

      int main(void) {
          int n = 4096;
          printf("%d\n", n __1__ 10);
          n __2__ 10;
          printf("%d\n", n);
          return 0;
      }
    `,
    luecken: [['%'], ['/=']],
    ausgabe: '6\n409\n',
  },
  {
    id: 'k04-t12',
    typ: 'auswahl',
    themen: ['rangfolge'],
    frage: 'Wie berechnest du den Sinus von 45 Grad mit `sin` aus `<math.h>`?',
    optionen: [{ text: '`sin(45.0 * PI / 180.0)`', richtig: true }, { text: '`sin(45.0)`', warum: '`sin` erwartet Bogenmass.' }, { text: '`sin(45.0 / PI * 180.0)`', warum: 'Die Umrechnung ist verkehrt herum.' }],
  },
  {
    id: 'k04-t13',
    typ: 'wahrfalsch',
    themen: ['operatoren'],
    aussage: '`i = i++;` ist eine gültige und eindeutige Art, `i` um 1 zu erhöhen.',
    richtig: false,
    erklaerung: 'Dieselbe Variable wird zweimal in einer Anweisung geändert: undefiniertes Verhalten. Einfach `i++;`.',
  },
  {
    id: 'k04-t14',
    typ: 'eingabe',
    themen: ['operatoren'],
    frage: 'Welcher Operator liefert den Rest einer ganzzahligen Division?',
    antworten: ['%'],
    exakt: true,
  },
  {
    id: 'k04-t15',
    typ: 'programm',
    themen: ['operatoren', 'eingabe'],
    aufgabe: md`
      Lies eine Anzahl Sekunden ein und gib sie als Stunden und Minuten aus (Sekunden werden abgeschnitten). Bei 7384:

      ~~~text
      2 h 3 min
      ~~~
    `,
    start: c`
      #include <stdio.h>

      int main(void) {
          int s = 0;
          scanf("%d", &s);

          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      int main(void) {
          int s = 0;
          scanf("%d", &s);

          printf("%d h %d min\n", s / 3600, s % 3600 / 60);
          return 0;
      }
    `,
    tests: [
      { name: '7384 s', stdin: '7384\n', erwartet: { stdout: '2 h 3 min\n' } },
      { name: '59 s', stdin: '59\n', erwartet: { stdout: '0 h 0 min\n' } },
    ],
  },
  {
    id: 'k04-t16',
    typ: 'programm',
    themen: ['operatoren'],
    aufgabe: md`
      Eine Ampel darf auf Grün schalten, wenn die Querrichtung rot ist **und** (ein Auto wartet **oder** ein Fussgänger gedrückt hat). Lies drei Werte (je 0 oder 1): Querrichtung rot, Auto wartet, Fussgänger. Gib \`Gruen: 1\` oder \`Gruen: 0\` aus.
    `,
    start: c`
      #include <stdio.h>

      int main(void) {
          int quer_rot = 0, auto_wartet = 0, fussgaenger = 0;
          scanf("%d %d %d", &quer_rot, &auto_wartet, &fussgaenger);

          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      int main(void) {
          int quer_rot = 0, auto_wartet = 0, fussgaenger = 0;
          scanf("%d %d %d", &quer_rot, &auto_wartet, &fussgaenger);

          int gruen = quer_rot && (auto_wartet || fussgaenger);
          printf("Gruen: %d\n", gruen);
          return 0;
      }
    `,
    tests: [
      { name: 'Quer rot, Auto wartet', stdin: '1 1 0\n', erwartet: { stdout: 'Gruen: 1\n' } },
      { name: 'Quer rot, Fussgänger', stdin: '1 0 1\n', erwartet: { stdout: 'Gruen: 1\n' } },
      { name: 'Quer grün, Auto wartet', stdin: '0 1 1\n', erwartet: { stdout: 'Gruen: 0\n' } },
      { name: 'Niemand wartet', stdin: '1 0 0\n', erwartet: { stdout: 'Gruen: 0\n' } },
    ],
  },
];
