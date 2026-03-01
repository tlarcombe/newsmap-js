NewsMap.JS — tlarcombe fork
===========================

A visual representation of Google News headlines, displayed as a treemap.
Forked from [IJMacD/newsmap-js](https://github.com/IJMacD/newsmap-js).

**Live:** https://newsmap.larcombe.tech
**Internal:** http://newsmap.int.larcombe.tech

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

This is useful for editions in languages you don't read — the Greek edition
(`Ελληνικά (Ελλάδα)`) being the motivating example.

---

Deployment
----------

The app runs as a self-contained Docker container on **baloo** (192.168.1.220).
`server.js` serves the built frontend and proxies `/api/*` to Google News RSS —
no external API root is required.

### Running on baloo

```bash
ssh tlarcombe@baloo.int.larcombe.tech
cd ~/docker/newsmap/newsmap-js
docker compose up -d
```

### Updating after code changes

```bash
ssh -A tlarcombe@baloo.int.larcombe.tech
cd ~/docker/newsmap
git pull
cd newsmap-js
docker compose up -d --build
```

### Ports

| Host port | Container port | Service |
|-----------|----------------|---------|
| 8030      | 8000           | Express (static + proxy) |

External access is via nginx on TonyNET1.1 (chzursrv02), proxying
`newsmap.larcombe.tech` → Tailscale → baloo:8030, with Let's Encrypt SSL.

---

Development
-----------

The frontend is React + Vite. The backend is a plain Express server (`server.js`).

```bash
cd newsmap-js
yarn install
yarn start          # dev server with auto-proxy to news.google.com
yarn build          # production build to dist/
```

In development, Vite proxies `/api/*` directly to `news.google.com` so no
separate proxy server is needed.

### Key source files

| File | Purpose |
|------|---------|
| `src/Components/App.jsx` | Root component, state management |
| `src/Components/OptionsModal.jsx` | Options panel including edition select |
| `src/Components/Edition.jsx` | Per-edition treemap wrapper |
| `src/Components/useCategoryItems.js` | Data fetching hook |
| `src/sources/GoogleNewsRSS.js` | RSS fetch and parse |
| `src/translate.js` | Headline translation (Google Translate, session-cached) |
| `server.js` | Express server — static files + `/api` proxy |
| `Dockerfile` | Multi-stage build (yarn build → node:22-alpine) |
| `docker-compose.yaml` | Single-service compose for baloo |

---

Upstream
--------

Original project: https://github.com/IJMacD/newsmap-js
Original author: [IJMacD](https://github.com/IJMacD)
