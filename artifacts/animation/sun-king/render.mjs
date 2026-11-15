// Frame-by-frame renderer for the Sun King motion video. No npm dependencies.
//   node render.mjs --w 1080 --h 1350 --dsf 0.5 --fps 15 --out <dir>
//   node render.mjs --stills 2.9,3.4,6.5 --out <dir>
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const W = +arg('w', 1080), H = +arg('h', 1350), DSF = +arg('dsf', 0.5), FPS = +arg('fps', 15);
const FROM = +arg('from', 0), TO = arg('to', null);
const OUT = resolve(arg('out', 'out')); const STILLS = arg('stills', null);
mkdirSync(OUT, { recursive: true });
const HERE = dirname(fileURLToPath(import.meta.url));
const SHELL = process.env.LOCALAPPDATA + '/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe';
const PORT = 9300 + Math.floor(Math.random() * 500);
const proc = spawn(SHELL, [`--remote-debugging-port=${PORT}`, '--allow-file-access-from-files', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${OUT}/.profile`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

let page; for (let i = 0; i < 40 && !page; i++) { await sleep(250); try { page = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find(t => t.type === 'page'); } catch {} }
const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => { const m = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (m.result?.exceptionDetails) throw new Error(JSON.stringify(m.result.exceptionDetails).slice(0, 800)); return m.result?.result?.value; };

await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DSF, mobile: false });
const url = pathToFileURL(resolve(HERE, 'index.html')).href + `?w=${W}&h=${H}&fps=${FPS}&src=${arg('src', 15)}`;
await send('Page.navigate', { url }); await sleep(800);
for (let i = 0; i < 60; i++) { if (await ev('document.readyState') === 'complete') break; await sleep(250); }
await ev('window.ready');
const dur = await ev('window.DURATION');
const grab = async (t, name) => { await ev(`seek(${t})`); const m = await send('Page.captureScreenshot', { format: 'jpeg', quality: +arg('q', 90) }); writeFileSync(`${OUT}/${name}.jpg`, Buffer.from(m.result.data, 'base64')); };

try {
  if (STILLS) { for (const t of STILLS.split(',').map(Number)) await grab(t, 't' + String(t.toFixed(2)).padStart(6, '0')); }
  else { const n = Math.round(dur * FPS); const t0 = Date.now(); for (let f = Math.round(FROM * FPS); f < (TO ? Math.round(+TO * FPS) : n); f++) { await grab(f / FPS, String(f + 1).padStart(5, '0')); if (f % 150 === 0) console.log(f, '/', n, Math.round((Date.now() - t0) / 1000) + 's'); } console.log('done', n); }
} finally { ws.close(); proc.kill(); }
process.exit(0);
