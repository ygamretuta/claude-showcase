import config from '@payload-config';
import { unstable_cache } from 'next/cache';
import { getPayload } from 'payload';

import { describeActivity } from '@/features/activity/lib/describe';
import type { Media, Tag } from '@/payload-types';

import type { Site } from './types';

const placeholders: Site[] = [
  {
    slug: 'colorwheel',
    title: 'Colorwheel',
    summary: 'Placeholder: build color palettes with harmony rules and live previews.',
    tags: ['Tool', 'Color'],
    url: '#',
    gradient: 'from-rose-400 via-fuchsia-500 to-indigo-500',
  },
  {
    slug: 'pixel-quests',
    title: 'Pixel Quests',
    summary: 'Placeholder: a family quest board with rewards and bedtime routines.',
    tags: ['App', 'Family'],
    url: '#',
    gradient: 'from-amber-300 via-orange-400 to-rose-500',
  },
  {
    slug: 'placeholder-three',
    title: 'Project Three',
    summary: 'Placeholder: a short description of what this site does.',
    tags: ['Site'],
    url: '#',
    gradient: 'from-emerald-300 via-teal-400 to-sky-500',
  },
  {
    slug: 'placeholder-four',
    title: 'Project Four',
    summary: 'Placeholder: a short description of what this site does.',
    tags: ['Dashboard'],
    url: '#',
    gradient: 'from-sky-300 via-blue-500 to-violet-600',
  },
  {
    slug: 'placeholder-five',
    title: 'Project Five',
    summary: 'Placeholder: a short description of what this site does.',
    tags: ['Landing page'],
    url: '#',
    gradient: 'from-lime-300 via-green-400 to-emerald-600',
  },
  {
    slug: 'placeholder-six',
    title: 'Project Six',
    summary: 'Placeholder: a short description of what this site does.',
    tags: ['Game'],
    url: '#',
    gradient: 'from-purple-400 via-pink-500 to-red-500',
  },
];

const gradients = placeholders.map((site) => site.gradient);

function populated<T extends object>(value: number | T | null | undefined): T | undefined {
  return typeof value === 'object' && value !== null ? value : undefined;
}

/** Published website works from the CMS; placeholders when no database is configured. */
async function loadSites(): Promise<Site[]> {
  if (!process.env.DATABASE_URI && !process.env.DATABASE_URL) return placeholders;

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'works',
    where: { kind: { equals: 'website' }, _status: { equals: 'published' } },
    sort: '-publishedOn',
    depth: 1,
    limit: 50,
  });

  const activity = await payload.find({
    collection: 'repository-activity',
    where: { work: { in: docs.map((work) => work.id) } },
    limit: 200,
    pagination: false,
  });
  const byWork = new Map(
    activity.docs.map((item) => [typeof item.work === 'object' ? item.work.id : item.work, item]),
  );

  return docs.map((work, index) => {
    const snapshot = byWork.get(work.id);
    const cover = populated<Media>(work.cover);
    return {
      slug: work.slug,
      title: work.title,
      summary: work.summary,
      tags: (work.tags ?? []).flatMap((tag) => populated<Tag>(tag)?.name ?? []),
      url: work.website?.liveUrl ?? undefined,
      imageUrl: cover?.sizes?.card?.url ?? cover?.url ?? undefined,
      imageAlt: cover?.alt ?? work.title,
      activityLabel: snapshot
        ? (describeActivity(
            {
              lastCommitAt: snapshot.lastCommitAt ?? null,
              commitsLast30Days: snapshot.commitsLast30Days ?? 0,
            },
            new Date(),
          ) ?? undefined)
        : undefined,
      gradient: gradients[index % gradients.length] ?? gradients[0] ?? '',
    };
  });
}

/** Cached for a minute; the sync and admin endpoints refresh it with `revalidateTag('works')`. */
export const getSites = unstable_cache(loadSites, ['sites'], { tags: ['works'], revalidate: 60 });
