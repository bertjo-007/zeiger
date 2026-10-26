import { Plus, Trash } from '@phosphor-icons/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { Workbench } from '../../editor/Workbench.tsx';
import { db } from '../../progress/db.ts';
import { useDebounced } from '../hooks.ts';

const VORLAGE = `#include <stdio.h>

int main(void) {
    printf("Hallo, Spielwiese!\\n");
    return 0;
}
`;

/** Freier Editor für eigene Programme. Mehrere Programme, jedes mit eigenen Dateien. */
export function SpielwiesePage() {
  const programme = useLiveQuery(() => db.spielwiese.orderBy('geaendert').reverse().toArray(), []);
  const [aktiv, setAktiv] = useState<string | null>(null);
  const [dateien, setDateien] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (!programme) return;
    if (programme.length === 0) {
      const id = crypto.randomUUID();
      void db.spielwiese.put({ id, name: 'Mein erstes Programm', dateien: { 'main.c': VORLAGE }, geaendert: Date.now() });
      return;
    }
    if (!aktiv || !programme.some((p) => p.id === aktiv)) {
      setAktiv(programme[0].id);
      setDateien(programme[0].dateien);
    }
  }, [programme, aktiv]);

  const entwurf = useDebounced(dateien, 600);
  useEffect(() => {
    if (!aktiv || !entwurf) return;
    void db.spielwiese.update(aktiv, { dateien: entwurf, geaendert: Date.now() });
  }, [entwurf, aktiv]);

  const aktuelles = programme?.find((p) => p.id === aktiv);

  return (
    <div className="page">
      <header className="page-head">
        <h1>Spielwiese</h1>
        <p>Hier probierst du eigene Programme aus, ohne Aufgabe und ohne Tests. Alles wird automatisch gespeichert. Mit «Neue Datei» kannst du ein Programm auf mehrere Dateien verteilen.</p>
      </header>
      <div className="row" style={{ marginBottom: '1rem' }}>
        <select
          className="select"
          style={{ width: 'auto', minWidth: '14rem' }}
          value={aktiv ?? ''}
          aria-label="Programm wählen"
          onChange={(e) => {
            const p = programme?.find((x) => x.id === e.target.value);
            if (p) {
              setAktiv(p.id);
              setDateien(p.dateien);
            }
          }}
        >
          {programme?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn"
          onClick={() => {
            const name = window.prompt('Name des neuen Programms:', 'Neues Programm')?.trim();
            if (!name) return;
            const id = crypto.randomUUID();
            void db.spielwiese.put({ id, name, dateien: { 'main.c': VORLAGE }, geaendert: Date.now() }).then(() => {
              setAktiv(id);
              setDateien({ 'main.c': VORLAGE });
            });
          }}
        >
          <Plus size={16} /> Neues Programm
        </button>
        {aktuelles && (
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                const name = window.prompt('Neuer Name:', aktuelles.name)?.trim();
                if (name) void db.spielwiese.update(aktuelles.id, { name });
              }}
            >
              Umbenennen
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-danger"
              onClick={() => {
                if (!window.confirm(`«${aktuelles.name}» löschen?`)) return;
                void db.spielwiese.delete(aktuelles.id).then(() => {
                  setAktiv(null);
                  setDateien(null);
                });
              }}
            >
              <Trash size={16} /> Löschen
            </button>
          </>
        )}
      </div>
      {dateien && aktiv && <Workbench key={aktiv} files={dateien} initialFiles={{ 'main.c': VORLAGE }} onFilesChange={setDateien} wide manageFiles editorHeight="min(64vh, 42rem)" minLines={20} label="Spielwiese" />}
    </div>
  );
}
