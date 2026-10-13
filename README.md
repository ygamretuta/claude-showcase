# Claude Showcase

A portfolio of sites built with Claude. Next.js (App Router), Tailwind v4, shadcn/ui, Aceternity UI.

```bash
pnpm dev     # http://localhost:3000
pnpm build
pnpm lint
pnpm test
pnpm sync     # refresh GitHub activity once
```

## Structure

- `src/app`: routing only (`(site)` public pages, `(payload)` admin and API)
- `src/features/showcase`: site cards and grid (`components/`, `data/`)
- `src/components/ui`: vendored shadcn / Aceternity components (lint-ignored)

Content is placeholder data in `src/features/showcase/data/sites.ts`; `getSites()` is the seam the CMS will replace.

## Content management

Payload CMS runs in this app. Admin at `/admin`; domain model in [docs/domains.md](docs/domains.md).

```bash
createdb claude_showcase            # once, local Postgres
cp .env.example .env.local          # set PAYLOAD_SECRET
pnpm payload migrate                # create tables
pnpm seed                           # optional placeholder works
pnpm dev                            # then open /admin and create the first editor
```
