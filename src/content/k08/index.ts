import { md } from '../tags.ts';
import type { Kapitel } from '../types.ts';
import { lektion as l01 } from './l01-arrays.ts';
import { lektion as l02 } from './l02-durchlaufen.ts';
import { lektion as l03 } from './l03-mehrdimensional.ts';
import { lektion as l04 } from './l04-grenzen.ts';
import { lektion as l05 } from './l05-strings.ts';
import { lektion as l06 } from './l06-stringh.ts';
import { lektion as l07 } from './l07-suchen.ts';
import { test } from './test.ts';

export const kapitel: Kapitel = {
  id: 'k08',
  nr: 8,
  titel: 'Arrays und Zeichenketten',
  kurz: md`Viele Werte in Arrays speichern, Tabellen mit mehrdimensionalen Arrays, sichere Grenzen und Text als \`char\`-Array mit den Funktionen aus \`<string.h>\` und \`<ctype.h>\`.`,
  lektionen: [l01, l02, l03, l04, l05, l06, l07],
  test,
};
