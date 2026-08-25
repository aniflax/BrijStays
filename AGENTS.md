# Brij Stays — Architecture

Brij Stays is a hospitality/accommodation marketing site being converted from the Unityaliving codebase. It uses a headless CMS architecture with a React/TanStack Start server-rendered frontend and a Strapi backend.

## Topology

```
Browser ──> Brij Stays frontend (Cloudflare Workers, SSR)
                    │
                    │  server-side API requests
                    ▼
             Strapi CMS (Render)
                    │
                    ├── Neon PostgreSQL (via Render environment variables)
                    └── Cloudflare R2 media (via S3-compatible provider)
```

- Frontend (Cloudflare Workers): `https://brijstays.in`
- Backend/CMS (Render): `https://admin.brijstays.in`
- Media CDN (R2): `https://cdn.brijstays.in`

## Repository and deployment

- **GitHub repository:** `git@github.com:aniflax/BrijStays.git` (default branch: `main`).
- **Frontend:** deploy `Frontend/` to Cloudflare Workers.
- **Backend:** deploy `backend/` to Render (`admin.brijstays.in`).
- A push to `main` deploys both services automatically.
- Environment variables and secrets must be configured in the relevant Cloudflare and Render dashboards; never commit them.
- **Commit policy:** any changes to the code must be pushed to `main` immediately after being made. Commits must not include co-author/attribution trailers (e.g. `Co-authored-by: ...`); all commits are authored by **aniflax** alone.

## Services

| Piece | Platform | Domain | Notes |
| --- | --- | --- | --- |
| Frontend | Cloudflare Workers | `brijstays.in` | React + TanStack Start SSR application |
| Backend (CMS) | Render | `admin.brijstays.in` | Strapi v5 REST API |
| Database | Neon PostgreSQL | — | Connection details supplied through Render environment variables |
| Media storage | Cloudflare R2 | `cdn.brijstays.in` | Two R2 buckets for media, accessed through Strapi's S3-compatible provider |

## Repository layout

- `Frontend/` — TanStack Start SSR app (Vite + React + Tailwind + Framer Motion). See `Frontend/AGENTS.md`.
- `backend/` — Strapi 5 project. See `backend/AGENTS.md`.

## Environment variables

Backend (configure in **Render**):

- Runtime: `HOST`, `PORT`, `PUBLIC_URL=https://admin.brijstays.in`
- Database: `DATABASE_CLIENT=postgres`, `DATABASE_URL`, `DATABASE_SSL=true`
- Strapi secrets: `APP_KEYS`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`
- R2/S3 media configuration: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET_NAME`, `R2_MEDIA_PUBLIC_URL`, `S3_REGION`
- `CORS_ORIGINS` — `https://brijstays.in,https://www.brijstays.in`

Frontend (configure in **Cloudflare Workers**):

- `STRAPI_URL` — `https://admin.brijstays.in`, the complete public Render/Strapi base URL, without a trailing slash or `/api`
- `VITE_STRAPI_URL` — optional build-time alternative when the application requires it
- Cache purge (automatic webhook): `CF_API_TOKEN` — Cloudflare API token with Zone → Cache Purge → Purge permission
- Cache purge (automatic webhook): `CF_ZONE_ID` (or `CF_ZONE=brijstays.in` to auto-look-up the zone)
- Cache purge (optional): `PURGE_SECRET` — if set, the webhook only accepts requests carrying `x-strapi-secret: <PURGE_SECRET>`. If unset, the webhook is open.

## Cache purging

CMS data (blogs + site info) and SSR responses are cached at the Cloudflare
edge for up to 10 minutes, so CMS edits don't appear instantly without a purge.

- **Manual:** `cd Frontend/scripts && ./purge-cache.sh`. Reads `CF_API_TOKEN`
  and `CF_ZONE`/`CF_ZONE_ID` from `Frontend/scripts/.deploy.env` (gitignored).
- **Automatic:** Strapi webhooks POST to `https://brijstays.in/api/purge-cache`.
  The Worker resets its in-process blog/site caches, then calls the Cloudflare
  purge-everything API (clears the CDN and the `_cache/blogs` + `_cache/site`
  Cache API entries). Implemented in `Frontend/src/server.ts`
  (`handlePurgeWebhook`). When `PURGE_SECRET` is configured, the request must
  also send `x-strapi-secret: <PURGE_SECRET>`; otherwise no secret is required.
- **To configure the webhook:** in Strapi admin → Settings → Webhooks, add one
  with URL `https://brijstays.in/api/purge-cache` (leave the secret field blank
  unless `PURGE_SECRET` is set), and events for the **Blog** collection
  (create/update/delete/publish) and the **Personal Information** single type.

## Local development

- Backend: `cd backend && npm run develop` → `http://localhost:1337` (local SQLite by default).
- Frontend: `cd Frontend && npm run dev`. In development, point its Strapi URL configuration at the local backend or the intended deployed backend.

## Deployment notes

- Build the frontend with `cd Frontend && npm run build`; deploy its generated Cloudflare Worker output using the configured Cloudflare workflow.
- Render builds and runs the backend from `backend/` in production mode.
- Configure R2 bucket credentials and the Neon connection string only as platform secrets/environment variables.
- CORS is set to the frontend domains; confirm that API and media URLs resolve correctly.
