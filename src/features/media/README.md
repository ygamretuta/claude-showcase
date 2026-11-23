# Media (supporting)

Stored files and hosted videos, independent of what they are used for.

- **Aggregates:** `MediaAsset` (`media`, an upload collection) and `VideoEmbed` (`video-embeds`).
- **Value objects:** focal point, generated image sizes (`thumbnail`, `card`, `hero`).
- **Invariants:** images have alt text; only images and mp4/webm are accepted; reads are public, writes need an editor.
- **Depends on:** nothing. Other domains reference media by id and never own it.
- **Storage:** local `./media` in development, Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set.

## Generated covers (no image to upload)

On a Work's edit page, the **Generate a cover** panel under the Cover field draws an illustration from the
title and summary: it picks a motif by keyword (dashboard, palette, map, pixel game, cards, network, code,
abstract; or choose one), shows a preview, **Shuffle** changes the colours and layout, and **Use this cover**
saves a 1600x1000 PNG to Media and sets it as the cover. No AI and no API key: the scenes are deterministic
SVG (`lib/covers/`), rasterised with sharp in `POST /api/media/generate-cover` (editors only). The admin panel
is `components/GenerateCoverButton.tsx`; the catalog's `coverGenerator` UI field just points at it.
