const fs = require('fs');
const path = require('path');

const from = path.join(__dirname, '../out/api/search.static');
const to = path.join(__dirname, '../out/api/search');
const dir = path.dirname(to);

if (fs.existsSync(from)) {
  fs.mkdirSync(dir, { recursive: true });
  fs.renameSync(from, to);
  console.log('Renamed: search.static → search');
} else {
  console.log('Warning: search.static/route.js not found, skipped.');
}
