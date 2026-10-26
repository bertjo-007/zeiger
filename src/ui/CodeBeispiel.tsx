import { useEffect, useMemo, useState } from 'react';
import type { Beispiel } from '../content/types.ts';
import { Workbench } from '../editor/Workbench.tsx';
import { dateienAus } from '../exercises/checker.ts';
import { speichereEntwurf } from '../progress/actions.ts';
import { CodeBlock } from './code/CodeBlock.tsx';
import { useAufgabeStand, useDebounced } from './hooks.ts';

/**
 * Ausführbares Beispiel. Änderungen werden gespeichert (unter `speicher`),
 * «Zurücksetzen» stellt das Original wieder her.
 */
export function CodeBeispiel({ beispiel, speicher, titel }: { beispiel: Beispiel; speicher: string; titel?: string }) {
  const original = useMemo(() => dateienAus(beispiel.code), [beispiel]);
  const stand = useAufgabeStand(speicher);
  const [dateien, setDateien] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (dateien === null && stand !== undefined) setDateien(stand?.code ?? original);
  }, [stand, dateien, original]);

  const entwurf = useDebounced(dateien, 600);
  useEffect(() => {
    if (entwurf && (stand?.code || JSON.stringify(entwurf) !== JSON.stringify(original))) void speichereEntwurf(speicher, entwurf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entwurf]);

  if (beispiel.ausschnitt) {
    const name = Object.keys(original)[0];
    return <CodeBlock code={original[name]} title={titel ?? 'Ausschnitt (nicht einzeln lauffähig)'} numbered />;
  }
  if (!dateien) return <CodeBlock code={Object.values(original)[0]} numbered />;
  return (
    <Workbench
      files={dateien}
      initialFiles={original}
      onFilesChange={setDateien}
      stdin={beispiel.stdin}
      args={beispiel.args}
      dataFiles={beispiel.dateien}
      label={titel}
      idleHint={
        <>
          Drücke «Ausführen» oder <kbd>Strg</kbd>+<kbd>Enter</kbd>. Du darfst den Code verändern und ausprobieren; «Zurücksetzen» holt das Original zurück.
          {beispiel.stdin ? ' Das Programm erwartet eine Eingabe: Tippe sie im Terminal, wenn es danach fragt.' : ''}
        </>
      }
    />
  );
}
