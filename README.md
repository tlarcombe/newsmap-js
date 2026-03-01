NewsMap.JS — customised fork
============================

A visual representation of Google News headlines, displayed as a treemap.
Forked from [IJMacD/newsmap-js](https://github.com/IJMacD/newsmap-js).

---

Customisations
--------------

### Multiple editions with search
The Options panel has a searchable checkbox list of all 84 Google News editions.
Tick as many as you like — no Ctrl+click required.

### Headline translation
Each selected edition shows an **EN** button. Click it to translate that edition's
headlines to English using Google Translate. The button turns blue when active.
Translations are cached for the session. Toggling translation on or off forces
a fresh fetch of that edition's news.

This is useful for editions in languages you don't read — for example the Greek
(`Ελληνικά (Ελλάδα)`) or Japanese editions.

---

Running Locally
---------------

In `dev` mode, Vite proxies `/api/*` directly to `news.google.com` — no separate
proxy server is needed.

```bash
cd newsmap-js
npm install
npm start
```

---

Building for Production
-----------------------

The included `server.js` acts as both a static file server and a Google News RSS
proxy, so the built frontend and backend run together in a single process.
No `VITE_API_ROOT` is required — the frontend falls back to the same-origin `/api`
endpoint which the Express server handles.

```bash
cd newsmap-js
npm run build        # builds frontend to dist/
node server.js       # serves dist/ and proxies /api/* to news.google.com
```

Alternatively, set `VITE_API_ROOT` at build time to point to an external proxy:

```bash
VITE_API_ROOT=https://example.com npm run build
```

---

Docker
------

A `Dockerfile` and `docker-compose.yaml` are included for containerised deployment.
The image uses a multi-stage build — Vite builds the frontend, then the final image
runs `server.js` on `node:22-alpine`.

```bash
cd newsmap-js
docker compose up -d
```

By default the container exposes port `8030` on the host.

---

Key Source Files
----------------

| File | Purpose |
|------|---------|
| `src/Components/App.jsx` | Root component, state management |
| `src/Components/OptionsModal.jsx` | Options panel including edition select |
| `src/Components/Edition.jsx` | Per-edition treemap wrapper |
| `src/Components/useCategoryItems.js` | Data fetching hook |
| `src/sources/GoogleNewsRSS.js` | RSS fetch and parse |
| `src/translate.js` | Headline translation (Google Translate, session-cached) |
| `server.js` | Express server — static files + `/api` proxy |
| `Dockerfile` | Multi-stage build |
| `docker-compose.yaml` | Single-service compose |

---

Upstream
--------

Original project: https://github.com/IJMacD/newsmap-js
Original author: [IJMacD](https://github.com/IJMacD)
