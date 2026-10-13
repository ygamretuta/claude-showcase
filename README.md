# Claude Showcase

A portfolio of sites built with Claude. Next.js (App Router), Tailwind v4, shadcn/ui, Aceternity UI.

```bash
pnpm dev     # http://localhost:3000
pnpm build
pnpm lint
```

## Structure

- `src/app`: routing only
- `src/features/showcase`: site cards and grid (`components/`, `data/`)
- `src/components/ui`: vendored shadcn / Aceternity components (lint-ignored)

Content is placeholder data in `src/features/showcase/data/sites.ts`; `getSites()` is the seam the CMS will replace.
