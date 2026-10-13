# Identity (supporting)

Who may sign in to the admin.

- **Aggregate:** `Editor` (`users`), Payload auth collection.
- **Invariants:** only authenticated editors can create, update or delete anything; visitors have read access only, and only to published content.
- **Depends on:** nothing.
- **Extend by:** adding roles here; domains keep using the `isAuthenticated` helper in `src/shared/payload/access.ts` until finer access is needed.
