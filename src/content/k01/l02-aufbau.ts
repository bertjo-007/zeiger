import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k01-l02',
  titel: 'Aufbau eines C-Programms',
  dauer: 20,
  stichwoerter: ['main', 'Funktion', 'Block', 'Anweisung', 'Strichpunkt', 'return', 'Rückgabewert', 'EXIT_SUCCESS', 'EXIT_FAILURE', 'Einrückung', 'void'],
  lernziele: [
    'die Bestandteile eines C-Programms benennen: Präprozessor-Anweisung, Funktion `main`, Block und Anweisungen',
    'erklären, was der Rückgabewert von `main` bedeutet',
    'Code so einrücken, dass seine Struktur sichtbar wird',
  ],
  erklaerung: md`
    Ein C-Programm besteht aus **Funktionen**. Eine Funktion ist ein benannter Abschnitt Code, der eine Aufgabe erledigt. Genau eine davon ist besonders: **\`main\`**. Wenn du ein Programm startest, ruft das Betriebssystem \`main\` auf, und wenn \`main\` fertig ist, endet das Programm.

    ### Die Teile im Überblick

    | Teil | Beispiel | Bedeutung |
    |---|---|---|
    | Präprozessor-Anweisung | \`#include <stdio.h>\` | Wird vor dem Übersetzen ausgeführt. Holt hier die Beschreibung von \`printf\`. |
    | Funktionskopf | \`int main(void)\` | Rückgabetyp \`int\`, Name \`main\`, Parameterliste \`(void)\`, also keine Parameter. |
    | Block | \`{ … }\` | Fasst die Anweisungen der Funktion zusammen. |
    | Anweisung | \`printf("Hallo\n");\` | Ein einzelner Befehl. Endet immer mit \`;\`. |
    | Rückgabe | \`return 0;\` | Beendet die Funktion und gibt einen Wert zurück. |

    Die Anweisungen im Block werden **der Reihe nach von oben nach unten** ausgeführt. Später lernst du, wie Bedingungen und Schleifen diese Reihenfolge verändern.

    ### Der Rückgabewert von main

    \`main\` gibt eine ganze Zahl an das Betriebssystem zurück. Nach Konvention bedeutet **0: alles in Ordnung**, jeder andere Wert meldet einen Fehler. Skripte und Steuerprogramme werten diesen Wert aus, etwa um nach einem fehlgeschlagenen Selbsttest nicht weiterzumachen.

    Statt \`0\` und \`1\` kannst du die Namen \`EXIT_SUCCESS\` und \`EXIT_FAILURE\` aus \`<stdlib.h>\` verwenden. Sie machen klar, was gemeint ist. In Zeiger siehst du den Rückgabewert nach jedem Lauf unter der Ausgabe.

    ### Leerraum und Einrückung

    Dem Compiler sind Leerzeichen, Tabulatoren und Zeilenumbrüche zwischen den Teilen weitgehend egal. Dieses Programm wäre gültig:

    ~~~c
    #include <stdio.h>
    int main(void){printf("Hallo\n");return 0;}
    ~~~

    Lesbar ist es aber nicht. Darum gilt: **Jeder Block wird eine Stufe eingerückt**, üblich sind 4 Leerzeichen. So sieht man auf einen Blick, was wozu gehört.

    > [!achtung] main(void) statt main()
    > In C17 bedeutet \`int main()\` nicht dasselbe wie \`int main(void)\`: Leere Klammern heissen dort «unbekannte Parameter». Schreibe darum \`int main(void)\`. Erst ab C23 sind beide Schreibweisen gleichwertig.

    > [!veraltet] void main()
    > In alten Büchern und manchen Mikrocontroller-Beispielen steht \`void main()\`. Das ist kein Standard-C, und der Rückgabewert fehlt. Richtig ist \`int main(void)\`.
  `,
  syntax: [
    {
      code: c`
        #include <stdio.h>          // Präprozessor: Header einbinden

        int main(void) {            // Funktionskopf: Typ, Name, Parameter
            Anweisung1;             // Rumpf: eine Anweisung pro Zeile
            Anweisung2;
            return 0;               // Rückgabewert an das Betriebssystem
        }                           // Ende des Blocks
      `,
      text: md`\`Anweisung1\` und \`Anweisung2\` stehen hier als Platzhalter. In echten Programmen steht dort z. B. ein Aufruf von \`printf\`.`,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          printf("Förderband: Selbsttest\n");
          printf("Motor ............ ok\n");
          printf("Lichtschranke .... ok\n");
          printf("Bereit.\n");
          return 0;
      }
    `,
    ausgabe: out`
      Förderband: Selbsttest
      Motor ............ ok
      Lichtschranke .... ok
      Bereit.
    `,
  },
  zeilen: [
    { zeilen: '1', text: md`Präprozessor-Anweisung. Sie steht ausserhalb jeder Funktion, ganz oben in der Datei.` },
    { zeilen: '3', text: md`Funktionskopf von \`main\` mit öffnender Klammer des Blocks. Ab hier läuft das Programm.` },
    { zeilen: '4-7', text: md`Vier Anweisungen. Jede endet mit \`;\` und ist um 4 Leerzeichen eingerückt, weil sie zum Block von \`main\` gehört.` },
    { zeilen: '8', text: md`\`return 0;\` beendet \`main\` mit dem Wert 0: Selbsttest erfolgreich.` },
    { zeilen: '9', text: md`Die schliessende Klammer gehört zur öffnenden aus Zeile 3. Sie steht wieder ganz links.` },
  ],
  ergebnis: md`
    Die vier Zeilen erscheinen in genau der Reihenfolge, in der die \`printf\`-Anweisungen stehen. Unter der Ausgabe meldet Zeiger «Rückgabewert 0».

    Ändere im Beispiel \`return 0;\` zu \`return 1;\` und führe es erneut aus. Die Ausgabe bleibt gleich, aber Zeiger meldet jetzt einen Rückgabewert ungleich 0, also einen Fehler.
  `,
  fehler: [
    {
      titel: 'Code ausserhalb von main',
      text: md`Anweisungen wie \`printf\` dürfen nur innerhalb einer Funktion stehen. Ausserhalb meldet der Compiler einen Fehler.`,
      falsch: c`
        #include <stdio.h>
        printf("Start\n");

        int main(void) {
            return 0;
        }
      `,
      richtig: c`
        #include <stdio.h>

        int main(void) {
            printf("Start\n");
            return 0;
        }
      `,
    },
    {
      titel: 'Schliessende Klammer fehlt',
      text: md`Jede \`{\` braucht eine passende \`}\`. Fehlt sie, meldet Clang am Dateiende «expected '}'». Saubere Einrückung macht das Problem sofort sichtbar.`,
    },
    {
      titel: 'Strichpunkt nach dem Funktionskopf',
      text: md`Nach \`int main(void)\` folgt direkt der Block, kein \`;\`. Mit Strichpunkt wäre es nur eine Ankündigung der Funktion, und der Block danach stünde allein da.`,
      falsch: c`
        int main(void);
        {
            return 0;
        }
      `,
      richtig: c`
        int main(void)
        {
            return 0;
        }
      `,
    },
  ],
  uebungen: [
    {
      id: 'k01-l02-u1',
      typ: 'puzzle',
      titel: 'Programm zusammensetzen',
      stufe: 1,
      themen: ['grundlagen'],
      frage: 'Setze die Zeilen zu einem gültigen Programm zusammen, das «Pumpe läuft» ausgibt. Eine Zeile gehört nicht dazu.',
      zeilen: ['#include <stdio.h>', 'int main(void) {', '    printf("Pumpe läuft\\n");', '    return 0;', '}'],
      ablenker: ['void main() {'],
      ausgabe: 'Pumpe läuft\n',
    },
    {
      id: 'k01-l02-u2',
      typ: 'programm',
      titel: 'Fehlercode melden',
      stufe: 1,
      themen: ['grundlagen'],
      aufgabe: md`
        Ein Selbsttest hat einen Fehler gefunden. Schreibe ein Programm, das

        - die Zeile \`Fehler: Sensor fehlt\` ausgibt und
        - dem Betriebssystem den Rückgabewert **1** meldet.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            printf("Fehler: Sensor fehlt\n");
            return 1;
        }
      `,
      tests: [{ name: 'Meldung und Rückgabewert 1', erwartet: { stdout: 'Fehler: Sensor fehlt\n', exitCode: 1 }, tipp: md`Der Rückgabewert steht hinter \`return\`.` }],
      hinweise: [md`Du brauchst ein \`printf\` für die Meldung.`, md`Ändere \`return 0;\` zu \`return 1;\`.`],
    },
    {
      id: 'k01-l02-u3',
      typ: 'luecke',
      titel: 'Gerüst ergänzen',
      stufe: 1,
      themen: ['grundlagen'],
      frage: 'Ergänze die fehlenden Wörter, sodass ein vollständiges Programm entsteht.',
      code: c`
        #include <stdio.h>

        __1__ __2__(void) {
            printf("Bereit\n");
            __3__ 0;
        }
      `,
      luecken: [['int'], ['main'], ['return']],
      ausgabe: 'Bereit\n',
    },
    {
      id: 'k01-l02-u4',
      typ: 'fehlersuche',
      titel: 'Durcheinander geraten',
      stufe: 2,
      themen: ['grundlagen'],
      aufgabe: md`
        Beim Kopieren ist dieses Programm durcheinandergeraten. Es soll

        ~~~text
        Tank 1: voll
        Tank 2: leer
        ~~~

        ausgeben. Repariere es so, dass es kompiliert und genau diese Ausgabe erzeugt. Rücke den Code dabei sauber ein.
      `,
      start: c`
        #include <stdio.h>
        printf("Tank 1: voll\n");
        int main(void) {
        printf("Tank 2: leer\n");
        return 0;
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            printf("Tank 1: voll\n");
            printf("Tank 2: leer\n");
            return 0;
        }
      `,
      tests: [{ name: 'Gibt beide Tanks in der richtigen Reihenfolge aus', erwartet: { stdout: 'Tank 1: voll\nTank 2: leer\n' } }],
      hinweise: [md`Eine Anweisung steht ausserhalb von \`main\`. Wohin gehört sie?`, md`Am Ende fehlt die schliessende Klammer \`}\` des Blocks.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k01-l02-c1',
      typ: 'auswahl',
      themen: ['grundlagen'],
      frage: 'Was bedeutet `void` in `int main(void)`?',
      optionen: [
        { text: '`main` nimmt keine Parameter entgegen.', richtig: true },
        { text: '`main` gibt keinen Wert zurück.', warum: 'Der Rückgabetyp steht vorne: `int`. `main` gibt also eine ganze Zahl zurück.' },
        { text: 'Das Programm ist leer.', warum: '`void` sagt nur etwas über die Parameter aus.' },
      ],
    },
    {
      id: 'k01-l02-c2',
      typ: 'wahrfalsch',
      themen: ['grundlagen'],
      aussage: 'Die Einrückung mit Leerzeichen bestimmt in C, welche Anweisungen zu einem Block gehören.',
      richtig: false,
      erklaerung: 'In C bestimmen allein die geschweiften Klammern die Blöcke. Die Einrückung ist für Menschen da, und genau deshalb ist sie so wichtig: Sie soll zeigen, was die Klammern tun.',
    },
    {
      id: 'k01-l02-c3',
      typ: 'eingabe',
      themen: ['grundlagen'],
      frage: 'Welchen Wert gibt `main` nach Konvention zurück, wenn alles in Ordnung ist?',
      antworten: ['0', 'EXIT_SUCCESS'],
      erklaerung: '0 (oder gleichbedeutend `EXIT_SUCCESS` aus `<stdlib.h>`) bedeutet Erfolg, jeder andere Wert einen Fehler.',
    },
  ],
  zusammenfassung: [
    'Ein C-Programm besteht aus Funktionen; die Ausführung beginnt in `main`.',
    'Der Block `{ … }` enthält Anweisungen, die von oben nach unten ausgeführt werden. Jede endet mit `;`.',
    '`return 0;` meldet Erfolg, jeder andere Wert einen Fehler. Lesbarer: `EXIT_SUCCESS` und `EXIT_FAILURE`.',
    'Einrückung ist für Menschen: eine Stufe (4 Leerzeichen) pro Block.',
    'Schreibe `int main(void)`, nicht `void main()` und in C17 auch nicht `int main()`.',
  ],
  referenz: ['main', 'return', 'exit-success'],
};
