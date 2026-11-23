export interface SyncReport {
  discovered: string[];
  synced: string[];
  failed: { repository: string; error: string }[];
}

/** One-line, human summary of a sync for the admin button. */
export function summarizeReport(report: SyncReport): string {
  const tracked = report.synced.length;
  const parts = [`Refreshed ${tracked} tracked ${tracked === 1 ? 'repo' : 'repos'}.`];
  if (report.discovered.length > 0) {
    parts.push(`Found ${report.discovered.length} new (saved as drafts): ${report.discovered.join(', ')}.`);
  }
  if (report.failed.length > 0) {
    parts.push(`${report.failed.length} failed: ${report.failed.map((f) => f.repository).join(', ')}.`);
  }
  return parts.join(' ');
}
