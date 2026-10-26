import { md } from '../tags.ts';
import type { Kapitel } from '../types.ts';
import { lektion as l01 } from './l01-scanf.ts';
import { lektion as l02 } from './l02-puffer.ts';
import { lektion as l03 } from './l03-pruefen.ts';
import { lektion as l04 } from './l04-fgets.ts';
import { test } from './test.ts';

export const kapitel: Kapitel = {
  id: 'k03',
  nr: 3,
  titel: 'Benutzereingaben',
  kurz: md`Werte von der Tastatur einlesen, die Tücken des Eingabepuffers verstehen, Eingaben prüfen und robust mit \`fgets\` und \`strtol\` arbeiten.`,
  lektionen: [l01, l02, l03, l04],
  test,
};
