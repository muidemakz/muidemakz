/* Settings for the design-board layer (js/board.js). Edit here, nothing else.

   transport:
     "none"      simulated visitors only, nothing leaves the browser (default)
     "supabase"  real visitors see each other live. Needs realtime.url and realtime.key.
     "local"     tabs of the same browser see each other. For testing only.

   To go live with real visitors:
     1. Create a free project at supabase.com.
     2. Project Settings, API: copy the Project URL and the "anon public" key
        (the anon key is meant to be public; it only allows what the project allows).
     3. Paste them below and set transport to "supabase".
     No tables are needed: this uses Realtime broadcast and presence only.

   chat:        false turns cursor chat off for everyone (kill switch).
   chatMax:     longest message in characters (50 to 80).
   simulated:   fill the board with demo visitors when fewer than two real people are here.
   cursor:      default cursor id; visitors never see the picker. See js/board-cursors.js.

   bot:         an AI guide that shows up as one clearly labelled visitor and answers when someone chats.
                endpoint: "" = off.  "demo" = canned answers in the browser (for testing only, no AI).
                Deployed site: uses /api/mm (netlify/functions/mm.mjs, see netlify/README.md) for real AI answers.
                The API key lives only in that Worker, never in this file.

   Off switches for a single browser: add ?board=off to any URL (and ?board=on to undo). */
window.BOARD_CONFIG = {
  transport: 'none',
  realtime: { url: '', key: '' },
  chat: true,
  chatMax: 80,
  simulated: true,
  cursor: 'outline-arrow',
  bot: {
    /* Real AI (netlify/functions/mm.mjs) on the deployed site; canned answers on your own computer, where that function does not exist. */
    endpoint: /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:' ? 'demo' : '/api/mm',
    name: 'muidemakz',
    /* Where the guide's buttons go. Change these when the new pages replace the old ones. */
    links: {
      'speech-to-order': { label: 'Read Speech-to-Order', href: 'omnibiz-speech-to-order.html', open: true },
      'omnione': { label: 'Read Omnione', href: 'omnione.html', open: true },
      'omni-sso': { label: 'Read Omni sign-in', href: 'omni-sso.html', open: true },
      'fundall': { label: 'Read Fundall', href: 'fundall.html', open: true },
      'moniepoint': { label: 'Read Moniepoint', href: 'moniepoint-verification.html', open: true },
      'nsimbi': { label: 'Read Nsimbi', href: 'nsimbi-three-purchases.html', open: true },
      'valideity': { label: 'Read Valideity', href: 'valideity.html', open: true },
      'teesas': { label: 'Read Teesas', href: 'teesaslms.html', open: true },
      'sun-king': { label: 'Read Sun King', href: 'sun-king.html', open: true },
      'about': { label: 'About me', href: 'about.html', open: true },
      'linkedin': { label: 'LinkedIn', href: 'https://www.linkedin.com/in/makanju-excellent-211b0a44/' },
      'instagram': { label: 'Instagram', href: 'https://www.instagram.com/oluwaexcellent/' },
      'resume': { label: 'Download resume', href: 'Excellent_Makanju_Resume_2026.pdf', download: true },
      'email': { label: 'Say hi by email', href: 'mailto:muidemakz@gmail.com' }
    }
  },
  /* Work board stickers are shared through netlify/functions/stickers.mjs. On a plain local server it falls back to this browser only. */
  stickers: { endpoint: '/api/stickers' }
};
