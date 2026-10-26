import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k01-l03',
  titel: 'Ausgabe mit printf',
  dauer: 25,
  stichwoerter: ['printf', 'puts', 'putchar', 'Escape-Sequenz', 'Zeilenumbruch', 'Tabulator', 'Backslash', 'Anführungszeichen', 'Prozentzeichen', '\\n', '\\t', '%%'],
  lernziele: [
    'Text mit `printf`, `puts` und `putchar` ausgeben',
    'Sonderzeichen mit Escape-Sequenzen wie `\\n`, `\\t`, `\\"` und `\\\\` schreiben',
    'ein Prozentzeichen mit `%%` ausgeben',
  ],
  erklaerung: md`
    \`printf\` steht für «print formatted», also «formatiert ausgeben». Es schreibt Text auf die **Standardausgabe**, normalerweise das Terminal. Der Text steht in doppelten Anführungszeichen und heisst **Zeichenkette** oder **String**.

    ### Escape-Sequenzen

    Manche Zeichen kann man nicht direkt in einen String tippen: einen Zeilenumbruch etwa, oder das Anführungszeichen selbst, das ja den String beendet. Dafür gibt es **Escape-Sequenzen**. Sie beginnen mit einem Backslash (dem umgekehrten Schrägstrich) und stehen für genau ein Zeichen:

    | Sequenz | Bedeutung |
    |---|---|
    | \`\n\` | Zeilenumbruch (neue Zeile) |
    | \`\t\` | Tabulator (springt zur nächsten Tab-Position) |
    | \`\"\` | Anführungszeichen im Text |
    | \`\\\` | ein Backslash, z. B. in Windows-Pfaden |
    | \`\'\` | Apostroph (in einzelnen Zeichen nötig, siehe Kapitel 2) |

    \`printf\` beginnt **keine neue Zeile von selbst**. Fehlt das \`\n\`, schreibt die nächste Ausgabe auf derselben Zeile weiter.

    ### Das Prozentzeichen

    Für \`printf\` hat \`%\` eine besondere Bedeutung: Es leitet einen **Platzhalter** ein, etwa \`%d\` für eine ganze Zahl. Wie Platzhalter genau funktionieren, lernst du in Kapitel 2. Willst du ein echtes Prozentzeichen ausgeben, schreibst du **\`%%\`**.

    ~~~c
    printf("Akku: %d %%\n", 80);   // Ausgabe: Akku: 80 %
    ~~~

    ### puts und putchar

    - \`puts("Text")\` gibt einen String aus und hängt **automatisch** einen Zeilenumbruch an. Es kennt keine Platzhalter. Für reinen Text ist es die einfachste Wahl.
    - \`putchar('A')\` gibt genau **ein Zeichen** aus. Einzelne Zeichen stehen in einfachen Anführungszeichen.

    > [!tipp] Ausgabe planen
    > Schreib dir die gewünschte Ausgabe zuerst auf, Zeile für Zeile. Dann siehst du sofort, wo ein \`\n\` hingehört.

    > [!praxis] Ausgabe auf dem Mikrocontroller
    > Ein Mikrocontroller hat kein Terminal. Dort leitet man die Ausgabe von \`printf\` meist auf eine serielle Schnittstelle (UART) um und liest sie am PC mit einem Terminalprogramm, beim Arduino mit dem seriellen Monitor. Die Escape-Sequenzen funktionieren genauso.
  `,
  syntax: [
    {
      code: c`
        printf("Text\n");          // Text ausgeben, \n = neue Zeile
        printf("Wert: %d\n", 42);  // mit Platzhalter (Kapitel 2)
        puts("Text");              // Text plus automatischer Zeilenumbruch
        putchar('X');              // ein einzelnes Zeichen
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          printf("Sensor\tWert\tEinheit\n");
          printf("T1\t21\tGrad C\n");
          printf("P1\t3\tbar\n");
          printf("Auslastung: 80 %%\n");
          printf("Datei: \"log.csv\" in C:\\Daten\n");
          puts("Ende der Liste");
          putchar('#');
          putchar('\n');
          return 0;
      }
    `,
    ausgabe: 'Sensor\tWert\tEinheit\nT1\t21\tGrad C\nP1\t3\tbar\nAuslastung: 80 %\nDatei: "log.csv" in C:\\Daten\nEnde der Liste\n#\n',
  },
  zeilen: [
    { zeilen: '4-6', text: md`\`\t\` springt zur nächsten Tabulator-Position. So entstehen einfache Spalten. Bei unterschiedlich langen Einträgen verrutschen sie allerdings; besser geht es mit Feldbreiten (Kapitel 2).` },
    { zeilen: '7', text: md`\`%%\` wird als ein einzelnes \`%\` ausgegeben.` },
    { zeilen: '8', text: md`\`\"\` setzt Anführungszeichen in den Text, \`\\\` einen Backslash. Im Code stehen zwei Backslashes, in der Ausgabe nur einer.` },
    { zeilen: '9', text: md`\`puts\` gibt den Text aus und beginnt danach selbst eine neue Zeile.` },
    { zeilen: '10-11', text: md`\`putchar\` gibt einzelne Zeichen aus: zuerst \`#\`, dann einen Zeilenumbruch. Einzelne Zeichen stehen in einfachen Anführungszeichen.` },
  ],
  ergebnis: md`
    Die drei ersten Zeilen bilden eine kleine Tabelle; die Tabulatoren richten die Spalten aus. In der Pfadzeile erscheinen die Anführungszeichen und **ein** Backslash. Nach «Ende der Liste» folgt dank \`puts\` automatisch eine neue Zeile.
  `,
  fehler: [
    {
      titel: 'Schrägstrich statt Backslash',
      text: md`Der Zeilenumbruch heisst \`\n\` mit Backslash. \`/n\` sind einfach zwei Zeichen und werden genau so ausgegeben.`,
      falsch: c`printf("Hallo/n");`,
      richtig: c`printf("Hallo\n");`,
    },
    {
      titel: 'Anführungszeichen im Text nicht maskiert',
      text: md`Ein \`"\` mitten im Text beendet den String vorzeitig. Der Compiler meldet dann einen Fehler beim Rest. Schreibe \`\"\`.`,
      falsch: c`printf("Status: "OK"\n");`,
      richtig: c`printf("Status: \"OK\"\n");`,
    },
    {
      titel: 'Einzelnes Prozentzeichen',
      text: md`\`printf\` hält ein einzelnes \`%\` für den Anfang eines Platzhalters. Clang warnt dann, und die Ausgabe ist unvorhersehbar. Schreibe \`%%\`.`,
      falsch: c`printf("Fortschritt: 50 %\n");`,
      richtig: c`printf("Fortschritt: 50 %%\n");`,
    },
    {
      titel: 'Doppelter Zeilenumbruch mit puts',
      text: md`\`puts\` hängt bereits einen Zeilenumbruch an. Ein zusätzliches \`\n\` erzeugt eine Leerzeile.`,
      falsch: c`puts("Fertig\n");`,
      richtig: c`puts("Fertig");`,
    },
  ],
  uebungen: [
    {
      id: 'k01-l03-u1',
      typ: 'vorhersage',
      titel: 'Escape-Sequenzen lesen',
      stufe: 1,
      themen: ['ausgabe'],
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("Er sagte: \"Start\"\n");
            printf("100 %% geladen");
            puts("!");
            printf("Ordner: C:\\Werk\n");
            return 0;
        }
      `,
      ausgabe: out`
        Er sagte: "Start"
        100 % geladen!
        Ordner: C:\Werk
      `,
      erklaerung: md`\`\"\` wird zu \`"\`, \`%%\` zu \`%\`, und aus zwei Backslashes im Code wird einer in der Ausgabe. Weil nach «geladen» kein \`\n\` steht, hängt \`puts\` das Ausrufezeichen direkt an und beginnt danach eine neue Zeile.`,
    },
    {
      id: 'k01-l03-u2',
      typ: 'programm',
      titel: 'Exportbericht',
      stufe: 2,
      themen: ['ausgabe'],
      aufgabe: md`
        Gib genau diesen Text aus:

        ~~~text
        Datei: "messung.csv"
        Ordner: C:\Messungen\Linie3
        Fortschritt: 75 %
        ~~~
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
            printf("Datei: \"messung.csv\"\n");
            printf("Ordner: C:\\Messungen\\Linie3\n");
            printf("Fortschritt: 75 %%\n");
            return 0;
        }
      `,
      tests: [
        {
          name: 'Ausgabe stimmt genau',
          erwartet: { stdout: 'Datei: "messung.csv"\nOrdner: C:\\Messungen\\Linie3\nFortschritt: 75 %\n' },
          tipp: md`Für \`"\` im Text schreibst du \`\"\`, für einen Backslash \`\\\`, für ein Prozentzeichen \`%%\`.`,
        },
      ],
      hinweise: [md`Drei Zeilen, also drei \`printf\` mit je einem \`\n\` am Ende.`, md`Die Pfadzeile lautet im Code: \`printf("Ordner: C:\\Messungen\\Linie3\n");\``],
    },
    {
      id: 'k01-l03-u3',
      typ: 'zuordnen',
      titel: 'Sequenzen und ihre Wirkung',
      stufe: 1,
      themen: ['ausgabe'],
      frage: 'Was erzeugt welche Schreibweise in einem printf-Text?',
      paare: [
        { links: '`\\n`', rechts: 'neue Zeile' },
        { links: '`\\t`', rechts: 'Tabulator' },
        { links: '`\\"`', rechts: 'Anführungszeichen' },
        { links: '`\\\\`', rechts: 'ein Backslash' },
        { links: '`%%`', rechts: 'Prozentzeichen' },
      ],
    },
    {
      id: 'k01-l03-u4',
      typ: 'programm',
      titel: 'Ein einziges printf',
      stufe: 3,
      themen: ['ausgabe'],
      aufgabe: md`
        Gib diese Anzeige einer Ampelsteuerung aus. Die Schwierigkeit: Du darfst dafür **genau einen** Aufruf von \`printf\` verwenden und weder \`puts\` noch \`putchar\`.

        ~~~text
        +-------+
        | ROT   |
        | GRÜN  |
        +-------+
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            printf("");
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            printf("+-------+\n| ROT   |\n| GRÜN  |\n+-------+\n");
            return 0;
        }
      `,
      tests: [{ name: 'Anzeige stimmt', erwartet: { stdout: '+-------+\n| ROT   |\n| GRÜN  |\n+-------+\n' }, tipp: md`Ein String darf mehrere \`\n\` enthalten.` }],
      regeln: [
        { darfNicht: 'printf[\\s\\S]*printf', meldung: 'Verwende genau einen Aufruf von `printf`.' },
        { darfNicht: '\\b(puts|putchar)\\b', meldung: '`puts` und `putchar` sind in dieser Übung nicht erlaubt.' },
      ],
      hinweise: [md`Ein einziger String kann alle vier Zeilen enthalten: Setze an jedes Zeilenende ein \`\n\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k01-l03-c1',
      typ: 'wahrfalsch',
      themen: ['ausgabe'],
      aussage: '`puts("Fertig");` gibt «Fertig» aus und beginnt danach automatisch eine neue Zeile.',
      richtig: true,
    },
    {
      id: 'k01-l03-c2',
      typ: 'eingabe',
      themen: ['ausgabe'],
      frage: 'Wie schreibst du in einem `printf`-Text ein Prozentzeichen?',
      antworten: ['%%'],
      exakt: true,
    },
    {
      id: 'k01-l03-c3',
      typ: 'auswahl',
      themen: ['ausgabe'],
      frage: 'Welche Zeile gibt `Pfad: C:\\Temp` aus?',
      optionen: [
        { text: '`printf("Pfad: C:\\\\Temp\\n");`', richtig: true },
        { text: '`printf("Pfad: C:\\Temp\\n");`', warum: '`\\T` ist keine gültige Escape-Sequenz. Für einen Backslash braucht es zwei.' },
        { text: '`printf("Pfad: C:/Temp\\n");`', warum: 'Das gibt einen Schrägstrich aus, keinen Backslash.' },
      ],
    },
  ],
  zusammenfassung: [
    '`printf` gibt Text aus, beginnt aber keine neue Zeile von selbst: dafür steht `\\n`.',
    'Escape-Sequenzen beginnen mit `\\`: `\\n`, `\\t`, `\\"`, `\\\\`.',
    'Ein Prozentzeichen schreibst du in `printf` als `%%`.',
    '`puts` gibt Text plus Zeilenumbruch aus, `putchar` ein einzelnes Zeichen.',
  ],
  referenz: ['printf', 'puts', 'putchar', 'esc-n', 'esc-t', 'esc-quote', 'esc-backslash', 'fmt-prozent'],
};
