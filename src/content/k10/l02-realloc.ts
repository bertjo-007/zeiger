import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k10-l02',
  titel: 'calloc und realloc',
  dauer: 30,
  stichwoerter: ['calloc', 'realloc', 'vergrössern', 'dynamisches Array', 'Kapazität', 'mit Nullen'],
  lernziele: [
    'mit `calloc` mit Nullen gefüllten Speicher reservieren',
    'einen Block mit `realloc` vergrössern, ohne Daten zu verlieren',
    'ein wachsendes Array mit Kapazität und Anzahl umsetzen',
  ],
  erklaerung: md`
    Neben \`malloc\` gibt es zwei weitere Funktionen für dynamischen Speicher.

    **\`calloc(anzahl, groesse)\`** reserviert Platz für \`anzahl\` Elemente der Grösse \`groesse\` und füllt ihn mit **Nullen**. Praktisch für Zähler und Tabellen, die bei 0 beginnen.

    ~~~c
    int *zaehler = calloc(10, sizeof *zaehler);   // zehn Zähler, alle 0
    ~~~

    **\`realloc(zeiger, neue_groesse)\`** ändert die Grösse eines Blocks. Der alte Inhalt bleibt erhalten. Passt der grössere Block nicht an die alte Stelle, kopiert \`realloc\` die Daten an eine neue Adresse und gibt den alten Block frei. Darum muss man immer mit der **zurückgegebenen** Adresse weiterarbeiten.

    ### Das sichere Muster

    Schlägt \`realloc\` fehl, liefert es \`NULL\`, und der **alte Block bleibt bestehen**. Schreibt man das Ergebnis direkt in den alten Zeiger, ist die alte Adresse verloren, und der Block kann nie mehr freigegeben werden. Darum zuerst in einen Hilfszeiger:

    ~~~c
    int *neu = realloc(werte, neue_anzahl * sizeof *werte);
    if (neu == NULL) {
        free(werte);       // oder mit den alten Daten weiterarbeiten
        return 1;
    }
    werte = neu;
    ~~~

    ### Wachsende Arrays

    Weiss man nicht, wie viele Werte kommen, merkt man sich zwei Zahlen: die **Kapazität** (so viel Platz ist reserviert) und die **Anzahl** (so viel ist belegt). Ist der Platz voll, verdoppelt man die Kapazität. Das Verdoppeln sorgt dafür, dass nur selten kopiert werden muss.

    > [!tipp] realloc mit NULL
    > \`realloc(NULL, n)\` verhält sich wie \`malloc(n)\`. So kann ein wachsendes Array auch leer mit \`NULL\` beginnen.
  `,
  syntax: [
    {
      code: c`
        typ *p = calloc(anzahl, sizeof *p);          // mit Nullen
        typ *neu = realloc(p, neue_anzahl * sizeof *p);
        if (neu != NULL) {
            p = neu;
        }
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          size_t kapazitaet = 2;
          size_t anzahl = 0;
          int *werte = malloc(kapazitaet * sizeof *werte);
          if (werte == NULL) {
              return 1;
          }

          int w;
          while (scanf("%d", &w) == 1) {
              if (anzahl == kapazitaet) {
                  size_t neu_kap = kapazitaet * 2;
                  int *neu = realloc(werte, neu_kap * sizeof *werte);
                  if (neu == NULL) {
                      free(werte);
                      return 1;
                  }
                  werte = neu;
                  kapazitaet = neu_kap;
                  printf("(Platz für %zu Werte)\n", kapazitaet);
              }
              werte[anzahl] = w;
              anzahl++;
          }

          int *klassen = calloc(3, sizeof *klassen);
          if (klassen == NULL) {
              free(werte);
              return 1;
          }
          for (size_t i = 0; i < anzahl; i++) {
              int k = werte[i] < 0 ? 0 : (werte[i] == 0 ? 1 : 2);
              klassen[k]++;
          }
          printf("%zu Werte: %d negativ, %d null, %d positiv\n", anzahl, klassen[0], klassen[1], klassen[2]);

          free(klassen);
          free(werte);
          return 0;
      }
    `,
    stdin: '5 -3 0 8 13\n',
    ausgabe: out`
      5 -3 0 8 13
      (Platz für 4 Werte)
      (Platz für 8 Werte)
      5 Werte: 1 negativ, 1 null, 3 positiv
    `,
  },
  zeilen: [
    { zeilen: '5-7', text: md`Start mit Platz für zwei Werte; noch ist nichts belegt.` },
    { zeilen: '14', text: md`Ist alles belegt, muss der Block wachsen.` },
    { zeilen: '16', text: md`\`realloc\` in einen Hilfszeiger. Der alte Inhalt wird übernommen.` },
    { zeilen: '17-20', text: md`Bei einem Fehler ist \`werte\` noch gültig und wird freigegeben.` },
    { zeilen: '21-22', text: md`Erst nach dem Erfolg die neue Adresse und Kapazität übernehmen.` },
    { zeilen: '29', text: md`\`calloc\` liefert drei Zähler, die schon 0 sind.` },
    { zeilen: '40-41', text: md`Beide Blöcke zurückgeben.` },
  ],
  ergebnis: md`
    Das Array ist zweimal gewachsen, von 2 auf 4 und von 4 auf 8 Plätze. Alle fünf Werte sind erhalten geblieben, obwohl \`realloc\` die Daten dabei verschieben durfte. Die Zähler aus \`calloc\` starten bei 0 und brauchen keine Schleife zum Nullsetzen.
  `,
  fehler: [
    {
      titel: 'Ergebnis von realloc direkt zuweisen',
      text: md`Liefert \`realloc\` \`NULL\`, ist die alte Adresse überschrieben und der Block verloren.`,
      falsch: c`werte = realloc(werte, n * sizeof *werte);`,
      richtig: c`
        int *neu = realloc(werte, n * sizeof *werte);
        if (neu == NULL) { /* Fehler behandeln, werte ist noch gültig */ }
        werte = neu;
      `,
    },
    {
      titel: 'Alte Zeiger weiterverwenden',
      text: md`Zeigte ein anderer Zeiger in den alten Block, ist er nach einem \`realloc\` möglicherweise ungültig. Nach dem Vergrössern nur noch über die neue Adresse zugreifen.`,
    },
    {
      titel: 'calloc-Argumente vertauscht',
      text: md`Die Reihenfolge ist Anzahl, dann Grösse. Vertauscht funktioniert es zwar meist, ist aber schwer zu lesen.`,
    },
  ],
  uebungen: [
    {
      id: 'k10-l02-u1',
      typ: 'vorhersage',
      titel: 'Was steht in calloc-Speicher?',
      stufe: 1,
      themen: ['speicher'],
      code: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int *z = calloc(5, sizeof *z);
            if (z == NULL) {
                return 1;
            }
            z[1] = 4;
            z[3] = z[1] * 2;
            int s = 0;
            for (int i = 0; i < 5; i++) {
                s += z[i];
            }
            printf("%d %d\n", z[0], s);
            free(z);
            return 0;
        }
      `,
      ausgabe: out`
        0 12
      `,
    },
    {
      id: 'k10-l02-u2',
      typ: 'auswahl',
      titel: 'Gefährliches realloc',
      stufe: 1,
      themen: ['speicher', 'fehler'],
      frage: 'Was ist an `p = realloc(p, n * sizeof *p);` problematisch?',
      optionen: [
        { text: 'Liefert `realloc` `NULL`, ist die alte Adresse verloren und der Block kann nicht mehr freigegeben werden.', richtig: true },
        { text: '`realloc` darf nie dem gleichen Zeiger zugewiesen werden, das ist ein Compilerfehler.' },
        { text: 'Der Inhalt geht dabei immer verloren.' },
      ],
    },
    {
      id: 'k10-l02-u3',
      typ: 'programm',
      titel: 'Unbekannt viele Werte',
      stufe: 2,
      themen: ['speicher', 'arrays', 'schleifen'],
      aufgabe: md`
        Lies ganze Zahlen bis zum Ende der Eingabe in ein Array, das mit \`realloc\` wächst. Gib danach die Anzahl, einen Doppelpunkt und die Werte in umgekehrter Reihenfolge aus, jeweils mit einem Leerzeichen davor:

        ~~~
        3: 30 20 10
        ~~~

        Ohne Werte lautet die Ausgabe \`0:\`. Am Ende darf kein Speicher belegt bleiben.
      `,
      start: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int *werte = NULL;
            size_t anzahl = 0;
            size_t kapazitaet = 0;

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>
        #include <stdlib.h>

        int main(void) {
            int *werte = NULL;
            size_t anzahl = 0;
            size_t kapazitaet = 0;

            int w;
            while (scanf("%d", &w) == 1) {
                if (anzahl == kapazitaet) {
                    size_t neu_kap = kapazitaet == 0 ? 4 : kapazitaet * 2;
                    int *neu = realloc(werte, neu_kap * sizeof *werte);
                    if (neu == NULL) {
                        free(werte);
                        return 1;
                    }
                    werte = neu;
                    kapazitaet = neu_kap;
                }
                werte[anzahl] = w;
                anzahl++;
            }

            printf("%zu:", anzahl);
            for (size_t i = anzahl; i > 0; i--) {
                printf(" %d", werte[i - 1]);
            }
            printf("\n");
            free(werte);
            return 0;
        }
      `,
      stdin: '10 20 30\n',
      tests: [
        { name: 'Drei Werte', stdin: '10 20 30\n', erwartet: { stdout: '3: 30 20 10\n', sauber: true } },
        { name: 'Viele Werte', stdin: '1 2 3 4 5 6 7 8 9 10 11\n', erwartet: { stdout: '11: 11 10 9 8 7 6 5 4 3 2 1\n', sauber: true }, tipp: md`Wächst das Array auch mehrmals?` },
        { name: 'Keine Werte', stdin: '', erwartet: { stdout: '0:\n', sauber: true } },
      ],
      regeln: [{ muss: '\\brealloc\\s*\\(', meldung: 'Vergrössere das Array mit `realloc`.' }],
      hinweise: [
        md`\`realloc(NULL, n)\` wirkt wie \`malloc\`. Beginne also mit \`werte = NULL\` und Kapazität 0.`,
        md`Rückwärts mit \`size_t\`: \`for (size_t i = anzahl; i > 0; i--)\` und darin \`werte[i - 1]\`.`,
      ],
    },
  ],
  wissenscheck: [
    {
      id: 'k10-l02-c1',
      typ: 'wahrfalsch',
      themen: ['speicher'],
      aussage: '`calloc` füllt den reservierten Speicher mit Nullen.',
      richtig: true,
    },
    {
      id: 'k10-l02-c2',
      typ: 'auswahl',
      themen: ['speicher'],
      frage: 'Was passiert mit dem alten Inhalt, wenn `realloc` einen Block vergrössert?',
      optionen: [{ text: 'Er bleibt erhalten, notfalls an eine neue Adresse kopiert.', richtig: true }, { text: 'Er wird gelöscht.' }, { text: 'Nur das erste Element bleibt erhalten.' }],
    },
    {
      id: 'k10-l02-c3',
      typ: 'eingabe',
      themen: ['speicher'],
      frage: 'Wie viele Byte reserviert `calloc(4, sizeof(double))`?',
      antworten: ['32'],
    },
  ],
  zusammenfassung: [
    '`calloc(anzahl, groesse)` reserviert und füllt mit Nullen.',
    '`realloc` ändert die Grösse und behält den Inhalt; die Adresse kann sich ändern.',
    'Ergebnis von `realloc` immer zuerst in einen Hilfszeiger.',
    'Wachsende Arrays: Kapazität und Anzahl getrennt führen, beim Vergrössern verdoppeln.',
  ],
  referenz: ['calloc', 'realloc', 'free'],
};
