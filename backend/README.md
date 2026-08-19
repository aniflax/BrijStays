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

| Variable group | Purpose |
| --- | --- |
| `HOST`, `PORT` | Server host and port |
| `DATABASE_CLIENT=postgres`, `DATABASE_URL`, `DATABASE_SSL`, `DATABASE_SCHEMA` | Neon PostgreSQL configuration |
| `APP_KEYS`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY` | Required Strapi secrets |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `S3_REGION` | Cloudflare R2 S3-compatible connection |
| Bucket-name and public media/CDN variables for both buckets | Two-bucket media configuration; exact names are to be set during infrastructure setup |
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

The existing code may include inherited Unityaliving content types and routes. Review and replace them as Brij Stays requirements are defined. Only enable public permissions for endpoints the frontend actually consumes.
