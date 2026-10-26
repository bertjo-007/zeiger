import { c, md, out } from '../tags.ts';
import type { Aufgabe } from '../types.ts';

/** Fragenpool für den Kapiteltest 7. */
export const test: Aufgabe[] = [
  {
    id: 'k07-t01',
    typ: 'vorhersage',
    themen: ['funktionen'],
    code: c`
      #include <stdio.h>

      int dreifach(int x) {
          return 3 * x;
      }

      int main(void) {
          int a = dreifach(2);
          printf("%d %d\n", a, dreifach(a + 1));
          return 0;
      }
    `,
    ausgabe: out`
      6 21
    `,
  },
  {
    id: 'k07-t02',
    typ: 'wahrfalsch',
    themen: ['funktionen'],
    aussage: 'Ein Funktionsprototyp endet mit einem Strichpunkt.',
    richtig: true,
  },
  {
    id: 'k07-t03',
    typ: 'auswahl',
    themen: ['funktionen'],
    frage: 'Welcher Funktionskopf passt zu «nimmt zwei Kommazahlen und liefert eine Kommazahl»?',
    optionen: [{ text: '`double f(double a, double b)`', richtig: true }, { text: '`void f(double a, double b)`', warum: '`void` liefert nichts zurück.' }, { text: '`double f(a, b)`', warum: 'Parameter brauchen Typen.' }],
  },
  {
    id: 'k07-t04',
    typ: 'vorhersage',
    themen: ['funktionen'],
    code: c`
      #include <stdio.h>

      void aendere(int x) {
          x = 99;
          printf("in aendere: %d\n", x);
      }

      int main(void) {
          int wert = 1;
          aendere(wert);
          printf("%d\n", wert);
          return 0;
      }
    `,
    ausgabe: out`
      in aendere: 99
      1
    `,
  },
  {
    id: 'k07-t05',
    typ: 'eingabe',
    themen: ['funktionen'],
    frage: 'Welches Schlüsselwort steht als Rückgabetyp einer Funktion, die nichts zurückgibt?',
    antworten: ['void'],
  },
  {
    id: 'k07-t06',
    typ: 'auswahl',
    themen: ['gueltigkeit'],
    frage: 'Wo ist eine in einem `if`-Block deklarierte Variable gültig?',
    optionen: [{ text: 'Nur innerhalb dieses Blocks', richtig: true }, { text: 'In der ganzen Funktion' }, { text: 'Im ganzen Programm' }],
  },
  {
    id: 'k07-t07',
    typ: 'zuordnen',
    themen: ['funktionen'],
    frage: 'Ordne zu.',
    paare: [
      { links: '`int f(int x);`', rechts: 'Prototyp' },
      { links: '`int f(int x) { return x; }`', rechts: 'Definition' },
      { links: '`y = f(3);`', rechts: 'Aufruf' },
      { links: '`return x;`', rechts: 'Rückgabe' },
    ],
  },
  {
    id: 'k07-t08',
    typ: 'auswahl',
    themen: ['funktionen'],
    frage: 'Clang warnt: «non-void function does not return a value in all control paths». Was ist das Problem?',
    optionen: [{ text: 'Auf mindestens einem Weg durch die Funktion fehlt ein `return` mit Wert.', richtig: true }, { text: 'Die Funktion hat zu viele Parameter.' }, { text: 'Die Funktion wird nie aufgerufen.' }],
  },
  {
    id: 'k07-t09',
    typ: 'eingabe',
    themen: ['funktionen'],
    frage: 'Welchen Wert hat `argc`, wenn ein Programm ohne zusätzliche Argumente gestartet wird?',
    antworten: ['1'],
  },
  {
    id: 'k07-t10',
    typ: 'vorhersage',
    themen: ['gueltigkeit'],
    code: c`
      #include <stdio.h>

      int zaehler = 0;

      void tick(void) {
          zaehler++;
      }

      int main(void) {
          for (int i = 0; i < 4; i++) {
              tick();
          }
          printf("%d\n", zaehler);
          return 0;
      }
    `,
    ausgabe: out`
      4
    `,
  },
  {
    id: 'k07-t11',
    typ: 'wahrfalsch',
    themen: ['funktionen', 'kompilieren'],
    aussage: 'Fehlt zu einem Prototyp die Definition, meldet der Linker einen Fehler, sobald die Funktion aufgerufen wird.',
    richtig: true,
  },
  {
    id: 'k07-t12',
    typ: 'luecke',
    themen: ['funktionen'],
    frage: 'Ergänze die Funktion, sodass sie den Betrag zurückgibt.',
    code: c`
      #include <stdio.h>

      int betrag(int x) {
          if (x < 0) {
              __1__ -x;
          }
          return x;
      }

      int main(void) {
          printf("%d %d\n", betrag(-4), betrag(7));
          return 0;
      }
    `,
    luecken: [['return']],
    ausgabe: '4 7\n',
  },
  {
    id: 'k07-t13',
    typ: 'auswahl',
    themen: ['stil', 'funktionen'],
    frage: 'Welche Aufteilung ist am besten?',
    optionen: [
      { text: 'Eine Funktion rechnet und gibt zurück, `main` gibt aus', richtig: true },
      { text: 'Alles in `main`, damit man nicht springen muss' },
      { text: 'Jede Funktion gibt selbst etwas aus und ändert globale Variablen' },
    ],
  },
  {
    id: 'k07-t14',
    typ: 'programm',
    themen: ['funktionen'],
    aufgabe: md`
      Schreibe \`int ist_schaltjahr(int jahr)\`: liefert 1, wenn das Jahr durch 4 teilbar ist, ausser es ist durch 100 teilbar, aber nicht durch 400. Sonst 0.
    `,
    start: c`
      #include <stdio.h>

      int main(void) {
          printf("%d\n", ist_schaltjahr(2024));
          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      int ist_schaltjahr(int jahr) {
          return (jahr % 4 == 0 && jahr % 100 != 0) || jahr % 400 == 0;
      }

      int main(void) {
          printf("%d\n", ist_schaltjahr(2024));
          return 0;
      }
    `,
    harness: c`
      #undef main
      #include <stdio.h>
      int ist_schaltjahr(int jahr);
      int main(void) {
          printf("%d %d %d %d\n", ist_schaltjahr(2024), ist_schaltjahr(2023), ist_schaltjahr(1900), ist_schaltjahr(2000));
          return 0;
      }
    `,
    tests: [{ name: '2024, 2023, 1900, 2000', erwartet: { stdout: '1 0 0 1\n' } }],
  },
  {
    id: 'k07-t15',
    typ: 'programm',
    themen: ['funktionen'],
    aufgabe: md`
      Schreibe \`double mittel3(double a, double b, double c)\`, die den Mittelwert der drei Werte zurückgibt.
    `,
    start: c`
      #include <stdio.h>

      int main(void) {
          printf("%.2f\n", mittel3(1.0, 2.0, 4.0));
          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      double mittel3(double a, double b, double c) {
          return (a + b + c) / 3.0;
      }

      int main(void) {
          printf("%.2f\n", mittel3(1.0, 2.0, 4.0));
          return 0;
      }
    `,
    harness: c`
      #undef main
      #include <stdio.h>
      double mittel3(double a, double b, double c);
      int main(void) {
          printf("%.2f %.2f\n", mittel3(1.0, 2.0, 4.0), mittel3(-3.0, 0.0, 3.0));
          return 0;
      }
    `,
    tests: [{ name: 'Zwei Aufrufe', erwartet: { stdout: '2.33 0.00\n' } }],
  },
];
