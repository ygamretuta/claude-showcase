import { detectMotif, MOTIF_LABELS, type Motif } from './detect';
import { createRandom, hash } from './random';
import { SCENES } from './scenes';

export interface CoverInput {
  title: string;
  /** What the project does; the main signal for choosing a motif. */
  summary?: string;
  /** Extra words (tags, topics, README excerpt) that sharpen the choice. */
  hint?: string;
  /** Force a motif instead of detecting one. */
  motif?: Motif;
  /** Change this to get a different colour scheme and layout for the same project. */
  variant?: number;
}

export interface GeneratedCover {
  svg: string;
  motif: Motif;
  variant: number;
  alt: string;
}

/** Deterministic: the same input always produces the same illustration. */
export function generateCover(input: CoverInput): GeneratedCover {
  const variant = Math.max(0, Math.floor(input.variant ?? 0));
  const motif = input.motif ?? detectMotif(`${input.title} ${input.summary ?? ''} ${input.hint ?? ''}`);
  const seed = hash(`${input.title}|${motif}|${variant}`);
  const hue = (seed + variant * 47) % 360;
  const svg = SCENES[motif]({ rand: createRandom(seed), hue });
  return {
    svg,
    motif,
    variant,
    alt: `Generated ${MOTIF_LABELS[motif].split(' (')[0]?.toLowerCase() ?? motif} illustration for ${input.title}`,
  };
}
