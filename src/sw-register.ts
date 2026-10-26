/**
 * Service Worker registrieren (nur im Build).
 *
 * Auf GitHub Pages fehlen die Header für Cross-Origin-Isolation. Der Service
 * Worker hängt sie an jede Antwort. Beim allerersten Besuch steuert er die
 * Seite aber noch nicht; dann wird einmal neu geladen. Ein Merker in der
 * sessionStorage verhindert eine Schleife, falls der Browser trotzdem nicht
 * isoliert (dann gibt es «Eingaben vorab» statt interaktiver Eingabe).
 */
const RELOAD_FLAG = 'zeiger.coi-reload';

export type UpdateListener = (apply: () => void) => void;

export function registerServiceWorker(onUpdate: UpdateListener) {
  if (import.meta.env.DEV || !('serviceWorker' in navigator)) return;
  const url = `${import.meta.env.BASE_URL}sw.js`;
  let updateBestaetigt = false;
  navigator.serviceWorker
    .register(url, { scope: import.meta.env.BASE_URL })
    .then((registration) => {
      const offerUpdate = (worker: ServiceWorker | null) => {
        if (!worker) return;
        onUpdate(() => {
          updateBestaetigt = true;
          worker.postMessage('SKIP_WAITING');
        });
      };
      if (registration.waiting && navigator.serviceWorker.controller) offerUpdate(registration.waiting);
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        installing?.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(installing);
        });
      });
      ensureIsolation();
    })
    .catch(() => {
      // Ohne Service Worker läuft die App trotzdem, nur nicht offline.
    });

  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    // Erster Besuch auf einem Server, der die Header schon selbst setzt: kein Neuladen nötig.
    if (!updateBestaetigt && globalThis.crossOriginIsolated) return;
    reloading = true;
    window.location.reload();
  });
}

function ensureIsolation() {
  if (globalThis.crossOriginIsolated) {
    sessionStorage.removeItem(RELOAD_FLAG);
    return;
  }
  if (sessionStorage.getItem(RELOAD_FLAG)) return;
  navigator.serviceWorker.ready.then(() => {
    if (globalThis.crossOriginIsolated) return;
    sessionStorage.setItem(RELOAD_FLAG, '1');
    if (navigator.serviceWorker.controller) window.location.reload();
    // Noch kein Controller: clients.claim() im Worker löst controllerchange aus, das lädt neu.
  });
}
