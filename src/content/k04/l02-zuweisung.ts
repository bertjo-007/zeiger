import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k04-l02',
  titel: 'Zuweisung, Inkrement und Dekrement',
  dauer: 20,
  stichwoerter: ['Zuweisung', '+=', '-=', '*=', '/=', '%=', '++', '--', 'Inkrement', 'Dekrement', 'Präfix', 'Postfix', 'zusammengesetzte Zuweisung'],
  lernziele: [
    'zusammengesetzte Zuweisungen wie `+=` und `*=` lesen und schreiben',
    'mit `++` und `--` um eins erhöhen und verringern',
    'den Unterschied zwischen `x++` und `++x` erklären und die Fallen meiden',
  ],
  erklaerung: md`
    Sehr oft wird eine Variable auf Grundlage ihres eigenen Werts verändert: Zähler erhöhen, Summen bilden, einen Wert halbieren. Dafür gibt es Kurzformen.

    ### Zusammengesetzte Zuweisung

    | Kurzform | bedeutet |
    |---|---|
    | \`x += 5;\` | \`x = x + 5;\` |
    | \`x -= 5;\` | \`x = x - 5;\` |
    | \`x *= 2;\` | \`x = x * 2;\` |
    | \`x /= 2;\` | \`x = x / 2;\` |
    | \`x %= 8;\` | \`x = x % 8;\` |

    Die Kurzformen sind nicht nur kürzer, sie machen auch klar: «Hier wird \`x\` verändert». Der Name steht nur einmal da, ein Tippfehler wie \`summe = summ + wert\` ist ausgeschlossen.

    ### Inkrement und Dekrement

    Ums Erhöhen oder Verringern um genau 1 geht es so oft, dass es eigene Operatoren gibt:

    - \`zaehler++;\` erhöht um 1 (**Inkrement**),
    - \`zaehler--;\` verringert um 1 (**Dekrement**).

    Als eigene Anweisung ist es egal, ob \`++\` vor oder nach dem Namen steht. Ein Unterschied entsteht erst, wenn der Ausdruck gleichzeitig **als Wert verwendet** wird:

    | Schreibweise | Name | Wert des Ausdrucks |
    |---|---|---|
    | \`x++\` | Postfix | der **alte** Wert, danach wird erhöht |
    | \`++x\` | Präfix | erst erhöhen, dann der **neue** Wert |

    ~~~c
    int x = 5;
    int a = x++;   // a = 5, x = 6
    int b = ++x;   // x = 7, b = 7
    ~~~

    > [!achtung] Nur einmal pro Anweisung ändern
    > Ausdrücke wie \`i = i++;\` oder \`printf("%d %d", i++, i++);\` ändern dieselbe Variable mehrfach in einer Anweisung. Das ist in C **undefiniertes Verhalten**: Das Ergebnis darf je nach Compiler verschieden sein. Clang warnt. Schreibe \`++\` und \`--\` am besten als eigene Anweisung.

    > [!praxis] Zähler in Steuerungen
    > Ein Stückzähler am Förderband (\`stueck++;\`), ein Rückwärtszähler für Wartungsintervalle (\`bis_wartung--;\`), eine Summe von Messwerten (\`summe += messwert;\`): Diese Kurzformen findest du in fast jedem Steuerungsprogramm.
  `,
  syntax: [
    {
      code: c`
        x += wert;    x -= wert;    x *= wert;    x /= wert;    x %= wert;
        x++;          x--;          ++x;          --x;
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int stueck = 0;
          int bis_wartung = 3;
          double summe_kg = 0.0;

          stueck++;               // erstes Teil
          summe_kg += 2.4;
          bis_wartung--;

          stueck++;               // zweites Teil
          summe_kg += 2.6;
          bis_wartung--;

          printf("Stück: %d, Gewicht: %.1f kg, bis Wartung: %d\n", stueck, summe_kg, bis_wartung);

          int x = 5;
          int a = x++;
          int b = ++x;
          printf("a = %d, b = %d, x = %d\n", a, b, x);
          return 0;
      }
    `,
    ausgabe: out`
      Stück: 2, Gewicht: 5.0 kg, bis Wartung: 1
      a = 5, b = 7, x = 7
    `,
  },
  zeilen: [
    { zeilen: '8', text: md`\`stueck++\` als eigene Anweisung: Der Zähler steigt von 0 auf 1.` },
    { zeilen: '9', text: md`\`summe_kg += 2.4\` addiert das Gewicht zur bisherigen Summe.` },
    { zeilen: '10', text: md`\`bis_wartung--\` zählt rückwärts.` },
    { zeilen: '19', text: md`Postfix: \`a\` bekommt den alten Wert 5, danach wird \`x\` zu 6.` },
    { zeilen: '20', text: md`Präfix: \`x\` wird zu 7, dann bekommt \`b\` den neuen Wert 7.` },
  ],
  ergebnis: md`
    Nach zwei Teilen zeigt der Zähler 2, die Summe 5.0 kg und der Wartungszähler 1. Die zweite Zeile zeigt den Unterschied zwischen Postfix und Präfix: \`a\` ist 5, \`b\` ist 7.
  `,
  fehler: [
    {
      titel: '=+ statt +=',
      text: md`\`x =+ 5;\` ist gültiger Code, bedeutet aber \`x = +5;\`, also «setze x auf 5». Der Operator heisst \`+=\`, das Gleichheitszeichen kommt zuletzt.`,
      falsch: c`summe =+ wert;`,
      richtig: c`summe += wert;`,
    },
    {
      titel: 'Dieselbe Variable mehrfach ändern',
      text: md`\`i = i++ + 1;\` und ähnliche Konstruktionen sind undefiniert. Teile sie in einzelne, klare Anweisungen auf.`,
      falsch: c`i = i++ + 1;`,
      richtig: c`i += 2;`,
    },
    {
      titel: 'Ganzzahl /= ',
      text: md`Bei \`int\` wird auch mit \`/=\` ganzzahlig geteilt: \`x = 7; x /= 2;\` ergibt 3.`,
    },
  ],
  uebungen: [
    {
      id: 'k04-l02-u1',
      typ: 'vorhersage',
      titel: 'Kurzformen nacheinander',
      stufe: 1,
      themen: ['operatoren'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int x = 10;
            x += 5;
            x *= 2;
            x -= 4;
            x /= 3;
            x %= 4;
            printf("%d\n", x);
            return 0;
        }
      `,
      ausgabe: out`
        0
      `,
      erklaerung: md`Schritt für Schritt: 10 + 5 = 15, mal 2 = 30, minus 4 = 26, ganzzahlig durch 3 = 8, und 8 % 4 = 0.`,
    },
    {
      id: 'k04-l02-u2',
      typ: 'vorhersage',
      titel: 'Vorher oder nachher?',
      stufe: 2,
      themen: ['operatoren'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int n = 3;
            int a = n--;
            int b = --n;
            printf("%d %d %d\n", a, b, n);
            return 0;
        }
      `,
      ausgabe: out`
        3 1 1
      `,
      erklaerung: md`\`n--\` liefert den alten Wert 3, danach ist \`n\` 2. \`--n\` verringert zuerst auf 1 und liefert dann 1.`,
    },
    {
      id: 'k04-l02-u3',
      typ: 'erweitern',
      titel: 'Lagerbuchung',
      stufe: 2,
      themen: ['operatoren', 'variablen'],
      aufgabe: md`
        Der Lagerbestand startet bei 40. Verbuche mit **Kurzformen** (\`+=\`, \`-=\`, \`++\`, \`--\`):

        1. Lieferung von 25 Stück,
        2. Entnahme von 18 Stück,
        3. ein Teil zurückgebracht,
        4. ein Teil als defekt ausgebucht.

        Ausgabe: \`Bestand: 47\`
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int bestand = 40;

            printf("Bestand: %d\n", bestand);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int bestand = 40;
            bestand += 25;
            bestand -= 18;
            bestand++;
            bestand--;
            printf("Bestand: %d\n", bestand);
            return 0;
        }
      `,
      tests: [{ name: 'Bestand 47', erwartet: { stdout: 'Bestand: 47\n' } }],
      regeln: [
        { muss: '\\+=', meldung: 'Verwende `+=` für die Lieferung.' },
        { muss: '-=', meldung: 'Verwende `-=` für die Entnahme.' },
        { muss: '\\+\\+', meldung: 'Verwende `++` für das zurückgebrachte Teil.' },
        { muss: '--', meldung: 'Verwende `--` für das defekte Teil.' },
      ],
      hinweise: [md`Vier Anweisungen zwischen der Deklaration und dem \`printf\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k04-l02-c1',
      typ: 'auswahl',
      themen: ['operatoren'],
      frage: 'Was bedeutet `wert *= 3;`?',
      optionen: [{ text: '`wert = wert * 3;`', richtig: true }, { text: '`wert = 3;`' }, { text: '`wert = wert * wert * wert;`' }],
    },
    {
      id: 'k04-l02-c2',
      typ: 'eingabe',
      themen: ['operatoren'],
      frage: '`int x = 4; int y = x++;` Welchen Wert hat `y`?',
      antworten: ['4'],
    },
    {
      id: 'k04-l02-c3',
      typ: 'wahrfalsch',
      themen: ['operatoren'],
      aussage: '`x =+ 3;` erhöht x um 3.',
      richtig: false,
      erklaerung: '`=+` ist eine Zuweisung von `+3`. Der Operator heisst `+=`.',
    },
  ],
  zusammenfassung: [
    '`x += a` heisst `x = x + a`; ebenso `-=`, `*=`, `/=`, `%=`.',
    '`x++` und `x--` erhöhen bzw. verringern um 1.',
    'Als Wert: `x++` liefert den alten, `++x` den neuen Wert.',
    'Dieselbe Variable nie mehrfach in einer Anweisung ändern.',
  ],
  referenz: ['op-zuweisung', 'op-inkrement'],
};
