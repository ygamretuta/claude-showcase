# Profile (generic)

Who the portfolio belongs to.

- **Aggregates:** `Profile` global (name, headline, bio, portrait, email, availability, social links) and `SiteSettings` global (site title, description, share image).
- **Invariants:** each is a singleton; reads are public, updates need an editor.
- **Depends on:** media (portrait, share image).
