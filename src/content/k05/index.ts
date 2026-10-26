import { md } from '../tags.ts';
import type { Kapitel } from '../types.ts';
import { lektion as l01 } from './l01-if.ts';
import { lektion as l02 } from './l02-else.ts';
import { lektion as l03 } from './l03-switch.ts';
import { lektion as l04 } from './l04-ternaer.ts';
import { lektion as l05 } from './l05-zustandsautomat.ts';
import { test } from './test.ts';

export const kapitel: Kapitel = {
  id: 'k05',
  nr: 5,
  titel: 'Bedingungen',
  kurz: md`Entscheidungen treffen mit \`if\`, \`else\` und \`switch\`, Werte mit \`?:\` auswählen und Steuerungen als Zustandsautomat aufbauen.`,
  lektionen: [l01, l02, l03, l04, l05],
  test,
};
