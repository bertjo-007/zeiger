import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k01-l07',
  titel: 'Dein erstes eigenes Programm',
  dauer: 30,
  stichwoerter: ['erstes Programm', 'planen', 'testen', 'Statusanzeige', 'Vorgehen', 'schrittweise'],
  lernziele: [
    'ein kleines Programm planen, bevor du es schreibst',
    'schrittweise vorgehen: schreiben, ausführen, vergleichen',
    'alles aus Kapitel 1 in einem eigenen Programm kombinieren',
  ],
  erklaerung: md`
    Du kennst jetzt alle Bausteine für ein erstes richtiges Programm: den Aufbau mit \`main\`, die Ausgabe mit \`printf\` und \`puts\`, Escape-Sequenzen, Kommentare und Header. In dieser Lektion geht es weniger um Neues als um das **Vorgehen**. Das hilft dir bei jedem späteren Programm.

    ### Fünf Schritte

    1. **Ziel festhalten.** Schreibe zuerst auf, was am Ende im Terminal stehen soll, Zeile für Zeile. Bei grösseren Programmen: Was geht hinein, was kommt heraus?
    2. **Gerüst anlegen.** \`#include\`, \`int main(void)\`, \`return 0;\`. Einmal ausführen: Läuft das leere Programm?
    3. **In kleinen Schritten erweitern.** Eine oder zwei Zeilen dazuschreiben, dann sofort ausführen. Tritt ein Fehler auf, steckt er fast sicher im eben geschriebenen Stück.
    4. **Ergebnis vergleichen.** Stimmt die Ausgabe Zeichen für Zeichen mit dem Ziel überein? Leerzeichen, Doppelpunkte, Umlaute?
    5. **Aufräumen.** Einrückung prüfen, sinnvolle Kommentare ergänzen, auskommentierte Testzeilen entfernen.

    > [!tipp] Klein anfangen
    > Profis schreiben nicht 200 Zeilen am Stück und drücken dann auf «Übersetzen». Sie arbeiten in kleinen Schritten mit ständigen Tests. Je kleiner der Schritt, desto schneller ist ein Fehler gefunden.

    ### Das Projekt dieser Lektion

    Das Beispiel ist die Statusanzeige einer Abfüllanlage: ein Rahmen aus Zeichen, ein Titel und einige Statuszeilen. So eine Anzeige könnte auf einem Bedienpanel oder im seriellen Monitor eines Mikrocontrollers erscheinen. In den Übungen baust du ähnliche Anzeigen selbst.

    > [!praxis] Ausrichten mit Leerzeichen
    > Damit Werte untereinander stehen, füllst du die Beschriftungen mit Leerzeichen auf. Tabulatoren (\`\t\`) gehen auch, verrutschen aber, wenn ein Eintrag länger als eine Tab-Breite ist. In Kapitel 2 lernst du Feldbreiten wie \`%-12s\`, die das automatisch erledigen.
  `,
  syntax: [
    {
      code: c`
        #include <stdio.h>

        int main(void) {
            // 1. Kopfzeile
            // 2. Statuszeilen
            // 3. Abschluss
            return 0;
        }
      `,
      text: md`Ein Gerüst mit Kommentaren als Plan: Erst die Schritte als Kommentare notieren, dann darunter den Code schreiben.`,
    },
  ],
  beispiel: {
    code: c`
      /*
       * Statusanzeige Abfüllanlage, Linie 3
       */
      #include <stdio.h>

      int main(void) {
          // Kopfzeile
          puts("==============================");
          puts("  Abfüllanlage Linie 3");
          puts("==============================");

          // Statuszeilen, Werte ab Spalte 14
          printf("Status:      in Betrieb\n");
          printf("Leistung:    1240 Flaschen/h\n");
          printf("Produkt:     \"Wasser, still\"\n");
          printf("Füllstand:   78 %%\n");

          // Abschluss
          puts("==============================");
          return 0;
      }
    `,
    ausgabe: out`
      ==============================
        Abfüllanlage Linie 3
      ==============================
      Status:      in Betrieb
      Leistung:    1240 Flaschen/h
      Produkt:     "Wasser, still"
      Füllstand:   78 %
      ==============================
    `,
  },
  zeilen: [
    { zeilen: '1-3', text: md`Ein Kopfkommentar sagt, wozu das Programm dient.` },
    { zeilen: '8-10', text: md`Für reinen Text ohne Platzhalter ist \`puts\` am einfachsten. Der Zeilenumbruch kommt automatisch.` },
    { zeilen: '13-16', text: md`Die Beschriftungen sind mit Leerzeichen auf gleiche Länge gebracht, darum stehen die Werte untereinander. In Zeile 15 sorgen \`\"\` für Anführungszeichen, in Zeile 16 \`%%\` für ein Prozentzeichen.` },
    { zeilen: '7,12,18', text: md`Kommentare gliedern das Programm in drei Abschnitte, genau wie im Plan.` },
  ],
  ergebnis: md`
    Die Anzeige erscheint mit Rahmen, und die Werte stehen sauber in einer Spalte. Ändere im Beispiel den Füllstand auf 9 %. Die Ausrichtung bleibt erhalten, weil die Beschriftungen ausgerichtet sind, nicht die Werte.
  `,
  fehler: [
    {
      titel: 'Alles auf einmal schreiben',
      text: md`Wer das ganze Programm in einem Zug schreibt und erst dann übersetzt, bekommt viele Meldungen auf einmal und weiss nicht, wo anfangen. Übersetze nach jedem kleinen Schritt.`,
    },
    {
      titel: 'Ungefähr gleich ist nicht gleich',
      text: md`Ein Leerzeichen zu viel, ein fehlender Doppelpunkt oder «Fuellstand» statt «Füllstand»: Für einen Menschen fast gleich, für eine automatische Prüfung verschieden. Vergleiche deine Ausgabe genau mit dem Ziel. Die Tests in den Übungen zeigen dir abweichende Zeilen farbig an.`,
    },
  ],
  uebungen: [
    {
      id: 'k01-l07-u1',
      typ: 'programm',
      titel: 'Typenschild eines Motors',
      stufe: 2,
      themen: ['ausgabe', 'grundlagen'],
      aufgabe: md`
        Gib das Typenschild eines Motors genau so aus:

        ~~~text
        +----------------------+
        | Motor M1             |
        | Leistung:  0.75 kW   |
        | Spannung:  230 V     |
        | Drehzahl:  1400 rpm  |
        +----------------------+
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            // Plan: Rahmen oben, vier Zeilen, Rahmen unten

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            puts("+----------------------+");
            puts("| Motor M1             |");
            puts("| Leistung:  0.75 kW   |");
            puts("| Spannung:  230 V     |");
            puts("| Drehzahl:  1400 rpm  |");
            puts("+----------------------+");
            return 0;
        }
      `,
      tests: [
        {
          name: 'Typenschild stimmt',
          erwartet: { stdout: '+----------------------+\n| Motor M1             |\n| Leistung:  0.75 kW   |\n| Spannung:  230 V     |\n| Drehzahl:  1400 rpm  |\n+----------------------+\n' },
          tipp: md`Zähle die Leerzeichen: Alle Zeilen sind gleich lang, 24 Zeichen.`,
        },
      ],
      hinweise: [md`Für jede Zeile ein \`puts\` ist hier am einfachsten.`, md`Kopiere die Zeilen aus der Aufgabe in den Code, so stimmen die Leerzeichen sicher.`],
    },
    {
      id: 'k01-l07-u2',
      typ: 'puzzle',
      titel: 'Startmeldung',
      stufe: 1,
      themen: ['grundlagen', 'ausgabe'],
      frage: 'Bringe die Zeilen in die richtige Reihenfolge. Das Programm soll zuerst «System startet», dann «Sensoren ok» und zuletzt «Bereit» ausgeben.',
      zeilen: ['#include <stdio.h>', 'int main(void) {', '    puts("System startet");', '    puts("Sensoren ok");', '    puts("Bereit");', '    return 0;', '}'],
      ausgabe: 'System startet\nSensoren ok\nBereit\n',
    },
    {
      id: 'k01-l07-u3',
      typ: 'erweitern',
      titel: 'Wartungshinweis ergänzen',
      stufe: 2,
      themen: ['ausgabe'],
      aufgabe: md`
        Erweitere die Statusanzeige: Vor der letzten Rahmenzeile sollen zwei neue Zeilen stehen.

        ~~~text
        Wartung:     in 3 Tagen
        Hinweis:     Filter "F2" wechseln
        ~~~

        Die Werte müssen in derselben Spalte stehen wie die übrigen.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            puts("==============================");
            printf("Status:      in Betrieb\n");
            printf("Füllstand:   78 %%\n");
            puts("==============================");
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            puts("==============================");
            printf("Status:      in Betrieb\n");
            printf("Füllstand:   78 %%\n");
            printf("Wartung:     in 3 Tagen\n");
            printf("Hinweis:     Filter \"F2\" wechseln\n");
            puts("==============================");
            return 0;
        }
      `,
      tests: [
        {
          name: 'Anzeige mit Wartungszeilen',
          erwartet: { stdout: '==============================\nStatus:      in Betrieb\nFüllstand:   78 %\nWartung:     in 3 Tagen\nHinweis:     Filter "F2" wechseln\n==============================\n' },
        },
      ],
      hinweise: [md`Die Beschriftung «Wartung:» ist 8 Zeichen lang; danach folgen 5 Leerzeichen bis Spalte 14.`, md`Die Anführungszeichen um F2 schreibst du als \`\"\`.`],
    },
    {
      id: 'k01-l07-u4',
      typ: 'programm',
      titel: 'Bedienmenü',
      stufe: 3,
      themen: ['ausgabe', 'kommentare'],
      aufgabe: md`
        Schreibe das Bedienmenü einer Kaffeemaschine. Die Ausgabe muss genau so aussehen:

        ~~~text
        *** Kaffeemaschine KM-200 ***
        [1]	Espresso	2.50 CHF
        [2]	Cappuccino	3.80 CHF
        [3]	Entkalken
        Wähle 1-3 und bestätige mit "OK".
        ~~~

        Zwischen den Spalten steht jeweils ein **Tabulator** (\`\t\`). Gliedere dein Programm mit Kommentaren in «Titel», «Auswahl» und «Hinweis».
      `,
      start: c`
        #include <stdio.h>

        int main(void) {

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            // Titel
            puts("*** Kaffeemaschine KM-200 ***");

            // Auswahl, Spalten mit Tabulator getrennt
            printf("[1]\tEspresso\t2.50 CHF\n");
            printf("[2]\tCappuccino\t3.80 CHF\n");
            printf("[3]\tEntkalken\n");

            // Hinweis
            printf("Wähle 1-3 und bestätige mit \"OK\".\n");
            return 0;
        }
      `,
      tests: [
        {
          name: 'Menü stimmt (inklusive Tabulatoren)',
          erwartet: { stdout: '*** Kaffeemaschine KM-200 ***\n[1]\tEspresso\t2.50 CHF\n[2]\tCappuccino\t3.80 CHF\n[3]\tEntkalken\nWähle 1-3 und bestätige mit "OK".\n' },
          tipp: md`Zwischen \`[1]\` und «Espresso» steht ein Tabulator, kein Leerzeichen. Schreibe \`\t\`.`,
        },
      ],
      hinweise: [md`Die Zeilen mit Tabulator gibst du mit \`printf\` aus, z. B. \`printf("[1]\tEspresso\t2.50 CHF\n");\``],
    },
  ],
  wissenscheck: [
    {
      id: 'k01-l07-c1',
      typ: 'auswahl',
      themen: ['grundlagen'],
      frage: 'Womit beginnst du am besten, wenn du ein neues Programm schreibst?',
      optionen: [
        { text: 'Mit dem gewünschten Ergebnis: Was soll am Ende ausgegeben werden?', richtig: true },
        { text: 'Mit möglichst viel Code, damit man früh fertig ist', warum: 'Ohne Ziel weiss man nicht, wann man fertig ist, und Fehler häufen sich.' },
        { text: 'Mit den Kommentaren für die Dokumentation', warum: 'Kommentare sind wichtig, aber zuerst kommt das Ziel.' },
      ],
    },
    {
      id: 'k01-l07-c2',
      typ: 'wahrfalsch',
      themen: ['grundlagen'],
      aussage: 'Es ist sinnvoll, nach jeder kleinen Änderung neu zu übersetzen und auszuführen.',
      richtig: true,
      erklaerung: 'So weisst du bei einem Fehler sofort, dass er im eben geänderten Stück steckt.',
    },
    {
      id: 'k01-l07-c3',
      typ: 'vorhersage',
      themen: ['ausgabe'],
      code: c`
        #include <stdio.h>

        int main(void) {
            puts("Ventil A");
            printf("Ventil B ");
            puts("offen");
            return 0;
        }
      `,
      ausgabe: out`
        Ventil A
        Ventil B offen
      `,
      erklaerung: md`\`printf\` ohne \`\n\` lässt die Zeile offen; \`puts\` schreibt «offen» dahinter und beendet dann die Zeile.`,
    },
  ],
  zusammenfassung: [
    'Erst das Ziel festhalten, dann das Gerüst, dann in kleinen Schritten erweitern.',
    'Nach jedem Schritt ausführen und die Ausgabe genau mit dem Ziel vergleichen.',
    'Werte richtest du aus, indem du die Beschriftungen auf gleiche Länge bringst.',
    'Zum Schluss aufräumen: Einrückung, Kommentare, keine vergessenen Testzeilen.',
  ],
  referenz: ['puts', 'printf'],
};
