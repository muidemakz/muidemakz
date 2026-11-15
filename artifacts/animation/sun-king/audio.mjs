// Synthesises the video's sound from scratch, so there is nothing to license.
// Event times come from the T table in index.html, so picture and sound stay locked.
//   node audio.mjs <outDir>   writes sfx.wav and music.wav (48 kHz stereo, 16-bit)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(resolve(HERE, 'index.html'), 'utf8');
const T = Function('return ' + html.match(/const T=(\{[^}]+\})/)[1])();
const OUT = process.argv[2] || HERE;
const PACE = +html.match(/const PACE=([0-9.]+)/)[1];
const SR = 48000, N = Math.ceil(T.stop * PACE * SR);
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1;

const track = () => [new Float32Array(N), new Float32Array(N)];
const add = (tr, i, v, pan = 0) => { if (i < 0 || i >= N) return; tr[0][i] += v * Math.min(1, 1 - pan); tr[1][i] += v * Math.min(1, 1 + pan); };

/* ---------- sound effects ---------- */
const sfx = track();
function tone(t, f, dur, g, { to = f, pan = 0, h2 = 0 } = {}) {
  const n = dur * SR | 0; let ph = 0;
  for (let k = 0; k < n; k++) { const p = k / n, fr = f + (to - f) * p; ph += 2 * Math.PI * fr / SR;
    const env = Math.min(1, k / (.002 * SR)) * Math.pow(1 - p, 3);
    add(sfx, (t * PACE * SR | 0) + k, g * env * (Math.sin(ph) + h2 * Math.sin(2 * ph)), pan); }
}
function noise(t, dur, g, cut, { hp = 0, pan = 0 } = {}) {
  const n = dur * SR | 0; let lp = 0, lo = 0; const a = 1 - Math.exp(-2 * Math.PI * cut / SR), b = 1 - Math.exp(-2 * Math.PI * (hp || 1) / SR);
  for (let k = 0; k < n; k++) { const x = rnd(); lp += a * (x - lp); lo += b * (lp - lo); const env = Math.min(1, k / (.0015 * SR)) * Math.pow(1 - k / n, 4);
    add(sfx, (t * PACE * SR | 0) + k, g * env * (hp ? lp - lo : lp), pan); }
}
const key = (t, g = .13) => { noise(t, .022, g, 5200, { hp: 1400, pan: rnd() * .25 }); tone(t, 150 + rnd() * 25, .03, g * .55); };
const click = (t, g = .42) => { noise(t, .012, g, 7000, { hp: 2000 }); tone(t, 1900, .014, g * .55); tone(t + .05, 1250, .016, g * .4); };
const tick = (t, f, g = .13) => tone(t, f, .13, g, { h2: .25 });
const pop = (t, f = 520, g = .18) => tone(t, f * .7, .11, g, { to: f * 1.15 });
function thud(t, g = .8) { tone(t, 150, .42, g, { to: 42 }); noise(t, .09, g * .32, 2600); }
const chime = (t, fs, g = .13) => fs.forEach((f, i) => tone(t + i * .055, f, 1.1, g, { h2: .18, pan: (i - 1) * .2 }));

// typing the prompt
for (let t = T.claude + 1.5; t < T.claude + 4.7; t += .052 + (rnd() + 1) * .022) key(t);
click(T.work - .2);
// the skill's five stages
[587, 659, 784, 880, 988].forEach((f, i) => tick(T.work + .45 + i * .62, f));
// Figma pages
[2, 3.9, 6.4, 8].forEach((d, i) => pop(T.fig + d, 480 + i * 70));
// share
click(T.share + 2.2); chime(T.share + 2.27, [880, 1319], .1);
// Valideity
click(T.val + 3.1);
for (let i = 0; i < 10; i++) tick(T.val + 3.1 + .25 + .45 + i * .23 + .23, 523 * Math.pow(2, i / 14), .1);
thud(T.val + 6.1, .3); chime(T.val + 6.14, [659, 880], .08);
// redesign
for (let t = T.redo + .7; t < T.redo + 2.2; t += .05 + (rnd() + 1) * .018) key(t, .1);
click(T.redo + 2.9);
// score: count up, then the stamp
for (let i = 0; i < 10; i++) tick(T.score + 1 + 1.5 * (i + .5) / 10, 440 * Math.pow(2, i / 10), .1 + i * .008);
thud(T.score + 2.5, .85); noise(T.score + 2.5, .16, .22, 3200); chime(T.score + 2.56, [523, 784, 1047], .1);
// end card
[.15, .75, 1.35].forEach((d, i) => pop(T.end + d, 440 + i * 90, .17));
for (let i = 0; i < 6; i++) tick(T.end + 2 + i * .12, 523 * Math.pow(2, i / 8), .06);
chime(T.end + 2.9, [523, 659, 784, 1047], .11);

/* ---------- music bed ---------- */
const mus = track();
for (const k in T) T[k] *= PACE; // music runs in real seconds
const BEAT = .6, BAR = BEAT * 4;
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const CH = [[53, 60, 65, 69], [48, 55, 64, 72], [55, 62, 67, 71], [57, 60, 64, 69]]; // F  C  G  Am
const ramp = (t, a, b, x, y) => t <= a ? x : t >= b ? y : x + (y - x) * (t - a) / (b - a);
const level = t => t < 1.2 ? 0 : t < T.claude ? ramp(t, 1.2, T.claude, 0, .55) : t < T.val ? .72 : t < T.score ? .86 : t < T.end ? 1 : ramp(t, T.end + 1, T.stop - .1, 1, 0);
// kick sidechain, from Valideity onwards
const duck = t => { if (t < T.val) return 1; const ph = (t % BEAT) / BEAT; return .55 + .45 * Math.min(1, ph * 3.2); };
{ // pad
  const voices = []; for (let v = 0; v < 8; v++) voices.push({ ph: Math.random(), d: 1 + (v - 3.5) * .0016 });
  let l1 = 0, l2 = 0, r1 = 0, r2 = 0;
  for (let k = 0; k < N; k++) { const t = k / SR, lv = level(t); if (!lv) continue;
    const endHold = t >= T.end, bar = Math.floor(t / BAR), ch = endHold ? [48, 55, 64, 72] : CH[bar % 4];
    const cut = t < T.claude ? 260 + 300 * ramp(t, 1.2, T.claude, 0, 1) : t < T.val ? 620 : t < T.score ? 900 : ramp(t, T.score, T.score + 2.5, 900, 1900);
    const c = 1 - Math.exp(-2 * Math.PI * cut / SR); let L = 0, R = 0;
    voices.forEach((v, i) => { const m = ch[i % 4]; v.ph = (v.ph + hz(m) * v.d / SR) % 1; const s = v.ph * 2 - 1; if (i % 2) L += s; else R += s; });
    l1 += c * (L - l1); l2 += c * (l1 - l2); r1 += c * (R - r1); r2 += c * (r1 - r2);
    const g = .05 * lv * duck(t); mus[0][k] += l2 * g; mus[1][k] += r2 * g; }
}
function pluck(t, m, g, pan) { const n = .5 * SR | 0, f = hz(m); for (let k = 0; k < n; k++) { const x = k / SR, e = Math.exp(-x * 9) * Math.min(1, k / 60); add(mus, (t * SR | 0) + k, g * e * (Math.sin(2 * Math.PI * f * x) + .3 * Math.sin(4 * Math.PI * f * x)), pan); } }
function kick(t, g) { const n = .22 * SR | 0; let ph = 0; for (let k = 0; k < n; k++) { const p = k / n; ph += 2 * Math.PI * (48 + 90 * Math.pow(1 - p, 5)) / SR; add(mus, (t * SR | 0) + k, g * Math.pow(1 - p, 2.5) * Math.sin(ph)); } }
function hat(t, g) { const n = .035 * SR | 0; let lp = 0; for (let k = 0; k < n; k++) { const x = rnd(); lp += .35 * (x - lp); add(mus, (t * SR | 0) + k, g * Math.pow(1 - k / n, 3) * (x - lp), .15); } }
for (let t = 0, i = 0; t < T.end + .9; t += BEAT / 2, i++) {
  const bar = Math.floor(t / BAR), ch = CH[bar % 4], lv = level(t);
  if (t >= T.claude && t < T.end) pluck(t, ch[[3, 1, 2, 1, 3, 2, 1, 2][i % 8]] + 12, .05 * lv, i % 2 ? .35 : -.35);
  if (t >= T.fig && i % 2 === 1) hat(t, .05 * lv);
  if (t >= T.val && i % 2 === 0) kick(t, .3 * lv);
}
[60, 64, 67, 72].forEach((m, i) => pluck(T.score + 2.5 * PACE + i * .02, m + 12, .1, 0));
[60, 67, 72, 76].forEach((m, i) => pluck(T.end + 2.9 * PACE + i * .09, m + 12, .07, (i - 1.5) * .2));

/* ---------- write ---------- */
function wav(tr, path) {
  const b = Buffer.alloc(44 + N * 4); b.write('RIFF', 0); b.writeUInt32LE(36 + N * 4, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22); b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) for (let c = 0; c < 2; c++) { const v = Math.tanh(tr[c][i]) * 32000; b.writeInt16LE(v | 0, 44 + i * 4 + c * 2); }
  writeFileSync(path, b);
}
wav(sfx, resolve(OUT, 'sfx.wav')); wav(mus, resolve(OUT, 'music.wav'));
console.log('audio written', T.stop + 's');
