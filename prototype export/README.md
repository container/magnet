# MAG-NETic Platform Prototype

Vite + React SPA. Front-end only — no backend, database or environment variables.

## Install and run

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

Opens on http://127.0.0.1:5173

Production build:

```sh
npm run build
npm run preview
```

Serves on http://127.0.0.1:4173. Both ports are fixed; free them first if they are taken.

## Where to look

| Path | |
|---|---|
| `/` | Public website — spaces, events, programmes, shop, membership |
| `/moj-dom` | Member area — reservations, tickets, applications, profile |
| `/admin` | Administration — full editorial and booking back office |
| `/prototype` | Internal overview of published vs. unpublished spaces |

Sign-in is simulated: the member login at `/moj-dom/prijava` accepts the pre-filled
credentials, or anything else you type.

## Things to know while clicking through

**The prototype runs on a fixed date of 20 January 2027.** Calendars, "today" markers
and event listings are all relative to it, so upcoming and past events stay stable.

**Content is demo data.** Edits you make in the admin are held in browser
`localStorage` under the `magnetic.prototype.*` keys — they survive a reload but never
leave the browser. Clear the site's storage to return to the seeded state.

**Language** switches between Slovenian and English through the SL/EN control in the
header, which sets a `?lang=` parameter. Slovenian is the default; the English
translation covers the interface chrome, not the demo content.

**Deep links need a server.** Do not open `index.html` from the file system — routing
is client-side. If you deploy the `dist/` output, point all unmatched paths at
`index.html` or anything below the root will 404 on refresh.
