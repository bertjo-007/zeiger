import { c, md } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'esc-n',
    name: '\\n',
    kategorie: 'escape',
    kurz: md`Zeilenumbruch: Die Ausgabe geht in der nächsten Zeile weiter.`,
    syntax: c`printf("Zeile 1\nZeile 2\n");`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("Ein\nAus\n");
            return 0;
        }
      `,
      ausgabe: 'Ein\nAus\n',
    },
    fehler: [md`\`/n\` mit Schrägstrich ist kein Zeilenumbruch, sondern zwei normale Zeichen.`],
    lektionen: ['k01-l03'],
    stichwoerter: ['Zeilenumbruch', 'neue Zeile', 'newline'],
  },
  {
    id: 'esc-t',
    name: '\\t',
    kategorie: 'escape',
    kurz: md`Tabulator: springt zur nächsten Tab-Position. Für einfache Spalten.`,
    syntax: c`printf("Name\tWert\n");`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("T1\t21.5\n");
            printf("T2\t19.0\n");
            return 0;
        }
      `,
      ausgabe: 'T1\t21.5\nT2\t19.0\n',
    },
    fehler: [md`Spalten verrutschen, wenn ein Eintrag länger als eine Tab-Breite ist. Dann besser Feldbreiten wie \`%-10s\` verwenden.`],
    lektionen: ['k01-l03'],
    stichwoerter: ['Tabulator', 'Spalte', 'tab'],
  },
  {
    id: 'esc-quote',
    name: '\\"',
    kategorie: 'escape',
    kurz: md`Ein Anführungszeichen innerhalb einer Zeichenkette.`,
    syntax: c`printf("Er sagte \"Hallo\"\n");`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("Modus: \"Automatik\"\n");
            return 0;
        }
      `,
      ausgabe: 'Modus: "Automatik"\n',
    },
    fehler: [md`Ein \`"\` ohne Backslash beendet den String vorzeitig.`],
    lektionen: ['k01-l03'],
    stichwoerter: ['Anführungszeichen'],
  },
  {
    id: 'esc-backslash',
    name: '\\\\',
    kategorie: 'escape',
    kurz: md`Ein einzelner Backslash, zum Beispiel in Windows-Pfaden.`,
    syntax: c`printf("C:\\Daten\\log.txt\n");`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("C:\\Messungen\\heute.csv\n");
            return 0;
        }
      `,
      ausgabe: 'C:\\Messungen\\heute.csv\n',
    },
    fehler: [md`Ein einzelner Backslash leitet eine Escape-Sequenz ein. Aus \`"C:\Temp"\` wird \`\T\`, das keine gültige Sequenz ist.`],
    lektionen: ['k01-l03'],
    stichwoerter: ['Backslash', 'Pfad'],
  },
];
