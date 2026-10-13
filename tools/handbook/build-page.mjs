// Writes the Parent Handbook into parent-handbook.html from handbook.json.
// Run from this folder: node build-page.mjs
// Everything between the HANDBOOK:START / HANDBOOK:END markers is regenerated; the rest of the page is untouched.
import fs from 'fs';

const PAGE = new URL('../../parent-handbook.html', import.meta.url);
const PDF = 'https://tendercarelc.org/wp-content/uploads/2023/03/29579-Tendercare-handbook-proof-1.pdf';
const START = '<!-- HANDBOOK:START -->', END = '<!-- HANDBOOK:END -->';

const chapters = JSON.parse(fs.readFileSync(new URL('./handbook.json', import.meta.url), 'utf8'));
const must = (ok, what) => { if (!ok) throw new Error(`handbook.json fix-up no longer applies: ${what}`); };

/* ---------- fix-ups the extractor can't make (each one fails loudly if the source text changes) ---------- */

// A bullet in "Support Staff Policy" runs over a page break and came out as list / paragraph / list.
{
  const blocks = chapters.find((c) => c.title === 'Enrollment and Attendance').sections[0].blocks;
  const i = blocks.findIndex((b) => b.type === 'p' && b.html.startsWith('history and child abuse clearances'));
  must(i > 0 && blocks[i - 1].type === 'ul' && blocks[i + 1]?.type === 'ul', 'support staff bullet split');
  const list = blocks[i - 1];
  must(/criminal$/.test(list.items.at(-1)), 'support staff bullet ending');
  list.items[list.items.length - 1] += ' ' + blocks[i].html;
  list.items.push(...blocks[i + 1].items);
  blocks.splice(i, 2);
}

// Words hyphenated at a PDF line end kept the line break as a space.
for (const word of ['self- concept', 'high- quality', 'non- refundable', 'one- time']) {
  let found = false;
  for (const c of chapters) for (const s of c.sections) for (const b of s.blocks) {
    const fix = (t) => (t.includes(word) ? ((found = true), t.split(word).join(word.replace('- ', '-'))) : t);
    if (b.html) b.html = fix(b.html);
    if (b.items) b.items = b.items.map(fix);
  }
  must(found, word);
}

/* ---------- helpers ---------- */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const slug = (s) => s.replace(/<[^>]+>/g, '').toLowerCase().replace(/[’']/g, '').replace(/&amp;/g, 'and')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const plain = (s) => s.replace(/<[^>]+>/g, '');
const used = new Set();
const uid = (base) => { let id = base, n = 2; while (used.has(id)) id = `${base}-${n++}`; used.add(id); return id; };
const ind = (n) => ' '.repeat(n);

/* ---------- the Parent Acknowledgement form ---------- */
function acknowledgement(blocks) {
  const lines = blocks.map((b) => b.html);
  const sigAt = lines.findIndex((l) => /Signature/.test(l));
  must(sigAt > 0 && /^Revised/.test(lines.at(-1)), 'acknowledgement layout');
  const blank = (cls) => `<span class="hb-blank${cls ? ' hb-blank--' + cls : ''}" aria-hidden="true"></span>`;
  const body = lines.slice(0, sigAt).reduce((t, l) => t + (t && !t.endsWith('/') ? ' ' : '') + l, '')
    .replace(/_{3,}/g, () => blank('name'));
  const rows = lines.slice(sigAt, -1).map((l) => {
    const [label, date] = l.split(/_{3,}/).map((s) => s.trim()).filter(Boolean);
    must(label && date === 'Date', 'signature row');
    return `${ind(10)}<div class="hb-sign__row">
${ind(12)}<span class="hb-sign__field"><span class="hb-sign__label">${label}</span>${blank()}</span>
${ind(12)}<span class="hb-sign__field hb-sign__field--date"><span class="hb-sign__label">${date}</span>${blank()}</span>
${ind(10)}</div>`;
  });
  return `${ind(8)}<div class="hb-part hb-form">
${ind(10)}<p class="hb-form__text">${body}</p>
${rows.join('\n')}
${ind(10)}<p class="hb-form__rev">${lines.at(-1)}</p>
${ind(10)}<button class="btn btn--ghost btn--sm hb-form__print" type="button" data-hb-print-form>Print this form <i class="fa-solid fa-print"></i></button>
${ind(8)}</div>`;
}

/* ---------- blocks ---------- */
function block(b) {
  switch (b.type) {
    case 'p': return `${ind(10)}<p>${b.html}</p>`;
    case 'ul': return `${ind(10)}<ul>\n${b.items.map((i) => `${ind(12)}<li>${i}</li>`).join('\n')}\n${ind(10)}</ul>`;
    case 'quote': return `${ind(10)}<blockquote class="hb-quote">
${ind(12)}<p>${esc(b.text)}</p>${b.cite ? `\n${ind(12)}<cite>${esc(b.cite)}</cite>` : ''}
${ind(10)}</blockquote>`;
    case 'caption': return `${ind(10)}<figure class="hb-mascot">
${ind(12)}<img src="assets/bear.svg" alt="" width="255" height="433" loading="lazy">
${ind(12)}<figcaption>${esc(b.text)}</figcaption>
${ind(10)}</figure>`;
    default: throw new Error('unknown block ' + b.type);
  }
}

/* ---------- chapters + table of contents ---------- */
const toc = [];
const body = chapters.map((c, n) => {
  const id = uid(slug(c.title));
  const entry = { id, title: c.title, subs: [] };
  toc.push(entry);
  const parts = [];
  let part = null;
  const open = (heading) => { part = { heading, blocks: [] }; parts.push(part); };

  if (c.title === 'Parent Acknowledgement') {
    parts.push({ raw: acknowledgement(c.sections[0].blocks) });
  } else {
    for (const s of c.sections) {
      if (s.title && s.title !== c.title) open(s.title);
      for (const b of s.blocks) {
        if (b.type === 'h3') { open(b.html || esc(b.text)); continue; }
        if (!part) open(null);
        part.blocks.push(b);
      }
    }
  }

  const html = parts.map((p) => {
    if (p.raw) return p.raw;
    let head = '';
    if (p.heading) {
      const sid = uid(`${id}--${slug(p.heading)}`);
      entry.subs.push({ id: sid, title: plain(p.heading) });
      head = `${ind(10)}<h3 id="${sid}">${p.heading}</h3>\n`;
    }
    return `${ind(8)}<div class="hb-part">\n${head}${p.blocks.map(block).join('\n')}\n${ind(8)}</div>`;
  }).join('\n');

  return `${ind(6)}<section class="hb-ch" id="${id}" aria-labelledby="${id}-title">
${ind(8)}<header class="hb-ch__head">
${ind(10)}<span class="hb-ch__num">Chapter ${n + 1}</span>
${ind(10)}<h2 id="${id}-title">${esc(c.title)}</h2>
${ind(8)}</header>
${html}
${ind(6)}</section>`;
}).join('\n\n');

const tocHtml = toc.map((c, n) => {
  const subs = c.subs.length ? `\n${ind(14)}<ol class="hb-toc__subs">\n${c.subs.map((s) =>
    `${ind(16)}<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join('\n')}\n${ind(14)}</ol>` : '';
  return `${ind(12)}<li class="hb-toc__ch">
${ind(14)}<a class="hb-toc__link" href="#${c.id}"><span>${n + 1}</span>${esc(c.title)}</a>${subs}
${ind(12)}</li>`;
}).join('\n');

const section = `${START}
  <!-- ============================ HANDBOOK (generated by tools/handbook/build-page.mjs) ============================ -->
  <section class="section hb-sec">
    <div class="shell">
      <div class="hb-bar">
        <p class="hb-bar__meta"><i class="fa-solid fa-book-open" aria-hidden="true"></i> ${chapters.length} chapters</p>
        <div class="hb-bar__actions">
          <a class="btn btn--rose btn--sm" href="${PDF}" download>Download PDF <i class="fa-solid fa-download"></i></a>
          <button class="btn btn--ghost btn--sm" type="button" data-hb-print>Print <i class="fa-solid fa-print"></i></button>
        </div>
      </div>

      <div class="hb" id="handbook">
        <aside class="hb-side">
          <div class="hb-side__tools">
            <button class="hb-side__toggle" type="button" aria-expanded="false" aria-controls="hb-toc">
              <i class="fa-solid fa-list" aria-hidden="true"></i> <span>Chapters</span> <i class="fa-solid fa-chevron-down hb-side__chev" aria-hidden="true"></i>
            </button>
            <label class="hb-search">
              <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <span class="hb-sr">Search the handbook</span>
              <input type="search" id="hb-q" placeholder="Search the handbook" autocomplete="off">
              <button type="button" class="hb-search__clear" aria-label="Clear search" hidden><i class="fa-solid fa-xmark"></i></button>
            </label>
          </div>
          <p class="hb-status" id="hb-status" role="status" aria-live="polite"></p>
          <nav class="hb-toc" id="hb-toc" aria-label="Handbook chapters">
            <ol>
${tocHtml}
            </ol>
          </nav>
        </aside>

        <article class="hb-doc">
${body}
          <p class="hb-empty" id="hb-empty" hidden>No sections match your search. Try another word, or <button type="button" data-hb-clear>clear the search</button>.</p>
        </article>
      </div>
    </div>
  </section>
${END}`;

let page = fs.readFileSync(PAGE, 'utf8');
const crlf = page.includes('\r\n');
page = page.replace(/\r\n/g, '\n');
const a = page.indexOf(START), b = page.indexOf(END);
must(a > -1 && b > a, 'HANDBOOK markers in parent-handbook.html');
page = page.slice(0, a) + section + page.slice(b + END.length);
fs.writeFileSync(PAGE, crlf ? page.replace(/\n/g, '\r\n') : page);
console.log(`wrote ${chapters.length} chapters, ${toc.reduce((n, c) => n + c.subs.length, 0)} sub-headings`);
