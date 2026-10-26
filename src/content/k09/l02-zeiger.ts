import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k09-l02',
  titel: 'Zeiger deklarieren und dereferenzieren',
  dauer: 25,
  stichwoerter: ['Zeiger', 'Pointer', '*', 'Dereferenzierung', 'Inhaltsoperator', 'int *', 'Zeigervariable'],
  lernziele: [
    'eine Zeigervariable deklarieren und mit einer Adresse belegen',
    'über einen Zeiger mit `*` lesen und schreiben',
    'einen Zeiger auf eine andere Variable umsetzen',
  ],
  erklaerung: md`
    Ein **Zeiger** (englisch *pointer*) ist eine Variable, die eine Adresse speichert. Man sagt: Der Zeiger *zeigt auf* die Variable, deren Adresse er enthält.

    ~~~c
    int sollwert = 1200;
    int *p = &sollwert;   // p zeigt auf sollwert
    ~~~

    \`int *p\` heisst: \`p\` ist ein Zeiger auf ein \`int\`. Der Typ sagt, was an der Adresse liegt. Ein \`int *\` darf nur auf ein \`int\` zeigen, ein \`double *\` nur auf ein \`double\`.

    Mit dem **Inhaltsoperator \`*\`** (Dereferenzierung) kommt man an den Wert, auf den der Zeiger zeigt:

    | Ausdruck | Bedeutung | Wert im Beispiel |
    |---|---|---|
    | \`p\` | die gespeicherte Adresse | Adresse von \`sollwert\` |
    | \`*p\` | der Wert an dieser Adresse | 1200 |
    | \`&p\` | die Adresse des Zeigers selbst | eine andere Adresse |

    \`*p\` kann man lesen und beschreiben: \`*p = 1500;\` ändert \`sollwert\`, ohne dass der Name \`sollwert\` vorkommt. Genau das macht Zeiger nützlich: Eine Funktion, die nur die Adresse kennt, kann trotzdem die Variable ändern (nächste Lektion).

    > [!achtung] Das Sternchen hat zwei Bedeutungen
    > In der **Deklaration** \`int *p\` sagt \`*\`: «p ist ein Zeiger». In einem **Ausdruck** wie \`*p = 5\` sagt \`*\`: «der Wert, auf den p zeigt». Und zwischen zwei Zahlen ist \`*\` weiterhin die Multiplikation.

    Ein Zeiger, der (noch) auf nichts zeigt, bekommt den Wert **\`NULL\`**. Mehr dazu in der Lektion über Zeigerfehler.
  `,
  syntax: [
    {
      code: c`
        typ *name = &variable;   // Zeiger anlegen
        *name                    // Wert lesen
        *name = wert;            // Wert schreiben
        name = &andere;          // auf etwas anderes zeigen
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int sollwert = 1200;
          int *p = &sollwert;

          printf("sollwert = %d\n", sollwert);
          printf("*p       = %d\n", *p);

          *p = 1500;
          printf("sollwert = %d\n", sollwert);

          *p += 100;
          printf("sollwert = %d\n", sollwert);

          int istwert = 900;
          p = &istwert;
          printf("*p       = %d\n", *p);
          printf("p zeigt auf istwert: %d\n", p == &istwert);
          return 0;
      }
    `,
    ausgabe: out`
      sollwert = 1200
      *p       = 1200
      sollwert = 1500
      sollwert = 1600
      *p       = 900
      p zeigt auf istwert: 1
    `,
  },
  zeilen: [
    { zeilen: '5', text: md`\`p\` ist ein Zeiger auf \`int\` und bekommt die Adresse von \`sollwert\`.` },
    { zeilen: '8', text: md`\`*p\` liest den Wert an der Adresse: derselbe Wert wie \`sollwert\`.` },
    { zeilen: '10', text: md`Schreiben über den Zeiger ändert \`sollwert\` selbst.` },
    { zeilen: '13', text: md`Auch zusammengesetzte Zuweisungen funktionieren mit \`*p\`.` },
    { zeilen: '17', text: md`Ohne Sternchen: \`p\` bekommt eine neue Adresse und zeigt jetzt auf \`istwert\`.` },
    { zeilen: '19', text: md`Zeiger lassen sich vergleichen: gleich, wenn sie dieselbe Adresse enthalten.` },
  ],
  ergebnis: md`
    Über \`*p\` wird \`sollwert\` zweimal geändert, obwohl in Zeile 10 und 13 nur \`p\` vorkommt. Danach zeigt \`p\` auf \`istwert\`; \`sollwert\` bleibt bei 1600.
  `,
  fehler: [
    {
      titel: 'Mehrere Zeiger in einer Zeile',
      text: md`Das Sternchen gehört zum Namen, nicht zum Typ. In \`int *p, q;\` ist nur \`p\` ein Zeiger, \`q\` ist ein gewöhnliches \`int\`. Am besten jeden Zeiger in einer eigenen Zeile deklarieren.`,
      falsch: c`int *p, q;      // q ist kein Zeiger`,
      richtig: c`
        int *p = NULL;
        int *q = NULL;
      `,
    },
    {
      titel: 'Stern vergessen',
      text: md`\`p = 5;\` versucht, die Adresse auf 5 zu setzen. Clang meldet «incompatible integer to pointer conversion». Gemeint war \`*p = 5;\`.`,
    },
    {
      titel: 'Falscher Zeigertyp',
      text: md`Ein \`double *\` darf nicht auf ein \`int\` zeigen. Clang warnt («incompatible pointer types»), und beim Lesen kämen falsche Werte heraus.`,
      falsch: c`
        int n = 3;
        double *p = &n;
      `,
      richtig: c`
        int n = 3;
        int *p = &n;
      `,
    },
  ],
  uebungen: [
    {
      id: 'k09-l02-u1',
      typ: 'vorhersage',
      titel: 'Wer zeigt wohin?',
      stufe: 1,
      themen: ['zeiger'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int a = 5;
            int b = 8;
            int *p = &a;
            *p = *p * 2;
            p = &b;
            *p = *p - a;
            printf("%d %d\n", a, b);
            return 0;
        }
      `,
      ausgabe: out`
        10 -2
      `,
      erklaerung: md`Zuerst wird \`a\` verdoppelt (10). Dann zeigt \`p\` auf \`b\`: 8 − 10 = −2.`,
    },
    {
      id: 'k09-l02-u2',
      typ: 'luecke',
      titel: 'Grenzwert über Zeiger',
      stufe: 1,
      themen: ['zeiger'],
      frage: 'Ergänze so, dass `p` auf `grenze` zeigt und `grenze` über den Zeiger auf 80 gesetzt wird.',
      code: c`
        #include <stdio.h>

        int main(void) {
            int grenze = 60;
            int __1__ = &grenze;
            __2__ = 80;
            printf("%d\n", grenze);
            return 0;
        }
      `,
      luecken: [['*p'], ['*p']],
      ausgabe: '80\n',
    },
    {
      id: 'k09-l02-u3',
      typ: 'programm',
      titel: 'Einlesen über einen Zeiger',
      stufe: 2,
      themen: ['zeiger', 'eingabe'],
      aufgabe: md`
        Im Startcode zeigt \`p\` auf \`wert\`. Lies eine ganze Zahl mit \`scanf\` **über den Zeiger** ein (ohne \`&wert\`), verdopple sie über den Zeiger und gib danach \`wert\` aus.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int wert = 0;
            int *p = &wert;

            printf("%d\n", wert);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int wert = 0;
            int *p = &wert;

            if (scanf("%d", p) != 1) {
                return 1;
            }
            *p *= 2;
            printf("%d\n", wert);
            return 0;
        }
      `,
      stdin: '21\n',
      tests: [
        { name: '21', stdin: '21\n', erwartet: { stdout: '42\n' } },
        { name: '-7', stdin: '-7\n', erwartet: { stdout: '-14\n' } },
      ],
      regeln: [
        { muss: 'scanf\\s*\\([^,]*,\\s*p\\s*\\)', meldung: 'Übergib `scanf` den Zeiger `p`. Er enthält schon die Adresse.' },
        { darfNicht: '&\\s*wert(?!\\s*;)', meldung: 'Verwende nach der Deklaration von `p` nicht mehr `&wert`.' },
      ],
      hinweise: [md`\`p\` enthält bereits die Adresse; darum \`scanf("%d", p)\`, ohne \`&\`.`, md`Verdoppeln: \`*p *= 2;\` oder \`*p = *p * 2;\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k09-l02-c1',
      typ: 'wahrfalsch',
      themen: ['zeiger'],
      aussage: 'Nach `int *p, q;` sind `p` und `q` beides Zeiger.',
      richtig: false,
      erklaerung: 'Nur `p` ist ein Zeiger; `q` ist ein `int`.',
    },
    {
      id: 'k09-l02-c2',
      typ: 'auswahl',
      themen: ['zeiger'],
      frage: '`p` zeigt auf `x`. Welcher Ausdruck setzt `x` auf 0?',
      optionen: [{ text: '`*p = 0;`', richtig: true }, { text: '`p = 0;`', warum: 'Setzt den Zeiger selbst auf 0 (NULL).' }, { text: '`&p = 0;`' }],
    },
    {
      id: 'k09-l02-c3',
      typ: 'zuordnen',
      themen: ['zeiger'],
      frage: '`int x = 7; int *p = &x;` Ordne zu.',
      paare: [
        { links: '`*p`', rechts: 'der Wert 7' },
        { links: '`p`', rechts: 'die Adresse von x' },
        { links: '`&p`', rechts: 'die Adresse des Zeigers' },
      ],
    },
  ],
  zusammenfassung: [
    'Ein Zeiger speichert eine Adresse: `int *p = &x;`.',
    '`*p` liest oder schreibt den Wert, auf den `p` zeigt.',
    '`p = &y;` lässt den Zeiger auf eine andere Variable zeigen.',
    'Der Zeigertyp muss zum Typ der Variable passen.',
  ],
  referenz: ['zeiger', 'dereferenzierung', 'adressoperator'],
};
