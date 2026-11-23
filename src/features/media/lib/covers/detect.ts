export const MOTIFS = [
  'dashboard',
  'palette',
  'map',
  'pixel',
  'cards',
  'network',
  'code',
  'abstract',
] as const;
export type Motif = (typeof MOTIFS)[number];

export const MOTIF_LABELS: Record<Motif, string> = {
  dashboard: 'Dashboard (charts and widgets)',
  palette: 'Palette (color wheel)',
  map: 'Map (places and pins)',
  pixel: 'Pixel game (8-bit scene)',
  cards: 'Cards (portfolio / content)',
  network: 'Network (connected devices)',
  code: 'Code (editor window)',
  abstract: 'Abstract (shapes)',
};

/** Word stems that suggest each motif; the motif with the most hits wins. */
const KEYWORDS: Record<Exclude<Motif, 'abstract'>, string[]> = {
  dashboard: ['dashboard', 'stock', 'finance', 'financ', 'trad', 'market', 'chart', 'analytic', 'metric', 'widget', 'invest', 'budget', 'expens', 'report', 'monitor', 'track'],
  palette: ['color', 'colour', 'palette', 'design', 'hue', 'theme', 'paint', 'swatch', 'font', 'style'],
  map: ['map', 'restaurant', 'food', 'place', 'location', 'near', 'travel', 'trip', 'route', 'city', 'hotel', 'cafe', 'delivery', 'geo', 'gps'],
  pixel: ['game', 'quest', 'pixel', 'rpg', '8-bit', 'monster', 'play', 'arcade', 'level', 'puzzle', 'kids', 'reward'],
  cards: ['portfolio', 'blog', 'cms', 'landing', 'website', 'site', 'showcase', 'content', 'gallery', 'catalog', 'store', 'shop'],
  network: ['network', 'router', 'wifi', 'wi-fi', 'device', 'security', 'firewall', 'lan', 'server', 'iot', 'protect', 'scan'],
  code: ['code', 'developer', 'cli', 'api', 'library', 'sdk', 'compiler', 'terminal', 'script', 'framework', 'plugin', 'tool', 'automation', 'bot'],
};

/** Picks the motif that best matches the words describing a project. */
export function detectMotif(text: string): Motif {
  const haystack = text.toLowerCase();
  let best: Motif = 'abstract';
  let bestScore = 0;
  for (const motif of Object.keys(KEYWORDS) as (keyof typeof KEYWORDS)[]) {
    const score = KEYWORDS[motif].reduce((sum, stem) => sum + (haystack.includes(stem) ? 1 : 0), 0);
    if (score > bestScore) {
      best = motif;
      bestScore = score;
    }
  }
  return best;
}
