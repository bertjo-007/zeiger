// Schreibt package.json sauber formatiert und ohne BOM.
import { readFileSync, writeFileSync } from 'node:fs';

const text = readFileSync('package.json', 'utf8').replace(/^﻿/, '');
const p = JSON.parse(text);
const sort = (o) => Object.fromEntries(Object.entries(o ?? {}).sort(([a], [b]) => a.localeCompare(b)));
p.dependencies = sort(p.dependencies);
p.devDependencies = sort(p.devDependencies);
writeFileSync('package.json', JSON.stringify(p, null, 2) + '\n');
