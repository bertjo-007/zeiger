// Ablauftest mit Edge: Lernpfad, Editor-Fälle, Test, Suche, Speicherung.
// Startet bei Bedarf selbst den Dev-Server. Aufruf: npm run e2e
import { spawn } from 'node:child_process';
import { BASE, clickText, launch, noHorizontalScroll, shot, sleep, waitCompiler, waitText, watch } from './lib.mjs';

let server;
async function erreichbar() {
  try {
    return (await fetch(BASE + '/')).ok;
  } catch {
    return false;
  }
}
if (!(await erreichbar())) {
  server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', '5177', '--strictPort'], { stdio: 'ignore' });
  for (let i = 0; i < 60 && !(await erreichbar()); i++) await sleep(500);
}

const ergebnisse = [];
async function schritt(name, fn) {
  const t0 = Date.now();
  try {
    await fn();
    ergebnisse.push({ name, ok: true, ms: Date.now() - t0 });
    console.log(`✓ ${name}`);
  } catch (e) {
    ergebnisse.push({ name, ok: false, fehler: e.message });
    console.log(`✗ ${name}: ${e.message}`);
    await shot(page, 'fehler-' + name.replace(/\W+/g, '-')).catch(() => {});
  }
}

/** Ersetzt den Inhalt des (ersten) Editors. insertText umgeht Einrückung und Klammer-Ergänzung. */
async function setzeCode(page, code) {
  await page.click('.cm-content');
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.keyboard.sendCharacter(code);
}

async function ausfuehren(page) {
  await clickText(page, 'Ausführen');
}

const browser = await launch();
const page = await browser.newPage();
const errors = [];
watch(page, errors);
// Rückfragen wie «Trotzdem auswerten?» bestätigen, sonst blockiert der Dialog die Seite.
page.on('dialog', (d) => void d.accept());
await page.setViewport({ width: 1440, height: 900 });

await schritt('Startseite', async () => {
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await waitText(page, 'Strukturen und weitere Datentypen');
  await shot(page, 'start');
});

await schritt('Beispiel einer Lektion ausführen', async () => {
  await page.goto(BASE + '/lektion/k09-l03', { waitUntil: 'load' });
  await waitText(page, 'Zeiger als Parameter');
  await waitCompiler(page);
  await clickText(page, 'Ausführen');
  await waitText(page, 'links = 7, rechts = 3', 240000);
  await waitText(page, 'Programm beendet');
});

await schritt('Übung falsch, dann richtig', async () => {
  await page.goto(BASE + '/uebung/k09-l03-u1', { waitUntil: 'load' });
  await waitText(page, 'Tauschen, das nicht tauscht');
  await page.waitForSelector('.cm-content');
  await clickText(page, 'Prüfen');
  await waitText(page, '0 von 1 Tests bestanden', 60000);
  await waitText(page, 'Hinweis');
  await setzeCode(
    page,
    '#include <stdio.h>\n\nvoid tauschen(int *a, int *b) {\n    int tmp = *a;\n    *a = *b;\n    *b = tmp;\n}\n\nint main(void) {\n    int x = 3, y = 7;\n    tauschen(&x, &y);\n    printf("%d %d\\n", x, y);\n    return 0;\n}\n',
  );
  await clickText(page, 'Prüfen');
  await waitText(page, 'Alle Tests bestanden', 60000);
  await shot(page, 'uebung-geloest');
});

await schritt('Fortschritt bleibt nach dem Neuladen', async () => {
  await page.goto(BASE + '/kapitel/k09', { waitUntil: 'load' });
  await waitText(page, 'Übungen 1/');
  await page.reload({ waitUntil: 'load' });
  await waitText(page, 'Übungen 1/');
});

await schritt('Interaktive Eingabe mit scanf', async () => {
  await page.goto(BASE + '/spielwiese', { waitUntil: 'load' });
  await page.waitForSelector('.cm-content');
  await setzeCode(page, '#include <stdio.h>\n\nint main(void) {\n    int n = 0;\n    printf("Zahl: ");\n    if (scanf("%d", &n) != 1) {\n        return 1;\n    }\n    printf("doppelt: %d\\n", 2 * n);\n    return 0;\n}\n');
  await ausfuehren(page);
  await page.waitForSelector('input[aria-label="Eingabe für das Programm"]', { timeout: 60000 });
  await page.type('input[aria-label="Eingabe für das Programm"]', '21');
  await page.keyboard.press('Enter');
  await waitText(page, 'doppelt: 42', 30000);
});

await schritt('Endlosschleife wird abgebrochen', async () => {
  // unsigned: Ein int-Zähler liefe auf schnellen Rechnern vor dem Zeitlimit über (Laufzeitfehler).
  await setzeCode(page, 'int main(void) {\n    volatile unsigned int i = 0;\n    while (1) {\n        i++;\n    }\n}\n');
  await ausfuehren(page);
  await waitText(page, 'abgebrochen', 30000);
});

await schritt('Laufzeitfehler mit Zeile', async () => {
  await setzeCode(page, '#include <stdio.h>\n\nint main(void) {\n    int a[3] = {1, 2, 3};\n    int i = 3;\n    printf("%d\\n", a[i]);\n    return 0;\n}\n');
  await ausfuehren(page);
  await waitText(page, 'Arraygrenze überschritten', 30000);
  await waitText(page, 'Zu Zeile 6');
  await shot(page, 'laufzeitfehler');
});

await schritt('Speicherleck wird gemeldet', async () => {
  await setzeCode(page, '#include <stdlib.h>\n\nint main(void) {\n    int *p = malloc(10 * sizeof *p);\n    if (p == NULL) {\n        return 1;\n    }\n    p[0] = 1;\n    return 0;\n}\n');
  await ausfuehren(page);
  await waitText(page, 'Speicherleck: 40 Byte', 30000);
});

await schritt('Kapiteltest mit Schwächen', async () => {
  await page.goto(BASE + '/test/k11', { waitUntil: 'load' });
  await waitText(page, 'Test starten');
  await sleep(500);
  await clickText(page, 'Test starten');
  await waitText(page, 'Jetzt auswerten');
  await clickText(page, 'Jetzt auswerten');
  await waitText(page, 'Noch nicht bestanden', 120000);
  await waitText(page, 'Diese Themen solltest du wiederholen');
});

await schritt('Suche und Bibliothek', async () => {
  await page.goto(BASE + '/bibliothek', { waitUntil: 'load' });
  await waitText(page, 'Befehlsbibliothek');
  await sleep(500);
  await page.keyboard.down('Control');
  await page.keyboard.press('k');
  await page.keyboard.up('Control');
  await page.waitForSelector('[aria-label="Suche"] input');
  await page.type('[aria-label="Suche"] input', 'malloc');
  await waitText(page, 'Speicher', 10000, '[aria-label="Suche"]');
  await page.keyboard.press('Escape');
  await page.goto(BASE + '/bibliothek/volatile', { waitUntil: 'load' });
  await waitText(page, 'Interrupt-Routine');
});

await schritt('Handy ohne horizontales Scrollen', async () => {
  await page.setViewport({ width: 390, height: 844 });
  for (const pfad of ['/', '/lektion/k11-l03', '/uebung/k10-l02-u3', '/bibliothek']) {
    await page.goto(BASE + pfad, { waitUntil: 'load' });
    await sleep(800);
    if (!(await noHorizontalScroll(page))) throw new Error(`horizontales Scrollen auf ${pfad}`);
  }
  await shot(page, 'handy-uebung');
});

await schritt('Dunkelmodus', async () => {
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE + '/lektion/k11-l04', { waitUntil: 'load' });
  await waitText(page, 'Pfeiloperator');
  const hell = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  if (hell === 'rgb(255, 255, 255)') throw new Error('Hintergrund bleibt weiss');
  await shot(page, 'dunkel');
});

await browser.close();
server?.kill();

const fehlgeschlagen = ergebnisse.filter((e) => !e.ok);
console.log(`\n${ergebnisse.length - fehlgeschlagen.length}/${ergebnisse.length} Schritte bestanden`);
console.log(errors.length ? 'Konsolenfehler:\n' + errors.join('\n') : 'Keine Konsolenfehler');
process.exit(fehlgeschlagen.length || errors.length ? 1 : 0);
