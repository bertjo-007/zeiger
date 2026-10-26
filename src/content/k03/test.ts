import { c, md, out } from '../tags.ts';
import type { Aufgabe } from '../types.ts';

/** Fragenpool für den Kapiteltest 3. */
export const test: Aufgabe[] = [
  {
    id: 'k03-t01',
    typ: 'auswahl',
    themen: ['eingabe'],
    frage: 'Welche Zeile liest eine ganze Zahl korrekt in `int menge` ein?',
    optionen: [{ text: '`scanf("%d", &menge);`', richtig: true }, { text: '`scanf("%d", menge);`', warum: 'Ohne `&` bekommt scanf den Wert statt der Adresse.' }, { text: '`scanf(&menge, "%d");`', warum: 'Zuerst kommt der Formatstring, dann die Adresse.' }],
  },
  {
    id: 'k03-t02',
    typ: 'eingabe',
    themen: ['eingabe'],
    frage: 'Welche Formatangabe liest einen `double` mit `scanf` ein?',
    antworten: ['%lf'],
    exakt: true,
  },
  {
    id: 'k03-t03',
    typ: 'vorhersage',
    themen: ['eingabe'],
    frage: 'Eingabe: `12 8`. Was gibt das Programm aus?',
    code: c`
      #include <stdio.h>

      int main(void) {
          int a = 0, b = 0;
          scanf("%d %d", &a, &b);
          printf("%d\n", a * b);
          return 0;
      }
    `,
    stdin: '12 8\n',
    ausgabe: out`
      96
    `,
  },
  {
    id: 'k03-t04',
    typ: 'wahrfalsch',
    themen: ['eingabe'],
    aussage: 'Bei `scanf("%c", &z)` direkt nach `scanf("%d", &n)` wird oft der übrig gebliebene Zeilenumbruch gelesen.',
    richtig: true,
    erklaerung: '`%c` überspringt keinen Leerraum. Abhilfe: `" %c"`.',
  },
  {
    id: 'k03-t05',
    typ: 'vorhersage',
    themen: ['eingabe'],
    frage: 'Eingabe: `abc`. Was gibt das Programm aus?',
    code: c`
      #include <stdio.h>

      int main(void) {
          int x = 5;
          int r = scanf("%d", &x);
          printf("%d %d\n", r, x);
          return 0;
      }
    `,
    stdin: 'abc\n',
    ausgabe: out`
      0 5
    `,
  },
  {
    id: 'k03-t06',
    typ: 'auswahl',
    themen: ['eingabe', 'strings'],
    frage: 'Ein Array `char name[16]` soll ein Wort aufnehmen. Welche Zeile ist sicher?',
    optionen: [{ text: '`scanf("%15s", name);`', richtig: true }, { text: '`scanf("%s", name);`', warum: 'Ohne Breite kann ein langes Wort über das Array hinausschreiben.' }, { text: '`scanf("%16s", name);`', warum: '16 Zeichen plus Endzeichen sind 17, eines zu viel.' }],
  },
  {
    id: 'k03-t07',
    typ: 'zuordnen',
    themen: ['eingabe'],
    frage: 'Welche Formatangabe gehört beim **Einlesen** zu welchem Typ?',
    paare: [
      { links: '`int`', rechts: '`%d`' },
      { links: '`double`', rechts: '`%lf`' },
      { links: '`float`', rechts: '`%f`' },
      { links: '`char`', rechts: '`" %c"`' },
    ],
  },
  {
    id: 'k03-t08',
    typ: 'wahrfalsch',
    themen: ['eingabe'],
    aussage: '`fflush(stdin)` ist der vom Standard vorgesehene Weg, den Eingabepuffer zu leeren.',
    richtig: false,
    erklaerung: 'Für Eingabeströme ist `fflush` undefiniert. Den Rest einer Zeile liest man mit einer `getchar`-Schleife.',
  },
  {
    id: 'k03-t09',
    typ: 'auswahl',
    themen: ['eingabe'],
    frage: 'Was gibt `scanf("%d %d", &a, &b)` bei der Eingabe `4 x` zurück?',
    optionen: [{ text: '1', richtig: true }, { text: '2', warum: 'Nur die 4 ist eine Zahl.' }, { text: '0', warum: 'Die 4 wird erfolgreich gelesen.' }],
  },
  {
    id: 'k03-t10',
    typ: 'luecke',
    themen: ['eingabe', 'fehler'],
    frage: 'Ergänze die Prüfung, sodass bei einer ungültigen Eingabe abgebrochen wird.',
    code: c`
      #include <stdio.h>

      int main(void) {
          int n = 0;
          if (scanf("%d", &n) __1__ 1) {
              printf("Fehler\n");
              return 1;
          }
          printf("ok %d\n", n);
          return 0;
      }
    `,
    luecken: [['!=']],
    stdin: '3\n',
    ausgabe: 'ok 3\n',
  },
  {
    id: 'k03-t11',
    typ: 'wahrfalsch',
    themen: ['eingabe'],
    aussage: '`atoi` erkennt zuverlässig, ob ein Text keine Zahl war.',
    richtig: false,
    erklaerung: '`atoi("abc")` liefert 0, genau wie `atoi("0")`. Für Fehlererkennung `strtol` verwenden.',
  },
  {
    id: 'k03-t12',
    typ: 'auswahl',
    themen: ['eingabe'],
    frage: 'Was speichert `fgets(zeile, sizeof zeile, stdin)` bei der Eingabe `Pumpe 2` plus Enter in `zeile`?',
    optionen: [
      { text: '`"Pumpe 2\\n"`, also mit Zeilenumbruch', richtig: true },
      { text: '`"Pumpe"`, nur das erste Wort', warum: 'Das wäre `%s`. `fgets` liest die ganze Zeile.' },
      { text: '`"Pumpe 2"` ohne Zeilenumbruch', warum: '`fgets` behält das `\\n`.' },
    ],
  },
  {
    id: 'k03-t13',
    typ: 'programm',
    themen: ['eingabe'],
    aufgabe: md`
      Lies Länge und Breite eines Raums als Kommazahlen (in Metern, in einem \`scanf\`) und gib die Fläche mit zwei Nachkommastellen aus. Keine Eingabeaufforderung. Bei \`4.5 3.2\`:

      ~~~text
      Fläche: 14.40 m2
      ~~~
    `,
    start: c`
      #include <stdio.h>

      int main(void) {

          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      int main(void) {
          double laenge = 0.0, breite = 0.0;
          scanf("%lf %lf", &laenge, &breite);
          printf("Fläche: %.2f m2\n", laenge * breite);
          return 0;
      }
    `,
    tests: [
      { name: '4.5 x 3.2', stdin: '4.5 3.2\n', erwartet: { stdout: 'Fläche: 14.40 m2\n' } },
      { name: '10 x 0.5', stdin: '10\n0.5\n', erwartet: { stdout: 'Fläche: 5.00 m2\n' } },
    ],
  },
  {
    id: 'k03-t14',
    typ: 'programm',
    themen: ['eingabe', 'fehler'],
    aufgabe: md`
      Lies eine ganze Zahl (Anzahl Achsen). Gültig sind 1 bis 6. Gib bei einem gültigen Wert \`Achsen: <n>\` aus, sonst \`Ungültig\`, und ende dann mit dem Rückgabewert 1. Das gilt auch, wenn keine Zahl eingegeben wurde. Keine Eingabeaufforderung.
    `,
    start: c`
      #include <stdio.h>

      int main(void) {
          int achsen = 0;

          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      int main(void) {
          int achsen = 0;

          if (scanf("%d", &achsen) != 1 || achsen < 1 || achsen > 6) {
              printf("Ungültig\n");
              return 1;
          }
          printf("Achsen: %d\n", achsen);
          return 0;
      }
    `,
    tests: [
      { name: 'Gültig: 4', stdin: '4\n', erwartet: { stdout: 'Achsen: 4\n', exitCode: 0 } },
      { name: 'Zu gross: 7', stdin: '7\n', erwartet: { stdout: 'Ungültig\n', exitCode: 1 } },
      { name: 'Null', stdin: '0\n', erwartet: { stdout: 'Ungültig\n', exitCode: 1 } },
      { name: 'Keine Zahl', stdin: 'x\n', erwartet: { stdout: 'Ungültig\n', exitCode: 1 } },
    ],
  },
  {
    id: 'k03-t15',
    typ: 'auswahl',
    themen: ['eingabe'],
    frage: 'Warum ist `scanf("Zahl: %d", &x)` meist ein Fehler?',
    optionen: [
      { text: '`scanf` erwartet dann, dass der Benutzer «Zahl:» mittippt.', richtig: true },
      { text: 'Text im Formatstring wird von `scanf` ausgegeben.', warum: '`scanf` gibt nichts aus; dafür ist `printf` da.' },
      { text: 'Das ist korrekt und üblich.', warum: 'Die Aufforderung gehört in ein `printf` davor.' },
    ],
  },
];
