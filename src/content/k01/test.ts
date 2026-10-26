import { c, md, out } from '../tags.ts';
import type { Aufgabe } from '../types.ts';

/** Fragenpool für den Kapiteltest 1. */
export const test: Aufgabe[] = [
  {
    id: 'k01-t01',
    typ: 'auswahl',
    themen: ['kompilieren'],
    frage: 'Was entsteht, wenn der Compiler eine `.c`-Datei erfolgreich übersetzt und gelinkt hat?',
    optionen: [
      { text: 'Ein ausführbares Programm', richtig: true },
      { text: 'Eine Webseite', warum: 'C erzeugt Maschinencode, keine Webseiten.' },
      { text: 'Eine schönere Version des Quelltexts', warum: 'Der Compiler formatiert nicht, er übersetzt.' },
    ],
    erklaerung: 'Compiler und Linker machen aus dem Quelltext ein Programm, das sich starten lässt.',
  },
  {
    id: 'k01-t02',
    typ: 'vorhersage',
    themen: ['ausgabe'],
    code: c`
      #include <stdio.h>

      int main(void) {
          printf("Ventil");
          printf(" offen\n");
          printf("Druck ok\n");
          return 0;
      }
    `,
    ausgabe: out`
      Ventil offen
      Druck ok
    `,
    erklaerung: md`Nach «Ventil» fehlt ein \`\n\`, darum geht die Ausgabe auf derselben Zeile weiter.`,
  },
  {
    id: 'k01-t03',
    typ: 'wahrfalsch',
    themen: ['grundlagen'],
    aussage: 'Ein C-Programm beginnt immer in der Funktion `main`.',
    richtig: true,
    erklaerung: 'Das Betriebssystem ruft beim Start `main` auf. Von dort aus läuft alles Weitere.',
  },
  {
    id: 'k01-t04',
    typ: 'eingabe',
    themen: ['ausgabe'],
    frage: 'Welche Escape-Sequenz erzeugt einen Tabulator?',
    antworten: ['\\t'],
    exakt: true,
    erklaerung: '`\\t` springt zur nächsten Tabulator-Position, `\\n` beginnt eine neue Zeile.',
  },
  {
    id: 'k01-t05',
    typ: 'zuordnen',
    themen: ['praeprozessor'],
    frage: 'Welcher Header gehört zu welcher Funktion?',
    paare: [
      { links: '`puts`', rechts: '`<stdio.h>`' },
      { links: '`pow`', rechts: '`<math.h>`' },
      { links: '`EXIT_SUCCESS`', rechts: '`<stdlib.h>`' },
      { links: '`strcmp`', rechts: '`<string.h>`' },
    ],
  },
  {
    id: 'k01-t06',
    typ: 'wahrfalsch',
    themen: ['kommentare'],
    aussage: 'Blockkommentare `/* … */` lassen sich ineinander verschachteln.',
    richtig: false,
    erklaerung: 'Das erste `*/` beendet den Kommentar. Ein verschachtelter Kommentar führt deshalb zu Fehlern.',
  },
  {
    id: 'k01-t07',
    typ: 'auswahl',
    themen: ['grundlagen'],
    frage: 'Was bedeutet `return 1;` am Ende von `main`?',
    optionen: [
      { text: 'Das Programm meldet dem Betriebssystem einen Fehler.', richtig: true },
      { text: 'Das Programm wird noch einmal gestartet.', warum: '`return` beendet `main`; es startet nichts neu.' },
      { text: 'Es wird die Zahl 1 auf dem Bildschirm ausgegeben.', warum: 'Der Rückgabewert geht an das Betriebssystem, nicht ins Terminal.' },
    ],
  },
  {
    id: 'k01-t08',
    typ: 'vorhersage',
    themen: ['ausgabe'],
    code: c`
      #include <stdio.h>

      int main(void) {
          puts("Linie 1");
          printf("Status: ");
          printf("100 %%");
          puts("");
          puts("Ende");
          return 0;
      }
    `,
    ausgabe: out`
      Linie 1
      Status: 100 %
      Ende
    `,
    erklaerung: md`\`puts("")\` gibt einen leeren Text aus und beendet damit die offene Zeile.`,
  },
  {
    id: 'k01-t09',
    typ: 'auswahl',
    themen: ['kompilieren'],
    frage: 'Die Meldung lautet `wasm-ld: error: undefined symbol: starte_motor`. Wer meldet hier einen Fehler?',
    optionen: [
      { text: 'Der Linker: Eine Funktion wurde zwar angekündigt, aber nirgends geschrieben.', richtig: true },
      { text: 'Der Präprozessor: Ein Header fehlt.', warum: 'Ein fehlender Header führt zu «file not found» oder «undeclared».' },
      { text: 'Das Programm während der Ausführung', warum: 'Ohne erfolgreichen Linker gibt es noch gar kein Programm.' },
    ],
  },
  {
    id: 'k01-t10',
    typ: 'puzzle',
    themen: ['grundlagen'],
    frage: 'Setze ein Programm zusammen, das «Lager: 12 Paletten» ausgibt und Erfolg meldet. Eine Zeile gehört nicht dazu.',
    zeilen: ['#include <stdio.h>', 'int main(void) {', '    printf("Lager: 12 Paletten\\n");', '    return 0;', '}'],
    ablenker: ['    return;'],
    ausgabe: 'Lager: 12 Paletten\n',
  },
  {
    id: 'k01-t11',
    typ: 'wahrfalsch',
    themen: ['praeprozessor'],
    aussage: 'Der Präprozessor ersetzt `#include <stdio.h>` durch den Inhalt der Datei `stdio.h`.',
    richtig: true,
  },
  {
    id: 'k01-t12',
    typ: 'vorhersage',
    themen: ['kommentare', 'ausgabe'],
    code: c`
      #include <stdio.h>

      int main(void) {
          puts("Start"); // puts("Test");
          /* puts("Alt");
             puts("Neu"); */
          puts("Stopp");
          return 0;
      }
    `,
    ausgabe: out`
      Start
      Stopp
    `,
  },
  {
    id: 'k01-t13',
    typ: 'auswahl',
    mehrfach: true,
    themen: ['grundlagen'],
    frage: 'Welche Aussagen über `int main(void) { … }` stimmen? (Mehrere Antworten)',
    optionen: [
      { text: '`int` ist der Typ des Rückgabewerts.', richtig: true },
      { text: '`void` heisst: keine Parameter.', richtig: true },
      { text: 'Nach `)` muss ein Strichpunkt stehen.', warum: 'Nach dem Funktionskopf folgt direkt der Block.' },
      { text: 'Die Anweisungen im Block laufen von oben nach unten.', richtig: true },
    ],
  },
  {
    id: 'k01-t14',
    typ: 'eingabe',
    themen: ['ausgabe'],
    frage: 'Wie heisst die Funktion, die genau ein einzelnes Zeichen ausgibt?',
    antworten: ['putchar', 'putchar()'],
  },
  {
    id: 'k01-t15',
    typ: 'luecke',
    themen: ['praeprozessor', 'grundlagen'],
    frage: 'Ergänze die Lücken, damit das Programm übersetzt und «Bereit» ausgibt.',
    code: c`
      #include <__1__>

      int main(void) {
          __2__("Bereit");
          return 0;
      }
    `,
    luecken: [['stdio.h'], ['puts']],
    ausgabe: 'Bereit\n',
  },
  {
    id: 'k01-t16',
    typ: 'programm',
    themen: ['grundlagen', 'ausgabe'],
    aufgabe: md`Schreibe ein Programm, das \`Alarm: Druck zu hoch\` ausgibt und mit dem Rückgabewert 3 endet.`,
    start: c`
      #include <stdio.h>

      int main(void) {

          return 0;
      }
    `,
    loesung: c`
      #include <stdio.h>

      int main(void) {
          printf("Alarm: Druck zu hoch\n");
          return 3;
      }
    `,
    tests: [{ name: 'Meldung und Rückgabewert 3', erwartet: { stdout: 'Alarm: Druck zu hoch\n', exitCode: 3 } }],
  },
  {
    id: 'k01-t17',
    typ: 'programm',
    themen: ['ausgabe'],
    aufgabe: md`
      Gib genau diese zwei Zeilen aus:

      ~~~text
      Profil "Standard" aktiv
      Lüfter: 60 %
      ~~~
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
          printf("Profil \"Standard\" aktiv\n");
          printf("Lüfter: 60 %%\n");
          return 0;
      }
    `,
    tests: [{ name: 'Beide Zeilen genau', erwartet: { stdout: 'Profil "Standard" aktiv\nLüfter: 60 %\n' } }],
  },
  {
    id: 'k01-t18',
    typ: 'auswahl',
    themen: ['kompilieren'],
    frage: 'Clang meldet 14 Fehler. Womit fängst du an?',
    optionen: [
      { text: 'Mit dem ersten gemeldeten Fehler', richtig: true, warum: 'Viele spätere Meldungen sind Folgefehler und verschwinden, sobald der erste behoben ist.' },
      { text: 'Mit dem letzten Fehler', warum: 'Der letzte ist oft nur eine Folge der ersten.' },
      { text: 'Mit dem Fehler, der am einfachsten aussieht', warum: 'Die Reihenfolge zählt: Der erste Fehler kann alle weiteren auslösen.' },
    ],
  },
];
