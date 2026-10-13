import type { Payload } from 'payload';

import { parseRepositoryUrl, repositoryKey } from '../lib/repository';
import { summarizeCommits } from '../lib/summary';
import { latestRelease, listCommits, listRepositoriesByTopic } from './github';

const TOPIC = 'claude-built';

export interface SyncReport {
  discovered: string[];
  synced: string[];
  failed: { repository: string; error: string }[];
}

/**
 * Creates draft works for repositories tagged `claude-built` that have no work yet.
 * Drafts need a cover and an editor's review before they appear on the site.
 */
async function discover(payload: Payload, owner: string, report: SyncReport): Promise<void> {
  const repositories = await listRepositoriesByTopic(owner, TOPIC);

  for (const repository of repositories) {
    const existing = await payload.find({
      collection: 'works',
      where: { 'website.repositoryUrl': { equals: repository.html_url } },
      limit: 1,
      draft: true,
    });
    if (existing.totalDocs > 0) continue;

    await payload.create({
      collection: 'works',
      draft: true,
      data: {
        title: repository.name,
        kind: 'website',
        summary: repository.description ?? 'Add a short summary.',
        website: {
          liveUrl: repository.homepage ?? repository.html_url,
          repositoryUrl: repository.html_url,
        },
      },
    });
    report.discovered.push(repository.full_name);
  }
}

/** Discovers new repositories, then refreshes the activity snapshot of every tracked work. */
export async function syncActivity(payload: Payload): Promise<SyncReport> {
  const report: SyncReport = { discovered: [], synced: [], failed: [] };
  const owner = process.env.GITHUB_OWNER ?? 'ygamretuta';

  try {
    await discover(payload, owner, report);
  } catch (error) {
    report.failed.push({ repository: `topic:${TOPIC}`, error: String(error) });
  }

  const works = await payload.find({
    collection: 'works',
    where: { 'website.repositoryUrl': { exists: true } },
    limit: 200,
    pagination: false,
    draft: true,
  });

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  for (const work of works.docs) {
    const ref = parseRepositoryUrl(work.website?.repositoryUrl);
    if (!ref) continue;
    const repository = repositoryKey(ref);
    const syncedAt = new Date().toISOString();

    try {
      const [commits, release] = await Promise.all([listCommits(ref, since), latestRelease(ref)]);
      const summary = summarizeCommits(commits, new Date());
      const data = {
        work: work.id,
        repository,
        lastCommitAt: summary.lastCommitAt,
        commitsLast30Days: summary.commitsLast30Days,
        recentCommits: summary.recentCommits,
        latestRelease: release
          ? { name: release.name ?? release.tag_name, url: release.html_url, publishedAt: release.published_at }
          : {},
        syncedAt,
        syncError: null,
      };
      const existing = await payload.find({
        collection: 'repository-activity',
        where: { work: { equals: work.id } },
        limit: 1,
      });
      const current = existing.docs[0];
      if (current) {
        await payload.update({ collection: 'repository-activity', id: current.id, data });
      } else {
        await payload.create({ collection: 'repository-activity', data });
      }
      report.synced.push(repository);
    } catch (error) {
      report.failed.push({ repository, error: String(error) });
    }
  }

  return report;
}
