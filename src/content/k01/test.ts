import { c, md, out } from '../tags.ts';
import type { Aufgabe } from '../types.ts';

/** Fragenpool für den Kapiteltest 1. */
export const test: Aufgabe[] = [
  {
    id: 'k01-t01',
    typ: 'auswahl',
    themen: ['kompilieren'],
    frage: 'Was entsteht, wenn der Compiler eine `.c`-Datei erfolgreich übersetzt hat?',
    optionen: [
      { text: 'Ein ausführbares Programm', richtig: true },
      { text: 'Eine Webseite', warum: 'C erzeugt Maschinencode, keine Webseiten.' },
      { text: 'Eine schönere Version des Quelltexts', warum: 'Der Compiler formatiert nicht, er übersetzt.' },
    ],
    erklaerung: 'Der Compiler übersetzt den Quelltext in Maschinencode. Das Ergebnis ist ein Programm, das sich starten lässt.',
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
];
