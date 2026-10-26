import { md } from '../tags.ts';
import type { Kapitel } from '../types.ts';
import { lektion as l01 } from './l01-was-ist-c.ts';
import { lektion as l02 } from './l02-aufbau.ts';
import { lektion as l03 } from './l03-printf.ts';
import { lektion as l04 } from './l04-kommentare.ts';
import { lektion as l05 } from './l05-header.ts';
import { lektion as l06 } from './l06-kompilieren.ts';
import { lektion as l07 } from './l07-erstes-programm.ts';
import { test } from './test.ts';

export const kapitel: Kapitel = {
  id: 'k01',
  nr: 1,
  titel: 'Einstieg in C',
  kurz: md`Was C ist, wie ein Programm aufgebaut ist, wie du Text ausgibst und wie aus Quelltext ein lauffähiges Programm wird. Am Ende schreibst du dein erstes eigenes Programm.`,
  lektionen: [l01, l02, l03, l04, l05, l06, l07],
  test,
};
