# Brij Stays — Architecture

Brij Stays is a hospitality/accommodation marketing site currently being converted from the Unityaliving codebase. It will use a headless CMS architecture with a React/TanStack Start server-rendered frontend and a Strapi backend.

## Planned topology

```
Browser ──> Brij Stays frontend (Cloudflare Workers, SSR)
                    │
                    │  server-side API requests
                    ▼
             Strapi CMS (Render)
                    │
                    ├── Neon PostgreSQL (via Render environment variables)
                    └── Cloudflare R2 buckets (media, via S3-compatible provider)
```

The frontend, CMS, and CDN/custom domains have not yet been assigned. Do not assume or introduce Unityaliving domains in Brij Stays configuration.

## Repository and deployment

- **GitHub repository:** `git@github.com:aniflax/BrijStays.git` (default branch: `main`).
- **Frontend:** deploy `Frontend/` to Cloudflare Workers after Cloudflare configuration is created.
- **Backend:** deploy `backend/` to Render after the Render service is created.
- A push to `main` should be configured to deploy both services automatically once those integrations exist.
- Environment variables and secrets must be configured in the relevant Cloudflare and Render dashboards; never commit them.

## Services

| Piece | Planned platform | Domain | Notes |
| --- | --- | --- | --- |
| Frontend | Cloudflare Workers | To be assigned | React + TanStack Start SSR application |
| Backend (CMS) | Render | To be assigned | Strapi v5 REST API |
| Database | Neon PostgreSQL | — | Connection details supplied through Render environment variables |
| Media storage | Cloudflare R2 | To be assigned | Two R2 buckets for media, accessed through Strapi's S3-compatible provider |

## Repository layout

- `Frontend/` — TanStack Start SSR app (Vite + React + Tailwind + Framer Motion). See `Frontend/AGENTS.md`.
- `backend/` — Strapi 5 project. See `backend/AGENTS.md`.

## Environment variables

Backend (configure in **Render**):

- Database: `DATABASE_CLIENT=postgres`, `DATABASE_URL`, `DATABASE_SSL`
- Strapi secrets: `APP_KEYS`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`
- R2/S3 media configuration: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, bucket-name variables for both buckets, `S3_REGION`, and the eventual public CDN URL(s)
- `CORS_ORIGINS` for the deployed frontend domain(s)

Frontend (configure in **Cloudflare Workers**):

- `STRAPI_URL` — the complete public Render/Strapi base URL, without a trailing slash or `/api`
- `VITE_STRAPI_URL` — optional build-time alternative when the application requires it

## Local development

- Backend: `cd backend && npm run develop` → `http://localhost:1337` (local SQLite by default).
- Frontend: `cd Frontend && npm run dev`. In development, point its Strapi URL configuration at the local backend or the intended deployed backend.

## Deployment notes

- Build the frontend with `cd Frontend && npm run build`; deploy its generated Cloudflare Worker output using the configured Cloudflare workflow.
- Render should build and run the backend from `backend/` in production mode.
- Configure R2 bucket credentials and the Neon connection string only as platform secrets/environment variables.
- Before enabling production traffic, set CORS to the final frontend domain and confirm that API and media URLs resolve correctly.
