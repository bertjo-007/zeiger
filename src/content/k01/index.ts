import { md } from '../tags.ts';
import type { Kapitel } from '../types.ts';
import { lektion as l01 } from './l01-was-ist-c.ts';
import { test } from './test.ts';

export const kapitel: Kapitel = {
  id: 'k01',
  nr: 1,
  titel: 'Einstieg in C',
  kurz: md`Was C ist, wie ein Programm aufgebaut ist, wie du Text ausgibst und wie aus Quelltext ein lauffähiges Programm wird. Am Ende schreibst du dein erstes eigenes Programm.`,
  lektionen: [l01],
  test,
};
