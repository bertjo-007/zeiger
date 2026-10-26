/**
 * Befehlsbibliothek: alle Einträge aus den Kategorie-Dateien.
 * Läuft auch in Node (Prüfskript).
 */
import type { ReferenzEintrag } from '../types.ts';
import { eintraege as stdio } from './stdio.ts';
import { eintraege as praeprozessor } from './praeprozessor.ts';
import { eintraege as konstrukte } from './konstrukte.ts';

export const REFERENZ: ReferenzEintrag[] = [...stdio, ...praeprozessor, ...konstrukte];
