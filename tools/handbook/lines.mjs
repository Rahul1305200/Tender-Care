import fs from 'fs';
const pages = JSON.parse(fs.readFileSync(process.argv[2]));
const out = [];
for (const p of pages) {
  const rows = [];
  for (const it of p.items) {
    if (!it.s.trim()) continue;
    let r = rows.find(r => Math.abs(r.y - it.y) < 2.5);
    if (!r) rows.push(r = { y: it.y, parts: [] });
    r.parts.push(it);
  }
  rows.sort((a, b) => b.y - a.y);
  out.push(`=== PAGE ${p.n}`);
  for (const r of rows) {
    r.parts.sort((a, b) => a.x - b.x);
    const h = Math.max(...r.parts.map(i => i.h));
    const f = [...new Set(r.parts.map(i => i.f.replace(/^[A-Z]+[+]/, '')))].join('+');
    out.push(`[${h}|${f}|x${r.parts[0].x}] ` + r.parts.map(i => i.s).join(' ').replace(/\s+/g, ' '));
  }
}
fs.writeFileSync(process.argv[3], out.join('\n'));
