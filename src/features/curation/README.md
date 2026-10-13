# Curation (core)

How works are selected, ordered and presented.

- **Aggregates:** `Exhibit` (`exhibits`, drafts enabled) and the `Home` global.
- **Exhibit:** title, slug, intro, and an ordered list of items (a work plus an optional curator note); at least one item.
- **Home:** headline, intro and ordered featured works. Empty featured list means all published works.
- **Invariants:** curation never changes a work; it only references it. Order is the order stored.
- **Depends on:** catalog (works).
