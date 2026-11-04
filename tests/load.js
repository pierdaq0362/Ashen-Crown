/* Loads the game scripts in the same order as index.html (so new chapter files are picked up automatically). */
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]).filter((f) => !/ui\.js$/.test(f));
for (const f of files) require(path.join(root, f));
module.exports = { files };
