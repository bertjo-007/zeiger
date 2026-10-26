import { md } from '../tags.ts';
import type { Kapitel } from '../types.ts';
import { lektion as l01 } from './l01-variablen.ts';
import { lektion as l02 } from './l02-ganzzahlen.ts';
import { lektion as l03 } from './l03-kommazahlen.ts';
import { lektion as l04 } from './l04-zeichen.ts';
import { lektion as l05 } from './l05-zahlensysteme.ts';
import { lektion as l06 } from './l06-konstanten.ts';
import { lektion as l07 } from './l07-platzhalter.ts';
import { lektion as l08 } from './l08-typumwandlung.ts';
import { test } from './test.ts';

export const kapitel: Kapitel = {
  id: 'k02',
  nr: 2,
  titel: 'Variablen und Datentypen',
  kurz: md`Werte speichern und verändern: ganze Zahlen, Kommazahlen und Zeichen, Bits und Hexadezimalzahlen, Konstanten, saubere Ausgabe mit Platzhaltern und die Umwandlung zwischen Typen.`,
  lektionen: [l01, l02, l03, l04, l05, l06, l07, l08],
  test,
};
