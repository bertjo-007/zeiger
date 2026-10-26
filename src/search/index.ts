/**
 * Volltextsuche über Lektionen, Kapitel und die Befehlsbibliothek.
 * Der Tokenizer behält C-Symbole wie %d, #include, ->, && als eigene Wörter,
 * damit man auch nach ihnen suchen kann.
 */
import MiniSearch from 'minisearch';
import { KAPITEL } from '../content/kurs.ts';
import { REFERENZ } from '../content/referenz/index.ts';
import { KATEGORIEN } from '../content/types.ts';

export interface Treffer {
  id: string;
  typ: 'lektion' | 'kapitel' | 'referenz';
  titel: string;
  unter: string;
  url: string;
}

interface Doc extends Treffer {
  stichwoerter: string;
  text: string;
}

const TOKEN = /[%#]?[\p{L}\p{N}_]+|[^\s\p{L}\p{N}_]+/gu;

const ohneMarkdown = (s: string) =>
  s
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/[*_>#|]/g, ' ')
    .replace(/`/g, '');

let index: MiniSearch<Doc> | null = null;

function baue(): MiniSearch<Doc> {
  const docs: Doc[] = [];
  for (const k of KAPITEL) {
    docs.push({ id: `k:${k.id}`, typ: 'kapitel', titel: `Kapitel ${k.nr}: ${k.titel}`, unter: ohneMarkdown(k.kurz), url: `/kapitel/${k.id}`, stichwoerter: '', text: ohneMarkdown(k.kurz) });
    for (const l of k.lektionen) {
      docs.push({
        id: `l:${l.id}`,
        typ: 'lektion',
        titel: l.titel,
        unter: `Kapitel ${k.nr}: ${k.titel}`,
        url: `/lektion/${l.id}`,
        stichwoerter: l.stichwoerter.join(' '),
        text: ohneMarkdown([...l.lernziele, l.erklaerung, ...l.zusammenfassung].join(' ')),
      });
    }
  }
  for (const r of REFERENZ) {
    docs.push({
      id: `r:${r.id}`,
      typ: 'referenz',
      titel: r.name,
      unter: `${KATEGORIEN[r.kategorie].titel}${r.header ? ` aus <${r.header}>` : ''}: ${ohneMarkdown(r.kurz)}`,
      url: `/bibliothek/${r.id}`,
      stichwoerter: (r.stichwoerter ?? []).join(' ') + ' ' + r.name,
      text: ohneMarkdown(r.kurz),
    });
  }
  const ms = new MiniSearch<Doc>({
    fields: ['titel', 'stichwoerter', 'text'],
    storeFields: ['typ', 'titel', 'unter', 'url'],
    tokenize: (text) => text.match(TOKEN) ?? [],
    searchOptions: {
      boost: { titel: 4, stichwoerter: 3, text: 1 },
      prefix: true,
      fuzzy: (term) => (term.length > 4 ? 0.2 : false),
      combineWith: 'AND',
    },
  });
  ms.addAll(docs);
  return ms;
}

export function suche(query: string, limit = 20): Treffer[] {
  const q = query.trim();
  if (!q) return [];
  index ??= baue();
  let results = index.search(q);
  if (results.length === 0) results = index.search(q, { combineWith: 'OR' });
  return results.slice(0, limit).map((r) => ({ id: r.id as string, typ: r.typ as Treffer['typ'], titel: r.titel as string, unter: r.unter as string, url: r.url as string }));
}
