export interface RepositoryRef {
  owner: string;
  name: string;
}

/** Extracts `owner/name` from a github.com URL; null for anything else. */
export function parseRepositoryUrl(url: string | null | undefined): RepositoryRef | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
  if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') return null;

  const [owner, rawName] = parsed.pathname.split('/').filter(Boolean);
  const name = rawName?.replace(/\.git$/, '');
  if (!owner || !name) return null;
  return { owner, name };
}

export function repositoryKey(ref: RepositoryRef): string {
  return `${ref.owner}/${ref.name}`;
}
