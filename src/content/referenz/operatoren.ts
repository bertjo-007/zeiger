import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'sizeof',
    name: 'sizeof',
    kategorie: 'operator',
    kurz: md`Liefert die Grösse eines Typs oder einer Variable in Byte. Ergebnis vom Typ \`size_t\`, ausgegeben mit \`%zu\`. \`sizeof\` ist ein Schlüsselwort und ein Operator, keine Funktion.`,
    syntax: c`
      sizeof(typ)
      sizeof variable
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            double werte[10];
            printf("%zu %zu\n", sizeof(double), sizeof werte);
            return 0;
        }
      `,
      ausgabe: out`
        8 80
      `,
    },
    fehler: [md`Bei einem Array-Parameter in einer Funktion liefert \`sizeof\` die Grösse eines Zeigers, nicht des Arrays.`, md`\`%d\` statt \`%zu\` für das Ergebnis.`],
    lektionen: ['k02-l02'],
    stichwoerter: ['Grösse', 'Byte', 'size_t'],
  },
  {
    id: 'cast',
    name: '(typ) Cast',
    kategorie: 'operator',
    kurz: md`Wandelt einen Wert ausdrücklich in einen anderen Typ um. Häufigster Einsatz: \`(double)\` vor einer Ganzzahldivision.`,
    syntax: c`(zieltyp) ausdruck`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int summe = 17, n = 4;
            printf("%.2f\n", (double)summe / n);
            printf("%d\n", (int)3.99);
            return 0;
        }
      `,
      ausgabe: out`
        4.25
        3
      `,
    },
    fehler: [md`Cast um das Ergebnis statt an einen Operanden: \`(double)(a / b)\` ist schon ganzzahlig geteilt.`, md`\`(int)\` schneidet ab, statt zu runden.`],
    lektionen: ['k02-l08'],
    stichwoerter: ['Typumwandlung', 'umwandeln', 'casten'],
  },
  {
    id: 'op-arithmetik',
    name: '+ - * /',
    kategorie: 'operator',
    kurz: md`Grundrechenarten. Bei zwei ganzen Zahlen ist \`/\` eine Ganzzahldivision: Der Rest fällt weg.`,
    syntax: c`a + b    a - b    a * b    a / b    -a`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("%d %d %.2f\n", 7 / 2, -7 / 2, 7.0 / 2);
            return 0;
        }
      `,
      ausgabe: out`
        3 -3 3.50
      `,
    },
    fehler: [md`Ganzzahldivision, wo eine Kommazahl gemeint war.`, md`Division durch 0 bei ganzen Zahlen ist undefiniert.`],
    lektionen: ['k04-l01'],
    stichwoerter: ['plus', 'minus', 'mal', 'geteilt', 'Division', 'rechnen'],
  },
  {
    id: 'op-modulo',
    name: '%',
    kategorie: 'operator',
    kurz: md`Rest der ganzzahligen Division. Für gerade/ungerade, Zeitumrechnung, Ziffern und Zählen im Kreis.`,
    syntax: c`a % b`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int sekunden = 3725;
            printf("%d min %d s\n", sekunden / 60, sekunden % 60);
            printf("Platz nach 7: %d\n", (7 + 1) % 8);
            return 0;
        }
      `,
      ausgabe: out`
        62 min 5 s
        Platz nach 7: 0
      `,
    },
    fehler: [md`Nur für ganze Zahlen; für Kommazahlen \`fmod\`.`, md`Das Vorzeichen des Ergebnisses folgt dem linken Wert: \`-7 % 3\` ist −1.`],
    lektionen: ['k04-l01'],
    stichwoerter: ['Modulo', 'Rest', 'gerade', 'ungerade'],
  },
  {
    id: 'op-zuweisung',
    name: '= += -= *= /= %=',
    kategorie: 'operator',
    kurz: md`Zuweisung und zusammengesetzte Zuweisung: \`x += a\` heisst \`x = x + a\`.`,
    syntax: c`x = wert;    x += a;    x -= a;    x *= a;    x /= a;    x %= a;`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            double summe = 0.0;
            summe += 2.5;
            summe += 4.0;
            summe *= 2;
            printf("%.1f\n", summe);
            return 0;
        }
      `,
      ausgabe: out`
        13.0
      `,
    },
    fehler: [md`\`=+\` statt \`+=\`: \`x =+ 5\` setzt x auf 5.`, md`\`=\` statt \`==\` in Bedingungen.`],
    lektionen: ['k04-l02'],
    stichwoerter: ['Zuweisung', 'addieren', 'aufsummieren'],
  },
  {
    id: 'op-inkrement',
    name: '++ --',
    kategorie: 'operator',
    kurz: md`Erhöhen bzw. verringern um 1. \`x++\` liefert den alten Wert, \`++x\` den neuen.`,
    syntax: c`x++;    ++x;    x--;    --x;`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int zaehler = 5;
            int alt = zaehler++;
            int neu = ++zaehler;
            printf("%d %d %d\n", alt, neu, zaehler);
            return 0;
        }
      `,
      ausgabe: out`
        5 7 7
      `,
    },
    fehler: [md`Dieselbe Variable mehrfach in einer Anweisung ändern (\`i = i++\`) ist undefiniert.`],
    lektionen: ['k04-l02'],
    stichwoerter: ['Inkrement', 'Dekrement', 'hochzählen', 'runterzählen'],
  },
  {
    id: 'op-vergleich',
    name: '== != < > <= >=',
    kategorie: 'operator',
    kurz: md`Vergleichsoperatoren. Ergebnis ist 1 (wahr) oder 0 (falsch).`,
    syntax: c`a == b    a != b    a < b    a > b    a <= b    a >= b`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int drehzahl = 1450;
            printf("%d %d\n", drehzahl > 1400, drehzahl == 1500);
            return 0;
        }
      `,
      ausgabe: out`
        1 0
      `,
    },
    fehler: [md`\`=\` statt \`==\`.`, md`Ketten wie \`0 < x < 10\` funktionieren nicht; mit \`&&\` verbinden.`, md`Kommazahlen nicht mit \`==\` vergleichen.`],
    lektionen: ['k04-l03'],
    stichwoerter: ['gleich', 'ungleich', 'kleiner', 'grösser', 'vergleichen'],
  },
  {
    id: 'op-logik',
    name: '&& || !',
    kategorie: 'operator',
    kurz: md`Logisches UND, ODER und NICHT. \`&&\` und \`||\` werten mit Kurzschluss aus: Die rechte Seite wird nur berechnet, wenn sie das Ergebnis noch ändern kann.`,
    syntax: c`a && b    a || b    !a`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int tuer_zu = 1, not_aus = 0, automatik = 1;
            printf("Freigabe: %d\n", tuer_zu && !not_aus && automatik);
            return 0;
        }
      `,
      ausgabe: out`
        Freigabe: 1
      `,
    },
    fehler: [md`\`&\` und \`|\` (Bitoperatoren) statt \`&&\` und \`||\`.`, md`Gemischtes \`&&\` und \`||\` ohne Klammern: «und» bindet stärker.`],
    lektionen: ['k04-l04'],
    stichwoerter: ['und', 'oder', 'nicht', 'logisch', 'Kurzschluss'],
  },
  {
    id: 'rangfolge',
    name: 'Rangfolge der Operatoren',
    kategorie: 'operator',
    kurz: md`
      Von stark nach schwach: \`()\` \`[]\` \`->\` \`x++\` · \`!\` \`~\` \`-x\` \`*p\` \`&x\` \`(typ)\` \`sizeof\` · \`*\` \`/\` \`%\` · \`+\` \`-\` · \`<<\` \`>>\` · \`<\` \`<=\` \`>\` \`>=\` · \`==\` \`!=\` · \`&\` · \`^\` · \`|\` · \`&&\` · \`||\` · \`?:\` · \`=\` \`+=\` … · \`,\`
    `,
    syntax: c`
      a + b * c        // a + (b * c)
      a < b == c < d   // (a < b) == (c < d)
      x & 1 == 0       // x & (1 == 0)  Vorsicht!
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("%d %d\n", 2 + 3 * 4, (2 + 3) * 4);
            return 0;
        }
      `,
      ausgabe: out`
        14 20
      `,
    },
    fehler: [md`Bitoperatoren binden schwächer als Vergleiche: \`(x & 1) == 0\` braucht Klammern.`, md`Im Zweifel klammern.`],
    lektionen: ['k04-l05'],
    stichwoerter: ['Priorität', 'Präzedenz', 'Punkt vor Strich', 'Klammern'],
  },
];
