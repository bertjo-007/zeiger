import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k11-l02',
  titel: 'typedef und Strukturen in Funktionen',
  dauer: 25,
  stichwoerter: ['typedef', 'Typname', 'Designated Initializer', '.x =', 'Struktur als Parameter', 'Struktur zurückgeben', 'Compound Literal'],
  lernziele: [
    'mit `typedef` kurze Typnamen vergeben',
    'Strukturen mit benannten Komponenten initialisieren',
    'Strukturen an Funktionen übergeben und aus Funktionen zurückgeben',
  ],
  erklaerung: md`
    ### typedef

    \`typedef\` gibt einem Typ einen zusätzlichen Namen. Bei Strukturen spart das das Wort \`struct\` bei jeder Verwendung:

    ~~~c
    typedef struct {
        double x;
        double y;
    } Punkt;

    Punkt start;          // statt struct Punkt start;
    ~~~

    \`typedef\` funktioniert mit jedem Typ: \`typedef unsigned char Byte;\` oder \`typedef int Millivolt;\`. Ein Name, der sagt, was ein Wert bedeutet, macht Code lesbarer.

    ### Initialisieren mit Namen

    Seit C99 kann man Komponenten beim Namen nennen (*designated initializers*):

    ~~~c
    Punkt ziel = {.y = 40.0, .x = 30.0};
    ~~~

    Die Reihenfolge ist dann egal, und **nicht genannte Komponenten werden 0**. Das ist robuster als die reine Reihenfolge, falls später eine Komponente dazukommt.

    ### Strukturen in Funktionen

    Strukturen lassen sich wie \`int\` übergeben und zurückgeben. Übergeben wird eine **Kopie**: Ändert die Funktion ihren Parameter, bleibt das Original unverändert. Eine Funktion kann so auch mehrere Werte auf einmal zurückgeben, gebündelt in einer Struktur.

    Eine Struktur ohne eigene Variable schreibt man als *compound literal*: \`mitte(start, (Punkt){10.0, 0.0})\`.

    > [!tipp] Grosse Strukturen
    > Bei grossen Strukturen ist das Kopieren teuer. Dann übergibt man einen Zeiger, bei reinem Lesen einen \`const\`-Zeiger. Das kommt in Lektion 4.
  `,
  syntax: [
    {
      code: c`
        typedef struct {
            typ komponente;
        } Typname;

        Typname v = {.komponente = wert};
        Typname funktion(Typname parameter);
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <math.h>

      typedef struct {
          double x;
          double y;
      } Punkt;

      Punkt mitte(Punkt a, Punkt b) {
          Punkt m = {(a.x + b.x) / 2.0, (a.y + b.y) / 2.0};
          return m;
      }

      double abstand(Punkt a, Punkt b) {
          double dx = b.x - a.x;
          double dy = b.y - a.y;
          return sqrt(dx * dx + dy * dy);
      }

      int main(void) {
          Punkt start = {.x = 0.0, .y = 0.0};
          Punkt ziel = {.y = 40.0, .x = 30.0};

          Punkt m = mitte(start, ziel);
          printf("Mitte: (%.1f, %.1f)\n", m.x, m.y);
          printf("Weg: %.1f mm\n", abstand(start, ziel));

          Punkt kopie = ziel;
          kopie.x = 0.0;
          printf("ziel: (%.1f, %.1f), kopie: (%.1f, %.1f)\n", ziel.x, ziel.y, kopie.x, kopie.y);
          return 0;
      }
    `,
    ausgabe: out`
      Mitte: (15.0, 20.0)
      Weg: 50.0 mm
      ziel: (30.0, 40.0), kopie: (0.0, 40.0)
    `,
  },
  zeilen: [
    { zeilen: '4-7', text: md`Eine Struktur ohne eigenen Namen, die per \`typedef\` den Namen \`Punkt\` bekommt.` },
    { zeilen: '9-12', text: md`Die Funktion bekommt zwei Kopien und gibt eine neue Struktur zurück.` },
    { zeilen: '21-22', text: md`Initialisierung mit Namen; die Reihenfolge spielt keine Rolle.` },
    { zeilen: '24', text: md`Das Ergebnis ist eine ganze Struktur.` },
    { zeilen: '28-29', text: md`\`kopie\` ist unabhängig von \`ziel\`.` },
  ],
  ergebnis: md`
    Die Mitte zwischen (0, 0) und (30, 40) ist (15, 20), der Abstand beträgt nach Pythagoras 50 mm. \`ziel\` bleibt unverändert, obwohl \`kopie\` geändert wurde.
  `,
  fehler: [
    {
      titel: 'typedef-Name und Variable verwechseln',
      text: md`Nach \`typedef struct { … } Punkt;\` ist \`Punkt\` ein **Typ**, keine Variable. \`Punkt.x = 1;\` ist ein Fehler; es braucht zuerst \`Punkt p;\`.`,
    },
    {
      titel: 'Änderung am Parameter erwarten',
      text: md`Eine Funktion \`void verschieben(Punkt p)\` ändert nur ihre Kopie. Entweder die geänderte Struktur zurückgeben oder einen Zeiger übergeben.`,
      falsch: c`
        void verschieben(Punkt p, double dx) {
            p.x += dx;
        }
      `,
      richtig: c`
        Punkt verschoben(Punkt p, double dx) {
            p.x += dx;
            return p;
        }
      `,
    },
  ],
  uebungen: [
    {
      id: 'k11-l02-u1',
      typ: 'wahrfalsch',
      titel: 'Nicht genannte Komponenten',
      stufe: 1,
      themen: ['strukturen'],
      aussage: 'Nach `Punkt p = {.y = 5.0};` hat `p.x` den Wert 0.',
      richtig: true,
      erklaerung: 'Nicht genannte Komponenten werden bei einer Initialisierung mit 0 belegt.',
    },
    {
      id: 'k11-l02-u2',
      typ: 'programm',
      titel: 'Grösseres Rechteck',
      stufe: 2,
      themen: ['strukturen', 'funktionen', 'eingabe'],
      aufgabe: md`
        Definiere mit \`typedef\` einen Typ \`Rechteck\` mit \`double breite\` und \`double hoehe\` und eine Funktion \`double flaeche(Rechteck r)\`. Lies zwei Rechtecke (je Breite und Höhe) und gib das grössere aus:

        ~~~
        Rechteck 2: 14.00
        ~~~

        Sind beide gleich gross, lautet die Ausgabe \`gleich gross\`.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        typedef struct {
            double breite;
            double hoehe;
        } Rechteck;

        double flaeche(Rechteck r) {
            return r.breite * r.hoehe;
        }

        int main(void) {
            Rechteck r1;
            Rechteck r2;
            if (scanf("%lf %lf %lf %lf", &r1.breite, &r1.hoehe, &r2.breite, &r2.hoehe) != 4) {
                return 1;
            }
            double f1 = flaeche(r1);
            double f2 = flaeche(r2);
            if (f1 > f2) {
                printf("Rechteck 1: %.2f\n", f1);
            } else if (f2 > f1) {
                printf("Rechteck 2: %.2f\n", f2);
            } else {
                printf("gleich gross\n");
            }
            return 0;
        }
      `,
      stdin: '3 4\n2 7\n',
      tests: [
        { name: 'Zweites grösser', stdin: '3 4\n2 7\n', erwartet: { stdout: 'Rechteck 2: 14.00\n' } },
        { name: 'Erstes grösser', stdin: '5 2\n1 3\n', erwartet: { stdout: 'Rechteck 1: 10.00\n' } },
        { name: 'Gleich', stdin: '2 6\n3 4\n', erwartet: { stdout: 'gleich gross\n' } },
      ],
      regeln: [{ muss: 'typedef\\s+struct', meldung: 'Definiere den Typ mit `typedef struct`.' }, { muss: '\\bflaeche\\s*\\(', meldung: 'Berechne die Fläche in der Funktion `flaeche`.' }],
      hinweise: [md`Einlesen direkt in die Komponenten: \`scanf("%lf %lf", &r1.breite, &r1.hoehe)\`.`],
    },
    {
      id: 'k11-l02-u3',
      typ: 'programm',
      titel: 'Uhrzeit weiterrechnen',
      stufe: 3,
      themen: ['strukturen', 'funktionen', 'operatoren'],
      aufgabe: md`
        Schreibe \`Zeit addiere(Zeit t, int minuten)\`. Sie liefert die Uhrzeit, die \`minuten\` Minuten nach \`t\` liegt. Über Mitternacht geht es bei 00:00 weiter, und auch negative Minuten und mehrere Tage sollen funktionieren.
      `,
      start: c`
        #include <stdio.h>

        typedef struct {
            int stunden;
            int minuten;
        } Zeit;

        int main(void) {
            Zeit t = {23, 50};
            Zeit n = addiere(t, 20);
            printf("%02d:%02d\n", n.stunden, n.minuten);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        typedef struct {
            int stunden;
            int minuten;
        } Zeit;

        Zeit addiere(Zeit t, int minuten) {
            int gesamt = t.stunden * 60 + t.minuten + minuten;
            gesamt = ((gesamt % 1440) + 1440) % 1440;
            Zeit r = {gesamt / 60, gesamt % 60};
            return r;
        }

        int main(void) {
            Zeit t = {23, 50};
            Zeit n = addiere(t, 20);
            printf("%02d:%02d\n", n.stunden, n.minuten);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        typedef struct {
            int stunden;
            int minuten;
        } Zeit;
        Zeit addiere(Zeit t, int minuten);
        int main(void) {
            Zeit a = addiere((Zeit){23, 50}, 20);
            Zeit b = addiere((Zeit){8, 15}, 135);
            Zeit c = addiere((Zeit){0, 5}, -10);
            Zeit d = addiere((Zeit){12, 0}, 2 * 1440);
            printf("%02d:%02d %02d:%02d %02d:%02d %02d:%02d\n", a.stunden, a.minuten, b.stunden, b.minuten, c.stunden, c.minuten, d.stunden, d.minuten);
            return 0;
        }
      `,
      tests: [{ name: 'Vier Fälle', erwartet: { stdout: '00:10 10:30 23:55 12:00\n' }, tipp: md`In C kann \`%\` negativ werden: \`-5 % 1440\` ist −5. Addiere 1440 und nimm nochmals \`% 1440\`.` }],
      hinweise: [md`Rechne alles in Minuten seit Mitternacht um, dann zurück in Stunden und Minuten.`, md`Ein Tag hat 1440 Minuten.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k11-l02-c1',
      typ: 'auswahl',
      themen: ['strukturen'],
      frage: 'Was bewirkt `typedef struct { int x; } Wert;`?',
      optionen: [{ text: '`Wert` wird ein Typname; Variablen deklariert man mit `Wert v;`.', richtig: true }, { text: 'Es wird eine Variable `Wert` angelegt.' }, { text: 'Es wird ein Makro `Wert` definiert.' }],
    },
    {
      id: 'k11-l02-c2',
      typ: 'wahrfalsch',
      themen: ['strukturen', 'funktionen'],
      aussage: 'Eine Funktion bekommt eine Struktur als Kopie, wenn der Parameter keinen Zeiger hat.',
      richtig: true,
    },
    {
      id: 'k11-l02-c3',
      typ: 'eingabe',
      themen: ['strukturen'],
      frage: 'Ergänze die Initialisierung mit Namen: `Punkt p = {___ = 2.0};` setzt die Komponente `y`.',
      antworten: ['.y'],
    },
  ],
  zusammenfassung: [
    '`typedef struct { … } Name;` erspart das Wort `struct`.',
    '`{.komponente = wert}` initialisiert beim Namen; Rest wird 0.',
    'Strukturen werden als Kopie übergeben und können zurückgegeben werden.',
    'Für grosse Strukturen oder zum Ändern: Zeiger übergeben (Lektion 4).',
  ],
  referenz: ['typedef', 'struct'],
};
