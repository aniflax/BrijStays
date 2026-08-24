# Brij Stays — Backend (Strapi 5)

The Brij Stays backend is a Strapi 5 headless CMS deployed on Render, using Neon PostgreSQL for data and Cloudflare R2 for media.

## Architecture

```
Brij Stays Cloudflare Worker frontend
                 │
                 │  public REST API requests
                 ▼
        Strapi 5 CMS on Render (this project)
                 │
                 ├── Neon PostgreSQL
                 └── Cloudflare R2 media buckets
```

Backend URL: `https://admin.brijstays.in`
Media CDN URL: `https://cdn.brijstays.in`
Frontend domain: `https://brijstays.in`

## Getting started

Requires Node.js 20+.

```sh
git clone git@github.com:aniflax/BrijStays.git
cd BrijStays/backend
npm i
npm run develop
```

Visit `http://localhost:1337/admin`. Local development uses SQLite (`.tmp/data.db`) and local media unless R2 configuration is supplied.

## Environment variables

Configure all values in Render, never in Git. Set `DATABASE_CLIENT=postgres` in production to use Neon instead of the local SQLite default.

| Variable | Purpose |
| --- | --- |
| `HOST`, `PORT` | Server host and port (Render sets `PORT` itself) |
| `PUBLIC_URL` | Public backend URL, e.g. `https://admin.brijstays.in` |
| `DATABASE_CLIENT=postgres` | Uses PostgreSQL in production |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `DATABASE_SSL=true` | Neon requires SSL |
| `DATABASE_SCHEMA` | Neon schema (default `public`) |
| `APP_KEYS` | Strapi app keys (comma-separated, at least 4) |
| `ADMIN_JWT_SECRET` | Admin-panel JWT secret |
| `API_TOKEN_SALT` | API-token salt |
| `JWT_SECRET` | Users-permissions JWT secret |
| `TRANSFER_TOKEN_SALT` | Transfer-token salt |
| `ENCRYPTION_KEY` | Transfer encryption key |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret key |
| `R2_ENDPOINT` | R2 S3-compatible endpoint |
| `S3_REGION` | R2 region (`auto`) |
| `R2_MEDIA_BUCKET` | Primary R2 bucket name (`brijstays`) |
| `R2_MEDIA_PUBLIC_URL` | Public media/CDN base URL (`https://cdn.brijstays.in`) |
| `CORS_ORIGINS` | Comma-separated frontend origins, e.g. `https://brijstays.in,https://www.brijstays.in` |

See [`.env.example`](./.env.example) for the full template with placeholder values.

## Scripts

```sh
npm run develop   # development server with auto-reload
npm run build     # build the Strapi admin panel
npm run start     # production server
```

## Deployment (Render)

1. Render web service rooted at `backend/` in `aniflax/BrijStays`.
2. Set the environment variables above (Neon database, Strapi secrets, R2 credentials).
3. Set `CORS_ORIGINS` to the Cloudflare frontend domain(s).
4. Enable automatic deploys from `main`.

## API and content types

The existing code may include legacy content types and routes. Review and replace them as Brij Stays requirements are defined. Only enable public permissions for endpoints the frontend actually consumes.