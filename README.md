# Brij Stays

Brij Stays is a hospitality and accommodation website being converted to a headless, server-rendered architecture.

## Planned stack

- **Frontend:** React + TanStack Start, deployed to Cloudflare Workers
- **CMS/API:** Strapi v5, deployed on Render
- **Database:** Neon PostgreSQL
- **Media:** two Cloudflare R2 buckets, served through configured public media/CDN domains

## Repository

`git@github.com:aniflax/BrijStays.git`

The project is not hosted yet. Deployment domains, Render service details, Cloudflare Worker configuration, and R2 bucket names will be added when those services are created.

## Project layout

- `Frontend/` — frontend application
- `backend/` — Strapi backend

See [AGENTS.md](AGENTS.md) for architecture, local development, deployment, and environment-variable guidance.
