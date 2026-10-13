import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import config from '@payload-config';
import { getPayload } from 'payload';

/**
 * Exports the content of the connected database to a folder: `content.json`
 * plus the media files. Read-only. Pair with scripts/content-import.ts.
 *
 *   EXPORT_DIR=/some/dir pnpm payload run scripts/content-export.ts
 */
const dir = process.env.EXPORT_DIR;
if (!dir) throw new Error('Set EXPORT_DIR to the folder to write into.');

const payload = await getPayload({ config });
const all = { limit: 0, pagination: false, depth: 0, draft: true } as const;

const media = await payload.find({ collection: 'media', ...all });
const tags = await payload.find({ collection: 'tags', ...all });
const embeds = await payload.find({ collection: 'video-embeds', ...all });
const works = await payload.find({ collection: 'works', ...all });
const exhibits = await payload.find({ collection: 'exhibits', ...all });

mkdirSync(path.join(dir, 'files'), { recursive: true });
for (const item of media.docs) {
  if (item.filename) {
    copyFileSync(path.resolve('media', item.filename), path.join(dir, 'files', item.filename));
  }
}

const content = {
  media: media.docs,
  tags: tags.docs,
  embeds: embeds.docs,
  works: works.docs,
  exhibits: exhibits.docs,
  globals: {
    home: await payload.findGlobal({ slug: 'home', depth: 0 }),
    profile: await payload.findGlobal({ slug: 'profile', depth: 0 }),
    siteSettings: await payload.findGlobal({ slug: 'site-settings', depth: 0 }),
  },
};
writeFileSync(path.join(dir, 'content.json'), JSON.stringify(content, null, 2));
console.log(
  `Exported ${media.totalDocs} media, ${tags.totalDocs} tags, ${works.totalDocs} works, ${exhibits.totalDocs} exhibits to ${dir}`,
);
process.exit(0);
