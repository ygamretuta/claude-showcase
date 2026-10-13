# Media (supporting)

Stored files and hosted videos, independent of what they are used for.

- **Aggregates:** `MediaAsset` (`media`, an upload collection) and `VideoEmbed` (`video-embeds`).
- **Value objects:** focal point, generated image sizes (`thumbnail`, `card`, `hero`).
- **Invariants:** images have alt text; only images and mp4/webm are accepted; reads are public, writes need an editor.
- **Depends on:** nothing. Other domains reference media by id and never own it.
- **Storage:** local `./media` in development, Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set.
