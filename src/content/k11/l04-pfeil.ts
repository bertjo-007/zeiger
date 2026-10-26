import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k11-l04',
  titel: 'Zeiger auf Strukturen und der Pfeiloperator',
  dauer: 30,
  stichwoerter: ['->', 'Pfeiloperator', 'Zeiger auf Struktur', 'const Struktur', 'verkettete Liste', 'Knoten', 'malloc struct'],
  lernziele: [
    'über einen Zeiger mit `->` auf Komponenten zugreifen',
    'Strukturen per Zeiger an Funktionen übergeben, zum Ändern oder mit `const` zum Lesen',
    'Strukturen dynamisch anlegen und eine einfache verkettete Liste verstehen',
  ],
  erklaerung: md`
    Hat man einen Zeiger \`m\` auf eine Struktur, kommt man mit \`(*m).drehzahl\` an eine Komponente. Die Klammern sind nötig, weil \`.\` stärker bindet als \`*\`. Weil das so oft vorkommt, gibt es eine Abkürzung, den **Pfeiloperator**:

    ~~~c
    m->drehzahl        // gleich wie (*m).drehzahl
    ~~~

    Faustregel: Variable → Punkt, Zeiger → Pfeil.

    ### Zeiger als Parameter

    Strukturen übergibt man meistens per Zeiger:

    - **Zum Ändern:** \`void beschleunigen(Motor *m, int schritt)\`. Die Funktion arbeitet am Original.
    - **Zum Lesen:** \`void anzeigen(const Motor *m)\`. Nichts wird kopiert, und \`const\` verspricht, dass nichts geändert wird.

    ### Dynamisch angelegte Strukturen

    \`Motor *m = malloc(sizeof *m);\` legt eine Struktur auf dem Heap an. Sie lebt bis zum \`free\`, unabhängig von der Funktion, die sie erzeugt hat.

    ### Ausblick: verkettete Listen

    Eine Struktur kann einen Zeiger auf eine Struktur des **gleichen** Typs enthalten. Dafür braucht sie einen Namen (*tag*), weil das \`typedef\` an dieser Stelle noch nicht bekannt ist:

    ~~~c
    typedef struct Knoten {
        int wert;
        struct Knoten *naechster;   // Zeiger auf den nächsten Knoten oder NULL
    } Knoten;
    ~~~

    Jeder Knoten zeigt auf seinen Nachfolger, der letzte auf \`NULL\`. So entsteht eine Liste, die beliebig wachsen kann, ohne je umkopiert zu werden. Durchlaufen wird sie mit \`for (const Knoten *k = kopf; k != NULL; k = k->naechster)\`.
  `,
  syntax: [
    {
      code: c`
        zeiger->komponente              // gleich wie (*zeiger).komponente
        void aendern(Typ *p);           // ändert das Original
        void lesen(const Typ *p);       // liest nur
        Typ *p = malloc(sizeof *p);     // dynamisch anlegen
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct {
          int nummer;
          int drehzahl;
          int max_drehzahl;
      } Motor;

      void beschleunigen(Motor *m, int schritt) {
          m->drehzahl += schritt;
          if (m->drehzahl > m->max_drehzahl) {
              m->drehzahl = m->max_drehzahl;
          }
      }

      void anzeigen(const Motor *m) {
          printf("Motor %d: %d/min\n", m->nummer, m->drehzahl);
      }

      int main(void) {
          Motor links = {1, 0, 1500};
          beschleunigen(&links, 1000);
          beschleunigen(&links, 1000);
          anzeigen(&links);

          Motor *rechts = malloc(sizeof *rechts);
          if (rechts == NULL) {
              return 1;
          }
          rechts->nummer = 2;
          rechts->drehzahl = 0;
          rechts->max_drehzahl = 3000;
          beschleunigen(rechts, 1200);
          anzeigen(rechts);
          (*rechts).drehzahl = 0;
          anzeigen(rechts);

          free(rechts);
          return 0;
      }
    `,
    ausgabe: out`
      Motor 1: 1500/min
      Motor 2: 1200/min
      Motor 2: 0/min
    `,
  },
  zeilen: [
    { zeilen: '10', text: md`Die Funktion bekommt die Adresse eines Motors und ändert das Original.` },
    { zeilen: '11-14', text: md`Pfeiloperator: Zugriff auf Komponenten über den Zeiger.` },
    { zeilen: '17', text: md`\`const Motor *\`: nur lesen, nichts wird kopiert.` },
    { zeilen: '23-24', text: md`\`&links\` übergibt die Adresse. Nach zweimal 1000 wird auf 1500 begrenzt.` },
    { zeilen: '27', text: md`Eine Struktur auf dem Heap; \`rechts\` ist bereits ein Zeiger, darum später kein \`&\`.` },
    { zeilen: '36', text: md`Die lange Schreibweise, gleichbedeutend mit \`rechts->drehzahl = 0;\`.` },
  ],
  ergebnis: md`
    Motor 1 wird zweimal beschleunigt und an der Höchstdrehzahl gebremst. Motor 2 liegt auf dem Heap und wird über den Zeiger genauso bedient. \`(*rechts).drehzahl\` und \`rechts->drehzahl\` meinen dieselbe Komponente.
  `,
  fehler: [
    {
      titel: 'Punkt statt Pfeil beim Zeiger',
      text: md`Für einen Zeiger meldet Clang «member reference type 'Motor *' is a pointer; did you mean to use '->'?».`,
      falsch: c`m.drehzahl = 0;      // m ist ein Motor *`,
      richtig: c`m->drehzahl = 0;`,
    },
    {
      titel: '*m.drehzahl ohne Klammern',
      text: md`\`*m.drehzahl\` heisst \`*(m.drehzahl)\`, weil \`.\` stärker bindet. Gemeint ist \`(*m).drehzahl\`, kurz \`m->drehzahl\`.`,
    },
    {
      titel: 'Struktur per Wert, Änderung erwartet',
      text: md`\`void beschleunigen(Motor m, …)\` ändert nur eine Kopie. Zum Ändern einen Zeiger übergeben.`,
    },
  ],
  uebungen: [
    {
      id: 'k11-l04-u1',
      typ: 'luecke',
      titel: 'Pfeil oder Punkt?',
      stufe: 1,
      themen: ['strukturen', 'zeiger'],
      frage: 'Ergänze den Zugriff in der Funktion und den Aufruf.',
      code: c`
        #include <stdio.h>

        typedef struct {
            int nummer;
            int drehzahl;
        } Motor;

        void stoppen(Motor *m) {
            m__1__drehzahl = 0;
        }

        int main(void) {
            Motor a = {3, 1400};
            stoppen(__2__);
            printf("Motor %d: %d\n", a.nummer, a.drehzahl);
            return 0;
        }
      `,
      luecken: [['->'], ['&a']],
      ausgabe: 'Motor 3: 0\n',
    },
    {
      id: 'k11-l04-u2',
      typ: 'programm',
      titel: 'Tank füllen',
      stufe: 2,
      themen: ['strukturen', 'zeiger', 'funktionen'],
      aufgabe: md`
        Schreibe \`double fuellen(Tank *t, double menge)\`. Sie erhöht \`t->inhalt\` um \`menge\`, aber höchstens bis \`t->kapazitaet\`. Zurück gibt sie die Menge, die nicht mehr hineinpasste (0, wenn alles passte).
      `,
      start: c`
        #include <stdio.h>

        typedef struct {
            double inhalt;
            double kapazitaet;
        } Tank;

        int main(void) {
            Tank t = {40.0, 100.0};
            double rest = fuellen(&t, 80.0);
            printf("%.1f %.1f\n", t.inhalt, rest);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        typedef struct {
            double inhalt;
            double kapazitaet;
        } Tank;

        double fuellen(Tank *t, double menge) {
            double frei = t->kapazitaet - t->inhalt;
            if (menge <= frei) {
                t->inhalt += menge;
                return 0.0;
            }
            t->inhalt = t->kapazitaet;
            return menge - frei;
        }

        int main(void) {
            Tank t = {40.0, 100.0};
            double rest = fuellen(&t, 80.0);
            printf("%.1f %.1f\n", t.inhalt, rest);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        typedef struct {
            double inhalt;
            double kapazitaet;
        } Tank;
        double fuellen(Tank *t, double menge);
        int main(void) {
            Tank t = {40.0, 100.0};
            double r1 = fuellen(&t, 30.0);
            double r2 = fuellen(&t, 50.0);
            printf("%.1f %.1f %.1f\n", r1, r2, t.inhalt);
            return 0;
        }
      `,
      tests: [{ name: 'Passt, dann Überlauf', erwartet: { stdout: '0.0 20.0 100.0\n' } }],
      hinweise: [md`Berechne zuerst den freien Platz: \`t->kapazitaet - t->inhalt\`.`],
    },
    {
      id: 'k11-l04-u3',
      typ: 'programm',
      titel: 'Vorne in die Liste',
      stufe: 3,
      themen: ['strukturen', 'zeiger', 'speicher'],
      aufgabe: md`
        Schreibe \`Knoten *vorne_einfuegen(Knoten *kopf, int wert)\`. Sie legt mit \`malloc\` einen neuen Knoten an, setzt \`wert\`, lässt ihn auf den bisherigen \`kopf\` zeigen und liefert den neuen Knoten als neuen Listenanfang. Gelingt \`malloc\` nicht, liefert sie \`NULL\`.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>

        typedef struct Knoten {
            int wert;
            struct Knoten *naechster;
        } Knoten;

        int main(void) {
            Knoten *liste = vorne_einfuegen(NULL, 10);
            if (liste != NULL) {
                printf("%d\n", liste->wert);
                free(liste);
            }
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdlib.h>

        typedef struct Knoten {
            int wert;
            struct Knoten *naechster;
        } Knoten;

        Knoten *vorne_einfuegen(Knoten *kopf, int wert) {
            Knoten *neu = malloc(sizeof *neu);
            if (neu == NULL) {
                return NULL;
            }
            neu->wert = wert;
            neu->naechster = kopf;
            return neu;
        }

        int main(void) {
            Knoten *liste = vorne_einfuegen(NULL, 10);
            if (liste != NULL) {
                printf("%d\n", liste->wert);
                free(liste);
            }
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        #include <stdlib.h>
        typedef struct Knoten {
            int wert;
            struct Knoten *naechster;
        } Knoten;
        Knoten *vorne_einfuegen(Knoten *kopf, int wert);
        int main(void) {
            Knoten *liste = NULL;
            for (int i = 1; i <= 4; i++) {
                Knoten *neu = vorne_einfuegen(liste, i * 10);
                if (neu == NULL) {
                    return 1;
                }
                liste = neu;
            }
            for (const Knoten *k = liste; k != NULL; k = k->naechster) {
                printf("%d ", k->wert);
            }
            printf("\n");
            while (liste != NULL) {
                Knoten *weiter = liste->naechster;
                free(liste);
                liste = weiter;
            }
            return 0;
        }
      `,
      tests: [{ name: 'Vier Knoten', erwartet: { stdout: '40 30 20 10\n', sauber: true }, tipp: md`Der neue Knoten muss auf den alten Kopf zeigen: \`neu->naechster = kopf;\`.` }],
      hinweise: [md`\`Knoten *neu = malloc(sizeof *neu);\` und auf \`NULL\` prüfen.`, md`Dann \`neu->wert = wert;\`, \`neu->naechster = kopf;\` und \`return neu;\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k11-l04-c1',
      typ: 'eingabe',
      themen: ['strukturen', 'zeiger'],
      frage: 'Schreibe `(*p).wert` mit dem Pfeiloperator.',
      antworten: ['p->wert', 'p -> wert'],
    },
    {
      id: 'k11-l04-c2',
      typ: 'auswahl',
      themen: ['strukturen', 'zeiger'],
      frage: 'Warum übergibt man eine grosse Struktur, die nur gelesen wird, als `const Typ *`?',
      optionen: [{ text: 'Es wird nichts kopiert, und `const` verhindert versehentliche Änderungen.', richtig: true }, { text: 'Weil Strukturen nicht als Wert übergeben werden können.' }, { text: 'Damit die Funktion die Struktur freigeben kann.' }],
    },
    {
      id: 'k11-l04-c3',
      typ: 'wahrfalsch',
      themen: ['strukturen'],
      aussage: 'In einer verketteten Liste zeigt der letzte Knoten auf `NULL`.',
      richtig: true,
    },
  ],
  zusammenfassung: [
    '`p->komponente` ist die Kurzform von `(*p).komponente`.',
    'Variable → Punkt, Zeiger → Pfeil.',
    'Strukturen zum Ändern per Zeiger übergeben, zum Lesen per `const`-Zeiger.',
    'Mit einem Zeiger auf den eigenen Typ entstehen verkettete Listen.',
  ],
  referenz: ['punkt-pfeil', 'struct', 'malloc'],
};
