# NewsMap — Claude Context

Fork of [IJMacD/newsmap-js](https://github.com/IJMacD/newsmap-js).
React + Vite frontend with an Express proxy for Google News RSS.
**GitHub:** https://github.com/tlarcombe/newsmap-js

---

## Project Layout

```
newsmap-js/          # All active code lives here
  src/               # React frontend
  server.js          # Express: serves dist/ + proxies /api/* → news.google.com
  Dockerfile         # Multi-stage build (yarn → node:22-alpine)
  docker-compose.yaml
build-all-push-deploy-local.sh
push-deploy-prod.sh
vars.sh              # Shared env vars (app name, registry, etc.)
```

Key source files:

| File | Purpose |
|------|---------|
| `src/Components/App.jsx` | Root component, state management |
| `src/Components/OptionsModal.jsx` | Edition selector (84 editions, searchable checkboxes) |
| `src/Components/Edition.jsx` | Per-edition treemap wrapper |
| `src/Components/useCategoryItems.js` | Data fetching hook |
| `src/sources/GoogleNewsRSS.js` | RSS fetch and parse |
| `src/translate.js` | Headline translation (Google Translate, session-cached) |

---

## Customisations Over Upstream

- **Multi-edition select** — searchable checkbox list of all 84 Google News editions
- **Headline translation** — per-edition EN button, Google Translate, session-cached

---

## Local Development

```bash
cd newsmap-js
yarn install
yarn start        # Vite dev server; /api/* proxied to news.google.com
```

## Production Build

```bash
cd newsmap-js
yarn build        # builds to dist/
node server.js    # serves dist/ + /api proxy on port 8000
```

## Docker

```bash
cd newsmap-js
docker compose up -d
# Exposes host port 8030 → container port 8000
```

---

## Deployment

**Target host:** baloo (`ssh -A tlarcombe@baloo.int.larcombe.tech`)
**Repo on host:** `~/docker/newsmap/newsmap-js/`

**Always deploy via GitHub** (never push files directly):
```
commit → push to GitHub → ssh to baloo → git pull && docker compose up -d --build
```

Useful commands on baloo:
```bash
docker logs newsmap-js
docker compose down
docker compose up -d --build
```

**Internal URL:** http://newsmap.int.larcombe.tech (Caddy on baloo)
- Caddy config: `~/docker/searxng-docker/Caddyfile` — use `http://` not `https://` (`.int` domains can't get ACME certs)
- Restart Caddy: `cd ~/docker/searxng-docker && docker compose restart caddy`

**External URL:** https://newsmap.larcombe.tech (SSL valid to 2026-05-30)
- Route: TonyNET1.1 nginx → Tailscale → baloo:8030 (100.113.72.220)
- nginx config: `/etc/nginx/sites-available/newsmap.larcombe.tech` on chzursrv02

**DNS:**
- `newsmap.int.larcombe.tech` → 192.168.1.220 (Technitium)
- `newsmap.larcombe.tech` → 152.67.72.64 (Cloudflare)
