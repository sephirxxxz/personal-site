import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const index = read('src/pages/index.astro');
const html = read('dist/index.html');
const preview = read('dist/prototypes/full-layout/reader/index.html');
const readerStyles = read('src/prototypes/full-layout/reader-polish.css');
const motion = read('src/prototypes/full-layout/interactions.ts');
const relationshipBooks = read('src/data/relationship-books.ts');
let checks = 0;
const check = (name, fn) => { fn(); checks++; };

check('production reader entry', () => assert.match(index, /<Layout direction="reader" production/));
check('reader palette', () => {
  assert.match(readerStyles, /--paper:#dceef8;/);
  assert.match(readerStyles, /--ink:#56616b;/);
  assert.match(readerStyles, /--button:#f3e7d5;/);
});
for (const pattern of [/rel="canonical"/, /property="og:title"/, /name="twitter:card"/, /name="description"/, /data-production/, /data-chapter-range/, /id="main-content"/]) {
  check(String(pattern), () => assert.match(html, pattern));
}
check('indexable homepage', () => assert.doesNotMatch(html, /name="robots" content="noindex"/));
check('non-indexed preview', () => assert.match(preview, /name="robots" content="noindex"/));
for (const id of ['about','focus','featured-books','more-books','relationship-books','thinking','likes','contact']) {
  check('remaining section ' + id, () => assert.match(html, new RegExp('id="' + id + '"')));
}
for (const id of ['doing','startups','workflow','internship']) {
  check('removed section and entry ' + id, () => {
    assert.doesNotMatch(html, new RegExp('(?:id="' + id + '"|href="#' + id + '")'));
  });
}
check('removed English capability', () => assert.doesNotMatch(html, /English as a working language|英文播客、阅读技术文档和研究材料/));
check('no vector separator lines', () => assert.doesNotMatch(html, /<svg/));
check('chapter slider without beige center or percentage', () => {
  assert.match(html, /type="range" min="0" max="8" step="1"/);
  assert.doesNotMatch(html, /data-percent|data-open-index/);
  assert.match(readerStyles, /top:61\.8%/);
});
check('keyboard focus retained', () => assert.match(readerStyles, /--focus:#285f86;/));
check('glass navigation', () => assert.match(readerStyles, /backdrop-filter:blur\(8px\)/));
check('pointer rainbow', () => {
  assert.match(html, /glass-rainbow/);
  assert.match(read('src/prototypes/full-layout/reader-glass.ts'), /pointerdown/);
});
check('reduced motion', () => assert.match(readerStyles, /prefers-reduced-motion:reduce/));
check('pointer-safe hover', () => assert.match(readerStyles, /\(hover:hover\) and \(pointer:fine\)/));
check('active section semantics', () => assert.match(motion, /aria-current/));
check('native modal', () => assert.match(html, /<dialog/));
check('no prototype keyboard interception in production', () => assert.match(motion, /!document.body.hasAttribute\('data-production'\)/));
for (const kind of ['gpu','memory','tennis','f1']) {
  check('material asset ' + kind, () => {
    assert.match(html, new RegExp('/prototypes/objects/' + kind + '\\.webp'));
    assert.ok(fs.existsSync(path.join(root, 'public/prototypes/objects', kind + '.webp')));
  });
}
check('all relationship books covered and read', () => {
  assert.equal((relationshipBooks.match(/cover:\s*['"]/g) ?? []).length, 10);
  assert.equal((relationshipBooks.match(/status:\s*['"]read['"]/g) ?? []).length, 10);
  assert.doesNotMatch(relationshipBooks, /status:\s*['"]reading['"]|status:\s*['"]to-read['"]/);
});
check('no stale spelling', () => assert.doesNotMatch(html, /Cloud Code|var\(--text-secondary\)|hand-circle/));
for (const file of ['public/robots.txt','public/sitemap.xml','src/pages/404.astro']) {
  check(file, () => assert.ok(fs.existsSync(path.join(root, file))));
}
console.log(`Site contracts passed (${checks} checks).`);
