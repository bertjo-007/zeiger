import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k10-l04',
  titel: 'Speicherlecks und doppeltes free',
  dauer: 25,
  stichwoerter: ['Speicherleck', 'memory leak', 'double free', 'doppeltes free', 'use after free', 'Valgrind', 'AddressSanitizer', 'aufräumen'],
  lernziele: [
    'Speicherlecks erkennen und beheben',
    'doppeltes `free` und Zugriffe nach `free` vermeiden',
    'die Meldungen der Speicherprüfung lesen',
  ],
  erklaerung: md`
    Dynamischer Speicher hat drei typische Fehler.

    **Speicherleck.** Ein Block wird nie freigegeben, meist weil die letzte Adresse verloren geht: Der Zeiger wird überschrieben, die Funktion kehrt früh zurück, oder eine Schleife überspringt das \`free\`. Ein einzelnes Leck schadet selten. In einer Schleife oder in einem Programm, das wochenlang läuft, füllt es aber nach und nach den Speicher.

    **Doppeltes free.** Derselbe Block wird zweimal freigegeben, etwa über zwei Zeiger auf denselben Block. Auf dem PC beschädigt das die Verwaltung des Heaps; das Programm stürzt oft erst viel später ab.

    **Zugriff nach free** (*use after free*). Der Block ist zurückgegeben, aber ein Zeiger zeigt noch hin. Lesen liefert vielleicht noch die alten Werte, vielleicht schon fremde Daten. Solche Fehler sind besonders tückisch, weil sie oft zufällig funktionieren.

    ### Gegenmittel

    - Für jeden Block festlegen, wer ihn besitzt (vorherige Lektion).
    - Nach \`free(p)\` sofort \`p = NULL;\` setzen. \`free(NULL)\` ist erlaubt und tut nichts, ein zweites \`free\` schadet dann nicht.
    - Alle Ausstiege einer Funktion prüfen: Jeder \`return\`, \`break\` und \`continue\` muss am Aufräumen vorbeikommen oder selbst aufräumen.

    ### Die Speicherprüfung der App

    Die App merkt sich jeden Block aus \`malloc\`, \`calloc\` und \`realloc\`. Nach dem Programmende meldet sie Blöcke, die nicht freigegeben wurden, mit ihrer Grösse und der laufenden Nummer der Reservierung. Ein doppeltes oder ungültiges \`free\` meldet sie sofort und beendet das Programm.

    > [!tipp] Werkzeuge auf dem PC
    > Unter Linux findet \`valgrind ./programm\` Lecks und ungültige Zugriffe. Mit GCC und Clang hilft \`-fsanitize=address\` beim Kompilieren; das Programm meldet die Fehler dann selbst mit Zeilenangabe.
  `,
  syntax: [
    {
      code: c`
        free(p);
        p = NULL;     // ein zweites free(p) schadet jetzt nicht mehr
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdlib.h>

      int *messung(int n) {
          int *werte = malloc((size_t)n * sizeof *werte);
          if (werte == NULL) {
              return NULL;
          }
          for (int i = 0; i < n; i++) {
              werte[i] = 20 + i;
          }
          return werte;
      }

      int main(void) {
          for (int runde = 1; runde <= 3; runde++) {
              int *w = messung(4);
              if (w == NULL) {
                  return 1;
              }
              printf("Runde %d: erster Wert %d\n", runde, w[0]);
              if (runde < 3) {
                  continue;
              }
              free(w);
          }
          return 0;
      }
    `,
    ausgabe: out`
      Runde 1: erster Wert 20
      Runde 2: erster Wert 20
      Runde 3: erster Wert 20
    `,
    fehlerErwartet: 'laufzeit',
  },
  zeilen: [
    { zeilen: '5', text: md`Jeder Aufruf von \`messung\` reserviert einen neuen Block von 16 Byte.` },
    { zeilen: '17', text: md`In jeder Runde kommt ein neuer Block. Die Adresse steht nur in \`w\`.` },
    { zeilen: '22-24', text: md`In Runde 1 und 2 springt \`continue\` am \`free\` vorbei. Mit dem nächsten Durchlauf wird \`w\` überschrieben, die alte Adresse ist verloren.` },
    { zeilen: '25', text: md`Nur der dritte Block wird freigegeben.` },
  ],
  ergebnis: md`
    Die Ausgabe sieht richtig aus, trotzdem meldet die App nach dem Lauf zwei Speicherlecks von je 16 Byte, aus der 1. und der 2. Reservierung. Die Korrektur: \`free(w);\` vor das \`continue\` setzen oder die Schleife so umbauen, dass jeder Durchlauf am \`free\` vorbeikommt. Ändere das Beispiel und führe es erneut aus: Die Meldung verschwindet.
  `,
  fehler: [
    {
      titel: 'Zeiger überschreiben',
      text: md`Ein neues \`malloc\` in denselben Zeiger, ohne den alten Block freizugeben, ist ein Leck.`,
      falsch: c`
        puffer = malloc(64);
        puffer = malloc(128);
      `,
      richtig: c`
        free(puffer);
        puffer = malloc(128);
      `,
    },
    {
      titel: 'Zwei Zeiger, zwei free',
      text: md`Zeigen \`a\` und \`b\` auf denselben Block, darf nur einer von beiden freigegeben werden.`,
      falsch: c`
        int *b = a;
        free(a);
        free(b);
      `,
      richtig: c`
        int *b = a;
        free(a);
        a = NULL;
        b = NULL;
      `,
    },
    {
      titel: 'Nach free weiterlesen',
      text: md`\`free(w); printf("%d", w[0]);\` liest einen zurückgegebenen Block. Erst alle Werte verwenden, dann freigeben.`,
    },
  ],
  uebungen: [
    {
      id: 'k10-l04-u1',
      typ: 'fehlersuche',
      titel: 'Leck in der Schleife',
      stufe: 2,
      themen: ['speicher', 'fehler'],
      aufgabe: md`
        Das Programm nummeriert die Zeilen der Eingabe. Die Ausgabe stimmt, aber die Speicherprüfung meldet Lecks. Behebe sie.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>
        #include <string.h>

        int main(void) {
            char zeile[64];
            int nr = 0;
            while (fgets(zeile, sizeof zeile, stdin) != NULL) {
                size_t groesse = strlen(zeile) + 1;
                char *kopie = malloc(groesse);
                if (kopie == NULL) {
                    return 1;
                }
                memcpy(kopie, zeile, groesse);
                kopie[strcspn(kopie, "\n")] = '\0';
                nr++;
                printf("%d: %s\n", nr, kopie);
            }
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdlib.h>
        #include <string.h>

        int main(void) {
            char zeile[64];
            int nr = 0;
            while (fgets(zeile, sizeof zeile, stdin) != NULL) {
                size_t groesse = strlen(zeile) + 1;
                char *kopie = malloc(groesse);
                if (kopie == NULL) {
                    return 1;
                }
                memcpy(kopie, zeile, groesse);
                kopie[strcspn(kopie, "\n")] = '\0';
                nr++;
                printf("%d: %s\n", nr, kopie);
                free(kopie);
            }
            return 0;
        }
      `,
      stdin: 'Pumpe\nVentil\nMotor\n',
      tests: [{ name: 'Drei Zeilen', stdin: 'Pumpe\nVentil\nMotor\n', erwartet: { stdout: '1: Pumpe\n2: Ventil\n3: Motor\n', sauber: true }, tipp: md`Jeder Durchlauf reserviert einen Block. Wo wird er freigegeben?` }],
      hinweise: [md`Am Ende jedes Schleifendurchlaufs wird \`kopie\` nicht mehr gebraucht.`],
    },
    {
      id: 'k10-l04-u2',
      typ: 'fehlersuche',
      titel: 'Doppelt freigegeben',
      stufe: 2,
      themen: ['speicher', 'fehler', 'zeiger'],
      aufgabe: md`
        Das Programm gibt die Summe aus, bricht danach aber mit einer Meldung der Speicherprüfung ab. Repariere es so, dass es normal endet und kein Speicher übrig bleibt.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int *a = malloc(3 * sizeof *a);
            if (a == NULL) {
                return 1;
            }
            int *b = a;
            a[0] = 1;
            a[1] = 2;
            a[2] = 3;
            printf("%d\n", b[0] + b[1] + b[2]);
            free(a);
            free(b);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int *a = malloc(3 * sizeof *a);
            if (a == NULL) {
                return 1;
            }
            int *b = a;
            a[0] = 1;
            a[1] = 2;
            a[2] = 3;
            printf("%d\n", b[0] + b[1] + b[2]);
            free(a);
            return 0;
        }
      `,
      tests: [{ name: 'Normales Ende', erwartet: { stdout: '6\n', exitCode: 0, sauber: true }, tipp: md`\`a\` und \`b\` zeigen auf denselben Block.` }],
      hinweise: [md`Wie viele Blöcke werden reserviert, und wie oft wird freigegeben?`],
    },
    {
      id: 'k10-l04-u3',
      typ: 'auswahl',
      titel: 'Schutz nach free',
      stufe: 1,
      themen: ['speicher'],
      frage: 'Was macht ein versehentliches zweites `free(p)` harmlos?',
      optionen: [{ text: 'Nach dem ersten `free(p)` sofort `p = NULL;` setzen', richtig: true }, { text: 'Vor dem `free` den Inhalt auf 0 setzen' }, { text: '`calloc` statt `malloc` verwenden' }],
    },
  ],
  wissenscheck: [
    {
      id: 'k10-l04-c1',
      typ: 'wahrfalsch',
      themen: ['speicher'],
      aussage: '`free(NULL)` ist erlaubt und tut nichts.',
      richtig: true,
    },
    {
      id: 'k10-l04-c2',
      typ: 'auswahl',
      themen: ['speicher', 'fehler'],
      frage: 'Was ist ein Speicherleck?',
      optionen: [{ text: 'Ein reservierter Block, der nie freigegeben wird', richtig: true }, { text: 'Ein Zugriff über einen Nullzeiger' }, { text: 'Ein Array, das zu klein ist' }],
    },
    {
      id: 'k10-l04-c3',
      typ: 'eingabe',
      themen: ['speicher'],
      frage: 'Ein Programm ruft dreimal erfolgreich `malloc` auf. Wie oft muss es `free` aufrufen?',
      antworten: ['3', 'drei', 'dreimal'],
    },
  ],
  zusammenfassung: [
    'Ein Leck entsteht, wenn die letzte Adresse eines Blocks verloren geht.',
    'Jeden Block genau einmal freigeben; danach den Zeiger auf `NULL` setzen.',
    'Nach `free` nicht mehr auf den Block zugreifen.',
    'Alle Ausstiege (`return`, `break`, `continue`) auf fehlende `free` prüfen.',
  ],
  referenz: ['free', 'malloc'],
};
