// Rauchtest: Seiten öffnen, Beispiel ausführen, Screenshots.
import { BASE, clickText, launch, noHorizontalScroll, shot, sleep, waitText, watch } from './lib.mjs';

const browser = await launch();
const page = await browser.newPage();
const errors = [];
watch(page, errors);
await page.setViewport({ width: 1440, height: 900 });

await page.goto(BASE + '/', { waitUntil: 'load' });
await waitText(page, 'Kapitel');
await shot(page, 'start');

await page.goto(BASE + '/lektion/k01-l01', { waitUntil: 'load' });
await waitText(page, 'Was ist C?');
await shot(page, 'lektion-oben');
await clickText(page, 'Ausführen');
await waitText(page, 'Programm beendet', 240000);
await page.evaluate(() => document.getElementById('beispiel')?.scrollIntoView());
await sleep(300);
await shot(page, 'lektion-beispiel');
await page.evaluate(() => document.getElementById('fehler')?.scrollIntoView());
await sleep(200);
await shot(page, 'lektion-fehler');
await page.evaluate(() => document.getElementById('uebungen')?.scrollIntoView());
await sleep(200);
await shot(page, 'lektion-uebungen');

await page.goto(BASE + '/uebung/k01-l01-u4', { waitUntil: 'load' });
await waitText(page, 'Zwei Tippfehler');
await sleep(500);
await clickText(page, 'Prüfen');
await waitText(page, 'kompiliert noch nicht', 60000);
await shot(page, 'uebung-fehler');

await page.goto(BASE + '/bibliothek', { waitUntil: 'load' });
await waitText(page, 'Befehlsbibliothek');
await shot(page, 'bibliothek');

await page.setViewport({ width: 390, height: 844 });
await page.goto(BASE + '/lektion/k01-l01', { waitUntil: 'load' });
await waitText(page, 'Was ist C?');
console.log('Handy ohne horizontales Scrollen:', await noHorizontalScroll(page));
await shot(page, 'handy-lektion');

await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
await page.setViewport({ width: 1440, height: 900 });
await page.goto(BASE + '/lektion/k01-l01', { waitUntil: 'load' });
await waitText(page, 'Was ist C?');
await page.evaluate(() => document.getElementById('beispiel')?.scrollIntoView());
await sleep(300);
await shot(page, 'dunkel-beispiel');

console.log(errors.length ? 'FEHLER:\n' + errors.join('\n') : 'Keine Konsolenfehler');
await browser.close();
