# Brij Stays Backend — Strapi 5

Headless CMS for Brij Stays, built with **Strapi 5**. Deployed on **Render**, using **Neon PostgreSQL** for data and **Cloudflare R2** for media.

- Backend (Render): `https://admin.brijstays.in`
- Media CDN (R2): `https://cdn.brijstays.in`
- Frontend (Cloudflare Workers): `https://brijstays.in`

## Repository and deployment

- Repository: `git@github.com:aniflax/BrijStays.git`, branch `main`.
- This `backend/` directory deploys to a Render web service (`admin.brijstays.in`).
- Automatic deploys run from `main`.

## Stack and local run

- Node 20+ and Strapi 5 (`@strapi/strapi`).
- Local development: `npm run develop` → `http://localhost:1337`.
- Production: Render builds with `NODE_ENV=production strapi build`, then runs the server on Render's `PORT`.
- Local development defaults to SQLite (`.tmp/data.db`); production uses PostgreSQL via environment variables.

## Data and storage

- **Database:** Neon PostgreSQL. Store the connection string only in Render environment variables (`DATABASE_URL`, `DATABASE_CLIENT=postgres`, `DATABASE_SSL=true`); do not expose the database publicly.
- **Media:** Cloudflare R2 through Strapi's S3-compatible `aws-s3` provider configuration. Primary bucket is `brijstays`, served via `https://cdn.brijstays.in`. When R2 credentials are absent locally, media remains local.

## Content types and public API

- Configure only intentional public Strapi permissions. Keep contact/site-information endpoints public only when the frontend needs unauthenticated access.
- Set `CORS_ORIGINS` to the Cloudflare frontend origin(s), e.g. `https://brijstays.in,https://www.brijstays.in`.

## Environment variables (Render)

- Runtime: `HOST`, `PORT`, `PUBLIC_URL=https://admin.brijstays.in`
- Database: `DATABASE_CLIENT=postgres`, `DATABASE_URL`, `DATABASE_SSL=true`, `DATABASE_SCHEMA`
- Strapi secrets: `APP_KEYS`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`
- R2/S3: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `S3_REGION=auto`, `R2_MEDIA_BUCKET`, `R2_MEDIA_PUBLIC_URL`
- CORS: `CORS_ORIGINS`

Never commit production secrets, database URLs, R2 credentials, or deployment-domain tokens. Keep secret values in the Render dashboard; use placeholder values in `.env.example`.

## Deployment checks

- Confirm Render connects to Neon successfully.
- Confirm the R2 bucket accepts uploads and resolves through `https://cdn.brijstays.in`.
- Configure CORS for the Cloudflare frontend origin (`https://brijstays.in`).
- Verify that intentionally public REST endpoints work from the deployed frontend.
- Changing Render environment variables requires a redeploy.