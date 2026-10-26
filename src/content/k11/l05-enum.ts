import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k11-l05',
  titel: 'Aufzählungen mit enum',
  dauer: 25,
  stichwoerter: ['enum', 'Aufzählung', 'Aufzählungstyp', 'Zustand', 'Konstanten', 'Zustandsautomat', 'switch'],
  lernziele: [
    'mit `enum` benannte Konstanten für zusammengehörige Werte definieren',
    'Aufzählungen in `switch`-Anweisungen verwenden',
    'einen Zustandsautomaten mit Aufzählungstypen lesbar schreiben',
  ],
  erklaerung: md`
    Ein Motor ist aus, läuft an, ist in Betrieb oder hat eine Störung. Mit Zahlen 0 bis 3 kann man das speichern, aber \`if (zustand == 2)\` sagt niemandem etwas. Eine **Aufzählung** gibt den Werten Namen:

    ~~~c
    typedef enum {
        AUS,          // 0
        ANLAUF,       // 1
        BETRIEB,      // 2
        STOERUNG      // 3
    } Zustand;
    ~~~

    Die Namen sind ganzzahlige Konstanten. Ohne Angabe beginnt die Zählung bei 0 und steigt um 1. Man kann Werte auch festlegen: \`enum { BIT_BEREIT = 1, BIT_FEHLER = 2, BIT_LAUF = 4 };\`. Danach geht es vom zuletzt festgelegten Wert aus weiter.

    Konstanten schreibt man üblicherweise in GROSSBUCHSTABEN. Da alle Namen im selben Bereich gelten, setzen viele ein Präfix davor, etwa \`ZUSTAND_AUS\`, damit sich zwei Aufzählungen nicht in die Quere kommen.

    ### enum und switch

    Aufzählungen und \`switch\` passen perfekt zusammen. Behandelt ein \`switch\` nicht alle Werte eines \`enum\`, warnt Clang mit \`-Wall\` («enumeration value 'STOERUNG' not handled in switch»). So vergisst man beim Erweitern keinen Fall.

    > [!achtung] Kein Typschutz
    > In C ist ein \`enum\` nur ein \`int\` mit Namen. \`Zustand z = 17;\` ist erlaubt. Die Namen dokumentieren die Absicht, prüfen aber nicht jeden Wert.

    > [!praxis] Auf dem Mikrocontroller
    > Zustandsautomaten für Steuerungen werden fast immer mit \`enum\` für Zustände und Ereignisse geschrieben. Der Automat aus Kapitel 5 wird damit deutlich lesbarer.
  `,
  syntax: [
    {
      code: c`
        typedef enum {
            NAME_A,          // 0
            NAME_B,          // 1
            NAME_C = 10,     // 10
            NAME_D           // 11
        } Typname;
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      typedef enum {
          AUS,
          ANLAUF,
          BETRIEB,
          STOERUNG
      } Zustand;

      typedef enum {
          TASTE_START,
          TASTE_STOP,
          DREHZAHL_ERREICHT,
          UEBERSTROM
      } Ereignis;

      const char *zustand_name(Zustand z) {
          switch (z) {
              case AUS:
                  return "AUS";
              case ANLAUF:
                  return "ANLAUF";
              case BETRIEB:
                  return "BETRIEB";
              case STOERUNG:
                  return "STOERUNG";
          }
          return "?";
      }

      Zustand schritt(Zustand z, Ereignis e) {
          if (e == UEBERSTROM) {
              return STOERUNG;
          }
          switch (z) {
              case AUS:
                  return e == TASTE_START ? ANLAUF : AUS;
              case ANLAUF:
                  if (e == DREHZAHL_ERREICHT) {
                      return BETRIEB;
                  }
                  return e == TASTE_STOP ? AUS : ANLAUF;
              case BETRIEB:
              case STOERUNG:
                  return e == TASTE_STOP ? AUS : z;
          }
          return z;
      }

      int main(void) {
          Ereignis ablauf[] = {TASTE_START, DREHZAHL_ERREICHT, UEBERSTROM, TASTE_START, TASTE_STOP};
          Zustand z = AUS;
          printf("Start: %s\n", zustand_name(z));
          for (int i = 0; i < 5; i++) {
              z = schritt(z, ablauf[i]);
              printf("Ereignis %d: %s\n", (int)ablauf[i], zustand_name(z));
          }
          printf("BETRIEB hat den Wert %d\n", BETRIEB);
          return 0;
      }
    `,
    ausgabe: out`
      Start: AUS
      Ereignis 0: ANLAUF
      Ereignis 2: BETRIEB
      Ereignis 3: STOERUNG
      Ereignis 0: STOERUNG
      Ereignis 1: AUS
      BETRIEB hat den Wert 2
    `,
  },
  zeilen: [
    { zeilen: '3-8', text: md`Vier Zustände, automatisch nummeriert von 0 bis 3.` },
    { zeilen: '17-29', text: md`Für die Ausgabe: zu jedem Zustand ein Text. Ein vergessener Fall würde Clang melden.` },
    { zeilen: '32-34', text: md`Überstrom führt aus jedem Zustand in die Störung.` },
    { zeilen: '43-45', text: md`Zwei \`case\` teilen sich einen Rumpf: In Betrieb und bei Störung führt nur STOP zurück nach AUS.` },
    { zeilen: '51', text: md`Ein Array aus Ereignissen spielt einen Ablauf durch.` },
    { zeilen: '56', text: md`Ein \`enum\`-Wert ist eine ganze Zahl und lässt sich so ausgeben.` },
  ],
  ergebnis: md`
    Der Motor läuft an, erreicht die Drehzahl und fällt bei Überstrom in die Störung. Ein erneutes START ändert daran nichts; erst STOP bringt ihn zurück nach AUS. Die Ereignisnummern in der Ausgabe zeigen, dass hinter den Namen gewöhnliche Zahlen stehen.
  `,
  fehler: [
    {
      titel: 'Gleicher Name in zwei Aufzählungen',
      text: md`\`enum { AUS, EIN };\` und \`enum { AUS, BLINKEN };\` im selben Bereich: Clang meldet «redefinition of enumerator 'AUS'». Abhilfe: Präfixe wie \`LED_AUS\` und \`MOTOR_AUS\`.`,
    },
    {
      titel: 'Zahlen statt Namen',
      text: md`\`if (z == 2)\` funktioniert, versteckt aber die Bedeutung, und nach dem Einfügen eines neuen Zustands stimmt die 2 vielleicht nicht mehr. Immer die Namen verwenden.`,
      falsch: c`if (z == 2)`,
      richtig: c`if (z == BETRIEB)`,
    },
    {
      titel: 'Fall im switch vergessen',
      text: md`Ohne \`default\` warnt Clang bei fehlenden Fällen. Diese Warnung nicht mit einem leeren \`default\` zum Schweigen bringen, sondern den Fall behandeln.`,
    },
  ],
  uebungen: [
    {
      id: 'k11-l05-u1',
      typ: 'vorhersage',
      titel: 'Welche Zahl steckt dahinter?',
      stufe: 1,
      themen: ['strukturen', 'konstanten'],
      code: c`
        #include <stdio.h>

        enum Farbe { ROT = 1, GELB, GRUEN = 10, BLAU };

        int main(void) {
            printf("%d %d %d\n", ROT, GELB, BLAU);
            return 0;
        }
      `,
      ausgabe: out`
        1 2 11
      `,
      erklaerung: md`Nach einem festgelegten Wert wird um 1 weitergezählt: GELB folgt auf ROT = 1, BLAU auf GRUEN = 10.`,
    },
    {
      id: 'k11-l05-u2',
      typ: 'programm',
      titel: 'Ampel weiterschalten',
      stufe: 2,
      themen: ['strukturen', 'switch'],
      aufgabe: md`
        Schreibe \`Ampel naechste(Ampel a)\` für die Phasenfolge ROT → ROTGELB → GRUEN → GELB → ROT. Verwende ein \`switch\` über alle Werte.
      `,
      start: c`
        #include <stdio.h>

        typedef enum {
            ROT,
            ROTGELB,
            GRUEN,
            GELB
        } Ampel;

        int main(void) {
            Ampel a = ROT;
            for (int i = 0; i < 5; i++) {
                printf("%d ", (int)a);
                a = naechste(a);
            }
            printf("\n");
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        typedef enum {
            ROT,
            ROTGELB,
            GRUEN,
            GELB
        } Ampel;

        Ampel naechste(Ampel a) {
            switch (a) {
                case ROT:
                    return ROTGELB;
                case ROTGELB:
                    return GRUEN;
                case GRUEN:
                    return GELB;
                case GELB:
                    return ROT;
            }
            return ROT;
        }

        int main(void) {
            Ampel a = ROT;
            for (int i = 0; i < 5; i++) {
                printf("%d ", (int)a);
                a = naechste(a);
            }
            printf("\n");
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        typedef enum {
            ROT,
            ROTGELB,
            GRUEN,
            GELB
        } Ampel;
        Ampel naechste(Ampel a);
        int main(void) {
            printf("%d %d %d %d\n", (int)naechste(ROT), (int)naechste(ROTGELB), (int)naechste(GRUEN), (int)naechste(GELB));
            return 0;
        }
      `,
      tests: [{ name: 'Alle Übergänge', erwartet: { stdout: '1 2 3 0\n' } }],
      regeln: [{ muss: '\\bswitch\\s*\\(', meldung: 'Verwende ein `switch`.' }],
      hinweise: [md`Für jeden \`case\` direkt die nächste Phase zurückgeben: \`case ROT: return ROTGELB;\`.`],
    },
    {
      id: 'k11-l05-u3',
      typ: 'programm',
      titel: 'Ereignisse zählen',
      stufe: 3,
      themen: ['strukturen', 'arrays'],
      aufgabe: md`
        Die Aufzählung im Startcode endet mit \`EREIGNIS_ANZAHL\`. Dieser Trick liefert automatisch die Anzahl der echten Werte davor. Schreibe \`void zaehlen(const Ereignis e[], int n, int anzahl[])\`: Sie setzt alle \`EREIGNIS_ANZAHL\` Zähler auf 0 und zählt dann, wie oft jedes Ereignis in \`e\` vorkommt. Der Ereigniswert dient als Index.
      `,
      start: c`
        #include <stdio.h>

        typedef enum {
            TASTE_START,
            TASTE_STOP,
            UEBERSTROM,
            EREIGNIS_ANZAHL
        } Ereignis;

        int main(void) {
            Ereignis log[] = {TASTE_START, UEBERSTROM, TASTE_START};
            int anzahl[EREIGNIS_ANZAHL];
            zaehlen(log, 3, anzahl);
            printf("%d %d %d\n", anzahl[TASTE_START], anzahl[TASTE_STOP], anzahl[UEBERSTROM]);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        typedef enum {
            TASTE_START,
            TASTE_STOP,
            UEBERSTROM,
            EREIGNIS_ANZAHL
        } Ereignis;

        void zaehlen(const Ereignis e[], int n, int anzahl[]) {
            for (int i = 0; i < EREIGNIS_ANZAHL; i++) {
                anzahl[i] = 0;
            }
            for (int i = 0; i < n; i++) {
                anzahl[e[i]]++;
            }
        }

        int main(void) {
            Ereignis log[] = {TASTE_START, UEBERSTROM, TASTE_START};
            int anzahl[EREIGNIS_ANZAHL];
            zaehlen(log, 3, anzahl);
            printf("%d %d %d\n", anzahl[TASTE_START], anzahl[TASTE_STOP], anzahl[UEBERSTROM]);
            return 0;
        }
      `,
      harness: c`
        #undef main
        #include <stdio.h>
        typedef enum {
            TASTE_START,
            TASTE_STOP,
            UEBERSTROM,
            EREIGNIS_ANZAHL
        } Ereignis;
        void zaehlen(const Ereignis e[], int n, int anzahl[]);
        int main(void) {
            Ereignis log[] = {TASTE_STOP, UEBERSTROM, TASTE_START, TASTE_STOP, TASTE_STOP};
            int anzahl[EREIGNIS_ANZAHL] = {7, 7, 7};
            zaehlen(log, 5, anzahl);
            printf("%d %d %d\n", anzahl[TASTE_START], anzahl[TASTE_STOP], anzahl[UEBERSTROM]);
            return 0;
        }
      `,
      tests: [{ name: 'Fünf Ereignisse', erwartet: { stdout: '1 3 1\n' }, tipp: md`Die Zähler kommen mit beliebigen Werten an. Zuerst alle auf 0 setzen.` }],
      hinweise: [md`\`anzahl[e[i]]++\` erhöht den Zähler des Ereignisses \`e[i]\`.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k11-l05-c1',
      typ: 'eingabe',
      themen: ['strukturen', 'konstanten'],
      frage: 'Welchen Wert hat `C` in `enum { A, B, C };`?',
      antworten: ['2'],
    },
    {
      id: 'k11-l05-c2',
      typ: 'wahrfalsch',
      themen: ['strukturen'],
      aussage: 'Der Compiler verhindert, dass eine `enum`-Variable einen Wert bekommt, der keinem Namen entspricht.',
      richtig: false,
      erklaerung: 'In C ist ein `enum` nur ein `int` mit Namen.',
    },
    {
      id: 'k11-l05-c3',
      typ: 'auswahl',
      themen: ['strukturen', 'switch'],
      frage: 'Was meldet Clang, wenn ein `switch` über ein `enum` einen Wert nicht behandelt (ohne `default`)?',
      optionen: [{ text: 'Eine Warnung, dass ein Aufzählungswert nicht behandelt wird', richtig: true }, { text: 'Nichts' }, { text: 'Einen Laufzeitfehler' }],
    },
  ],
  zusammenfassung: [
    '`enum` gibt zusammengehörigen ganzzahligen Konstanten Namen.',
    'Zählung ab 0 in Schritten von 1, wenn nichts anderes angegeben ist.',
    'Mit `switch` und ohne `default` warnt Clang bei vergessenen Fällen.',
    'Ein letzter Wert wie `ANZAHL` liefert die Anzahl der Einträge.',
  ],
  referenz: ['enum', 'switch', 'typedef'],
};
