/** FNV-1a hash of a string, as an unsigned 32-bit integer. */
export function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Seeded random numbers in [0, 1): the same seed always gives the same sequence. */
export function createRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** CSS colour; the comma form with `hsla` renders everywhere, including librsvg. */
export function hsl(h: number, s: number, l: number, a = 1): string {
  const hue = ((Math.round(h) % 360) + 360) % 360;
  return a === 1 ? `hsl(${hue}, ${s}%, ${l}%)` : `hsla(${hue}, ${s}%, ${l}%, ${a})`;
}
