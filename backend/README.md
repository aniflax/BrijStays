# Brij Stays — Backend (Strapi 5)

The Brij Stays backend is a Strapi 5 headless CMS being prepared for deployment on Render. It will use Neon PostgreSQL for data and two Cloudflare R2 buckets for media. The production infrastructure and domains have not yet been created.

## Planned architecture

```
Brij Stays Cloudflare Worker frontend
                 │
                 │  public REST API requests
                 ▼
        Strapi 5 CMS on Render (this project)
                 │
                 ├── Neon PostgreSQL
                 └── Two Cloudflare R2 media buckets
```

The database should be reachable only by Render. Configure public API permissions deliberately for the frontend's needs.

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

| Variable | Purpose |
| --- | --- |
| `HOST`, `PORT` | Server host and port |
| `DATABASE_CLIENT=postgres` | Uses PostgreSQL in production |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `DATABASE_SSL`, `DATABASE_SCHEMA` | Neon connection options |
| `APP_KEYS` | Strapi app keys (comma-separated) |
| `ADMIN_JWT_SECRET` | Admin-panel JWT secret |
| `API_TOKEN_SALT` | API-token salt |
| `JWT_SECRET` | Users-permissions JWT secret |
| `TRANSFER_TOKEN_SALT` | Transfer-token salt |
| `ENCRYPTION_KEY` | Transfer encryption key |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret key |
| `R2_ENDPOINT` | R2 S3-compatible endpoint |
| `S3_REGION` | R2 region (usually `auto`) |
| Primary and secondary bucket variables | Configure separate bucket names and public media/CDN URLs when the two buckets are created |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |

Configure all production values in Render, never in Git. Production database credentials, R2 credentials, bucket names, and final domains are not yet assigned.

## Scripts

```sh
npm run develop   # development server with auto-reload
npm run build     # build the Strapi admin panel
npm run start     # production server
```

## Deployment

Deployment is not configured yet. When ready:

1. Create a Render web service sourced from `backend/` in `aniflax/BrijStays`.
2. Configure Neon PostgreSQL environment variables and all Strapi secrets.
3. Configure R2 credentials and separate bucket/public URL settings for the two media buckets.
4. Set `CORS_ORIGINS` to the final Cloudflare frontend domain.
5. Enable automatic deploys from `main`.

## API and content types

The existing code may include legacy content types and routes. Review and replace them as Brij Stays requirements are defined. Only enable public permissions for endpoints the frontend actually consumes.
