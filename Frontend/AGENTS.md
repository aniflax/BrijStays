# Brij Stays Frontend

Server-rendered hospitality/accommodation marketing site built with **TanStack Start** (Vite + React + Tailwind + Framer Motion). Deployed to **Cloudflare Workers** as a Nitro server (`.output`).

- Frontend (Cloudflare Workers): `https://brijstays.in`
- Backend/CMS (Render): `https://admin.brijstays.in`
- Media CDN (R2): `https://cdn.brijstays.in`

## Repository and deployment

- Repository: `git@github.com:aniflax/BrijStays.git`, branch `main`.
- This `Frontend/` directory deploys to a Cloudflare Workers project.
- Automatic deployments run from `main`.

## Stack and build

- Build: `npm run build` → `vite build` (Cloudflare preset) → `.output/`.
- Local development: `npm run dev` → `http://localhost:3000`.
- Deployment uses the configured Cloudflare workflow or `wrangler deploy`.

## Backend connectivity

`src/lib/site.ts` resolves the Strapi backend URL and fetches site-wide information. The production fallback is `https://admin.brijstays.in`.

Resolution order:

1. Runtime `process.env.STRAPI_URL`
2. Build-time `VITE_STRAPI_URL`
3. Production fallback `https://admin.brijstays.in` (or `http://localhost:1337` in dev)

For production, configure `STRAPI_URL` in the Cloudflare Worker as `https://admin.brijstays.in` — no trailing slash and no `/api`. Changing the Worker variable requires a Worker redeploy.

## Data flow

- The root loader calls `fetchSite()` and wraps the application in `SiteProvider`.
- `src/lib/site-context.tsx` exposes site data to shared components.
- The implementation fetches `GET {STRAPI_URL}/api/personal-information` and caches it for roughly five minutes in Worker memory.
- Confirm the final Strapi content types and public permissions as part of the Brij Stays CMS setup. The inherited "Personal Informations" type is not a final product requirement.

## Key files

- `src/lib/site.ts` — Strapi URL resolution and site-data fetch.
- `src/lib/site-context.tsx` — `SiteProvider` and `useSite()`.
- `src/routes/__root.tsx` — root site-data loader/provider.
- `src/components/site/` — shared header, footer, enquiry, and contact UI.
- `src/lib/data/` — static content that should be reviewed and replaced for Brij Stays.

## Configuration notes

- Configure `STRAPI_URL` and any other runtime variables in Cloudflare; never commit secrets.
- Cloudflare variable/secret changes require a Worker redeploy.
- On the backend (Render), add the frontend origin `https://brijstays.in` (and `https://www.brijstays.in`) to `CORS_ORIGINS` before production launch.