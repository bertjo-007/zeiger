import { c, md, out } from '../tags.ts';
import type { Lektion } from '../types.ts';

export const lektion: Lektion = {
  id: 'k02-l01',
  titel: 'Variablen deklarieren und initialisieren',
  dauer: 20,
  stichwoerter: ['Variable', 'Deklaration', 'Initialisierung', 'Zuweisung', 'int', '%d', 'Speicher', 'uninitialisiert', '='],
  lernziele: [
    'eine Variable deklarieren, initialisieren und ihren Wert ändern',
    'den Wert einer Variable mit `printf` und `%d` ausgeben',
    'erklären, warum eine Variable vor dem ersten Lesen einen Wert braucht',
  ],
  erklaerung: md`
    Programme arbeiten mit Werten, die sich ändern: gezählte Teile, gemessene Temperaturen, der aktuelle Zustand einer Maschine. Solche Werte speicherst du in **Variablen**. Eine Variable ist ein **benannter Platz im Arbeitsspeicher**, der einen Wert eines bestimmten **Typs** aufnimmt.

    ### Deklarieren

    Bevor du eine Variable benutzt, musst du sie **deklarieren**: Typ und Name angeben.

    ~~~c
    int stueckzahl;
    ~~~

    \`int\` steht für «integer», eine ganze Zahl. Der Compiler reserviert dafür Speicher, meist 4 Byte.

    ### Initialisieren und zuweisen

    - **Initialisieren** heisst: der Variable gleich bei der Deklaration einen Startwert geben: \`int stueckzahl = 0;\`
    - **Zuweisen** heisst: später einen neuen Wert hineinschreiben: \`stueckzahl = 120;\`

    Das Gleichheitszeichen \`=\` ist in C **kein mathematisches «ist gleich»**, sondern ein Befehl: «Berechne rechts und speichere das Ergebnis links». Darum ist \`stueckzahl = stueckzahl + 1;\` sinnvoll: Der alte Wert wird gelesen, um 1 erhöht und zurückgeschrieben.

    ### Werte ausgeben

    In \`printf\` steht \`%d\` als **Platzhalter** für eine ganze Zahl. Nach dem Formattext folgen, durch Kommas getrennt, die Werte in derselben Reihenfolge wie die Platzhalter:

    ~~~c
    printf("Gut: %d, Ausschuss: %d\n", gut, ausschuss);
    ~~~

    > [!achtung] Ohne Startwert steht Müll drin
    > Eine lokale Variable ohne Initialisierung enthält einen **zufälligen Wert**: das, was zufällig vorher an dieser Speicherstelle stand. Liest du sie, bevor du etwas hineingeschrieben hast, ist das Ergebnis unvorhersehbar. Clang warnt: «variable is uninitialized when used here». Gewöhne dir an, jede Variable bei der Deklaration zu initialisieren.

    ### Mehrere Variablen

    Mehrere Variablen gleichen Typs kannst du in einer Zeile deklarieren: \`int x = 0, y = 0;\`. Übersichtlicher ist meist eine Variable pro Zeile mit einem Kommentar zur Bedeutung oder Einheit.

    > [!praxis] Variablen auf dem Mikrocontroller
    > Ein Arduino Uno hat nur 2048 Byte Arbeitsspeicher. Dort zählt jede Variable, und man wählt den Typ bewusst so klein wie möglich. Mehr dazu in der nächsten Lektion.
  `,
  syntax: [
    {
      code: c`
        typ name;              // Deklaration
        typ name = wert;       // Deklaration mit Initialisierung
        name = neuer_wert;     // Zuweisung
      `,
      text: md`Beispiel: \`int temperatur = 21;\` und später \`temperatur = 23;\`.`,
    },
  ],
  beispiel: {
    code: c`
      #include <stdio.h>

      int main(void) {
          int stueck = 0;        // gefertigte Teile
          int ausschuss = 0;     // davon fehlerhaft

          stueck = 120;          // Ergebnis Schicht 1
          ausschuss = 3;
          printf("Gut: %d, Ausschuss: %d\n", stueck - ausschuss, ausschuss);

          stueck = stueck + 95;  // Schicht 2 dazuzählen
          printf("Gesamt nach Schicht 2: %d\n", stueck);
          return 0;
      }
    `,
    ausgabe: out`
      Gut: 117, Ausschuss: 3
      Gesamt nach Schicht 2: 215
    `,
  },
  zeilen: [
    { zeilen: '4-5', text: md`Zwei Variablen vom Typ \`int\`, beide mit 0 initialisiert. Die Kommentare sagen, was sie bedeuten.` },
    { zeilen: '7-8', text: md`Zuweisungen: Die alten Werte (0) werden durch 120 und 3 ersetzt.` },
    { zeilen: '9', text: md`Zwei Platzhalter \`%d\`, zwei Werte. Der erste Wert ist eine Rechnung: \`stueck - ausschuss\` ergibt 117.` },
    { zeilen: '11', text: md`Der alte Wert 120 wird gelesen, 95 addiert, und das Ergebnis 215 zurück in \`stueck\` geschrieben.` },
  ],
  ergebnis: md`
    Die erste Zeile zeigt 117 Gutteile und 3 Ausschussteile, die zweite den neuen Gesamtwert 215. \`stueck\` selbst wurde in Zeile 9 nicht verändert: Die Rechnung \`stueck - ausschuss\` erzeugt nur einen Wert für die Ausgabe.
  `,
  fehler: [
    {
      titel: 'Variable vor der Deklaration benutzt',
      text: md`Der Compiler liest von oben nach unten. Steht die Deklaration erst später oder fehlt sie ganz, meldet er «use of undeclared identifier».`,
      falsch: c`
        zaehler = 5;
        int zaehler;
      `,
      richtig: c`
        int zaehler = 0;
        zaehler = 5;
      `,
    },
    {
      titel: 'Lesen ohne Startwert',
      text: md`Ohne Initialisierung ist der Wert zufällig. Das Programm kann bei jedem Start etwas anderes ausgeben.`,
      falsch: c`
        int summe;
        summe = summe + 10;
      `,
      richtig: c`
        int summe = 0;
        summe = summe + 10;
      `,
    },
    {
      titel: 'Zweimal deklariert',
      text: md`Ein Name darf im selben Block nur einmal deklariert werden. Beim zweiten Mal nur noch zuweisen, also ohne Typ davor.`,
      falsch: c`
        int druck = 2;
        int druck = 3;
      `,
      richtig: c`
        int druck = 2;
        druck = 3;
      `,
    },
  ],
  uebungen: [
    {
      id: 'k02-l01-u1',
      typ: 'vorhersage',
      titel: 'Werte kopieren',
      stufe: 1,
      themen: ['variablen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int a = 5;
            int b = a;
            a = 7;
            printf("a = %d, b = %d\n", a, b);
            return 0;
        }
      `,
      ausgabe: out`
        a = 7, b = 5
      `,
      erklaerung: md`\`b = a\` kopiert den **Wert** 5 in \`b\`. Danach sind die beiden Variablen unabhängig; die spätere Änderung von \`a\` betrifft \`b\` nicht.`,
    },
    {
      id: 'k02-l01-u2',
      typ: 'programm',
      titel: 'Wassertank',
      stufe: 1,
      themen: ['variablen'],
      aufgabe: md`
        Ein Tank enthält am Morgen 500 Liter. Über den Tag werden 120 Liter entnommen und 80 Liter nachgefüllt. Speichere den Füllstand in einer Variable \`fuellstand\`, verändere sie mit zwei Zuweisungen und gib aus:

        ~~~text
        Morgen: 500 l
        Abend: 460 l
        ~~~
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int fuellstand = 500;
            printf("Morgen: %d l\n", fuellstand);

            // Entnahme und Zufluss

            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int fuellstand = 500;
            printf("Morgen: %d l\n", fuellstand);

            fuellstand = fuellstand - 120;  // Entnahme
            fuellstand = fuellstand + 80;   // Zufluss
            printf("Abend: %d l\n", fuellstand);
            return 0;
        }
      `,
      tests: [{ name: 'Füllstand morgens und abends', erwartet: { stdout: 'Morgen: 500 l\nAbend: 460 l\n' } }],
      regeln: [{ darfNicht: '460', meldung: 'Rechne den Abendwert mit der Variable aus, statt 460 direkt hinzuschreiben.' }],
      hinweise: [md`Entnahme: \`fuellstand = fuellstand - 120;\``, md`Danach den Zufluss addieren und mit \`printf("Abend: %d l\n", fuellstand);\` ausgeben.`],
    },
    {
      id: 'k02-l01-u3',
      typ: 'fehlersuche',
      titel: 'Zähler mit Macken',
      stufe: 2,
      themen: ['variablen'],
      aufgabe: md`
        Dieses Programm soll die Impulse eines Durchflusszählers addieren und \`Impulse: 45\` ausgeben. Es enthält zwei Fehler. Der Compiler meldet einen davon als Fehler und den anderen als Warnung.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int impulse;
            impulse = impulse + 20;
            impulse = impulse + 25;
            printf("Impulse: %d\n", Impulse);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int impulse = 0;
            impulse = impulse + 20;
            impulse = impulse + 25;
            printf("Impulse: %d\n", impulse);
            return 0;
        }
      `,
      tests: [{ name: 'Gibt 45 Impulse aus', erwartet: { stdout: 'Impulse: 45\n' } }],
      hinweise: [md`C unterscheidet Gross- und Kleinschreibung: \`Impulse\` ist nicht \`impulse\`.`, md`Womit startet die Zählung? Die Variable braucht einen Startwert.`],
    },
    {
      id: 'k02-l01-u4',
      typ: 'programm',
      titel: 'Werte tauschen',
      stufe: 3,
      themen: ['variablen'],
      aufgabe: md`
        Zwei Variablen \`links\` und \`rechts\` enthalten die Drehzahlen zweier Motoren. Tausche ihre Werte, sodass danach \`links\` 900 und \`rechts\` 1200 enthält. Verwende dazu eine dritte Variable. Die beiden \`printf\` dürfen nicht verändert werden.
      `,
      start: c`
        #include <stdio.h>

        int main(void) {
            int links = 1200;
            int rechts = 900;

            // hier tauschen

            printf("links: %d\n", links);
            printf("rechts: %d\n", rechts);
            return 0;
        }
      `,
      loesung: c`
        #include <stdio.h>

        int main(void) {
            int links = 1200;
            int rechts = 900;

            int zwischen = links;   // alten Wert merken
            links = rechts;
            rechts = zwischen;

            printf("links: %d\n", links);
            printf("rechts: %d\n", rechts);
            return 0;
        }
      `,
      tests: [{ name: 'Werte sind getauscht', erwartet: { stdout: 'links: 900\nrechts: 1200\n' } }],
      regeln: [{ darfNicht: '=\\s*(900|1200)\\s*;[\\s\\S]*=\\s*(900|1200)\\s*;[\\s\\S]*=\\s*(900|1200)\\s*;', meldung: 'Tausche die Werte über Variablen, nicht indem du die Zahlen neu hinschreibst.' }],
      hinweise: [md`Schreibst du sofort \`links = rechts;\`, ist der alte Wert von \`links\` verloren.`, md`Merke dir zuerst \`links\` in einer Hilfsvariable: \`int zwischen = links;\``],
    },
  ],
  wissenscheck: [
    {
      id: 'k02-l01-c1',
      typ: 'auswahl',
      themen: ['variablen'],
      frage: 'Was ist eine **Initialisierung**?',
      optionen: [
        { text: 'Der Variable bei der Deklaration einen Startwert geben, z. B. `int x = 0;`', richtig: true },
        { text: 'Den Wert einer Variable mit `printf` ausgeben', warum: 'Das ist eine Ausgabe.' },
        { text: 'Einer bestehenden Variable später einen neuen Wert geben', warum: 'Das ist eine Zuweisung.' },
      ],
    },
    {
      id: 'k02-l01-c2',
      typ: 'wahrfalsch',
      themen: ['variablen'],
      aussage: 'Eine lokale Variable ohne Initialisierung hat automatisch den Wert 0.',
      richtig: false,
      erklaerung: 'Ihr Inhalt ist zufällig. Darum immer initialisieren.',
    },
    {
      id: 'k02-l01-c3',
      typ: 'vorhersage',
      themen: ['variablen'],
      code: c`
        #include <stdio.h>

        int main(void) {
            int x = 10;
            x = x * 2;
            x = x - 5;
            printf("%d\n", x);
            return 0;
        }
      `,
      ausgabe: out`
        15
      `,
    },
  ],
  zusammenfassung: [
    'Eine Variable ist ein benannter Speicherplatz mit festem Typ, z. B. `int` für ganze Zahlen.',
    'Deklarieren: `int x;` · Initialisieren: `int x = 0;` · Zuweisen: `x = 5;`',
    '`=` heisst «speichere rechts nach links», darum ist `x = x + 1;` sinnvoll.',
    'Ohne Startwert ist der Inhalt zufällig: immer initialisieren.',
    '`%d` ist der Platzhalter für eine ganze Zahl in `printf`.',
  ],
  referenz: ['int', 'fmt-d'],
};
