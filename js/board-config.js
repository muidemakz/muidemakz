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
                Or the address of the Worker in workers/visitor-bot (see its README) for real AI answers.
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
    endpoint: 'demo',
    name: 'muidemakz',
    /* Where the guide's buttons go. Change these when the new pages replace the old ones. */
    links: {
      'speech-to-order': { label: 'Read Speech-to-Order', href: 'omnibiz-speech-to-order-preview.html', open: true },
      'omnione': { label: 'Read Omnione', href: 'omnione-preview.html', open: true },
      'fundall': { label: 'Read Fundall', href: 'fundall-preview.html', open: true },
      'moniepoint': { label: 'Read Moniepoint', href: 'moniepoint-verification-preview.html', open: true },
      'nsimbi': { label: 'Read Nsimbi', href: 'nsimbi-three-purchases-preview.html', open: true },
      'valideity': { label: 'Read Valideity', href: 'valideity-preview.html', open: true },
      'teesas': { label: 'Read Teesas', href: 'teesaslms-preview.html', open: true },
      'sun-king': { label: 'Read Sun King', href: 'sun-king-preview.html', open: true },
      'about': { label: 'About me', href: 'about-preview.html', open: true },
      'resume': { label: 'Download resume', href: 'Excellent_Makanju_Resume_2026.pdf', download: true },
      'email': { label: 'Say hi by email', href: 'mailto:muidemakz@gmail.com' }
    }
  }
};
