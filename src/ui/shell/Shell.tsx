import {
  Books,
  CaretDown,
  CaretRight,
  ChartLineUp,
  CheckCircle,
  Circle,
  CircleHalf,
  Code,
  GearSix,
  House,
  List,
  MagnifyingGlass,
  Repeat,
  Exam,
} from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { findeAufgabe, findeKapitel, findeLektion, KAPITEL } from '../../content/kurs.ts';
import { REFERENZ } from '../../content/referenz/index.ts';
import { kapitelFortschritt } from '../../progress/stats.ts';
import { useAufgabeStaende, useFaellig, useLektionStaende, useTests } from '../hooks.ts';
import { BibliothekSchublade } from '../pages/Bibliothek.tsx';
import { SearchPalette } from './SearchPalette.tsx';
import { compiler } from '../../compiler/host.ts';
import { useSettings } from '../settings.ts';

function useCrumbs(): { label: string; to?: string }[] {
  const { pathname } = useLocation();
  const [, a, b] = pathname.split('/');
  if (a === 'lektion' && b) {
    const hit = findeLektion(b);
    if (hit) return [{ label: `Kapitel ${hit.kapitel.nr}`, to: `/kapitel/${hit.kapitel.id}` }, { label: hit.lektion.titel }];
  }
  if (a === 'kapitel' && b) {
    const k = findeKapitel(b);
    if (k) return [{ label: `Kapitel ${k.nr}: ${k.titel}` }];
  }
  if (a === 'uebung' && b) {
    const hit = findeAufgabe(b);
    if (hit?.lektion) return [{ label: `Kapitel ${hit.kapitel.nr}`, to: `/kapitel/${hit.kapitel.id}` }, { label: hit.lektion.titel, to: `/lektion/${hit.lektion.id}#uebungen` }, { label: hit.aufgabe.titel ?? 'Übung' }];
  }
  if (a === 'test') {
    if (b === 'gesamt') return [{ label: 'Gesamttest' }];
    const k = b ? findeKapitel(b) : undefined;
    if (k) return [{ label: `Kapitel ${k.nr}`, to: `/kapitel/${k.id}` }, { label: 'Kapiteltest' }];
  }
  if (a === 'bibliothek') {
    const r = b ? REFERENZ.find((x) => x.id === b) : undefined;
    return r ? [{ label: 'Befehlsbibliothek', to: '/bibliothek' }, { label: r.name }] : [{ label: 'Befehlsbibliothek' }];
  }
  const einfach: Record<string, string> = { wiederholen: 'Wiederholen', fortschritt: 'Fortschritt', spielwiese: 'Spielwiese', einstellungen: 'Einstellungen' };
  if (a && einfach[a]) return [{ label: einfach[a] }];
  return [{ label: 'Start' }];
}

function Outline({ onNavigate }: { onNavigate(): void }) {
  const { pathname } = useLocation();
  const lektionen = useLektionStaende();
  const aufgaben = useAufgabeStaende();
  const tests = useTests();
  const aktuellesKapitel = useMemo(() => {
    const [, a, b] = pathname.split('/');
    if (a === 'lektion') return findeLektion(b)?.kapitel.id;
    if (a === 'kapitel' || a === 'test') return b;
    if (a === 'uebung') return findeAufgabe(b)?.kapitel.id;
    return undefined;
  }, [pathname]);
  const [offen, setOffen] = useState<Set<string>>(() => new Set(aktuellesKapitel ? [aktuellesKapitel] : []));
  useEffect(() => {
    if (aktuellesKapitel) setOffen((o) => (o.has(aktuellesKapitel) ? o : new Set([...o, aktuellesKapitel])));
  }, [aktuellesKapitel]);

  return (
    <div>
      <div className="sidebar-title">Kurs</div>
      {KAPITEL.map((k) => {
        const f = kapitelFortschritt(k, lektionen, aufgaben, tests);
        const auf = offen.has(k.id);
        return (
          <div key={k.id} className="outline-chapter">
            <button type="button" aria-expanded={auf} onClick={() => setOffen((o) => {
              const n = new Set(o);
              if (n.has(k.id)) n.delete(k.id);
              else n.add(k.id);
              return n;
            })}>
              <span className="outline-nr">{String(k.nr).padStart(2, '0')}</span>
              <span>{k.titel}</span>
              {auf ? <CaretDown size={14} color="var(--text-3)" /> : <CaretRight size={14} color="var(--text-3)" />}
              <div className={`bar${f.anteil >= 0.999 ? ' bar-ok' : ''}`} aria-label={`${Math.round(f.anteil * 100)} Prozent`}>
                <span style={{ width: `${Math.round(f.anteil * 100)}%` }} />
              </div>
            </button>
            {auf && (
              <div className="outline-lessons">
                <NavLink to={`/kapitel/${k.id}`} end className={({ isActive }) => `outline-lesson${isActive ? ' active' : ''}`} onClick={onNavigate}>
                  <Circle size={14} color="transparent" /> Übersicht
                </NavLink>
                {k.lektionen.map((l) => {
                  const fertig = !!lektionen.get(l.id)?.abgeschlossen;
                  const besucht = !!lektionen.get(l.id);
                  return (
                    <NavLink key={l.id} to={`/lektion/${l.id}`} className={({ isActive }) => `outline-lesson${isActive ? ' active' : ''}`} onClick={onNavigate}>
                      {fertig ? <CheckCircle size={14} weight="fill" className="done" /> : besucht ? <CircleHalf size={14} color="var(--text-3)" /> : <Circle size={14} color="var(--text-3)" />}
                      <span>{l.titel}</span>
                    </NavLink>
                  );
                })}
                <NavLink to={`/test/${k.id}`} className={({ isActive }) => `outline-lesson${isActive ? ' active' : ''}`} onClick={onNavigate}>
                  {f.test.bestanden ? <CheckCircle size={14} weight="fill" className="done" /> : <Exam size={14} color="var(--text-3)" />}
                  <span>Kapiteltest</span>
                </NavLink>
              </div>
            )}
          </div>
        );
      })}
      <div className="outline-chapter">
        <NavLink to="/test/gesamt" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={onNavigate}>
          <Exam size={18} /> Gesamttest
        </NavLink>
      </div>
    </div>
  );
}

export function Shell() {
  const [menu, setMenu] = useState(false);
  const [suche, setSuche] = useState(false);
  const [spick, setSpick] = useState(false);
  const crumbs = useCrumbs();
  const faellig = useFaellig();
  const { pathname } = useLocation();
  const settings = useSettings();

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (settings.vorladen) {
      const t = setTimeout(() => void compiler.warmup().catch(() => {}), 1500);
      return () => clearTimeout(t);
    }
  }, [settings.vorladen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSuche(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSpick((s) => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const link = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? ' active' : ''}`;

  return (
    <div className="shell">
      <aside className={`sidebar${menu ? ' open' : ''}`} aria-label="Navigation">
        <div className="sidebar-head">
          <Link to="/" className="brand">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" />
            Zeiger
          </Link>
          <span className="muted" style={{ fontSize: '0.82rem' }}>
            C lernen
          </span>
        </div>
        <nav className="sidebar-scroll">
          <div className="nav-list">
            <NavLink to="/" end className={link}>
              <House size={18} /> Start
            </NavLink>
            <NavLink to="/wiederholen" className={link}>
              <Repeat size={18} /> Wiederholen
              {faellig > 0 && <span className="count">{faellig}</span>}
            </NavLink>
            <NavLink to="/bibliothek" className={link}>
              <Books size={18} /> Befehlsbibliothek
            </NavLink>
            <NavLink to="/fortschritt" className={link}>
              <ChartLineUp size={18} /> Fortschritt
            </NavLink>
            <NavLink to="/spielwiese" className={link}>
              <Code size={18} /> Spielwiese
            </NavLink>
          </div>
          <Outline onNavigate={() => setMenu(false)} />
        </nav>
        <div className="sidebar-foot">
          <NavLink to="/einstellungen" className={link}>
            <GearSix size={18} /> Einstellungen
          </NavLink>
        </div>
      </aside>
      {menu && <div className="backdrop" onClick={() => setMenu(false)} />}
      <div className="main">
        <header className="topbar">
          <button type="button" className="btn btn-ghost btn-icon menu-btn" aria-label="Menü öffnen" onClick={() => setMenu(true)}>
            <List size={20} />
          </button>
          <nav className="crumbs" aria-label="Pfad">
            {crumbs.map((c, i) => (
              <span key={i} style={{ display: 'contents' }}>
                {i > 0 && <span className="sep">/</span>}
                {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
              </span>
            ))}
          </nav>
          <span className="spacer" />
          <button type="button" className="search-trigger" onClick={() => setSuche(true)} aria-label="Suchen">
            <MagnifyingGlass size={16} />
            <span className="label">Suchen</span>
            <kbd>Strg K</kbd>
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setSpick(true)} title="Befehlsbibliothek als Spickzettel öffnen (Strg+B)">
            <Books size={18} />
            <span className="hide-sm">Spickzettel</span>
          </button>
        </header>
        <main className="content" id="inhalt">
          <Outlet />
        </main>
      </div>
      {suche && <SearchPalette onClose={() => setSuche(false)} />}
      {spick && <BibliothekSchublade onClose={() => setSpick(false)} />}
    </div>
  );
}
