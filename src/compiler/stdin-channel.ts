/**
 * Blockierende Eingabe zwischen Haupt-Thread und Run-Worker.
 *
 * Das C-Programm läuft synchron im Worker. Liest es von stdin und ist nichts da,
 * wartet der Worker mit Atomics.wait, bis der Haupt-Thread eine Zeile liefert.
 * Aufbau des SharedArrayBuffer: [Zustand, Länge] als Int32, danach die Bytes.
 */
export const STDIN_CAPACITY = 64 * 1024;

const EMPTY = 0;
const DATA = 1;
export const EOF = 2;
export const STOP = 3;

export function createStdinBuffer(): SharedArrayBuffer {
  return new SharedArrayBuffer(8 + STDIN_CAPACITY);
}

/** Haupt-Thread: Text an das wartende Programm geben. */
export function sendInput(buffer: SharedArrayBuffer, text: string) {
  const ctrl = new Int32Array(buffer, 0, 2);
  const data = new Uint8Array(buffer, 8);
  const bytes = new TextEncoder().encode(text).slice(0, STDIN_CAPACITY);
  data.set(bytes);
  Atomics.store(ctrl, 1, bytes.length);
  Atomics.store(ctrl, 0, DATA);
  Atomics.notify(ctrl, 0);
}

export function sendSignal(buffer: SharedArrayBuffer, state: typeof EOF | typeof STOP) {
  const ctrl = new Int32Array(buffer, 0, 2);
  Atomics.store(ctrl, 0, state);
  Atomics.notify(ctrl, 0);
}

/** Worker: wartet auf Eingabe. Liefert Bytes, `'eof'` oder `'stop'`. */
export function waitForInput(buffer: SharedArrayBuffer): Uint8Array | 'eof' | 'stop' {
  const ctrl = new Int32Array(buffer, 0, 2);
  Atomics.wait(ctrl, 0, EMPTY);
  const state = Atomics.load(ctrl, 0);
  if (state === STOP) return 'stop';
  if (state === EOF) {
    Atomics.store(ctrl, 0, EMPTY);
    return 'eof';
  }
  const length = Atomics.load(ctrl, 1);
  const bytes = new Uint8Array(buffer, 8, length).slice();
  Atomics.store(ctrl, 0, EMPTY);
  return bytes;
}
