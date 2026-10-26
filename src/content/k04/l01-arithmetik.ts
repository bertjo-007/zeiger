import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k04-l01',
  titel: 'Arithmetische Operatoren',
  dauer: 25,
  stichwoerter: ['Operator', '+', '-', '*', '/', '%', 'Modulo', 'Rest', 'Ganzzahldivision', 'Division durch 0', 'Grundrechenarten'],
  lernziele: [
    'mit den Operatoren `+`, `-`, `*`, `/` und `%` rechnen',
    'Ganzzahldivision und Modulo gezielt einsetzen, etwa um Zeiten oder Mengen aufzuteilen',
    'die Gefahr einer Division durch 0 erkennen',
  ],
  erklaerung: md`
    C kennt die vier Grundrechenarten und einen fünften, sehr nützlichen Operator:

    | Operator | Bedeutung | Beispiel | Ergebnis |
    |---|---|---|---|
    | \`+\` | Addition | \`7 + 3\` | 10 |
    | \`-\` | Subtraktion (oder Vorzeichen) | \`7 - 3\` | 4 |
    | \`*\` | Multiplikation | \`7 * 3\` | 21 |
    | \`/\` | Division | \`7 / 3\` | 2 (bei \`int\`) |
    | \`%\` | Rest der Division (Modulo) | \`7 % 3\` | 1 |

    ### Ganzzahldivision und Rest

    Sind beide Werte ganze Zahlen, liefert \`/\` den **ganzzahligen Anteil**, der Rest fällt weg. Genau diesen Rest liefert \`%\`. Zusammen beantworten sie Fragen wie «wie viele volle Kartons, und wie viele Teile bleiben übrig?»:

    ~~~c
    int teile = 250, pro_karton = 24;
    int kartons = teile / pro_karton;   // 10
    int rest = teile % pro_karton;      // 10
    ~~~

    Weitere typische Anwendungen von \`%\`:

    - **Gerade oder ungerade:** \`n % 2\` ist 0 bei geraden Zahlen.
    - **Zeit zerlegen:** 3725 Sekunden sind \`3725 / 3600\` Stunden, \`3725 % 3600 / 60\` Minuten und \`3725 % 60\` Sekunden.
    - **Letzte Ziffer:** \`n % 10\`, und \`n / 10\` schneidet sie ab.
    - **Im Kreis zählen:** \`(position + 1) % 8\` zählt 0, 1, … 7, 0, 1, … (z. B. 8 Plätze eines Drehtellers).

    \`%\` gibt es nur für ganze Zahlen. Für Kommazahlen gibt es die Funktion \`fmod\` aus \`<math.h>\`. Bei negativen Zahlen hat das Ergebnis von \`%\` das Vorzeichen des linken Werts: \`-7 % 3\` ist −1.

    ### Division durch 0

    Eine **ganzzahlige** Division (oder \`%\`) durch 0 ist in C **nicht definiert**. Auf dem PC stürzt das Programm meist ab, Zeiger meldet einen Laufzeitfehler. Kommt der Teiler aus einer Eingabe oder Messung, wird er vorher geprüft.

    Bei **Kommazahlen** stürzt nichts ab, das Ergebnis ist dann «unendlich» (\`inf\`) oder «keine Zahl» (\`nan\`). Rechnet man damit weiter, pflanzt sich der Unsinn fort.

    > [!praxis] Zeiten auf dem Mikrocontroller
    > Ein Mikrocontroller zählt die Zeit meist in Millisekunden seit dem Start. Die Anzeige «01:02:05» entsteht genau mit \`/\` und \`%\` wie oben.
  `,
  syntax: [
    {
      code: c`
        summe = a + b;
        differenz = a - b;
        produkt = a * b;
        quotient = a / b;     // bei int: ganzzahlig
        rest = a % b;         // nur für ganze Zahlen
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int laufzeit_s = 3725;            // Betriebszeit einer Pumpe

          int stunden = laufzeit_s / 3600;
          int minuten = laufzeit_s % 3600 / 60;
          int sekunden = laufzeit_s % 60;
          printf("Laufzeit: %02d:%02d:%02d\n", stunden, minuten, sekunden);

          int teile = 250;
          int pro_karton = 24;
          printf("%d volle Kartons, %d Teile übrig\n", teile / pro_karton, teile % pro_karton);

          printf("17 ist %s\n", 17 % 2 == 0 ? "gerade" : "ungerade");
          return 0;
      }
    `,
    ausgabe: out`
      Laufzeit: 01:02:05
      10 volle Kartons, 10 Teile übrig
      17 ist ungerade
    `,
  },
  zeilen: [
    { zeilen: '6', text: md`3725 / 3600 ist ganzzahlig 1: eine volle Stunde.` },
    { zeilen: '7', text: md`Erst der Rest nach den vollen Stunden (125 s), dann davon die vollen Minuten: 2. \`%\` und \`/\` werden von links nach rechts ausgewertet.` },
    { zeilen: '8', text: md`Der Rest nach vollen Minuten: 5 Sekunden.` },
    { zeilen: '9', text: md`\`%02d\` füllt auf zwei Stellen mit Null auf, wie bei einer Digitaluhr.` },
    { zeilen: '13', text: md`Volle Kartons und Rest in einem \`printf\`.` },
    { zeilen: '15', text: md`\`17 % 2\` ist 1, also ungerade. Die Kurzform \`? :\` wählt zwischen zwei Texten; du lernst sie in Kapitel 5 genauer kennen.` },
  ],
  ergebnis: md`
    3725 Sekunden ergeben 1 Stunde, 2 Minuten und 5 Sekunden. Aus 250 Teilen werden 10 volle Kartons zu je 24 Teilen, 10 Teile bleiben übrig. Ändere die Laufzeit auf 86399 und prüfe, ob 23:59:59 herauskommt.
  `,
  fehler: [
    {
      titel: 'Ganzzahldivision unbeabsichtigt',
      text: md`\`3 / 4\` ist 0. Wer einen Anteil oder Prozentsatz berechnet, muss mit Kommazahlen rechnen: \`3.0 / 4\` oder \`(double)a / b\`.`,
      falsch: c`double anteil = treffer / versuche;`,
      richtig: c`double anteil = (double)treffer / versuche;`,
    },
    {
      titel: 'Division durch 0',
      text: md`Ein Teiler aus einer Eingabe kann 0 sein. Vor dem Teilen prüfen.`,
      falsch: c`int pro_stueck = gesamt / anzahl;`,
      richtig: c`
        if (anzahl != 0) {
            int pro_stueck = gesamt / anzahl;
        }
      `,
    },
    {
      titel: '% mit Kommazahlen',
      text: md`\`7.5 % 2\` ist ein Compilerfehler. Für Kommazahlen gibt es \`fmod(7.5, 2.0)\` aus \`<math.h>\`.`,
    },
  ],
  uebungen: [
    {
      id: 'k04-l01-u1',
      typ: 'vorhersage',
      titel: 'Teilen mit Rest',
      stufe: 1,
      themen: ['operatoren'],
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("%d %d\n", 17 / 5, 17 % 5);
            printf("%d %d\n", 20 / 4, 20 % 4);
            printf("%d %d\n", 3 / 8, 3 % 8);
            return 0;
        }
      `,
      ausgabe: out`
        3 2
        5 0
        0 3
      `,
      erklaerung: md`17 = 3 · 5 + 2. 20 geht ohne Rest auf. Ist der linke Wert kleiner als der rechte, ist der Quotient 0 und der Rest der Wert selbst.`,
    },
    {
      id: 'k04-l01-u2',
      typ: 'programm',
      titel: 'Millisekunden umrechnen',
      stufe: 2,
      themen: ['operatoren', 'eingabe'],
      aufgabe: md`
        Ein Mikrocontroller meldet seine Betriebszeit in Millisekunden. Lies diesen Wert als ganze Zahl ein und gib ihn als Minuten, Sekunden und Millisekunden aus. Bei 125430:

        ~~~text
        2 min 5 s 430 ms
        ~~~

        Keine Eingabeaufforderung.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int ms = 0;
            scanf("%d", &ms);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int ms = 0;
            scanf("%d", &ms);

            int minuten = ms / 60000;
            int sekunden = ms % 60000 / 1000;
            int rest_ms = ms % 1000;
            printf("%d min %d s %d ms\n", minuten, sekunden, rest_ms);
            return 0;
        }
      `,
      tests: [
        { name: '125430 ms', stdin: '125430\n', erwartet: { stdout: '2 min 5 s 430 ms\n' } },
        { name: '999 ms', stdin: '999\n', erwartet: { stdout: '0 min 0 s 999 ms\n' } },
        { name: 'Genau 1 Minute', stdin: '60000\n', erwartet: { stdout: '1 min 0 s 0 ms\n' } },
      ],
      hinweise: [md`Eine Minute hat 60000 ms, eine Sekunde 1000 ms.`, md`Sekunden: erst den Rest nach den vollen Minuten bilden, dann durch 1000 teilen.`],
    },
    {
      id: 'k04-l01-u3',
      typ: 'programm',
      titel: 'Quersumme',
      stufe: 3,
      themen: ['operatoren'],
      aufgabe: md`
        Lies eine dreistellige Zahl ein (100 bis 999) und gib ihre **Quersumme** aus, also die Summe der Ziffern. Verwende \`%\` und \`/\`. Bei 472:

        ~~~text
        Quersumme: 13
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int zahl = 0;
            scanf("%d", &zahl);

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int zahl = 0;
            scanf("%d", &zahl);

            int einer = zahl % 10;
            int zehner = zahl / 10 % 10;
            int hunderter = zahl / 100;
            printf("Quersumme: %d\n", einer + zehner + hunderter);
            return 0;
        }
      `,
      tests: [
        { name: '472', stdin: '472\n', erwartet: { stdout: 'Quersumme: 13\n' } },
        { name: '100', stdin: '100\n', erwartet: { stdout: 'Quersumme: 1\n' } },
        { name: '999', stdin: '999\n', erwartet: { stdout: 'Quersumme: 27\n' } },
      ],
      regeln: [{ muss: '%', meldung: 'Verwende den Modulo-Operator `%`, um die Ziffern zu bestimmen.' }],
      hinweise: [md`Die Einerstelle ist \`zahl % 10\`.`, md`Die Zehnerstelle: zuerst durch 10 teilen, dann wieder \`% 10\`.`],
    },
    {
      id: 'k04-l01-u4',
      typ: 'fehlersuche',
      titel: 'Durchschnittliche Taktzeit',
      stufe: 2,
      themen: ['operatoren', 'fehler'],
      aufgabe: md`
        Das Programm liest die Gesamtzeit in Sekunden und die Anzahl gefertigter Teile und gibt die durchschnittliche Taktzeit aus. Bei einer Eingabe von 0 Teilen stürzt es ab. Ergänze eine Prüfung: Ist die Anzahl 0, soll \`Keine Teile gefertigt\` erscheinen.

        Bei 600 und 8: \`Taktzeit: 75.0 s\`
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int zeit = 0, teile = 0;
            scanf("%d %d", &zeit, &teile);
            int takt = zeit / teile;
            printf("Taktzeit: %.1f s\n", (double)zeit / teile);
            (void)takt;
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int zeit = 0, teile = 0;
            scanf("%d %d", &zeit, &teile);
            if (teile == 0) {
                printf("Keine Teile gefertigt\n");
                return 0;
            }
            printf("Taktzeit: %.1f s\n", (double)zeit / teile);
            return 0;
        }
      `,
      tests: [
        { name: '600 s, 8 Teile', stdin: '600 8\n', erwartet: { stdout: 'Taktzeit: 75.0 s\n' } },
        { name: '0 Teile', stdin: '600 0\n', erwartet: { stdout: 'Keine Teile gefertigt\n' }, tipp: md`Vor dem Teilen prüfen: \`if (teile == 0) { … }\`.` },
      ],
      hinweise: [md`Die Zeile \`int takt = zeit / teile;\` ist überflüssig und gefährlich.`, md`Prüfe \`teile == 0\`, bevor geteilt wird.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k04-l01-c1',
      typ: 'eingabe',
      themen: ['operatoren'],
      frage: 'Welchen Wert hat `29 % 6`?',
      antworten: ['5'],
    },
    {
      id: 'k04-l01-c2',
      typ: 'auswahl',
      themen: ['operatoren'],
      frage: 'Wie prüfst du, ob eine ganze Zahl `n` gerade ist?',
      optionen: [{ text: '`n % 2 == 0`', richtig: true }, { text: '`n / 2 == 0`', warum: 'Das ist nur für 0 und 1 wahr.' }, { text: '`n % 2 == 1`', warum: 'Das prüft auf ungerade (bei positiven Zahlen).' }],
    },
    {
      id: 'k04-l01-c3',
      typ: 'wahrfalsch',
      themen: ['operatoren'],
      aussage: 'Eine ganzzahlige Division durch 0 liefert in C einfach den Wert 0.',
      richtig: false,
      erklaerung: 'Sie ist undefiniert; meist stürzt das Programm ab.',
    },
  ],
  zusammenfassung: [
    '`+ - * /` wie gewohnt; `/` mit zwei ganzen Zahlen schneidet den Rest ab.',
    '`%` liefert den Rest: nützlich für gerade/ungerade, Zeitumrechnung, Ziffern und Zählen im Kreis.',
    'Ganzzahlige Division durch 0 ist undefiniert: Teiler vorher prüfen.',
    'Für Anteile mit Kommazahlen rechnen: `(double)a / b`.',
  ],
  referenz: ['op-arithmetik', 'op-modulo'],
};
