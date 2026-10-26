import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'array',
    name: 'Array [ ]',
    kategorie: 'konstrukt',
    kurz: md`Mehrere Werte gleichen Typs hintereinander. Indizes von 0 bis n − 1; C prüft die Grenzen nicht. An Funktionen wird die Adresse übergeben, nicht eine Kopie.`,
    syntax: c`
      int a[5] = {1, 2, 3, 4, 5};
      a[0] = 10;
      size_t n = sizeof a / sizeof a[0];
      int m[3][4];
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int werte[4] = {7, 2, 9, 4};
            int max = werte[0];
            for (int i = 1; i < 4; i++) {
                if (werte[i] > max) {
                    max = werte[i];
                }
            }
            printf("Maximum: %d\n", max);
            return 0;
        }
      `,
      ausgabe: out`
        Maximum: 9
      `,
    },
    fehler: [md`Index n bei n Elementen (Off-by-one).`, md`\`sizeof\` auf einem Array-Parameter.`, md`Arrays mit \`=\` kopieren wollen.`],
    lektionen: ['k08-l01', 'k08-l02', 'k08-l03', 'k08-l04'],
    stichwoerter: ['Feld', 'Index', 'Element', 'Matrix'],
  },
  {
    id: 'string',
    name: 'Zeichenkette (char[])',
    kategorie: 'konstrukt',
    kurz: md`Text ist ein \`char\`-Array mit dem Endzeichen \`'\0'\`. Platzbedarf: Zeichen + 1. Umlaute belegen in UTF-8 zwei Byte.`,
    syntax: c`
      char name[20] = "Motor";
      const char *fest = "Ventil";
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            char s[] = "Achse";
            printf("%s hat %zu Byte\n", s, sizeof s);
            return 0;
        }
      `,
      ausgabe: out`
        Achse hat 6 Byte
      `,
    },
    fehler: [md`Kein Platz für das Endzeichen.`, md`Vergleich mit \`==\` statt \`strcmp\`.`, md`Zuweisung mit \`=\` statt \`snprintf\`.`],
    lektionen: ['k08-l05'],
    stichwoerter: ['String', 'Text', 'Nullterminator', 'Endzeichen'],
  },
  {
    id: 'strlen',
    name: 'strlen',
    kategorie: 'funktion',
    header: 'string.h',
    kurz: md`Länge einer Zeichenkette ohne Endzeichen, in Byte.`,
    syntax: c`size_t strlen(const char *s);`,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <string.h>

        int main(void) {
            printf("%zu %zu\n", strlen("Sensor"), strlen("Grösse"));
            return 0;
        }
      `,
      ausgabe: out`
        6 7
      `,
    },
    fehler: [md`Mit \`%d\` statt \`%zu\` ausgegeben.`, md`Umlaute zählen doppelt (UTF-8).`],
    lektionen: ['k08-l06'],
    stichwoerter: ['Länge', 'Zeichen zählen'],
  },
  {
    id: 'strcmp',
    name: 'strcmp / strncmp',
    kategorie: 'funktion',
    header: 'string.h',
    kurz: md`Vergleicht zwei Texte: 0 bei Gleichheit, negativ wenn der erste alphabetisch vorher kommt, sonst positiv. \`strncmp\` vergleicht nur die ersten n Zeichen.`,
    syntax: c`
      int strcmp(const char *a, const char *b);
      int strncmp(const char *a, const char *b, size_t n);
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <string.h>

        int main(void) {
            const char *cmd = "stop";
            if (strcmp(cmd, "stop") == 0) {
                printf("Halt\n");
            }
            printf("%d\n", strncmp("Motor1", "Motor2", 5) == 0);
            return 0;
        }
      `,
      ausgabe: out`
        Halt
        1
      `,
    },
    fehler: [md`\`if (strcmp(a, b))\` ist wahr bei **ungleichen** Texten.`, md`\`==\` vergleicht Adressen.`],
    lektionen: ['k08-l06'],
    stichwoerter: ['vergleichen', 'gleich', 'Text vergleichen'],
  },
  {
    id: 'strcpy',
    name: 'strcpy / strncpy / strcat / strncat',
    kategorie: 'funktion',
    header: 'string.h',
    kurz: md`Kopieren und Anhängen von Text. \`strcpy\`/\`strcat\` prüfen keine Grösse; \`strncpy\` setzt bei Kürzung kein Endzeichen. Meist ist \`snprintf\` die sicherere Wahl.`,
    syntax: c`
      char *strcpy(char *ziel, const char *quelle);
      char *strncat(char *ziel, const char *quelle, size_t n);
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <string.h>

        int main(void) {
            char text[20] = "Band";
            strncat(text, " links", sizeof text - strlen(text) - 1);
            printf("%s\n", text);
            return 0;
        }
      `,
      ausgabe: out`
        Band links
      `,
    },
    fehler: [md`Pufferüberlauf, wenn das Ziel zu klein ist.`, md`\`strncpy\` ohne nachträgliches Endzeichen.`],
    veraltet: md`\`strcpy\` und \`strcat\` mit Eingaben unbekannter Länge sind eine klassische Sicherheitslücke. Verwende \`snprintf(ziel, sizeof ziel, "%s", quelle)\`.`,
    lektionen: ['k08-l06'],
    stichwoerter: ['kopieren', 'anhängen', 'verketten'],
  },
  {
    id: 'snprintf',
    name: 'snprintf / sprintf',
    kategorie: 'funktion',
    header: 'stdio.h',
    kurz: md`Wie \`printf\`, schreibt aber in ein Array. \`snprintf\` begrenzt auf die angegebene Grösse und setzt immer ein Endzeichen.`,
    syntax: c`int snprintf(char *ziel, size_t groesse, const char *format, ...);`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            char zeile[32];
            snprintf(zeile, sizeof zeile, "Achse %d: %.1f mm", 2, 125.25);
            printf("%s\n", zeile);
            return 0;
        }
      `,
      ausgabe: out`
        Achse 2: 125.2 mm
      `,
    },
    fehler: [md`\`sprintf\` ohne Grössenangabe kann überlaufen.`],
    veraltet: md`\`sprintf\` prüft die Grösse nicht. Immer \`snprintf\` mit \`sizeof ziel\`.`,
    lektionen: ['k08-l06'],
    stichwoerter: ['formatieren', 'Text zusammensetzen', 'sprintf'],
  },
  {
    id: 'strchr',
    name: 'strchr / strrchr / strstr / strcspn',
    kategorie: 'funktion',
    header: 'string.h',
    kurz: md`Suchen in Texten: ein Zeichen (\`strchr\`, \`strrchr\`), einen Teiltext (\`strstr\`) oder die Länge bis zu bestimmten Zeichen (\`strcspn\`). Ergebnis \`NULL\`, wenn nichts gefunden wird.`,
    syntax: c`
      char *strchr(const char *s, int zeichen);
      char *strstr(const char *s, const char *teil);
      size_t strcspn(const char *s, const char *zeichen);
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <string.h>

        int main(void) {
            char z[] = "Fehler 17: Kabelbruch\n";
            z[strcspn(z, "\n")] = '\0';
            printf("%d %s\n", strstr(z, "Kabel") != NULL, strchr(z, ':') + 2);
            return 0;
        }
      `,
      ausgabe: out`
        1 Kabelbruch
      `,
    },
    fehler: [md`Ergebnis \`NULL\` nicht geprüft.`],
    lektionen: ['k08-l07'],
    stichwoerter: ['suchen', 'finden', 'Teiltext', 'Zeilenumbruch entfernen'],
  },
  {
    id: 'strtok',
    name: 'strtok',
    kategorie: 'funktion',
    header: 'string.h',
    kurz: md`Zerlegt einen Text an Trennzeichen. Erster Aufruf mit dem Text, weitere mit \`NULL\`. Verändert den Text.`,
    syntax: c`char *strtok(char *text, const char *trenner);`,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stdlib.h>
        #include <string.h>

        int main(void) {
            char csv[] = "12;7;30";
            int summe = 0;
            for (char *t = strtok(csv, ";"); t != NULL; t = strtok(NULL, ";")) {
                summe += (int)strtol(t, NULL, 10);
            }
            printf("%d\n", summe);
            return 0;
        }
      `,
      ausgabe: out`
        49
      `,
    },
    fehler: [md`Auf Stringliteralen aufgerufen: Absturz.`, md`Leere Felder (\`;;\`) werden übersprungen.`],
    lektionen: ['k08-l07'],
    stichwoerter: ['zerlegen', 'CSV', 'Trennzeichen', 'Token'],
  },
  {
    id: 'sscanf',
    name: 'sscanf',
    kategorie: 'funktion',
    header: 'stdio.h',
    kurz: md`Wie \`scanf\`, liest aber aus einem Text. Liefert die Anzahl gelesener Werte. \`%15[^;]\` liest Text bis zu einem Trennzeichen.`,
    syntax: c`int sscanf(const char *text, const char *format, ...);`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            char name[8];
            double wert = 0.0;
            int n = sscanf("T2;19.5", "%7[^;];%lf", name, &wert);
            printf("%d %s %.1f\n", n, name, wert);
            return 0;
        }
      `,
      ausgabe: out`
        2 T2 19.5
      `,
    },
    fehler: [md`Rückgabewert nicht geprüft.`, md`\`%s\` ohne Breite.`],
    lektionen: ['k08-l07'],
    stichwoerter: ['Text lesen', 'parsen', 'zerlegen'],
  },
  {
    id: 'ctype',
    name: 'isdigit / isalpha / toupper …',
    kategorie: 'funktion',
    header: 'ctype.h',
    kurz: md`Prüfen und Umwandeln einzelner Zeichen: \`isdigit\`, \`isalpha\`, \`isalnum\`, \`isspace\`, \`isupper\`, \`islower\`, \`toupper\`, \`tolower\`. Argument als \`(unsigned char)\` übergeben.`,
    syntax: c`
      int isdigit(int c);
      int toupper(int c);
    `,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <ctype.h>

        int main(void) {
            const char *s = "a1B2";
            for (int i = 0; s[i] != '\0'; i++) {
                unsigned char z = (unsigned char)s[i];
                printf("%c%d ", toupper(z), isdigit(z) != 0);
            }
            printf("\n");
            return 0;
        }
      `,
      ausgabe: out`
        A0 11 B0 21
      `,
    },
    fehler: [md`Negative \`char\`-Werte (Umlaute) ohne Cast übergeben.`, md`Nur ASCII: «ä» ist für \`isalpha\` kein Buchstabe.`],
    lektionen: ['k08-l07'],
    stichwoerter: ['Zeichen prüfen', 'Grossbuchstaben', 'Kleinbuchstaben', 'Ziffer'],
  },
];
