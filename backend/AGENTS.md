# Brij Stays Backend — Strapi 5

Headless CMS for Brij Stays, built with **Strapi 5**. It is planned for deployment on **Render**, using **Neon PostgreSQL** and two **Cloudflare R2** media buckets. Render, Neon, R2, and production domains have not yet been configured.

## Repository and deployment

- Repository: `git@github.com:aniflax/BrijStays.git`, branch `main`.
- Deploy this `backend/` directory to a new Render web service.
- Configure automatic deploys from `main` after the Render service is created.
- Do not carry forward Unityaliving service URLs, CDN URLs, bucket names, or secrets.

## Stack and local run

- Node 20+ and Strapi 5 (`@strapi/strapi`).
- Local development: `npm run develop` → `http://localhost:1337`.
- Production: Render should build with `NODE_ENV=production strapi build`, then run the server on Render's `PORT`.
- Local development defaults to SQLite (`.tmp/data.db`); production will use PostgreSQL through environment variables.

## Data and storage

- **Database:** Neon PostgreSQL. Store the connection details in Render environment variables; do not expose the database publicly.
- **Media:** two Cloudflare R2 buckets through Strapi's S3-compatible `aws-s3` provider configuration. Final bucket roles, names, and public media/CDN domains are still to be determined.
- When R2 credentials are absent locally, media should remain local.

## Content types and public API

- Review and redesign the inherited content types for Brij Stays before launch.
- The inherited `Personal Informations` single type and `GET /api/personal-information` endpoint may be retained for shared contact data if suitable, but are not a finalized requirement.
- Configure only intentional public Strapi permissions. Keep contact/site-information endpoints public only when the frontend needs unauthenticated access.
- Set `CORS_ORIGINS` to the final Brij Stays frontend domain(s) before production launch.

## Environment variables (Render)

- Runtime: `HOST`, `PORT`
- Database: `DATABASE_CLIENT=postgres`, `DATABASE_URL`, `DATABASE_SSL`, `DATABASE_SCHEMA`
- Strapi secrets: `APP_KEYS`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`
- R2/S3: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `S3_REGION`, plus distinct bucket-name and public-URL/CDN variables for both R2 buckets
- CORS: `CORS_ORIGINS` (comma-separated)

Never commit production secrets, database URLs, R2 credentials, bucket names, or deployment-domain values.

## Deployment checks

- Confirm Render connects to Neon successfully.
- Confirm both configured R2 buckets accept uploads and resolve through their intended public media URLs.
- Configure CORS for the Cloudflare frontend origin.
- Verify that intentionally public REST endpoints work from the deployed frontend.
- Changing Render environment variables requires a redeploy.
