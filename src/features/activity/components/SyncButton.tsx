'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { summarizeReport, type SyncReport } from '../lib/report';

interface SyncButtonProps {
  label?: string;
}

/** Admin list button: discovers newly tagged GitHub repos and refreshes activity for tracked ones. */
export function SyncButton({ label = 'Refresh works' }: SyncButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  async function sync() {
    setBusy(true);
    setMessage(null);
    setFailed(false);
    try {
      const response = await fetch('/api/repository-activity/sync', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Refresh failed (${response.status})`);
      const report = (await response.json()) as SyncReport;
      setFailed(report.failed.length > 0);
      setMessage(summarizeReport(report));
      router.refresh();
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : 'Refresh failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn--style-primary btn--size-medium"
          disabled={busy}
          onClick={() => void sync()}
        >
          {busy ? 'Refreshing…' : label}
        </button>
        {message ? (
          <span role="status" style={{ color: failed ? 'var(--theme-error-500)' : undefined }}>
            {message}
          </span>
        ) : null}
      </div>
      <p style={{ margin: '8px 0 0', opacity: 0.7, fontSize: 13 }}>
        Finds GitHub repos tagged <code>claude-built</code> (new ones are added as drafts) and
        refreshes commit activity for the repos already tracked.
      </p>
    </div>
  );
}
