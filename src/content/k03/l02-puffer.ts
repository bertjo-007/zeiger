import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k03-l02',
  titel: 'Leerzeichen, Zeilenumbrüche und der Eingabepuffer',
  dauer: 25,
  stichwoerter: ['Eingabepuffer', 'Puffer', 'Leerraum', 'Whitespace', '" %c"', 'getchar', 'Zeilenumbruch', 'Enter', '%s', 'Wort einlesen'],
  lernziele: [
    'erklären, wie Eingaben im Eingabepuffer landen und von `scanf` gelesen werden',
    'das Problem mit `%c` und dem übrig gebliebenen Zeilenumbruch lösen',
    'ein einzelnes Wort mit `%s` und einer Breitenangabe einlesen',
  ],
  erklaerung: md`
    Was du tippst, landet nicht sofort im Programm, sondern zuerst im **Eingabepuffer**. Erst wenn du Enter drückst, wird die ganze Zeile freigegeben, **inklusive** des Zeilenumbruchs \`\n\`. \`scanf\` nimmt sich dann aus diesem Puffer, was es braucht, und lässt den Rest liegen.

    Tippt jemand \`42\` und Enter, steht im Puffer: \`4\`, \`2\`, \`\n\`. \`scanf("%d", &x)\` liest \`42\` und lässt das \`\n\` liegen.

    ### Leerraum wird meistens übersprungen

    **Leerraum** (englisch whitespace) sind Leerzeichen, Tabulatoren und Zeilenumbrüche. Die Formatangaben \`%d\`, \`%lf\` und \`%s\` **überspringen** Leerraum am Anfang. Darum funktioniert es, wenn man zwei Zahlen mit Leerzeichen oder auf zwei Zeilen eingibt.

    **\`%c\` überspringt nichts.** Es liest das nächste Zeichen, egal welches, auch ein liegengebliebenes \`\n\`. Das ist die Ursache eines der häufigsten Anfängerprobleme:

    ~~~c
    scanf("%d", &menge);     // liest 5, lässt \n im Puffer
    scanf("%c", &einheit);   // liest sofort das \n, wartet nicht!
    ~~~

    ### Die Lösung: ein Leerzeichen vor %c

    Ein **Leerzeichen im Formatstring** bedeutet für \`scanf\`: «Überspringe beliebig viel Leerraum». Mit \`" %c"\` liest \`scanf\` darum das erste Zeichen, das **kein** Leerraum ist:

    ~~~c
    scanf(" %c", &einheit);  // überspringt das \n und liest das echte Zeichen
    ~~~

    ### Wörter mit %s

    \`%s\` liest ein **Wort**: alle Zeichen bis zum nächsten Leerraum. In einer Zeichenkette (einem \`char\`-Array, Kapitel 8) wird es gespeichert. Zwei Regeln:

    - Bei \`%s\` steht **kein** \`&\` vor dem Array-Namen.
    - Gib immer eine **Höchstlänge** an: \`%19s\` für ein Array mit 20 Plätzen (einer bleibt für das Endzeichen). Ohne Breite kann ein langes Wort über das Array hinausschreiben.

    > [!veraltet] scanf("%s") ohne Breite
    > In vielen älteren Beispielen steht \`scanf("%s", name)\`. Ist die Eingabe länger als das Array, überschreibt \`scanf\` fremden Speicher: ein klassischer Pufferüberlauf und eine Sicherheitslücke. Immer mit Breite: \`scanf("%19s", name)\`.

    ### Rest einer Zeile verwerfen

    Manchmal will man alles bis zum Zeilenende wegwerfen, etwa nach einer ungültigen Eingabe. Das Standardrezept liest Zeichen für Zeichen mit \`getchar\`, bis das \`\n\` kommt. Es verwendet eine Schleife, die du in Kapitel 6 lernst:

    ~~~c
    int ch;
    while ((ch = getchar()) != '\n' && ch != EOF) { }
    ~~~

    > [!veraltet] fflush(stdin)
    > \`fflush(stdin)\` zum «Puffer leeren» ist nach dem C-Standard **undefiniert**. Unter Windows funktioniert es zufällig, anderswo nicht. Verwende das Rezept oben.
  `,
  syntax: [
    {
      code: c`
        scanf(" %c", &zeichen);     // Leerzeichen vor %c: Leerraum überspringen
        char wort[20];
        scanf("%19s", wort);        // ein Wort, höchstens 19 Zeichen, ohne &
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int menge = 0;
          char einheit = '?';
          char bezeichnung[20];

          printf("Menge: ");
          scanf("%d", &menge);
          printf("Einheit (k = kg, s = Stück): ");
          scanf(" %c", &einheit);
          printf("Material (ein Wort): ");
          scanf("%19s", bezeichnung);

          printf("Bestellt: %d %c %s\n", menge, einheit, bezeichnung);
          return 0;
      }
    `,
    stdin: '25\nk\nKupferdraht\n',
    ausgabe: out`
      Menge: 25
      Einheit (k = kg, s = Stück): k
      Material (ein Wort): Kupferdraht
      Bestellt: 25 k Kupferdraht
    `,
  },
  zeilen: [
    { zeilen: '6', text: md`Ein \`char\`-Array mit 20 Plätzen für ein Wort. Arrays lernst du in Kapitel 8 genau kennen.` },
    { zeilen: '9', text: md`\`%d\` liest 25. Das \`\n\` vom Enter bleibt im Puffer.` },
    { zeilen: '11', text: md`Das Leerzeichen vor \`%c\` überspringt das liegengebliebene \`\n\`, dann wird \`k\` gelesen.` },
    { zeilen: '13', text: md`\`%19s\` liest ein Wort mit höchstens 19 Zeichen. Kein \`&\`, weil ein Array-Name schon für seine Adresse steht.` },
  ],
  ergebnis: md`
    Alle drei Eingaben kommen richtig an. Entferne im Beispiel das Leerzeichen vor \`%c\` und führe es erneut aus: Das Programm fragt nach der Einheit, wartet aber nicht, weil \`%c\` sofort den Zeilenumbruch liest. Die Einheit ist dann ein \`\n\`, und das Material-Wort wird zur Einheit verschoben.
  `,
  fehler: [
    {
      titel: '%c ohne Leerzeichen nach einer Zahl',
      text: md`Nach \`scanf("%d", …)\` liegt das \`\n\` noch im Puffer. Ein folgendes \`%c\` liest es sofort.`,
      falsch: c`scanf("%c", &antwort);`,
      richtig: c`scanf(" %c", &antwort);`,
    },
    {
      titel: '%s für ganze Sätze',
      text: md`\`%s\` hört beim ersten Leerzeichen auf. Bei der Eingabe «Lager Nord» landet nur «Lager» in der Variable, «Nord» bleibt im Puffer und stört die nächste Eingabe. Für ganze Zeilen gibt es \`fgets\` (Lektion 3.4).`,
    },
    {
      titel: '& bei %s',
      text: md`Ein Array-Name steht bereits für seine Adresse. \`&name\` ist zwar meist harmlos, aber vom Typ her falsch; Clang warnt. Richtig ist \`scanf("%19s", name)\`.`,
    },
  ],
  uebungen: [
    {
      id: 'k03-l02-u1',
      typ: 'fehlersuche',
      titel: 'Die übersprungene Frage',
      stufe: 1,
      themen: ['eingabe'],
      aufgabe: md`
        Das Programm fragt nach einer Anzahl und dann nach einer Bestätigung (\`j\` oder \`n\`). Die zweite Frage wird aber übersprungen. Bei den Eingaben \`3\` und \`j\` soll erscheinen:

        ~~~text
        Anzahl: Bestätigen (j/n): 3 Teile, Antwort j
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int anzahl = 0;
            char antwort = '?';
            printf("Anzahl: ");
            scanf("%d", &anzahl);
            printf("Bestätigen (j/n): ");
            scanf("%c", &antwort);
            printf("%d Teile, Antwort %c\n", anzahl, antwort);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int anzahl = 0;
            char antwort = '?';
            printf("Anzahl: ");
            scanf("%d", &anzahl);
            printf("Bestätigen (j/n): ");
            scanf(" %c", &antwort);
            printf("%d Teile, Antwort %c\n", anzahl, antwort);
            return 0;
        }
      `,
      tests: [{ name: 'Eingaben 3 und j', stdin: '3\nj\n', erwartet: { stdout: 'Anzahl: Bestätigen (j/n): 3 Teile, Antwort j\n' } }],
      hinweise: [md`Was liegt nach dem Einlesen der Zahl noch im Puffer?`, md`Ein Leerzeichen vor \`%c\` überspringt den Zeilenumbruch.`],
    },
    {
      id: 'k03-l02-u2',
      typ: 'vorhersage',
      titel: 'Was liest %s?',
      stufe: 2,
      themen: ['eingabe'],
      frage: 'Das Programm erhält die Eingabe `Lager Nord 12` (eine Zeile). Was gibt es aus?',
      code: c`
        #include <stdio.h>

        int main(void) {
            char ort[20];
            int platz = 0;
            scanf("%19s", ort);
            scanf("%d", &platz);
            printf("[%s] [%d]\n", ort, platz);
            return 0;
        }
      `,
      stdin: 'Lager Nord 12\n',
      ausgabe: out`
        [Lager] [0]
      `,
      erklaerung: md`\`%s\` liest nur «Lager». Danach versucht \`%d\`, «Nord» als Zahl zu lesen, und scheitert; \`platz\` behält den Startwert 0. Wie man solche Fehler erkennt, zeigt die nächste Lektion.`,
    },
    {
      id: 'k03-l02-u3',
      typ: 'programm',
      titel: 'Bauteil erfassen',
      stufe: 2,
      themen: ['eingabe'],
      aufgabe: md`
        Lies nacheinander ein: die Bauteilbezeichnung (ein Wort, höchstens 15 Zeichen), die Anzahl (ganze Zahl) und die Qualitätsklasse (ein Buchstabe). Gib danach eine Zusammenfassung aus. Bei den Eingaben \`Lagerbock\`, \`40\` und \`B\`:

        ~~~text
        Bauteil: Anzahl: Klasse: 40 x Lagerbock, Klasse B
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            char bauteil[16];
            int anzahl = 0;
            char klasse = '?';

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            char bauteil[16];
            int anzahl = 0;
            char klasse = '?';

            printf("Bauteil: ");
            scanf("%15s", bauteil);
            printf("Anzahl: ");
            scanf("%d", &anzahl);
            printf("Klasse: ");
            scanf(" %c", &klasse);
            printf("%d x %s, Klasse %c\n", anzahl, bauteil, klasse);
            return 0;
        }
      `,
      tests: [
        { name: 'Lagerbock, 40, B', stdin: 'Lagerbock\n40\nB\n', erwartet: { stdout: 'Bauteil: Anzahl: Klasse: 40 x Lagerbock, Klasse B\n' } },
        { name: 'Alles auf einer Zeile', stdin: 'Welle 7 A\n', erwartet: { enthaelt: ['7 x Welle, Klasse A'] } },
      ],
      regeln: [{ muss: '%15s', inTexten: true, meldung: 'Begrenze das Wort mit `%15s` auf die Grösse des Arrays.' }],
      hinweise: [md`\`%15s\` für das Wort (ohne \`&\`), \`%d\` für die Zahl, \`" %c"\` für den Buchstaben.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k03-l02-c1',
      typ: 'auswahl',
      themen: ['eingabe'],
      frage: 'Warum schreibt man `scanf(" %c", &z)` mit Leerzeichen vor `%c`?',
      optionen: [
        { text: 'Damit Leerraum wie ein übrig gebliebenes `\\n` übersprungen wird', richtig: true },
        { text: 'Damit das Zeichen mit einem Leerzeichen ausgegeben wird', warum: '`scanf` gibt nichts aus.' },
        { text: 'Das Leerzeichen ist bedeutungslos.', warum: 'Im Formatstring von `scanf` bedeutet ein Leerzeichen «Leerraum überspringen».' },
      ],
    },
    {
      id: 'k03-l02-c2',
      typ: 'wahrfalsch',
      themen: ['eingabe'],
      aussage: '`%d` überspringt führende Leerzeichen und Zeilenumbrüche automatisch.',
      richtig: true,
    },
    {
      id: 'k03-l02-c3',
      typ: 'eingabe',
      themen: ['eingabe', 'strings'],
      frage: 'Mit welcher Formatangabe liest du sicher ein Wort in `char name[10]` ein?',
      antworten: ['%9s'],
      exakt: true,
      erklaerung: '9 Zeichen plus das Endzeichen passen in 10 Plätze.',
    },
  ],
  zusammenfassung: [
    'Eingaben landen zeilenweise im Eingabepuffer, inklusive `\\n`.',
    '`%d`, `%lf` und `%s` überspringen führenden Leerraum, `%c` nicht.',
    '`" %c"` mit Leerzeichen liest das nächste Zeichen, das kein Leerraum ist.',
    '`%s` liest ein Wort bis zum Leerraum; immer mit Breite (`%19s`) und ohne `&`.',
    '`fflush(stdin)` ist undefiniert; den Rest der Zeile mit einer `getchar`-Schleife verwerfen.',
  ],
  referenz: ['scanf', 'getchar'],
};
