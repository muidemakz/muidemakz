// Three upbeat music beds, generated from scratch so there is nothing to license.
// Every option is locked to the video: a bar downbeat lands exactly on the stamp.
//   node music-options.mjs <outDir>   writes music-a.wav, music-b.wav, music-c.wav
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(resolve(HERE, 'index.html'), 'utf8');
const T0 = Function('return ' + html.match(/const T=(\{[^}]+\})/)[1])();
const PACE = +html.match(/const PACE=([0-9.]+)/)[1];
const T = {}; for (const k in T0) T[k] = T0[k] * PACE;
const OUT = process.argv[2] || HERE, SR = 48000, N = Math.ceil(T.stop * SR);
const STAMP = (T0.score + 2.5) * PACE;
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const mod = (a, b) => ((a % b) + b) % b;
const ramp = (t, a, b, x, y) => t <= a ? x : t >= b ? y : x + (y - x) * (t - a) / (b - a);
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1;

function build(o) {
  const L = new Float32Array(N), R = new Float32Array(N);
  const beat = 60 / o.bpm, step = beat / 4, bar = beat * 4, build0 = STAMP - bar;
  const add = (i, v, pan = 0) => { if (i < 0 || i >= N) return; L[i] += v * Math.min(1, 1 - pan); R[i] += v * Math.min(1, 1 + pan); };
  const lvl = t => t < 1.4 ? 0 : t < T.claude ? ramp(t, 1.4, T.claude, 0, .5) : t < T.fig ? .65 : t < T.val ? .8 : t < T.end ? 1 : ramp(t, T.end + 1.5, T.stop - .2, 1, 0);
  const full = t => t >= T.val && !(t >= build0 && t < STAMP) && t < T.end + 1.5;
  const light = t => t >= T.fig && t < T.end + 1.5;
  const chordAt = t => o.prog[mod(Math.floor((t - STAMP) / bar), o.prog.length)];

  const kick = (t, g) => { const n = .2 * SR | 0; let ph = 0; for (let k = 0; k < n; k++) { const p = k / n; ph += 2 * Math.PI * (50 + 110 * Math.pow(1 - p, 6)) / SR; add((t * SR | 0) + k, g * Math.pow(1 - p, 2.2) * Math.tanh(1.6 * Math.sin(ph))); } };
  const clap = (t, g) => { const n = .13 * SR | 0; let a = 0, b = 0; for (let k = 0; k < n; k++) { const x = rnd(); a += .5 * (x - a); b += .08 * (a - b); const e = Math.pow(1 - k / n, 4) * (k < 400 ? (k % 130 < 60 ? 1 : .35) : 1); add((t * SR | 0) + k, g * e * (a - b)); } };
  const hat = (t, g, len = .035, pan = .15) => { const n = len * SR | 0; let a = 0; for (let k = 0; k < n; k++) { const x = rnd(); a += .4 * (x - a); add((t * SR | 0) + k, g * Math.pow(1 - k / n, 3) * (x - a), pan); } };
  const shaker = (t, g) => hat(t, g, .05, -.2);
  const rim = (t, g) => { const n = .035 * SR | 0; for (let k = 0; k < n; k++) { const x = k / SR, e = Math.pow(1 - k / n, 5); add((t * SR | 0) + k, g * e * (Math.sin(2 * Math.PI * 1700 * x) + .6 * Math.sin(2 * Math.PI * 820 * x)), .25); } };
  const pluck = (t, m, g, pan = 0, dec = 9, bright = .3) => { const n = Math.min(.7, 5 / dec) * SR | 0, f = hz(m); for (let k = 0; k < n; k++) { const x = k / SR, e = Math.exp(-x * dec) * Math.min(1, k / 50); add((t * SR | 0) + k, g * e * (Math.sin(2 * Math.PI * f * x) + bright * Math.sin(4 * Math.PI * f * x) + bright * .35 * Math.sin(6 * Math.PI * f * x)), pan); } };
  const bass = (t, m, len, g, glide = 1) => { const n = len * SR | 0; let ph = 0; for (let k = 0; k < n; k++) { const p = k / n; ph += 2 * Math.PI * hz(m) * (1 + (glide - 1) * Math.pow(1 - p, 8)) / SR; add((t * SR | 0) + k, g * Math.min(1, k / 80) * Math.pow(1 - p, 1.4) * Math.tanh(1.8 * Math.sin(ph))); } };
  const riser = (t0, t1, g) => { let a = 0; const i0 = t0 * SR | 0, i1 = t1 * SR | 0; for (let i = i0; i < i1; i++) { const p = (i - i0) / (i1 - i0), c = .02 + .35 * p * p; const x = rnd(); a += c * (x - a); add(i, g * p * p * (x - a) * 1.6, Math.sin(p * 9) * .4); } };

  // sustained chords
  const vs = []; for (let v = 0; v < 8; v++) vs.push({ ph: v * .13, d: 1 + (v - 3.5) * .0018 });
  let l1 = 0, l2 = 0, r1 = 0, r2 = 0;
  for (let k = 0; k < N; k++) {
    const t = k / SR, lv = lvl(t); if (!lv) continue;
    const ch = t >= T.end ? o.prog[0] : chordAt(t);
    const cut = t < T.claude ? ramp(t, 1.4, T.claude, 300, 700) : t < T.val ? o.cut : t < build0 ? o.cut * 1.5 : t < STAMP ? ramp(t, build0, STAMP, o.cut * 1.3, o.cut * 3) : t < T.end ? o.cut * 2.4 : o.cut * 1.6;
    const c = 1 - Math.exp(-2 * Math.PI * cut / SR); let a = 0, b = 0;
    vs.forEach((v, i) => { v.ph = (v.ph + hz(ch.n[i % 4]) * v.d / SR) % 1; const s = v.ph * 2 - 1; if (i % 2) a += s; else b += s; });
    l1 += c * (a - l1); l2 += c * (l1 - l2); r1 += c * (b - r1); r2 += c * (r1 - r2);
    const insert = !!o.insert?.(t);
    const ph = mod(t - STAMP, beat) / beat, pump = t >= T.val && (o.pump || insert) ? .45 + .55 * Math.min(1, ph * 2.6) : 1;
    const gate = (o.gate && t >= T.fig) || insert ? ([1, 0, 1, 1, 0, 1, 0, 1][mod(Math.floor((t - STAMP) / (step * 2)), 8)] ? 1 : .22) : 1;
    const g = (insert ? o.insertPad : o.pad) * lv * pump * gate; L[k] += l2 * g; R[k] += r2 * g;
  }
  // the pattern, one sixteenth at a time
  const first = -Math.ceil(STAMP / step), last = Math.ceil((T.stop - STAMP) / step);
  for (let i = first; i < last; i++) {
    const t = STAMP + i * step; if (t < 0) continue;
    const lv = lvl(t); if (!lv) continue;
    o.step({ t, s: mod(i, 16), i, lv, full: full(t), light: light(t), notes: chordAt(t).n, root: chordAt(t).r, step, kick, clap, hat, shaker, rim, pluck, bass });
  }
  riser(build0, STAMP, o.riser);
  // on the stamp: a hit, then a resolving flourish on the end card
  kick(STAMP, .7); clap(STAMP, .5); o.prog[0].n.forEach((m, i) => pluck(STAMP + i * .012, m + 12, .1, (i - 1.5) * .25, 5, .4));
  o.prog[0].n.forEach((m, i) => pluck(T.end + 2.9 * PACE + i * .09, m + 12, .08, (i - 1.5) * .2, 4, .35));
  return [L, R];
}
const CH = (n, r) => ({ n, r });
const OPTIONS = {
  // A: bright pop-house, four on the floor
  a: { bpm: 122, cut: 1100, pad: .036, pump: true, riser: .16,
    prog: [CH([48, 55, 64, 72], 36), CH([43, 55, 62, 71], 43), CH([45, 57, 64, 72], 45), CH([41, 57, 65, 72], 41)],
    step: ({ t, s, lv, full, light, notes, root, step, kick, clap, hat, pluck, bass }) => {
      pluck(t, notes[[3, 2, 1, 2][s % 4]] + 12, (s % 4 === 0 ? .075 : .05) * lv, s % 8 < 4 ? -.35 : .35, 11, .4);
      if (full && s % 4 === 0) kick(t, .42 * lv);
      if (full && (s === 4 || s === 12)) clap(t, .3 * lv);
      if (light && s % 4 === 2) hat(t, .12 * lv, .07);
      if (light && s % 2 === 0 && s % 4 !== 2) hat(t, .05 * lv);
      if (light && s % 4 === 2) bass(t, root, step * 1.6, .17 * lv);
    } },
  // B: Afrobeats-leaning groove, log drum and shaker
  b: { bpm: 106, cut: 1000, pad: .026, pump: false, riser: .12,
    prog: [CH([53, 60, 65, 69], 41), CH([50, 57, 65, 69], 38), CH([46, 58, 62, 65], 34), CH([48, 55, 64, 67], 36)],
    step: ({ t, s, lv, full, light, notes, root, step, kick, clap, shaker, rim, pluck, bass }) => {
      if ([0, 3, 6, 10, 11, 14].includes(s)) pluck(t, notes[[3, 2, 3, 1, 2, 3][[0, 3, 6, 10, 11, 14].indexOf(s)]] + 12, .085 * lv, s % 2 ? .3 : -.3, 15, .55);
      if (light) shaker(t, (s % 4 === 2 ? .12 : .06) * lv);
      if (light && [3, 6, 11, 14].includes(s)) rim(t, .09 * lv);
      if (full && [0, 6, 8, 14].includes(s)) kick(t, .38 * lv);
      if (full && (s === 4 || s === 12)) clap(t, .22 * lv);
      if (light && [0, 3, 6, 10, 12].includes(s)) bass(t, root + 12 * (s === 10 ? 1 : 0), step * 2.4, .27 * lv, 1.6);
    } },
  // C: driving electronic, rolling bass and chord stabs
  c: { bpm: 128, cut: 1500, pad: .034, pump: true, gate: true, riser: .2,
    prog: [CH([45, 57, 64, 72], 33), CH([41, 57, 65, 72], 29), CH([48, 55, 64, 72], 36), CH([43, 55, 62, 71], 31)],
    step: ({ t, s, lv, full, light, notes, root, step, kick, clap, hat, pluck, bass }) => {
      if (s % 16 === 0 || s === 6 || s === 10) pluck(t, notes[3] + 12, .07 * lv, s === 6 ? -.3 : .3, 7, .5);
      if (full && s % 4 === 0) kick(t, .44 * lv);
      if (full && (s === 4 || s === 12)) clap(t, .3 * lv);
      if (light) hat(t, (s % 4 === 2 ? .11 : .035) * lv, s % 4 === 2 ? .08 : .03);
      if (light && s % 4 !== 0) bass(t, root + 12 + (s % 8 === 7 ? 12 : 0), step * .9, .15 * lv);
    } },
};
// Chosen mix: B's groove throughout, with C's rolling bass, stabs and four-on-the-floor kick
// for the shopper study and the bar before the stamp. One tempo and one set of chords,
// so the changes stay on a bar line instead of jumping between two songs.
const BPM_M = 106, BAR_M = 60 / BPM_M * 4, BEAT_M = 60 / BPM_M;
const snap = t => STAMP + Math.round((t - STAMP) / BAR_M) * BAR_M;
const C_A = snap(T.val), C_B = snap(T.redo), C_BUILD = STAMP - BAR_M;
const inC = t => (t >= C_A && t < C_B) || (t >= C_BUILD && t < STAMP);
OPTIONS.mix = { ...OPTIONS.b, insert: inC, insertPad: .04, riser: .14,
  step: a => {
    const { t, s, lv, full, notes, root, step, kick, clap, hat, rim, pluck, bass } = a;
    if (!inC(t)) {
      OPTIONS.b.step(a);
      // a short fill leads into the study, and one clap hands back to the groove
      if (t >= C_A - BEAT_M && t < C_A - 1e-6) rim(t, .1 * lv);
      if (Math.abs(t - (C_B + 0)) < 1e-6) clap(t, .22 * lv);
      return;
    }
    if (s === 0 || s === 6 || s === 10) pluck(t, notes[3] + 12, .085 * lv, s === 6 ? -.3 : .3, 7, .5);
    if (full && s % 4 === 0) kick(t, .48 * lv);
    if (full && (s === 4 || s === 12)) clap(t, .3 * lv);
    hat(t, (s % 4 === 2 ? .12 : .05) * lv, s % 4 === 2 ? .08 : .03);
    if (s % 4 !== 0) bass(t, root + 12 + (s % 8 === 7 ? 12 : 0), step * .9, .25 * lv);
  } };
console.log('C sections', C_A.toFixed(2), C_B.toFixed(2), 'and', C_BUILD.toFixed(2), STAMP.toFixed(2));
function wav([L, R], path) {
  const b = Buffer.alloc(44 + N * 4); b.write('RIFF', 0); b.writeUInt32LE(36 + N * 4, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22); b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) { b.writeInt16LE(Math.tanh(L[i]) * 32000 | 0, 44 + i * 4); b.writeInt16LE(Math.tanh(R[i]) * 32000 | 0, 46 + i * 4); }
  writeFileSync(path, b);
}
for (const k of process.argv[3] ? process.argv[3].split(',') : Object.keys(OPTIONS)) { wav(build(OPTIONS[k]), resolve(OUT, `music-${k}.wav`)); console.log('option', k, OPTIONS[k].bpm + ' BPM'); }
