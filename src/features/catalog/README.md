# Catalog (core)

What the portfolio contains.

- **Aggregate root:** `Work` (`works`), drafts enabled. Shared fields: title, slug, kind, summary, cover, tags, published date, credits.
- **Kind-specific details** (one group per kind, shown only when `kind` matches):
  - `website`: live URL (required), repository URL, built-with list, screenshots.
  - `photography`: location, shot date, ordered frames (photo + caption).
  - `video`: role, runtime, embed or file, stills.
- **Invariants:** a work has a title, unique slug, kind, summary (max 280 characters) and cover; visitors only see published works.
- **Depends on:** media (cover, screenshots, frames, stills), taxonomy (tags).
- **Extend by:** adding a value to `WORK_KINDS` and a matching details group.
