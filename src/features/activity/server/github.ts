import type { RepositoryRef } from '../lib/repository';
import type { GithubCommit } from '../lib/summary';

const API = 'https://api.github.com';

export interface GithubRelease {
  name: string | null;
  tag_name: string;
  html_url: string;
  published_at: string | null;
}

export interface GithubRepository {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
}

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get<T>(path: string): Promise<T | null> {
  const response = await fetch(`${API}${path}`, { headers: headers(), cache: 'no-store' });
  // 404: no releases / missing repo. 409: empty repository.
  if (response.status === 404 || response.status === 409) return null;
  if (!response.ok) throw new Error(`GitHub ${response.status} for ${path}`);
  return (await response.json()) as T;
}

export async function listCommits(ref: RepositoryRef, since: Date): Promise<GithubCommit[]> {
  // The 30-day window needs `since`, but the last commit may be older: fall back to the newest.
  const recent = await get<GithubCommit[]>(
    `/repos/${ref.owner}/${ref.name}/commits?per_page=100&since=${since.toISOString()}`,
  );
  if (recent && recent.length > 0) return recent;
  return (await get<GithubCommit[]>(`/repos/${ref.owner}/${ref.name}/commits?per_page=1`)) ?? [];
}

export function latestRelease(ref: RepositoryRef): Promise<GithubRelease | null> {
  return get<GithubRelease>(`/repos/${ref.owner}/${ref.name}/releases/latest`);
}

/** Public repositories of `owner` carrying `topic`. */
export async function listRepositoriesByTopic(
  owner: string,
  topic: string,
): Promise<GithubRepository[]> {
  const result = await get<{ items: GithubRepository[] }>(
    `/search/repositories?q=${encodeURIComponent(`topic:${topic} user:${owner}`)}&per_page=100`,
  );
  return result?.items ?? [];
}
