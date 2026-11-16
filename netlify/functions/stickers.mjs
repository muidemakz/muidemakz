/* Shared stickers for the Work board.
   Stored in Netlify Blobs (built into Netlify, no other account needed). Every visitor sees every sticker.

   GET  /api/stickers                      -> { stickers: [{ id, t, x, y, r, by, at, owner, mine }] }
   POST /api/stickers { action: 'add',    t, x, y, r, by }  -> { sticker }
   POST /api/stickers { action: 'move',   id, x, y }        -> { ok }
   POST /api/stickers { action: 'remove', id }              -> { ok }
   POST /api/stickers { action: 'clean' }                   -> { ok, removed }   (owner only)
   POST /api/stickers { action: 'decor', decor }            -> { ok }            (owner only: move/remove the board's own stickers)
   POST /api/stickers { action: 'react',  case, t, by }     -> { reaction }      (a sticker dropped on a case study card)
   POST /api/stickers { action: 'unreact', id }             -> { ok }            (yours, or any for the owner)

   Who may change what:
   - each browser sends a random id in the x-visitor header; only that browser can move or remove its stickers
   - the owner key (OWNER_KEY in Netlify's environment variables) can remove anything and clean the board,
     and stickers the owner drops are signed "Excellent"
   Limits: 8 stickers per visitor, 160 on the board (the oldest visitor sticker goes first), 30 changes a minute per IP. */
import { getStore } from '@netlify/blobs';

const TYPES = ['star', 'heart', 'smile', 'bolt', 'wow', 'eyes', 'flower', 'pointer'];
const PER_VISITOR = 8;
const MAX_TOTAL = 160;
const RX_PER_CASE = 3;   /* reactions per visitor per case study */
const RX_TOTAL = 1500;
const BAD = /(fuck|shit|bitch|cunt|nigg|fag|rape|whore|slut|dick|pussy)/ig;
const hits = new Map(); /* per-IP write counter, per function instance */

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
async function hash(s) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('wb:' + s));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}
function num(v, lo, hi) { v = Number(v); return Number.isFinite(v) ? Math.max(lo, Math.min(hi, v)) : null; }
function cleanName(s) { return String(s || '').replace(/[<>\u0000-\u001f\u007f]/g, '').replace(BAD, '•••').trim().slice(0, 24); }
function limited(ip) {
  const now = Date.now(), h = hits.get(ip) || [];
  const recent = h.filter((t) => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 30;
}
function rxView(x, me, isOwner) {
  return { id: x.id, case: x.case, t: x.t, by: x.owner ? 'Excellent' : x.by, at: x.at, owner: !!x.owner, mine: isOwner ? !!x.owner : x.vid === me };
}
function view(s, me, isOwner) {
  return { id: s.id, t: s.t, x: s.x, y: s.y, r: s.r, by: s.owner ? 'Excellent' : s.by, at: s.at, owner: !!s.owner, mine: isOwner ? !!s.owner : s.vid === me };
}

export default async (req, context) => {
  const store = getStore({ name: 'work-board-stickers', consistency: 'strong' });
  const vidRaw = String(req.headers.get('x-visitor') || '').slice(0, 64);
  const me = vidRaw ? await hash(vidRaw) : '';
  const ownerKey = process.env.OWNER_KEY || '';
  const isOwner = !!ownerKey && req.headers.get('x-owner-key') === ownerKey;
  const load = async () => (await store.get('all', { type: 'json' })) || [];
  const loadRx = async () => (await store.get('reactions', { type: 'json' })) || [];

  if (req.method === 'GET') {
    const all = await load();
    const decor = (await store.get('decor', { type: 'json' })) || {};
    const rx = await loadRx();
    return json({ stickers: all.map((s) => view(s, me, isOwner)), decor, reactions: rx.map((x) => rxView(x, me, isOwner)), owner: isOwner, ownerSet: !!ownerKey });
  }
  if (req.method !== 'POST') return json({ error: 'GET or POST only' }, 405);
  const ip = (context && context.ip) || req.headers.get('x-nf-client-connection-ip') || 'anon';
  if (limited(ip)) return json({ error: 'slow down' }, 429);
  let b;
  try { b = await req.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
  if (!me && !isOwner) return json({ error: 'no visitor id' }, 400);
  let all = await load();

  if (b.action === 'react') {
    if (!TYPES.includes(b.t)) return json({ error: 'unknown sticker' }, 400);
    const c = String(b.case || '').toLowerCase();
    if (!/^[a-z0-9-]{2,60}$/.test(c)) return json({ error: 'bad case' }, 400);
    let rx = await loadRx();
    if (!isOwner && rx.filter((x) => x.vid === me && x.case === c).length >= RX_PER_CASE) return json({ error: 'limit', limit: RX_PER_CASE }, 409);
    const x = { id: crypto.randomUUID().slice(0, 12), case: c, t: b.t, by: cleanName(b.by), at: Date.now(), vid: isOwner ? '' : me, owner: isOwner };
    rx.push(x);
    if (rx.length > RX_TOTAL) { const i = rx.findIndex((q) => !q.owner); if (i > -1) rx.splice(i, 1); }
    await store.setJSON('reactions', rx);
    return json({ reaction: rxView(x, me, isOwner) });
  }
  if (b.action === 'unreact') {
    let rx = await loadRx();
    const i = rx.findIndex((x) => x.id === b.id);
    if (i < 0 || !(isOwner || (rx[i].vid && rx[i].vid === me))) return json({ error: 'not yours' }, 403);
    rx.splice(i, 1);
    await store.setJSON('reactions', rx);
    return json({ ok: true });
  }

  if (b.action === 'add') {
    if (!TYPES.includes(b.t)) return json({ error: 'unknown sticker' }, 400);
    const x = num(b.x, -800, 8000), y = num(b.y, -800, 8000), r = num(b.r, -30, 30) || 0;
    if (x === null || y === null) return json({ error: 'bad position' }, 400);
    if (!isOwner && all.filter((s) => s.vid === me).length >= PER_VISITOR) return json({ error: 'limit', limit: PER_VISITOR }, 409);
    const s = { id: crypto.randomUUID().slice(0, 12), t: b.t, x, y, r, by: cleanName(b.by), at: Date.now(), vid: isOwner ? '' : me, owner: isOwner };
    all.push(s);
    while (all.length > MAX_TOTAL) { const i = all.findIndex((q) => !q.owner); if (i < 0) break; all.splice(i, 1); }
    await store.setJSON('all', all);
    return json({ sticker: view(s, me, isOwner) });
  }
  const i = all.findIndex((s) => s.id === b.id);
  const mayEdit = i > -1 && (isOwner || (all[i].vid && all[i].vid === me));
  if (b.action === 'move') {
    if (!mayEdit) return json({ error: 'not yours' }, 403);
    const x = num(b.x, -800, 8000), y = num(b.y, -800, 8000);
    if (x === null || y === null) return json({ error: 'bad position' }, 400);
    all[i].x = x; all[i].y = y;
    await store.setJSON('all', all);
    return json({ ok: true });
  }
  if (b.action === 'name') { /* sign every sticker this visitor already dropped */
    const by = cleanName(b.by);
    all.forEach((s) => { if (s.vid === me && !s.owner) s.by = by; });
    await store.setJSON('all', all);
    const rx = await loadRx();
    rx.forEach((x) => { if (x.vid === me && !x.owner) x.by = by; });
    await store.setJSON('reactions', rx);
    return json({ ok: true });
  }
  if (b.action === 'remove') {
    if (!mayEdit) return json({ error: 'not yours' }, 403);
    all.splice(i, 1);
    await store.setJSON('all', all);
    return json({ ok: true });
  }
  if (b.action === 'decor') { /* owner moves or removes the stickers that come with the board */
    if (!isOwner) return json({ error: 'owner only' }, 403);
    const out = {};
    Object.entries(b.decor || {}).slice(0, 40).forEach(([k, v]) => {
      if (!/^[a-z]+-\d{1,2}$/.test(k) || !v) return;
      out[k] = { dx: num(v.dx, -3000, 3000) || 0, dy: num(v.dy, -3000, 3000) || 0, hidden: !!v.hidden };
    });
    await store.setJSON('decor', out);
    return json({ ok: true });
  }
  if (b.action === 'clean') {
    if (!isOwner) return json({ error: 'owner only' }, 403);
    const before = all.length;
    all = all.filter((s) => s.owner);
    await store.setJSON('all', all);
    return json({ ok: true, removed: before - all.length });
  }
  return json({ error: 'unknown action' }, 400);
};

export const config = { path: '/api/stickers' };
