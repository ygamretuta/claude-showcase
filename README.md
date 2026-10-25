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

## Cover art

Covers are generated illustrations, one per project, in `design/covers/` (SVG source and 1600x1000 PNG).
`node design/covers/build.mjs` regenerates them; `pnpm covers` also uploads them and sets each matching
work's cover in the connected database. In production, upload the PNGs through `/admin` instead.

## Moving content between databases

`scripts/content-export.ts` writes `content.json` plus media files from the connected database (read-only);
`scripts/content-import.ts` loads them into another database, matching by slug/title so it is safe to re-run.
The import prints the target host and refuses to run unless `CONFIRM_HOST` equals it.

## Migrations

Create them with `pnpm migrate:create <name>`, not `payload migrate:create` directly. The Vercel Blob plugin
adds a column to `media` only when it is enabled (a token is set), so the script sets a dummy token to make the
generated migration match production.
