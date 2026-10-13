const DAY_MS = 24 * 60 * 60 * 1000;

/** "Active today · 14 commits this month", or null when there is nothing to say. */
export function describeActivity(
  activity: { lastCommitAt?: string | null; commitsLast30Days: number },
  now: Date,
): string | null {
  if (!activity.lastCommitAt) return null;
  const days = Math.max(0, Math.floor((now.getTime() - Date.parse(activity.lastCommitAt)) / DAY_MS));

  const when =
    days === 0 ? 'today' : days === 1 ? 'yesterday' : days < 60 ? `${days} days ago` : `${Math.floor(days / 30)} months ago`;
  const { commitsLast30Days: count } = activity;
  const commits = count === 0 ? '' : ` · ${count} commit${count === 1 ? '' : 's'} this month`;
  return `Active ${when}${commits}`;
}
