import { md } from '../tags.ts';
import type { Kapitel } from '../types.ts';
import { lektion as l01 } from './l01-adressen.ts';
import { lektion as l02 } from './l02-zeiger.ts';
import { lektion as l03 } from './l03-parameter.ts';
import { lektion as l04 } from './l04-arithmetik.ts';
import { lektion as l05 } from './l05-funktionszeiger.ts';
import { lektion as l06 } from './l06-zeigerfehler.ts';
import { test } from './test.ts';

export const kapitel: Kapitel = {
  id: 'k09',
  nr: 9,
  titel: 'Pointer',
  kurz: md`Adressen und Zeiger: mit \`&\` und \`*\` arbeiten, Variablen über Funktionsparameter ändern, mit Zeigern durch Arrays laufen, Funktionen übergeben und die typischen Zeigerfehler vermeiden.`,
  lektionen: [l01, l02, l03, l04, l05, l06],
  test,
};
