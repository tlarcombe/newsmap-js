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

**Production (public):** denursrv01 (Hetzner, `ssh tlarcombe@178.105.81.121`)
- App: `/opt/newsmap/app/newsmap-js`, cloned from GitHub, run as dedicated `newsmap` system user
- Runs as systemd service `newsmap.service` (`node server.js`, `PORT=8040`), not Docker
- Apache2 reverse-proxies `newsmap.larcombe.tech` (port 80/443) → `127.0.0.1:8040`; vhost at `/etc/apache2/sites-available/newsmap.larcombe.tech*.conf`
- TLS via Let's Encrypt (`certbot --apache`), auto-renews
- **Deploy via GitHub** (never push files directly):
  ```
  commit → push to GitHub → ssh tlarcombe@178.105.81.121 →
  sudo -u newsmap git -C /opt/newsmap/app pull &&
  sudo -u newsmap npm --prefix /opt/newsmap/app/newsmap-js install &&
  sudo -u newsmap npm --prefix /opt/newsmap/app/newsmap-js run build &&
  sudo -u newsmap cp -r /opt/newsmap/app/newsmap-js/dist/* /opt/newsmap/app/newsmap-js/static/ &&
  sudo systemctl restart newsmap
  ```
- Useful commands:
  ```bash
  sudo systemctl status newsmap
  sudo journalctl -u newsmap -f
  ```

**External URL:** https://newsmap.larcombe.tech → denursrv01 directly (178.105.81.121), no intermediate proxy hop
- **DNS:** Cloudflare A record, DNS-only (grey cloud), points at 178.105.81.121

**Legacy (internal, still running as fallback):** baloo Docker deployment
- `~/docker/newsmap/newsmap-js/`, port 8030, internal URL http://newsmap.int.larcombe.tech (Caddy)
- No longer serves the public domain — DNS moved to denursrv01. Left running per 2026-07-02 decision; not actively maintained.
