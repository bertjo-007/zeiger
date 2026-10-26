import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k03-l04',
  titel: 'Sicher einlesen mit fgets und strtol',
  dauer: 30,
  stichwoerter: ['fgets', 'strtol', 'strtod', 'sscanf', 'Zeile einlesen', 'sicher', 'Puffer', 'gets', 'Umwandlung', 'atoi'],
  lernziele: [
    'eine ganze Zeile mit `fgets` sicher in einen Puffer einlesen',
    'Text mit `strtol` und `strtod` in Zahlen umwandeln und Fehler erkennen',
    'erklären, warum diese Kombination robuster ist als `scanf` allein',
  ],
  erklaerung: md`
    \`scanf\` ist praktisch, hat aber Schwächen: Bei einer ungültigen Eingabe bleibt der Rest im Puffer liegen und stört die nächste Eingabe, und Leerzeichen in Texten sind ein Problem. Robuste Programme gehen darum in **zwei Schritten** vor:

    1. Eine **ganze Zeile** als Text einlesen, mit \`fgets\`.
    2. Den Text **umwandeln und prüfen**, mit \`strtol\` (ganze Zahlen) oder \`strtod\` (Kommazahlen).

    Was nicht passt, bleibt nicht im Puffer liegen, weil die ganze Zeile schon gelesen ist.

    ### fgets

    ~~~c
    char zeile[64];
    fgets(zeile, sizeof zeile, stdin);
    ~~~

    \`fgets\` liest bis zum Zeilenende, **höchstens** aber \`sizeof zeile - 1\` Zeichen. Es kann also nie über das Array hinausschreiben. Das \`\n\` vom Enter steht mit im Puffer. Gibt \`fgets\` \`NULL\` zurück, war die Eingabe zu Ende.

    > [!veraltet] gets
    > Die alte Funktion \`gets\` liest eine Zeile **ohne** Längenbegrenzung und ist darum eine berüchtigte Sicherheitslücke. Sie wurde mit C11 aus der Sprache entfernt. Wer sie in alten Beispielen sieht: immer durch \`fgets\` ersetzen.

    ### strtol: Text in eine ganze Zahl

    \`strtol\` («string to long») aus \`<stdlib.h>\` wandelt Text in eine Zahl um und meldet, **bis wohin** es gekommen ist:

    ~~~c
    char *ende;
    long wert = strtol(zeile, &ende, 10);
    ~~~

    - Das dritte Argument ist die Basis: 10 für dezimal, 16 für hex.
    - \`ende\` zeigt danach auf das erste Zeichen, das **nicht** mehr zur Zahl gehörte. Was \`char *\` genau bedeutet, lernst du bei den Pointern; hier genügt das Rezept.
    - Steht \`ende\` noch am Anfang (\`ende == zeile\`), war gar keine Zahl da.
    - Folgt nach der Zahl noch etwas anderes als Leerraum (z. B. «12abc»), ist die Eingabe ebenfalls ungültig.

    \`strtod\` funktioniert gleich für Kommazahlen und liefert einen \`double\`.

    > [!veraltet] atoi
    > \`atoi("abc")\` liefert einfach 0, genau wie \`atoi("0")\`. Ein Fehler ist nicht erkennbar. Für geprüfte Eingaben \`strtol\` verwenden.

    ### Der Ablauf als Rezept

    Das Beispiel unten zeigt den ganzen Ablauf. Du darfst es als **Vorlage** verwenden, auch wenn du noch nicht jede Einzelheit verstehst. Arrays (Kapitel 8) und Pointer (Kapitel 9) erklären später den Rest.
  `,
  syntax: [
    {
      code: c`
        char zeile[64];
        if (fgets(zeile, sizeof zeile, stdin) == NULL) { /* Eingabe zu Ende */ }

        char *ende;
        long zahl = strtol(zeile, &ende, 10);       // ganze Zahl, Basis 10
        double komma = strtod(zeile, &ende);        // Kommazahl
        if (ende == zeile) { /* keine Zahl gefunden */ }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdlib.h>
      #include <ctype.h>

      int main(void) {
          char zeile[64];
          char *ende;

          printf("Encoder-Impulse pro Umdrehung: ");
          if (fgets(zeile, sizeof zeile, stdin) == NULL) {
              fprintf(stderr, "Keine Eingabe\n");
              return 1;
          }

          long impulse = strtol(zeile, &ende, 10);
          while (isspace((unsigned char)*ende)) {
              ende++;   // Leerraum nach der Zahl überspringen
          }
          if (ende == zeile || *ende != '\0') {
              fprintf(stderr, "Ungültig: %s", zeile);
              return 1;
          }

          printf("%ld Impulse, Auflösung %.2f Grad\n", impulse, 360.0 / impulse);
          return 0;
      }
    `,
    stdin: '1024\n',
    ausgabe: out`
      Encoder-Impulse pro Umdrehung: 1024
      1024 Impulse, Auflösung 0.35 Grad
    `,
  },
  zeilen: [
    { zeilen: '6-7', text: md`Ein Puffer für die ganze Zeile und ein Zeiger \`ende\`, den \`strtol\` setzt.` },
    { zeilen: '10', text: md`\`fgets\` liest höchstens 63 Zeichen plus Endzeichen. Bei \`NULL\` war die Eingabe zu Ende.` },
    { zeilen: '15', text: md`\`strtol\` wandelt den Text ab Zeilenanfang um. Danach zeigt \`ende\` hinter die Zahl.` },
    { zeilen: '16-18', text: md`Leerraum nach der Zahl, etwa das \`\n\` von Enter, wird übersprungen. Die Schleife lernst du in Kapitel 6, \`isspace\` stammt aus \`<ctype.h>\`.` },
    { zeilen: '19', text: md`Ungültig, wenn gar nichts umgewandelt wurde (\`ende == zeile\`) oder nach der Zahl noch andere Zeichen folgen (\`*ende != '\0'\`).` },
  ],
  ergebnis: md`
    Mit «1024» ist alles gültig. Probiere «1024abc», «abc» oder eine leere Zeile: In allen Fällen meldet das Programm einen Fehler, statt mit einem falschen Wert weiterzurechnen. Mit \`scanf("%d", …)\` wäre «1024abc» als 1024 durchgegangen.
  `,
  fehler: [
    {
      titel: 'Das \\n von fgets vergessen',
      text: md`\`fgets\` speichert das \`\n\` mit. Vergleicht man den Text später mit einem Wort oder gibt ihn aus, steht ein Zeilenumbruch zu viel da. \`strtol\` stört es nicht, für Texte entfernt man es (Kapitel 8).`,
    },
    {
      titel: 'Ergebnis von strtol nicht geprüft',
      text: md`\`strtol\` liefert bei «abc» einfach 0. Erst der Vergleich \`ende == zeile\` zeigt, dass nichts gelesen wurde.`,
    },
    {
      titel: 'fgets mit falscher Grösse',
      text: md`Wer \`fgets(zeile, 100, stdin)\` bei einem Array mit 64 Plätzen schreibt, verliert den Schutz. \`sizeof zeile\` passt sich automatisch an.`,
      falsch: c`
        char zeile[64];
        fgets(zeile, 100, stdin);
      `,
      richtig: c`
        char zeile[64];
        fgets(zeile, sizeof zeile, stdin);
      `,
    },
  ],
  uebungen: [
    {
      id: 'k03-l04-u1',
      typ: 'auswahl',
      titel: 'Warum fgets?',
      stufe: 1,
      themen: ['eingabe', 'strings'],
      frage: 'Was ist der wichtigste Vorteil von `fgets(zeile, sizeof zeile, stdin)` gegenüber `gets(zeile)`?',
      optionen: [
        { text: '`fgets` schreibt nie mehr Zeichen als in das Array passen.', richtig: true },
        { text: '`fgets` ist schneller.', warum: 'Geschwindigkeit ist hier kein Thema; es geht um Sicherheit.' },
        { text: '`fgets` entfernt das `\\n` automatisch.', warum: 'Im Gegenteil: `fgets` behält das `\\n`.' },
      ],
    },
    {
      id: 'k03-l04-u2',
      typ: 'luecke',
      titel: 'Rezept vervollständigen',
      stufe: 2,
      themen: ['eingabe'],
      frage: 'Ergänze das Rezept, das eine Zeile liest und als ganze Zahl umwandelt.',
      code: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            char zeile[32];
            char *ende;
            if (__1__(zeile, sizeof zeile, stdin) == NULL) {
                return 1;
            }
            long wert = __2__(zeile, &ende, 10);
            if (ende == __3__) {
                printf("keine Zahl\n");
                return 1;
            }
            printf("%ld\n", wert * 2);
            return 0;
        }
      `,
      luecken: [['fgets'], ['strtol'], ['zeile']],
      stdin: '21\n',
      ausgabe: '42\n',
    },
    {
      id: 'k03-l04-u3',
      typ: 'programm',
      titel: 'Robuste Mengeneingabe',
      stufe: 3,
      themen: ['eingabe', 'fehler'],
      aufgabe: md`
        Lies mit \`fgets\` eine Zeile und wandle sie mit \`strtol\` in eine ganze Zahl um. Gib aus:

        - \`Ungültig\` und Rückgabewert 1, wenn keine Zahl am Anfang steht;
        - sonst \`Menge: <zahl>\` und Rückgabewert 0.

        Zeichen nach der Zahl musst du in dieser Übung nicht prüfen. Gib keine Eingabeaufforderung aus.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            char zeile[32];

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            char zeile[32];
            char *ende;

            if (fgets(zeile, sizeof zeile, stdin) == NULL) {
                printf("Ungültig\n");
                return 1;
            }
            long menge = strtol(zeile, &ende, 10);
            if (ende == zeile) {
                printf("Ungültig\n");
                return 1;
            }
            printf("Menge: %ld\n", menge);
            return 0;
        }
      `,
      tests: [
        { name: 'Zahl 250', stdin: '250\n', erwartet: { stdout: 'Menge: 250\n', exitCode: 0 } },
        { name: 'Negative Zahl', stdin: '-12\n', erwartet: { stdout: 'Menge: -12\n', exitCode: 0 } },
        { name: 'Keine Zahl', stdin: 'zehn\n', erwartet: { stdout: 'Ungültig\n', exitCode: 1 } },
        { name: 'Leere Eingabe', stdin: '', erwartet: { stdout: 'Ungültig\n', exitCode: 1 }, tipp: md`Bei Ende der Eingabe gibt \`fgets\` \`NULL\` zurück.` },
      ],
      regeln: [{ muss: '\\bfgets\\s*\\(', meldung: 'Lies die Zeile mit `fgets`.' }, { muss: '\\bstrtol\\s*\\(', meldung: 'Wandle mit `strtol` um.' }, { darfNicht: '\\bscanf\\s*\\(', meldung: 'Verwende hier kein `scanf`.' }],
      hinweise: [md`Orientiere dich am Beispiel der Lektion.`, md`Gibt \`ende == zeile\` wahr, war keine Zahl am Anfang.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k03-l04-c1',
      typ: 'wahrfalsch',
      themen: ['eingabe'],
      aussage: '`gets` ist eine sichere Alternative zu `fgets`.',
      richtig: false,
      erklaerung: '`gets` prüft keine Länge und wurde deshalb mit C11 aus der Sprache entfernt.',
    },
    {
      id: 'k03-l04-c2',
      typ: 'auswahl',
      themen: ['eingabe'],
      frage: 'Woran erkennst du nach `long w = strtol(zeile, &ende, 10);`, dass keine Zahl gelesen wurde?',
      optionen: [{ text: '`ende == zeile`', richtig: true }, { text: '`w == 0`', warum: 'Die Eingabe «0» liefert auch 0 und ist gültig.' }, { text: '`ende == NULL`', warum: '`strtol` setzt `ende` nie auf `NULL`.' }],
    },
    {
      id: 'k03-l04-c3',
      typ: 'eingabe',
      themen: ['eingabe'],
      frage: 'Welche Funktion wandelt Text in eine Kommazahl (`double`) um und meldet, bis wohin sie gekommen ist?',
      antworten: ['strtod'],
    },
  ],
  zusammenfassung: [
    'Robust einlesen in zwei Schritten: Zeile mit `fgets`, dann umwandeln und prüfen.',
    '`fgets(puffer, sizeof puffer, stdin)` schreibt nie über das Array hinaus und behält das `\\n`.',
    '`strtol`/`strtod` melden mit `ende`, ob und wie viel umgewandelt wurde.',
    '`gets` ist entfernt, `atoi` erkennt keine Fehler: beide meiden.',
  ],
  referenz: ['fgets', 'strtol'],
};
