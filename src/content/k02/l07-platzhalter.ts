import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k02-l07',
  titel: 'Formatierte Ausgabe mit Platzhaltern',
  dauer: 30,
  stichwoerter: ['Platzhalter', 'Formatangabe', 'Feldbreite', 'Genauigkeit', '%d', '%5d', '%-10s', '%05d', '%+d', '%s', '%c', '%f', '%e', '%g', '%u', '%x', '%zu', 'linksbündig', 'rechtsbündig', 'Tabelle'],
  lernziele: [
    'den passenden Platzhalter für jeden Datentyp wählen',
    'Feldbreite, Ausrichtung, führende Nullen und Nachkommastellen festlegen',
    'saubere Tabellen mit `printf` ausgeben',
  ],
  erklaerung: md`
    Ein Platzhalter beginnt mit \`%\` und endet mit einem Buchstaben, der die **Art** des Werts angibt. Dazwischen kann stehen, **wie** der Wert dargestellt werden soll.

    ### Die wichtigsten Platzhalter

    | Platzhalter | für | Beispiel | Ausgabe |
    |---|---|---|---|
    | \`%d\` | \`int\` | \`printf("%d", -42)\` | \`-42\` |
    | \`%u\` | \`unsigned int\` | \`printf("%u", 42u)\` | \`42\` |
    | \`%ld\`, \`%lld\` | \`long\`, \`long long\` | \`printf("%lld", 5LL)\` | \`5\` |
    | \`%zu\` | \`size_t\` (z. B. \`sizeof\`) | \`printf("%zu", sizeof(int))\` | \`4\` |
    | \`%f\` | \`double\`, \`float\` | \`printf("%f", 2.5)\` | \`2.500000\` |
    | \`%e\` | \`double\`, wissenschaftlich | \`printf("%e", 1500.0)\` | \`1.500000e+03\` |
    | \`%g\` | \`double\`, kürzeste Form | \`printf("%g", 2.5)\` | \`2.5\` |
    | \`%c\` | \`char\` | \`printf("%c", 'S')\` | \`S\` |
    | \`%s\` | Zeichenkette | \`printf("%s", "Motor")\` | \`Motor\` |
    | \`%x\`, \`%X\` | hexadezimal | \`printf("%X", 255)\` | \`FF\` |
    | \`%%\` | Prozentzeichen | \`printf("%%")\` | \`%\` |

    Zu jedem Platzhalter gehört genau ein Wert, in derselben Reihenfolge. Passt der Typ nicht, gibt \`printf\` Unsinn aus. Clang warnt in diesem Fall.

    ### Feldbreite und Ausrichtung

    Zwischen \`%\` und dem Buchstaben kannst du Optionen angeben:

    | Format | Bedeutung | \`42\` wird zu |
    |---|---|---|
    | \`%5d\` | mindestens 5 Zeichen breit, rechtsbündig | \`   42\` |
    | \`%-5d\` | linksbündig (Rest mit Leerzeichen) | \`42   \` |
    | \`%05d\` | mit führenden Nullen auffüllen | \`00042\` |
    | \`%+d\` | Vorzeichen immer anzeigen | \`+42\` |

    Bei Kommazahlen legt \`.n\` die Nachkommastellen fest, beide Angaben lassen sich kombinieren: \`%8.2f\` heisst «insgesamt mindestens 8 Zeichen, davon 2 nach dem Punkt». Bei Text (\`%s\`) begrenzt \`.n\` die Anzahl ausgegebener Zeichen.

    ### Tabellen

    Feldbreiten machen saubere Tabellen möglich, auch wenn die Werte unterschiedlich lang sind. Üblich ist **Text linksbündig** (\`%-10s\`) und **Zahlen rechtsbündig** (\`%8.2f\`), damit die Dezimalpunkte untereinander stehen.

    > [!tipp] Breite reicht nicht?
    > Ist ein Wert länger als die Feldbreite, wird er nicht abgeschnitten, sondern einfach vollständig ausgegeben. Die Tabelle verrutscht dann. Wähle die Breiten nach dem längsten Eintrag.
  `,
  syntax: [
    {
      code: c`
        %[Optionen][Breite][.Genauigkeit]Art

        printf("%-10s|%6.1f|%04d\n", "Druck", 3.14159, 7);
        // Druck     |   3.1|0007
      `,
      text: md`Optionen: \`-\` linksbündig, \`0\` mit Nullen auffüllen, \`+\` Vorzeichen immer zeigen. Breite und Genauigkeit sind Zahlen.`,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          printf("%-10s %8s %6s\n", "Sensor", "Wert", "Status");
          printf("%-10s %8.2f %6s\n", "Temp", 21.456, "ok");
          printf("%-10s %8.2f %6s\n", "Druck", 3.1, "ok");
          printf("%-10s %8.2f %6s\n", "Feuchte", 58.0, "hoch");

          printf("Auftrag %05d, Abweichung %+d, Wert %e\n", 42, 7, 1234.5);
          printf("Kurz: %g und %g\n", 2.5, 0.0001);
          return 0;
      }
    `,
    ausgabe: out`
      Sensor         Wert Status
      Temp          21.46     ok
      Druck          3.10     ok
      Feuchte       58.00   hoch
      Auftrag 00042, Abweichung +7, Wert 1.234500e+03
      Kurz: 2.5 und 0.0001
    `,
  },
  zeilen: [
    { zeilen: '4', text: md`Die Kopfzeile verwendet dieselben Breiten wie die Datenzeilen, damit alles untereinander steht. \`%s\` gibt Text aus.` },
    { zeilen: '5-7', text: md`Namen linksbündig auf 10 Zeichen, Werte rechtsbündig auf 8 Zeichen mit 2 Nachkommastellen. 21.456 wird auf 21.46 gerundet.` },
    { zeilen: '9', text: md`\`%05d\` füllt mit Nullen auf, \`%+d\` zeigt das Pluszeichen, \`%e\` die Exponentialschreibweise.` },
    { zeilen: '10', text: md`\`%g\` wählt die kürzeste sinnvolle Darstellung und lässt überflüssige Nullen weg.` },
  ],
  ergebnis: md`
    Die vier Tabellenzeilen stehen sauber in Spalten, obwohl die Namen und Werte verschieden lang sind. Die Dezimalpunkte liegen genau untereinander, weil alle Werte rechtsbündig mit gleicher Breite und gleich vielen Nachkommastellen ausgegeben werden.
  `,
  fehler: [
    {
      titel: 'Anzahl Platzhalter und Werte stimmt nicht',
      text: md`Für jeden Platzhalter braucht es genau einen Wert. Fehlt einer, gibt \`printf\` irgendetwas aus; ist einer zu viel, wird er ignoriert. Clang warnt in beiden Fällen.`,
      falsch: c`printf("%d von %d\n", gut);`,
      richtig: c`printf("%d von %d\n", gut, gesamt);`,
    },
    {
      titel: 'Platzhalter passt nicht zum Typ',
      text: md`\`%d\` mit \`double\`, \`%f\` mit \`int\`, \`%d\` mit \`long long\`: Die Ausgabe ist falsch. Die Warnung «format specifies type …» zeigt den Fehler genau an.`,
      falsch: c`printf("%f\n", 5);`,
      richtig: c`printf("%f\n", 5.0);`,
    },
    {
      titel: 'Breite und Genauigkeit vertauscht',
      text: md`\`%2.8f\` heisst «mindestens 2 breit, 8 Nachkommastellen». Gemeint war meist \`%8.2f\`.`,
    },
  ],
  uebungen: [
    {
      id: 'k02-l07-u1',
      typ: 'vorhersage',
      titel: 'Breiten lesen',
      stufe: 1,
      themen: ['format'],
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("[%4d]\n", 7);
            printf("[%-4d]\n", 7);
            printf("[%04d]\n", 7);
            printf("[%.1f]\n", 2.75);
            return 0;
        }
      `,
      ausgabe: out`
        [   7]
        [7   ]
        [0007]
        [2.8]
      `,
      erklaerung: md`Die eckigen Klammern machen die Leerzeichen sichtbar. \`%.1f\` rundet 2.75 auf 2.8.`,
    },
    {
      id: 'k02-l07-u2',
      typ: 'luecke',
      titel: 'Platzhalter wählen',
      stufe: 1,
      themen: ['format'],
      frage: 'Ergänze die passenden Platzhalter.',
      code: c`
        #include <stdio.h>

        int main(void) {
            int stueck = 12;
            double gewicht = 3.5;
            char klasse = 'B';
            printf("__1__ Stück, __2__ kg, Klasse __3__\n", stueck, gewicht, klasse);
            return 0;
        }
      `,
      luecken: [['%d', '%i'], ['%.1f', '%f', '%g', '%lf', '%.1lf'], ['%c']],
      ausgabe: '12 Stück, 3.5 kg, Klasse B\n',
    },
    {
      id: 'k02-l07-u3',
      typ: 'programm',
      titel: 'Messprotokoll',
      stufe: 2,
      themen: ['format'],
      aufgabe: md`
        Gib dieses Protokoll aus. Die Bauteilnamen sind linksbündig auf 8 Zeichen, die Masse rechtsbündig auf 7 Zeichen mit 2 Nachkommastellen, die Prüfnummern fünfstellig mit führenden Nullen. Zwischen den Spalten steht je ein Leerzeichen.

        ~~~text
        Welle      25.40 00017
        Lager       8.00 00018
        Flansch   120.75 00019
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            // Bauteil, Mass in mm, Prüfnummer

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            printf("%-8s %7.2f %05d\n", "Welle", 25.4, 17);
            printf("%-8s %7.2f %05d\n", "Lager", 8.0, 18);
            printf("%-8s %7.2f %05d\n", "Flansch", 120.75, 19);
            return 0;
        }
      `,
      tests: [{ name: 'Protokoll stimmt', erwartet: { stdout: 'Welle      25.40 00017\nLager       8.00 00018\nFlansch   120.75 00019\n' }, tipp: md`Prüfe die Formate: \`%-8s\`, \`%7.2f\`, \`%05d\`.` }],
      regeln: [{ muss: '%-8s', inTexten: true, meldung: 'Verwende für die Namen die Feldbreite `%-8s`, statt Leerzeichen von Hand einzufügen.' }],
      hinweise: [md`Ein Formatstring für alle drei Zeilen: \`"%-8s %7.2f %05d\n"\`.`],
    },
    {
      id: 'k02-l07-u4',
      typ: 'fehlersuche',
      titel: 'Verrutschte Anzeige',
      stufe: 2,
      themen: ['format'],
      aufgabe: md`
        Die Anzeige einer Waage zeigt Unsinn. Korrigiere die Platzhalter, sodass sie ausgibt:

        ~~~text
        Gewicht: 12.350 kg
        Behälter: 3 von 8
        Code: 0x1F
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double gewicht = 12.35;
            int behaelter = 3;
            int max = 8;
            int code = 31;
            printf("Gewicht: %d kg\n", gewicht);
            printf("Behälter: %d von %d\n", behaelter);
            printf("Code: %d\n", code);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            double gewicht = 12.35;
            int behaelter = 3;
            int max = 8;
            int code = 31;
            printf("Gewicht: %.3f kg\n", gewicht);
            printf("Behälter: %d von %d\n", behaelter, max);
            printf("Code: 0x%X\n", code);
            return 0;
        }
      `,
      tests: [{ name: 'Anzeige stimmt', erwartet: { stdout: 'Gewicht: 12.350 kg\nBehälter: 3 von 8\nCode: 0x1F\n' } }],
      hinweise: [md`Lies die Warnungen: Sie nennen die falschen Platzhalter genau.`, md`Für den Code: \`0x%X\` gibt Grossbuchstaben aus.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k02-l07-c1',
      typ: 'zuordnen',
      themen: ['format'],
      frage: 'Welcher Platzhalter gehört zu welchem Typ?',
      paare: [
        { links: '`int`', rechts: '`%d`' },
        { links: '`double`', rechts: '`%f`' },
        { links: '`char`', rechts: '`%c`' },
        { links: 'Zeichenkette', rechts: '`%s`' },
        { links: '`size_t`', rechts: '`%zu`' },
      ],
    },
    {
      id: 'k02-l07-c2',
      typ: 'eingabe',
      themen: ['format'],
      frage: 'Welches Format gibt eine ganze Zahl mindestens 6 Zeichen breit **linksbündig** aus?',
      antworten: ['%-6d', '%-6i'],
      exakt: true,
    },
    {
      id: 'k02-l07-c3',
      typ: 'vorhersage',
      themen: ['format'],
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("%6.2f|\n", 3.14159);
            return 0;
        }
      `,
      // Führende Leerzeichen gehören zur Ausgabe, darum kein out-Template (es würde sie entfernen).
      ausgabe: '  3.14|\n',
      erklaerung: md`Sechs Zeichen breit, zwei Nachkommastellen: «3.14» hat vier Zeichen, davor kommen zwei Leerzeichen.`,
    },
  ],
  zusammenfassung: [
    'Jeder Platzhalter braucht genau einen Wert des passenden Typs, in der richtigen Reihenfolge.',
    '`%5d` rechtsbündig, `%-5d` linksbündig, `%05d` mit Nullen, `%+d` mit Vorzeichen.',
    '`%8.2f`: Breite 8, zwei Nachkommastellen. Text mit `%-10s` ausrichten.',
    'Tabellen: Text linksbündig, Zahlen rechtsbündig mit gleicher Genauigkeit.',
  ],
  referenz: ['printf', 'fmt-d', 'fmt-f', 'fmt-s', 'fmt-breite'],
};
