import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');
const source = `${index}\n${styles}`;
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const sourceContracts = [
  ['canonical URL', /rel="canonical"/],
  ['Open Graph metadata', /property="og:title"/],
  ['Twitter card metadata', /name="twitter:card"/],
  ['GitHub project evidence link', /github\.com\/sephirxxxz\/finance-expert-team/],
  ['AI Mapper evidence link', /github\.com\/sephirxxxz\/ai-mapper-agent/],
  ['correct Claude Code spelling', /Claude Code/],
  ['muted contact color token', /color: var\(--muted\)/],
];

for (const [name, pattern] of sourceContracts) {
  assert.match(source, pattern, `${name} is missing`);
}

assert.doesNotMatch(index, /Cloud Code/, 'stale “Cloud Code” wording remains');
assert.doesNotMatch(index, /var\(--text-secondary\)/, 'undefined contact color token remains');
assert.match(styles, /\.tag\s*\{[\s\S]*white-space:\s*nowrap;/, 'mobile tag wrapping contract is missing');
assert.match(styles, /\.hero-intro\s*\{[\s\S]*min-width:\s*0;/, 'mobile hero grid min-width contract is missing');
assert.equal(packageJson.scripts['test:site'], 'node scripts/site-contract.mjs');

for (const file of ['public/robots.txt', 'public/sitemap.xml', 'src/pages/404.astro']) {
  assert.ok(fs.existsSync(path.join(root, file)), `${file} is missing`);
}

console.log(`Site contracts passed (${sourceContracts.length + 4} checks).`);
