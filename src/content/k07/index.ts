import { md } from '../tags.ts';
import type { Kapitel } from '../types.ts';
import { lektion as l01 } from './l01-funktionen.ts';
import { lektion as l02 } from './l02-parameter.ts';
import { lektion as l03 } from './l03-prototypen.ts';
import { lektion as l04 } from './l04-gueltigkeit.ts';
import { lektion as l05 } from './l05-wertuebergabe.ts';
import { lektion as l06 } from './l06-aufteilen.ts';
import { test } from './test.ts';

export const kapitel: Kapitel = {
  id: 'k07',
  nr: 7,
  titel: 'Funktionen',
  kurz: md`Eigene Funktionen schreiben, Werte hinein- und Ergebnisse herausgeben, Prototypen, lokale und globale Variablen, Wertübergabe und Programme sinnvoll aufteilen, inklusive \`main\` mit Argumenten.`,
  lektionen: [l01, l02, l03, l04, l05, l06],
  test,
};
