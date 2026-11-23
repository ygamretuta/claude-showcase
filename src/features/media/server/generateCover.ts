import type { PayloadRequest } from 'payload';
import sharp from 'sharp';

import { slugify } from '@/shared/payload/slugField';

import { generateCover } from '../lib/covers/generate';
import { parseCoverRequest } from '../lib/covers/request';

/**
 * POST /api/media/generate-cover (editors only).
 * Without `accept` it returns the SVG for a preview; with `accept` it renders a PNG and
 * saves it as a Media asset, returning its id so the form can set it as the cover.
 */
export async function handleGenerateCover(req: PayloadRequest): Promise<Response> {
  if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = parseCoverRequest(await req.json?.().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const { title, summary, hint, motif, variant, accept } = parsed.value;

  const cover = generateCover({ title, summary, hint, motif, variant });
  if (!accept) {
    return Response.json({ svg: cover.svg, motif: cover.motif, variant: cover.variant, alt: cover.alt });
  }

  const png = await sharp(Buffer.from(cover.svg)).png({ compressionLevel: 9 }).toBuffer();
  const media = await req.payload.create({
    collection: 'media',
    data: { title: `${title} cover (generated)`, alt: cover.alt },
    file: {
      data: png,
      mimetype: 'image/png',
      name: `${slugify(title) || 'cover'}-generated-${cover.variant}.png`,
      size: png.length,
    },
    user: req.user,
  });
  return Response.json({ id: media.id, alt: cover.alt, motif: cover.motif });
}
