import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

/** Die übrigen Schlüsselwörter von C17, damit die Bibliothek alle 44 enthält. */
export const eintraege: ReferenzEintrag[] = [
  {
    id: 'case-default',
    name: 'case / default',
    kategorie: 'schluesselwort',
    kurz: md`Marken innerhalb von \`switch\`. \`case\` braucht eine Konstante, \`default\` greift, wenn kein \`case\` passt. Ohne \`break\` läuft die Ausführung in den nächsten Fall weiter.`,
    syntax: c`
      switch (wert) {
          case 1:
              …
              break;
          default:
              …
              break;
      }
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int stufe = 4;
            switch (stufe) {
                case 1:
                case 2:
                    printf("niedrig\n");
                    break;
                default:
                    printf("hoch\n");
                    break;
            }
            return 0;
        }
      `,
      ausgabe: out`
        hoch
      `,
    },
    fehler: [md`\`break\` vergessen.`, md`Variablen als \`case\`-Wert: nur Konstanten sind erlaubt.`],
    lektionen: ['k05-l03'],
    stichwoerter: ['Fall', 'Standardfall', 'switch'],
  },
  {
    id: 'static',
    name: 'static',
    kategorie: 'schluesselwort',
    kurz: md`Bei lokalen Variablen: Die Variable lebt während der ganzen Programmlaufzeit und behält ihren Wert zwischen Aufrufen. Bei globalen Variablen und Funktionen: nur in dieser Datei sichtbar.`,
    syntax: c`
      static int zaehler = 0;          // in einer Funktion: behält den Wert
      static void hilfsfunktion(void); // nur in dieser Datei sichtbar
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int zaehle(void) {
            static int aufrufe = 0;
            aufrufe++;
            return aufrufe;
        }

        int main(void) {
            zaehle();
            zaehle();
            printf("%d\n", zaehle());
            return 0;
        }
      `,
      ausgabe: out`
        3
      `,
    },
    fehler: [md`Erwarten, dass eine \`static\`-Variable bei jedem Aufruf neu startet: Die Initialisierung passiert nur einmal.`],
    lektionen: ['k07-l04'],
    stichwoerter: ['Lebensdauer', 'Speicherklasse', 'interne Bindung', 'Wert behalten'],
  },
  {
    id: 'extern',
    name: 'extern',
    kategorie: 'schluesselwort',
    kurz: md`Deklariert eine Variable oder Funktion, die an anderer Stelle (oft in einer anderen Datei) definiert ist. Typisch in Header-Dateien: \`extern int grenzwert;\` im Header, \`int grenzwert = 80;\` in genau einer \`.c\`-Datei.`,
    syntax: c`extern int grenzwert;`,
    beispiel: {
      code: c`
        #include <stdio.h>

        extern int grenzwert;

        int main(void) {
            printf("%d\n", grenzwert);
            return 0;
        }

        int grenzwert = 80;
      `,
      ausgabe: out`
        80
      `,
    },
    fehler: [md`Die Variable in mehreren \`.c\`-Dateien definieren statt nur deklarieren.`],
    lektionen: [],
    stichwoerter: ['Deklaration', 'externe Variable', 'globale Variable', 'Header'],
  },
  {
    id: 'volatile',
    name: 'volatile',
    kategorie: 'schluesselwort',
    kurz: md`Sagt dem Compiler, dass sich der Wert jederzeit von aussen ändern kann, etwa durch Hardware oder eine Interrupt-Routine. Jeder Zugriff liest und schreibt dann wirklich den Speicher.`,
    syntax: c`
      volatile int taste_gedrueckt;
      volatile uint8_t *const PORTB = (uint8_t *)0x25;
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        volatile int taste_gedrueckt = 0;

        int main(void) {
            taste_gedrueckt = 1;
            if (taste_gedrueckt) {
                printf("gedrückt\n");
            }
            return 0;
        }
      `,
      ausgabe: out`
        gedrückt
      `,
    },
    fehler: [md`\`volatile\` für Synchronisation zwischen Threads halten: dafür gibt es \`_Atomic\`.`],
    lektionen: [],
    stichwoerter: ['Register', 'Interrupt', 'Hardware', 'Optimierung'],
  },
  {
    id: 'short-signed',
    name: 'short / signed',
    kategorie: 'schluesselwort',
    kurz: md`\`short\` ist eine kurze Ganzzahl (meist 16 Bit, \`%hd\`). \`signed\` erzwingt einen vorzeichenbehafteten Typ; nötig vor allem bei \`signed char\`, weil das Vorzeichen von \`char\` vom System abhängt.`,
    syntax: c`
      short s = -1200;
      unsigned short u = 65535;
      signed char c = -5;
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            short s = -1200;
            signed char c = -5;
            unsigned short u = 65535;
            printf("%hd %d %hu %zu\n", s, c, u, sizeof s);
            return 0;
        }
      `,
      ausgabe: out`
        -1200 -5 65535 2
      `,
    },
    fehler: [md`Feste Bitbreiten annehmen. Für genau 16 Bit gibt es \`int16_t\` aus \`<stdint.h>\`.`],
    lektionen: ['k02-l02'],
    stichwoerter: ['16 Bit', 'vorzeichenbehaftet', 'Ganzzahl', '%hd'],
  },
  {
    id: 'goto',
    name: 'goto',
    kategorie: 'schluesselwort',
    kurz: md`Springt zu einer Marke in derselben Funktion. Selten sinnvoll: zum Verlassen tief verschachtelter Schleifen oder für einen gemeinsamen Aufräumteil am Funktionsende.`,
    syntax: c`
      goto marke;
      …
      marke:
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            for (int z = 0; z < 3; z++) {
                for (int s = 0; s < 3; s++) {
                    if (z * s == 2) {
                        printf("gefunden: %d %d\n", z, s);
                        goto fertig;
                    }
                }
            }
        fertig:
            printf("Ende\n");
            return 0;
        }
      `,
      ausgabe: out`
        gefunden: 1 2
        Ende
      `,
    },
    veraltet: md`Wild verwendetes \`goto\` macht Programme schwer lesbar. Bevorzuge Schleifen, \`break\`, \`return\` und Funktionen; \`goto\` nur für klar umrissene Fälle wie das Aufräumen.`,
    lektionen: [],
    stichwoerter: ['Sprung', 'Marke', 'Label'],
  },
  {
    id: 'inline',
    name: 'inline',
    kategorie: 'schluesselwort',
    kurz: md`Schlägt dem Compiler vor, eine kleine Funktion direkt an der Aufrufstelle einzusetzen. Meist als \`static inline\` in Header-Dateien. Der Compiler entscheidet selbst.`,
    syntax: c`static inline int quadrat(int x) { return x * x; }`,
    beispiel: {
      code: c`
        #include <stdio.h>

        static inline int quadrat(int x) {
            return x * x;
        }

        int main(void) {
            printf("%d\n", quadrat(12));
            return 0;
        }
      `,
      ausgabe: out`
        144
      `,
    },
    fehler: [md`\`inline\` ohne \`static\` in einem Header kann zu Linkerfehlern führen.`],
    lektionen: [],
    stichwoerter: ['Funktion einsetzen', 'Optimierung'],
  },
  {
    id: 'restrict',
    name: 'restrict',
    kategorie: 'schluesselwort',
    kurz: md`Zusage an den Compiler: Über diesen Zeiger wird auf Speicher zugegriffen, den kein anderer Zeiger im selben Bereich berührt. Erlaubt Optimierungen. Stimmt die Zusage nicht, ist das Verhalten undefiniert.`,
    syntax: c`void addiere(int *restrict ziel, const int *restrict quelle, size_t n);`,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stddef.h>

        void addiere(int *restrict ziel, const int *restrict quelle, size_t n) {
            for (size_t i = 0; i < n; i++) {
                ziel[i] += quelle[i];
            }
        }

        int main(void) {
            int a[3] = {1, 2, 3};
            int b[3] = {10, 20, 30};
            addiere(a, b, 3);
            printf("%d %d %d\n", a[0], a[1], a[2]);
            return 0;
        }
      `,
      ausgabe: out`
        11 22 33
      `,
    },
    fehler: [md`Zwei \`restrict\`-Zeiger auf überlappende Bereiche übergeben.`],
    lektionen: [],
    stichwoerter: ['Zeiger', 'Aliasing', 'Optimierung', 'memcpy'],
  },
  {
    id: 'auto',
    name: 'auto',
    kategorie: 'schluesselwort',
    kurz: md`In C17 die Speicherklasse für gewöhnliche lokale Variablen. Sie ist ohnehin der Standard und wird darum praktisch nie geschrieben. In C23 bekommt \`auto\` eine neue Bedeutung: Der Typ wird aus dem Startwert abgeleitet.`,
    syntax: c`auto int zaehler = 0;   // gleich wie: int zaehler = 0;`,
    lektionen: [],
    stichwoerter: ['Speicherklasse', 'automatische Variable', 'C23'],
  },
  {
    id: 'register',
    name: 'register',
    kategorie: 'schluesselwort',
    kurz: md`Bat den Compiler früher, eine Variable in einem Prozessorregister zu halten. Von einer solchen Variable darf man keine Adresse nehmen.`,
    syntax: c`register int i;`,
    veraltet: md`Heutige Compiler entscheiden das besser selbst und ignorieren den Hinweis. In neuem Code nicht verwenden.`,
    lektionen: [],
    stichwoerter: ['Speicherklasse', 'Prozessorregister'],
  },
  {
    id: 'static-assert',
    name: '_Static_assert',
    kategorie: 'schluesselwort',
    kurz: md`Prüft eine Bedingung beim **Kompilieren**. Ist sie falsch, bricht das Kompilieren mit dem angegebenen Text ab. Mit \`<assert.h>\` auch als \`static_assert\`.`,
    syntax: c`_Static_assert(bedingung, "Meldung");`,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stdint.h>

        _Static_assert(sizeof(uint32_t) == 4, "uint32_t muss 4 Byte haben");

        int main(void) {
            printf("ok\n");
            return 0;
        }
      `,
      ausgabe: out`
        ok
      `,
    },
    fehler: [md`Laufzeitwerte prüfen wollen: Nur Konstanten sind erlaubt.`],
    lektionen: [],
    stichwoerter: ['Prüfung beim Kompilieren', 'static_assert', 'Zusicherung'],
  },
  {
    id: 'noreturn',
    name: '_Noreturn',
    kategorie: 'schluesselwort',
    kurz: md`Kennzeichnet eine Funktion, die nie zum Aufrufer zurückkehrt, etwa weil sie \`exit\` aufruft. Mit \`<stdnoreturn.h>\` auch als \`noreturn\`.`,
    syntax: c`_Noreturn void abbrechen(const char *grund);`,
    beispiel: {
      code: c`
        #include <stdio.h>
        #include <stdlib.h>

        _Noreturn void abbrechen(const char *grund) {
            printf("Abbruch: %s\n", grund);
            exit(1);
        }

        int main(void) {
            int sensor_ok = 0;
            if (!sensor_ok) {
                abbrechen("Sensor fehlt");
            }
            return 0;
        }
      `,
      ausgabe: out`
        Abbruch: Sensor fehlt
      `,
    },
    lektionen: [],
    stichwoerter: ['exit', 'kehrt nicht zurück', 'noreturn'],
  },
  {
    id: 'alignas',
    name: '_Alignas / _Alignof',
    kategorie: 'schluesselwort',
    kurz: md`\`_Alignof(typ)\` liefert die Ausrichtung eines Typs in Byte. \`_Alignas(n)\` verlangt für eine Variable eine bestimmte Ausrichtung, etwa für DMA-Puffer. Mit \`<stdalign.h>\` auch als \`alignof\` und \`alignas\`.`,
    syntax: c`
      _Alignas(16) unsigned char puffer[64];
      size_t a = _Alignof(double);
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            _Alignas(16) unsigned char puffer[32];
            puffer[0] = 1;
            printf("%zu %zu %d\n", _Alignof(double), _Alignof(int), puffer[0]);
            return 0;
        }
      `,
      ausgabe: out`
        8 4 1
      `,
    },
    lektionen: [],
    stichwoerter: ['Ausrichtung', 'alignment', 'alignof', 'alignas', 'Padding'],
  },
  {
    id: 'generic',
    name: '_Generic',
    kategorie: 'schluesselwort',
    kurz: md`Wählt beim Kompilieren abhängig vom Typ eines Ausdrucks einen von mehreren Ausdrücken aus. Wird meist in Makros verwendet, um «eine Funktion für mehrere Typen» zu bauen.`,
    syntax: c`_Generic((x), int: ausdruck1, double: ausdruck2, default: ausdruck3)`,
    beispiel: {
      code: c`
        #include <stdio.h>

        #define TYPNAME(x) _Generic((x), int: "int", double: "double", char *: "Text", default: "anderer Typ")

        int main(void) {
            char text[] = "Motor";
            printf("%s %s %s %s\n", TYPNAME(42), TYPNAME(1.5), TYPNAME(text), TYPNAME(3.0f));
            return 0;
        }
      `,
      ausgabe: out`
        int double Text anderer Typ
      `,
    },
    lektionen: [],
    stichwoerter: ['Typauswahl', 'generisch', 'Makro'],
  },
  {
    id: 'atomic',
    name: '_Atomic',
    kategorie: 'schluesselwort',
    kurz: md`Macht Zugriffe auf eine Variable unteilbar, damit mehrere Threads sie gleichzeitig verwenden können. Funktionen dazu stehen in \`<stdatomic.h>\`. Optional: Compiler müssen es nicht unterstützen.`,
    syntax: c`
      _Atomic int zaehler;
      #include <stdatomic.h>
      atomic_fetch_add(&zaehler, 1);
    `,
    lektionen: [],
    stichwoerter: ['Threads', 'unteilbar', 'Nebenläufigkeit', 'stdatomic.h'],
  },
  {
    id: 'thread-local',
    name: '_Thread_local',
    kategorie: 'schluesselwort',
    kurz: md`Jeder Thread bekommt seine eigene Kopie der Variable. Mit \`<threads.h>\` auch als \`thread_local\`. In der App gibt es keine Threads.`,
    syntax: c`_Thread_local int fehlercode;`,
    lektionen: [],
    stichwoerter: ['Threads', 'threadlokal'],
  },
  {
    id: 'complex',
    name: '_Complex / _Imaginary',
    kategorie: 'schluesselwort',
    kurz: md`Typen für komplexe Zahlen, etwa \`double _Complex\`. Mit \`<complex.h>\` als \`double complex\` und mit Funktionen wie \`cabs\` oder \`creal\`. \`_Imaginary\` ist optional und wird von den meisten Compilern nicht unterstützt.`,
    syntax: c`
      #include <complex.h>
      double complex z = 3.0 + 4.0 * I;
    `,
    lektionen: [],
    stichwoerter: ['komplexe Zahlen', 'complex.h', 'Wechselstrom'],
  },
];
