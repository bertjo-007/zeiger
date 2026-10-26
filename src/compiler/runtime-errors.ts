/**
 * Ordnet Abbrüche des Programms ein und erklärt sie auf Deutsch.
 * Die Gründe stammen aus zwei Quellen: der Meldung der WebAssembly-Laufzeit
 * (z. B. «memory access out of bounds») und dem Sanitizer-Grund, den Clang in
 * die Debug-Info schreibt (z. B. «Array index out of bounds»).
 */
import type { MemFinding, TrapInfo, TrapKind } from './types.ts';

export function classify(message: string, reason: string | undefined, recursive: string | undefined): TrapKind {
  const r = (reason ?? '').toLowerCase();
  if (r.includes('index out of bounds') || r.includes('out of bounds index')) return 'bounds';
  if (r.includes('null') || r.includes('alignment')) return 'null';
  if (r.includes('divide') || r.includes('division') || r.includes('remainder')) return 'divzero';
  if (r.includes('shift')) return 'shift';
  if (r.includes('overflow')) return 'overflow';
  if (reason) return 'ub';
  const m = message.toLowerCase();
  if (recursive || /call stack|too much recursion|stack overflow/.test(m)) return 'stack';
  if (/out of bounds|memory access|index out of bounds/.test(m)) return 'memory';
  if (/unreachable/.test(m)) return 'unreachable';
  return 'unknown';
}

export interface TrapText {
  titel: string;
  text: string;
  tipp?: string;
}

export function describeTrap(trap: TrapInfo, stderr = ''): TrapText {
  const fn = trap.frames?.[0];
  const where = fn?.line ? ` in Zeile ${fn.line}${fn.function && fn.function !== 'main' ? ` (Funktion \`${fn.function}\`)` : ''}` : '';
  switch (trap.kind) {
    case 'bounds':
      return {
        titel: `Arraygrenze überschritten${where}`,
        text: 'Das Programm greift auf ein Element ausserhalb des Arrays zu. Bei einem Array mit n Elementen sind nur die Indizes 0 bis n−1 gültig.',
        tipp: 'Prüfe die Schleifenbedingung: `i < n` statt `i <= n`.',
      };
    case 'null':
      return {
        titel: `Zugriff über einen ungültigen Zeiger${where}`,
        text: 'Ein Zeiger, der auf nichts zeigt (meist `NULL`), wurde mit `*` oder `->` verwendet. Auf einem PC stürzt das Programm an dieser Stelle mit «Segmentation fault» ab.',
        tipp: 'Prüfe Zeiger vor dem Zugriff, z. B. `if (p != NULL)`. Hat `malloc` oder `fopen` vielleicht `NULL` zurückgegeben?',
      };
    case 'overflow':
      return {
        titel: `Ganzzahl-Überlauf${where}`,
        text: 'Das Ergebnis einer Rechnung passt nicht mehr in den Datentyp. Bei vorzeichenbehafteten Typen wie `int` ist das undefiniertes Verhalten: Das Ergebnis darf irgendetwas sein.',
        tipp: 'Nimm einen grösseren Typ (`long long`) oder prüfe vor der Rechnung, ob sie überläuft.',
      };
    case 'divzero':
      return {
        titel: `Division durch 0${where}`,
        text: 'Eine Ganzzahl wurde durch 0 geteilt (oder `%` mit 0 verwendet). Auf einem PC beendet das Betriebssystem das Programm sofort.',
        tipp: 'Prüfe den Teiler vorher: `if (b != 0)`.',
      };
    case 'shift':
      return {
        titel: `Ungültige Bitverschiebung${where}`,
        text: 'Es wurde um mehr Stellen geschoben, als der Typ Bits hat, oder um eine negative Anzahl.',
      };
    case 'stack':
      return {
        titel: 'Stapelspeicher übergelaufen (Stack Overflow)',
        text: trap.recursive
          ? `Die Funktion \`${trap.recursive}\` ruft sich immer wieder selbst auf, bis kein Platz mehr für weitere Aufrufe da ist.`
          : 'Es sind zu viele Funktionsaufrufe gleichzeitig aktiv oder lokale Arrays sind zu gross.',
        tipp: 'Jede Rekursion braucht eine Abbruchbedingung, die sicher erreicht wird.',
      };
    case 'memory':
      return {
        titel: `Ungültiger Speicherzugriff${where}`,
        text: 'Das Programm hat auf eine Adresse zugegriffen, die es gar nicht gibt, etwa über einen falsch berechneten oder nicht initialisierten Zeiger, oder weit hinter das Ende eines Speicherbereichs.',
        tipp: 'Prüfe Zeiger und Indizes. Wurde der Zeiger initialisiert? Ist der Speicher noch reserviert?',
      };
    case 'unreachable':
      if (stderr.includes('Assertion failed')) {
        return { titel: 'Zusicherung (`assert`) verletzt', text: 'Eine Bedingung in `assert(…)` war falsch. Das Programm wurde absichtlich angehalten. Die Meldung oben nennt Datei und Zeile.' };
      }
      return { titel: `Programm abgebrochen${where}`, text: 'Das Programm wurde mit `abort()` oder einer ähnlichen Notbremse beendet.' };
    case 'ub':
      return {
        titel: `Undefiniertes Verhalten${where}`,
        text: `Der Code tut etwas, das in C nicht erlaubt ist (${trap.reason}). Auf einem PC liefe das Programm vielleicht weiter, aber mit unvorhersehbarem Ergebnis.`,
      };
    default:
      return { titel: 'Laufzeitfehler', text: `Das Programm ist abgestürzt: ${trap.message}` };
  }
}

export function describeMemory(f: MemFinding): TrapText {
  switch (f.kind) {
    case 'leak':
      return {
        titel: `Speicherleck: ${f.bytes} Byte nicht freigegeben`,
        text: `Der Speicher aus dem ${f.nummer}. Aufruf von malloc/calloc/realloc wurde nie mit \`free\` zurückgegeben.`,
        tipp: 'Zu jedem `malloc` gehört genau ein `free`, sobald der Speicher nicht mehr gebraucht wird.',
      };
    case 'file-open':
      return {
        titel: `Datei «${f.name}» nicht geschlossen`,
        text: 'Die Datei wurde mit `fopen` geöffnet, aber nie mit `fclose` geschlossen. Gepufferte Daten können verloren gehen, und offene Dateien belegen Speicher.',
      };
    case 'double-free':
      return {
        titel: 'Speicher doppelt freigegeben',
        text: `\`${f.fn}\` wurde mit einem Zeiger aufgerufen, dessen Speicher schon freigegeben war. Auf einem PC führt das zu Abstürzen oder beschädigtem Speicher.`,
        tipp: 'Setze den Zeiger nach `free(p)` auf `NULL`. `free(NULL)` ist harmlos.',
      };
    case 'invalid-free':
      return {
        titel: 'Ungültiger Zeiger an free',
        text: `\`${f.fn}\` hat einen Zeiger bekommen, der nicht von malloc/calloc/realloc stammt (z. B. die Adresse einer normalen Variable oder einen verschobenen Zeiger).`,
      };
    case 'fclose-null':
      return {
        titel: '`fclose(NULL)`',
        text: '`fclose` wurde mit `NULL` aufgerufen. Vermutlich hat `fopen` die Datei nicht öffnen können, und das wurde nicht geprüft.',
        tipp: 'Prüfe nach `fopen` immer: `if (datei == NULL) { … }`.',
      };
    case 'incomplete':
      return { titel: 'Speicherprüfung unvollständig', text: 'Das Programm hat sehr viele Speicherblöcke gleichzeitig reserviert; nicht alle konnten überwacht werden.' };
  }
}
