import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k01-l04',
  titel: 'Kommentare',
  dauer: 15,
  stichwoerter: ['Kommentar', '//', '/*', '*/', 'auskommentieren', 'Dokumentation', 'Kopfkommentar'],
  lernziele: [
    'einzeilige (`//`) und mehrzeilige (`/* … */`) Kommentare schreiben',
    'Code vorübergehend auskommentieren',
    'hilfreiche von überflüssigen Kommentaren unterscheiden',
  ],
  erklaerung: md`
    Ein **Kommentar** ist Text im Quellcode, den der Compiler vollständig ignoriert. Er ist nur für Menschen da: für dich in drei Wochen, für Kolleginnen und Kollegen oder für die Lehrperson, die deinen Code liest.

    ### Zwei Schreibweisen

    - **\`//\`** leitet einen einzeiligen Kommentar ein. Alles bis zum Zeilenende wird ignoriert.
    - **\`/*\`** beginnt einen Kommentar, der erst bei **\`*/\`** endet, auch über mehrere Zeilen.

    Mehrzeilige Kommentare lassen sich **nicht verschachteln**: Das erste \`*/\` beendet den Kommentar, egal wie viele \`/*\` davor standen.

    ### Auskommentieren

    Kommentare sind praktisch, um eine Zeile kurz «abzuschalten», ohne sie zu löschen. Bei der Fehlersuche kann man so prüfen, ob ein bestimmter Teil das Problem verursacht. In vielen Editoren, auch hier, schaltet <kbd>Strg</kbd>+<kbd>/</kbd> den Kommentar für die aktuelle Zeile um.

    ### Was gehört in einen Kommentar?

    Gute Kommentare erklären, **warum** etwas so gemacht wird, oder was nicht offensichtlich ist: Einheiten, Grenzwerte, Annahmen über die Hardware. Schlechte Kommentare wiederholen nur, was ohnehin im Code steht.

    ~~~c
    printf("Pumpe aus\n");   // gibt «Pumpe aus» aus           (überflüssig)
    printf("Pumpe aus\n");   // Trockenlaufschutz: Tank < 10 % (hilfreich)
    ~~~

    Üblich ist ausserdem ein **Kopfkommentar** am Dateianfang: wozu das Programm dient, wer es geschrieben hat und wann.

    > [!achtung] Veraltete Kommentare
    > Ein Kommentar, der nicht mehr zum Code passt, ist schlimmer als keiner. Wenn du Code änderst, passe den Kommentar mit an.

    > [!info] Seit wann gibt es //?
    > Der einzeilige Kommentar \`//\` kam erst mit C99 offiziell in die Sprache. In sehr alten Projekten (C89) findest du darum nur \`/* … */\`. Heute darfst du beides verwenden.
  `,
  syntax: [
    {
      code: c`
        // einzeiliger Kommentar bis zum Zeilenende
        printf("Start\n");   // Kommentar hinter einer Anweisung

        /* mehrzeiliger Kommentar:
           beginnt mit Schrägstrich-Stern
           und endet mit Stern-Schrägstrich */
      `,
    },
  ],
  beispiel: {
    code: c`
      /*
       * Förderband-Anzeige
       * Gibt die Grundeinstellungen der Anlage aus.
       */
      #include <stdio.h>

      int main(void) {
          // Geschwindigkeit in Metern pro Minute
          printf("Geschwindigkeit: 12 m/min\n");
          /* printf("Wartungsmodus aktiv\n"); */
          printf("Richtung: vorwärts\n");   // vorwärts = zur Packstation
          return 0;
      }
    `,
    ausgabe: out`
      Geschwindigkeit: 12 m/min
      Richtung: vorwärts
    `,
  },
  zeilen: [
    { zeilen: '1-4', text: md`Kopfkommentar über mehrere Zeilen. Die Sterne am Zeilenanfang sind nur Verzierung; wichtig sind \`/*\` am Anfang und \`*/\` am Ende.` },
    { zeilen: '8', text: md`Einzeiliger Kommentar, der die Einheit des folgenden Werts nennt.` },
    { zeilen: '10', text: md`Diese Anweisung ist auskommentiert. Sie bleibt im Code stehen, wird aber nicht ausgeführt.` },
    { zeilen: '11', text: md`Kommentar hinter einer Anweisung. Alles ab \`//\` wird ignoriert, das \`printf\` davor läuft normal.` },
  ],
  ergebnis: md`
    Es erscheinen nur zwei Zeilen. Die Zeile «Wartungsmodus aktiv» fehlt, weil sie auskommentiert ist. Entferne im Beispiel \`/*\` und \`*/\` in Zeile 10 und führe es erneut aus: Dann erscheint sie.
  `,
  fehler: [
    {
      titel: 'Kommentar nicht geschlossen',
      text: md`Fehlt das \`*/\`, reicht der Kommentar bis zum nächsten \`*/\` oder bis zum Dateiende. Der Code dazwischen verschwindet einfach, oft ohne klare Fehlermeldung an der richtigen Stelle.`,
      falsch: c`
        /* Testausgabe
        printf("A\n");
        printf("B\n");
      `,
      richtig: c`
        /* Testausgabe */
        printf("A\n");
        printf("B\n");
      `,
    },
    {
      titel: 'Verschachtelte Kommentare',
      text: md`Ein \`/* … */\` innerhalb eines anderen funktioniert nicht: Das erste \`*/\` beendet alles, und der Rest wird zu ungültigem Code. Zum Auskommentieren grösserer Blöcke mit Kommentaren darin nimmt man \`//\` vor jeder Zeile oder \`#if 0 … #endif\` (Kapitel 13).`,
      falsch: c`
        /* alter Block:
           printf("x\n"); /* Test */
           printf("y\n");
        */
      `,
    },
  ],
  uebungen: [
    {
      id: 'k01-l04-u1',
      typ: 'vorhersage',
      titel: 'Was bleibt übrig?',
      stufe: 1,
      themen: ['kommentare'],
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("A\n");
            // printf("B\n");
            /* printf("C\n");
            printf("D\n"); */
            printf("E\n"); // printf("F\n");
            return 0;
        }
      `,
      ausgabe: out`
        A
        E
      `,
      erklaerung: md`B ist einzeilig auskommentiert, C und D stehen im mehrzeiligen Kommentar, und F steht hinter \`//\` in der Zeile von E.`,
    },
    {
      id: 'k01-l04-u2',
      typ: 'fehlersuche',
      titel: 'Not-Aus wieder aktivieren',
      stufe: 1,
      themen: ['kommentare'],
      aufgabe: md`
        Beim Testen wurde eine Zeile auskommentiert und vergessen. Das Programm soll alle drei Prüfschritte ausgeben:

        ~~~text
        Spannung geprüft
        Not-Aus geprüft
        Schutztür geprüft
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            printf("Spannung geprüft\n");
            // printf("Not-Aus geprüft\n");
            printf("Schutztür geprüft\n");
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            printf("Spannung geprüft\n");
            printf("Not-Aus geprüft\n");
            printf("Schutztür geprüft\n");
            return 0;
        }
      `,
      tests: [{ name: 'Alle drei Prüfschritte', erwartet: { stdout: 'Spannung geprüft\nNot-Aus geprüft\nSchutztür geprüft\n' } }],
      hinweise: [md`Entferne die \`//\` vor der mittleren Zeile.`],
    },
    {
      id: 'k01-l04-u3',
      typ: 'fehlersuche',
      titel: 'Der verschluckte Code',
      stufe: 2,
      themen: ['kommentare'],
      aufgabe: md`
        Dieses Programm soll drei Zeilen ausgeben, gibt aber nur eine aus. Finde heraus, warum, und korrigiere es. Der Kopfkommentar soll ein Kommentar bleiben.

        ~~~text
        Linie 1: läuft
        Linie 2: läuft
        Linie 3: Wartung
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            /* Statusanzeige der drei Linien
            printf("Linie 1: läuft\n");
            printf("Linie 2: läuft\n");
            /* Linie 3 ist diese Woche in Wartung */
            printf("Linie 3: Wartung\n");
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            /* Statusanzeige der drei Linien */
            printf("Linie 1: läuft\n");
            printf("Linie 2: läuft\n");
            /* Linie 3 ist diese Woche in Wartung */
            printf("Linie 3: Wartung\n");
            return 0;
        }
      `,
      tests: [{ name: 'Alle drei Linien', erwartet: { stdout: 'Linie 1: läuft\nLinie 2: läuft\nLinie 3: Wartung\n' } }],
      hinweise: [md`Wo endet der erste Kommentar wirklich? Achte auf die Färbung im Editor.`, md`Dem ersten Kommentar fehlt sein \`*/\`. Er endet erst beim \`*/\` des zweiten Kommentars.`],
    },
    {
      id: 'k01-l04-u4',
      typ: 'auswahl',
      titel: 'Guter Kommentar',
      stufe: 2,
      themen: ['kommentare', 'stil'],
      frage: 'Welcher Kommentar ist für diese Zeile am hilfreichsten?\n\n~~~c\nprintf("Heizung aus\\n");\n~~~',
      optionen: [
        { text: '`// Heizung aus ausgeben`', warum: 'Das steht schon im Code. Der Kommentar wiederholt nur.' },
        { text: '`// Übertemperatur: Grenze 85 Grad laut Datenblatt`', richtig: true, warum: 'Er erklärt, warum die Heizung ausgeht, und nennt eine Information, die im Code nicht steht.' },
        { text: '`// printf`', warum: 'Er sagt nichts aus.' },
      ],
    },
  ],
  wissenscheck: [
    {
      id: 'k01-l04-c1',
      typ: 'wahrfalsch',
      themen: ['kommentare'],
      aussage: 'Kommentare machen das fertige Programm grösser und langsamer.',
      richtig: false,
      erklaerung: 'Der Compiler entfernt Kommentare vollständig. Sie kosten im fertigen Programm nichts.',
    },
    {
      id: 'k01-l04-c2',
      typ: 'eingabe',
      themen: ['kommentare'],
      frage: 'Mit welchen zwei Zeichen endet ein mehrzeiliger Kommentar?',
      antworten: ['*/'],
      exakt: true,
    },
    {
      id: 'k01-l04-c3',
      typ: 'auswahl',
      themen: ['kommentare'],
      frage: 'Was passiert bei `/* aussen /* innen */ rest */`?',
      optionen: [
        { text: 'Der Kommentar endet beim ersten `*/`; «rest */» gilt als Code und führt zu einem Fehler.', richtig: true },
        { text: 'Beide Kommentare werden korrekt erkannt.', warum: 'C kennt keine verschachtelten Blockkommentare.' },
        { text: 'Der innere Kommentar wird ausgeführt.', warum: 'Kommentare werden nie ausgeführt.' },
      ],
    },
  ],
  zusammenfassung: [
    'Kommentare ignoriert der Compiler; sie sind nur für Menschen.',
    '`//` gilt bis zum Zeilenende, `/* … */` auch über mehrere Zeilen.',
    'Blockkommentare lassen sich nicht verschachteln.',
    'Gute Kommentare erklären das Warum, nicht das Offensichtliche, und werden mit dem Code aktuell gehalten.',
  ],
  referenz: ['kommentar'],
};
