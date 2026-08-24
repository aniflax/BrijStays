# Brij Stays — Frontend

The Brij Stays frontend is a React + TanStack Start server-rendered hospitality/accommodation website, deployed to Cloudflare Workers (Nitro server, `.output/`).

## Stack

- **TanStack Start** on Vite with file-based routing and SSR
- **React** and TypeScript
- **Tailwind CSS** and Framer Motion
- **Cloudflare Workers** deployment as a Nitro server (`.output/`)
- **Strapi** REST API hosted on Render

## Architecture

```
Browser ──> Brij Stays Cloudflare Worker (SSR frontend)
                    │
                    │  server-side API requests
                    ▼
              Brij Stays Strapi CMS (Render)
                    │
                    ├── Neon PostgreSQL
                    └── Cloudflare R2 media buckets
```

- Frontend domain: `https://brijstays.in`
- Backend/CMS (Render): `https://admin.brijstays.in`
- Media CDN (R2): `https://cdn.brijstays.in`

## Getting started

Requires Node.js 20+.

```sh
git clone git@github.com:aniflax/BrijStays.git
cd BrijStays/Frontend
npm i
npm run dev
```

Visit `http://localhost:3000`. For local CMS data, run the backend at `http://localhost:1337` or set `STRAPI_URL` to an available Brij Stays backend.

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `STRAPI_URL=https://admin.brijstays.in` | Cloudflare Worker runtime variable | Full public Brij Stays Strapi base URL |
| `VITE_STRAPI_URL` | Build-time variable | Optional alternative to `STRAPI_URL` |

Set `STRAPI_URL` without a trailing slash or `/api`. In production the Worker reads `process.env.STRAPI_URL` at runtime; if it is absent the code falls back to `https://admin.brijstays.in`.

Add `https://brijstays.in` and `https://www.brijstays.in` to the backend's `CORS_ORIGINS` so the browser permits API calls from the deployed frontend.

## Scripts

```sh
npm run dev       # local development server
npm run build     # production build → .output/
npm run preview   # preview production build
npm run lint      # eslint
npm run format    # prettier
```

## Deployment

1. Cloudflare Workers project for `Frontend/`.
2. Set the `STRAPI_URL` runtime variable in Cloudflare.
3. Configure deployments from `main` in `aniflax/BrijStays`.
4. On the backend (Render), add `https://brijstays.in` (and `https://www.brijstays.in`) to `CORS_ORIGINS`.

## Project structure

- `src/routes/` — file-based pages and root loader
- `src/components/site/` — shared site components
- `src/components/ui/` — UI primitives
- `src/lib/site.ts` — Strapi connectivity and site-data fetch
- `src/lib/data/` — static content to review during the Brij Stays conversion
- `src/lib/api.ts` — form/API submission helpers