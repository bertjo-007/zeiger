import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k01-l01',
  titel: 'Was ist C?',
  dauer: 15,
  stichwoerter: ['C', 'Programmiersprache', 'Compiler', 'Maschinencode', 'Mikrocontroller', 'Embedded', 'Dennis Ritchie', 'C17', 'Standard'],
  lernziele: [
    'erklären, was eine Programmiersprache ist und wozu ein Compiler dient',
    'typische Einsatzgebiete von C nennen, besonders Mikrocontroller und Automation',
    'ein erstes C-Programm ausführen und seine Ausgabe lesen',
  ],
  erklaerung: md`
    Ein Prozessor versteht nur **Maschinencode**: lange Folgen von Zahlen, die für Befehle wie «addiere» oder «springe» stehen. Für Menschen ist das kaum lesbar. Eine **Programmiersprache** ist deshalb ein Text, den Menschen schreiben und lesen können, und ein Programm namens **Compiler** übersetzt diesen Text in Maschinencode.

    C wurde Anfang der 1970er-Jahre von Dennis Ritchie bei den Bell Labs entwickelt, ursprünglich für das Betriebssystem Unix. Seither ist C eine der wichtigsten Sprachen überhaupt:

    - **Betriebssysteme:** Der Kern von Linux ist in C geschrieben, ebenso grosse Teile von Windows und macOS.
    - **Mikrocontroller und Embedded-Systeme:** Steuergeräte im Auto, Sensoren, Motorsteuerungen, Arduino und STM32 werden fast immer in C (oder C++) programmiert.
    - **Werkzeuge:** Viele Datenbanken, Compiler und sogar die Programmiersprache Python selbst sind in C geschrieben.

    ### Warum C für Technik und Automation?

    C ist **nah an der Hardware**. Ein C-Programm kann direkt auf Speicheradressen und Register eines Chips zugreifen, braucht sehr wenig Speicher und ist schnell. Ein kleiner Mikrocontroller mit 2 KB Arbeitsspeicher lässt sich in C gut programmieren, in vielen anderen Sprachen gar nicht.

    Der Preis dafür: C prüft wenig selbst. Liest ein Programm über das Ende einer Liste hinaus, merkt C das nicht automatisch. Du lernst deshalb in diesem Kurs nicht nur, *wie* man etwas schreibt, sondern auch, *welche Fehler* typisch sind und wie man sie vermeidet.

    ### Vom Text zum Programm

    1. Du schreibst den **Quelltext** in eine Datei, z. B. \`main.c\`.
    2. Der **Compiler** prüft den Text und übersetzt ihn. Findet er Fehler, bricht er mit einer Meldung ab.
    3. Heraus kommt ein **ausführbares Programm**, das du starten kannst.

    > [!info] So funktioniert das hier
    > Zeiger enthält einen echten C-Compiler (Clang), der direkt in deinem Browser läuft. Wenn du auf «Ausführen» klickst, wird dein Code wirklich kompiliert und ausgeführt, nicht nur simuliert. Zusätzlich prüft Zeiger Dinge, die C selbst nicht prüft, und erklärt Fehler auf Deutsch.

    ### Welches C?

    C wurde über die Jahre in **Standards** festgehalten: C89, C99, C11, C17 und zuletzt C23. Dieser Kurs folgt **C17**, dem Standard, den heutige Compiler und Mikrocontroller-Werkzeuge zuverlässig unterstützen. Wo C23 etwas ändert, steht ein Hinweis dabei.
  `,
  syntax: [
    {
      code: c`
        #include <stdio.h>

        int main(void) {
            // hier stehen die Anweisungen
            return 0;
        }
      `,
      text: md`Fast jedes Programm in diesem Kurs hat diesen Rahmen. Was die einzelnen Teile bedeuten, lernst du in der nächsten Lektion genau. Für den Moment genügt: Die Anweisungen zwischen \`{\` und \`}\` werden von oben nach unten ausgeführt.`,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          printf("Hallo Welt!\n");
          printf("C läuft auf PCs, Servern und Mikrocontrollern.\n");
          return 0;
      }
    `,
    ausgabe: out`
      Hallo Welt!
      C läuft auf PCs, Servern und Mikrocontrollern.
    `,
  },
  zeilen: [
    { zeilen: '1', text: md`\`#include <stdio.h>\` bindet die Standard-Ein- und Ausgabe ein. Darin ist \`printf\` beschrieben.` },
    { zeilen: '3', text: md`\`int main(void)\` ist der Startpunkt. Jedes C-Programm beginnt in der Funktion \`main\`.` },
    { zeilen: '4', text: md`\`printf\` gibt den Text zwischen den Anführungszeichen aus. \`\n\` steht für einen Zeilenumbruch.` },
    { zeilen: '5', text: md`Eine zweite Ausgabe. Umlaute wie «ä» funktionieren, weil der Text als UTF-8 gespeichert wird.` },
    { zeilen: '6', text: md`\`return 0;\` beendet \`main\` und meldet dem Betriebssystem: alles in Ordnung.` },
    { zeilen: '7', text: md`Die schliessende geschweifte Klammer beendet die Funktion \`main\`.` },
  ],
  ergebnis: md`
    Im Terminal stehen zwei Zeilen, genau in der Reihenfolge der \`printf\`-Aufrufe. Probiere es aus: Lösche im Beispiel das erste \`\n\` und führe das Programm erneut aus. Beide Texte landen dann auf derselben Zeile, weil der Zeilenumbruch fehlt.
  `,
  fehler: [
    {
      titel: 'Gross- und Kleinschreibung',
      text: md`C unterscheidet streng zwischen Gross- und Kleinbuchstaben. \`Printf\` ist für den Compiler ein ganz anderer Name als \`printf\` und unbekannt.`,
      falsch: c`Printf("Hallo\n");`,
      richtig: c`printf("Hallo\n");`,
    },
    {
      titel: 'Strichpunkt vergessen',
      text: md`Jede Anweisung endet mit \`;\`. Fehlt er, meldet der Compiler den Fehler oft erst in der nächsten Zeile. Schau dann ans Ende der Zeile davor.`,
      falsch: c`
        printf("Hallo\n")
        return 0;
      `,
      richtig: c`
        printf("Hallo\n");
        return 0;
      `,
    },
    {
      titel: 'Typografische Anführungszeichen',
      text: md`Text aus Word oder einer Webseite enthält oft «schöne» Anführungszeichen wie „…“. C versteht nur das gerade Zeichen \`"\`.`,
      falsch: c`printf(„Hallo“);`,
      richtig: c`printf("Hallo");`,
    },
  ],
  uebungen: [
    {
      id: 'k01-l01-u1',
      typ: 'programm',
      titel: 'Zwei Zeilen',
      stufe: 1,
      themen: ['ausgabe', 'grundlagen'],
      aufgabe: md`
        Schreibe ein Programm, das genau diese zwei Zeilen ausgibt:

        ~~~text
        Ich lerne C.
        Mein Ziel: Mikrocontroller programmieren.
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            // Schreibe hier zwei printf-Anweisungen
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            printf("Ich lerne C.\n");
            printf("Mein Ziel: Mikrocontroller programmieren.\n");
            return 0;
        }
      `,
      tests: [{ name: 'Gibt beide Zeilen genau so aus', erwartet: { stdout: 'Ich lerne C.\nMein Ziel: Mikrocontroller programmieren.\n' }, tipp: md`Achte auf Punkt, Doppelpunkt und das \`\n\` am Ende jeder Zeile.` }],
      hinweise: [md`Du brauchst zwei Aufrufe von \`printf\`, je einen pro Zeile.`, md`Damit die zweite Zeile wirklich auf einer neuen Zeile steht, muss der erste Text mit \`\n\` enden: \`printf("Ich lerne C.\n");\``],
    },
    {
      id: 'k01-l01-u2',
      typ: 'vorhersage',
      titel: 'Wo bricht die Zeile um?',
      stufe: 1,
      themen: ['ausgabe'],
      code: c`
        #include <stdio.h>

        int main(void) {
            printf("Motor ");
            printf("an\n");
            printf("Drehzahl: 1500\n");
            return 0;
        }
      `,
      ausgabe: out`
        Motor an
        Drehzahl: 1500
      `,
      erklaerung: md`Das erste \`printf\` endet ohne \`\n\`. Darum schreibt das zweite \`printf\` auf derselben Zeile weiter. Erst das \`\n\` nach «an» beginnt eine neue Zeile.`,
    },
    {
      id: 'k01-l01-u3',
      typ: 'zuordnen',
      titel: 'Begriffe',
      stufe: 1,
      themen: ['kompilieren', 'grundlagen'],
      frage: 'Ordne jedem Begriff die passende Beschreibung zu.',
      paare: [
        { links: 'Quelltext', rechts: 'Der Text, den du in einer `.c`-Datei schreibst' },
        { links: 'Compiler', rechts: 'Übersetzt den Quelltext in Maschinencode' },
        { links: 'Maschinencode', rechts: 'Zahlenfolgen, die der Prozessor direkt ausführt' },
        { links: 'Mikrocontroller', rechts: 'Kleiner Computer auf einem Chip, z. B. in einer Steuerung' },
      ],
    },
    {
      id: 'k01-l01-u4',
      typ: 'fehlersuche',
      titel: 'Zwei Tippfehler',
      stufe: 2,
      themen: ['grundlagen', 'ausgabe'],
      aufgabe: md`
        Dieses Programm soll \`Sensor bereit\` ausgeben, lässt sich aber nicht kompilieren. Es enthält zwei typische Anfängerfehler. Finde und behebe sie.

        Tipp: Klicke zuerst auf «Ausführen» und lies die Meldungen im Reiter «Probleme».
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            Printf("Sensor bereit\n")
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            printf("Sensor bereit\n");
            return 0;
        }
      `,
      tests: [{ name: 'Gibt «Sensor bereit» aus', erwartet: { stdout: 'Sensor bereit\n' } }],
      hinweise: [md`Ein Fehler betrifft die Schreibweise von \`printf\`.`, md`Der zweite Fehler: Am Ende der \`printf\`-Zeile fehlt ein Zeichen.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k01-l01-c1',
      typ: 'auswahl',
      themen: ['kompilieren'],
      frage: 'Was macht ein Compiler?',
      optionen: [
        { text: 'Er übersetzt Quelltext in Maschinencode, den der Prozessor ausführen kann.', richtig: true },
        { text: 'Er führt den Quelltext Zeile für Zeile direkt aus, ohne ihn zu übersetzen.', warum: 'Das macht ein Interpreter (z. B. bei Python). C wird vorher vollständig übersetzt.' },
        { text: 'Er formatiert den Code schön, damit er besser lesbar ist.', warum: 'Dafür gibt es Formatierer; der Compiler übersetzt.' },
      ],
    },
    {
      id: 'k01-l01-c2',
      typ: 'auswahl',
      mehrfach: true,
      themen: ['grundlagen'],
      frage: 'Wo wird C heute typischerweise eingesetzt? (Mehrere Antworten)',
      optionen: [
        { text: 'Firmware von Mikrocontrollern, z. B. in Motorsteuerungen', richtig: true },
        { text: 'Kerne von Betriebssystemen wie Linux', richtig: true },
        { text: 'Gestaltung von Webseiten mit Farben und Layout', warum: 'Das ist die Aufgabe von HTML und CSS.' },
        { text: 'Programmiersprachen und Werkzeuge wie der Python-Interpreter', richtig: true },
      ],
    },
    {
      id: 'k01-l01-c3',
      typ: 'wahrfalsch',
      themen: ['grundlagen'],
      aussage: '`Printf` und `printf` sind für den C-Compiler dasselbe.',
      richtig: false,
      erklaerung: 'C unterscheidet Gross- und Kleinschreibung. Nur `printf` ist die Ausgabefunktion.',
    },
  ],
  zusammenfassung: [
    'C ist eine kompilierte Sprache: Ein Compiler übersetzt den Quelltext in ein ausführbares Programm.',
    'C ist nah an der Hardware und darum die Standardsprache für Mikrocontroller, Steuerungen und Betriebssysteme.',
    'C prüft zur Laufzeit wenig selbst. Sorgfalt und gute Werkzeuge sind deshalb wichtig.',
    'Jedes Programm beginnt in `main`; `printf` gibt Text aus, `\\n` beginnt eine neue Zeile.',
    'Dieser Kurs folgt dem Standard C17.',
  ],
  referenz: ['printf', 'main', 'include'],
};
