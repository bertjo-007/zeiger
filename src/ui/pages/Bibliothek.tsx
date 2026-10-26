import { ArrowLeft, ArrowSquareOut, BookOpen, MagnifyingGlass, Warning, X } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { findeLektion } from '../../content/kurs.ts';
import { REFERENZ } from '../../content/referenz/index.ts';
import { KATEGORIEN, type ReferenzEintrag, type ReferenzKategorie } from '../../content/types.ts';
import { CodeBeispiel } from '../CodeBeispiel.tsx';
import { CodeBlock, OutputBlock } from '../code/CodeBlock.tsx';
import { Inline, Markdown } from '../Markdown.tsx';
import { NotFound } from './NotFound.tsx';

const REIHENFOLGE: ReferenzKategorie[] = ['schluesselwort', 'datentyp', 'operator', 'funktion', 'praeprozessor', 'format', 'escape', 'konstrukt'];

function filtere(q: string, kat: ReferenzKategorie | 'alle' | 'ascii'): ReferenzEintrag[] {
  const s = q.trim().toLowerCase();
  return REFERENZ.filter((r) => (kat === 'alle' || r.kategorie === kat) && (!s || r.name.toLowerCase().includes(s) || r.kurz.toLowerCase().includes(s) || (r.stichwoerter ?? []).some((w) => w.toLowerCase().includes(s)) || (r.header ?? '').includes(s))).sort(
    (a, b) => REIHENFOLGE.indexOf(a.kategorie) - REIHENFOLGE.indexOf(b.kategorie) || a.name.localeCompare(b.name, 'de'),
  );
}

function KategorieChip({ r }: { r: ReferenzEintrag }) {
  return (
    <span className="row" style={{ gap: '0.35rem' }}>
      <span className="chip chip-accent">{KATEGORIEN[r.kategorie].titel}</span>
      {r.header && <span className="chip mono">&lt;{r.header}&gt;</span>}
    </span>
  );
}

function Liste({ eintraege, onOpen }: { eintraege: ReferenzEintrag[]; onOpen?(r: ReferenzEintrag): void }) {
  if (eintraege.length === 0) return <div className="empty">Kein Eintrag passt zur Suche.</div>;
  return (
    <div className="ref-list">
      {eintraege.map((r) =>
        onOpen ? (
          <button key={r.id} type="button" className="ref-item" style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit' }} onClick={() => onOpen(r)}>
            <span className="name">{r.name}</span>
            <KategorieChip r={r} />
            <span className="kurz">
              <Inline text={r.kurz} />
            </span>
          </button>
        ) : (
          <Link key={r.id} to={`/bibliothek/${r.id}`} className="ref-item">
            <span className="name">{r.name}</span>
            <KategorieChip r={r} />
            <span className="kurz">
              <Inline text={r.kurz} />
            </span>
          </Link>
        ),
      )}
    </div>
  );
}

export function Eintrag({ r, kompakt = false }: { r: ReferenzEintrag; kompakt?: boolean }) {
  const lektionen = r.lektionen.map((id) => findeLektion(id)).filter((x) => x !== undefined);
  return (
    <div className="ref-detail">
      <div className="stack" style={{ gap: '0.5rem' }}>
        <KategorieChip r={r} />
        <h1 className="mono" style={{ fontSize: kompakt ? '1.35rem' : undefined }}>
          {r.name}
        </h1>
        <Markdown text={r.kurz} />
        <p className="muted" style={{ fontSize: '0.86rem' }}>
          {KATEGORIEN[r.kategorie].text}
        </p>
      </div>
      {r.veraltet && (
        <div className="callout callout-veraltet">
          <Warning size={20} />
          <div className="callout-title">Veraltet oder unsicher</div>
          <div className="callout-body">
            <Markdown text={r.veraltet} />
          </div>
        </div>
      )}
      <div>
        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Syntax</h2>
        <CodeBlock code={r.syntax} copy={false} />
      </div>
      {r.beispiel && (
        <div>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Beispiel</h2>
          {kompakt ? <CodeBlock code={typeof r.beispiel.code === 'string' ? r.beispiel.code : Object.values(r.beispiel.code)[0]} numbered /> : <CodeBeispiel beispiel={r.beispiel} speicher={`ref:${r.id}`} titel={`Beispiel zu ${r.name}`} />}
          {r.beispiel.ausgabe !== undefined && (
            <div style={{ marginTop: '0.75rem' }}>
              <div className="field-label" style={{ marginBottom: '0.3rem' }}>
                Erwartete Ausgabe
              </div>
              <OutputBlock text={r.beispiel.ausgabe} stdin={r.beispiel.stdin} />
            </div>
          )}
        </div>
      )}
      {r.fehler && r.fehler.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Typische Fehler</h2>
          <ul className="prose" style={{ paddingLeft: '1.2rem', margin: 0 }}>
            {r.fehler.map((f, i) => (
              <li key={i}>
                <Inline text={f} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {lektionen.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Hier lernst du es</h2>
          <div className="row">
            {lektionen.map((l) => (
              <Link key={l.lektion.id} to={`/lektion/${l.lektion.id}`} className="btn btn-sm">
                <BookOpen size={15} /> {l.kapitel.nr}. {l.lektion.titel}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Ascii() {
  const zeichen = Array.from({ length: 95 }, (_, i) => i + 32);
  const steuer: [number, string, string][] = [
    [0, '\\0', 'Nullzeichen, Ende eines Strings'],
    [7, '\\a', 'Signalton'],
    [8, '\\b', 'Rückschritt'],
    [9, '\\t', 'Tabulator'],
    [10, '\\n', 'Zeilenumbruch'],
    [13, '\\r', 'Wagenrücklauf'],
    [27, '', 'Escape'],
  ];
  return (
    <div className="stack">
      <p className="muted" style={{ fontSize: '0.9rem' }}>
        Ein <code>char</code> ist in C eine kleine Zahl. Die ASCII-Tabelle legt fest, welches Zeichen zu welcher Zahl gehört: <code>'A'</code> ist 65, <code>'a'</code> ist 97, <code>'0'</code> ist 48.
        Darum ergibt <code>'7' - '0'</code> die Zahl 7.
      </p>
      <h3 style={{ fontSize: '0.95rem' }}>Steuerzeichen</h3>
      <div className="ascii-table">
        {steuer.map(([n, esc, text]) => (
          <div key={n} className="ascii-cell" title={text} style={{ gridColumn: 'span 2' }}>
            <span className="muted">{n}</span>
            <span className="ch">{esc || ' '}</span>
            <span className="muted" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem' }}>
              {text}
            </span>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: '0.95rem' }}>Druckbare Zeichen (32 bis 126)</h3>
      <div className="ascii-table">
        {zeichen.map((n) => (
          <div key={n} className="ascii-cell">
            <span className="muted">{n}</span>
            <span className="muted">0x{n.toString(16).toUpperCase()}</span>
            <span className="ch">{n === 32 ? '␠' : String.fromCharCode(n)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BibliothekPage() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const kat = (params.get('k') as ReferenzKategorie | 'alle' | 'ascii' | null) ?? 'alle';
  const eintraege = useMemo(() => (kat === 'ascii' ? [] : filtere(q, kat)), [q, kat]);
  const zaehler = useMemo(() => Object.fromEntries(REIHENFOLGE.map((k) => [k, REFERENZ.filter((r) => r.kategorie === k).length])), []);

  if (id) {
    const r = REFERENZ.find((x) => x.id === id);
    if (!r) return <NotFound />;
    return (
      <div className="page-narrow">
        <Link to="/bibliothek" className="row muted" style={{ textDecoration: 'none', fontSize: '0.88rem', marginBottom: '1rem' }}>
          <ArrowLeft size={14} /> Befehlsbibliothek
        </Link>
        <Eintrag r={r} />
      </div>
    );
  }

  const setze = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setParams(next, { replace: true });
  };

  return (
    <div className="page">
      <header className="page-head">
        <h1>Befehlsbibliothek</h1>
        <p>Schlüsselwörter, Operatoren, Datentypen, Funktionen der Standardbibliothek und Präprozessor-Anweisungen. Jeder Eintrag mit Syntax, ausführbarem Beispiel und typischen Fehlern.</p>
      </header>
      <div className="ref-layout">
        <nav className="ref-filter" aria-label="Kategorien">
          <button type="button" className={`nav-link${kat === 'alle' ? ' active' : ''}`} style={{ border: 0, background: kat === 'alle' ? undefined : 'transparent', cursor: 'pointer' }} onClick={() => setze({ k: '' })}>
            Alle <span className="muted" style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>{REFERENZ.length}</span>
          </button>
          {REIHENFOLGE.map((k) => (
            <button key={k} type="button" className={`nav-link${kat === k ? ' active' : ''}`} style={{ border: 0, background: kat === k ? undefined : 'transparent', cursor: 'pointer' }} onClick={() => setze({ k })}>
              {KATEGORIEN[k].titel}
              <span className="muted" style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>
                {zaehler[k]}
              </span>
            </button>
          ))}
          <button type="button" className={`nav-link${kat === 'ascii' ? ' active' : ''}`} style={{ border: 0, background: kat === 'ascii' ? undefined : 'transparent', cursor: 'pointer' }} onClick={() => setze({ k: 'ascii' })}>
            ASCII-Tabelle
          </button>
        </nav>
        <div className="stack">
          {kat !== 'ascii' && (
            <div className="field">
              <label htmlFor="ref-q" className="sr-only">
                In der Bibliothek suchen
              </label>
              <div className="row" style={{ flexWrap: 'nowrap' }}>
                <MagnifyingGlass size={18} color="var(--text-3)" />
                <input id="ref-q" className="input" placeholder="Filtern, z. B. scanf, strlen, %lf, ->" value={q} onChange={(e) => setze({ q: e.target.value })} spellCheck={false} />
              </div>
            </div>
          )}
          {kat === 'ascii' ? <Ascii /> : <Liste eintraege={eintraege} />}
        </div>
      </div>
    </div>
  );
}

/** Spickzettel: Bibliothek als Schublade, ohne die aktuelle Seite zu verlassen. */
export function BibliothekSchublade({ onClose }: { onClose(): void }) {
  const [q, setQ] = useState('');
  const [offen, setOffen] = useState<ReferenzEintrag | null>(null);
  const eintraege = useMemo(() => filtere(q, 'alle'), [q]);
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Spickzettel" onKeyDown={(e) => e.key === 'Escape' && onClose()}>
        <div className="drawer-head">
          {offen ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOffen(null)}>
              <ArrowLeft size={15} /> Übersicht
            </button>
          ) : (
            <strong>Spickzettel</strong>
          )}
          <span className="spacer" />
          {offen && (
            <Link to={`/bibliothek/${offen.id}`} className="btn btn-ghost btn-sm" onClick={onClose}>
              <ArrowSquareOut size={15} /> Ganze Seite
            </Link>
          )}
          <button type="button" className="btn btn-ghost btn-icon" aria-label="Schliessen" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {!offen && (
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
            <input className="input" autoFocus placeholder="Befehl suchen, z. B. printf" value={q} onChange={(e) => setQ(e.target.value)} spellCheck={false} aria-label="Spickzettel durchsuchen" />
          </div>
        )}
        <div className="drawer-body" style={offen ? { gridRow: '2 / 4' } : undefined}>
          {offen ? <Eintrag r={offen} kompakt /> : <Liste eintraege={eintraege} onOpen={setOffen} />}
        </div>
      </aside>
    </>
  );
}
