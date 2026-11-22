// Saves the extension's real panel markup as the landing page's UI pieces.
//   node tools/fragments.mjs [path-to-extension]   (default ../showdown-moves-helper, must be built)
// Writes assets/panel/<scenario>.html (the rendered #smh-panel inner HTML), assets/panel/panel.css
// (the extension's own stylesheet, scoped to .smh-sheet) and
// assets/panel/sprites/*.png (the Showdown sprites the pieces use, so the page never hotlinks them).
import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const run = promisify(execFile);

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, '..');
const ext = path.resolve(process.argv[2] || path.join(site, '..', 'showdown-moves-helper'));
const out = path.join(site, 'assets/panel');
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(existsSync);
if (!CHROME) throw new Error('Chrome not found');
if (!existsSync(path.join(ext, 'dist/content.js'))) throw new Error(`build the extension first (${ext})`);

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x').pathname;
  const file = u === '/fragments.html' ? path.join(here, 'fragments.html') : u.startsWith('/ext/') ? path.join(ext, u.slice(5)) : null;
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
await mkdir(path.join(out, 'sprites'), { recursive: true });

const sprites = new Set();
for (const s of ['main', 'rilla', 'boosts', 'mega', 'paste']) {
  // content.js appends the panel to <html>; the serialised DOM may put an empty <body> after it.
  // Headless Chrome now and then dumps before the panel renders or hangs, so try up to 3 times.
  let m = null;
  for (let attempt = 1; attempt <= 3 && !m; attempt++) {
    try {
      const { stdout } = await run(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--virtual-time-budget=8000', '--dump-dom', `${base}/fragments.html?s=${s}`], { maxBuffer: 1 << 26, timeout: 45000 });
      m = stdout.match(/<div id="smh-panel"[^>]*>([\s\S]*)<\/div>\s*(?:<body><\/body>)?\s*<\/html>/);
      if (m && !m[1].includes('smh-move')) m = null; // dumped before the moves arrived
    } catch (e) {
      console.warn(`scenario ${s}, attempt ${attempt}: ${e.killed ? 'timed out' : e.message}`);
    }
  }
  if (!m) throw new Error(`no panel in scenario ${s}`);
  // Point each sprite at a local copy; the fallback chain is the extension's, not the page's.
  const html = m[1]
    .replace(/ data-fallbacks="[^"]*"/g, '')
    // ids are the live panel's; a page holds several copies, so they go
    .replace(/ id="smh-[a-z]+"/g, '')
    .replace(/src="https:\/\/play\.pokemonshowdown\.com\/sprites\/home-centered\/([^"]+)"/g, (_, f) => (sprites.add(f), `src="assets/panel/sprites/${f}"`));
  await writeFile(path.join(out, `${s}.html`), html.trim() + '\n');
  console.log('wrote', `assets/panel/${s}.html`);
}
server.close();

for (const f of sprites) {
  const res = await fetch(`https://play.pokemonshowdown.com/sprites/home-centered/${f}`);
  if (!res.ok) throw new Error(`sprite ${f}: HTTP ${res.status}`);
  await writeFile(path.join(out, 'sprites', f), Buffer.from(await res.arrayBuffer()));
  console.log('wrote', `assets/panel/sprites/${f}`);
}

// The extension's stylesheet, scoped to .smh-sheet so the page can show several copies: no
// @font-face (its chrome-extension:// URLs only resolve inside the extension; the page loads the same
// Archivo), no docking rule for Showdown's <body>, and the page's Archivo name.
const css = (await readFile(path.join(ext, 'src/panel.css'), 'utf8'))
  .replace(/@font-face\s*\{[^}]*\}\s*/g, '')
  .replace(/html\.smh-docked body\s*\{[^}]*\}\s*/g, '')
  .replace(/#smh-panel/g, '.smh-sheet')
  .replace(/"SMH Archivo"/g, '"Archivo"');
await writeFile(path.join(out, 'panel.css'), `/* Copied from the extension by tools/fragments.mjs: do not edit here. */\n${css}`);
console.log('wrote assets/panel/panel.css');
