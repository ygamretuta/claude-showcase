import { MOTIFS, type Motif } from './detect';

export interface CoverRequest {
  title: string;
  summary: string;
  hint: string;
  motif: Motif | undefined;
  variant: number;
  /** false: return a preview only; true: save the image to Media. */
  accept: boolean;
}

export type ParsedCoverRequest = { ok: true; value: CoverRequest } | { ok: false; error: string };

const text = (value: unknown, max: number): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

/** Validates the JSON body sent by the admin panel; never trusts its shape. */
export function parseCoverRequest(raw: unknown): ParsedCoverRequest {
  if (typeof raw !== 'object' || raw === null) return { ok: false, error: 'Expected a JSON object.' };
  const body = raw as Record<string, unknown>;

  const title = text(body.title, 200);
  if (title === '') return { ok: false, error: 'A title is required.' };

  const motif = MOTIFS.find((m) => m === body.motif);
  const variantRaw = typeof body.variant === 'number' ? Math.floor(body.variant) : 0;

  return {
    ok: true,
    value: {
      title,
      summary: text(body.summary, 1000),
      hint: text(body.hint, 1000),
      motif,
      variant: Number.isFinite(variantRaw) ? Math.min(9999, Math.max(0, variantRaw)) : 0,
      accept: body.accept === true,
    },
  };
}
