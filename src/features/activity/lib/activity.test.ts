import { describe, expect, it } from 'vitest';

import { describeActivity } from './describe';
import { parseRepositoryUrl } from './repository';
import { type GithubCommit, summarizeCommits } from './summary';

const now = new Date('2026-10-13T12:00:00Z');

function commit(sha: string, message: string, date: string): GithubCommit {
  return {
    sha,
    html_url: `https://github.com/o/r/commit/${sha}`,
    commit: { message, author: { date }, committer: { date } },
  };
}

describe('parseRepositoryUrl', () => {
  it('parses plain, .git and trailing-slash URLs', () => {
    expect(parseRepositoryUrl('https://github.com/ygamretuta/colorwheel')).toEqual({
      owner: 'ygamretuta',
      name: 'colorwheel',
    });
    expect(parseRepositoryUrl('https://github.com/a/b.git')).toEqual({ owner: 'a', name: 'b' });
    expect(parseRepositoryUrl('https://www.github.com/a/b/')).toEqual({ owner: 'a', name: 'b' });
    expect(parseRepositoryUrl('https://github.com/a/b/tree/main')).toEqual({ owner: 'a', name: 'b' });
  });

  it('rejects other hosts, bare owners and junk', () => {
    expect(parseRepositoryUrl('https://gitlab.com/a/b')).toBeNull();
    expect(parseRepositoryUrl('https://github.com/a')).toBeNull();
    expect(parseRepositoryUrl('not a url')).toBeNull();
    expect(parseRepositoryUrl(null)).toBeNull();
  });
});

describe('summarizeCommits', () => {
  it('counts the last 30 days and keeps the first message line', () => {
    const summary = summarizeCommits(
      [
        commit('c', 'Newest\n\nbody', '2026-10-12T00:00:00Z'),
        commit('b', 'Within window', '2026-09-20T00:00:00Z'),
        commit('a', 'Too old', '2026-08-01T00:00:00Z'),
      ],
      now,
    );
    expect(summary.commitsLast30Days).toBe(2);
    expect(summary.lastCommitAt).toBe('2026-10-12T00:00:00Z');
    expect(summary.recentCommits[0]?.message).toBe('Newest');
  });

  it('handles an empty repository', () => {
    expect(summarizeCommits([], now)).toEqual({
      lastCommitAt: null,
      commitsLast30Days: 0,
      recentCommits: [],
    });
  });
});

describe('describeActivity', () => {
  it('words recency and counts', () => {
    expect(describeActivity({ lastCommitAt: '2026-10-13T01:00:00Z', commitsLast30Days: 1 }, now)).toBe(
      'Active today · 1 commit this month',
    );
    expect(describeActivity({ lastCommitAt: '2026-10-10T00:00:00Z', commitsLast30Days: 14 }, now)).toBe(
      'Active 3 days ago · 14 commits this month',
    );
    expect(describeActivity({ lastCommitAt: '2026-05-01T00:00:00Z', commitsLast30Days: 0 }, now)).toBe(
      'Active 5 months ago',
    );
  });

  it('is null without a last commit', () => {
    expect(describeActivity({ lastCommitAt: null, commitsLast30Days: 0 }, now)).toBeNull();
  });
});
