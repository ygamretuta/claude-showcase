import config from '@payload-config';
import { getPayload } from 'payload';

/**
 * Sets the card summaries of the tracked works (drafted from each project's
 * README). Idempotent. Writes to whatever DATABASE_URI / DATABASE_URL points
 * at, so it prints the host and, for anything but localhost, refuses to run
 * unless CONFIRM_HOST equals it.
 */
const summaries: Record<string, string> = {
  colorwheel:
    'A mobile-first palette builder. Pick a color from a photo, screenshot or by hand, explore harmonies and suggested pairings, then see your palette in poster, fashion and branding mock-ups, including a 60-30-10 example.',
  santayo:
    "Tell it what you're craving and get restaurants within 500 m, 5 km or 10 km, each with a photo, star rating and average price per person. Open one for details, menu, reviews and social review searches.",
  'pixel-quests':
    'A pixel-art quest tracker for kids: real-life tasks become monsters to defeat, coins buy armor from a merchant, and parents approve real rewards.',
  'claude-showcase':
    "This portfolio: a Payload CMS site that discovers my Claude-built repositories on GitHub and shows each project's recent activity on its card.",
};

const host = new URL(process.env.DATABASE_URI ?? process.env.DATABASE_URL ?? '').hostname;
console.log(`Target database host: ${host}`);
if (host !== 'localhost' && process.env.CONFIRM_HOST !== host) {
  throw new Error('Set CONFIRM_HOST to the target database host shown above to continue.');
}

const payload = await getPayload({ config });

for (const [slug, summary] of Object.entries(summaries)) {
  const found = await payload.find({
    collection: 'works',
    where: { slug: { equals: slug } },
    limit: 1,
    draft: true,
  });
  const work = found.docs[0];
  if (!work) {
    console.log(`skip ${slug}: not in this database`);
    continue;
  }
  if (work.summary === summary) {
    console.log(`same ${slug}`);
    continue;
  }
  await payload.update({
    collection: 'works',
    id: work.id,
    data: { summary },
    draft: work._status === 'draft',
  });
  console.log(`updated ${slug} (${work._status})`);
}

process.exit(0);
