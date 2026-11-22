// Builds index.html from index.src.html, pasting in the extension's real panel markup.
//   node tools/page.mjs
// In the source, <!-- panel:<scenario>:<part> --> is replaced by that part of assets/panel/<scenario>.html
// (written by tools/fragments.mjs). Parts: all (the whole panel), top (its header and target strip),
// target (the target strip), card0 / card1 (an opposing Pokémon's card).
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// the balanced <div …>…</div> starting at index i
function divAt(html, i) {
  const re = /<div\b|<\/div>/g;
  re.lastIndex = i;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return html.slice(i, m.index + 6);
  }
  throw new Error('unbalanced div');
}
const block = (html, cls, n = 0) => {
  let i = -1;
  for (let k = 0; k <= n; k++) {
    i = html.indexOf(`<div class="${cls}"`, i + 1);
    if (i < 0) throw new Error(`no .${cls} #${n}`);
  }
  return divAt(html, i);
};

const cache = new Map();
const fragment = (s) => {
  if (!cache.has(s)) cache.set(s, readFileSync(path.join(site, 'assets/panel', `${s}.html`), 'utf8').trim());
  return cache.get(s);
};
const parts = {
  all: (h) => h,
  top: (h) => block(h, 'smh-header') + '\n' + block(h, 'smh-target'),
  target: (h) => block(h, 'smh-target'),
  card0: (h) => block(h, 'smh-card', 0),
  card1: (h) => block(h, 'smh-card', 1),
};

let missing = 0;
const out = readFileSync(path.join(site, 'index.src.html'), 'utf8')
  .replace(/^[ \t]*<!-- page\.mjs:[\s\S]*?-->\n/m, '<!-- Built by tools/page.mjs from index.src.html: edit that file, then run node tools/page.mjs. -->\n')
  .replace(/<!-- panel:(\w+):(\w+) -->/g, (all, s, p) => {
    if (!parts[p]) return (missing++, all);
    // the sprites at their shown size (the panel's CSS), loaded as they come near the screen
    return parts[p](fragment(s))
      .replace(/<img class="smh-tsprite"/g, '<img class="smh-tsprite" width="36" height="36" loading="lazy"')
      .replace(/<img class="smh-sprite"/g, '<img class="smh-sprite" width="44" height="44" loading="lazy"');
  });
if (missing) throw new Error(`${missing} unknown panel part(s)`);
writeFileSync(path.join(site, 'index.html'), out);
console.log('wrote index.html');
