import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k01-l06',
  titel: 'Kompilieren und Ausführen',
  dauer: 25,
  stichwoerter: ['kompilieren', 'Compiler', 'Linker', 'Präprozessor', 'gcc', 'clang', 'Warnung', 'Fehler', 'Exit-Code', 'MSYS2', 'VS Code', 'Windows', '-Wall', 'Objektdatei'],
  lernziele: [
    'die Schritte vom Quelltext zum Programm nennen: Präprozessor, Compiler, Linker',
    'Compilerfehler, Linkerfehler, Warnungen und Laufzeitfehler unterscheiden',
    'ein C-Programm auf dem eigenen PC mit gcc oder clang übersetzen und starten',
  ],
  erklaerung: md`
    Wenn du auf «Ausführen» klickst, passieren mehrere Schritte. Auf dem eigenen PC stösst du sie mit einem einzigen Befehl an, aber es lohnt sich zu wissen, was dahinter steckt. Daran erkennst du nämlich, woher eine Fehlermeldung kommt.

    ### Vier Schritte

    1. **Präprozessor:** bearbeitet die \`#\`-Zeilen, fügt Header ein und entfernt Kommentare.
    2. **Compiler:** prüft die Grammatik und die Typen und übersetzt jede \`.c\`-Datei in eine **Objektdatei** (\`.o\`) mit Maschinencode.
    3. **Linker:** fügt die Objektdateien und die benötigten Teile der Standardbibliothek (zum Beispiel den Code von \`printf\`) zu **einem** Programm zusammen.
    4. **Ausführen:** Das Betriebssystem lädt das Programm und ruft \`main\` auf.

    ### Welche Fehler wo entstehen

    | Art | Wann | Beispiel |
    |---|---|---|
    | Compilerfehler | beim Übersetzen | fehlender Strichpunkt, unbekannter Name |
    | Warnung | beim Übersetzen | verdächtiger Code, der trotzdem übersetzt wird |
    | Linkerfehler | beim Zusammenfügen | Funktion deklariert, aber nirgends geschrieben |
    | Laufzeitfehler | beim Ausführen | Division durch 0, Zugriff ausserhalb eines Arrays |
    | Logikfehler | beim Ausführen | Programm läuft, rechnet aber falsch |

    Bei einem **Fehler** entsteht kein Programm. Bei einer **Warnung** schon, aber die Warnung zeigt oft auf einen echten Fehler. Nimm Warnungen deshalb ernst. Am besten schreibst du Code, der ganz ohne Warnungen übersetzt wird.

    > [!tipp] Fehlermeldungen lesen
    > Lies immer zuerst die **erste** Meldung. Spätere Meldungen sind oft nur Folgen davon: Fehlt ein Strichpunkt, versteht der Compiler die nächste Zeile auch nicht mehr. Die Zeilennummer zeigt, wo der Compiler den Fehler **bemerkt** hat. Die Ursache liegt manchmal eine Zeile davor.

    ### Auf dem eigenen PC

    Unter Linux und macOS ist meist schon \`gcc\` oder \`clang\` vorhanden. Unter Windows richtest du einen Compiler zum Beispiel mit MSYS2 ein:

    1. MSYS2 installieren, etwa in PowerShell mit \`winget install MSYS2.MSYS2\`.
    2. Im Fenster «MSYS2 UCRT64» den Compiler holen: \`pacman -S --needed mingw-w64-ucrt-x86_64-gcc\`.
    3. Den Ordner \`C:\msys64\ucrt64\bin\` zur Umgebungsvariablen \`Path\` hinzufügen.
    4. Als Editor eignet sich Visual Studio Code mit der Erweiterung «C/C++».

    Dann übersetzt und startest du so:

    ~~~text
    gcc -std=c17 -Wall -Wextra -pedantic main.c -o programm
    .\programm.exe
    ~~~

    Den Rückgabewert des letzten Programms zeigt PowerShell mit \`$LASTEXITCODE\`, unter Linux \`echo $?\`.

    > [!achtung] Umlaute in der Windows-Konsole
    > Zeigt die Windows-Konsole «Ã¤» statt «ä», erwartet sie eine andere Zeichenkodierung. Der Befehl \`chcp 65001\` stellt sie auf UTF-8 um.

    > [!info] In Zeiger
    > Im Reiter «Befehl» der Werkbank steht der Befehl, der deinem Klick auf «Ausführen» entspricht. Zeiger übersetzt allerdings nicht in eine \`.exe\`, sondern in WebAssembly, damit das Programm im Browser laufen kann.
  `,
  syntax: [
    {
      code: c`
        gcc -std=c17 -Wall -Wextra -pedantic main.c -o programm
        ./programm
      `,
      text: md`\`-std=c17\` wählt den Sprachstandard, \`-Wall -Wextra -pedantic\` schalten viele Warnungen ein, \`-o programm\` legt den Namen des Ergebnisses fest. Mit \`clang\` statt \`gcc\` funktionieren dieselben Optionen.`,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          printf("Prüfe Konfiguration ...\n");
          printf("Fehler: Endschalter X nicht angeschlossen\n");
          return EXIT_FAILURE;
      }
    `,
    ausgabe: out`
      Prüfe Konfiguration ...
      Fehler: Endschalter X nicht angeschlossen
    `,
  },
  zeilen: [
    { zeilen: '1-2', text: md`Diese Zeilen erledigt der Präprozessor, bevor übersetzt wird.` },
    { zeilen: '4', text: md`Hier beginnt das Programm, wenn das Betriebssystem es startet.` },
    { zeilen: '5-6', text: md`Zwei Ausgaben. Der Code von \`printf\` stammt aus der Standardbibliothek und wurde vom Linker dazugefügt.` },
    { zeilen: '7', text: md`\`EXIT_FAILURE\` meldet einem aufrufenden Skript: Hier ist etwas schiefgegangen.` },
  ],
  ergebnis: md`
    Das Programm gibt zwei Zeilen aus und endet mit dem Rückgabewert 1 (\`EXIT_FAILURE\`). Zeiger zeigt darum «Programm beendet mit Rückgabewert 1». Ein Build-Skript oder eine Steuerung würde an dieser Stelle abbrechen.
  `,
  fehler: [
    {
      titel: 'Warnungen ignorieren',
      text: md`Ein Programm mit Warnungen läuft oft scheinbar, liefert aber falsche Werte. Die Warnungen von \`-Wall -Wextra\` sind kostenlose Hinweise auf Fehler. Behandle sie wie Fehler.`,
    },
    {
      titel: 'Nicht die erste Meldung lesen',
      text: md`Zwanzig Fehlermeldungen klingen schlimm, haben aber oft eine einzige Ursache, meist die erste Meldung. Behebe sie, übersetze neu, und viele der anderen verschwinden.`,
    },
    {
      titel: 'Datei als .cpp gespeichert',
      text: md`Endet die Datei auf \`.cpp\`, behandeln gcc und clang sie als C++. Manches gültige C ist in C++ ein Fehler und umgekehrt. C-Dateien enden auf \`.c\`.`,
    },
  ],
  uebungen: [
    {
      id: 'k01-l06-u1',
      typ: 'zuordnen',
      titel: 'Wer macht was?',
      stufe: 1,
      themen: ['kompilieren'],
      frage: 'Ordne jedem Schritt seine Aufgabe zu.',
      paare: [
        { links: 'Präprozessor', rechts: 'fügt Header ein und entfernt Kommentare' },
        { links: 'Compiler', rechts: 'übersetzt eine `.c`-Datei in Maschinencode' },
        { links: 'Linker', rechts: 'fügt Objektdateien und Bibliothek zu einem Programm zusammen' },
        { links: 'Betriebssystem', rechts: 'lädt das Programm und ruft `main` auf' },
      ],
    },
    {
      id: 'k01-l06-u2',
      typ: 'auswahl',
      titel: 'Welche Fehlerart?',
      stufe: 2,
      themen: ['kompilieren'],
      frage: 'Ein Programm übersetzt ohne Meldung, startet und gibt bei einer Temperatur von 30 Grad «zu kalt» aus. Was für ein Fehler ist das?',
      optionen: [
        { text: 'Compilerfehler', warum: 'Dann wäre gar kein Programm entstanden.' },
        { text: 'Linkerfehler', warum: 'Auch dann gäbe es kein Programm.' },
        { text: 'Logikfehler', richtig: true, warum: 'Das Programm läuft, tut aber nicht das Richtige. Solche Fehler findet kein Compiler, nur Tests.' },
      ],
    },
    {
      id: 'k01-l06-u3',
      typ: 'programm',
      titel: 'Fehlercode 2',
      stufe: 2,
      themen: ['kompilieren', 'grundlagen'],
      aufgabe: md`
        Ein Prüfstand erwartet von deinem Programm einen bestimmten Fehlercode. Schreibe ein Programm, das \`Messung fehlgeschlagen\` ausgibt und mit dem Rückgabewert **2** endet.
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
            printf("Messung fehlgeschlagen\n");
            return 2;
        }
      `,
      tests: [{ name: 'Ausgabe und Rückgabewert 2', erwartet: { stdout: 'Messung fehlgeschlagen\n', exitCode: 2 } }],
      hinweise: [md`Der Rückgabewert ist die Zahl hinter \`return\` in \`main\`.`],
    },
    {
      id: 'k01-l06-u4',
      typ: 'fehlersuche',
      titel: 'Drei Meldungen, eine nach der anderen',
      stufe: 2,
      themen: ['kompilieren', 'grundlagen'],
      aufgabe: md`
        Dieses Programm enthält drei Fehler. Übersetze es, behebe den **ersten** gemeldeten Fehler, übersetze erneut, und so weiter. Erwartete Ausgabe:

        ~~~text
        Kalibrierung gestartet
        Kalibrierung beendet
        ~~~
      `,
      start: c`
        #include <stdoi.h>

        int main(void) {
            printf("Kalibrierung gestartet\n")
            printf("Kalibrierung beendet\n");
            retrun 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            printf("Kalibrierung gestartet\n");
            printf("Kalibrierung beendet\n");
            return 0;
        }
      `,
      tests: [{ name: 'Beide Zeilen', erwartet: { stdout: 'Kalibrierung gestartet\nKalibrierung beendet\n' } }],
      hinweise: [md`Der erste Fehler steckt im Namen des Headers.`, md`Danach fehlt ein Strichpunkt, und ein Wort ist vertippt.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k01-l06-c1',
      typ: 'auswahl',
      themen: ['kompilieren'],
      frage: 'In welcher Reihenfolge laufen die Schritte ab?',
      optionen: [
        { text: 'Präprozessor, Compiler, Linker', richtig: true },
        { text: 'Compiler, Präprozessor, Linker', warum: 'Der Präprozessor muss zuerst die Header einfügen.' },
        { text: 'Linker, Compiler, Präprozessor', warum: 'Der Linker braucht die fertigen Objektdateien des Compilers.' },
      ],
    },
    {
      id: 'k01-l06-c2',
      typ: 'wahrfalsch',
      themen: ['kompilieren'],
      aussage: 'Bei einer Warnung erzeugt der Compiler kein Programm.',
      richtig: false,
      erklaerung: 'Nur Fehler verhindern das Programm. Warnungen sind Hinweise, die man trotzdem ernst nehmen sollte.',
    },
    {
      id: 'k01-l06-c3',
      typ: 'eingabe',
      themen: ['kompilieren'],
      frage: 'Mit welcher Option schaltest du bei gcc und clang die wichtigsten Warnungen ein? (beginnt mit -W)',
      antworten: ['-Wall'],
      exakt: true,
    },
  ],
  zusammenfassung: [
    'Präprozessor, Compiler und Linker machen aus Quelltext ein ausführbares Programm.',
    'Fehler verhindern das Programm, Warnungen nicht. Beides zeigt auf Probleme.',
    'Immer die erste Fehlermeldung zuerst beheben.',
    'Lokal übersetzen mit `gcc -std=c17 -Wall -Wextra -pedantic main.c -o programm`.',
  ],
  referenz: ['exit-success'],
};
