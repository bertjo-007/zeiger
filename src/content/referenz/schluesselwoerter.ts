import { c, md, out } from '../tags.ts';
import type { ReferenzEintrag } from '../types.ts';

export const eintraege: ReferenzEintrag[] = [
  {
    id: 'return',
    name: 'return',
    kategorie: 'schluesselwort',
    kurz: md`Beendet die aktuelle Funktion und gibt einen Wert an den Aufrufer zurück. In \`main\` geht der Wert an das Betriebssystem.`,
    syntax: c`
      return ausdruck;   // in Funktionen mit Rückgabewert
      return;            // in void-Funktionen
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("Selbsttest ok\n");
            return 0;
        }
      `,
      ausgabe: out`
        Selbsttest ok
      `,
    },
    fehler: [md`Code nach \`return\` wird nie ausgeführt.`, md`In einer Funktion mit Rückgabetyp fehlt auf einem Weg das \`return\`. Clang warnt: «non-void function does not return a value».`],
    lektionen: ['k01-l02'],
    stichwoerter: ['zurückgeben', 'beenden', 'Rückgabewert'],
  },
  {
    id: 'const',
    name: 'const',
    kategorie: 'schluesselwort',
    kurz: md`Macht eine Variable unveränderlich. Sie muss bei der Deklaration initialisiert werden; jeder spätere Schreibversuch ist ein Compilerfehler.`,
    syntax: c`const typ NAME = wert;`,
    beispiel: {
      code: c`
        #include <stdio.h>

        int main(void) {
            const int MAX_DREHZAHL = 3200;
            printf("Grenze: %d U/min\n", MAX_DREHZAHL);
            return 0;
        }
      `,
      ausgabe: out`
        Grenze: 3200 U/min
      `,
    },
    fehler: [md`\`const\` ohne Startwert ist nutzlos, weil man den Wert nie mehr setzen kann.`, md`Bei Zeigern genau lesen: \`const int *p\` (Wert konstant) ist nicht dasselbe wie \`int *const p\` (Zeiger konstant).`],
    lektionen: ['k02-l06'],
    stichwoerter: ['Konstante', 'unveränderlich', 'schreibgeschützt'],
  },
  {
    id: 'void',
    name: 'void',
    kategorie: 'schluesselwort',
    kurz: md`«Nichts»: Als Rückgabetyp gibt eine Funktion keinen Wert zurück, als Parameterliste \`(void)\` nimmt sie keine Parameter. \`void *\` ist ein Zeiger ohne bestimmten Typ (Kapitel 10).`,
    syntax: c`
      void zeige(void);
      void *speicher;
    `,
    beispiel: {
      code: c`
        #include <stdio.h>

        void hupe(void) {
            printf("Tuut\n");
        }

        int main(void) {
            hupe();
            return 0;
        }
      `,
      ausgabe: out`
        Tuut
      `,
    },
    fehler: [md`\`return wert;\` in einer \`void\`-Funktion.`, md`\`void main()\` statt \`int main(void)\`.`],
    lektionen: ['k07-l01', 'k07-l02'],
    stichwoerter: ['kein Rückgabewert', 'keine Parameter'],
  },
];
