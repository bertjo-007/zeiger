// Ersetzt innerhalb von md`…`-Templates doppelte Backslashes vor Buchstaben/0 durch einfache.
// In md-Templates gilt String.raw: \n steht dort bereits als Backslash + n.
import { readFileSync, writeFileSync } from 'node:fs';

for (const file of process.argv.slice(2)) {
  const src = readFileSync(file, 'utf8');
  let out = '';
  let i = 0;
  let n = 0;
  while (i < src.length) {
    const start = src.indexOf('md`', i);
    if (start === -1) {
      out += src.slice(i);
      break;
    }
    out += src.slice(i, start + 3);
    let j = start + 3;
    let body = '';
    while (j < src.length) {
      if (src[j] === '\\') {
        body += src[j] + src[j + 1];
        j += 2;
        continue;
      }
      if (src[j] === '`') break;
      body += src[j];
      j++;
    }
    const fixed = body.replace(/\\\\([a-z0-9"'])/g, (_, ch) => {
      n++;
      return '\\' + ch;
    });
    out += fixed + '`';
    i = j + 1;
  }
  writeFileSync(file, out);
  console.log(`${file}: ${n} Stellen korrigiert`);
}
