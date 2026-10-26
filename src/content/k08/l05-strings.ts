import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k08-l05',
  titel: 'Zeichenketten als char-Arrays',
  dauer: 30,
  stichwoerter: ['Zeichenkette', 'String', 'char-Array', 'Nullterminator', '\\0', 'Endzeichen', '%s', 'Stringliteral', 'UTF-8', 'Länge'],
  lernziele: [
    'erklären, wie C Text als `char`-Array mit Endzeichen `\\0` speichert',
    'Zeichenketten anlegen, ausgeben und Zeichen für Zeichen durchlaufen',
    'den nötigen Speicherplatz für einen Text richtig bemessen',
  ],
  erklaerung: md`
    C hat keinen eigenen Datentyp für Text. Eine **Zeichenkette** (englisch string) ist einfach ein **Array aus \`char\`**, dessen Ende durch ein besonderes Zeichen markiert ist: das **Nullzeichen** \`'\0'\` (der Wert 0).

    ~~~c
    char name[8] = "Pumpe";
    ~~~

    | Index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
    |---|---|---|---|---|---|---|---|---|
    | Inhalt | P | u | m | p | e | \`\0\` | \`\0\` | \`\0\` |

    Das Wort hat 5 Buchstaben, belegt aber **6** Plätze, weil das Endzeichen dazukommt. Ein Array für einen Text mit n Zeichen braucht also **mindestens n + 1** Plätze.

    ### Warum das Endzeichen?

    Funktionen wie \`printf("%s", …)\` bekommen nur die Adresse des ersten Zeichens. Woher sollen sie wissen, wo der Text aufhört? Sie lesen Zeichen für Zeichen, **bis sie auf \`'\0'\` stossen**. Fehlt das Endzeichen, lesen sie über das Array hinaus weiter.

    ### Anlegen

    ~~~c
    char a[] = "Motor";          // Länge 6 automatisch (5 + Endzeichen)
    char b[20] = "Motor";        // Platz für bis zu 19 Zeichen
    char c[20] = "";             // leerer Text: nur das Endzeichen
    const char *d = "Motor";     // Zeiger auf einen festen Text (nur lesen)
    ~~~

    Ein Text in doppelten Anführungszeichen heisst **Stringliteral**. Ein Array darf man nur bei der Deklaration damit initialisieren; später ist \`b = "Pumpe";\` nicht erlaubt. Dafür gibt es \`strcpy\` und \`snprintf\` (nächste Lektion).

    ### Zeichen für Zeichen

    Weil eine Zeichenkette ein Array ist, kommt man an jedes Zeichen über den Index: \`name[0]\` ist \`'P'\`. Eine Schleife läuft, bis das Endzeichen erreicht ist:

    ~~~c
    for (int i = 0; name[i] != '\0'; i++) { … }
    ~~~

    > [!achtung] Umlaute in UTF-8
    > «Grösse» hat 6 Buchstaben, belegt in UTF-8 aber 7 Byte, weil «ö» zwei Byte braucht. \`strlen("Grösse")\` liefert deshalb 7, und eine Schleife über die Bytes sieht das «ö» als zwei Zeichen. Für Arrays, Längen und Puffergrössen zählen immer die **Byte**.
  `,
  syntax: [
    {
      code: c`
        char text[GROESSE] = "Inhalt";     // GROESSE >= Länge + 1
        printf("%s\n", text);              // Ausgabe bis zum '\0'
        text[0] = 'X';                     // einzelnes Zeichen ändern
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          char geraet[16] = "Kompressor";
          printf("Gerät: %s\n", geraet);

          int laenge = 0;
          while (geraet[laenge] != '\0') {
              laenge++;
          }
          printf("Länge: %d Zeichen\n", laenge);

          int vokale = 0;
          for (int i = 0; geraet[i] != '\0'; i++) {
              char z = geraet[i];
              if (z == 'a' || z == 'e' || z == 'i' || z == 'o' || z == 'u') {
                  vokale++;
              }
          }
          printf("Vokale: %d\n", vokale);

          geraet[0] = 'k';
          printf("Klein: %s\n", geraet);
          return 0;
      }
    `,
    ausgabe: out`
      Gerät: Kompressor
      Länge: 10 Zeichen
      Vokale: 3
      Klein: kompressor
    `,
  },
  zeilen: [
    { zeilen: '4', text: md`Ein Array mit 16 Plätzen, belegt mit 10 Zeichen und dem Endzeichen.` },
    { zeilen: '7-10', text: md`Die Länge wird gezählt, bis das Endzeichen kommt. Genau so arbeitet \`strlen\`.` },
    { zeilen: '13', text: md`Eine Schleife, die beim Endzeichen stoppt.` },
    { zeilen: '21', text: md`Ein einzelnes Zeichen wird überschrieben.` },
  ],
  ergebnis: md`
    «Kompressor» hat 10 Zeichen und 3 Vokale; nach der Änderung beginnt es klein. Das Array hat zwar 16 Plätze, aber \`printf\` hört beim Endzeichen auf.
  `,
  fehler: [
    {
      titel: 'Kein Platz für das Endzeichen',
      text: md`\`char a[5] = "Pumpe";\` hat genau 5 Zeichen Platz; das Endzeichen fehlt. In C ist das sogar erlaubt, aber danach ist \`a\` keine gültige Zeichenkette mehr.`,
      falsch: c`char a[5] = "Pumpe";`,
      richtig: c`char a[6] = "Pumpe";`,
    },
    {
      titel: 'Zuweisung mit =',
      text: md`Arrays kann man nicht zuweisen: «array type is not assignable». Für Text \`strcpy\` oder \`snprintf\` verwenden.`,
      falsch: c`name = "Ventil";`,
      richtig: c`snprintf(name, sizeof name, "Ventil");`,
    },
    {
      titel: '\'A\' und "A" verwechselt',
      text: md`\`'A'\` ist ein Zeichen, \`"A"\` eine Zeichenkette aus zwei Byte (A und Endzeichen).`,
    },
  ],
  uebungen: [
    {
      id: 'k08-l05-u1',
      typ: 'eingabe',
      titel: 'Speicherplatz',
      stufe: 1,
      themen: ['strings'],
      frage: 'Wie viele Byte belegt `char s[] = "Sensor";`?',
      antworten: ['7'],
      erklaerung: '6 Buchstaben plus das Endzeichen.',
    },
    {
      id: 'k08-l05-u2',
      typ: 'programm',
      titel: 'Zeichen zählen',
      stufe: 2,
      themen: ['strings', 'funktionen'],
      aufgabe: md`
        Schreibe \`int zaehle_zeichen(const char text[], char gesucht)\`, die zählt, wie oft \`gesucht\` im Text vorkommt. Laufe bis zum Endzeichen. Die Funktion gibt nichts aus.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            printf("%d\n", zaehle_zeichen("A1-B2-C3", '-'));
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int zaehle_zeichen(const char text[], char gesucht) {
            int anzahl = 0;
            for (int i = 0; text[i] != '\0'; i++) {
                if (text[i] == gesucht) {
                    anzahl++;
                }
            }
            return anzahl;
        }

        int main(void) {
            printf("%d\n", zaehle_zeichen("A1-B2-C3", '-'));
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        int zaehle_zeichen(const char text[], char gesucht);
        int main(void) {
            printf("%d %d %d\n", zaehle_zeichen("A1-B2-C3", '-'), zaehle_zeichen("Ventil", 'x'), zaehle_zeichen("", 'a'));
            return 0;
        }
      `,
      tests: [{ name: 'Drei Texte', erwartet: { stdout: '2 0 0\n' } }],
      hinweise: [md`\`for (int i = 0; text[i] != '\0'; i++)\``],
    },
    {
      id: 'k08-l05-u3',
      typ: 'programm',
      titel: 'Gross schreiben',
      stufe: 3,
      themen: ['strings', 'datentypen'],
      aufgabe: md`
        Lies ein Wort (höchstens 30 Zeichen) mit \`scanf("%30s", …)\` und wandle alle Kleinbuchstaben \`a\` bis \`z\` **im Array** in Grossbuchstaben um, ohne Bibliotheksfunktion. Gib das Wort danach aus. Bei \`motor42b\`: \`MOTOR42B\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            char wort[31];
            scanf("%30s", wort);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            char wort[31];
            scanf("%30s", wort);

            for (int i = 0; wort[i] != '\0'; i++) {
                if (wort[i] >= 'a' && wort[i] <= 'z') {
                    wort[i] = wort[i] - 'a' + 'A';
                }
            }
            printf("%s\n", wort);
            return 0;
        }
      `,
      tests: [
        { name: 'motor42b', stdin: 'motor42b\n', erwartet: { stdout: 'MOTOR42B\n' } },
        { name: 'Gemischt', stdin: 'AbC-xyz\n', erwartet: { stdout: 'ABC-XYZ\n' } },
      ],
      regeln: [{ darfNicht: '\\btoupper\\b', meldung: 'Löse es ohne `toupper`.' }],
      hinweise: [md`Nur Zeichen zwischen \`'a'\` und \`'z'\` ändern; der Abstand zu den Grossbuchstaben ist \`'a' - 'A'\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k08-l05-c1',
      typ: 'auswahl',
      themen: ['strings'],
      frage: 'Woran erkennen String-Funktionen das Ende einer Zeichenkette?',
      optionen: [{ text: 'Am Nullzeichen `\'\\0\'`', richtig: true }, { text: 'An der Grösse des Arrays' }, { text: 'Am Zeilenumbruch `\'\\n\'`' }],
    },
    {
      id: 'k08-l05-c2',
      typ: 'wahrfalsch',
      themen: ['strings'],
      aussage: 'Man kann einem `char`-Array nach der Deklaration mit `=` einen neuen Text zuweisen.',
      richtig: false,
    },
    {
      id: 'k08-l05-c3',
      typ: 'eingabe',
      themen: ['strings'],
      frage: 'Wie viele Byte belegt das Wort «Lösung» in UTF-8 (ohne Endzeichen)?',
      antworten: ['7'],
      erklaerung: 'Das «ö» belegt zwei Byte.',
    },
  ],
  zusammenfassung: [
    'Eine Zeichenkette ist ein `char`-Array mit dem Endzeichen `\'\\0\'`.',
    'Platzbedarf: Anzahl Zeichen + 1; Umlaute in UTF-8 belegen 2 Byte.',
    '`printf("%s")` und alle String-Funktionen lesen bis zum Endzeichen.',
    'Arrays nur bei der Deklaration mit `"…"` füllen; später `strcpy`/`snprintf`.',
  ],
  referenz: ['string', 'fmt-s'],
};
