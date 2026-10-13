'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Report {
  discovered: string[];
  synced: string[];
  failed: { repository: string; error: string }[];
}

export function SyncButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function sync() {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch('/api/repository-activity/sync', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Sync failed (${response.status})`);
      const report = (await response.json()) as Report;
      setMessage(
        `Synced ${report.synced.length}, discovered ${report.discovered.length} new, ${report.failed.length} failed.`,
      );
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Sync failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
      <button
        type="button"
        className="btn btn--style-primary btn--size-medium"
        disabled={busy}
        onClick={() => void sync()}
      >
        {busy ? 'Syncing…' : 'Sync now'}
      </button>
      {message ? <span>{message}</span> : null}
    </div>
  );
}
