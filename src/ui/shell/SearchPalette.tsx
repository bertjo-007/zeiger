import { BookOpen, Books, Folders, MagnifyingGlass } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { suche, type Treffer } from '../../search/index.ts';

const GRUPPEN: Record<Treffer['typ'], string> = { lektion: 'Lektionen', kapitel: 'Kapitel', referenz: 'Befehlsbibliothek' };
const ICONS = { lektion: BookOpen, kapitel: Folders, referenz: Books };

export function SearchPalette({ onClose }: { onClose(): void }) {
  const [q, setQ] = useState('');
  const [aktiv, setAktiv] = useState(0);
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const treffer = useMemo(() => suche(q, 24), [q]);
  // Reihenfolge der Anzeige: nach Gruppen, damit Pfeiltasten der Anzeige folgen.
  const sortiert = useMemo(() => (['referenz', 'lektion', 'kapitel'] as const).flatMap((g) => treffer.filter((t) => t.typ === g)), [treffer]);

  useEffect(() => {
    input.current?.focus();
  }, []);
  useEffect(() => {
    setAktiv(0);
  }, [q]);

  const oeffne = (t: Treffer) => {
    onClose();
    navigate(t.url);
  };

  return (
    <div className="palette-wrap" onMouseDown={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label="Suche">
      <div className="palette">
        <div className="palette-input">
          <MagnifyingGlass size={20} color="var(--text-3)" />
          <input
            ref={input}
            value={q}
            placeholder="Befehle, Begriffe, Themen … z. B. printf, %d, Zeiger, malloc"
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setAktiv((a) => Math.min(a + 1, sortiert.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setAktiv((a) => Math.max(a - 1, 0));
              } else if (e.key === 'Enter' && sortiert[aktiv]) oeffne(sortiert[aktiv]);
            }}
            aria-label="Suchbegriff"
            spellCheck={false}
          />
          <kbd>Esc</kbd>
        </div>
        <div className="palette-results">
          {q.trim() === '' && <div className="palette-group">Tippe einen Begriff. Pfeiltasten wählen, Enter öffnet.</div>}
          {q.trim() !== '' && sortiert.length === 0 && <div className="palette-group">Nichts gefunden. Versuche einen anderen Begriff.</div>}
          {(['referenz', 'lektion', 'kapitel'] as const).map((g) => {
            const liste = sortiert.filter((t) => t.typ === g);
            if (liste.length === 0) return null;
            const Icon = ICONS[g];
            return (
              <div key={g}>
                <div className="palette-group">{GRUPPEN[g]}</div>
                {liste.map((t) => {
                  const i = sortiert.indexOf(t);
                  return (
                    <button key={t.id} type="button" className={`palette-item${i === aktiv ? ' active' : ''}`} onMouseEnter={() => setAktiv(i)} onClick={() => oeffne(t)}>
                      <Icon size={18} />
                      <span style={{ minWidth: 0 }}>
                        <div className={`t${g === 'referenz' ? ' mono' : ''}`}>{t.titel}</div>
                        <div className="s">{t.unter}</div>
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
