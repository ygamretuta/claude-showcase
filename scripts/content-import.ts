import { readFileSync } from 'node:fs';
import path from 'node:path';

import config from '@payload-config';
import { getPayload } from 'payload';

/**
 * Imports content exported by scripts/content-export.ts into the connected
 * database. Idempotent: documents are matched by slug (works, tags, exhibits)
 * or title (media, embeds) and updated instead of duplicated.
 *
 * It writes to whatever DATABASE_URI / DATABASE_URL points at, so it prints
 * the target host first and refuses to run without CONFIRM_HOST matching it.
 *
 *   IMPORT_DIR=/some/dir CONFIRM_HOST=<db host> EXCLUDE_SLUGS=project-three \
 *     pnpm payload run scripts/content-import.ts
 */
const importDir = process.env.IMPORT_DIR;
if (!importDir) throw new Error('Set IMPORT_DIR to the exported folder.');
const dir: string = importDir;

const url = new URL(process.env.DATABASE_URI ?? process.env.DATABASE_URL ?? '');
console.log(`Target database host: ${url.hostname}`);
if (process.env.CONFIRM_HOST !== url.hostname) {
  throw new Error('Set CONFIRM_HOST to the target database host shown above to continue.');
}

type Doc = Record<string, unknown> & { id: number };
const content = JSON.parse(readFileSync(path.join(dir, 'content.json'), 'utf8')) as {
  media: Doc[];
  tags: Doc[];
  embeds: Doc[];
  works: Doc[];
  exhibits: Doc[];
  globals: Record<'home' | 'profile' | 'siteSettings', Doc>;
};
const exclude = new Set((process.env.EXCLUDE_SLUGS ?? '').split(',').filter(Boolean));

const payload = await getPayload({ config });
const ids = { media: new Map<number, number>(), tags: new Map<number, number>(), embeds: new Map<number, number>(), works: new Map<number, number>() };

const refId = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : typeof value === 'object' && value !== null ? (value as { id: number }).id : undefined;
const strip = (doc: Doc): Record<string, unknown> => {
  const rest: Record<string, unknown> = { ...doc };
  delete rest.id;
  delete rest.createdAt;
  delete rest.updatedAt;
  return rest;
};

async function ensureMedia(oldId: number | undefined): Promise<number | undefined> {
  if (oldId === undefined) return undefined;
  const cached = ids.media.get(oldId);
  if (cached) return cached;
  const source = content.media.find((item) => item.id === oldId);
  if (!source) return undefined;

  const existing = await payload.find({ collection: 'media', where: { title: { equals: source.title as string } }, limit: 1 });
  let id = existing.docs[0]?.id;
  if (!id) {
    const data = readFileSync(path.join(dir, 'files', source.filename as string));
    const created = await payload.create({
      collection: 'media',
      data: { title: source.title, alt: source.alt, caption: source.caption, credit: source.credit, capturedOn: source.capturedOn } as never,
      file: { data, mimetype: source.mimeType as string, name: source.filename as string, size: data.length },
    });
    id = created.id;
  }
  ids.media.set(oldId, id);
  return id;
}

async function mediaList(values: unknown): Promise<number[]> {
  const out: number[] = [];
  for (const value of (values as unknown[] | undefined) ?? []) {
    const id = await ensureMedia(refId(value));
    if (id) out.push(id);
  }
  return out;
}

async function upsert(collection: 'tags' | 'works' | 'exhibits' | 'video-embeds', where: object, data: Record<string, unknown>, draft = false): Promise<number> {
  const found = await payload.find({ collection, where: where as never, limit: 1, draft: true });
  const existing = found.docs[0];
  if (existing) {
    await payload.update({ collection, id: existing.id, data: data as never, draft });
    return existing.id;
  }
  const created = await payload.create({ collection, data: data as never, draft });
  return created.id;
}

for (const tag of content.tags) {
  ids.tags.set(tag.id, await upsert('tags', { slug: { equals: tag.slug } }, { name: tag.name, slug: tag.slug }));
}

for (const embed of content.embeds) {
  const poster = await ensureMedia(refId(embed.poster));
  ids.embeds.set(embed.id, await upsert('video-embeds', { title: { equals: embed.title } }, { ...strip(embed), poster }));
}

for (const work of content.works) {
  if (exclude.has(work.slug as string)) {
    console.log(`skip ${work.slug as string} (excluded)`);
    continue;
  }
  const data = strip(work) as Record<string, Record<string, unknown> | unknown>;
  const website = work.website as Record<string, unknown> | undefined;
  const photography = work.photography as { frames?: { photo: unknown; caption?: string }[] } & Record<string, unknown> | undefined;
  const video = work.video as Record<string, unknown> | undefined;
  const isDraft = work._status === 'draft';

  const body: Record<string, unknown> = {
    ...data,
    cover: await ensureMedia(refId(work.cover)),
    tags: ((work.tags as unknown[] | undefined) ?? []).map((tag) => ids.tags.get(refId(tag) as number)).filter(Boolean),
    website: website ? { ...website, screenshots: await mediaList(website.screenshots) } : undefined,
    photography: photography
      ? {
          ...photography,
          frames: await Promise.all(
            (photography.frames ?? []).map(async (frame) => ({ ...frame, photo: await ensureMedia(refId(frame.photo)) })),
          ),
        }
      : undefined,
    video: video
      ? {
          ...video,
          embed: ids.embeds.get(refId(video.embed) as number),
          file: await ensureMedia(refId(video.file)),
          stills: await mediaList(video.stills),
        }
      : undefined,
  };
  ids.works.set(work.id, await upsert('works', { slug: { equals: work.slug } }, body, isDraft));
  console.log(`${isDraft ? 'draft    ' : 'published'} ${work.slug as string}`);
}

for (const exhibit of content.exhibits) {
  const items = ((exhibit.items as { work: unknown; note?: string }[] | undefined) ?? [])
    .map((item) => ({ ...item, work: ids.works.get(refId(item.work) as number) }))
    .filter((item) => item.work);
  await upsert('exhibits', { slug: { equals: exhibit.slug } }, { ...strip(exhibit), items }, exhibit._status === 'draft');
}

const { home, profile, siteSettings } = content.globals;
if (home.headline) {
  await payload.updateGlobal({
    slug: 'home',
    data: {
      headline: home.headline,
      intro: home.intro,
      featuredWorks: ((home.featuredWorks as unknown[] | undefined) ?? []).map((w) => ids.works.get(refId(w) as number)).filter(Boolean),
    } as never,
  });
}
if (profile.displayName) {
  await payload.updateGlobal({
    slug: 'profile',
    data: { ...strip(profile), portrait: await ensureMedia(refId(profile.portrait)) } as never,
  });
}
if (siteSettings.siteTitle) {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { ...strip(siteSettings), shareImage: await ensureMedia(refId(siteSettings.shareImage)) } as never,
  });
}

console.log('Import finished.');
process.exit(0);
