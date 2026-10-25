import { readFileSync } from 'node:fs';
import path from 'node:path';

import config from '@payload-config';
import { getPayload } from 'payload';

/**
 * Creates the tracked works that do not exist yet, with their tags and cover
 * (design/covers/<slug>.png). Existing works are left alone, so edits made in
 * the admin are never overwritten. Writes to whatever DATABASE_URI /
 * DATABASE_URL points at; for anything but localhost it refuses to run unless
 * CONFIRM_HOST equals the host it prints.
 */
interface WorkSeed {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  coverAlt: string;
  liveUrl?: string;
  repositoryUrl?: string;
}

const works: WorkSeed[] = [
  {
    slug: 'pse-tracker',
    title: 'PSE Tracker',
    summary:
      'A local-only dashboard for the Philippine Stock Exchange. Drag, resize and add widgets (price charts, watchlist, top movers, market news) and plan a trade with board lots, broker fees and break-even worked out for you.',
    tags: ['App', 'Finance'],
    coverAlt:
      'Illustration of a dark stock dashboard with draggable widgets: a candlestick chart, a watchlist, a market breadth donut and a trade calculator, with a widget being dragged to a drop target.',
    // Private repository and not hosted online: no links.
  },
];

const host = new URL(process.env.DATABASE_URI ?? process.env.DATABASE_URL ?? '').hostname;
console.log(`Target database host: ${host}`);
if (host !== 'localhost' && process.env.CONFIRM_HOST !== host) {
  throw new Error('Set CONFIRM_HOST to the target database host shown above to continue.');
}

const payload = await getPayload({ config });

for (const work of works) {
  const existing = await payload.find({
    collection: 'works',
    where: { slug: { equals: work.slug } },
    limit: 1,
    draft: true,
  });
  if (existing.totalDocs > 0) {
    console.log(`exists ${work.slug}`);
    continue;
  }

  const tagIds: number[] = [];
  for (const name of work.tags) {
    const found = await payload.find({ collection: 'tags', where: { name: { equals: name } }, limit: 1 });
    const tag =
      found.docs[0] ??
      (await payload.create({
        collection: 'tags',
        data: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
      }));
    tagIds.push(tag.id);
  }

  const png = readFileSync(path.resolve('design/covers', `${work.slug}.png`));
  const cover = await payload.create({
    collection: 'media',
    data: { title: `${work.title} cover`, alt: work.coverAlt },
    file: { data: png, mimetype: 'image/png', name: `${work.slug}-cover.png`, size: png.length },
  });

  await payload.create({
    collection: 'works',
    data: {
      title: work.title,
      slug: work.slug,
      kind: 'website',
      summary: work.summary,
      cover: cover.id,
      tags: tagIds,
      publishedOn: new Date().toISOString(),
      website: { liveUrl: work.liveUrl, repositoryUrl: work.repositoryUrl },
      _status: 'published',
    },
  });
  console.log(`created ${work.slug}`);
}

process.exit(0);
