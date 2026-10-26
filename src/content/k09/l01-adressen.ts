import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k09-l01',
  titel: 'Speicher und Adressen',
  dauer: 20,
  stichwoerter: ['Adresse', 'Speicher', 'Byte', '&', 'Adressoperator', '%p', 'sizeof', 'Speicheradresse', 'Arbeitsspeicher'],
  lernziele: [
    'erklären, dass jede Variable an einer Adresse im Speicher liegt',
    'die Adresse einer Variable mit `&` ermitteln und mit `%p` ausgeben',
    'den Speicherbedarf von Variablen mit `sizeof` bestimmen',
  ],
  erklaerung: md`
    Der Arbeitsspeicher ist eine lange Reihe von Bytes. Jedes Byte hat eine Nummer, seine **Adresse**. Legt ein Programm eine Variable an, reserviert es so viele Bytes, wie ihr Typ braucht, und merkt sich die Adresse des ersten Bytes.

    | Variable | Typ | Grösse | Adresse (Beispiel) |
    |---|---|---|---|
    | \`drehzahl\` | \`int\` | 4 Byte | 1000 bis 1003 |
    | \`status\` | \`char\` | 1 Byte | 1004 |
    | \`temperatur\` | \`double\` | 8 Byte | 1008 bis 1015 |

    Der **Adressoperator \`&\`** liefert die Adresse einer Variable: \`&drehzahl\` heisst «die Stelle, an der \`drehzahl\` liegt». Du kennst ihn schon von \`scanf("%d", &wert)\`. \`scanf\` braucht die Adresse, damit es den gelesenen Wert dorthin schreiben kann.

    Adressen gibt man mit \`%p\` aus. Der Platzhalter erwartet den Typ \`void *\`, darum wandelt man die Adresse um: \`printf("%p\n", (void *)&drehzahl)\`. Die Ausgabe ist hexadezimal und kann sich je nach System und Programmstand ändern. Wichtig ist nicht die Zahl selbst, sondern dass jede Variable eine eigene Adresse hat.

    > [!info] Adressgrösse hier und auf dem PC
    > Die App führt deine Programme als WebAssembly mit 32-Bit-Adressen aus. Eine Adresse belegt hier **4 Byte**. Unter 64-Bit-Windows oder Linux sind es **8 Byte**. \`sizeof\` zeigt dir jeweils den richtigen Wert, darum nie eine feste Zahl annehmen.

    > [!praxis] Auf dem Mikrocontroller
    > Auch Hardware-Register haben feste Adressen. Wer an die Adresse eines Ausgangsregisters schreibt, schaltet einen Pin. Darum sind Adressen und Zeiger in der Embedded-Programmierung überall.
  `,
  syntax: [
    {
      code: c`
        &variable                      // Adresse der Variable
        printf("%p\n", (void *)&x);    // Adresse ausgeben
        sizeof x                       // Grösse der Variable in Byte
        sizeof(int)                    // Grösse eines Typs in Byte
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int drehzahl = 1500;
          char status = 'B';
          double temperatur = 21.5;

          printf("drehzahl:   %zu Byte\n", sizeof drehzahl);
          printf("status:     %zu Byte\n", sizeof status);
          printf("temperatur: %zu Byte\n", sizeof temperatur);
          printf("eine Adresse: %zu Byte\n", sizeof &drehzahl);

          printf("drehzahl liegt bei %p\n", (void *)&drehzahl);
          printf("status liegt bei   %p\n", (void *)&status);
          printf("Werte: %d %c %.1f\n", drehzahl, status, temperatur);
          return 0;
      }
    `,
    ausgabe: out`
      drehzahl:   4 Byte
      status:     1 Byte
      temperatur: 8 Byte
      eine Adresse: 4 Byte
      drehzahl liegt bei 0xffeec
      status liegt bei   0xffeeb
      Werte: 1500 B 21.5
    `,
    ausgabeVariabel: true,
  },
  zeilen: [
    { zeilen: '4-6', text: md`Drei Variablen verschiedener Typen. Jede bekommt ihren eigenen Platz im Speicher.` },
    { zeilen: '8-10', text: md`\`sizeof\` liefert die Grösse in Byte, Typ \`size_t\`, darum \`%zu\`.` },
    { zeilen: '11', text: md`Auch eine Adresse ist ein Wert mit einer Grösse: hier 4 Byte, auf einem 64-Bit-PC 8 Byte.` },
    { zeilen: '13-14', text: md`\`&\` liefert die Adresse, \`(void *)\` passt den Typ für \`%p\` an.` },
  ],
  ergebnis: md`
    Die Grössen sind fest durch die Typen bestimmt. Die Adressen sind hexadezimale Zahlen; ihre genauen Werte können bei dir anders aussehen. Man sieht, dass die Variablen nahe beieinander liegen, aber in welcher Reihenfolge der Compiler sie anordnet, ist nicht festgelegt.
  `,
  fehler: [
    {
      titel: 'Adresse mit %d ausgeben',
      text: md`\`%d\` erwartet ein \`int\`, keine Adresse. Clang warnt («format specifies type 'int' but the argument has type 'int *'»).`,
      falsch: c`printf("%d\n", &drehzahl);`,
      richtig: c`printf("%p\n", (void *)&drehzahl);`,
    },
    {
      titel: 'Feste Grössen annehmen',
      text: md`Ein Programm, das annimmt, eine Adresse habe 4 Byte, läuft auf dem PC falsch. Verwende immer \`sizeof\`.`,
    },
    {
      titel: '& bei scanf vergessen',
      text: md`Ohne \`&\` bekommt \`scanf\` den Wert statt der Adresse und schreibt an eine zufällige Stelle. Clang warnt.`,
      falsch: c`scanf("%d", wert);`,
      richtig: c`scanf("%d", &wert);`,
    },
  ],
  uebungen: [
    {
      id: 'k09-l01-u1',
      typ: 'vorhersage',
      titel: 'Grössen bestimmen',
      stufe: 1,
      themen: ['zeiger', 'datentypen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int messwerte[10];
            char name[6] = "Achse";
            printf("%zu %zu %zu\n", sizeof messwerte, sizeof name, sizeof messwerte[0]);
            return 0;
        }
      `,
      ausgabe: out`
        40 6 4
      `,
      erklaerung: md`10 \`int\` zu je 4 Byte, 5 Zeichen plus Endzeichen, ein einzelnes \`int\`.`,
    },
    {
      id: 'k09-l01-u2',
      typ: 'auswahl',
      titel: 'Warum &?',
      stufe: 1,
      themen: ['zeiger', 'eingabe'],
      frage: 'Warum steht bei `scanf("%d", &wert)` ein `&` vor `wert`?',
      optionen: [
        { text: '`scanf` braucht die Adresse, um den gelesenen Wert in die Variable zu schreiben.', richtig: true },
        { text: 'Das `&` verbindet den Platzhalter mit der Variable.' },
        { text: 'Ohne `&` würde `scanf` nur ein Zeichen lesen.' },
      ],
    },
    {
      id: 'k09-l01-u3',
      typ: 'programm',
      titel: 'Puffergrösse berechnen',
      stufe: 2,
      themen: ['zeiger', 'arrays'],
      aufgabe: md`
        Ein Logger speichert 12 Messwerte vom Typ \`double\`. Gib mit \`sizeof\` aus, wie viele Byte das Array belegt und wie viele Elemente es hat:

        ~~~
        96 Byte, 12 Elemente
        ~~~

        Die Zahlen sollen mit \`sizeof\` berechnet werden, nicht fest im Text stehen.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            double puffer[12];

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            double puffer[12];

            printf("%zu Byte, %zu Elemente\n", sizeof puffer, sizeof puffer / sizeof puffer[0]);
            return 0;
        }
      `,
      tests: [{ name: 'Ausgabe', erwartet: { stdout: '96 Byte, 12 Elemente\n' } }],
      regeln: [{ muss: '\\bsizeof\\b', meldung: 'Berechne die Werte mit `sizeof`.' }, { darfNicht: '96|12 Elemente', inTexten: true, meldung: 'Die Zahlen sollen berechnet werden, nicht im Text stehen.' }],
      hinweise: [md`Anzahl Elemente: \`sizeof puffer / sizeof puffer[0]\`.`, md`Beide Werte haben den Typ \`size_t\`, also \`%zu\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k09-l01-c1',
      typ: 'eingabe',
      themen: ['zeiger'],
      frage: 'Mit welchem Platzhalter gibt `printf` eine Adresse aus?',
      antworten: ['%p'],
    },
    {
      id: 'k09-l01-c2',
      typ: 'wahrfalsch',
      themen: ['zeiger'],
      aussage: 'Eine Adresse ist auf jedem System 4 Byte gross.',
      richtig: false,
      erklaerung: 'Hier in der App 4 Byte, auf einem 64-Bit-PC 8 Byte.',
    },
    {
      id: 'k09-l01-c3',
      typ: 'auswahl',
      themen: ['zeiger'],
      frage: 'Was liefert `&temperatur`?',
      optionen: [{ text: 'Die Adresse, an der `temperatur` gespeichert ist', richtig: true }, { text: 'Den Wert von `temperatur`' }, { text: 'Die Grösse von `temperatur`' }],
    },
  ],
  zusammenfassung: [
    'Jede Variable liegt an einer Adresse im Speicher.',
    '`&x` liefert die Adresse von `x`; ausgeben mit `%p` und `(void *)`.',
    '`sizeof` liefert Grössen in Byte; eine Adresse hat hier 4 Byte, auf dem PC 8.',
  ],
  referenz: ['adressoperator', 'fmt-p', 'sizeof'],
};
