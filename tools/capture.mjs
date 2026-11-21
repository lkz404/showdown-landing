// Captures real UI of the extension for the landing page.
//   node tools/capture.mjs [path-to-extension]   (default ../showdown-moves-helper, must be built)
import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const run = promisify(execFile);
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, '..');
const ext = path.resolve(process.argv[2] || path.join(site, '..', 'showdown-moves-helper'));
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find(existsSync);
if (!CHROME) throw new Error('Chrome not found');
if (!existsSync(path.join(ext, 'dist/content.js'))) throw new Error(`build the extension first (${ext})`);

// The popup talks to chrome.storage; give it a pasted team to show.
const POPUP_STUB = `<script>window.chrome={storage:{local:{get:(k,cb)=>cb({smh_paste:{link:'https://pokepast.es/example',sets:['Flutter Mane','Incineroar','Rillaboom','Urshifu-Rapid-Strike','Amoonguss','Landorus-Therian'].map((species)=>({species}))}}),set:()=>Promise.resolve(),remove:()=>Promise.resolve()}}};</script>`;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x').pathname;
  const file = u === '/harness.html' ? path.join(here, 'harness.html') : u.startsWith('/ext/') ? path.join(ext, u.slice(5)) : null;
  try {
    if (u === '/popup.html') {
      const html = (await readFile(path.join(ext, 'dist/popup.html'), 'utf8')).replace('<script src="popup.js">', `${POPUP_STUB}<script src="/ext/dist/popup.js">`);
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(html);
    }
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
await mkdir(path.join(site, 'assets/shots'), { recursive: true });

async function shot(name, url, w, h) {
  await run(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2',
    `--window-size=${w},${h}`, '--virtual-time-budget=6000', `--screenshot=${path.join(site, 'assets/shots', name)}`, url]);
  console.log('wrote', name);
}
await shot('panel-one.png', `${base}/harness.html`, 360, 700);
await shot('popup.png', `${base}/popup.html`, 320, 360);
server.close();
