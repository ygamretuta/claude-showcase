'use client';

import { useField, useFormFields } from '@payloadcms/ui';
import { useState } from 'react';

import { MOTIF_LABELS, MOTIFS, type Motif } from '../lib/covers/detect';

interface Preview {
  svg: string;
  motif: Motif;
  variant: number;
}

const box = { border: '1px solid var(--theme-elevation-150)', borderRadius: 8, padding: 16, marginBottom: 24 } as const;
const row = { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 12 } as const;

/**
 * Alternative to uploading an image: draws a cover from the work's title and summary.
 * Nothing is saved to Media until "Use this cover" is pressed.
 */
export function GenerateCoverButton() {
  const title = useFormFields(([fields]) => fields.title?.value as string | undefined) ?? '';
  const summary = useFormFields(([fields]) => fields.summary?.value as string | undefined) ?? '';
  const { value: cover, setValue: setCover } = useField<number | null>({ path: 'cover' });

  const [motif, setMotif] = useState<Motif | ''>('');
  const [hint, setHint] = useState('');
  const [variant, setVariant] = useState(0);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  async function request(nextVariant: number, accept: boolean) {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch('/api/media/generate-cover', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, summary, hint, motif: motif || undefined, variant: nextVariant, accept }),
      });
      const data = (await response.json()) as { error?: string; svg?: string; id?: number; motif: Motif; variant: number };
      if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status})`);
      if (accept && data.id !== undefined) {
        setCover(data.id);
        setMessage({ text: 'Cover set to the generated image. Save the work to keep it.', error: false });
      } else if (data.svg) {
        setPreview({ svg: data.svg, motif: data.motif, variant: data.variant });
      }
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Something went wrong.', error: true });
    } finally {
      setBusy(false);
    }
  }

  function shuffle() {
    const next = variant + 1;
    setVariant(next);
    void request(next, false);
  }

  const canGenerate = title.trim() !== '' && !busy;

  return (
    <div style={box}>
      <strong>Generate a cover</strong>
      <p style={{ margin: '4px 0 0', opacity: 0.7, fontSize: 13 }}>
        No image to upload? Draw one from this work&apos;s title and summary. Nothing is saved until you press
        &ldquo;Use this cover&rdquo;.{cover ? ' (A cover is already set; this will replace it.)' : ''}
      </p>

      <div style={row}>
        <label>
          <span style={{ display: 'block', fontSize: 13, opacity: 0.7 }}>Style</span>
          <select value={motif} onChange={(e) => setMotif(e.target.value as Motif | '')} style={{ minWidth: 200, maxWidth: '100%', height: 40 }}>
            <option value="">Auto (match the summary)</option>
            {MOTIFS.map((m) => (
              <option key={m} value={m}>{MOTIF_LABELS[m]}</option>
            ))}
          </select>
        </label>
        <label style={{ flex: 1, minWidth: 220 }}>
          <span style={{ display: 'block', fontSize: 13, opacity: 0.7 }}>Extra words (optional)</span>
          <input
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="e.g. chart, map, game, network"
            style={{ width: '100%', height: 40 }}
          />
        </label>
      </div>

      <div style={row}>
        <button type="button" className="btn btn--style-secondary btn--size-medium" disabled={!canGenerate} onClick={() => void request(variant, false)}>
          {preview ? 'Regenerate' : 'Preview'}
        </button>
        <button type="button" className="btn btn--style-secondary btn--size-medium" disabled={!canGenerate} onClick={shuffle}>
          Shuffle
        </button>
        <button type="button" className="btn btn--style-primary btn--size-medium" disabled={!canGenerate || !preview} onClick={() => void request(preview?.variant ?? variant, true)}>
          Use this cover
        </button>
        {title.trim() === '' ? <span style={{ fontSize: 13, opacity: 0.7 }}>Add a title first.</span> : null}
        {busy ? <span style={{ fontSize: 13, opacity: 0.7 }}>Working…</span> : null}
      </div>

      {message ? (
        <p role="status" style={{ marginTop: 12, color: message.error ? 'var(--theme-error-500)' : undefined }}>{message.text}</p>
      ) : null}

      {preview ? (
        <figure style={{ margin: '16px 0 0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URL, not an optimisable asset */}
          <img
            alt={`Preview: ${MOTIF_LABELS[preview.motif]}`}
            src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(preview.svg)}`}
            style={{ width: '100%', maxWidth: 560, aspectRatio: '16 / 10', borderRadius: 12, display: 'block' }}
          />
          <figcaption style={{ fontSize: 13, opacity: 0.7, marginTop: 8 }}>
            {MOTIF_LABELS[preview.motif]} &middot; variant {preview.variant}
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}
