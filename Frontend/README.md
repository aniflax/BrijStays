# Brij Stays — Frontend

The Brij Stays frontend is a React + TanStack Start server-rendered hospitality/accommodation website. It is being converted from an existing codebase and is not deployed yet.

## Planned stack

- **TanStack Start** on Vite with file-based routing and SSR
- **React 19** and TypeScript
- **Tailwind CSS** and Framer Motion
- **Cloudflare Workers** deployment as a Nitro server (`.output/`)
- **Strapi** REST API hosted on Render

## Planned architecture

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

The public frontend domain and Strapi base URL have not yet been assigned. Do not use legacy URLs or inherited production defaults.

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
| `STRAPI_URL` | Cloudflare Worker runtime variable | Full public Brij Stays Strapi base URL |
| `VITE_STRAPI_URL` | Build-time variable | Optional alternative to `STRAPI_URL` |

Set `STRAPI_URL` without a trailing slash or `/api`, for example `https://admin.example.com`. The actual Brij Stays backend domain is still to be determined.

## Scripts

```sh
npm run dev       # local development server
npm run build     # production build → .output/
npm run preview   # preview production build
npm run lint      # eslint
npm run format    # prettier
```

## Deployment

Cloudflare deployment is not configured yet. Once it is:

1. Create the Cloudflare Workers project for `Frontend/`.
2. Set `STRAPI_URL` and any required variables/secrets in Cloudflare.
3. Configure deployments from `main` in `aniflax/BrijStays`.
4. Add the final frontend origin to the backend's `CORS_ORIGINS` setting.

## Project structure

- `src/routes/` — file-based pages and root loader
- `src/components/site/` — shared site components
- `src/components/ui/` — UI primitives
- `src/lib/site.ts` — Strapi connectivity and site-data fetch
- `src/lib/data/` — static content to review during the Brij Stays conversion
- `src/lib/api.ts` — form/API submission helpers
