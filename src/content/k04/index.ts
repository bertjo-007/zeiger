import { md } from '../tags.ts';
import type { Kapitel } from '../types.ts';
import { lektion as l01 } from './l01-arithmetik.ts';
import { lektion as l02 } from './l02-zuweisung.ts';
import { lektion as l03 } from './l03-vergleiche.ts';
import { lektion as l04 } from './l04-logik.ts';
import { lektion as l05 } from './l05-rangfolge.ts';
import { test } from './test.ts';

export const kapitel: Kapitel = {
  id: 'k04',
  nr: 4,
  titel: 'Operatoren',
  kurz: md`Rechnen mit ganzen Zahlen und Kommazahlen, Teilen mit Rest, Zähler erhöhen, Werte vergleichen, Bedingungen verknüpfen und Formeln aus der Technik korrekt umsetzen.`,
  lektionen: [l01, l02, l03, l04, l05],
  test,
};
