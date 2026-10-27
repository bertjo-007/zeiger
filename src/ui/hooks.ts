import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useMemo, useState } from 'react';
import { compiler, type CompilerStatus } from '../compiler/host.ts';
import { findeLernpfad, type Lernpfad } from '../content/lernpfade.ts';
import { db, type AufgabeStand, type LektionStand } from '../progress/db.ts';
import { useSettings } from './settings.ts';

/** Der in den Einstellungen gewählte Lernpfad, oder undefined, wenn keiner markiert wird. */
export function useLernpfad(): Lernpfad | undefined {
  return findeLernpfad(useSettings().lernpfad);
}

export function useCompilerStatus(): CompilerStatus {
  const [s, set] = useState(compiler.status);
  useEffect(() => {
    const unsubscribe = compiler.subscribe(set);
    return () => unsubscribe();
  }, []);
  return s;
}

export function useLektionStaende(): Map<string, LektionStand> {
  const list = useLiveQuery(() => db.lektionen.toArray(), []);
  return useMemo(() => new Map((list ?? []).map((l) => [l.id, l])), [list]);
}

export function useAufgabeStaende(): Map<string, AufgabeStand> {
  const list = useLiveQuery(() => db.aufgaben.toArray(), []);
  return useMemo(() => new Map((list ?? []).map((a) => [a.id, a])), [list]);
}

/** Stand einer Aufgabe: undefined = lädt noch, null = noch nie bearbeitet. */
export function useAufgabeStand(id: string): AufgabeStand | null | undefined {
  return useLiveQuery(() => db.aufgaben.get(id).then((s) => s ?? null), [id]);
}

export function useTests() {
  return useLiveQuery(() => db.tests.orderBy('zeit').toArray(), []) ?? [];
}

export function useEreignisse() {
  return useLiveQuery(() => db.ereignisse.toArray(), []) ?? [];
}

/** Anzahl fälliger Wiederholungskarten (aktualisiert sich jede Minute). */
export function useFaellig(): number {
  const [jetzt, setJetzt] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setJetzt(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  return useLiveQuery(() => db.karten.where('due').belowOrEqual(jetzt).count(), [jetzt]) ?? 0;
}

export function useZuletzt(): { lektion: string; zeit: number } | undefined {
  const e = useLiveQuery(() => db.einstellungen.get('zuletzt'), []);
  return e?.value as { lektion: string; zeit: number } | undefined;
}

/** Wert verzögert übernehmen (z. B. Code-Entwürfe speichern). */
export function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
