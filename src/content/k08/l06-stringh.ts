import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k08-l06',
  titel: 'Wichtige Funktionen aus string.h',
  dauer: 30,
  stichwoerter: ['string.h', 'strlen', 'strcpy', 'strncpy', 'strcat', 'strncat', 'strcmp', 'strncmp', 'snprintf', 'kopieren', 'vergleichen', 'anhängen'],
  lernziele: [
    'die Länge eines Texts mit `strlen` bestimmen',
    'Texte sicher kopieren und zusammensetzen (`snprintf`, `strncpy`, `strncat`)',
    'Texte mit `strcmp` vergleichen',
  ],
  erklaerung: md`
    Der Header \`<string.h>\` enthält Funktionen für die häufigsten Aufgaben mit Zeichenketten.

    | Funktion | Aufgabe |
    |---|---|
    | \`strlen(s)\` | Länge ohne Endzeichen (Typ \`size_t\`) |
    | \`strcpy(ziel, quelle)\` | Text kopieren |
    | \`strcat(ziel, quelle)\` | Text anhängen |
    | \`strcmp(a, b)\` | vergleichen: 0 = gleich, < 0 = a kommt vorher, > 0 = a kommt nachher |
    | \`strncmp(a, b, n)\` | nur die ersten n Zeichen vergleichen |

    ### Vergleichen

    Texte vergleicht man **nie mit \`==\`**: Das vergleicht nur die Adressen. Richtig:

    ~~~c
    if (strcmp(befehl, "start") == 0) { … }
    ~~~

    Gross- und Kleinschreibung zählt: \`"Start"\` und \`"start"\` sind verschieden.

    ### Kopieren und anhängen, aber sicher

    \`strcpy\` und \`strcat\` prüfen **nicht**, ob das Ziel gross genug ist. Ist die Quelle zu lang, schreiben sie über das Array hinaus: ein Pufferüberlauf. Sicherer sind Varianten mit Längenangabe:

    - **\`snprintf(ziel, sizeof ziel, "%s", quelle)\`** schreibt höchstens so viel, wie hineinpasst, setzt **immer** ein Endzeichen und kann gleich formatieren: \`snprintf(meldung, sizeof meldung, "Motor %d: %s", nr, status)\`. Für die meisten Fälle die beste Wahl.
    - \`strncat(ziel, quelle, platz)\` hängt höchstens \`platz\` Zeichen an; \`platz\` muss den freien Rest berechnen: \`sizeof ziel - strlen(ziel) - 1\`.
    - \`strncpy(ziel, quelle, n)\` kopiert höchstens n Zeichen, setzt aber **kein** Endzeichen, wenn die Quelle zu lang ist. Darum nach dem Aufruf von Hand \`ziel[n - 1] = '\0';\` setzen, oder gleich \`snprintf\` nehmen.

    > [!veraltet] strcpy und strcat ohne Prüfung
    > In vielen Beispielen findet man \`strcpy(ziel, eingabe)\`. Kommt die Eingabe vom Benutzer oder über ein Netzwerk, ist das eine Sicherheitslücke. Verwende \`snprintf\` oder prüfe vorher mit \`strlen\`, ob genug Platz ist.
  `,
  syntax: [
    {
      code: c`
        #include <string.h>
        size_t n = strlen(text);
        snprintf(ziel, sizeof ziel, "%s", quelle);             // sicher kopieren
        strncat(ziel, anhang, sizeof ziel - strlen(ziel) - 1);  // sicher anhängen
        if (strcmp(a, b) == 0) { … }                           // gleich?
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          char befehl[16] = "start";
          char meldung[40];

          printf("Länge von \"%s\": %zu\n", befehl, strlen(befehl));

          if (strcmp(befehl, "start") == 0) {
              snprintf(meldung, sizeof meldung, "Motor %d: %s", 3, "läuft");
          } else {
              snprintf(meldung, sizeof meldung, "Unbekannt: %s", befehl);
          }
          printf("%s\n", meldung);

          strncat(meldung, " (Automatik)", sizeof meldung - strlen(meldung) - 1);
          printf("%s\n", meldung);

          char kurz[6];
          snprintf(kurz, sizeof kurz, "%s", "Hydraulikpumpe");
          printf("Abgeschnitten: %s\n", kurz);

          printf("Vergleich: %d %d\n", strcmp("Achse", "Band") < 0, strcmp("Band", "Band"));
          return 0;
      }
    `,
    ausgabe: out`
      Länge von "start": 5
      Motor 3: läuft
      Motor 3: läuft (Automatik)
      Abgeschnitten: Hydra
      Vergleich: 1 0
    `,
  },
  zeilen: [
    { zeilen: '8', text: md`\`strlen\` zählt die Zeichen ohne Endzeichen; Typ \`size_t\`, darum \`%zu\`.` },
    { zeilen: '10', text: md`Vergleich mit \`strcmp\`; 0 bedeutet gleich.` },
    { zeilen: '11', text: md`\`snprintf\` setzt formatiert zusammen und schreibt nie mehr als \`sizeof meldung\` Byte.` },
    { zeilen: '17', text: md`Anhängen mit Platzberechnung: Grösse minus belegte Zeichen minus Endzeichen.` },
    { zeilen: '21', text: md`Der Text ist zu lang für 6 Byte. \`snprintf\` schneidet nach 5 Zeichen ab und setzt das Endzeichen. Clang warnt hier sogar vor dem Abschneiden, wenn es die Längen kennt.` },
  ],
  ergebnis: md`
    Alle Operationen bleiben innerhalb ihrer Arrays. Beim zu kleinen Ziel wird gekürzt statt übergelaufen: «Hydra» statt eines Absturzes. «Achse» kommt im Alphabet vor «Band», darum ist der Vergleich negativ.
  `,
  fehler: [
    {
      titel: 'Texte mit == vergleichen',
      text: md`\`==\` vergleicht Adressen, nicht Inhalte. Clang warnt («result of comparison against a string literal is unspecified»).`,
      falsch: c`if (befehl == "stop")`,
      richtig: c`if (strcmp(befehl, "stop") == 0)`,
    },
    {
      titel: 'strcmp als Wahrheitswert',
      text: md`\`if (strcmp(a, b))\` ist wahr, wenn die Texte **verschieden** sind. Schreibe den Vergleich mit \`== 0\` aus.`,
    },
    {
      titel: 'Ziel zu klein',
      text: md`\`strcpy\` in ein zu kleines Array schreibt darüber hinaus. \`snprintf\` mit \`sizeof ziel\` verhindert das.`,
      falsch: c`
        char ziel[8];
        strcpy(ziel, "Druckluftventil");
      `,
      richtig: c`
        char ziel[8];
        snprintf(ziel, sizeof ziel, "%s", "Druckluftventil");
      `,
    },
  ],
  uebungen: [
    {
      id: 'k08-l06-u1',
      typ: 'vorhersage',
      titel: 'strlen und strcmp',
      stufe: 1,
      themen: ['strings'],
      code: c`
        #include <stdio.h>
        #include <string.h>

        int main(void) {
            char a[20] = "Ventil";
            printf("%zu %d %d\n", strlen(a), strcmp(a, "Ventil") == 0, strcmp(a, "ventil") == 0);
            return 0;
        }
      `,
      ausgabe: out`
        6 1 0
      `,
    },
    {
      id: 'k08-l06-u2',
      typ: 'programm',
      titel: 'Befehle auswerten',
      stufe: 2,
      themen: ['strings', 'bedingungen'],
      aufgabe: md`
        Lies Wörter (je höchstens 15 Zeichen) bis zum Ende der Eingabe. Gib für \`start\` die Zeile \`Motor an\`, für \`stop\` \`Motor aus\` und für alles andere \`unbekannt: <wort>\` aus.
      `,
      start: c`
        #include <stdio.h>
        #include <string.h>

        int main(void) {
            char wort[16];

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <string.h>

        int main(void) {
            char wort[16];

            while (scanf("%15s", wort) == 1) {
                if (strcmp(wort, "start") == 0) {
                    printf("Motor an\n");
                } else if (strcmp(wort, "stop") == 0) {
                    printf("Motor aus\n");
                } else {
                    printf("unbekannt: %s\n", wort);
                }
            }
            return 0;
        }
      `,
      tests: [{ name: 'start stop pause start', stdin: 'start stop pause start\n', erwartet: { stdout: 'Motor an\nMotor aus\nunbekannt: pause\nMotor an\n' } }],
      regeln: [{ muss: '\\bstrcmp\\s*\\(', meldung: 'Vergleiche mit `strcmp`.' }],
      hinweise: [md`\`while (scanf("%15s", wort) == 1)\` und darin \`strcmp(wort, "start") == 0\`.`],
    },
    {
      id: 'k08-l06-u3',
      typ: 'programm',
      titel: 'Dateinamen bauen',
      stufe: 3,
      themen: ['strings'],
      aufgabe: md`
        Schreibe \`void dateiname(char ziel[], size_t groesse, const char basis[], int nummer)\`, die mit \`snprintf\` einen Namen wie \`log_007.csv\` erzeugt: Basis, Unterstrich, dreistellige Nummer mit führenden Nullen, Endung \`.csv\`. Ist \`ziel\` zu klein, wird abgeschnitten, aber nie übergelaufen.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            char name[32];
            dateiname(name, sizeof name, "log", 7);
            printf("%s\n", name);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        void dateiname(char ziel[], size_t groesse, const char basis[], int nummer) {
            snprintf(ziel, groesse, "%s_%03d.csv", basis, nummer);
        }

        int main(void) {
            char name[32];
            dateiname(name, sizeof name, "log", 7);
            printf("%s\n", name);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        void dateiname(char ziel[], size_t groesse, const char basis[], int nummer);
        int main(void) {
            char a[32];
            char b[8];
            dateiname(a, sizeof a, "log", 7);
            dateiname(b, sizeof b, "messung", 42);
            printf("%s|%s\n", a, b);
            return 0;
        }
      `,
      tests: [{ name: 'Normal und zu klein', erwartet: { stdout: 'log_007.csv|messung\n' }, tipp: md`Ins zweite Array passen nur 7 Zeichen plus Endzeichen.` }],
      hinweise: [md`Formatstring: \`"%s_%03d.csv"\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k08-l06-c1',
      typ: 'auswahl',
      themen: ['strings'],
      frage: 'Was liefert `strcmp(a, b)`, wenn beide Texte gleich sind?',
      optionen: [{ text: '0', richtig: true }, { text: '1' }, { text: 'Die Länge der Texte' }],
    },
    {
      id: 'k08-l06-c2',
      typ: 'wahrfalsch',
      themen: ['strings'],
      aussage: '`snprintf(ziel, sizeof ziel, …)` schreibt nie über das Ende von `ziel` hinaus.',
      richtig: true,
    },
    {
      id: 'k08-l06-c3',
      typ: 'eingabe',
      themen: ['strings'],
      frage: 'Welchen Wert hat `strlen("Achse 2")`?',
      antworten: ['7'],
    },
  ],
  zusammenfassung: [
    '`strlen` zählt Zeichen ohne Endzeichen.',
    'Vergleichen mit `strcmp(a, b) == 0`, nie mit `==`.',
    '`snprintf(ziel, sizeof ziel, …)` kopiert und formatiert sicher.',
    '`strcpy`/`strcat` prüfen keine Grösse; nur verwenden, wenn der Platz sicher reicht.',
  ],
  referenz: ['strlen', 'strcmp', 'strcpy', 'snprintf'],
};
