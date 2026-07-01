// Copies the repo-level reports/ folder into data/reports/ before each build.
// data/reports/ is within the Angular workspace boundary and is gitignored.
// Angular's asset pipeline then serves these files at the /reports/ URL path.
const { cpSync, mkdirSync } = require('fs');
const { resolve } = require('path');

const src = resolve(__dirname, '../../reports');
const dest = resolve(__dirname, '../data/reports');

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true, force: true });
console.log('Copied ../reports → data/reports/');
