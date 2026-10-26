/**
 * Werkbank: Editor, Werkzeugleiste und Ausgabe in einem. Wird für Beispiele,
 * Übungen, die Spielwiese und die Bibliothek verwendet.
 */
import { ArrowCounterClockwise, Copy, FileC, FilePlus, Gear, Hash, Play, Stop, Trash } from '@phosphor-icons/react';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { compiler } from '../compiler/host.ts';
import { displayCommand } from '../compiler/befehl.ts';
import type { CompileResult, Diagnostic, RunResult, SourceFiles } from '../compiler/types.ts';
import { dateiText } from '../exercises/checker.ts';
import { useSettings } from '../ui/settings.ts';
import { useCompilerStatus } from '../ui/hooks.ts';
import { CodeEditor, type EditorHandle } from './CodeEditor.tsx';
import { CommandView, FilesView, OutputTabs, PreprocessView, Problems, Terminal, type OutTab } from './OutputPanel.tsx';
import { useRunner } from './useRunner.ts';

export interface WorkbenchProps {
  /** Aktueller Code (Dateiname → Inhalt). */
  files: Record<string, string>;
  /** Ausgangszustand für «Zurücksetzen». */
  initialFiles: Record<string, string>;
  onFilesChange(files: Record<string, string>): void;
  /** Vorgeschlagene Eingabe (wird bei «Eingabe vorab» eingetragen). */
  stdin?: string;
  args?: string[];
  /** Arbeitsordner vor dem Lauf. */
  dataFiles?: Record<string, string>;
  onDataFilesChange?(files: Record<string, string>): void;
  /** Editor links, Ausgabe rechts (auf breiten Bildschirmen). */
  wide?: boolean;
  editorHeight?: 'auto' | string;
  minLines?: number;
  /** Dateien dürfen hinzugefügt und gelöscht werden (Spielwiese). */
  manageFiles?: boolean;
  readOnly?: boolean;
  /** Zusätzliche Knöpfe in der Werkzeugleiste (z. B. «Prüfen»). */
  actions?: ReactNode;
  /** Wird nach jedem Lauf aufgerufen. */
  onRun?(compile: CompileResult, result?: RunResult): void;
  idleHint?: ReactNode;
  /** Zusätzliche Compiler-Optionen (Test-Harness) für «Ausführen». */
  extraFlags?: string[];
  hiddenFiles?: SourceFiles;
  label?: string;
  /** Meldungen von aussen (z. B. aus «Prüfen»), mit Zeitstempel; die neueren gewinnen. */
  externeMeldungen?: { zeit: number; diagnostics: Diagnostic[] };
}

const bytesToText = (files: Record<string, Uint8Array>) => {
  const out: Record<string, string> = {};
  for (const [name, bytes] of Object.entries(files)) out[name] = dateiText(bytes) ?? '';
  return out;
};

export function Workbench(props: WorkbenchProps) {
  const { files, initialFiles, onFilesChange, wide = false, manageFiles = false, readOnly = false } = props;
  const settings = useSettings();
  const compilerStatus = useCompilerStatus();
  const { state, run, stop, sendLine, sendEof, preprocess, reset } = useRunner();
  const names = Object.keys(files);
  const [active, setActive] = useState(names[0] ?? 'main.c');
  const [tab, setTab] = useState<OutTab>('terminal');
  const [showSettings, setShowSettings] = useState(false);
  const [stdinMode, setStdinMode] = useState<'interaktiv' | 'vorab'>(props.stdin && settings.eingabe === 'vorab' ? 'vorab' : settings.eingabe);
  const [stdinText, setStdinText] = useState(props.stdin ?? '');
  const [argsText, setArgsText] = useState((props.args ?? []).join(' '));
  const [data, setData] = useState<Record<string, string>>(props.dataFiles ?? {});
  const [changed, setChanged] = useState<Set<string>>(new Set());
  const editor = useRef<EditorHandle>(null);
  const isolated = typeof SharedArrayBuffer !== 'undefined' && globalThis.crossOriginIsolated === true;

  useEffect(() => {
    void compiler.warmup().catch(() => {});
  }, []);

  useEffect(() => {
    if (!(active in files) && names.length > 0) setActive(names[0]);
  }, [active, files, names]);

  // Vorgegebene Eingabe: Ohne SharedArrayBuffer geht nur «vorab».
  useEffect(() => {
    if (!isolated) setStdinMode('vorab');
  }, [isolated]);

  const [letzterLauf, setLetzterLauf] = useState(0);
  const extern = props.externeMeldungen;
  const diagnostics = extern && extern.zeit > letzterLauf ? extern.diagnostics : (state.compile?.diagnostics ?? []);
  const errors = diagnostics.filter((d) => d.severity === 'error').length;
  const warnings = diagnostics.filter((d) => d.severity === 'warning').length;
  const showFiles = Object.keys(data).length > 0 || props.dataFiles !== undefined || (state.result && Object.keys(state.result.files).length > 0) === true;

  const doRun = useCallback(async () => {
    setTab('terminal');
    setChanged(new Set());
    setLetzterLauf(Date.now());
    const before = data;
    const out = await run(files, {
      stdinMode,
      stdinText,
      args: argsText.trim() ? argsText.trim().split(/\s+/) : [],
      dataFiles: data,
      timeLimitMs: settings.zeitlimit * 1000,
      extraFlags: props.extraFlags,
      hiddenFiles: props.hiddenFiles,
    });
    if (!out) return;
    if (!out.compile.ok && out.compile.diagnostics.some((d) => d.severity === 'error')) setTab('probleme');
    if (out.result && Object.keys(out.result.files).length > 0) {
      const after = bytesToText(out.result.files);
      const diff = new Set(Object.keys(after).filter((k) => after[k] !== before[k]));
      if (diff.size > 0) {
        setData(after);
        setChanged(diff);
        props.onDataFilesChange?.(after);
      }
    }
    props.onRun?.(out.compile, out.result);
  }, [files, stdinMode, stdinText, argsText, data, settings.zeitlimit, run, props]);

  const jump = (line: number, file?: string, column = 1) => {
    if (file && file in files && file !== active) setActive(file);
    setTimeout(() => editor.current?.focusLine(line, column), 30);
  };

  const running = state.phase === 'running' || state.phase === 'compiling';
  const command = useMemo(() => displayCommand(files), [files]);

  return (
    <div className={`workbench${wide ? ' wide' : ''}`} style={{ ['--editor-font' as string]: `${settings.editorSchrift}px` }}>
      <div className="toolbar">
        {running ? (
          <button type="button" className="btn btn-sm" onClick={stop}>
            <Stop size={15} weight="fill" /> Stopp
          </button>
        ) : (
          <button type="button" className="btn btn-sm btn-primary" onClick={() => void doRun()} title="Kompilieren und ausführen (Strg+Enter)">
            <Play size={15} weight="fill" /> Ausführen
          </button>
        )}
        {props.actions}
        <span className="spacer" />
        <button type="button" className={`btn btn-ghost btn-sm${showSettings ? ' active' : ''}`} onClick={() => setShowSettings((s) => !s)} aria-expanded={showSettings} title="Eingabe und Argumente">
          <Gear size={15} /> Eingabe
        </button>
        <button type="button" className="btn btn-ghost btn-sm btn-icon" title="Code kopieren" aria-label="Code kopieren" onClick={() => void navigator.clipboard?.writeText(files[active] ?? '')}>
          <Copy size={15} />
        </button>
        {!readOnly && (
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-icon"
            title="Auf den Ausgangszustand zurücksetzen"
            aria-label="Zurücksetzen"
            onClick={() => {
              if (JSON.stringify(files) !== JSON.stringify(initialFiles) && !window.confirm('Deine Änderungen gehen verloren. Zurücksetzen?')) return;
              onFilesChange({ ...initialFiles });
              setData(props.dataFiles ?? {});
              setChanged(new Set());
              reset();
            }}
          >
            <ArrowCounterClockwise size={15} />
          </button>
        )}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => void preprocess(files, active).then(() => setTab('praeprozessor'))} title="Code nach dem Präprozessor ansehen (clang -E)">
          <Hash size={15} />
          <span className="hide-sm">Präprozessor</span>
        </button>
      </div>
      {showSettings && (
        <div className="run-settings">
          <div className="row">
            <span className="field-label">Eingabe für scanf</span>
            <div className="segmented" role="radiogroup">
              <button type="button" className={stdinMode === 'interaktiv' ? 'on' : ''} disabled={!isolated} onClick={() => setStdinMode('interaktiv')} role="radio" aria-checked={stdinMode === 'interaktiv'}>
                Im Terminal tippen
              </button>
              <button type="button" className={stdinMode === 'vorab' ? 'on' : ''} onClick={() => setStdinMode('vorab')} role="radio" aria-checked={stdinMode === 'vorab'}>
                Vorab eingeben
              </button>
            </div>
          </div>
          {!isolated && <p className="muted" style={{ fontSize: '0.85rem' }}>Interaktive Eingabe ist in diesem Browser gerade nicht verfügbar. Lade die Seite neu, dann klappt es meist.</p>}
          {stdinMode === 'vorab' && (
            <div className="field">
              <label htmlFor="stdin-pre">Eingabe (eine Zeile pro Enter)</label>
              <textarea id="stdin-pre" className="textarea" rows={3} value={stdinText} onChange={(e) => setStdinText(e.target.value)} spellCheck={false} />
            </div>
          )}
          <div className="field">
            <label htmlFor="args">Programm-Argumente (argv), durch Leerzeichen getrennt</label>
            <input id="args" className="input mono" value={argsText} onChange={(e) => setArgsText(e.target.value)} spellCheck={false} placeholder="z. B. sensor.txt 42" />
          </div>
        </div>
      )}
      <div className="workbench-split">
        <div style={{ display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr)', minWidth: 0 }}>
          {(names.length > 1 || manageFiles) && (
            <div className="filetabs" role="tablist">
              {names.map((n) => (
                <button key={n} type="button" role="tab" aria-selected={n === active} className={`filetab${n === active ? ' active' : ''}`} onClick={() => setActive(n)}>
                  <FileC size={14} /> {n}
                  {manageFiles && names.length > 1 && n === active && (
                    <Trash
                      size={13}
                      aria-label={`${n} löschen`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!window.confirm(`${n} löschen?`)) return;
                        const next = { ...files };
                        delete next[n];
                        onFilesChange(next);
                      }}
                    />
                  )}
                </button>
              ))}
              {manageFiles && (
                <button
                  type="button"
                  className="filetab"
                  onClick={() => {
                    const name = window.prompt('Name der neuen Datei (z. B. motor.c oder motor.h):')?.trim();
                    if (!name) return;
                    if (!/^[\w.-]+\.(c|h)$/.test(name)) {
                      window.alert('Bitte einen Namen mit .c oder .h, ohne Leerzeichen.');
                      return;
                    }
                    if (name in files) return setActive(name);
                    const guard = name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
                    onFilesChange({ ...files, [name]: name.endsWith('.h') ? `#ifndef ${guard}\n#define ${guard}\n\n#endif\n` : `#include <stdio.h>\n` });
                    setActive(name);
                  }}
                >
                  <FilePlus size={14} /> Neue Datei
                </button>
              )}
            </div>
          )}
          <CodeEditor
            ref={editor}
            files={files}
            active={active}
            onChange={(name, text) => onFilesChange({ ...files, [name]: text })}
            diagnostics={diagnostics}
            onRun={() => void doRun()}
            readOnly={readOnly}
            height={props.editorHeight ?? 'auto'}
            minLines={props.minLines ?? 6}
            label={props.label}
          />
        </div>
        <div className="outpanel">
          <OutputTabs tab={tab} setTab={setTab} problems={errors} warnings={warnings} showFiles={showFiles} filesChanged={changed.size > 0} showPre={state.preprocessed !== undefined} />
          <div className="outbody">
            {tab === 'terminal' && (
              <Terminal
                state={state}
                onSend={sendLine}
                onEof={sendEof}
                compilerStatus={compilerStatus}
                onJump={(line, file) => jump(line, file)}
                onShowProblems={() => setTab('probleme')}
                timeLimit={settings.zeitlimit}
                idleHint={props.idleHint}
              />
            )}
            {tab === 'probleme' && <Problems diagnostics={diagnostics} onJump={(line, file, col) => jump(line, file, col)} />}
            {tab === 'dateien' && (
              <FilesView
                files={data}
                editable={!running}
                changed={changed}
                onChange={(name, text) => {
                  const next = { ...data, [name]: text };
                  setData(next);
                  props.onDataFilesChange?.(next);
                }}
              />
            )}
            {tab === 'befehl' && <CommandView command={command} />}
            {tab === 'praeprozessor' && state.preprocessed && <PreprocessView data={state.preprocessed} />}
          </div>
        </div>
      </div>
    </div>
  );
}
