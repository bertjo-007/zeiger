// Öffnet eine Seite und gibt Konsolenfehler und sichtbaren Text aus: node e2e/debug-page.mjs /pfad
import { BASE, launch, shot, sleep, watch } from './lib.mjs';

const path = process.argv[2] ?? '/';
const browser = await launch();
const page = await browser.newPage();
const errors = [];
watch(page, errors);
page.on('console', async (m) => {
  if (m.type() !== 'error' && m.type() !== 'warn') return;
  const args = await Promise.all(m.args().map((a) => a.evaluate((v) => (v instanceof Error ? v.stack : String(v)).slice(0, 600)).catch(() => '?')));
  console.log('console', m.type(), args.join(' | ').slice(0, 1500));
});
await page.setViewport({ width: 1440, height: 900 });
await page.goto(BASE + path, { waitUntil: 'load' });
await sleep(Number(process.argv[3] ?? 2500));
console.log((await page.evaluate(() => document.querySelector('main')?.innerText ?? document.body.innerText)).slice(0, 1500));
await shot(page, 'debug');
console.log(errors.join('\n'));
await browser.close();
