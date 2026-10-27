import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import { db } from '../progress/db.ts';

export interface Settings {
  theme: 'system' | 'light' | 'dark';
  /** Schriftgrösse im Editor in px. */
  editorSchrift: number;
  /** Zeitlimit für Programme in Sekunden (reine Rechenzeit). */
  zeitlimit: number;
  /** Eingabe für scanf: direkt im Terminal oder vorab als Text. */
  eingabe: 'interaktiv' | 'vorab';
  /** Compiler gleich beim Öffnen der App laden (rund 30 MB beim ersten Mal). */
  vorladen: boolean;
  /** Lernpfad, dessen Lektionen markiert werden. */
  lernpfad: 'amitruck' | 'aus';
}

export const DEFAULT_SETTINGS: Settings = { theme: 'system', editorSchrift: 14, zeitlimit: 5, eingabe: 'interaktiv', vorladen: true, lernpfad: 'amitruck' };

const KEY = 'settings';

export function useSettings(): Settings {
  const stored = useLiveQuery(() => db.einstellungen.get(KEY), []);
  return { ...DEFAULT_SETTINGS, ...((stored?.value as Partial<Settings>) ?? {}) };
}

export async function updateSettings(patch: Partial<Settings>) {
  await db.transaction('rw', db.einstellungen, async () => {
    const stored = await db.einstellungen.get(KEY);
    await db.einstellungen.put({ key: KEY, value: { ...DEFAULT_SETTINGS, ...((stored?.value as Partial<Settings>) ?? {}), ...patch } });
  });
  if (patch.theme) {
    try {
      localStorage.setItem('zeiger.theme', patch.theme);
    } catch {
      // Private Fenster: dann gilt die Einstellung erst nach dem Laden der Datenbank.
    }
  }
}

function resolveTheme(theme: Settings['theme']): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Setzt data-theme und die Editor-Schrift auf dem Wurzelelement. */
export function useApplySettings(s: Settings) {
  useEffect(() => {
    const apply = () => document.documentElement.setAttribute('data-theme', resolveTheme(s.theme));
    apply();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [s.theme]);
  useEffect(() => {
    document.documentElement.style.setProperty('--editor-font', `${s.editorSchrift}px`);
  }, [s.editorSchrift]);
}
