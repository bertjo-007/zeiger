import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k09-l03',
  titel: 'Zeiger als Parameter',
  dauer: 25,
  stichwoerter: ['call by reference', 'Referenzübergabe', 'Ausgabeparameter', 'tauschen', 'swap', 'const', 'Zeigerparameter'],
  lernziele: [
    'mit Zeigerparametern Variablen des Aufrufers ändern',
    'mehrere Ergebnisse über Ausgabeparameter zurückgeben',
    'mit `const` zeigen, dass eine Funktion nur liest',
  ],
  erklaerung: md`
    In Kapitel 7 hast du gesehen: Funktionen bekommen **Kopien** ihrer Argumente. Eine Funktion \`void tauschen(int a, int b)\` vertauscht nur ihre eigenen Kopien, beim Aufrufer ändert sich nichts.

    Übergibt man stattdessen die **Adressen**, kann die Funktion über die Zeiger die Originale ändern:

    ~~~c
    void tauschen(int *a, int *b) {
        int tmp = *a;
        *a = *b;
        *b = tmp;
    }

    tauschen(&links, &rechts);
    ~~~

    Kopiert werden jetzt die Adressen, aber sie zeigen auf dieselben Variablen. Das nennt man oft *call by reference*, auch wenn C streng genommen nur Werte übergibt (eben Adresswerte).

    ### Mehrere Ergebnisse

    \`return\` liefert nur einen Wert. Braucht man mehrere Ergebnisse, übergibt man Zeiger auf die Zielvariablen, sogenannte **Ausgabeparameter**. Ein verbreitetes Muster: Der Rückgabewert meldet Erfolg oder Fehler, das eigentliche Ergebnis kommt über einen Zeiger. \`scanf\` arbeitet genau so.

    ~~~c
    int teile(int a, int b, int *ergebnis);   // 1 = ok, 0 = Division durch 0
    ~~~

    ### Nur lesen: const

    \`const int *p\` heisst: Über \`p\` darf der Wert **nicht** verändert werden. Bei Parametern ist das ein Versprechen an den Aufrufer: «Ich lese nur.» Der Compiler meldet einen Fehler, wenn die Funktion es trotzdem versucht. Du kennst das schon von \`const char *\` bei Texten.
  `,
  syntax: [
    {
      code: c`
        void aendern(int *ziel);          // darf *ziel ändern
        void lesen(const int *quelle);    // darf *quelle nur lesen
        aendern(&variable);               // Aufruf mit Adresse
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      void tauschen(int *a, int *b) {
          int tmp = *a;
          *a = *b;
          *b = tmp;
      }

      void zerlegen(int sekunden, int *min, int *sek) {
          *min = sekunden / 60;
          *sek = sekunden % 60;
      }

      int main(void) {
          int links = 3, rechts = 7;
          tauschen(&links, &rechts);
          printf("links = %d, rechts = %d\n", links, rechts);

          int m, s;
          zerlegen(135, &m, &s);
          printf("Laufzeit: %d min %d s\n", m, s);
          return 0;
      }
    `,
    ausgabe: out`
      links = 7, rechts = 3
      Laufzeit: 2 min 15 s
    `,
  },
  zeilen: [
    { zeilen: '3', text: md`Die Parameter sind Zeiger: Die Funktion bekommt Adressen.` },
    { zeilen: '4-6', text: md`Über \`*a\` und \`*b\` werden die Variablen des Aufrufers getauscht. \`tmp\` hält einen Wert kurz fest.` },
    { zeilen: '9-11', text: md`Zwei Ergebnisse auf einmal: Minuten und Sekunden landen über die Zeiger beim Aufrufer.` },
    { zeilen: '16', text: md`Aufruf mit \`&\`: Die Funktion erhält die Adressen von \`links\` und \`rechts\`.` },
    { zeilen: '19-20', text: md`\`m\` und \`s\` brauchen keinen Startwert, \`zerlegen\` füllt sie.` },
  ],
  ergebnis: md`
    Die beiden Werte sind tatsächlich getauscht, und \`zerlegen\` hat zwei Ergebnisse auf einmal geliefert: 135 s sind 2 min und 15 s.
  `,
  fehler: [
    {
      titel: 'Wert statt Adresse übergeben',
      text: md`Erwartet die Funktion \`int *\`, muss der Aufruf eine Adresse liefern. Clang meldet sonst «incompatible integer to pointer conversion».`,
      falsch: c`tauschen(links, rechts);`,
      richtig: c`tauschen(&links, &rechts);`,
    },
    {
      titel: 'Den Zeiger statt des Werts ändern',
      text: md`Innerhalb der Funktion ändert \`a = b;\` nur die lokale Zeigerkopie. Gemeint ist \`*a = *b;\`.`,
    },
    {
      titel: 'Auf const schreiben',
      text: md`Bei \`const int *p\` ist \`*p = 0;\` ein Compilerfehler («read-only variable is not assignable»). Entweder das \`const\` war richtig und die Funktion soll nicht schreiben, oder der Parameter braucht kein \`const\`.`,
    },
  ],
  uebungen: [
    {
      id: 'k09-l03-u1',
      typ: 'fehlersuche',
      titel: 'Tauschen, das nicht tauscht',
      stufe: 1,
      themen: ['zeiger', 'funktionen'],
      aufgabe: md`
        Das Programm soll \`7 3\` ausgeben, gibt aber \`3 7\` aus. Repariere \`tauschen\` und den Aufruf.
      `,
      start: c`
        #include <stdio.h>

        void tauschen(int a, int b) {
            int tmp = a;
            a = b;
            b = tmp;
        }

        int main(void) {
            int x = 3, y = 7;
            tauschen(x, y);
            printf("%d %d\n", x, y);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        void tauschen(int *a, int *b) {
            int tmp = *a;
            *a = *b;
            *b = tmp;
        }

        int main(void) {
            int x = 3, y = 7;
            tauschen(&x, &y);
            printf("%d %d\n", x, y);
            return 0;
        }
      `,
      tests: [{ name: 'Ausgabe', erwartet: { stdout: '7 3\n' } }],
      hinweise: [md`Die Funktion braucht Zeigerparameter: \`int *a, int *b\`.`, md`Im Rumpf mit \`*a\` und \`*b\` arbeiten, beim Aufruf \`&x\` und \`&y\` übergeben.`],
    },
    {
      id: 'k09-l03-u2',
      typ: 'programm',
      titel: 'Wert begrenzen',
      stufe: 2,
      themen: ['zeiger', 'funktionen', 'bedingungen'],
      aufgabe: md`
        Schreibe \`void begrenzen(int *wert, int min, int max)\`. Liegt \`*wert\` unter \`min\`, wird er auf \`min\` gesetzt, liegt er über \`max\`, auf \`max\`. Sonst bleibt er unverändert.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int pwm = 300;
            begrenzen(&pwm, 0, 255);
            printf("%d\n", pwm);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        void begrenzen(int *wert, int min, int max) {
            if (*wert < min) {
                *wert = min;
            } else if (*wert > max) {
                *wert = max;
            }
        }

        int main(void) {
            int pwm = 300;
            begrenzen(&pwm, 0, 255);
            printf("%d\n", pwm);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        void begrenzen(int *wert, int min, int max);
        int main(void) {
            int a = 300, b = -20, c = 128;
            begrenzen(&a, 0, 255);
            begrenzen(&b, 0, 255);
            begrenzen(&c, 0, 255);
            printf("%d %d %d\n", a, b, c);
            return 0;
        }
      `,
      tests: [{ name: 'Zu gross, zu klein, passend', erwartet: { stdout: '255 0 128\n' } }],
      hinweise: [md`Vergleiche \`*wert\` mit \`min\` und \`max\` und weise \`*wert\` neu zu.`],
    },
    {
      id: 'k09-l03-u3',
      typ: 'programm',
      titel: 'Sicher teilen',
      stufe: 3,
      themen: ['zeiger', 'funktionen', 'fehler'],
      aufgabe: md`
        Schreibe \`int teilen(int a, int b, int *quotient, int *rest)\`. Ist \`b\` gleich 0, gibt sie 0 zurück und lässt \`*quotient\` und \`*rest\` unverändert. Sonst schreibt sie Quotient und Rest über die Zeiger und gibt 1 zurück.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int q = -1, r = -1;
            int ok = teilen(17, 5, &q, &r);
            printf("%d: %d Rest %d\n", ok, q, r);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int teilen(int a, int b, int *quotient, int *rest) {
            if (b == 0) {
                return 0;
            }
            *quotient = a / b;
            *rest = a % b;
            return 1;
        }

        int main(void) {
            int q = -1, r = -1;
            int ok = teilen(17, 5, &q, &r);
            printf("%d: %d Rest %d\n", ok, q, r);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        int teilen(int a, int b, int *quotient, int *rest);
        int main(void) {
            int q = -1, r = -1;
            int ok1 = teilen(17, 5, &q, &r);
            printf("%d %d %d\n", ok1, q, r);
            q = -1;
            r = -1;
            int ok2 = teilen(9, 0, &q, &r);
            printf("%d %d %d\n", ok2, q, r);
            return 0;
        }
      `,
      tests: [{ name: '17/5 und 9/0', erwartet: { stdout: '1 3 2\n0 -1 -1\n' }, tipp: md`Bei \`b == 0\` sofort mit \`return 0;\` aussteigen, bevor geteilt wird.` }],
      hinweise: [md`Zuerst \`if (b == 0) return 0;\`, dann \`*quotient = a / b;\` und \`*rest = a % b;\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k09-l03-c1',
      typ: 'auswahl',
      themen: ['zeiger', 'funktionen'],
      frage: 'Wie ruft man `void nullsetzen(int *x)` für die Variable `zaehler` auf?',
      optionen: [{ text: '`nullsetzen(&zaehler);`', richtig: true }, { text: '`nullsetzen(zaehler);`' }, { text: '`nullsetzen(*zaehler);`' }],
    },
    {
      id: 'k09-l03-c2',
      typ: 'wahrfalsch',
      themen: ['zeiger'],
      aussage: 'Bei einem Parameter `const int *p` meldet der Compiler einen Fehler, wenn die Funktion `*p = 0;` schreibt.',
      richtig: true,
    },
    {
      id: 'k09-l03-c3',
      typ: 'auswahl',
      themen: ['zeiger', 'funktionen'],
      frage: 'Warum braucht `scanf` Adressen als Argumente?',
      optionen: [{ text: 'Es liefert die gelesenen Werte über Ausgabeparameter; der Rückgabewert ist die Anzahl gelesener Werte.', richtig: true }, { text: 'Weil `scanf` keine Werte kopieren kann.' }, { text: 'Weil Adressen schneller sind.' }],
    },
  ],
  zusammenfassung: [
    'Mit Zeigerparametern ändert eine Funktion Variablen des Aufrufers.',
    'Aufruf mit `&`, im Rumpf Zugriff mit `*`.',
    'Ausgabeparameter liefern mehrere Ergebnisse; der Rückgabewert meldet oft Erfolg.',
    '`const typ *` heisst: nur lesen.',
  ],
  referenz: ['zeiger', 'const', 'funktion'],
};
