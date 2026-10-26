import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k04-l03',
  titel: 'Vergleichsoperatoren',
  dauer: 20,
  stichwoerter: ['Vergleich', '==', '!=', '<', '>', '<=', '>=', 'wahr', 'falsch', 'bool', 'stdbool.h', 'true', 'false', 'Bedingung'],
  lernziele: [
    'Werte mit `==`, `!=`, `<`, `>`, `<=` und `>=` vergleichen',
    'erklären, dass ein Vergleich in C den Wert 1 (wahr) oder 0 (falsch) ergibt',
    'Ergebnisse von Vergleichen in `bool`-Variablen speichern',
  ],
  erklaerung: md`
    Steuerungen entscheiden ständig: Ist die Temperatur zu hoch? Ist der Tank voll? Hat der Encoder die Zielposition erreicht? Grundlage jeder Entscheidung ist ein **Vergleich**.

    | Operator | Bedeutung | Beispiel | Ergebnis |
    |---|---|---|---|
    | \`==\` | gleich | \`5 == 5\` | 1 |
    | \`!=\` | ungleich | \`5 != 3\` | 1 |
    | \`<\` | kleiner als | \`3 < 5\` | 1 |
    | \`>\` | grösser als | \`3 > 5\` | 0 |
    | \`<=\` | kleiner oder gleich | \`5 <= 5\` | 1 |
    | \`>=\` | grösser oder gleich | \`4 >= 5\` | 0 |

    ### Wahr ist 1, falsch ist 0

    In C ist das Ergebnis eines Vergleichs eine **Zahl**: **1** für wahr, **0** für falsch. Umgekehrt gilt jede Zahl ungleich 0 als «wahr», nur 0 als «falsch». Darum lässt sich ein Vergleich wie jede Zahl ausgeben oder speichern:

    ~~~c
    printf("%d\n", 7 > 3);   // 1
    ~~~

    ### bool

    Lesbarer ist der Typ **\`bool\`** aus \`<stdbool.h>\` mit den Werten \`true\` und \`false\`. Intern sind das wieder 1 und 0, aber der Name zeigt, dass die Variable nur «ja» oder «nein» bedeutet:

    ~~~c
    #include <stdbool.h>
    bool tank_voll = fuellstand >= 1000;
    ~~~

    Gute Namen für \`bool\`-Variablen klingen wie eine Ja/Nein-Frage: \`tank_voll\`, \`motor_laeuft\`, \`ist_gueltig\`.

    > [!info] C23
    > Ab C23 sind \`bool\`, \`true\` und \`false\` fest eingebaut; der Header ist dann nicht mehr nötig. In C17 brauchst du \`#include <stdbool.h>\`.

    ### Zwei Fallen

    - **\`=\` statt \`==\`:** \`x = 5\` weist zu, \`x == 5\` vergleicht. In einer Bedingung ist \`if (x = 5)\` immer wahr und verändert \`x\`. Clang warnt.
    - **Kommazahlen mit \`==\`:** Wegen Rundungsfehlern (Kapitel 2) vergleicht man Kommazahlen besser mit Toleranz: \`fabs(a - b) < 1e-9\`.
    - **Ketten wie \`0 < x < 10\`** funktionieren nicht wie in der Mathematik: Zuerst wird \`0 < x\` zu 0 oder 1, und das ist immer kleiner als 10. Richtig: \`0 < x && x < 10\` (nächste Lektion).
  `,
  syntax: [
    {
      code: c`
        a == b    a != b    a < b    a > b    a <= b    a >= b

        #include <stdbool.h>
        bool ergebnis = (a < b);   // true oder false
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdbool.h>

      int main(void) {
          int fuellstand_l = 870;
          const int MAXIMUM_L = 1000;
          double temperatur = 64.5;

          bool tank_voll = fuellstand_l >= MAXIMUM_L;
          bool zu_heiss = temperatur > 60.0;

          printf("Tank voll: %d\n", tank_voll);
          printf("Zu heiss: %d\n", zu_heiss);
          printf("Noch Platz: %d Liter\n", MAXIMUM_L - fuellstand_l);
          printf("Genau 870 Liter: %d\n", fuellstand_l == 870);
          return 0;
      }
    `,
    ausgabe: out`
      Tank voll: 0
      Zu heiss: 1
      Noch Platz: 130 Liter
      Genau 870 Liter: 1
    `,
  },
  zeilen: [
    { zeilen: '2', text: md`\`<stdbool.h>\` bringt \`bool\`, \`true\` und \`false\`.` },
    { zeilen: '9-10', text: md`Die Vergleiche werden ausgewertet und das Ergebnis gespeichert. Die Namen lesen sich wie Fragen.` },
    { zeilen: '12-13', text: md`Ein \`bool\` wird mit \`%d\` als 0 oder 1 ausgegeben.` },
    { zeilen: '15', text: md`Ein Vergleich kann auch direkt als Wert an \`printf\` gehen.` },
  ],
  ergebnis: md`
    870 Liter sind nicht mindestens 1000, also ist \`tank_voll\` 0. 64,5 Grad sind mehr als 60, also ist \`zu_heiss\` 1. In Kapitel 5 steuern solche Werte mit \`if\`, was das Programm als Nächstes tut.
  `,
  fehler: [
    {
      titel: '= statt ==',
      text: md`Ein einzelnes \`=\` ist eine Zuweisung. Clang warnt: «using the result of an assignment as a condition».`,
      falsch: c`bool erreicht = (position = 500);`,
      richtig: c`bool erreicht = (position == 500);`,
    },
    {
      titel: 'Vergleichsketten',
      text: md`\`10 < t < 20\` ist für jede Temperatur wahr, weil \`10 < t\` zuerst zu 0 oder 1 wird. Zwei Vergleiche mit \`&&\` verbinden.`,
      falsch: c`bool ok = 10 < t < 20;`,
      richtig: c`bool ok = 10 < t && t < 20;`,
    },
    {
      titel: '=< statt <=',
      text: md`Es heisst \`<=\` und \`>=\`, das Gleichheitszeichen steht immer rechts. \`=<\` ist ein Syntaxfehler.`,
    },
  ],
  uebungen: [
    {
      id: 'k04-l03-u1',
      typ: 'vorhersage',
      titel: 'Wahr oder falsch?',
      stufe: 1,
      themen: ['operatoren'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int a = 7, b = 7, c = 12;
            printf("%d %d %d %d\n", a == b, a != b, c > a, a >= c);
            return 0;
        }
      `,
      ausgabe: out`
        1 0 1 0
      `,
    },
    {
      id: 'k04-l03-u2',
      typ: 'programm',
      titel: 'Grenzwerte prüfen',
      stufe: 2,
      themen: ['operatoren'],
      aufgabe: md`
        Lies einen Druck in bar (Kommazahl) ein. Speichere in zwei \`bool\`-Variablen, ob er **unter 2.0** und ob er **über 8.0** liegt, und gib beide als 0 oder 1 aus. Bei 9.5:

        ~~~text
        zu tief: 0
        zu hoch: 1
        ~~~
      `,
      start: c`
        #include <stdio.h>
        #include <stdbool.h>

        int main(void) {
            double druck = 0.0;
            scanf("%lf", &druck);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdbool.h>

        int main(void) {
            double druck = 0.0;
            scanf("%lf", &druck);

            bool zu_tief = druck < 2.0;
            bool zu_hoch = druck > 8.0;
            printf("zu tief: %d\n", zu_tief);
            printf("zu hoch: %d\n", zu_hoch);
            return 0;
        }
      `,
      tests: [
        { name: '9.5 bar', stdin: '9.5\n', erwartet: { stdout: 'zu tief: 0\nzu hoch: 1\n' } },
        { name: '1.2 bar', stdin: '1.2\n', erwartet: { stdout: 'zu tief: 1\nzu hoch: 0\n' } },
        { name: 'Grenze 8.0 bar', stdin: '8.0\n', erwartet: { stdout: 'zu tief: 0\nzu hoch: 0\n' }, tipp: md`8.0 ist nicht **über** 8.0.` },
      ],
      regeln: [{ muss: '\\bbool\\b', meldung: 'Speichere die Ergebnisse in `bool`-Variablen.' }],
      hinweise: [md`\`bool zu_tief = druck < 2.0;\``],
    },
    {
      id: 'k04-l03-u3',
      typ: 'zuordnen',
      titel: 'Operatoren benennen',
      stufe: 1,
      themen: ['operatoren'],
      frage: 'Was bedeutet welcher Operator?',
      paare: [
        { links: '`==`', rechts: 'ist gleich' },
        { links: '`!=`', rechts: 'ist ungleich' },
        { links: '`<=`', rechts: 'kleiner oder gleich' },
        { links: '`=`', rechts: 'Zuweisung' },
        { links: '`>`', rechts: 'grösser als' },
      ],
    },
  ],
  wissenscheck: [
    {
      id: 'k04-l03-c1',
      typ: 'eingabe',
      themen: ['operatoren'],
      frage: 'Welchen Zahlenwert hat in C der Ausdruck `3 > 8`?',
      antworten: ['0'],
    },
    {
      id: 'k04-l03-c2',
      typ: 'wahrfalsch',
      themen: ['operatoren'],
      aussage: 'Der Ausdruck `5 < x < 10` prüft, ob x zwischen 5 und 10 liegt.',
      richtig: false,
      erklaerung: 'Zuerst wird `5 < x` zu 0 oder 1; beides ist kleiner als 10. Richtig: `5 < x && x < 10`.',
    },
    {
      id: 'k04-l03-c3',
      typ: 'auswahl',
      themen: ['operatoren'],
      frage: 'Welcher Header stellt in C17 den Typ `bool` bereit?',
      optionen: [{ text: '`<stdbool.h>`', richtig: true }, { text: '`<stdlib.h>`' }, { text: '`<bool.h>`', warum: 'Diesen Header gibt es nicht.' }],
    },
  ],
  zusammenfassung: [
    'Vergleiche: `==`, `!=`, `<`, `>`, `<=`, `>=`.',
    'Ein Vergleich ergibt 1 (wahr) oder 0 (falsch); jede Zahl ungleich 0 gilt als wahr.',
    '`bool` mit `true`/`false` aus `<stdbool.h>` macht Ja/Nein-Werte lesbar.',
    'Vorsicht: `=` ist Zuweisung, Kommazahlen mit Toleranz vergleichen, keine Vergleichsketten.',
  ],
  referenz: ['op-vergleich', 'bool'],
};
