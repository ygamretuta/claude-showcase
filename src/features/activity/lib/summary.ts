export interface GithubCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { date: string } | null;
    committer: { date: string } | null;
  };
}

export interface CommitSummary {
  sha: string;
  message: string;
  committedAt: string;
  url: string;
}

export interface ActivitySummary {
  lastCommitAt: string | null;
  commitsLast30Days: number;
  recentCommits: CommitSummary[];
}

const DAY_MS = 24 * 60 * 60 * 1000;
const RECENT_LIMIT = 5;

/** Reduces a newest-first commit list to what a portfolio card needs. */
export function summarizeCommits(commits: GithubCommit[], now: Date): ActivitySummary {
  const mapped = commits.map((commit): CommitSummary => ({
    sha: commit.sha,
    message: commit.commit.message.split('\n')[0] ?? '',
    committedAt: commit.commit.committer?.date ?? commit.commit.author?.date ?? '',
    url: commit.html_url,
  }));
  const cutoff = now.getTime() - 30 * DAY_MS;
  const recent = mapped.filter((commit) => Date.parse(commit.committedAt) >= cutoff);

  return {
    lastCommitAt: mapped[0]?.committedAt ?? null,
    commitsLast30Days: recent.length,
    recentCommits: mapped.slice(0, RECENT_LIMIT),
  };
}
