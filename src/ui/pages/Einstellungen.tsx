import { DownloadSimple, HardDrives, Trash, UploadSimple } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { allesLoeschen, exportiere, importiere, istSicherung } from '../../progress/backup.ts';
import { useCompilerStatus } from '../hooks.ts';
import { updateSettings, useSettings, type Settings } from '../settings.ts';

function Segment<T extends string | number>({ value, options, onChange, label }: { value: T; options: { v: T; t: string }[]; onChange(v: T): void; label: string }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.v)} type="button" role="radio" aria-checked={value === o.v} className={value === o.v ? 'on' : ''} onClick={() => onChange(o.v)}>
          {o.t}
        </button>
      ))}
    </div>
  );
}

export function EinstellungenPage() {
  const s = useSettings();
  const compiler = useCompilerStatus();
  const [persistent, setPersistent] = useState<boolean | null>(null);
  const [platz, setPlatz] = useState<{ usage: number; quota: number } | null>(null);
  const [meldung, setMeldung] = useState<string | null>(null);
  const datei = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<Settings>) => void updateSettings(patch);

  useEffect(() => {
    void navigator.storage?.persisted?.().then(setPersistent);
    void navigator.storage?.estimate?.().then((e) => setPlatz({ usage: e.usage ?? 0, quota: e.quota ?? 0 }));
  }, []);

  useEffect(() => {
    if (window.location.hash === '#daten') document.getElementById('daten')?.scrollIntoView();
  }, []);

  return (
    <div className="page-narrow">
      <header className="page-head">
        <h1>Einstellungen</h1>
      </header>
      <div className="settings">
        <section className="setting">
          <h2 style={{ fontSize: '1rem' }}>Darstellung</h2>
          <div className="row">
            <span className="field-label" style={{ minWidth: '9rem' }}>
              Design
            </span>
            <Segment label="Design" value={s.theme} onChange={(theme) => set({ theme })} options={[{ v: 'system', t: 'Wie System' }, { v: 'light', t: 'Hell' }, { v: 'dark', t: 'Dunkel' }]} />
          </div>
          <div className="row">
            <span className="field-label" style={{ minWidth: '9rem' }}>
              Schrift im Editor
            </span>
            <Segment label="Schriftgrösse" value={s.editorSchrift} onChange={(editorSchrift) => set({ editorSchrift })} options={[13, 14, 15, 16, 18].map((v) => ({ v, t: `${v}` }))} />
          </div>
          <div className="row">
            <span className="field-label" style={{ minWidth: '9rem' }}>
              Lernpfad markieren
            </span>
            <Segment label="Lernpfad" value={s.lernpfad} onChange={(lernpfad) => set({ lernpfad })} options={[{ v: 'amitruck', t: 'Amitruck' }, { v: 'aus', t: 'Keiner' }]} />
          </div>
          <p className="muted" style={{ fontSize: '0.86rem' }}>
            Ein Lernpfad markiert die Lektionen, die ein Vorhaben braucht, und zeigt auf der Startseite den Fortschritt darin.
          </p>
        </section>

        <section className="setting">
          <h2 style={{ fontSize: '1rem' }}>Programme ausführen</h2>
          <div className="row">
            <span className="field-label" style={{ minWidth: '9rem' }}>
              Eingabe für scanf
            </span>
            <Segment label="Eingabe" value={s.eingabe} onChange={(eingabe) => set({ eingabe })} options={[{ v: 'interaktiv', t: 'Im Terminal tippen' }, { v: 'vorab', t: 'Vorab eingeben' }]} />
          </div>
          <div className="row">
            <span className="field-label" style={{ minWidth: '9rem' }}>
              Zeitlimit
            </span>
            <Segment label="Zeitlimit" value={s.zeitlimit} onChange={(zeitlimit) => set({ zeitlimit })} options={[2, 5, 10, 30].map((v) => ({ v, t: `${v} s` }))} />
          </div>
          <p className="muted" style={{ fontSize: '0.86rem' }}>
            Nach dieser Rechenzeit wird ein Programm abgebrochen, z. B. bei einer Endlosschleife. Die Zeit, in der es auf deine Eingabe wartet, zählt nicht.
          </p>
          <label className="row" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={s.vorladen} onChange={(e) => set({ vorladen: e.target.checked })} />
            Compiler gleich beim Öffnen laden (beim ersten Mal rund 30 MB, danach aus dem Speicher)
          </label>
          <p className="muted" style={{ fontSize: '0.86rem' }}>
            Compiler: Clang 22 als WebAssembly, Sprachstandard C17. Status: {compiler.state === 'ready' ? 'bereit' : compiler.state === 'loading' ? 'wird geladen' : compiler.state === 'error' ? 'Fehler' : 'noch nicht geladen'}.
          </p>
        </section>

        <section className="setting" id="daten">
          <h2 style={{ fontSize: '1rem' }}>Deine Daten</h2>
          <div className="notice">
            <HardDrives size={18} />
            <span>
              Dein Lernstand (Lektionen, Übungen, Code, Testergebnisse, Wiederholungsplan) liegt <strong>nur in diesem Browser</strong> auf diesem Gerät. Es gibt kein Konto und keinen Server; nichts
              wird übertragen. Ein anderer Browser oder ein anderes Gerät hat einen eigenen, leeren Stand. Mit der Sicherung nimmst du ihn mit.
            </span>
          </div>
          <p className="muted" style={{ fontSize: '0.86rem' }}>
            {persistent === true
              ? 'Der Browser hat zugesagt, die Daten nicht von sich aus zu löschen.'
              : 'Der Browser kann die Daten bei Platzmangel löschen. Mach ab und zu eine Sicherung.'}
            {platz && ` Belegt: ${Math.round(platz.usage / 1e6)} MB (inklusive Compiler).`}
          </p>
          {persistent === false && (
            <button type="button" className="btn btn-sm" style={{ justifySelf: 'start' }} onClick={() => void navigator.storage?.persist?.().then(setPersistent)}>
              Dauerhaft speichern anfragen
            </button>
          )}
          <div className="row">
            <button
              type="button"
              className="btn"
              onClick={async () => {
                const daten = await exportiere();
                const blob = new Blob([JSON.stringify(daten, null, 1)], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `zeiger-sicherung-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                setTimeout(() => URL.revokeObjectURL(a.href), 1000);
                setMeldung('Sicherung heruntergeladen.');
              }}
            >
              <DownloadSimple size={16} /> Sicherung herunterladen
            </button>
            <button type="button" className="btn" onClick={() => datei.current?.click()}>
              <UploadSimple size={16} /> Sicherung einlesen
            </button>
            <input
              ref={datei}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (!f) return;
                try {
                  const daten: unknown = JSON.parse(await f.text());
                  if (!istSicherung(daten)) throw new Error('Das ist keine Sicherung von Zeiger.');
                  if (!window.confirm('Der aktuelle Lernstand in diesem Browser wird durch die Sicherung ersetzt. Fortfahren?')) return;
                  await importiere(daten);
                  setMeldung(`Sicherung vom ${new Date(daten.exportiert).toLocaleString('de-CH')} eingelesen.`);
                } catch (err) {
                  setMeldung(err instanceof Error ? err.message : 'Die Datei konnte nicht gelesen werden.');
                }
              }}
            />
          </div>
          {meldung && <p style={{ fontSize: '0.9rem' }}>{meldung}</p>}
          <button
            type="button"
            className="btn btn-ghost btn-danger"
            style={{ justifySelf: 'start' }}
            onClick={() => {
              if (!window.confirm('Wirklich den gesamten Lernstand löschen? Das lässt sich nicht rückgängig machen.')) return;
              void allesLoeschen().then(() => setMeldung('Lernstand gelöscht.'));
            }}
          >
            <Trash size={16} /> Lernstand löschen
          </button>
        </section>

        <section className="setting">
          <h2 style={{ fontSize: '1rem' }}>Über Zeiger</h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-2)' }}>
            Die Gliederung orientiert sich am C-Tutorial von{' '}
            <a href="https://www.c-howto.de/tutorial/" target="_blank" rel="noreferrer">
              c-howto.de
            </a>
            . Erklärungen, Beispiele und Aufgaben sind eigenständig geschrieben. Alle Beispiele und Musterlösungen werden automatisch mit dem eingebauten Compiler geprüft.
          </p>
        </section>
      </div>
    </div>
  );
}
