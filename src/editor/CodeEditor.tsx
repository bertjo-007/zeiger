/**
 * C-Editor auf Basis von CodeMirror 6.
 * Pro Datei ein eigener EditorState, damit Rückgängig-Historie und Cursor beim
 * Wechseln der Datei-Tabs erhalten bleiben.
 */
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { cpp } from '@codemirror/lang-cpp';
import { bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { lintGutter, setDiagnostics, type Diagnostic as CmDiagnostic } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { Compartment, EditorSelection, EditorState, type Extension } from '@codemirror/state';
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  placeholder as placeholderExt,
} from '@codemirror/view';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { explain } from '../compiler/diagnostics-de.ts';
import type { Diagnostic } from '../compiler/types.ts';
import { classHighlighter } from '../ui/code/highlight.ts';

export interface EditorHandle {
  focusLine(line: number, column?: number): void;
  focus(): void;
}

interface Props {
  files: Record<string, string>;
  active: string;
  onChange(name: string, text: string): void;
  diagnostics?: Diagnostic[];
  onRun?(): void;
  readOnly?: boolean;
  /** 'auto' wächst mit dem Inhalt (mindestens minLines), sonst eine CSS-Höhe. */
  height?: 'auto' | string;
  minLines?: number;
  label?: string;
}

function toCm(state: EditorState, file: string, diags: Diagnostic[]): CmDiagnostic[] {
  const result: CmDiagnostic[] = [];
  for (const d of diags) {
    if (d.file !== file || d.line < 1 || d.line > state.doc.lines || d.severity === 'note') continue;
    const line = state.doc.line(d.line);
    const from = Math.min(line.from + Math.max(0, d.column - 1), line.to);
    const word = state.wordAt(from);
    const to = word && word.from === from ? word.to : Math.min(from + 1, line.to);
    const e = explain(d);
    result.push({
      from,
      to: Math.max(to, from),
      severity: d.severity === 'error' ? 'error' : 'warning',
      message: e ? `${e.titel}: ${d.message}` : d.message,
    });
  }
  return result;
}

export const CodeEditor = forwardRef<EditorHandle, Props>(function CodeEditor(
  { files, active, onChange, diagnostics = [], onRun, readOnly = false, height = 'auto', minLines = 8, label },
  ref,
) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const states = useRef(new Map<string, EditorState>());
  const current = useRef(active);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  const readOnlyComp = useRef(new Compartment());
  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  const extensions = useRef<(name: string) => Extension[]>((name) => [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    lintGutter(),
    indentUnit.of('    '),
    EditorState.tabSize.of(4),
    cpp(),
    syntaxHighlighting(classHighlighter),
    placeholderExt('// Hier kommt dein C-Code hin'),
    readOnlyComp.current.of([EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)]),
    keymap.of([
      { key: 'Mod-Enter', preventDefault: true, run: () => (onRunRef.current?.(), true) },
      { key: 'Mod-s', preventDefault: true, run: () => true },
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      indentWithTab,
    ]),
    EditorView.updateListener.of((u) => {
      if (u.docChanged) onChangeRef.current(name, u.state.doc.toString());
    }),
    EditorView.contentAttributes.of({ 'aria-label': label ?? `Code-Editor ${name}` }),
    EditorView.theme({
      '&': { height: height === 'auto' ? 'auto' : height },
      '.cm-content': { minHeight: `${minLines * 1.6}em` },
      '.cm-scroller': { overflow: 'auto' },
    }),
  ]);

  const stateFor = (name: string) => {
    let s = states.current.get(name);
    if (!s) {
      s = EditorState.create({ doc: files[name] ?? '', extensions: extensions.current(name) });
      states.current.set(name, s);
    }
    return s;
  };

  // Aufbauen
  useEffect(() => {
    const v = new EditorView({ state: stateFor(active), parent: host.current! });
    view.current = v;
    current.current = active;
    return () => {
      v.destroy();
      view.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Datei wechseln
  useEffect(() => {
    const v = view.current;
    if (!v || current.current === active) return;
    states.current.set(current.current, v.state);
    v.setState(stateFor(active));
    current.current = active;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Inhalt von aussen ersetzt (Zurücksetzen, Musterlösung laden)
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    for (const [name, text] of Object.entries(files)) {
      if (name === current.current) {
        if (v.state.doc.toString() !== text) v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: text } });
      } else {
        const s = states.current.get(name);
        if (s && s.doc.toString() !== text) states.current.delete(name);
      }
    }
    for (const name of [...states.current.keys()]) if (!(name in files)) states.current.delete(name);
  }, [files]);

  // Nur-Lesen umschalten
  useEffect(() => {
    view.current?.dispatch({ effects: readOnlyComp.current.reconfigure([EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)]) });
  }, [readOnly]);

  // Compilermeldungen anzeigen
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    v.dispatch(setDiagnostics(v.state, toCm(v.state, active, diagnostics)));
  }, [diagnostics, active]);

  useImperativeHandle(ref, () => ({
    focusLine(line: number, column = 1) {
      const v = view.current;
      if (!v || line < 1 || line > v.state.doc.lines) return;
      const l = v.state.doc.line(line);
      const pos = Math.min(l.from + column - 1, l.to);
      v.dispatch({ selection: EditorSelection.cursor(pos), scrollIntoView: true });
      v.focus();
    },
    focus() {
      view.current?.focus();
    },
  }));

  return <div ref={host} className="editor-host" />;
});
