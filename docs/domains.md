# Domain model

The portfolio's data is split into bounded contexts. Each lives in `src/features/<domain>/`
with its Payload configuration in `model/` and a README that states its language, aggregates,
invariants and relationships. Payload collections and globals are the persistence form of each
domain's aggregates.

## Context map

```
identity            (who may edit)            supporting
media               (files, embeds)           supporting
taxonomy            (tags)                    supporting
catalog             (works)                   CORE
curation            (exhibits, home page)     core
profile             (owner, site settings)    generic

media <- taxonomy      (taxonomy is independent; shown for layering only)
media <- catalog       catalog references media and tags
catalog <- curation    curation references works
media <- profile       profile references media
```

Dependencies point one way: a domain may reference documents of domains to its left, never the
reverse. Cross-domain references are by id only (Payload relationships); a domain never reaches
into another's internals. Generic helpers live in `src/shared/payload/`.

## Ubiquitous language

| Term | Meaning | Domain |
|---|---|---|
| Work | One piece of portfolio output (a website, a photo series, a film). | catalog |
| Kind | What sort of work it is: `website`, `photography`, `video`. | catalog |
| Frame | One photograph within a photography work, with an optional caption. | catalog |
| Credit | A named contributor and their role on a work. | catalog |
| Media asset | A stored image or video file. | media |
| Video embed | A third-party hosted video played through an embed. | media |
| Tag | A shared label attached to works. | taxonomy |
| Exhibit | A hand-ordered selection of works presented together. | curation |
| Featured works | The ordered works the home page leads with. | curation |
| Profile | The owner's public identity and contact details. | profile |
| Editor | A person allowed to sign in to the admin. | identity |

## Adding photography and video

No new domain is needed. A `Work` with kind `photography` or `video` uses its own details group
(`frames`, or `embed`/`file`/`stills`) and the same media, tags, curation and profile as websites.
New kinds extend `WORK_KINDS` and add a group to `Works`; curation and the front page are unaffected.

## Persistence and migrations

Postgres via Payload. Local development uses the `claude_showcase` database. Schema changes go
through migrations: `pnpm payload migrate:create <name>` then commit `src/migrations/`. The build
runs `payload migrate` before `next build`.
