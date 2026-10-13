# Activity (supporting)

GitHub activity for the repositories behind works. Read-only to editors; written by the sync job.

- **Aggregate:** `RepositoryActivity` (`repository-activity`): one snapshot per work with last commit date, commits in the last 30 days, the 5 most recent commits, latest release, `syncedAt` and `syncError`.
- **Invariants:** one snapshot per work; created and updated only by the sync (create/update are closed to REST and the admin UI); reads are public.
- **Depends on:** catalog (reads `website.repositoryUrl`, creates draft works during discovery). Catalog does not depend on activity.
- **Discovery:** public repositories of `GITHUB_OWNER` (default `ygamretuta`) with the GitHub topic `claude-built` get a **draft** work if none references their URL. An editor adds a cover and publishes.
- **Sync:** daily Vercel cron `GET /api/cron/github-sync` (needs `CRON_SECRET`), the admin **Sync now** button (`POST /api/repository-activity/sync`, editors only), or `pnpm sync` locally.
- **GitHub access:** unauthenticated by default (60 requests/hour, enough for a daily sync). Set `GITHUB_TOKEN` for a higher limit or private repositories; commit messages are public on the site, so only track repositories you are happy to show.
- **Pure logic** (`lib/`): URL parsing, commit summarising and wording are unit tested (`pnpm test`).
