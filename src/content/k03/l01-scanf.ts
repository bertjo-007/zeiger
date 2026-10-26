import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k03-l01',
  titel: 'Eingaben mit scanf',
  dauer: 30,
  stichwoerter: ['scanf', 'Eingabe', 'Tastatur', '&', 'Adressoperator', '%d', '%lf', '%c', '%s', 'stdin', 'Eingabeaufforderung'],
  lernziele: [
    'Zahlen und Zeichen mit `scanf` von der Tastatur einlesen',
    'erklären, warum vor der Variable ein `&` steht',
    'die richtigen Formatangaben für `int`, `double` und `char` beim Einlesen wählen',
  ],
  erklaerung: md`
    Bisher standen alle Werte fest im Programm. Mit **\`scanf\`** liest ein Programm Werte von der **Standardeingabe**, normalerweise der Tastatur. Damit kann man dasselbe Programm mit verschiedenen Werten benutzen, etwa einen Rechner für verschiedene Tankgrössen.

    ### So funktioniert scanf

    ~~~c
    int hoehe = 0;
    printf("Füllhöhe in cm: ");
    scanf("%d", &hoehe);
    ~~~

    - Das \`printf\` davor ist die **Eingabeaufforderung**. Ohne sie wüsste niemand, dass das Programm auf etwas wartet.
    - \`"%d"\` sagt \`scanf\`, dass es eine ganze Zahl lesen soll. Die Formatangaben ähneln denen von \`printf\`.
    - **\`&hoehe\`** ist die **Adresse** der Variable: der Ort im Speicher, an den \`scanf\` die gelesene Zahl schreiben soll.

    ### Warum das &?

    \`printf\` braucht nur die **Werte** der Variablen, um sie anzuzeigen. \`scanf\` muss dagegen **in** die Variable schreiben. Dafür braucht es ihren Platz im Speicher, ihre Adresse. Der Operator \`&\` liefert genau das. Was Adressen genau sind, lernst du im Kapitel über Pointer; vorerst gilt die Regel: **Bei \`scanf\` steht vor jeder Variable ein \`&\`**, ausser bei Zeichenketten (Kapitel 8).

    ### Formatangaben beim Einlesen

    | Typ | Formatangabe | Beispiel |
    |---|---|---|
    | \`int\` | \`%d\` | \`scanf("%d", &anzahl);\` |
    | \`double\` | **\`%lf\`** | \`scanf("%lf", &spannung);\` |
    | \`float\` | \`%f\` | \`scanf("%f", &wert);\` |
    | \`char\` | \`" %c"\` | \`scanf(" %c", &befehl);\` |

    Achtung beim Unterschied zu \`printf\`: Ein \`double\` wird mit \`%f\` **ausgegeben**, aber mit **\`%lf\`** **eingelesen**. Das Leerzeichen vor \`%c\` erklärt die nächste Lektion.

    Mehrere Werte kannst du in einem Aufruf lesen: \`scanf("%d %d", &a, &b);\`. Der Benutzer trennt sie mit Leerzeichen oder Enter.

    > [!tipp] Eingaben in Zeiger
    > Wenn dein Programm auf eine Eingabe wartet, erscheint im Terminal ein Eingabefeld. Tippe den Wert und drücke Enter. In den Übungen liefern die Tests die Eingaben automatisch. Unter «Eingabe» in der Werkbank kannst du sie auch vorab eintragen.

    > [!praxis] Eingaben bei Steuerungen
    > Auf einem Mikrocontroller kommen Eingaben meist nicht von einer Tastatur, sondern über die serielle Schnittstelle, von Tastern oder von Sensoren. Das Prinzip bleibt: Daten kommen herein, das Programm wandelt sie in Werte um und muss sie prüfen.
  `,
  syntax: [
    {
      code: c`
        scanf("%d", &ganzzahl);
        scanf("%lf", &kommazahl);
        scanf(" %c", &zeichen);
        scanf("%d %lf", &ganzzahl, &kommazahl);
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int hoehe_cm = 0;
          double durchmesser_m = 0.0;

          printf("Füllhöhe in cm: ");
          scanf("%d", &hoehe_cm);
          printf("Durchmesser in m: ");
          scanf("%lf", &durchmesser_m);

          double radius = durchmesser_m / 2;
          double volumen_m3 = 3.14159265 * radius * radius * (hoehe_cm / 100.0);
          printf("Volumen: %.1f Liter\n", volumen_m3 * 1000);
          return 0;
      }
    `,
    stdin: '120\n0.8\n',
    ausgabe: out`
      Füllhöhe in cm: 120
      Durchmesser in m: 0.8
      Volumen: 603.2 Liter
    `,
  },
  zeilen: [
    { zeilen: '4-5', text: md`Die Variablen werden vor dem Einlesen angelegt und mit 0 initialisiert.` },
    { zeilen: '7-8', text: md`Erst die Aufforderung ohne \`\n\`, damit die Eingabe auf derselben Zeile erscheint, dann \`scanf\` mit \`%d\` und \`&\`.` },
    { zeilen: '10', text: md`Für \`double\` steht beim Einlesen \`%lf\`.` },
    { zeilen: '12-13', text: md`Mit den eingelesenen Werten wird gerechnet. \`hoehe_cm / 100.0\` rechnet Zentimeter in Meter um; die \`.0\` verhindert eine Ganzzahldivision.` },
  ],
  ergebnis: md`
    Im Terminal erscheinen die Aufforderungen, dahinter deine Eingaben (hier hervorgehoben) und am Schluss das berechnete Volumen. Führe das Beispiel mit anderen Werten aus, etwa 50 cm und 1.2 m.
  `,
  fehler: [
    {
      titel: '& vergessen',
      text: md`Ohne \`&\` bekommt \`scanf\` den **Wert** der Variable statt ihrer Adresse und schreibt an eine zufällige Stelle im Speicher. Auf dem PC stürzt das Programm oft ab. Clang warnt: «format specifies type 'int *' but the argument has type 'int'».`,
      falsch: c`scanf("%d", anzahl);`,
      richtig: c`scanf("%d", &anzahl);`,
    },
    {
      titel: '%f für double',
      text: md`\`%f\` liest einen \`float\` (4 Byte). In einen \`double\` (8 Byte) geschrieben, entsteht ein falscher Wert. Für \`double\` immer \`%lf\`.`,
      falsch: c`double spannung; scanf("%f", &spannung);`,
      richtig: c`double spannung; scanf("%lf", &spannung);`,
    },
    {
      titel: 'Text im Formatstring',
      text: md`\`scanf("Zahl: %d", &x)\` erwartet, dass der Benutzer «Zahl:» mittippt. Die Aufforderung gehört in ein \`printf\` davor, nicht in \`scanf\`.`,
      falsch: c`scanf("Wert eingeben: %d", &x);`,
      richtig: c`
        printf("Wert eingeben: ");
        scanf("%d", &x);
      `,
    },
    {
      titel: '\\n am Ende des Formatstrings',
      text: md`\`scanf("%d\n", &x)\` wartet nach der Zahl so lange, bis ein Zeichen kommt, das kein Leerraum ist. Das Programm scheint zu hängen. Lass das \`\n\` weg.`,
    },
  ],
  uebungen: [
    {
      id: 'k03-l01-u1',
      typ: 'programm',
      titel: 'Zwei Zählerstände',
      stufe: 1,
      themen: ['eingabe'],
      aufgabe: md`
        Lies zwei ganze Zahlen ein: den Zählerstand am Morgen und am Abend. Gib die Differenz aus. Bei den Eingaben 1500 und 1873:

        ~~~text
        Stand morgens: 1500
        Stand abends: 1873
        Verbrauch: 373
        ~~~

        Die Aufforderungen stehen jeweils ohne Zeilenumbruch, damit die Eingabe dahinter erscheint.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int morgens = 0;
            int abends = 0;

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int morgens = 0;
            int abends = 0;

            printf("Stand morgens: ");
            scanf("%d", &morgens);
            printf("Stand abends: ");
            scanf("%d", &abends);
            printf("Verbrauch: %d\n", abends - morgens);
            return 0;
        }
      `,
      stdin: '1500\n1873\n',
      tests: [
        { name: 'Eingaben 1500 und 1873', stdin: '1500\n1873\n', erwartet: { stdout: 'Stand morgens: Stand abends: Verbrauch: 373\n' }, tipp: md`Im Test erscheinen die Eingaben nicht in der Ausgabe; darum stehen die Aufforderungen direkt hintereinander.` },
        { name: 'Eingaben 20 und 20', stdin: '20\n20\n', erwartet: { enthaelt: ['Verbrauch: 0'] } },
      ],
      hinweise: [md`Zuerst \`printf("Stand morgens: ");\`, dann \`scanf("%d", &morgens);\`.`, md`Am Schluss: \`printf("Verbrauch: %d\n", abends - morgens);\``],
    },
    {
      id: 'k03-l01-u2',
      typ: 'luecke',
      titel: 'Das Richtige einlesen',
      stufe: 1,
      themen: ['eingabe'],
      frage: 'Ergänze die Formatangaben und Operatoren so, dass das Programm eine ganze Zahl und eine Kommazahl einliest.',
      code: c`
        #include <stdio.h>

        int main(void) {
            int stueck = 0;
            double preis = 0.0;
            scanf("__1__", __2__stueck);
            scanf("__3__", __4__preis);
            printf("Total: %.2f\n", stueck * preis);
            return 0;
        }
      `,
      luecken: [['%d', '%i'], ['&'], ['%lf'], ['&']],
      stdin: '4\n2.5\n',
      ausgabe: 'Total: 10.00\n',
    },
    {
      id: 'k03-l01-u3',
      typ: 'fehlersuche',
      titel: 'Spannungsmessung',
      stufe: 2,
      themen: ['eingabe'],
      aufgabe: md`
        Das Programm liest Spannung (Volt, Kommazahl) und Strom (Ampere, Kommazahl) und soll die Leistung ausgeben. Bei den Eingaben 24 und 1.5:

        ~~~text
        Spannung: Strom: Leistung: 36.0 W
        ~~~

        Es enthält zwei Fehler beim Einlesen.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double u = 0.0;
            double i = 0.0;
            printf("Spannung: ");
            scanf("%f", &u);
            printf("Strom: ");
            scanf("%lf", i);
            printf("Leistung: %.1f W\n", u * i);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            double u = 0.0;
            double i = 0.0;
            printf("Spannung: ");
            scanf("%lf", &u);
            printf("Strom: ");
            scanf("%lf", &i);
            printf("Leistung: %.1f W\n", u * i);
            return 0;
        }
      `,
      tests: [{ name: '24 V und 1.5 A', stdin: '24\n1.5\n', erwartet: { stdout: 'Spannung: Strom: Leistung: 36.0 W\n' } }],
      hinweise: [md`Lies die beiden Warnungen des Compilers.`, md`Für \`double\` gehört \`%lf\` in den Formatstring, und vor jede Variable ein \`&\`.`],
    },
    {
      id: 'k03-l01-u4',
      typ: 'programm',
      titel: 'Drehzahl umrechnen',
      stufe: 2,
      themen: ['eingabe', 'format'],
      aufgabe: md`
        Ein Motor wird mit einem Getriebe übersetzt. Lies die Motordrehzahl (ganze Zahl, U/min) und das Übersetzungsverhältnis (Kommazahl) in **einem einzigen** \`scanf\`-Aufruf ein. Gib die Abtriebsdrehzahl mit einer Nachkommastelle aus. Bei der Eingabe \`1400 3.5\`:

        ~~~text
        Drehzahl und Übersetzung: Abtrieb: 400.0 U/min
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int drehzahl = 0;
            double uebersetzung = 0.0;
            printf("Drehzahl und Übersetzung: ");

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int drehzahl = 0;
            double uebersetzung = 0.0;
            printf("Drehzahl und Übersetzung: ");
            scanf("%d %lf", &drehzahl, &uebersetzung);
            printf("Abtrieb: %.1f U/min\n", drehzahl / uebersetzung);
            return 0;
        }
      `,
      stdin: '1400 3.5\n',
      tests: [
        { name: '1400 und 3.5', stdin: '1400 3.5\n', erwartet: { stdout: 'Drehzahl und Übersetzung: Abtrieb: 400.0 U/min\n' } },
        { name: 'Werte auf zwei Zeilen: 3000 und 2', stdin: '3000\n2\n', erwartet: { enthaelt: ['Abtrieb: 1500.0 U/min'] } },
      ],
      regeln: [{ muss: 'scanf\\s*\\([^;]*&[^;]*&', meldung: 'Lies beide Werte in einem einzigen `scanf`-Aufruf ein.' }],
      hinweise: [md`Ein Formatstring mit zwei Angaben: \`"%d %lf"\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k03-l01-c1',
      typ: 'auswahl',
      themen: ['eingabe'],
      frage: 'Welche Zeile liest eine Kommazahl korrekt in `double wert` ein?',
      optionen: [
        { text: '`scanf("%lf", &wert);`', richtig: true },
        { text: '`scanf("%f", &wert);`', warum: '`%f` ist beim Einlesen für `float`.' },
        { text: '`scanf("%lf", wert);`', warum: 'Es fehlt das `&`.' },
      ],
    },
    {
      id: 'k03-l01-c2',
      typ: 'wahrfalsch',
      themen: ['eingabe'],
      aussage: 'Bei `scanf` braucht jede Zahlenvariable ein `&` davor, weil `scanf` in die Variable schreiben muss.',
      richtig: true,
    },
    {
      id: 'k03-l01-c3',
      typ: 'eingabe',
      themen: ['eingabe'],
      frage: 'Welcher Operator liefert die Adresse einer Variable?',
      antworten: ['&'],
      exakt: true,
    },
  ],
  zusammenfassung: [
    '`scanf` liest Werte von der Tastatur in Variablen.',
    'Vor jeder Variable steht `&`: `scanf` braucht ihre Adresse, um hineinzuschreiben.',
    'Einlesen: `%d` für `int`, `%lf` für `double`, `" %c"` für `char`.',
    'Vor jedem `scanf` eine Eingabeaufforderung mit `printf`, ohne Text im Formatstring von `scanf`.',
  ],
  referenz: ['scanf'],
};
