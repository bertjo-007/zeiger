import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k07-l05',
  titel: 'Werte an Funktionen übergeben',
  dauer: 20,
  stichwoerter: ['Wertübergabe', 'call by value', 'Kopie', 'Parameter ändern', 'Seiteneffekt', 'reine Funktion'],
  lernziele: [
    'erklären, dass C Argumente als Kopie übergibt',
    'vorhersagen, ob eine Änderung in der Funktion beim Aufrufer ankommt',
    'Ergebnisse über den Rückgabewert statt über Parameter zurückliefern',
  ],
  erklaerung: md`
    Was passiert, wenn eine Funktion einen Parameter verändert?

    ~~~c
    void verdopple(int x) {
        x = x * 2;
    }

    int main(void) {
        int wert = 5;
        verdopple(wert);
        printf("%d\n", wert);   // 5, nicht 10!
    }
    ~~~

    In C werden Argumente **als Wert** übergeben (englisch call by value): Beim Aufruf wird der **Wert** von \`wert\` in den Parameter \`x\` **kopiert**. \`x\` ist eine eigene, lokale Variable der Funktion. Ändert die Funktion \`x\`, bleibt \`wert\` in \`main\` unberührt.

    Das ist ein **Schutz**: Eine Funktion kann die Variablen des Aufrufers nicht aus Versehen verändern. Man sieht einem Aufruf \`f(a, b)\` an, dass \`a\` und \`b\` danach unverändert sind.

    ### Ergebnis zurückgeben

    Soll die Funktion etwas verändern, gibt sie das neue Ergebnis zurück, und der Aufrufer weist es zu:

    ~~~c
    int verdopple(int x) {
        return x * 2;
    }
    wert = verdopple(wert);   // jetzt 10
    ~~~

    ### Und wenn es mehrere Ergebnisse sind?

    \`return\` liefert nur **einen** Wert. Soll eine Funktion zum Beispiel Minimum **und** Maximum liefern oder zwei Variablen tauschen, braucht es einen anderen Weg: Man übergibt die **Adressen** der Variablen. So funktioniert auch \`scanf\` mit seinem \`&\`. Das ist das Thema von Kapitel 9 (Pointer als Parameter).

    > [!info] Arrays sind eine Ausnahme
    > Arrays werden nicht kopiert. Eine Funktion bekommt die Adresse des Arrays und kann seine Elemente verändern. Mehr dazu in Kapitel 8.
  `,
  syntax: [
    {
      code: c`
        int neu = funktion(alt);    // Ergebnis über return zurück
        alt = funktion(alt);        // alten Wert ersetzen
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      void begrenze_falsch(int pwm) {
          if (pwm > 255) {
              pwm = 255;          // ändert nur die Kopie
          }
      }

      int begrenze(int pwm) {
          if (pwm > 255) {
              return 255;
          }
          return pwm;
      }

      int main(void) {
          int pwm = 300;

          begrenze_falsch(pwm);
          printf("Nach begrenze_falsch: %d\n", pwm);

          pwm = begrenze(pwm);
          printf("Nach begrenze: %d\n", pwm);
          return 0;
      }
    `,
    ausgabe: out`
      Nach begrenze_falsch: 300
      Nach begrenze: 255
    `,
  },
  zeilen: [
    { zeilen: '3-7', text: md`Die Funktion ändert ihren Parameter. Das ist nur eine Kopie; der Aufrufer merkt nichts davon.` },
    { zeilen: '9-14', text: md`Richtig: Das Ergebnis wird zurückgegeben.` },
    { zeilen: '19-20', text: md`\`pwm\` in \`main\` ist nach dem Aufruf unverändert 300.` },
    { zeilen: '22', text: md`Erst die Zuweisung des Rückgabewerts ändert \`pwm\`.` },
  ],
  ergebnis: md`
    Die erste Funktion bewirkt nichts Sichtbares, die zweite begrenzt den Wert korrekt. Merke: Ein Parameter ist immer eine Kopie.
  `,
  fehler: [
    {
      titel: 'Erwarten, dass der Parameter sich draussen ändert',
      text: md`Eine \`void\`-Funktion, die nur ihre Parameter ändert, hat für den Aufrufer keine Wirkung.`,
    },
    {
      titel: 'Rückgabewert nicht zugewiesen',
      text: md`\`begrenze(pwm);\` berechnet das Ergebnis und wirft es weg. Richtig ist \`pwm = begrenze(pwm);\`.`,
      falsch: c`begrenze(pwm);`,
      richtig: c`pwm = begrenze(pwm);`,
    },
  ],
  uebungen: [
    {
      id: 'k07-l05-u1',
      typ: 'vorhersage',
      titel: 'Kopie oder Original?',
      stufe: 1,
      themen: ['funktionen'],
      code: c`
        #include <stdio.h>

        int erhoehe(int n) {
            n = n + 10;
            return n;
        }

        int main(void) {
            int a = 5;
            int b = erhoehe(a);
            erhoehe(a);
            printf("%d %d\n", a, b);
            return 0;
        }
      `,
      ausgabe: out`
        5 15
      `,
    },
    {
      id: 'k07-l05-u2',
      typ: 'fehlersuche',
      titel: 'Sollwert wird nicht übernommen',
      stufe: 2,
      themen: ['funktionen'],
      aufgabe: md`
        \`runde_auf_zehner\` soll eine Zahl auf den nächsten Zehner runden (z. B. 1234 → 1230, 1236 → 1240). Das Programm gibt aber den unveränderten Wert aus. Baue die Funktion so um, dass sie das Ergebnis zurückgibt, und verwende es in \`main\`.
      `,
      start: c`
        #include <stdio.h>

        void runde_auf_zehner(int x) {
            x = (x + 5) / 10 * 10;
        }

        int main(void) {
            int soll = 0;
            scanf("%d", &soll);
            runde_auf_zehner(soll);
            printf("%d\n", soll);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int runde_auf_zehner(int x) {
            return (x + 5) / 10 * 10;
        }

        int main(void) {
            int soll = 0;
            scanf("%d", &soll);
            soll = runde_auf_zehner(soll);
            printf("%d\n", soll);
            return 0;
        }
      `,
      tests: [
        { name: '1234', stdin: '1234\n', erwartet: { stdout: '1230\n' } },
        { name: '1236', stdin: '1236\n', erwartet: { stdout: '1240\n' } },
      ],
      hinweise: [md`Rückgabetyp \`int\`, im Rumpf \`return\`.`, md`In \`main\`: \`soll = runde_auf_zehner(soll);\``],
    },
    {
      id: 'k07-l05-u3',
      typ: 'programm',
      titel: 'Mit Kopien rechnen',
      stufe: 2,
      themen: ['funktionen', 'schleifen'],
      aufgabe: md`
        Schreibe \`int quersumme(int n)\` für positive Zahlen. Die Funktion darf ihren Parameter \`n\` in einer Schleife verändern (es ist ja eine Kopie). Sie gibt nichts aus.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int zahl = 4711;
            printf("%d hat Quersumme %d\n", zahl, quersumme(zahl));
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int quersumme(int n) {
            int summe = 0;
            while (n > 0) {
                summe += n % 10;
                n /= 10;
            }
            return summe;
        }

        int main(void) {
            int zahl = 4711;
            printf("%d hat Quersumme %d\n", zahl, quersumme(zahl));
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        int quersumme(int n);
        int main(void) {
            int z = 4711;
            int q = quersumme(z);
            printf("%d %d %d %d\n", q, z, quersumme(9), quersumme(1000));
            return 0;
        }
      `,
      tests: [{ name: 'quersumme(4711), quersumme(9), quersumme(1000)', erwartet: { stdout: '13 4711 9 1\n' } }],
      hinweise: [md`\`n % 10\` liefert die letzte Ziffer, \`n /= 10\` schneidet sie ab.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k07-l05-c1',
      typ: 'wahrfalsch',
      themen: ['funktionen'],
      aussage: 'Ändert eine Funktion ihren `int`-Parameter, ändert sich auch die Variable des Aufrufers.',
      richtig: false,
      erklaerung: 'Der Parameter ist eine Kopie (call by value).',
    },
    {
      id: 'k07-l05-c2',
      typ: 'auswahl',
      themen: ['funktionen'],
      frage: 'Wie liefert eine Funktion ein verändertes Ergebnis am einfachsten zurück?',
      optionen: [{ text: 'Über `return`, und der Aufrufer weist es zu', richtig: true }, { text: 'Indem sie den Parameter ändert' }, { text: 'Gar nicht' }],
    },
    {
      id: 'k07-l05-c3',
      typ: 'eingabe',
      themen: ['funktionen', 'zeiger'],
      frage: 'Welches Zeichen steht bei `scanf` vor der Variable, damit die Funktion in sie schreiben kann?',
      antworten: ['&'],
      exakt: true,
    },
  ],
  zusammenfassung: [
    'C übergibt Argumente als Kopie: Parameter sind eigene lokale Variablen.',
    'Änderungen an Parametern kommen beim Aufrufer nicht an.',
    'Ergebnisse über `return` zurückgeben und beim Aufrufer zuweisen.',
    'Für mehrere Ergebnisse übergibt man Adressen (Kapitel 9); Arrays werden nicht kopiert (Kapitel 8).',
  ],
  referenz: ['funktion'],
};
