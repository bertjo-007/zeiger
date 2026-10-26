import { md } from '../tags.ts';
import type { Kapitel } from '../types.ts';
import { lektion as l01 } from './l01-struct.ts';
import { lektion as l02 } from './l02-typedef.ts';
import { lektion as l03 } from './l03-strukturarrays.ts';
import { lektion as l04 } from './l04-pfeil.ts';
import { lektion as l05 } from './l05-enum.ts';
import { lektion as l06 } from './l06-union-bitfelder.ts';
import { test } from './test.ts';

export const kapitel: Kapitel = {
  id: 'k11',
  nr: 11,
  titel: 'Strukturen und weitere Datentypen',
  kurz: md`Eigene Datentypen: Strukturen mit \`struct\` und \`typedef\`, Tabellen aus Strukturen, Zeiger und der Pfeiloperator, Aufzählungen mit \`enum\` sowie \`union\` und Bitfelder.`,
  lektionen: [l01, l02, l03, l04, l05, l06],
  test,
};
