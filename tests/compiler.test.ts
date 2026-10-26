import { describe, expect, it } from 'vitest';
import { parseDiagnostics } from '../src/compiler/diagnostics.ts';
import { explain, RULE_COUNT } from '../src/compiler/diagnostics-de.ts';
import { classify, describeMemory } from '../src/compiler/runtime-errors.ts';
import { parseStack } from '../src/compiler/runner.ts';

const STDERR = `main.c:5:18: error: expected ';' after expression
    5 |     printf("x\\n")
      |                  ^
      |                  ;
main.c:3:9: warning: unused variable 'wert' [-Wunused-variable]
    3 |     int wert = 5;
      |         ^
main.c:7:5: error: use of undeclared identifier 'zaeler'
main.c:2:9: note: 'zaehler' declared here
1 warning and 2 errors generated.`;

describe('parseDiagnostics', () => {
  const diags = parseDiagnostics(STDERR);

  it('zerlegt Fehler und Warnungen mit Zeile und Spalte', () => {
    expect(diags).toHaveLength(3);
    expect(diags[0]).toMatchObject({ file: 'main.c', line: 5, column: 18, severity: 'error' });
    expect(diags[1]).toMatchObject({ line: 3, severity: 'warning', flag: '-Wunused-variable' });
  });

  it('hängt Notizen an die Meldung davor', () => {
    expect(diags[2].notes?.[0]?.message).toContain('zaehler');
  });
});

describe('deutsche Erklärungen', () => {
  it('kennt die häufigsten Meldungen', () => {
    expect(RULE_COUNT).toBeGreaterThanOrEqual(40);
    const [semikolon, unbenutzt, unbekannt] = parseDiagnostics(STDERR);
    for (const d of [semikolon, unbenutzt, unbekannt]) {
      const e = explain(d);
      expect(e, d.message).toBeDefined();
      expect(e!.titel.length).toBeGreaterThan(0);
    }
  });

  it('schlägt den fehlenden Header aus Clangs Notiz vor', () => {
    const [d] = parseDiagnostics(
      [
        "main.c:3:13: error: call to undeclared library function 'sqrt' with type 'double (double)'; ISO C99 and later do not support implicit function declarations [-Wimplicit-function-declaration]",
        "main.c:3:13: note: include the header <math.h> or explicitly provide a declaration for 'sqrt'",
      ].join('\n'),
    );
    expect(explain(d)?.tipp).toContain('#include <math.h>');
  });
});

describe('Laufzeitfehler', () => {
  it('ordnet Sanitizer-Gründe ein', () => {
    expect(classify('unreachable', 'Array index out of bounds', undefined)).toBe('bounds');
    expect(classify('unreachable', 'Null pointer dereference', undefined)).toBe('null');
    expect(classify('unreachable', 'Integer divide by zero', undefined)).toBe('divzero');
    expect(classify('unreachable', 'Signed integer overflow', undefined)).toBe('overflow');
  });

  it('erkennt Rekursion und Speicherzugriffe ohne Sanitizer-Grund', () => {
    expect(classify('Maximum call stack size exceeded', undefined, 'zaehle')).toBe('stack');
    expect(classify('memory access out of bounds', undefined, undefined)).toBe('memory');
    expect(classify('etwas anderes', undefined, undefined)).toBe('unknown');
  });

  it('findet Wasm-Offsets und wiederholte Rahmen im Stack', () => {
    const zeile = (name: string, off: string) => `    at programm.${name} (wasm://wasm/programm:wasm-function[7]:0x${off})`;
    const stack = ['RuntimeError: unreachable', ...Array.from({ length: 9 }, () => zeile('zaehle', '1a2b'))].join('\n');
    const { offsets, recursive } = parseStack(stack);
    expect(offsets[0]).toBe(0x1a2b);
    expect(recursive).toBe('zaehle');
  });

  it('beschreibt Speicherlecks mit Grösse', () => {
    expect(describeMemory({ kind: 'leak', nummer: 2, bytes: 16 }).titel).toContain('16 Byte');
  });
});
