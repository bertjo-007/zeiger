import { md } from '../tags.ts';
import type { Kapitel } from '../types.ts';
import { lektion as l01 } from './l01-malloc.ts';
import { lektion as l02 } from './l02-realloc.ts';
import { lektion as l03 } from './l03-besitz.ts';
import { lektion as l04 } from './l04-lecks.ts';
import { lektion as l05 } from './l05-zeigerarrays.ts';
import { test } from './test.ts';

export const kapitel: Kapitel = {
  id: 'k10',
  nr: 10,
  titel: 'Speicherverwaltung',
  kurz: md`Speicher zur Laufzeit reservieren mit \`malloc\`, \`calloc\` und \`realloc\`, sauber freigeben, Lecks und doppeltes \`free\` vermeiden und mit Zeigern auf Zeiger dynamische Tabellen bauen.`,
  lektionen: [l01, l02, l03, l04, l05],
  test,
};
