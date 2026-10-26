import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

/** Schlüsselwörter für den Programmablauf: Bedingungen und Schleifen. */
export const eintraege: ReferenzEintrag[] = [
  {
    id: 'if-else',
    name: 'if / else',
    kategorie: 'schluesselwort',
    kurz: md`Führt einen Block nur aus, wenn eine Bedingung wahr ist; \`else\` für den anderen Fall, \`else if\` für weitere Bereiche.`,
    syntax: c`
      if (bedingung) {
          …
      } else if (andere_bedingung) {
          …
      } else {
          …
      }
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int druck = 7;
            if (druck > 8) {
                printf("zu hoch\n");
            } else if (druck < 2) {
                printf("zu tief\n");
            } else {
                printf("ok\n");
            }
            return 0;
        }
      `,
      ausgabe: out`
        ok
      `,
    },
    fehler: [md`Strichpunkt nach der Bedingung: \`if (x);\`.`, md`Fehlende geschweifte Klammern bei mehreren Anweisungen.`, md`\`=\` statt \`==\`.`],
    lektionen: ['k05-l01', 'k05-l02'],
    stichwoerter: ['wenn', 'sonst', 'Bedingung', 'Verzweigung', 'else if'],
  },
  {
    id: 'switch',
    name: 'switch / case / default',
    kategorie: 'schluesselwort',
    kurz: md`Mehrfachauswahl über einen ganzzahligen Wert. Springt zum passenden \`case\` und läuft bis zum nächsten \`break\`.`,
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
            char befehl = 'S';
            switch (befehl) {
                case 'S':
                    printf("Start\n");
                    break;
                case 'H':
                    printf("Halt\n");
                    break;
                default:
                    printf("?\n");
                    break;
            }
            return 0;
        }
      `,
      ausgabe: out`
        Start
      `,
    },
    fehler: [md`\`break\` vergessen (ungewollter Fallthrough).`, md`Keine Bereiche, Kommazahlen oder Texte als \`case\`.`],
    lektionen: ['k05-l03', 'k05-l05'],
    stichwoerter: ['Mehrfachauswahl', 'case', 'default', 'Menü'],
  },
  {
    id: 'break',
    name: 'break',
    kategorie: 'schluesselwort',
    kurz: md`Beendet die innerste Schleife oder einen \`switch\` sofort.`,
    syntax: c`break;`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            for (int i = 1; i <= 10; i++) {
                if (i * i > 20) {
                    break;
                }
                printf("%d ", i);
            }
            printf("\n");
            return 0;
        }
      `,
      ausgabe: out`
        1 2 3 4
      `,
    },
    fehler: [md`\`break\` verlässt nur die **innerste** Schleife, nicht alle verschachtelten.`],
    lektionen: ['k05-l03', 'k06-l06'],
    stichwoerter: ['abbrechen', 'Schleife verlassen'],
  },
  {
    id: 'ternaer',
    name: '?: (Bedingungsoperator)',
    kategorie: 'operator',
    kurz: md`Wählt einen von zwei Werten: \`bedingung ? a : b\`.`,
    syntax: c`ergebnis = (bedingung) ? wert_wahr : wert_falsch;`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int a = 12, b = 30;
            printf("Maximum %d, Motor %s\n", a > b ? a : b, a > 0 ? "an" : "aus");
            return 0;
        }
      `,
      ausgabe: out`
        Maximum 30, Motor an
      `,
    },
    fehler: [md`Sehr niedrige Rangfolge: Klammern setzen.`, md`Nicht für Aktionen oder lange Ketten verwenden.`],
    lektionen: ['k05-l04'],
    stichwoerter: ['ternär', 'Kurzform', 'Minimum', 'Maximum'],
  },
  {
    id: 'while',
    name: 'while',
    kategorie: 'schluesselwort',
    kurz: md`Wiederholt einen Block, solange die Bedingung wahr ist. Die Bedingung wird **vor** jedem Durchlauf geprüft.`,
    syntax: c`
      while (bedingung) {
          …
      }
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int fuellstand = 0;
            while (fuellstand < 100) {
                fuellstand += 30;
            }
            printf("%d\n", fuellstand);
            return 0;
        }
      `,
      ausgabe: out`
        120
      `,
    },
    fehler: [md`Bedingung ändert sich nie: Endlosschleife.`, md`Strichpunkt nach \`while (…)\`.`],
    lektionen: ['k06-l01'],
    stichwoerter: ['Schleife', 'solange', 'wiederholen'],
  },
  {
    id: 'do-while',
    name: 'do … while',
    kategorie: 'schluesselwort',
    kurz: md`Schleife, die **mindestens einmal** läuft; die Bedingung wird erst nach dem Durchlauf geprüft. Ideal für Eingaben, die wiederholt werden, bis sie gültig sind.`,
    syntax: c`
      do {
          …
      } while (bedingung);
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            int n = 0;
            do {
                printf("Durchlauf %d\n", n);
                n++;
            } while (n < 2);
            return 0;
        }
      `,
      ausgabe: out`
        Durchlauf 0
        Durchlauf 1
      `,
    },
    fehler: [md`Strichpunkt nach \`while (…)\` vergessen.`],
    lektionen: ['k06-l02'],
    stichwoerter: ['Schleife', 'mindestens einmal', 'fussgesteuert'],
  },
  {
    id: 'for',
    name: 'for',
    kategorie: 'schluesselwort',
    kurz: md`Zählschleife: Initialisierung, Bedingung und Schritt in einer Zeile.`,
    syntax: c`
      for (int i = 0; i < n; i++) {
          …
      }
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            for (int i = 3; i >= 1; i--) {
                printf("%d ", i);
            }
            printf("Start\n");
            return 0;
        }
      `,
      ausgabe: out`
        3 2 1 Start
      `,
    },
    fehler: [md`\`<=\` statt \`<\`: ein Durchlauf zu viel (Off-by-one).`, md`Kommas statt Strichpunkten im Kopf.`],
    lektionen: ['k06-l03', 'k06-l04'],
    stichwoerter: ['Zählschleife', 'Schleife', 'Zähler'],
  },
  {
    id: 'continue',
    name: 'continue',
    kategorie: 'schluesselwort',
    kurz: md`Überspringt den Rest des aktuellen Schleifendurchlaufs und macht mit dem nächsten weiter.`,
    syntax: c`continue;`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            for (int i = 1; i <= 6; i++) {
                if (i % 3 == 0) {
                    continue;
                }
                printf("%d ", i);
            }
            printf("\n");
            return 0;
        }
      `,
      ausgabe: out`
        1 2 4 5
      `,
    },
    fehler: [md`In einer \`while\`-Schleife kann \`continue\` das Hochzählen überspringen: Endlosschleife.`],
    lektionen: ['k06-l06'],
    stichwoerter: ['überspringen', 'weiter'],
  },
];
