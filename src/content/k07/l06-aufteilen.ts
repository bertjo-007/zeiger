import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k07-l06',
  titel: 'Programme aufteilen und main mit Argumenten',
  dauer: 30,
  stichwoerter: ['aufteilen', 'Struktur', 'Top-down', 'argc', 'argv', 'Kommandozeile', 'Programmargumente', 'main', 'Wiederverwendung'],
  lernziele: [
    'ein Programm in sinnvolle Funktionen aufteilen',
    'Programmargumente mit `argc` und `argv` auswerten',
    'ein Programm von oben nach unten (top-down) entwerfen',
  ],
  erklaerung: md`
    ### Von oben nach unten entwerfen

    Ein grösseres Programm beginnt man nicht mit der ersten Codezeile, sondern mit einer Gliederung: Was sind die grossen Schritte? Jeder Schritt wird eine Funktion, deren Inhalt man später ausarbeitet:

    1. Messwerte einlesen
    2. Kennzahlen berechnen
    3. Bericht ausgeben

    \`main\` ruft nur noch diese Funktionen auf und liest sich wie die Gliederung. Jede Funktion lässt sich für sich testen. Dieses Vorgehen heisst **top-down**.

    ### Woran man eine gute Aufteilung erkennt

    - Jede Funktion hat **eine** klar benennbare Aufgabe.
    - Funktionen bekommen, was sie brauchen, über **Parameter**, und liefern Ergebnisse über **\`return\`**.
    - Rechnen und Ein-/Ausgabe sind getrennt: Eine Funktion, die rechnet, gibt nichts aus.
    - Keine Funktion ist so lang, dass man scrollen muss, um sie zu verstehen.

    ### main mit Argumenten

    Auch \`main\` kann Parameter haben. Startet man ein Programm in der Kommandozeile mit zusätzlichen Wörtern, etwa \`programm sensor.csv 25\`, kommen sie hier an:

    ~~~c
    int main(int argc, char *argv[]) { … }
    ~~~

    - \`argc\` (argument count) ist die **Anzahl** der Wörter, **inklusive** des Programmnamens.
    - \`argv\` (argument vector) enthält die Wörter als Texte: \`argv[0]\` ist der Programmname, \`argv[1]\` das erste Argument und so weiter.

    Argumente sind immer **Text**. Eine Zahl wandelst du mit \`strtol\` um (Kapitel 3). Prüfe vorher mit \`argc\`, ob genug Argumente da sind, und gib sonst eine Gebrauchsanweisung aus.

    > [!tipp] Argumente in Zeiger
    > Unter «Eingabe» in der Werkbank gibt es ein Feld «Programm-Argumente». Was du dort einträgst, kommt in \`argv\` an.
  `,
  syntax: [
    {
      code: c`
        int main(int argc, char *argv[]) {
            // argc: Anzahl, argv[0]: Programmname, argv[1]: erstes Argument
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdlib.h>

      double umrechnen(double celsius) {
          return celsius * 9.0 / 5.0 + 32.0;
      }

      void zeige_tabelle(int von, int bis, int schritt) {
          for (int c = von; c <= bis; c += schritt) {
              printf("%4d C = %6.1f F\n", c, umrechnen(c));
          }
      }

      int main(int argc, char *argv[]) {
          if (argc != 3) {
              printf("Aufruf: %s VON BIS\n", argv[0]);
              return 1;
          }
          int von = (int)strtol(argv[1], NULL, 10);
          int bis = (int)strtol(argv[2], NULL, 10);
          zeige_tabelle(von, bis, 10);
          return 0;
      }
    `,
    args: ['-10', '30'],
    // Führende Leerzeichen gehören zur Ausgabe, darum kein out-Template.
    ausgabe: ' -10 C =   14.0 F\n   0 C =   32.0 F\n  10 C =   50.0 F\n  20 C =   68.0 F\n  30 C =   86.0 F\n',
  },
  zeilen: [
    { zeilen: '4-6', text: md`Reine Rechenfunktion: bekommt einen Wert, gibt einen zurück.` },
    { zeilen: '8-12', text: md`Ausgabefunktion, die die Rechenfunktion verwendet.` },
    { zeilen: '14', text: md`\`main\` mit Argumenten.` },
    { zeilen: '15-18', text: md`Ohne genau zwei Argumente: Gebrauchsanweisung und Fehlercode. \`argv[0]\` ist der Programmname.` },
    { zeilen: '19-20', text: md`Die Argumente sind Texte und werden mit \`strtol\` in Zahlen umgewandelt.` },
  ],
  ergebnis: md`
    Mit den Argumenten \`-10 30\` entsteht eine Tabelle in 10er-Schritten. Ändere unter «Eingabe» die Argumente, etwa auf \`0 100\`, oder lösche sie: Dann erscheint die Gebrauchsanweisung.
  `,
  fehler: [
    {
      titel: 'argv ohne Prüfung von argc',
      text: md`Fehlt ein Argument, greift \`argv[1]\` auf etwas zu, das es nicht gibt. Immer zuerst \`argc\` prüfen.`,
    },
    {
      titel: 'argv[1] als Zahl verwendet',
      text: md`\`argv[1]\` ist Text. \`int n = argv[1];\` ist falsch; Clang meldet «incompatible pointer to integer conversion». Umwandeln mit \`strtol\`.`,
    },
    {
      titel: 'Riesen-main',
      text: md`Alles in \`main\` zu schreiben funktioniert, wird aber ab etwa 40 Zeilen unübersichtlich. Teile früh auf.`,
    },
  ],
  uebungen: [
    {
      id: 'k07-l06-u1',
      typ: 'vorhersage',
      titel: 'Argumente zählen',
      stufe: 1,
      themen: ['funktionen'],
      frage: 'Das Programm wird **ohne** zusätzliche Argumente gestartet. Was gibt es aus?',
      code: c`
        #include <stdio.h>

        int main(int argc, char *argv[]) {
            printf("%d %s\n", argc, argv[argc - 1]);
            return 0;
        }
      `,
      ausgabe: out`
        1 programm
      `,
      erklaerung: md`Ohne Argumente ist \`argc\` 1, und \`argv[argc - 1]\` ist \`argv[0]\`, der Programmname. Mit \`programm links 40 schnell\` wäre die Ausgabe \`4 schnell\`.`,
    },
    {
      id: 'k07-l06-u2',
      typ: 'programm',
      titel: 'Argumente summieren',
      stufe: 2,
      themen: ['funktionen', 'schleifen'],
      aufgabe: md`
        Das Programm bekommt beliebig viele ganze Zahlen als Argumente und gibt ihre Summe aus: \`Summe: <s>\`. Ohne Argumente: \`Keine Werte\` und Rückgabewert 1.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(int argc, char *argv[]) {

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(int argc, char *argv[]) {
            if (argc < 2) {
                printf("Keine Werte\n");
                return 1;
            }
            long summe = 0;
            for (int i = 1; i < argc; i++) {
                summe += strtol(argv[i], NULL, 10);
            }
            printf("Summe: %ld\n", summe);
            return 0;
        }
      `,
      tests: [
        { name: 'Argumente 4 8 15', args: ['4', '8', '15'], erwartet: { stdout: 'Summe: 27\n' } },
        { name: 'Ein Argument', args: ['-7'], erwartet: { stdout: 'Summe: -7\n' } },
        { name: 'Ohne Argumente', erwartet: { stdout: 'Keine Werte\n', exitCode: 1 } },
      ],
      hinweise: [md`Die Schleife beginnt bei \`i = 1\`, weil \`argv[0]\` der Programmname ist.`],
    },
    {
      id: 'k07-l06-u3',
      typ: 'programm',
      titel: 'Ladezeit-Rechner aufteilen',
      stufe: 3,
      themen: ['funktionen'],
      aufgabe: md`
        Ein Akku wird geladen. Schreibe drei Funktionen und rufe sie aus \`main\` auf:

        - \`double ladezeit_h(double kapazitaet_ah, double strom_a)\`: Kapazität / Strom · 1.2 (Ladeverluste);
        - \`int stunden(double zeit_h)\`: ganze Stunden;
        - \`int minuten(double zeit_h)\`: verbleibende Minuten (gerundet mit \`round\` aus \`<math.h>\`).

        \`main\` liest Kapazität und Strom (Kommazahlen) und gibt aus: \`Ladezeit: 3 h 36 min\` (bei \`6 2\`).
      `,
      start: c`
        #include <stdio.h>
        #include <math.h>

        int main(void) {
            double kap = 0.0, strom = 0.0;
            scanf("%lf %lf", &kap, &strom);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <math.h>

        double ladezeit_h(double kapazitaet_ah, double strom_a) {
            return kapazitaet_ah / strom_a * 1.2;
        }

        int stunden(double zeit_h) {
            return (int)zeit_h;
        }

        int minuten(double zeit_h) {
            return (int)round((zeit_h - (int)zeit_h) * 60);
        }

        int main(void) {
            double kap = 0.0, strom = 0.0;
            scanf("%lf %lf", &kap, &strom);

            double t = ladezeit_h(kap, strom);
            printf("Ladezeit: %d h %d min\n", stunden(t), minuten(t));
            return 0;
        }
      `,
      tests: [
        { name: '6 Ah mit 2 A', stdin: '6 2\n', erwartet: { stdout: 'Ladezeit: 3 h 36 min\n' } },
        { name: '2.5 Ah mit 5 A', stdin: '2.5 5\n', erwartet: { stdout: 'Ladezeit: 0 h 36 min\n' } },
      ],
      regeln: [
        { muss: 'double\\s+ladezeit_h\\s*\\(', meldung: 'Schreibe die Funktion `ladezeit_h`.' },
        { muss: 'int\\s+stunden\\s*\\(', meldung: 'Schreibe die Funktion `stunden`.' },
        { muss: 'int\\s+minuten\\s*\\(', meldung: 'Schreibe die Funktion `minuten`.' },
      ],
      hinweise: [md`6 / 2 · 1.2 = 3.6 h: 3 Stunden und 0.6 · 60 = 36 Minuten.`, md`Der Nachkommaanteil ist \`zeit_h - (int)zeit_h\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k07-l06-c1',
      typ: 'eingabe',
      themen: ['funktionen'],
      frage: 'Ein Programm wird als `programm a b` gestartet. Welchen Wert hat `argc`?',
      antworten: ['3'],
    },
    {
      id: 'k07-l06-c2',
      typ: 'auswahl',
      themen: ['funktionen'],
      frage: 'Was steht in `argv[0]`?',
      optionen: [{ text: 'Der Name des Programms', richtig: true }, { text: 'Das erste Argument' }, { text: 'Die Anzahl der Argumente' }],
    },
    {
      id: 'k07-l06-c3',
      typ: 'wahrfalsch',
      themen: ['funktionen', 'stil'],
      aussage: 'Eine Funktion, die rechnet, sollte ihr Ergebnis zurückgeben statt es selbst auszugeben.',
      richtig: true,
    },
  ],
  zusammenfassung: [
    'Top-down: erst die grossen Schritte als Funktionen, dann ihren Inhalt.',
    'Gute Funktionen haben eine Aufgabe, Parameter rein, Ergebnis per `return` raus.',
    '`int main(int argc, char *argv[])`: `argc` zählt die Wörter inklusive Programmname, `argv[i]` sind Texte.',
    'Vor dem Zugriff auf `argv` immer `argc` prüfen; Zahlen mit `strtol` umwandeln.',
  ],
  referenz: ['main', 'funktion'],
};
