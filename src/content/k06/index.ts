import { md } from '../tags.ts';
import type { Kapitel } from '../types.ts';
import { lektion as l01 } from './l01-while.ts';
import { lektion as l02 } from './l02-do-while.ts';
import { lektion as l03 } from './l03-for.ts';
import { lektion as l04 } from './l04-summen.ts';
import { lektion as l05 } from './l05-verschachtelt.ts';
import { lektion as l06 } from './l06-break-continue.ts';
import { test } from './test.ts';

export const kapitel: Kapitel = {
  id: 'k06',
  nr: 6,
  titel: 'Schleifen',
  kurz: md`Wiederholen mit \`while\`, \`do … while\` und \`for\`: zählen, summieren, Minimum und Maximum finden, Raster ausgeben, Schleifen gezielt abbrechen und Endlosschleifen vermeiden.`,
  lektionen: [l01, l02, l03, l04, l05, l06],
  test,
};
