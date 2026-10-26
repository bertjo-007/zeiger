/**
 * Deutsche Erklärungen zu den häufigsten Meldungen von Clang.
 * Die Originalmeldung bleibt immer sichtbar – sie ist das, was Joshua später auch
 * auf dem eigenen PC sieht. Die Erklärung sagt, was gemeint ist und was meist hilft.
 */
import type { Diagnostic } from './types.ts';

export interface Explanation {
  titel: string;
  text: string;
  tipp?: string;
}

interface Rule {
  re: RegExp;
  titel: string;
  text: (m: RegExpExecArray) => string;
  tipp?: string;
}

const q = (s: string | undefined) => (s ? `\`${s}\`` : '');

const RULES: Rule[] = [
  // --- Syntax ---
  {
    re: /^expected ';'/,
    titel: 'Strichpunkt fehlt',
    text: () => 'Jede Anweisung in C endet mit einem `;`. An dieser Stelle hat der Compiler einen erwartet.',
    tipp: 'Der Fehler wird oft erst am Anfang der nächsten Zeile gemeldet. Schau ans Ende der Zeile davor.',
  },
  {
    re: /^expected '\}'/,
    titel: 'Geschweifte Klammer fehlt',
    text: () => 'Ein Block wurde mit `{` geöffnet, aber nie mit `}` geschlossen.',
    tipp: 'Zähle die Klammern paarweise. Sauberes Einrücken macht fehlende Klammern sichtbar.',
  },
  {
    re: /^expected '\)'/,
    titel: 'Runde Klammer fehlt',
    text: () => 'Eine `(` wurde nicht geschlossen, zum Beispiel bei einem Funktionsaufruf oder einer Bedingung.',
  },
  {
    re: /^extraneous closing brace/,
    titel: 'Eine `}` zu viel',
    text: () => 'Hier steht eine schliessende geschweifte Klammer, zu der es keine öffnende gibt.',
  },
  {
    re: /^expected expression/,
    titel: 'Ausdruck erwartet',
    text: () => 'An dieser Stelle muss ein Wert oder eine Berechnung stehen, aber der Compiler findet nichts Passendes. Typisch ist ein Operator ohne zweiten Operanden oder ein überzähliges Zeichen.',
  },
  {
    re: /^expected identifier or '\('/,
    titel: 'Name erwartet',
    text: () => 'Der Compiler erwartet hier einen Namen (z. B. einer Variable oder Funktion). Häufige Ursache: ein `;` nach dem Funktionskopf oder Code ausserhalb einer Funktion.',
  },
  {
    re: /^expected 'while' in do\/while loop/,
    titel: '`while` fehlt nach `do`',
    text: () => 'Eine `do`-Schleife endet immer mit `while (Bedingung);`.',
  },
  {
    re: /^missing terminating '?"'? character|^missing terminating " character/,
    titel: 'Zeichenkette nicht geschlossen',
    text: () => 'Ein Text in `"…"` wurde nicht mit einem zweiten `"` beendet.',
  },
  {
    re: /^missing terminating ' character/,
    titel: 'Zeichen nicht geschlossen',
    text: () => "Ein einzelnes Zeichen steht in einfachen Anführungszeichen: `'A'`.",
  },
  {
    re: /^multi-character character constant/,
    titel: 'Mehrere Zeichen in einfachen Anführungszeichen',
    text: () => "`'…'` fasst genau ein Zeichen. Für Text mit mehreren Zeichen nimmst du doppelte Anführungszeichen: `\"Text\"`.",
  },
  {
    re: /^invalid suffix '(.+?)' on (integer|floating) constant/,
    titel: 'Ungültige Zahl',
    text: (m) => `Hinter der Zahl steht ${q(m[1])}, das gehört nicht zu einer gültigen Zahl. Kommazahlen schreibt man in C mit Punkt: \`3.14\`.`,
  },
  {
    re: /^'break' statement not in loop or switch/,
    titel: '`break` ausserhalb einer Schleife',
    text: () => '`break` beendet nur Schleifen und `switch`. Ausserhalb davon ist es nicht erlaubt.',
  },
  {
    re: /^'continue' statement not in loop/,
    titel: '`continue` ausserhalb einer Schleife',
    text: () => '`continue` springt zum nächsten Schleifendurchlauf und ist nur in Schleifen erlaubt.',
  },

  // --- Namen und Deklarationen ---
  {
    re: /^use of undeclared identifier '(.+?)'(?:; did you mean '(.+?)'\?)?/,
    titel: 'Unbekannter Name',
    text: (m) =>
      `${q(m[1])} wurde nirgends deklariert.` +
      (m[2] ? ` Meintest du ${q(m[2])}?` : ' Entweder fehlt die Deklaration (z. B. `int x;`), der Name ist falsch geschrieben, oder die Variable gilt an dieser Stelle nicht mehr (Gültigkeitsbereich).'),
    tipp: 'C unterscheidet Gross- und Kleinschreibung: `summe` und `Summe` sind verschiedene Namen.',
  },
  {
    re: /^call to undeclared library function '(.+?)'/,
    titel: 'Header-Datei fehlt',
    text: (m) => `${q(m[1])} ist eine Funktion der Standardbibliothek, aber ihre Header-Datei wurde nicht eingebunden.`,
    tipp: 'Sieh in der Notiz darunter nach, welches `#include` fehlt, z. B. `#include <stdio.h>` für `printf`.',
  },
  {
    re: /^call to undeclared function '(gets)'/,
    titel: '`gets` gibt es nicht mehr',
    text: () => '`gets` wurde mit C11 aus der Sprache entfernt, weil es jede Eingabe ungeprüft in den Speicher schreibt und so Pufferüberläufe verursacht.',
    tipp: 'Nimm `fgets(puffer, sizeof puffer, stdin)`.',
  },
  {
    re: /^call to undeclared function '(.+?)'/,
    titel: 'Funktion unbekannt',
    text: (m) => `${q(m[1])} wird aufgerufen, bevor der Compiler sie kennt. In C muss eine Funktion vor dem ersten Aufruf deklariert sein.`,
    tipp: 'Schreibe die Funktion über `main`, setze einen Prototyp an den Dateianfang oder binde den passenden Header ein. Prüfe auch die Schreibweise.',
  },
  {
    re: /^unknown type name '(bool)'/,
    titel: '`bool` braucht einen Header',
    text: () => 'In C17 gibt es `bool`, `true` und `false` erst mit `#include <stdbool.h>`. (Ab C23 sind sie fest eingebaut.)',
  },
  {
    re: /^unknown type name '(u?int(8|16|32|64)_t|size_t)'/,
    titel: 'Typ braucht einen Header',
    text: (m) => `${q(m[1])} ist in ${m[1] === 'size_t' ? '`<stddef.h>` (oder `<stdio.h>`, `<stdlib.h>`)' : '`<stdint.h>`'} definiert.`,
  },
  {
    re: /^unknown type name 'string'/,
    titel: 'Einen Typ `string` gibt es in C nicht',
    text: () => 'Zeichenketten sind in C Arrays aus `char`, z. B. `char name[20];`, oder Zeiger `const char *`.',
  },
  {
    re: /^unknown type name '(.+?)'/,
    titel: 'Unbekannter Typ',
    text: (m) => `${q(m[1])} ist kein bekannter Datentyp. Ist er falsch geschrieben, fehlt ein \`typedef\` oder ein \`#include\`? Für Strukturen ohne \`typedef\` schreibt man \`struct ${m[1]}\`.`,
  },
  {
    re: /^type specifier missing, defaults to 'int'/,
    titel: 'Datentyp fehlt',
    text: () => 'Vor dem Namen fehlt der Typ. Seit C99 nimmt C nicht mehr automatisch `int` an.',
    tipp: 'Schreibe z. B. `int main(void)` statt `main()`.',
  },
  {
    re: /^redefinition of '(.+?)'/,
    titel: 'Doppelt definiert',
    text: (m) => `${q(m[1])} wurde im selben Gültigkeitsbereich bereits definiert. Eine Variable darf pro Block nur einmal deklariert werden.`,
  },
  {
    re: /^conflicting types for '(.+?)'/,
    titel: 'Widersprüchliche Typen',
    text: (m) => `${q(m[1])} wurde zweimal mit unterschiedlichen Typen deklariert. Oft passen Prototyp und Definition nicht zusammen.`,
  },
  {
    re: /^'main' must return 'int'/,
    titel: '`main` muss `int` zurückgeben',
    text: () => '`void main` ist kein Standard-C. Schreibe `int main(void)` und am Ende `return 0;`.',
  },
  {
    re: /^variable has incomplete type '(.+?)'|^incomplete definition of type '(.+?)'/,
    titel: 'Unvollständiger Typ',
    text: (m) => `Der Typ ${q(m[1] ?? m[2])} ist an dieser Stelle nur dem Namen nach bekannt, sein Aufbau aber nicht. Fehlt die \`struct\`-Definition oder ein \`#include\`?`,
  },
  {
    re: /^no member named '(.+?)' in '(.+?)'/,
    titel: 'Feld gibt es nicht',
    text: (m) => `${q(m[2])} hat kein Feld namens ${q(m[1])}. Prüfe die Schreibweise in der \`struct\`-Definition.`,
  },
  {
    re: /^member reference type '(.+?)' is a pointer; did you mean to use '->'\?/,
    titel: '`->` statt `.` verwenden',
    text: () => 'Links steht ein Zeiger auf eine Struktur. Felder erreichst du dann mit `p->feld` (Kurzform für `(*p).feld`).',
  },
  {
    re: /^member reference type '(.+?)' is not a pointer; did you mean to use '\.'\?/,
    titel: '`.` statt `->` verwenden',
    text: () => 'Links steht direkt eine Struktur, kein Zeiger. Felder erreichst du mit `s.feld`.',
  },
  {
    re: /^'(.+?)' file not found/,
    titel: 'Header-Datei nicht gefunden',
    text: (m) => `Die Datei ${q(m[1])} gibt es nicht. Prüfe die Schreibweise (z. B. \`stdio.h\`, nicht \`studio.h\`). Eigene Header bindest du mit \`"…"\` ein, Standard-Header mit \`<…>\`.`,
  },

  // --- Funktionen ---
  {
    re: /^too few arguments to function call, expected (\d+), have (\d+)/,
    titel: 'Zu wenige Argumente',
    text: (m) => `Die Funktion erwartet ${m[1]} Argument(e), übergeben wurden ${m[2]}.`,
  },
  {
    re: /^too many arguments to function call, expected (\d+), have (\d+)/,
    titel: 'Zu viele Argumente',
    text: (m) => `Die Funktion erwartet ${m[1]} Argument(e), übergeben wurden ${m[2]}.`,
  },
  {
    re: /^non-void function does not return a value in all control paths/,
    titel: 'Nicht jeder Weg hat ein `return`',
    text: () => 'Die Funktion gibt einen Wert zurück, aber auf mindestens einem Weg (z. B. wenn kein `if` zutrifft) erreicht sie das Ende ohne `return`. Der Aufrufer bekommt dann einen zufälligen Wert.',
  },
  {
    re: /^non-void function does not return a value/,
    titel: '`return` fehlt',
    text: () => 'Die Funktion ist mit einem Rückgabetyp deklariert, gibt aber nie einen Wert zurück.',
  },
  {
    re: /^void function '(.+?)' should not return a value/,
    titel: '`void`-Funktion gibt etwas zurück',
    text: (m) => `${q(m[1])} ist als \`void\` deklariert und darf deshalb kein \`return wert;\` enthalten, nur \`return;\`.`,
  },
  {
    re: /^address of stack memory associated with local variable '(.+?)' returned/,
    titel: 'Adresse einer lokalen Variable zurückgegeben',
    text: (m) => `${q(m[1])} lebt nur, solange die Funktion läuft. Ihre Adresse ist danach ungültig.`,
    tipp: 'Gib den Wert selbst zurück, nutze `static`, reserviere mit `malloc` oder lass den Aufrufer einen Puffer übergeben.',
  },
  {
    re: /^all paths through this function will call itself/,
    titel: 'Rekursion ohne Abbruch',
    text: () => 'Die Funktion ruft sich auf jedem Weg wieder selbst auf. Ohne Abbruchbedingung läuft der Stapelspeicher (Stack) über.',
  },
  {
    re: /^sizeof on array function parameter will return size of '(.+?)'/,
    titel: '`sizeof` auf einem Array-Parameter',
    text: (m) => `Ein Array-Parameter ist in Wahrheit ein Zeiger. \`sizeof\` liefert hier die Grösse von ${q(m[1])}, nicht die des Arrays.`,
    tipp: 'Übergib die Länge als eigenen Parameter.',
  },

  // --- Formatangaben ---
  {
    re: /^format specifies type '(.+?) \*' but the argument has type '(.+?)'$/,
    titel: '`&` vergessen?',
    text: (m) => `Die Formatangabe erwartet eine Adresse (${q(m[1] + ' *')}), übergeben wurde aber ${q(m[2])}. Bei \`scanf\` braucht jede Variable ein \`&\` davor (ausser bei \`char\`-Arrays für \`%s\`).`,
  },
  {
    re: /^format specifies type '(.+?)' but the argument has type '(.+?)'/,
    titel: 'Platzhalter passt nicht zum Typ',
    text: (m) => `Der Platzhalter erwartet ${q(m[1])}, das Argument ist aber ${q(m[2])}. Die Ausgabe ist dann falsch oder sinnlos.`,
    tipp: '`%d` für `int`, `%ld` für `long`, `%f` für `double`/`float` bei printf, `%lf` für `double` bei scanf, `%c` für `char`, `%s` für Text, `%zu` für `size_t`, `%p` für Adressen.',
  },
  {
    re: /^more '%' conversions than data arguments/,
    titel: 'Zu wenige Werte für die Platzhalter',
    text: () => 'Im Formattext stehen mehr Platzhalter (`%…`) als Werte danach. Für den fehlenden Wert gibt printf irgendetwas aus.',
  },
  {
    re: /^data argument not used by format string/,
    titel: 'Wert ohne Platzhalter',
    text: () => 'Nach dem Formattext steht ein Wert, für den es keinen Platzhalter gibt. Er wird nicht ausgegeben.',
  },
  {
    re: /^format string is not a string literal/,
    titel: 'Formattext ist eine Variable',
    text: () => '`printf(text)` ist gefährlich: Enthält `text` ein `%`, liest printf Werte, die es nicht gibt.',
    tipp: 'Schreibe `printf("%s", text)` oder `fputs(text, stdout)`.',
  },
  {
    re: /^invalid conversion specifier '(.+?)'/,
    titel: 'Unbekannter Platzhalter',
    text: (m) => `\`%${m[1]}\` ist keine gültige Formatangabe. Für ein Prozentzeichen schreibst du \`%%\`.`,
  },

  // --- Vergleiche und Bedingungen ---
  {
    re: /^using the result of an assignment as a condition without parentheses/,
    titel: '`=` statt `==`?',
    text: () => '`=` weist einen Wert zu, `==` vergleicht. `if (x = 3)` setzt x auf 3 und ist danach immer wahr.',
  },
  {
    re: /^equality comparison with extraneous parentheses/,
    titel: 'Doppelte Klammern um einen Vergleich',
    text: () => 'Hier steht `((a == b))`. Das ist erlaubt, aber oft war eine Zuweisung gemeint oder die Klammern sind überflüssig.',
  },
  {
    re: /^result of comparison against a string literal is unspecified/,
    titel: 'Texte nicht mit `==` vergleichen',
    text: () => '`==` vergleicht bei Zeichenketten die Adressen, nicht den Inhalt.',
    tipp: 'Nimm `strcmp(a, b) == 0` aus `<string.h>`.',
  },
  {
    re: /^comparison between pointer and integer/,
    titel: 'Zeiger mit Zahl verglichen',
    text: () => "Links und rechts stehen verschiedene Arten von Werten. Typischer Fall: Ein Text (`char *`) wird mit einem Zeichen (`'a'`) verglichen. Vergleiche z. B. `text[0] == 'a'`.",
  },
  {
    re: /^comparison of integers of different signs: '(.+?)' and '(.+?)'/,
    titel: 'Vergleich mit und ohne Vorzeichen',
    text: (m) => `${q(m[1])} und ${q(m[2])} haben unterschiedliche Vorzeichen-Arten. Ein negativer Wert wird dabei zu einer riesigen positiven Zahl und der Vergleich fällt falsch aus.`,
    tipp: 'Nimm für Schleifenzähler über Arraylängen denselben Typ, z. B. `size_t i`.',
  },
  {
    re: /^(?:result of )?comparison .*is always (true|false)/,
    titel: 'Vergleich ist immer gleich',
    text: (m) => `Dieser Vergleich ist wegen des Wertebereichs des Typs immer ${m[1] === 'true' ? 'wahr' : 'falsch'}. Meist ist der Typ zu klein gewählt (z. B. \`char\` für Werte über 127).`,
  },
  {
    re: /^self-comparison always evaluates to (true|false)/,
    titel: 'Vergleich mit sich selbst',
    text: () => 'Hier wird eine Variable mit sich selbst verglichen. Vermutlich war eine andere Variable gemeint.',
  },
  {
    re: /^(if statement|for loop|while loop) has empty body/,
    titel: 'Strichpunkt nach Bedingung',
    text: (m) => `${m[1].startsWith('if') ? '`if (…);`' : m[1].startsWith('for') ? '`for (…);`' : '`while (…);`'}: Der Strichpunkt ist bereits der (leere) Rumpf. Der Block danach gehört nicht mehr dazu.`,
  },
  {
    re: /^the address of '(.+?)' will always evaluate as 'true'/,
    titel: 'Adresse ist nie 0',
    text: (m) => `Die Adresse von ${q(m[1])} ist immer gültig, die Bedingung also immer wahr. Fehlen beim Funktionsaufruf die Klammern \`()\`?`,
  },

  // --- Typen und Umwandlungen ---
  {
    re: /^incompatible pointer to integer conversion/,
    titel: 'Zeiger, wo eine Zahl erwartet wird',
    text: () => "Hier wird eine Adresse (z. B. ein Text in `\"…\"` oder ein Array) dort verwendet, wo eine Zahl oder ein Zeichen hingehört. Für ein einzelnes Zeichen: `'A'` statt `\"A\"`.",
  },
  {
    re: /^incompatible integer to pointer conversion/,
    titel: 'Zahl, wo ein Zeiger erwartet wird',
    text: () => 'Hier steht eine Zahl, erwartet wird aber eine Adresse. Fehlt ein `&` oder hast du `*` zu viel geschrieben?',
  },
  {
    re: /^incompatible pointer types/,
    titel: 'Zeigertypen passen nicht',
    text: () => 'Die beiden Zeiger zeigen auf unterschiedliche Typen (z. B. `int *` und `double *`). Prüfe die Deklarationen und die Anzahl der `*`.',
  },
  {
    re: /^implicit conversion from '(.+?)' to '(.+?)' changes value from (.+?) to (.+)$/,
    titel: 'Wert ändert sich bei der Umwandlung',
    text: (m) => `Aus ${q(m[1])} wird ${q(m[2])}, dabei wird ${m[3]} zu ${m[4]}. Bei der Umwandlung in eine Ganzzahl fallen Nachkommastellen weg.`,
    tipp: 'Wenn das so gewollt ist, schreibe die Umwandlung ausdrücklich: `(int)wert`.',
  },
  {
    re: /^implicit conversion loses (integer|floating-point) precision: '(.+?)' to '(.+?)'/,
    titel: 'Genauigkeit geht verloren',
    text: (m) => `${q(m[2])} passt nicht vollständig in ${q(m[3])}. Grosse Werte oder Nachkommastellen können verloren gehen.`,
  },
  {
    re: /^array type '(.+?)' is not assignable/,
    titel: 'Arrays kann man nicht zuweisen',
    text: () => 'Ein ganzes Array lässt sich nicht mit `=` neu befüllen. Für Text nimmst du `strcpy`/`snprintf`, für Zahlen eine Schleife.',
  },
  {
    re: /^expression is not assignable/,
    titel: 'Hier kann nichts zugewiesen werden',
    text: () => 'Links vom `=` muss eine Variable stehen (etwas mit Speicherplatz), nicht eine Berechnung wie `a + 1`.',
  },
  {
    re: /^cannot assign to variable '(.+?)' with const-qualified type/,
    titel: 'Konstante ändern',
    text: (m) => `${q(m[1])} ist mit \`const\` deklariert und darf nach der Initialisierung nicht mehr geändert werden.`,
  },
  {
    re: /^read-only variable is not assignable/,
    titel: 'Nur lesbar',
    text: () => 'Dieser Wert ist `const` und darf nicht geändert werden.',
  },
  {
    re: /^invalid operands to binary expression \('(.+?)' and '(.+?)'\)/,
    titel: 'Operator passt nicht zu den Typen',
    text: (m) => `Der Operator lässt sich nicht auf ${q(m[1])} und ${q(m[2])} anwenden. Strukturen oder Arrays kann man z. B. nicht direkt mit \`+\` oder \`==\` verknüpfen.`,
  },
  {
    re: /^subscripted value is not an array, pointer, or vector/,
    titel: '`[ ]` bei einer Nicht-Array-Variable',
    text: () => 'Eckige Klammern funktionieren nur bei Arrays und Zeigern. Die Variable links davon ist keins von beiden.',
  },
  {
    re: /^indirection requires pointer operand/,
    titel: '`*` bei einer Nicht-Zeiger-Variable',
    text: () => '`*` vor einer Variable liest den Wert, auf den ein Zeiger zeigt. Die Variable hier ist aber kein Zeiger.',
  },
  {
    re: /^cannot take the address of an rvalue/,
    titel: 'Adresse eines Zwischenergebnisses',
    text: () => '`&` braucht etwas mit festem Speicherplatz, z. B. eine Variable, nicht das Ergebnis einer Berechnung.',
  },
  {
    re: /^passing '(.+?)' to parameter of type '(.+?)'/,
    titel: 'Argument hat den falschen Typ',
    text: (m) => `Übergeben wird ${q(m[1])}, die Funktion erwartet aber ${q(m[2])}.`,
  },
  {
    re: /^returning '(.+?)' from a function with incompatible result type '(.+?)'/,
    titel: 'Rückgabewert hat den falschen Typ',
    text: (m) => `Zurückgegeben wird ${q(m[1])}, die Funktion ist aber mit ${q(m[2])} deklariert.`,
  },

  // --- Arrays und Speicher ---
  {
    re: /^array index (-?\d+) is past the end of the array/,
    titel: 'Index ausserhalb des Arrays',
    text: (m) => `Index ${m[1]} liegt hinter dem Ende. Ein Array mit n Elementen hat die Indizes 0 bis n−1.`,
  },
  {
    re: /^array index (-?\d+) is before the beginning of the array/,
    titel: 'Negativer Index',
    text: () => 'Der Index liegt vor dem ersten Element. Gültig sind 0 bis n−1.',
  },
  {
    re: /^initializer-string for char array is too long/,
    titel: 'Text zu lang für das Array',
    text: () => 'Der Text passt nicht ins `char`-Array. Denk an das abschliessende `\\0`: Für «Hallo» braucht es 6 Zeichen Platz.',
  },
  {
    re: /^excess elements in (array|struct|scalar) initializer/,
    titel: 'Zu viele Startwerte',
    text: () => 'In den `{ … }` stehen mehr Werte, als Platz vorhanden ist.',
  },
  {
    re: /^variable length array/,
    titel: 'Array mit variabler Länge',
    text: () => 'Die Länge dieses Arrays steht erst zur Laufzeit fest (VLA). Das ist in C17 nur optional erlaubt und riskant bei grossen Werten.',
    tipp: 'Nimm eine feste Grösse mit `#define` oder reserviere mit `malloc`.',
  },

  // --- Variablen ---
  {
    re: /^variable '(.+?)' is uninitialized when used here/,
    titel: 'Variable ohne Startwert',
    text: (m) => `${q(m[1])} wird gelesen, bevor ihr ein Wert zugewiesen wurde. Lokale Variablen enthalten anfangs einen zufälligen Wert.`,
    tipp: 'Gib der Variable bei der Deklaration einen Startwert, z. B. `int summe = 0;`.',
  },
  {
    re: /^variable '(.+?)' is used uninitialized whenever/,
    titel: 'Variable manchmal ohne Startwert',
    text: (m) => `Auf mindestens einem Weg durch das Programm wird ${q(m[1])} gelesen, ohne vorher einen Wert bekommen zu haben.`,
  },
  {
    re: /^variable '(.+?)' (?:may be|is) uninitialized/,
    titel: 'Variable eventuell ohne Startwert',
    text: (m) => `${q(m[1])} hat möglicherweise noch keinen Wert, wenn sie gelesen wird.`,
  },
  {
    re: /^unused variable '(.+?)'/,
    titel: 'Unbenutzte Variable',
    text: (m) => `${q(m[1])} wird deklariert, aber nie verwendet. Das ist kein Fehler, deutet aber oft auf einen Tippfehler oder vergessenen Code hin.`,
  },
  {
    re: /^variable '(.+?)' set but not used/,
    titel: 'Wert wird nie gelesen',
    text: (m) => `${q(m[1])} bekommt einen Wert, der danach nie verwendet wird.`,
  },
  {
    re: /^unused parameter '(.+?)'/,
    titel: 'Unbenutzter Parameter',
    text: (m) => `Der Parameter ${q(m[1])} wird in der Funktion nicht verwendet.`,
  },
  {
    re: /^unused function '(.+?)'/,
    titel: 'Unbenutzte Funktion',
    text: (m) => `Die \`static\`-Funktion ${q(m[1])} wird nirgends aufgerufen.`,
  },
  {
    re: /^expression result unused/,
    titel: 'Ergebnis wird nicht verwendet',
    text: () => 'Hier wird etwas berechnet, aber das Ergebnis landet nirgends. Fehlt eine Zuweisung (`x = …`) oder steht `==` statt `=`?',
  },

  // --- Rechnen ---
  {
    re: /^division by zero is undefined|^remainder by zero is undefined/,
    titel: 'Division durch 0',
    text: () => 'Teilen durch 0 ist in C für Ganzzahlen nicht definiert. Das Programm kann abstürzen.',
  },
  {
    re: /^overflow in expression; result is (.+?) with type '(.+?)'/,
    titel: 'Überlauf',
    text: (m) => `Das Ergebnis passt nicht in ${q(m[2])} und wäre ${m[1]}. Vorzeichenbehaftete Überläufe sind in C undefiniertes Verhalten.`,
    tipp: 'Nimm einen grösseren Typ wie `long long`.',
  },
  {
    re: /^shift count >= width of type|^shift count is negative/,
    titel: 'Ungültige Schiebeweite',
    text: () => 'Man darf höchstens um (Bitbreite − 1) Stellen schieben und nie um eine negative Zahl.',
  },
  {
    re: /^implicit truncation from '(.+?)' to (?:a one-bit wide )?bit-field changes value from (.+?) to (.+)$/,
    titel: 'Wert passt nicht ins Bitfeld',
    text: (m) => `Das Bitfeld ist zu schmal: ${m[2]} wird zu ${m[3]}.`,
  },

  // --- Linker ---
  {
    re: /^undefined symbol: (.+)$/,
    titel: 'Funktion nicht gefunden (Linker)',
    text: (m) => `${q(m[1])} wurde zwar deklariert, aber nirgends definiert. Der Compiler war zufrieden, erst beim Zusammenfügen (Linken) fehlt der eigentliche Code.`,
    tipp: 'Ist die Funktion falsch geschrieben, fehlt ihre Definition, oder liegt sie in einer `.c`-Datei, die nicht mitkompiliert wird?',
  },
  {
    re: /^duplicate symbol: (.+)$/,
    titel: 'Doppelt definiert (Linker)',
    text: (m) => `${q(m[1])} ist in zwei Dateien definiert. In Header-Dateien gehören nur Deklarationen (Prototypen, \`extern\`), keine Definitionen.`,
  },
];

export function explain(d: Diagnostic): Explanation | undefined {
  for (const rule of RULES) {
    const m = rule.re.exec(d.message);
    if (!m) continue;
    const e: Explanation = { titel: rule.titel, text: rule.text(m), tipp: rule.tipp };
    // Clangs Notizen enthalten oft den passenden Vorschlag; den greifen wir auf.
    const notes = (d.notes ?? []).map((n) => n.message).join('\n');
    const meinst = /did you mean '(.+?)'/.exec(notes);
    if (meinst && !e.text.includes('Meintest du')) e.text += ` Meintest du \`${meinst[1]}\`?`;
    const header = /include the header <(.+?)>/.exec(notes);
    if (header) e.tipp = `Ergänze am Dateianfang \`#include <${header[1]}>\`.`;
    return e;
  }
  return undefined;
}

/** Für Tests: Anzahl Regeln. */
export const RULE_COUNT = RULES.length;
