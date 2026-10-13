import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
const [,, input, output] = process.argv;
const doc = await getDocument({ data: new Uint8Array(fs.readFileSync(input)), useSystemFonts: true }).promise;
const pages = [];
for (let n = 1; n <= doc.numPages; n++) {
  const page = await doc.getPage(n);
  await page.getOperatorList();
  const tc = await page.getTextContent();
  const real = {};
  for (const id of new Set(tc.items.map(i => i.fontName))) { try { const o = page.commonObjs.get(id); real[id] = o.name || o.loadedName; } catch (e) { real[id] = id; } }
  const styles = tc.styles;
  const items = tc.items.filter(i => i.str !== undefined).map(i => ({
    s: i.str, w: +i.width.toFixed(2), x: +i.transform[4].toFixed(1), y: +i.transform[5].toFixed(1), h: +Math.abs(i.transform[3]).toFixed(1),
    f: real[i.fontName] || i.fontName, eol: i.hasEOL
  }));
  pages.push({ n, w: page.view[2], hgt: page.view[3], items });
}
fs.writeFileSync(output, JSON.stringify(pages));
console.log('pages', pages.length, 'items', pages.reduce((a, p) => a + p.items.length, 0));
