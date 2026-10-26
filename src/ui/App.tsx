import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { registerServiceWorker } from '../sw-register.ts';
import { BibliothekPage } from './pages/Bibliothek.tsx';
import { EinstellungenPage } from './pages/Einstellungen.tsx';
import { FortschrittPage } from './pages/Fortschritt.tsx';
import { KapitelPage } from './pages/Kapitel.tsx';
import { LektionPage } from './pages/Lektion.tsx';
import { NotFound } from './pages/NotFound.tsx';
import { SpielwiesePage } from './pages/Spielwiese.tsx';
import { StartPage } from './pages/Start.tsx';
import { TestPage } from './pages/Test.tsx';
import { UebungPage } from './pages/Uebung.tsx';
import { WiederholenPage } from './pages/Wiederholen.tsx';
import { useApplySettings, useSettings } from './settings.ts';
import { Shell } from './shell/Shell.tsx';

function UpdateToast() {
  const [apply, setApply] = useState<(() => void) | null>(null);
  useEffect(() => {
    registerServiceWorker((fn) => setApply(() => fn));
  }, []);
  if (!apply) return null;
  return (
    <div className="toast" role="status">
      Eine neue Version von Zeiger ist bereit.
      <button type="button" className="btn btn-sm" onClick={apply}>
        Neu laden
      </button>
      <button type="button" className="btn btn-sm" onClick={() => setApply(null)}>
        Später
      </button>
    </div>
  );
}

export function App() {
  const settings = useSettings();
  useApplySettings(settings);
  useEffect(() => {
    // Lernstand möglichst vor dem automatischen Löschen durch den Browser schützen.
    void navigator.storage?.persist?.().catch(() => {});
  }, []);
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<StartPage />} />
          <Route path="kapitel/:id" element={<KapitelPage />} />
          <Route path="lektion/:id" element={<LektionPage />} />
          <Route path="uebung/:id" element={<UebungPage />} />
          <Route path="test/:id" element={<TestPage />} />
          <Route path="wiederholen" element={<WiederholenPage />} />
          <Route path="bibliothek" element={<BibliothekPage />} />
          <Route path="bibliothek/:id" element={<BibliothekPage />} />
          <Route path="fortschritt" element={<FortschrittPage />} />
          <Route path="spielwiese" element={<SpielwiesePage />} />
          <Route path="einstellungen" element={<EinstellungenPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <UpdateToast />
    </BrowserRouter>
  );
}
