import { ArrowSquareOut, CheckCircle, FileText, Info, Prohibit, Terminal as TerminalIcon, Warning, WarningCircle, XCircle } from '@phosphor-icons/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { explain } from '../compiler/diagnostics-de.ts';
import type { CompilerStatus } from '../compiler/host.ts';
import { describeMemory, describeTrap } from '../compiler/runtime-errors.ts';
import type { Diagnostic, RunResult } from '../compiler/types.ts';
import { Inline } from '../ui/Markdown.tsx';
import type { RunState } from './useRunner.ts';

export type OutTab = 'terminal' | 'probleme' | 'dateien' | 'befehl' | 'praeprozessor';

const fmtMB = (bytes: number) => `${Math.round(bytes / 1e6)} MB`;

export function CompilerLoading({ status }: { status: CompilerStatus }) {
  if (status.state === 'error') {
    return (
      <div className="run-summary err">
        <XCircle size={20} weight="fill" />
        <div>
          <div className="title">Der Compiler konnte nicht geladen werden</div>
          <div className="body">{status.message} Prüfe die Internetverbindung und lade die Seite neu. Nach dem ersten erfolgreichen Laden funktioniert er auch offline.</div>
        </div>
      </div>
    );
  }
  const pct = status.total > 0 ? Math.round((status.done / status.total) * 100) : 0;
  return (
    <div className="compiler-loading">
      <div>
        Compiler wird geladen{status.total > 0 ? `: ${pct} % von ${fmtMB(status.total)}` : ' …'}
      </div>
      <div className="bar">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="muted">Nur beim ersten Mal. Danach liegt der Compiler im Browser-Speicher und startet in einer Sekunde, auch offline.</div>
    </div>
  );
}

function Summary({ kind, icon, title, children }: { kind: 'ok' | 'err' | 'warn' | 'info'; icon: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <div className={`run-summary ${kind}`}>
      {icon}
      <div>
        <div className="title">{title}</div>
        {children && <div className="body">{children}</div>}
      </div>
    </div>
  );
}

function RunSummary({ result, warnings, onJump, onShowProblems, timeLimit }: { result: RunResult; warnings: number; onJump(line: number, file?: string): void; onShowProblems(): void; timeLimit: number }) {
  const parts: ReactNode[] = [];
  const ms = result.ms < 1 ? '< 1 ms' : `${Math.round(result.ms)} ms`;
  switch (result.end) {
    case 'exit':
      parts.push(
        result.exitCode === 0 ? (
          <Summary key="end" kind="ok" icon={<CheckCircle size={20} weight="fill" />} title={`Programm beendet, Rückgabewert 0 (${ms})`} />
        ) : (
          <Summary key="end" kind="warn" icon={<WarningCircle size={20} weight="fill" />} title={`Programm beendet mit Rückgabewert ${result.exitCode}`}>
            Ein Wert ungleich 0 meldet nach Konvention einen Fehler an das aufrufende Programm.
          </Summary>
        ),
      );
      break;
    case 'trap': {
      const t = describeTrap(result.trap!, result.stderr);
      const frame = result.trap?.frames?.[0];
      parts.push(
        <Summary key="end" kind="err" icon={<XCircle size={20} weight="fill" />} title={<Inline text={t.titel} />}>
          <Inline text={t.text} />
          {t.tipp && (
            <>
              {' '}
              <Inline text={t.tipp} />
            </>
          )}
          {frame?.line && (
            <div style={{ marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-sm" onClick={() => onJump(frame.line!, frame.file)}>
                Zu Zeile {frame.line} springen
              </button>
              {result.trap!.frames!.length > 1 && (
                <span className="muted" style={{ marginLeft: '0.6rem', fontSize: '0.82rem' }}>
                  Aufrufkette: {result.trap!.frames!.slice(0, 4).map((f) => `${f.function}${f.line ? ':' + f.line : ''}`).join(' ← ')}
                </span>
              )}
            </div>
          )}
        </Summary>,
      );
      break;
    }
    case 'timeout':
      parts.push(
        <Summary key="end" kind="err" icon={<Prohibit size={20} weight="fill" />} title={`Nach ${timeLimit} s abgebrochen`}>
          Das Programm hat zu lange gerechnet. Meistens ist das eine Endlosschleife: Prüfe, ob sich die Schleifenbedingung irgendwann ändert.
        </Summary>,
      );
      break;
    case 'output-limit':
      parts.push(
        <Summary key="end" kind="warn" icon={<WarningCircle size={20} weight="fill" />} title="Zu viel Ausgabe, Programm abgebrochen">
          Mehr als 256 KB Text. Vermutlich gibt eine Endlosschleife immer wieder etwas aus.
        </Summary>,
      );
      break;
    case 'stopped':
      parts.push(<Summary key="end" kind="info" icon={<Info size={20} weight="fill" />} title="Programm gestoppt" />);
      break;
    case 'crash':
      break;
  }
  for (const [i, m] of result.memory.entries()) {
    const t = describeMemory(m);
    const fatal = m.kind === 'double-free' || m.kind === 'invalid-free' || m.kind === 'fclose-null';
    parts.push(
      <Summary key={`m${i}`} kind={fatal ? 'err' : 'warn'} icon={fatal ? <XCircle size={20} weight="fill" /> : <Warning size={20} weight="fill" />} title={<Inline text={t.titel} />}>
        <Inline text={t.text} />
        {t.tipp && (
          <>
            {' '}
            <Inline text={t.tipp} />
          </>
        )}
      </Summary>,
    );
  }
  if (warnings > 0) {
    parts.push(
      <Summary key="w" kind="warn" icon={<Warning size={20} weight="fill" />} title={`Der Compiler hat ${warnings} Warnung${warnings > 1 ? 'en' : ''} gemeldet`}>
        Warnungen deuten oft auf echte Fehler hin.{' '}
        <button type="button" className="btn btn-sm" onClick={onShowProblems}>
          Ansehen
        </button>
      </Summary>,
    );
  }
  return <>{parts}</>;
}

function Terminal({ state, onSend, onEof, compilerStatus, onJump, onShowProblems, timeLimit, idleHint }: {
  state: RunState;
  onSend(text: string): void;
  onEof(): void;
  compilerStatus: CompilerStatus;
  onJump(line: number, file?: string): void;
  onShowProblems(): void;
  timeLimit: number;
  idleHint?: ReactNode;
}) {
  const [line, setLine] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.waiting) input.current?.focus({ preventScroll: true });
  }, [state.waiting]);
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' });
  }, [state.transcript, state.waiting]);

  const warnings = state.compile?.diagnostics.filter((d) => d.severity === 'warning').length ?? 0;
  const errors = state.compile?.diagnostics.filter((d) => d.severity === 'error').length ?? 0;
  const loading = state.phase === 'compiling' && compilerStatus.state !== 'ready';

  return (
    <div className="terminal" aria-live="polite">
      {state.phase === 'idle' && (compilerStatus.state === 'loading' || compilerStatus.state === 'error' ? <CompilerLoading status={compilerStatus} /> : <div className="placeholder">{idleHint ?? <>Drücke «Ausführen» oder <kbd>Strg</kbd>+<kbd>Enter</kbd>. Die Ausgabe deines Programms erscheint hier.</>}</div>)}
      {loading && <CompilerLoading status={compilerStatus} />}
      {state.phase === 'compiling' && !loading && <div className="placeholder">Wird kompiliert …</div>}
      {state.error && (
        <Summary kind="err" icon={<XCircle size={20} weight="fill" />} title="Interner Fehler">
          {state.error}
        </Summary>
      )}
      {state.phase === 'done' && errors > 0 && (
        <Summary kind="err" icon={<XCircle size={20} weight="fill" />} title={`Nicht kompiliert: ${errors} Fehler`}>
          Das Programm wurde nicht gestartet.{' '}
          <button type="button" className="btn btn-sm" onClick={onShowProblems}>
            Fehler ansehen
          </button>
        </Summary>
      )}
      {state.transcript.map((s, i) =>
        s.stream === 'stdin' ? (
          <span key={i} className="stdin-echo">
            {s.text}
          </span>
        ) : s.stream === 'stderr' ? (
          <span key={i} className="err-text">
            {s.text}
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
      {state.phase === 'running' && state.waiting && (
        <form
          className="term-input"
          onSubmit={(e) => {
            e.preventDefault();
            onSend(line);
            setLine('');
          }}
        >
          <input
            ref={input}
            value={line}
            onChange={(e) => setLine(e.target.value)}
            aria-label="Eingabe für das Programm"
            autoComplete="off"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === 'd' && e.ctrlKey) {
                e.preventDefault();
                onEof();
              }
            }}
          />
          <button type="submit" className="btn btn-sm btn-primary">
            Senden
          </button>
          <button type="button" className="btn btn-sm" onClick={onEof} title="Ende der Eingabe (Strg+D)">
            Eingabe beenden
          </button>
        </form>
      )}
      {state.phase === 'running' && !state.waiting && state.transcript.length === 0 && <div className="placeholder">Läuft …</div>}
      {state.phase === 'done' && state.result && (
        <RunSummary result={state.result} warnings={warnings} onJump={onJump} onShowProblems={onShowProblems} timeLimit={timeLimit} />
      )}
      <div ref={end} />
    </div>
  );
}

export function Problems({ diagnostics, onJump }: { diagnostics: Diagnostic[]; onJump(line: number, file: string, column: number): void }) {
  if (diagnostics.length === 0) {
    return (
      <div className="diag-list">
        <div className="placeholder muted">Keine Meldungen des Compilers.</div>
      </div>
    );
  }
  return (
    <div className="diag-list">
      {diagnostics.map((d, i) => {
        const e = explain(d);
        return (
          <div key={i} className={`diag ${d.severity}`}>
            <div className="diag-head">
              {d.severity === 'error' ? <XCircle size={16} weight="fill" color="var(--err)" /> : <Warning size={16} weight="fill" color="var(--warn)" />}
              <span className="diag-title">{e ? e.titel : d.severity === 'error' ? 'Fehler' : 'Warnung'}</span>
              {d.line > 0 && (
                <button type="button" onClick={() => onJump(d.line, d.file, d.column)}>
                  {d.file}:{d.line}:{d.column}
                </button>
              )}
              {d.linker && <span className="chip">Linker</span>}
            </div>
            {e && (
              <div className="diag-text">
                <Inline text={e.text} />
                {e.tipp && (
                  <>
                    {' '}
                    <Inline text={e.tipp} />
                  </>
                )}
              </div>
            )}
            <pre className="diag-raw">{[d.raw, ...(d.notes ?? []).map((n) => n.raw)].join('\n')}</pre>
          </div>
        );
      })}
    </div>
  );
}

export function FilesView({ files, editable, onChange, changed }: { files: Record<string, string>; editable: boolean; onChange(name: string, text: string): void; changed: Set<string> }) {
  const names = Object.keys(files).sort();
  if (names.length === 0) {
    return (
      <div className="files-view">
        <div className="placeholder muted">Noch keine Dateien. Wenn dein Programm mit fopen eine Datei anlegt, erscheint sie hier.</div>
      </div>
    );
  }
  return (
    <div className="files-view">
      <p className="muted" style={{ fontSize: '0.85rem' }}>
        Das ist der Arbeitsordner deines Programms. Er liegt nur im Browser; ein Programm kann hier Dateien lesen und schreiben.
      </p>
      {names.map((name) => (
        <div key={name} className="file-card">
          <div className="file-card-head">
            <FileText size={15} />
            {name}
            {changed.has(name) && <span className="chip chip-accent">vom Programm geändert</span>}
          </div>
          <textarea value={files[name]} readOnly={!editable} spellCheck={false} onChange={(e) => onChange(name, e.target.value)} aria-label={`Inhalt von ${name}`} />
        </div>
      ))}
    </div>
  );
}

export function CommandView({ command }: { command: string }) {
  return (
    <div className="cmd-view">
      <div className="cmd-line">$ {command}</div>
      <div className="cmd-line">$ ./programm</div>
      <dl className="line-notes">
        <div className="line-note">
          <dt>clang</dt>
          <dd>Der Compiler. Er übersetzt den C-Code in ein ausführbares Programm. Auf deinem PC funktioniert gcc mit denselben Optionen.</dd>
        </div>
        <div className="line-note">
          <dt>-std=c17</dt>
          <dd>Verwende den Sprachstandard C17.</dd>
        </div>
        <div className="line-note">
          <dt>-Wall -Wextra</dt>
          <dd>Viele Warnungen einschalten. Sie finden Fehler, die zwar kompilieren, aber falsch laufen.</dd>
        </div>
        <div className="line-note">
          <dt>-pedantic</dt>
          <dd>Warnt bei allem, was nicht zum Standard gehört.</dd>
        </div>
        <div className="line-note">
          <dt>-g</dt>
          <dd>Debug-Informationen einbauen. Damit kann Zeiger bei einem Absturz die Zeile nennen.</dd>
        </div>
        <div className="line-note">
          <dt>-o programm</dt>
          <dd>Name der fertigen Programmdatei.</dd>
        </div>
      </dl>
      <p className="muted" style={{ fontSize: '0.85rem' }}>
        <ArrowSquareOut size={14} style={{ verticalAlign: '-2px' }} /> In dieser Lernumgebung entsteht WebAssembly statt einer .exe-Datei, und zusätzliche Prüfungen erkennen Arraygrenzen, NULL-Zeiger,
        Überläufe und Speicherlecks. Zeiger und long sind hier 32 Bit gross; auf einem 64-Bit-PC ist ein Zeiger 8 Byte gross.
      </p>
    </div>
  );
}

export function PreprocessView({ data }: { data: NonNullable<RunState['preprocessed']> }) {
  return (
    <div className="cmd-view">
      <div className="cmd-line">$ clang -E -P {data.file}</div>
      <p className="muted" style={{ fontSize: '0.85rem' }}>
        So sieht der Code aus, nachdem der Präprozessor alle #include eingefügt und alle Makros ersetzt hat. Erst dieser Text geht an den eigentlichen Compiler. Die eingefügten Header sind oft
        sehr lang; dein eigener Code steht am Ende.
      </p>
      {!data.ok && <pre className="diag-raw">{data.stderr}</pre>}
      <pre className="output-block" style={{ maxHeight: '24rem', overflow: 'auto' }}>
        {data.text}
      </pre>
    </div>
  );
}

export function OutputTabs({ tab, setTab, problems, warnings, showFiles, filesChanged, showPre }: { tab: OutTab; setTab(t: OutTab): void; problems: number; warnings: number; showFiles: boolean; filesChanged: boolean; showPre: boolean }) {
  return (
    <div className="outtabs" role="tablist">
      <button type="button" role="tab" aria-selected={tab === 'terminal'} className={`outtab${tab === 'terminal' ? ' active' : ''}`} onClick={() => setTab('terminal')}>
        <TerminalIcon size={15} /> Terminal
      </button>
      <button type="button" role="tab" aria-selected={tab === 'probleme'} className={`outtab${tab === 'probleme' ? ' active' : ''}`} onClick={() => setTab('probleme')}>
        Probleme
        {problems > 0 && <span className="n">{problems}</span>}
        {problems === 0 && warnings > 0 && <span className="n warn">{warnings}</span>}
      </button>
      {showFiles && (
        <button type="button" role="tab" aria-selected={tab === 'dateien'} className={`outtab${tab === 'dateien' ? ' active' : ''}`} onClick={() => setTab('dateien')}>
          Dateien
          {filesChanged && <span className="n warn">neu</span>}
        </button>
      )}
      <button type="button" role="tab" aria-selected={tab === 'befehl'} className={`outtab${tab === 'befehl' ? ' active' : ''}`} onClick={() => setTab('befehl')}>
        Befehl
      </button>
      {showPre && (
        <button type="button" role="tab" aria-selected={tab === 'praeprozessor'} className={`outtab${tab === 'praeprozessor' ? ' active' : ''}`} onClick={() => setTab('praeprozessor')}>
          Präprozessor
        </button>
      )}
    </div>
  );
}

export { Terminal };
