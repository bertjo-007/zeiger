import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k02-l06',
  titel: 'Konstanten und Namensregeln',
  dauer: 20,
  stichwoerter: ['const', 'Konstante', 'Namensregeln', 'Bezeichner', 'magische Zahl', '#define', 'Schlüsselwort', 'snake_case', 'Gross- und Kleinschreibung'],
  lernziele: [
    'unveränderliche Werte mit `const` festlegen',
    'gültige und sprechende Namen für Variablen wählen',
    'magische Zahlen im Code durch benannte Konstanten ersetzen',
  ],
  erklaerung: md`
    Manche Werte ändern sich während des Programms nie: die Länge eines Förderbands, die maximale Drehzahl eines Motors, die Anzahl Sensoren. Solche Werte machst du mit **\`const\`** unveränderlich:

    ~~~c
    const double BANDLAENGE_M = 12.5;
    ~~~

    Versucht später eine Anweisung, \`BANDLAENGE_M\` zu ändern, meldet der Compiler einen Fehler. Eine \`const\`-Variable **muss** darum bei der Deklaration initialisiert werden.

    ### Keine magischen Zahlen

    Steht im Code \`if (drehzahl > 3200)\`, weiss niemand, woher die 3200 kommt, und taucht sie an fünf Stellen auf, wird jede Änderung zur Fehlerquelle. Besser:

    ~~~c
    const int MAX_DREHZAHL = 3200;   // laut Typenschild
    if (drehzahl > MAX_DREHZAHL) …
    ~~~

    Der Name erklärt die Bedeutung, und eine Änderung geschieht an einer einzigen Stelle.

    > [!info] #define
    > Oft sieht man stattdessen \`#define MAX_DREHZAHL 3200\`. Das ist eine Textersetzung durch den Präprozessor. \`const\` hat einen Typ und wird vom Compiler geprüft; beides ist verbreitet.

    ### Regeln für Namen

    Namen von Variablen, Konstanten und Funktionen heissen **Bezeichner**. Für sie gilt:

    - erlaubt sind Buchstaben \`a\` bis \`z\`, \`A\` bis \`Z\`, Ziffern und der Unterstrich \`_\`;
    - das erste Zeichen darf **keine Ziffer** sein;
    - **Gross- und Kleinschreibung** zählt: \`wert\`, \`Wert\` und \`WERT\` sind drei verschiedene Namen;
    - **Schlüsselwörter** wie \`int\`, \`return\`, \`for\` sind als Namen verboten;
    - Namen, die mit \`_\` und einem Grossbuchstaben beginnen, sind für den Compiler reserviert.

    Umlaute wie in \`grösse\` vermeidest du am besten: Viele Werkzeuge kommen damit nicht zurecht. Schreibe \`groesse\`.

    ### Gute Namen

    - Sprechend statt kurz: \`temperatur_c\` statt \`t\`, \`anzahl_sensoren\` statt \`n\`. Kurze Namen wie \`i\` sind nur für Schleifenzähler üblich.
    - Einheit im Namen, wo sie nicht offensichtlich ist: \`laenge_mm\`, \`zeit_ms\`.
    - Eine Schreibweise im ganzen Programm. Dieser Kurs verwendet \`klein_mit_unterstrich\` für Variablen und \`GROSS_MIT_UNTERSTRICH\` für Konstanten.
  `,
  syntax: [
    {
      code: c`
        const typ NAME = wert;
        const int ANZAHL_ACHSEN = 3;
        const double PI = 3.14159265;
      `,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          const double BANDLAENGE_M = 12.5;     // Länge des Förderbands
          const double GESCHWINDIGKEIT = 0.4;   // m/s laut Steuerung
          const int MAX_PAKETE = 40;            // passen gleichzeitig aufs Band

          double fahrzeit_s = BANDLAENGE_M / GESCHWINDIGKEIT;
          printf("Ein Paket braucht %.2f s über das Band.\n", fahrzeit_s);
          printf("Maximal %d Pakete gleichzeitig.\n", MAX_PAKETE);
          return 0;
      }
    `,
    ausgabe: out`
      Ein Paket braucht 31.25 s über das Band.
      Maximal 40 Pakete gleichzeitig.
    `,
  },
  zeilen: [
    { zeilen: '4-6', text: md`Drei Konstanten mit sprechenden Namen und Einheiten im Kommentar. Grossbuchstaben zeigen: Dieser Wert ändert sich nicht.` },
    { zeilen: '8', text: md`Die Rechnung liest sich wie die Formel: Zeit = Weg / Geschwindigkeit. Die Einheit steckt im Namen \`fahrzeit_s\`.` },
    { zeilen: '9-10', text: md`Ausgabe mit den passenden Platzhaltern: \`%.2f\` für \`double\`, \`%d\` für \`int\`.` },
  ],
  ergebnis: md`
    Die Fahrzeit 12,5 m / 0,4 m/s = 31,25 s und die maximale Anzahl Pakete erscheinen. Ergänze im Beispiel eine Zeile \`MAX_PAKETE = 50;\` und führe es aus: Der Compiler meldet, dass eine Konstante nicht geändert werden darf.
  `,
  fehler: [
    {
      titel: 'Konstante ändern',
      text: md`Eine \`const\`-Variable darf nach der Initialisierung nicht mehr geändert werden. Clang meldet «cannot assign to variable … with const-qualified type».`,
      falsch: c`
        const int MAX = 10;
        MAX = 20;
      `,
    },
    {
      titel: 'Ungültige Namen',
      text: md`Namen dürfen nicht mit einer Ziffer beginnen, keine Leerzeichen oder Bindestriche enthalten und keine Schlüsselwörter sein.`,
      falsch: c`
        int 2achsen = 0;
        int max-wert = 5;
        int return = 1;
      `,
      richtig: c`
        int achsen_2 = 0;
        int max_wert = 5;
        int rueckgabe = 1;
      `,
    },
    {
      titel: 'Gross- und Kleinschreibung gemischt',
      text: md`\`Temperatur\` und \`temperatur\` sind verschiedene Variablen. Wer die Schreibweise wechselt, erhält «use of undeclared identifier».`,
    },
  ],
  uebungen: [
    {
      id: 'k02-l06-u1',
      typ: 'auswahl',
      titel: 'Gültige Namen',
      stufe: 1,
      mehrfach: true,
      themen: ['variablen', 'stil'],
      frage: 'Welche Namen sind in C gültige Bezeichner? (Mehrere Antworten)',
      optionen: [
        { text: '`drehzahl_max`', richtig: true },
        { text: '`2te_messung`', warum: 'Beginnt mit einer Ziffer.' },
        { text: '`sensor-wert`', warum: 'Der Bindestrich ist der Minus-Operator.' },
        { text: '`_zaehler`', richtig: true, warum: 'Gültig. Nur `_` mit folgendem Grossbuchstaben ist reserviert.' },
        { text: '`float`', warum: 'Schlüsselwort.' },
        { text: '`MotorLinks`', richtig: true },
      ],
    },
    {
      id: 'k02-l06-u2',
      typ: 'erweitern',
      titel: 'Magische Zahlen ersetzen',
      stufe: 2,
      themen: ['konstanten', 'stil'],
      aufgabe: md`
        Dieses Programm rechnet mit einer «magischen» 230 (Netzspannung in Volt) und einer 16 (Absicherung in Ampere). Führe dafür zwei \`const\`-Konstanten \`NETZSPANNUNG_V\` und \`SICHERUNG_A\` ein und verwende sie in der Rechnung. Die Ausgabe bleibt gleich:

        ~~~text
        Maximale Leistung: 3680 W
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int leistung = 230 * 16;
            printf("Maximale Leistung: %d W\n", leistung);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            const int NETZSPANNUNG_V = 230;
            const int SICHERUNG_A = 16;
            int leistung = NETZSPANNUNG_V * SICHERUNG_A;
            printf("Maximale Leistung: %d W\n", leistung);
            return 0;
        }
      `,
      tests: [{ name: 'Ausgabe unverändert', erwartet: { stdout: 'Maximale Leistung: 3680 W\n' } }],
      regeln: [
        { muss: 'const\\s+int\\s+NETZSPANNUNG_V\\s*=\\s*230', meldung: 'Lege `const int NETZSPANNUNG_V = 230;` an.' },
        { muss: 'const\\s+int\\s+SICHERUNG_A\\s*=\\s*16', meldung: 'Lege `const int SICHERUNG_A = 16;` an.' },
        { muss: 'NETZSPANNUNG_V\\s*\\*\\s*SICHERUNG_A|SICHERUNG_A\\s*\\*\\s*NETZSPANNUNG_V', meldung: 'Rechne mit den beiden Konstanten.' },
      ],
      hinweise: [md`Zwei Zeilen am Anfang von \`main\`: \`const int NETZSPANNUNG_V = 230;\` und dasselbe für die Sicherung.`],
    },
    {
      id: 'k02-l06-u3',
      typ: 'fehlersuche',
      titel: 'Namenschaos',
      stufe: 2,
      themen: ['variablen', 'konstanten'],
      aufgabe: md`
        Das Programm soll das Volumen eines Tanks berechnen und \`Volumen: 2.40 m3\` ausgeben. Es enthält drei Fehler bei Namen und Konstanten.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            const double laenge = 2.0;
            double 1breite = 1.2;
            double hoehe = 1.0;
            laenge = 2.0;
            double volumen = Laenge * breite * hoehe;
            printf("Volumen: %.2f m3\n", volumen);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            const double LAENGE = 2.0;
            double breite = 1.2;
            double hoehe = 1.0;
            double volumen = LAENGE * breite * hoehe;
            printf("Volumen: %.2f m3\n", volumen);
            return 0;
        }
      `,
      tests: [{ name: 'Volumen stimmt', erwartet: { stdout: 'Volumen: 2.40 m3\n' } }],
      hinweise: [md`Ein Name beginnt mit einer Ziffer.`, md`Eine Konstante wird nachträglich geändert, und ein Name ist anders geschrieben als bei der Deklaration.`],
    },
  ],
  wissenscheck: [
    {
      id: 'k02-l06-c1',
      typ: 'wahrfalsch',
      themen: ['konstanten'],
      aussage: 'Eine `const`-Variable kann man später im Programm mit einer Zuweisung ändern.',
      richtig: false,
    },
    {
      id: 'k02-l06-c2',
      typ: 'auswahl',
      themen: ['stil'],
      frage: 'Welcher Name ist für eine Wartezeit in Millisekunden am besten?',
      optionen: [{ text: '`wartezeit_ms`', richtig: true, warum: 'Bedeutung und Einheit sind klar.' }, { text: '`w`', warum: 'Viel zu knapp.' }, { text: '`zeit`', warum: 'Unklar: welche Zeit, in welcher Einheit?' }],
    },
    {
      id: 'k02-l06-c3',
      typ: 'wahrfalsch',
      themen: ['variablen'],
      aussage: 'In C sind `Sensor` und `sensor` zwei verschiedene Namen.',
      richtig: true,
    },
  ],
  zusammenfassung: [
    '`const` macht eine Variable unveränderlich; sie muss bei der Deklaration einen Wert bekommen.',
    'Benannte Konstanten statt magischer Zahlen: verständlicher und nur an einer Stelle zu ändern.',
    'Namen: Buchstaben, Ziffern, `_`; keine Ziffer am Anfang, keine Schlüsselwörter; Gross/Klein zählt.',
    'Sprechende Namen mit Einheit, z. B. `zeit_ms`; Konstanten in GROSSBUCHSTABEN.',
  ],
  referenz: ['const'],
};
