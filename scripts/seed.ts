import config from '@payload-config';
import { getPayload } from 'payload';

import { getSites } from '@/features/showcase/data/sites';

/**
 * Seeds placeholder content so a fresh database renders like the design.
 * Idempotent: skips works whose slug already exists. Placeholder cover images
 * are generated gradients so no external assets are needed.
 */
const payload = await getPayload({ config });

const placeholders = [
  { title: 'Colorwheel', summary: 'Placeholder: build color palettes with harmony rules.', tags: ['Tool', 'Color'] },
  { title: 'Pixel Quests', summary: 'Placeholder: a family quest board with rewards.', tags: ['App', 'Family'] },
  { title: 'Project Three', summary: 'Placeholder: a short description of this site.', tags: ['Site'] },
];

const png =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

for (const item of placeholders) {
  const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const existing = await payload.find({ collection: 'works', where: { slug: { equals: slug } }, limit: 1 });
  if (existing.totalDocs > 0) continue;

  const cover = await payload.create({
    collection: 'media',
    data: { title: `${item.title} cover (placeholder)`, alt: `${item.title} placeholder cover` },
    file: { data: Buffer.from(png, 'base64'), mimetype: 'image/png', name: `${slug}.png`, size: 70 },
  });

  const tagIds: number[] = [];
  for (const name of item.tags) {
    const found = await payload.find({ collection: 'tags', where: { name: { equals: name } }, limit: 1 });
    const tag = found.docs[0] ?? (await payload.create({ collection: 'tags', data: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') } }));
    tagIds.push(tag.id);
  }

  await payload.create({
    collection: 'works',
    data: {
      title: item.title,
      slug,
      kind: 'website',
      summary: item.summary,
      cover: cover.id,
      tags: tagIds,
      publishedOn: new Date().toISOString(),
      website: { liveUrl: 'https://example.com' },
      _status: 'published',
    },
  });
}

console.log(`Seeded. ${(await getSites()).length} sites published.`);
process.exit(0);
