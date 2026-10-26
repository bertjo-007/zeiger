import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k02-l02',
  titel: 'Ganzzahlen und feste Breiten',
  dauer: 30,
  stichwoerter: ['int', 'short', 'long', 'long long', 'unsigned', 'signed', 'sizeof', 'INT_MAX', 'limits.h', 'stdint.h', 'uint8_t', 'int16_t', 'uint32_t', 'Überlauf', '%u', '%lld', '%zu', 'Wertebereich'],
  lernziele: [
    'die Ganzzahltypen `short`, `int`, `long`, `long long` und ihre `unsigned`-Varianten unterscheiden',
    'Grösse und Wertebereich mit `sizeof` und `<limits.h>` ermitteln',
    'Typen mit fester Breite aus `<stdint.h>` einsetzen, wie es auf Mikrocontrollern üblich ist',
    'erklären, was bei einem Überlauf passiert',
  ],
  erklaerung: md`
    C hat mehrere Typen für ganze Zahlen. Sie unterscheiden sich in der **Grösse** (wie viele Byte sie belegen) und darin, ob sie **negative Zahlen** speichern können.

    | Typ | typische Grösse | Bereich (bei dieser Grösse) | Platzhalter |
    |---|---|---|---|
    | \`short\` | 2 Byte | −32 768 bis 32 767 | \`%hd\` |
    | \`int\` | 4 Byte | etwa ±2,1 Milliarden | \`%d\` |
    | \`long\` | 4 oder 8 Byte | je nach System | \`%ld\` |
    | \`long long\` | 8 Byte | etwa ±9,2 Trillionen | \`%lld\` |
    | \`unsigned int\` | 4 Byte | 0 bis 4 294 967 295 | \`%u\` |

    Mit \`unsigned\` davor gibt es keine negativen Werte, dafür reicht der Bereich doppelt so weit nach oben.

    ### Die Grösse ist nicht überall gleich

    Der C-Standard legt nur **Mindestgrössen** fest. \`int\` hat auf einem PC 4 Byte, auf einem Arduino Uno (AVR) aber nur **2 Byte**: Dort ist bei 32 767 Schluss. \`long\` hat unter 64-Bit-Linux 8 Byte, unter Windows 4. Die genauen Werte liefern:

    - der Operator **\`sizeof\`**: \`sizeof(int)\` ist die Grösse in Byte, ausgegeben mit \`%zu\`;
    - der Header **\`<limits.h>\`**: \`INT_MIN\`, \`INT_MAX\`, \`UINT_MAX\`, \`LLONG_MAX\` und weitere.

    ### Typen mit fester Breite

    Wenn die Grösse wirklich zählt, etwa bei Registern, Sensordaten oder Datenprotokollen, nimmt man die Typen aus **\`<stdint.h>\`**. Ihr Name sagt genau, wie viele Bit sie haben:

    | Typ | Bit | Bereich |
    |---|---|---|
    | \`int8_t\` / \`uint8_t\` | 8 | −128 bis 127 / 0 bis 255 |
    | \`int16_t\` / \`uint16_t\` | 16 | −32 768 bis 32 767 / 0 bis 65 535 |
    | \`int32_t\` / \`uint32_t\` | 32 | etwa ±2,1 Mrd. / 0 bis 4,29 Mrd. |
    | \`int64_t\` / \`uint64_t\` | 64 | sehr gross |

    \`uint8_t\` und \`uint16_t\` gibst du mit \`%d\` aus: Bei der Übergabe an \`printf\` werden sie automatisch zu \`int\` erweitert.

    ### Überlauf

    Jeder Typ hat eine Obergrenze. Was passiert, wenn eine Rechnung sie überschreitet?

    - **Ohne Vorzeichen** (\`unsigned\`) ist das genau festgelegt: Die Zählung beginnt wieder bei 0, wie ein Kilometerzähler. Bei \`uint8_t\` folgt auf 255 die 0.
    - **Mit Vorzeichen** (\`int\` usw.) ist der Überlauf **undefiniertes Verhalten**. Das Programm darf dann irgendetwas tun. Zeiger fängt das ab und meldet einen Laufzeitfehler.

    > [!praxis] Encoder und Zähler
    > Ein Encoder an einem Motor liefert oft Hunderte Impulse pro Umdrehung. Nach einigen Stunden Betrieb ist ein 16-Bit-Zähler längst übergelaufen. Plane den Typ deshalb nach dem grössten Wert, der vorkommen kann, nicht nach dem typischen.
  `,
  syntax: [
    {
      code: c`
        short s = 1000;
        long long gross = 9000000000LL;   // LL: Konstante als long long
        unsigned int zaehler = 0u;        // u: Konstante als unsigned
        uint8_t pwm = 128;                // braucht #include <stdint.h>
        printf("%zu\n", sizeof(int));     // Grösse in Byte
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <limits.h>
      #include <stdint.h>

      int main(void) {
          printf("int:       %zu Byte, %d bis %d\n", sizeof(int), INT_MIN, INT_MAX);
          printf("unsigned:  %zu Byte, 0 bis %u\n", sizeof(unsigned int), UINT_MAX);
          printf("long long: %zu Byte\n", sizeof(long long));

          uint8_t helligkeit = 250;   // PWM-Wert, 0 bis 255
          uint16_t adc = 4095;        // Messwert eines 12-Bit-Wandlers
          printf("Helligkeit %d, ADC %d\n", helligkeit, adc);

          helligkeit = helligkeit + 10;   // überschreitet 255
          printf("Nach +10: %d\n", helligkeit);
          return 0;
      }
    `,
    ausgabe: out`
      int:       4 Byte, -2147483648 bis 2147483647
      unsigned:  4 Byte, 0 bis 4294967295
      long long: 8 Byte
      Helligkeit 250, ADC 4095
      Nach +10: 4
    `,
  },
  zeilen: [
    { zeilen: '2-3', text: md`\`<limits.h>\` liefert die Grenzwerte, \`<stdint.h>\` die Typen mit fester Breite.` },
    { zeilen: '6', text: md`\`sizeof(int)\` hat den Typ \`size_t\`, darum der Platzhalter \`%zu\`. \`INT_MIN\` und \`INT_MAX\` sind die Grenzen von \`int\`.` },
    { zeilen: '7', text: md`\`UINT_MAX\` ist eine \`unsigned\`-Zahl und braucht \`%u\`.` },
    { zeilen: '10-11', text: md`Typen mit fester Breite: \`uint8_t\` für 0 bis 255, \`uint16_t\` für Werte bis 65 535.` },
    { zeilen: '14', text: md`250 + 10 = 260 passt nicht in 8 Bit. Bei \`unsigned\`-Typen geht die Zählung wieder bei 0 los: 260 − 256 = 4.` },
  ],
  ergebnis: md`
    Die ersten drei Zeilen zeigen die Grössen in dieser Lernumgebung. Auf deinem PC sind sie für \`int\` und \`long long\` gleich. Die letzte Zeile zeigt den Überlauf von \`uint8_t\`: aus 260 wird 4. Ein solcher Wert wäre als PWM-Helligkeit plötzlich fast dunkel statt maximal hell.
  `,
  fehler: [
    {
      titel: 'Überlauf von int',
      text: md`Das Produkt zweier \`int\` wird im Typ \`int\` berechnet, auch wenn das Ergebnis danach in einer grösseren Variable landet. 50 000 · 50 000 = 2,5 Milliarden passt nicht in \`int\`. Mindestens ein Faktor muss vorher grösser sein.`,
      falsch: c`long long flaeche = 50000 * 50000;`,
      richtig: c`long long flaeche = 50000LL * 50000;`,
    },
    {
      titel: 'Falscher Platzhalter für long long',
      text: md`\`%d\` erwartet ein \`int\`. Für \`long long\` brauchst du \`%lld\`, sonst stimmt die Ausgabe nicht. Clang warnt mit \`-Wformat\`.`,
      falsch: c`printf("%d\n", gross);`,
      richtig: c`printf("%lld\n", gross);`,
    },
    {
      titel: 'Annahme: int hat immer 4 Byte',
      text: md`Auf einem 8-Bit-Mikrocontroller hat \`int\` 2 Byte. Code, der auf dem PC funktioniert, läuft dort über. Für feste Grössen \`int32_t\`, \`uint16_t\` usw. verwenden.`,
    },
  ],
  uebungen: [
    {
      id: 'k02-l02-u1',
      typ: 'auswahl',
      titel: 'Passender Typ',
      stufe: 1,
      themen: ['datentypen'],
      frage: 'Ein Helligkeitswert für eine LED liegt immer zwischen 0 und 255. Welcher Typ passt am besten?',
      optionen: [
        { text: '`uint8_t`', richtig: true, warum: 'Genau 8 Bit ohne Vorzeichen: 0 bis 255.' },
        { text: '`int8_t`', warum: 'Mit Vorzeichen reicht er nur bis 127.' },
        { text: '`long long`', warum: 'Funktioniert, verschwendet aber 7 Byte, was auf einem Mikrocontroller zählt.' },
      ],
    },
    {
      id: 'k02-l02-u2',
      typ: 'vorhersage',
      titel: 'Kilometerzähler',
      stufe: 2,
      themen: ['datentypen'],
      code: c`
        #include <stdio.h>
        #include <stdint.h>

        int main(void) {
            uint8_t zaehler = 254;
            zaehler = zaehler + 1;
            printf("%d\n", zaehler);
            zaehler = zaehler + 1;
            printf("%d\n", zaehler);
            zaehler = zaehler + 1;
            printf("%d\n", zaehler);
            return 0;
        }
      `,
      ausgabe: out`
        255
        0
        1
      `,
      erklaerung: md`\`uint8_t\` reicht bis 255. Danach beginnt die Zählung wieder bei 0.`,
    },
    {
      id: 'k02-l02-u3',
      typ: 'fehlersuche',
      titel: 'Impulse nach einer Stunde',
      stufe: 2,
      themen: ['datentypen'],
      aufgabe: md`
        Ein Encoder liefert 2000 Impulse pro Umdrehung, der Motor dreht 3000 Umdrehungen pro Minute. Das Programm soll die Impulse nach 60 Minuten ausgeben:

        ~~~text
        Impulse nach 1 h: 360000000
        ~~~

        Es gibt aber einen falschen Wert aus, weil die Variable zu klein ist. Wähle einen passenden Typ aus \`<stdint.h>\` und den passenden Platzhalter.
      `,
      start: c`
        #include <stdio.h>
        #include <stdint.h>

        int main(void) {
            uint16_t pro_minute = 3000;
            uint16_t impulse = 2000 * pro_minute;
            impulse = impulse * 60;
            printf("Impulse nach 1 h: %d\n", impulse);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdint.h>

        int main(void) {
            uint32_t pro_minute = 3000;
            uint32_t impulse = 2000 * pro_minute;
            impulse = impulse * 60;
            printf("Impulse nach 1 h: %u\n", impulse);
            return 0;
        }
      `,
      tests: [{ name: 'Richtige Anzahl Impulse', erwartet: { stdout: 'Impulse nach 1 h: 360000000\n' }, tipp: md`360 Millionen passen nicht in 16 Bit (höchstens 65 535).` }],
      hinweise: [md`Wie gross darf ein \`uint16_t\` höchstens werden? Und wie gross ist das Ergebnis?`, md`\`uint32_t\` reicht bis etwa 4,29 Milliarden. Ausgabe mit \`%u\`.`],
    },
    {
      id: 'k02-l02-u4',
      typ: 'programm',
      titel: 'Speicherbedarf',
      stufe: 3,
      themen: ['datentypen'],
      aufgabe: md`
        Ein Datenlogger speichert pro Messung einen \`int16_t\`-Wert (Temperatur in Zehntelgrad) und einen \`uint32_t\`-Zeitstempel. Berechne mit \`sizeof\`, wie viele Byte **eine** Messung und wie viele **1000** Messungen belegen, und gib aus:

        ~~~text
        Pro Messung: 6 Byte
        1000 Messungen: 6000 Byte
        ~~~
      `,
      start: c`
        #include <stdio.h>
        #include <stdint.h>

        int main(void) {

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdint.h>

        int main(void) {
            size_t pro_messung = sizeof(int16_t) + sizeof(uint32_t);
            printf("Pro Messung: %zu Byte\n", pro_messung);
            printf("1000 Messungen: %zu Byte\n", 1000 * pro_messung);
            return 0;
        }
      `,
      tests: [{ name: 'Speicherbedarf stimmt', erwartet: { stdout: 'Pro Messung: 6 Byte\n1000 Messungen: 6000 Byte\n' } }],
      regeln: [{ muss: 'sizeof', meldung: 'Berechne die Grössen mit `sizeof`.' }],
      hinweise: [md`\`sizeof(int16_t)\` ist 2, \`sizeof(uint32_t)\` ist 4.`, md`Das Ergebnis von \`sizeof\` hat den Typ \`size_t\` und wird mit \`%zu\` ausgegeben.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k02-l02-c1',
      typ: 'eingabe',
      themen: ['datentypen'],
      frage: 'Welches ist der grösste Wert, den ein `uint8_t` speichern kann?',
      antworten: ['255'],
    },
    {
      id: 'k02-l02-c2',
      typ: 'wahrfalsch',
      themen: ['datentypen', 'mikrocontroller'],
      aussage: '`int` ist auf jedem System genau 4 Byte gross.',
      richtig: false,
      erklaerung: 'Der Standard garantiert nur mindestens 2 Byte. Auf AVR-Mikrocontrollern ist `int` 2 Byte gross.',
    },
    {
      id: 'k02-l02-c3',
      typ: 'auswahl',
      themen: ['datentypen', 'format'],
      frage: 'Mit welchem Platzhalter gibst du einen `long long` aus?',
      optionen: [{ text: '`%lld`', richtig: true }, { text: '`%d`' }, { text: '`%ll`', warum: 'Es fehlt der Buchstabe für die Art: `d`.' }],
    },
  ],
  zusammenfassung: [
    'Ganzzahltypen: `short`, `int`, `long`, `long long`, jeweils auch `unsigned`.',
    'Die Grössen hängen vom System ab; `sizeof` und `<limits.h>` liefern die echten Werte.',
    'Für feste Grössen: `int8_t` … `uint64_t` aus `<stdint.h>`. Standard bei Mikrocontrollern.',
    '`unsigned`-Typen beginnen nach dem Maximum wieder bei 0, `signed`-Überlauf ist undefiniert.',
    'Platzhalter: `%d` (int), `%u` (unsigned), `%lld` (long long), `%zu` (size_t).',
  ],
  referenz: ['int', 'unsigned', 'long', 'sizeof', 'stdint', 'int-max'],
};
