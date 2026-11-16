# Netlify Functions

Two small server pieces, deployed automatically with the site (Netlify picks up `netlify/functions`).
`package.json` lists their one dependency, `@netlify/blobs`, which Netlify installs on deploy.

## Shared stickers: `functions/stickers.mjs` (`/api/stickers`)

Stickers on the Work board are saved in Netlify Blobs, so every visitor sees them. Nothing to set up.

- Each browser can move or remove only its own stickers, at most 8, and 160 in total on the board.
- **Owner clean-up:** in Netlify > Site configuration > Environment variables, add `OWNER_KEY` with a long random value.
  Then open `https://muidemakz.com/work?owner=<that value>` once on a computer (the key is saved in that browser and removed from the address bar). The sticker tray gets a
  "Clean up board" button, stickers you drop are signed "Excellent", and you can drag any sticker (visitors' and the board's own) or double-click it to remove it. Changes are saved for everyone. Keep that link private.
- On a plain local server the endpoint does not exist, so the board falls back to this browser only.

## MM, the AI: `functions/mm.mjs` (`/api/mm`)

Off for now: `js/board-config.js` has `bot.endpoint: 'demo'`, so MM gives canned answers. To switch the real AI on:

1. Netlify > Site configuration > Environment variables: add `DEEPSEEK_API_KEY` (or `ANTHROPIC_API_KEY`).
   The key stays on Netlify and is never in the site files.
2. In `js/board-config.js` set `bot.endpoint` to `'/api/mm'`, then deploy.
3. Read the `FACTS` block in `functions/mm.mjs`: MM only answers from it. Edit it when a case study changes.

Limits: 6 questions a minute per visitor, short answers. With DeepSeek, visitors' questions are processed by DeepSeek.
Set a spending limit in the DeepSeek (or Anthropic) console as well.
