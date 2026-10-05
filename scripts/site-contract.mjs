import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');
const relationshipBooks = fs.readFileSync(path.join(root, 'src/data/relationship-books.ts'), 'utf8');
const motion = fs.readFileSync(path.join(root, 'src/scripts/reading-progress.ts'), 'utf8');
const source = `${index}\n${styles}\n${motion}`;
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const sourceContracts = [
  ['canonical URL', /rel="canonical"/],
  ['Open Graph metadata', /property="og:title"/],
  ['Twitter card metadata', /name="twitter:card"/],
  ['GitHub project evidence link', /github\.com\/sephirxxxz\/finance-expert-team/],
  ['AI Mapper evidence link', /github\.com\/sephirxxxz\/ai-mapper-agent/],
  ['relationship reading section', /id="relationship-books"/],
  ['internship operating system section', /id="internship"/],
  ['relationship progress link', /href="#relationship-books"/],
  ['internship progress link', /href="#internship"/],
  ['public internship advice', /实习工作系统/],
  ['English working capability', /English as a working language/],
  ['English information fluency', /英文播客、阅读技术文档和研究材料/],
  ['baby blue site background', /--paper:\s*#dceef8;/],
  ['warm beige buttons', /--button:\s*#f3e7d5;/],
  ['blue accent palette', /--accent-blue:\s*#477b9d;/],
  ['glass navigation', /backdrop-filter:\s*blur\(16px\)/],
  ['reading progress semantics', /role="progressbar"/],
  ['active section semantics', /aria-current/],
  ['reduced motion navigation', /reducedMotion\.matches \? 'instant' : 'smooth'/],
  ['native keyboard navigation', /event\.detail === 0/],
  ['touch-safe hover', /@media \(hover: hover\) and \(pointer: fine\)/],
  ['correct Claude Code spelling', /Claude Code/],
  ['muted contact color token', /color: var\(--muted\)/],
];

for (const [name, pattern] of sourceContracts) {
  assert.match(source, pattern, `${name} is missing`);
}

assert.doesNotMatch(index, /Cloud Code/, 'stale “Cloud Code” wording remains');
assert.doesNotMatch(index, /var\(--text-secondary\)/, 'undefined contact color token remains');
assert.doesNotMatch(index, /第一份实习直接进了FA 交易现场/, 'FA internship sentence should be removed');
assert.doesNotMatch(index, /hand-circle/, 'hand-drawn circle markup remains');
assert.doesNotMatch(styles, /hand-circle/, 'hand-drawn circle styling remains');
assert.doesNotMatch(styles, /#db2777|#ea580c|#16a34a|#2563eb/, 'legacy accent colors remain');
assert.match(relationshipBooks, /cover:\s*['\"][^'\"]+['\"]/,'relationship book cover metadata is missing');
assert.equal((relationshipBooks.match(/cover:\s*['\"]/g) ?? []).length, 10, 'every relationship book needs a cover');
assert.equal((relationshipBooks.match(/status:\s*['"]read['"]/g) ?? []).length, 10, 'all relationship books should be marked read');
assert.doesNotMatch(relationshipBooks, /status:\s*['"]reading['"]|status:\s*['"]to-read['"]/, 'unread relationship book status remains');
assert.match(styles, /\.tag\s*\{[\s\S]*white-space:\s*nowrap;/, 'mobile tag wrapping contract is missing');
assert.match(styles, /\.hero-intro\s*\{[\s\S]*min-width:\s*0;/, 'mobile hero grid min-width contract is missing');
assert.equal(packageJson.scripts['test:site'], 'node scripts/site-contract.mjs');

for (const file of ['public/robots.txt', 'public/sitemap.xml', 'src/pages/404.astro']) {
  assert.ok(fs.existsSync(path.join(root, file)), `${file} is missing`);
}

console.log(`Site contracts passed (${sourceContracts.length + 4} checks).`);
