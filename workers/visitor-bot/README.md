# muidemakz, the AI on the portfolio (cursor chat and Ask panel)

A small Cloudflare Worker. The website sends the visitor's chat message to it, it asks Claude for a one-line
answer, and returns `{ "reply": "..." }`. The API key stays in the Worker and never appears in the site.

Nothing here is deployed yet. Until you deploy it, the site uses `endpoint: 'demo'` in `js/board-config.js`
(canned answers, no AI).

## Set it up (about 10 minutes)

1. Create a free Cloudflare account and an Anthropic API key (console.anthropic.com).
2. In this folder: `npx wrangler login`
3. Put ONE key in as a secret (it is never saved in a file):
   - DeepSeek: `npx wrangler secret put DEEPSEEK_API_KEY` (used first if present; model `deepseek-chat`)
   - or Claude: `npx wrangler secret put ANTHROPIC_API_KEY`
4. Edit `ALLOWED_ORIGINS` in `wrangler.toml` to your real site address.
5. `npx wrangler deploy`. It prints the Worker's address, for example `https://portfolio-visitor-bot.<you>.workers.dev`.
6. In `js/board-config.js` set `bot: { endpoint: 'https://portfolio-visitor-bot.<you>.workers.dev', name: 'muidemakz' }`.

## Cost and abuse protection

- Each answer is capped at 60 tokens, so a reply costs a fraction of a cent.
- The rate limit allows 4 questions a minute per visitor.
- Optional daily cap (`DAILY_CAP`, default 300 replies) using a KV counter, see `wrangler.toml`.
- Only the origins in `ALLOWED_ORIGINS` can call it.
- Set a monthly spend limit in the Anthropic console as well.

## What it may say

It only uses the `FACTS` block in `worker.js` and is told never to invent numbers or clients. Edit `FACTS` when a
case study changes. It always says it is an AI, and the cursor on the site wears an "AI" badge.
