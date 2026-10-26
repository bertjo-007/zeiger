/**
 * Befehlsbibliothek: alle Einträge aus den Kategorie-Dateien.
 * Läuft auch in Node (Prüfskript).
 */
import type { ReferenzEintrag } from '../types.ts';
import { eintraege as datentypen } from './datentypen.ts';
import { eintraege as escape } from './escape.ts';
import { eintraege as format } from './format.ts';
import { eintraege as konstrukte } from './konstrukte.ts';
import { eintraege as kontrolle } from './kontrolle.ts';
import { eintraege as makros } from './makros.ts';
import { eintraege as mathe } from './mathe.ts';
import { eintraege as operatoren } from './operatoren.ts';
import { eintraege as praeprozessor } from './praeprozessor.ts';
import { eintraege as schluesselwoerter } from './schluesselwoerter.ts';
import { eintraege as weitereSchluesselwoerter } from './schluesselwoerter-weitere.ts';
import { eintraege as stdio } from './stdio.ts';
import { eintraege as stdlib } from './stdlib.ts';
import { eintraege as speicher } from './speicher.ts';
import { eintraege as strings } from './strings.ts';
import { eintraege as strukturen } from './strukturen.ts';
import { eintraege as zeiger } from './zeiger.ts';

export const REFERENZ: ReferenzEintrag[] = [
  ...schluesselwoerter,
  ...weitereSchluesselwoerter,
  ...kontrolle,
  ...datentypen,
  ...operatoren,
  ...stdio,
  ...stdlib,
  ...strings,
  ...zeiger,
  ...speicher,
  ...strukturen,
  ...mathe,
  ...makros,
  ...praeprozessor,
  ...format,
  ...escape,
  ...konstrukte,
];
