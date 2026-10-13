import { readFileSync } from 'node:fs';
import path from 'node:path';

import config from '@payload-config';
import { getPayload } from 'payload';

/**
 * Uploads the generated cover PNGs (design/covers) and sets them as the cover
 * of the matching work. Skips works that do not exist in this database.
 * Run `node design/covers/build.mjs` first to regenerate the images.
 */
const covers = [
  {
    slug: 'colorwheel',
    title: 'Colorwheel',
    alt: 'Illustration of a 24-segment color wheel with a triadic harmony triangle, next to a UI mock-up card colored with the palette.',
  },
  {
    slug: 'santayo',
    title: 'Santayo',
    alt: 'Illustration of a street map with three dashed distance rings around a blue location dot, orange restaurant pins and star-rating chips.',
  },
  {
    slug: 'pixel-quests',
    title: 'Pixel Quests',
    alt: 'Pixel-art night scene with a knight, a sword, a treasure chest, hearts and a coin.',
  },
  {
    slug: 'claude-showcase',
    title: 'Claude Showcase',
    alt: 'Three portfolio cards with gradient thumbnails and a cursor over the center card, on a purple background.',
  },
];

const payload = await getPayload({ config });

for (const cover of covers) {
  const found = await payload.find({
    collection: 'works',
    where: { slug: { equals: cover.slug } },
    limit: 1,
    draft: true,
  });
  const work = found.docs[0];
  if (!work) {
    console.log(`skip ${cover.slug}: no such work in this database`);
    continue;
  }

  const file = path.resolve('design/covers', `${cover.slug}.png`);
  const data = readFileSync(file);
  const media = await payload.create({
    collection: 'media',
    data: { title: `${cover.title} cover`, alt: cover.alt },
    file: { data, mimetype: 'image/png', name: `${cover.slug}-cover.png`, size: data.length },
  });

  await payload.update({
    collection: 'works',
    id: work.id,
    data: { cover: media.id },
    draft: work._status === 'draft',
  });
  console.log(`set cover for ${cover.slug} (${work._status})`);
}

process.exit(0);
