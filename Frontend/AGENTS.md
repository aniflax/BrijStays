# Brij Stays Frontend

Server-rendered hospitality/accommodation marketing site built with **TanStack Start** (Vite + React 19 + Tailwind + Framer Motion). It is planned for deployment to **Cloudflare Workers** as a Nitro server (`.output`). No production domain, Worker name, or Cloudflare deployment pipeline has been configured yet.

## Repository and deployment

- Repository: `git@github.com:aniflax/BrijStays.git`, branch `main`.
- Deploy this `Frontend/` directory to Cloudflare Workers once the Cloudflare project is created.
- Configure automatic deployments from `main` after the Cloudflare integration is set up.
- Do not use Unityaliving URLs, worker names, or deployment configuration for Brij Stays.

## Stack and build

- Build: `npm run build` → `vite build` (Cloudflare preset) → `.output/`.
- Local development: `npm run dev` → `http://localhost:3000`.
- Deployment will use the configured Cloudflare workflow or `wrangler deploy` when a Worker configuration exists.

## Backend connectivity

`src/lib/site.ts` resolves the Strapi backend URL and fetches site-wide information. Its existing code may contain inherited Unityaliving defaults; replace those with Brij Stays configuration when the backend URL is available.

Resolution order:

1. Runtime `process.env.STRAPI_URL`
2. Build-time `VITE_STRAPI_URL`
3. Local development fallback (`http://localhost:1337`)

For production, configure `STRAPI_URL` in the Cloudflare Worker as the full public Brij Stays Strapi/Render URL—no trailing slash and no `/api`. Do not rely on an inherited production fallback.

## Data flow

- The root loader calls `fetchSite()` and wraps the application in `SiteProvider`.
- `src/lib/site-context.tsx` exposes site data to shared components.
- The inherited implementation fetches `GET {STRAPI_URL}/api/personal-information` and caches it for roughly five minutes in Worker memory.
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
- Add the final frontend domain to the backend's `CORS_ORIGINS` setting before production launch.
