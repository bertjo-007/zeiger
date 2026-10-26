import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k02-l04',
  titel: 'Zeichen: char und ASCII',
  dauer: 20,
  stichwoerter: ['char', 'Zeichen', 'ASCII', '%c', 'Zeichenkonstante', 'einfache Anführungszeichen', 'Ziffer', 'Buchstabe', 'UTF-8', 'Umlaut'],
  lernziele: [
    'einzelne Zeichen in `char`-Variablen speichern und mit `%c` ausgeben',
    'erklären, warum ein Zeichen in C eine kleine Zahl ist (ASCII)',
    'mit Zeichen rechnen, z. B. eine Ziffer in ihren Zahlenwert umwandeln',
  ],
  erklaerung: md`
    Der Typ **\`char\`** speichert ein einzelnes Zeichen: einen Buchstaben, eine Ziffer, ein Satzzeichen. Zeichenkonstanten stehen in **einfachen** Anführungszeichen: \`'A'\`, \`'7'\`, \`'#'\`.

    ### Ein Zeichen ist eine Zahl

    Intern ist ein \`char\` eine **kleine ganze Zahl** von 1 Byte. Welche Zahl zu welchem Zeichen gehört, legt die **ASCII-Tabelle** fest:

    | Zeichen | Code | | Zeichen | Code |
    |---|---|---|---|---|
    | \`'0'\` | 48 | | \`'A'\` | 65 |
    | \`'1'\` | 49 | | \`'B'\` | 66 |
    | \`'9'\` | 57 | | \`'a'\` | 97 |
    | Leerzeichen | 32 | | \`'\n'\` | 10 |

    Die vollständige Tabelle steht in der Befehlsbibliothek. Weil Zeichen Zahlen sind, kannst du mit ihnen rechnen:

    - \`'A' + 1\` ergibt 66, also \`'B'\`.
    - Kleinbuchstaben liegen genau 32 hinter den Grossbuchstaben: \`'a' - 'A'\` ist 32.
    - Die Ziffern \`'0'\` bis \`'9'\` liegen direkt hintereinander. Darum liefert \`zeichen - '0'\` den Zahlenwert einer Ziffer: \`'7' - '0'\` ist 7.

    ### Ausgabe

    Mit \`%c\` gibt \`printf\` das Zeichen aus, mit \`%d\` seinen Zahlenwert:

    ~~~c
    char modus = 'A';
    printf("%c hat den Code %d\n", modus, modus);   // A hat den Code 65
    ~~~

    ### Zeichen und Text

    Ein \`char\` fasst **genau ein** Zeichen. Für Wörter und Sätze braucht man eine **Zeichenkette**, also ein Array von \`char\`. Das lernst du in Kapitel 8. Darum der wichtige Unterschied:

    - \`'A'\` (einfache Anführungszeichen) ist ein einzelnes Zeichen,
    - \`"A"\` (doppelte) ist eine Zeichenkette aus dem Zeichen A und einem unsichtbaren Endzeichen.

    > [!achtung] Umlaute sind keine einzelnen char
    > ASCII kennt nur die Zeichen 0 bis 127, also keine Umlaute. In UTF-8 belegt «ä» zwei Byte. \`'ä'\` passt deshalb nicht in einen \`char\`; Clang warnt. In Zeichenketten wie \`"Grösse"\` funktionieren Umlaute trotzdem, sie belegen dort einfach mehr Byte.

    > [!praxis] Befehle über die serielle Schnittstelle
    > Viele Steuerungen nehmen einbuchstabige Befehle entgegen: \`'S'\` für Start, \`'H'\` für Halt, \`'R'\` für Reset. Genau dafür ist \`char\` ideal.
  `,
  syntax: [
    {
      code: c`
        char zeichen = 'K';
        printf("%c\n", zeichen);        // K
        printf("%d\n", zeichen);        // 75
        int wert = '5' - '0';           // 5
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          char modus = 'A';      // A = Automatik
          char ziffer = '7';     // Ziffer, z. B. von einer Tastatur

          printf("Modus: %c (Code %d)\n", modus, modus);
          printf("Nächster Buchstabe: %c\n", modus + 1);
          printf("Kleinbuchstabe: %c\n", modus + 32);
          printf("Ziffer %c hat den Zahlenwert %d\n", ziffer, ziffer - '0');
          printf("Zeichen %c hat den Code %d\n", ziffer, ziffer);
          return 0;
      }
    `,
    ausgabe: out`
      Modus: A (Code 65)
      Nächster Buchstabe: B
      Kleinbuchstabe: a
      Ziffer 7 hat den Zahlenwert 7
      Zeichen 7 hat den Code 55
    `,
  },
  zeilen: [
    { zeilen: '4-5', text: md`Zwei Zeichenkonstanten in einfachen Anführungszeichen.` },
    { zeilen: '7', text: md`Dieselbe Variable einmal mit \`%c\` als Zeichen, einmal mit \`%d\` als Zahl.` },
    { zeilen: '8-9', text: md`Rechnen mit Zeichen: 65 + 1 = 66 ist \`'B'\`, 65 + 32 = 97 ist \`'a'\`.` },
    { zeilen: '10', text: md`\`'7' - '0'\` ist 55 − 48 = 7. So wird aus dem Zeichen eine Zahl, mit der man rechnen kann.` },
    { zeilen: '11', text: md`Zum Vergleich: Das Zeichen \`'7'\` hat den Code 55, nicht 7.` },
  ],
  ergebnis: md`
    Die Ausgabe zeigt, dass \`'A'\` der Zahl 65 entspricht und dass das Zeichen \`'7'\` intern die Zahl 55 ist. Erst \`ziffer - '0'\` liefert den Zahlenwert 7. Diese Umrechnung brauchst du immer, wenn Ziffern einzeln eingelesen werden.
  `,
  fehler: [
    {
      titel: 'Doppelte statt einfache Anführungszeichen',
      text: md`\`"A"\` ist eine Zeichenkette, kein Zeichen. Einem \`char\` kann man sie nicht zuweisen; Clang meldet «incompatible pointer to integer conversion».`,
      falsch: c`char c = "A";`,
      richtig: c`char c = 'A';`,
    },
    {
      titel: 'Zeichen und Zahl verwechselt',
      text: md`Das Zeichen \`'7'\` hat den Wert 55. Wer damit rechnet, ohne \`'0'\` abzuziehen, bekommt falsche Ergebnisse.`,
      falsch: c`int summe = '3' + '4';        // 103`,
      richtig: c`int summe = ('3' - '0') + ('4' - '0');   // 7`,
    },
    {
      titel: 'Mehrere Zeichen in einfachen Anführungszeichen',
      text: md`\`'OK'\` ist kein gültiges einzelnes Zeichen. Clang warnt «multi-character character constant». Für Text braucht es doppelte Anführungszeichen und eine Zeichenkette.`,
    },
  ],
  uebungen: [
    {
      id: 'k02-l04-u1',
      typ: 'vorhersage',
      titel: 'Rechnen mit Buchstaben',
      stufe: 1,
      themen: ['datentypen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            char c = 'C';
            printf("%c %c %d\n", c, c + 2, c - 'A');
            return 0;
        }
      `,
      ausgabe: out`
        C E 2
      `,
      erklaerung: md`\`'C' + 2\` ist \`'E'\`. \`'C' - 'A'\` ist 67 − 65 = 2, also die Position im Alphabet ab 0.`,
    },
    {
      id: 'k02-l04-u2',
      typ: 'zuordnen',
      titel: 'Codes zuordnen',
      stufe: 1,
      themen: ['datentypen'],
      frage: 'Welcher ASCII-Code gehört zu welchem Zeichen?',
      paare: [
        { links: "`'A'`", rechts: '65' },
        { links: "`'a'`", rechts: '97' },
        { links: "`'0'`", rechts: '48' },
        { links: 'Leerzeichen', rechts: '32' },
      ],
    },
    {
      id: 'k02-l04-u3',
      typ: 'programm',
      titel: 'Ziffern zusammensetzen',
      stufe: 2,
      themen: ['datentypen'],
      aufgabe: md`
        Ein Drehschalter liefert seine Stellung als drei einzelne Zeichen: \`'2'\`, \`'4'\` und \`'7'\` (Hunderter, Zehner, Einer). Berechne daraus die Zahl 247 und gib aus:

        ~~~text
        Sollwert: 247
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            char h = '2';
            char z = '4';
            char e = '7';

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            char h = '2';
            char z = '4';
            char e = '7';

            int wert = (h - '0') * 100 + (z - '0') * 10 + (e - '0');
            printf("Sollwert: %d\n", wert);
            return 0;
        }
      `,
      tests: [{ name: 'Ergibt 247', erwartet: { stdout: 'Sollwert: 247\n' } }],
      regeln: [{ darfNicht: '247', meldung: 'Berechne 247 aus den drei Zeichen, statt die Zahl hinzuschreiben.' }],
      hinweise: [md`\`h - '0'\` ist der Zahlenwert der Hunderterstelle.`, md`Hunderter mal 100 plus Zehner mal 10 plus Einer.`],
    },
    {
      id: 'k02-l04-u4',
      typ: 'programm',
      titel: 'Grossbuchstaben',
      stufe: 2,
      themen: ['datentypen'],
      aufgabe: md`
        Ein Bediener tippt die Befehle \`s\` (Start) und \`h\` (Halt) in Kleinbuchstaben. Die Steuerung erwartet Grossbuchstaben. Wandle beide Zeichen durch Rechnen um und gib aus:

        ~~~text
        s -> S
        h -> H
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            char start = 's';
            char halt = 'h';

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            char start = 's';
            char halt = 'h';

            printf("%c -> %c\n", start, start - ('a' - 'A'));
            printf("%c -> %c\n", halt, halt - ('a' - 'A'));
            return 0;
        }
      `,
      tests: [{ name: 'Beide Befehle umgewandelt', erwartet: { stdout: 's -> S\nh -> H\n' } }],
      regeln: [{ darfNicht: "'[SH]'", meldung: 'Rechne die Grossbuchstaben aus, statt `\'S\'` oder `\'H\'` hinzuschreiben.' }],
      hinweise: [md`Kleinbuchstaben liegen 32 Positionen hinter den Grossbuchstaben.`, md`\`start - 32\` oder lesbarer \`start - ('a' - 'A')\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k02-l04-c1',
      typ: 'auswahl',
      themen: ['datentypen'],
      frage: "Was ist der Unterschied zwischen `'A'` und `\"A\"`?",
      optionen: [
        { text: "`'A'` ist ein einzelnes Zeichen, `\"A\"` eine Zeichenkette.", richtig: true },
        { text: 'Es gibt keinen Unterschied.', warum: 'Einfache Anführungszeichen stehen für ein Zeichen, doppelte für Text.' },
        { text: "`\"A\"` ist ein Kleinbuchstabe.", warum: 'Die Art der Anführungszeichen hat nichts mit Gross- und Kleinschreibung zu tun.' },
      ],
    },
    {
      id: 'k02-l04-c2',
      typ: 'eingabe',
      themen: ['datentypen'],
      frage: "Welchen Zahlenwert hat der Ausdruck `'9' - '0'`?",
      antworten: ['9'],
    },
    {
      id: 'k02-l04-c3',
      typ: 'wahrfalsch',
      themen: ['datentypen'],
      aussage: "Der Umlaut `'ü'` passt in UTF-8 in einen einzelnen `char`.",
      richtig: false,
      erklaerung: 'In UTF-8 belegen Umlaute zwei Byte, ein `char` hat nur eines.',
    },
  ],
  zusammenfassung: [
    "`char` speichert ein einzelnes Zeichen in einfachen Anführungszeichen, z. B. `'A'`.",
    'Intern ist ein Zeichen eine kleine Zahl nach der ASCII-Tabelle: `\'A\'` ist 65.',
    '`%c` gibt das Zeichen aus, `%d` seinen Code.',
    "`ziffer - '0'` wandelt eine Ziffer in ihren Zahlenwert um.",
    'Text braucht doppelte Anführungszeichen und ein `char`-Array (Kapitel 8).',
  ],
  referenz: ['char', 'fmt-c'],
};
