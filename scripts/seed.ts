import config from '@payload-config';
import { getPayload } from 'payload';

/**
 * Seeds placeholder content so a fresh database renders like the design.
 * Idempotent: skips works whose slug already exists. Placeholder cover images
 * are generated gradients so no external assets are needed.
 */
const payload = await getPayload({ config });

const placeholders = [
  {
    title: 'Colorwheel',
    summary: 'Placeholder: build color palettes with harmony rules.',
    tags: ['Tool', 'Color'],
    liveUrl: 'https://colorwheel-nine.vercel.app',
    repositoryUrl: 'https://github.com/ygamretuta/colorwheel',
  },
  {
    title: 'Pixel Quests',
    summary: 'Placeholder: a family quest board with rewards.',
    tags: ['App', 'Family'],
    liveUrl: 'https://pixel-quests.vercel.app',
    repositoryUrl: 'https://github.com/ygamretuta/pixel-quests',
  },
  {
    title: 'Santayo',
    summary: 'Placeholder: find restaurants near you by craving.',
    tags: ['App', 'Food'],
    liveUrl: 'https://santayo-one.vercel.app',
    repositoryUrl: 'https://github.com/ygamretuta/santayo',
  },
];

const png =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

for (const item of placeholders) {
  const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const existing = await payload.find({ collection: 'works', where: { slug: { equals: slug } }, limit: 1 });
  const current = existing.docs[0];
  if (current) {
    await payload.update({
      collection: 'works',
      id: current.id,
      data: { website: { liveUrl: item.liveUrl, repositoryUrl: item.repositoryUrl } },
    });
    continue;
  }

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
      website: { liveUrl: item.liveUrl, repositoryUrl: item.repositoryUrl },
      _status: 'published',
    },
  });
}

const { totalDocs } = await payload.count({ collection: 'works' });
console.log(`Seeded. ${totalDocs} works.`);
process.exit(0);
