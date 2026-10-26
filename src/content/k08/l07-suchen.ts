import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k08-l07',
  titel: 'Zeichenketten durchsuchen, zerlegen und umwandeln',
  dauer: 30,
  stichwoerter: ['strchr', 'strstr', 'strtok', 'strcspn', 'ctype.h', 'toupper', 'tolower', 'isdigit', 'isalpha', 'isspace', 'zerlegen', 'CSV', 'sscanf', 'Zeilenumbruch entfernen'],
  lernziele: [
    'Zeichen und Teiltexte mit `strchr` und `strstr` suchen',
    'eine Zeile mit `strtok` oder `sscanf` in Felder zerlegen',
    'einzelne Zeichen mit den Funktionen aus `<ctype.h>` prüfen und umwandeln',
  ],
  erklaerung: md`
    ### Suchen

    | Funktion | sucht | Ergebnis |
    |---|---|---|
    | \`strchr(s, 'x')\` | das erste Zeichen \`'x'\` | Zeiger auf die Fundstelle oder \`NULL\` |
    | \`strrchr(s, 'x')\` | das letzte Zeichen \`'x'\` | ebenso |
    | \`strstr(s, "teil")\` | den Teiltext | ebenso |
    | \`strcspn(s, "abc")\` | Länge bis zum ersten der Zeichen | eine Zahl |

    Das Ergebnis ist ein **Zeiger** (Kapitel 9). Für den Moment genügt: \`NULL\` heisst «nicht gefunden»; sonst lässt sich der Index als \`fundstelle - s\` berechnen.

    Ein häufiger Einsatz von \`strcspn\`: das \`\n\` entfernen, das \`fgets\` mitliest:

    ~~~c
    zeile[strcspn(zeile, "\n")] = '\0';
    ~~~

    ### Zerlegen

    Daten kommen oft als eine Zeile mit Trennzeichen, etwa aus einer CSV-Datei: \`T3;21.5;ok\`.

    - **\`sscanf\`** liest wie \`scanf\`, aber aus einem Text: \`sscanf(zeile, "%d;%lf", &nr, &wert)\`. Es gibt die Anzahl gelesener Werte zurück.
    - **\`strtok(zeile, ";")\`** liefert das erste Feld, jeder weitere Aufruf mit \`NULL\` das nächste, bis \`NULL\` kommt. Achtung: \`strtok\` **verändert** den Text (es ersetzt die Trennzeichen durch \`'\0'\`) und funktioniert darum nur mit veränderbaren Arrays.

    ### Einzelne Zeichen: ctype.h

    | Funktion | prüft bzw. macht |
    |---|---|
    | \`isdigit(c)\` | Ziffer 0 bis 9 |
    | \`isalpha(c)\` | Buchstabe (nur ASCII) |
    | \`isspace(c)\` | Leerraum |
    | \`isupper(c)\`, \`islower(c)\` | Gross-, Kleinbuchstabe |
    | \`toupper(c)\`, \`tolower(c)\` | umwandeln |

    Übergib diesen Funktionen ein Zeichen am besten als \`(unsigned char)c\`: Bei Umlauten in UTF-8 wäre der Wert sonst negativ, und das ist für sie nicht erlaubt.
  `,
  syntax: [
    {
      code: c`
        char *p = strchr(text, ';');          // NULL oder Fundstelle
        char *teil = strtok(zeile, ";");      // erstes Feld
        teil = strtok(NULL, ";");             // nächstes Feld
        int n = sscanf(zeile, "%d;%lf", &a, &b);
        char gross = (char)toupper((unsigned char)c);
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <string.h>
      #include <ctype.h>

      int main(void) {
          char zeile[64] = "T3;21.5;ok\n";      // wie von fgets gelesen
          zeile[strcspn(zeile, "\n")] = '\0';   // Zeilenumbruch entfernen

          if (strstr(zeile, "ok") != NULL) {
              printf("Status enthält ok\n");
          }

          char *trenner = strchr(zeile, ';');
          printf("Erstes ; an Index %d\n", (int)(trenner - zeile));

          char kopie[64];
          snprintf(kopie, sizeof kopie, "%s", zeile);
          int feld = 1;
          for (char *teil = strtok(kopie, ";"); teil != NULL; teil = strtok(NULL, ";")) {
              printf("Feld %d: %s\n", feld, teil);
              feld++;
          }

          char sensor[8];
          double wert = 0.0;
          if (sscanf(zeile, "%7[^;];%lf", sensor, &wert) == 2) {
              printf("%s misst %.1f\n", sensor, wert);
          }

          int ziffern = 0;
          for (int i = 0; zeile[i] != '\0'; i++) {
              if (isdigit((unsigned char)zeile[i])) {
                  ziffern++;
              }
          }
          printf("%d Ziffern\n", ziffern);
          return 0;
      }
    `,
    ausgabe: out`
      Status enthält ok
      Erstes ; an Index 2
      Feld 1: T3
      Feld 2: 21.5
      Feld 3: ok
      T3 misst 21.5
      4 Ziffern
    `,
  },
  zeilen: [
    { zeilen: '7', text: md`\`strcspn\` findet die Position des \`\n\`; dort wird der Text beendet.` },
    { zeilen: '9', text: md`\`strstr\` liefert \`NULL\`, wenn der Teiltext fehlt.` },
    { zeilen: '13-14', text: md`Die Differenz zweier Zeiger ergibt den Index der Fundstelle.` },
    { zeilen: '16-21', text: md`\`strtok\` zerlegt eine Kopie, weil es den Text verändert.` },
    { zeilen: '25', text: md`\`%7[^;]\` liest bis zu 7 Zeichen, die kein \`;\` sind. So liest \`sscanf\` Text bis zu einem Trennzeichen.` },
  ],
  ergebnis: md`
    Dieselbe Zeile wird auf vier Arten untersucht: Teiltext suchen, Position bestimmen, in Felder zerlegen und gezielt Werte lesen.
  `,
  fehler: [
    {
      titel: 'NULL nicht geprüft',
      text: md`Findet \`strchr\` nichts, liefert es \`NULL\`. Wer damit weiterrechnet oder darauf zugreift, bringt das Programm zum Absturz.`,
    },
    {
      titel: 'strtok auf einem Stringliteral',
      text: md`\`strtok("a;b", ";")\` versucht, einen unveränderlichen Text zu ändern: Absturz. Immer auf einem eigenen Array arbeiten.`,
    },
    {
      titel: '\\n von fgets vergessen',
      text: md`Ohne \`strcspn\`-Trick enthält das letzte Feld ein \`\n\`, und \`strcmp(feld, "ok")\` ist nicht 0.`,
    },
  ],
  uebungen: [
    {
      id: 'k08-l07-u1',
      typ: 'zuordnen',
      titel: 'Welche Funktion?',
      stufe: 1,
      themen: ['strings'],
      frage: 'Welche Funktion passt zur Aufgabe?',
      paare: [
        { links: 'Ist «Fehler» im Text enthalten?', rechts: '`strstr`' },
        { links: 'Wo steht das erste `;`?', rechts: '`strchr`' },
        { links: 'Text an `;` in Felder zerlegen', rechts: '`strtok`' },
        { links: 'Ist das Zeichen eine Ziffer?', rechts: '`isdigit`' },
        { links: 'Zahl und Wert aus einer Zeile lesen', rechts: '`sscanf`' },
      ],
    },
    {
      id: 'k08-l07-u2',
      typ: 'programm',
      titel: 'Messzeile auswerten',
      stufe: 2,
      themen: ['strings', 'eingabe'],
      aufgabe: md`
        Jede Eingabezeile hat die Form \`Sensor;Wert\`, z. B. \`P1;4.75\`. Lies Zeilen mit \`fgets\`, bis die Eingabe endet, zerlege sie mit \`sscanf\` und gib jeweils \`P1 = 4.75\` aus. Zeilen, die nicht passen, ergeben \`ungültig\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            char zeile[64];

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            char zeile[64];

            while (fgets(zeile, sizeof zeile, stdin) != NULL) {
                char sensor[16];
                double wert = 0.0;
                if (sscanf(zeile, "%15[^;];%lf", sensor, &wert) == 2) {
                    printf("%s = %.2f\n", sensor, wert);
                } else {
                    printf("ungültig\n");
                }
            }
            return 0;
        }
      `,
      tests: [{ name: 'Drei Zeilen', stdin: 'P1;4.75\nT2;21\nkaputt\n', erwartet: { stdout: 'P1 = 4.75\nT2 = 21.00\nungültig\n' } }],
      hinweise: [md`\`sscanf(zeile, "%15[^;];%lf", sensor, &wert)\` muss 2 liefern.`],
    },
    {
      id: 'k08-l07-u3',
      typ: 'programm',
      titel: 'Befehl normalisieren',
      stufe: 3,
      themen: ['strings', 'funktionen'],
      aufgabe: md`
        Schreibe \`void normalisieren(char text[])\`: Sie entfernt ein abschliessendes \`\n\` (falls vorhanden) und wandelt alle Buchstaben mit \`tolower\` in Kleinbuchstaben um.
      `,
      start: c`
        #include <stdio.h>
        #include <string.h>
        #include <ctype.h>

        int main(void) {
            char befehl[32] = "STOP\n";
            normalisieren(befehl);
            printf("[%s]\n", befehl);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <string.h>
        #include <ctype.h>

        void normalisieren(char text[]) {
            text[strcspn(text, "\n")] = '\0';
            for (int i = 0; text[i] != '\0'; i++) {
                text[i] = (char)tolower((unsigned char)text[i]);
            }
        }

        int main(void) {
            char befehl[32] = "STOP\n";
            normalisieren(befehl);
            printf("[%s]\n", befehl);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        void normalisieren(char text[]);
        int main(void) {
            char a[32] = "STOP\n";
            char b[32] = "Start";
            char c[32] = "\n";
            normalisieren(a);
            normalisieren(b);
            normalisieren(c);
            printf("[%s][%s][%s]\n", a, b, c);
            return 0;
        }
      `,
      tests: [{ name: 'Drei Texte', erwartet: { stdout: '[stop][start][]\n' } }],
      hinweise: [md`\`text[strcspn(text, "\n")] = '\0';\` entfernt den Zeilenumbruch.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k08-l07-c1',
      typ: 'auswahl',
      themen: ['strings'],
      frage: 'Was liefert `strchr(text, \'#\')`, wenn kein `#` im Text steht?',
      optionen: [{ text: '`NULL`', richtig: true }, { text: '0 als Index' }, { text: 'Die Länge des Texts' }],
    },
    {
      id: 'k08-l07-c2',
      typ: 'wahrfalsch',
      themen: ['strings'],
      aussage: '`strtok` verändert den Text, den es zerlegt.',
      richtig: true,
    },
    {
      id: 'k08-l07-c3',
      typ: 'eingabe',
      themen: ['strings'],
      frage: 'Welcher Header enthält `isdigit` und `toupper`?',
      antworten: ['ctype.h', '<ctype.h>'],
    },
  ],
  zusammenfassung: [
    '`strchr`/`strstr` suchen und liefern `NULL` oder die Fundstelle.',
    '`zeile[strcspn(zeile, "\\n")] = \'\\0\';` entfernt das `\\n` von `fgets`.',
    'Zerlegen mit `sscanf` (gezielt) oder `strtok` (Feld für Feld, verändert den Text).',
    '`<ctype.h>` prüft und wandelt einzelne Zeichen; Argument als `(unsigned char)` übergeben.',
  ],
  referenz: ['strchr', 'strtok', 'ctype', 'sscanf'],
};
