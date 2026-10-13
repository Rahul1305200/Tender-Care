// Rebuild the Parent Handbook's structure from positioned PDF text.
import fs from 'fs';
const pages = JSON.parse(fs.readFileSync(process.argv[2]));
const font = f => f.replace(/^[A-Z]+\+/, '');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const chapters = [];
let chapter = null, section = null, block = null, quote = null;
const SKIP_PAGES = new Set([1, 2, 3, 4, 46, 47, 48, 50, 51, 52]);

function newSection(title) {
  section = { title, blocks: [] };
  chapter.sections.push(section);
  block = null;
}
function ensureSection() { if (!section) newSection(null); }

for (const p of pages) {
  if (SKIP_PAGES.has(p.n)) continue;
  const lines = [];
  for (const it of p.items) {
    if (!it.s.trim()) continue;
    let l = lines.find(l => Math.abs(l.y - it.y) < 2.5);
    if (!l) lines.push(l = { y: it.y, parts: [] });
    l.parts.push(it);
  }
  lines.sort((a, b) => b.y - a.y);
  let prevY = null;
  for (const l of lines) {
    l.parts.sort((a, b) => a.x - b.x);
    /* the PDF splits words into runs; restore a space wherever runs are visibly apart */
    l.parts.forEach((it, i) => {
      const prev = l.parts[i - 1];
      it.lead = prev && !/\s$/.test(prev.s) && !/^\s/.test(it.s) && it.x - (prev.x + prev.w) > it.h * .12 ? ' ' : '';
    });
    const fonts = [...new Set(l.parts.map(i => font(i.f)))];
    const h = Math.max(...l.parts.map(i => i.h));
    const text = l.parts.map(i => i.lead + i.s).join('').replace(/\s+/g, ' ').trim();
    const x = l.parts[0].x;
    const f0 = fonts[0];
    const isBody = h === 10 && /Gotham/.test(f0);
    const gap = prevY === null ? 0 : prevY - l.y;
    if (isBody) prevY = l.y;

    if (h <= 8 && /^\d+$/.test(text)) continue;                                   // page numbers
    if (/KGMissKindy/.test(f0) && h === 14) continue;                              // footer taglines
    if (/KGMissKindy/.test(f0) && h === 16) {                                      // chapter title
      if (!chapter || chapter.title !== text) { chapter = { title: text, sections: [] }; chapters.push(chapter); section = null; block = null; }
      continue;
    }
    if (/KGMissKindy/.test(f0) && h === 11) { newSection(text); continue; }        // section heading
    if (/KGMissKindy/.test(f0) && h === 12) { ensureSection(); section.blocks.push({ type: 'caption', text }); block = null; continue; }
    if (f0 === 'Gotham-Bold' && h === 12) continue;                                // duplicate form title
    if (/Calibri|Noteworthy|GoodVibrations/.test(f0)) {                           // pull quotes
      ensureSection();
      const isCite = /GoodVibrations/.test(f0) || h < 9;
      if (isCite) { if (quote) quote.cite = text; }
      else if (quote && !quote.cite) quote.text += ' ' + text;
      else { quote = { type: 'quote', text }; section.blocks.push(quote); }
      block = null;
      continue;
    }
    quote = null;
    if (fonts.length === 1 && f0 === 'Gotham-Bold') {                             // sub-heading
      ensureSection();
      section.blocks.push({ type: 'h3', text });
      block = null;
      continue;
    }
    // body text, keeping bold and italic runs
    let html = '';
    let run = null;
    for (const it of l.parts) {
      const kind = /Bold/.test(it.f) ? 'strong' : /Italic/.test(it.f) ? 'em' : null;
      if (kind !== run) { if (run) html += `</${run}>`; html += it.lead; it.lead = ''; if (kind) html += `<${kind}>`; run = kind; }
      html += it.lead + esc(it.s);
    }
    if (run) html += `</${run}>`;
    html = html.replace(/\s+/g, ' ').trim();
    const bullet = /^•/.test(text);
    if (bullet) html = html.replace(/^•\s*/, '');
    ensureSection();
    /* a short line that opens in bold after a break is a heading with a plain-text qualifier */
    if (!bullet && /Bold/.test(l.parts[0].f) && text.length < 70 && !/[.:]$/.test(text) && (gap === 0 || gap > 16.5)) {
      section.blocks.push({ type: 'h3', text, html });
      block = null;
      continue;
    }
    const continues = block && !bullet && gap > 0 && gap < 16.5 && !(block.type === 'ul' && x < block.indent - 2);
    const crossPage = block && gap === 0 && !bullet && !/[.!?:”)]$/.test(block.last);
    if (bullet) {
      if (!block || block.type !== 'ul' || gap > 18) { block = { type: 'ul', items: [], indent: x + 6 }; section.blocks.push(block); }
      block.items.push(html);
    } else if (continues || crossPage) {
      if (block.type === 'ul') block.items[block.items.length - 1] += ' ' + html;
      else block.html += ' ' + html;
    } else {
      block = { type: 'p', html };
      section.blocks.push(block);
    }
    block.last = text;
  }
}

// tidy: merge adjacent identical inline tags split across items
const tidy = s => s.replace(/<\/(strong|em)>\s*<\1>/g, ' ').replace(/ +([,.;:])/g, '$1').replace(/\s+/g, ' ').trim();
for (const c of chapters) for (const s of c.sections) for (const b of s.blocks) {
  if (b.html) b.html = tidy(b.html);
  if (b.items) b.items = b.items.map(tidy);
  delete b.last; delete b.indent;
}
fs.writeFileSync(process.argv[3], JSON.stringify(chapters, null, 1));
for (const c of chapters) console.log(c.title, '|', c.sections.map(s => s.title + ' (' + s.blocks.length + ')').join('; '));
