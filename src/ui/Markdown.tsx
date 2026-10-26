/**
 * Markdown der Lerninhalte. Erweiterungen:
 * - Hinweis-Kästen: Zeilen `> [!tipp] Titel`, `> [!achtung]`, `> [!veraltet]`, `> [!praxis]`, `> [!info]`
 * - Codeblöcke ~~~c werden gefärbt, ~~~text/ausgabe als Ausgabe dargestellt.
 */
import { Marked, type Tokens } from 'marked';
import { memo, useMemo, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import { highlightHtml } from './code/highlight.ts';
import tippSvg from '@phosphor-icons/core/assets/regular/lightbulb.svg?raw';
import achtungSvg from '@phosphor-icons/core/assets/regular/warning.svg?raw';
import veraltetSvg from '@phosphor-icons/core/assets/regular/prohibit.svg?raw';
import praxisSvg from '@phosphor-icons/core/assets/regular/cpu.svg?raw';
import infoSvg from '@phosphor-icons/core/assets/regular/info.svg?raw';

const CALLOUTS: Record<string, { titel: string; icon: string }> = {
  tipp: { titel: 'Tipp', icon: tippSvg },
  achtung: { titel: 'Achtung', icon: achtungSvg },
  veraltet: { titel: 'Veraltet oder unsicher', icon: veraltetSvg },
  praxis: { titel: 'Aus der Praxis', icon: praxisSvg },
  info: { titel: 'Hintergrund', icon: infoSvg },
};

const sizedIcon = (svg: string) => svg.replace('<svg ', '<svg width="20" height="20" aria-hidden="true" ');

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Wandelt `> [!typ] Titel`-Blöcke in HTML-Rahmen um, deren Inneres weiter Markdown bleibt. */
function callouts(source: string): string {
  const lines = source.split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^>\s*\[!(\w+)\][ \t]*(.*)$/.exec(lines[i]);
    if (!m || !CALLOUTS[m[1]]) {
      out.push(lines[i]);
      continue;
    }
    const kind = m[1];
    const titel = m[2].trim() || CALLOUTS[kind].titel;
    const body: string[] = [];
    while (i + 1 < lines.length && /^>/.test(lines[i + 1])) {
      i++;
      body.push(lines[i].replace(/^>\s?/, ''));
    }
    out.push(
      '',
      `<div class="callout callout-${kind}">${sizedIcon(CALLOUTS[kind].icon)}<div class="callout-title">${escapeHtml(titel)}</div><div class="callout-body">`,
      '',
      ...body,
      '',
      '</div></div>',
      '',
    );
  }
  return out.join('\n');
}

const marked = new Marked({ gfm: true, breaks: false });
marked.use({
  renderer: {
    code(token: Tokens.Code) {
      const lang = (token.lang ?? 'c').trim();
      if (lang === 'text' || lang === 'ausgabe') return `<pre class="output-block">${escapeHtml(token.text)}</pre>`;
      return `<div class="codeblock"><pre><code>${highlightHtml(token.text)}</code></pre></div>`;
    },
    link(token: Tokens.Link) {
      const text = this.parser.parseInline(token.tokens);
      if (/^https?:/.test(token.href)) return `<a href="${token.href}" target="_blank" rel="noreferrer">${text}</a>`;
      // Interne Links: Basis-Pfad (z. B. /zeiger/) voranstellen; der Klick läuft über den Router.
      const href = token.href.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + token.href : token.href;
      return `<a href="${href}" data-route="${token.href}">${text}</a>`;
    },
  },
});

/** Klicks auf interne Links im gerenderten Markdown an den Router geben. */
function useRouteClicks() {
  const navigate = useNavigate();
  return (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a[data-route]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(a.getAttribute('data-route')!);
  };
}

export function renderMarkdown(source: string): string {
  return marked.parse(callouts(source), { async: false }) as string;
}

export function renderInline(source: string): string {
  return marked.parseInline(source, { async: false }) as string;
}

export const Markdown = memo(function Markdown({ text, className = 'prose' }: { text: string; className?: string }) {
  const html = useMemo(() => renderMarkdown(text), [text]);
  const onClick = useRouteClicks();
  return <div className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
});

/** Für kurze Texte ohne Absätze (Optionen, Titel). */
export const Inline = memo(function Inline({ text }: { text: string }) {
  const html = useMemo(() => renderInline(text), [text]);
  const onClick = useRouteClicks();
  return <span onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
});
