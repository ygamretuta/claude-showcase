import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import { detectMotif, MOTIFS } from './detect';
import { generateCover } from './generate';
import { COVER_HEIGHT, COVER_WIDTH } from './scenes';

describe('detectMotif', () => {
  it('matches what a project does', () => {
    expect(detectMotif('PSE Tracker a local dashboard for stock charts and widgets')).toBe('dashboard');
    expect(detectMotif('Colorwheel: build a color palette with harmonies')).toBe('palette');
    expect(detectMotif('Find restaurants near you on a map')).toBe('map');
    expect(detectMotif('A pixel-art quest game for kids')).toBe('pixel');
    expect(detectMotif('Network Protector monitors devices on your home wifi')).toBe('network');
    expect(detectMotif('A CLI developer tool and API library')).toBe('code');
  });

  it('falls back to abstract when nothing matches', () => {
    expect(detectMotif('Zzz qqq')).toBe('abstract');
  });
});

describe('generateCover', () => {
  it('is deterministic and varies with the variant', () => {
    const a = generateCover({ title: 'Santayo', summary: 'restaurants on a map' });
    const b = generateCover({ title: 'Santayo', summary: 'restaurants on a map' });
    const c = generateCover({ title: 'Santayo', summary: 'restaurants on a map', variant: 1 });
    expect(a.svg).toBe(b.svg);
    expect(a.svg).not.toBe(c.svg);
    expect(a.motif).toBe('map');
  });

  it('honours a forced motif and describes it in the alt text', () => {
    const cover = generateCover({ title: 'My App', motif: 'code' });
    expect(cover.motif).toBe('code');
    expect(cover.alt).toBe('Generated code illustration for My App');
  });

  it.each(MOTIFS)('renders a valid %s scene to a PNG of the right size', async (motif) => {
    const { svg } = generateCover({ title: 'Sample project', summary: 'sample', motif });
    expect(svg.startsWith('<svg')).toBe(true);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    const meta = await sharp(png).metadata();
    expect([meta.width, meta.height]).toEqual([COVER_WIDTH, COVER_HEIGHT]);

    // Set COVER_PREVIEW_DIR to write the images out and look at them.
    const dir = process.env.COVER_PREVIEW_DIR;
    if (dir) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(path.join(dir, `${motif}.png`), png);
    }
  });
});

describe('parseCoverRequest', () => {
  it('requires a title and ignores junk', async () => {
    const { parseCoverRequest } = await import('./request');
    expect(parseCoverRequest(null)).toEqual({ ok: false, error: 'Expected a JSON object.' });
    expect(parseCoverRequest({ title: '   ' })).toEqual({ ok: false, error: 'A title is required.' });
    expect(parseCoverRequest({ title: 'A', motif: 'not-a-motif', variant: -5, accept: 'yes' })).toEqual({
      ok: true,
      value: { title: 'A', summary: '', hint: '', motif: undefined, variant: 0, accept: false },
    });
  });

  it('keeps valid options', async () => {
    const { parseCoverRequest } = await import('./request');
    expect(parseCoverRequest({ title: 'A', summary: 'b', motif: 'map', variant: 3, accept: true })).toEqual({
      ok: true,
      value: { title: 'A', summary: 'b', hint: '', motif: 'map', variant: 3, accept: true },
    });
  });
});
