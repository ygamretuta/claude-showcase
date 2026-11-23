import type { Motif } from './detect';
import { hsl } from './random';

export const COVER_WIDTH = 1600;
export const COVER_HEIGHT = 1000;
const W = COVER_WIDTH;
const H = COVER_HEIGHT;

export interface SceneContext {
  /** Seeded random numbers in [0, 1). */
  rand: () => number;
  /** Base hue (0-359) derived from the project name and variant. */
  hue: number;
}

const svg = (body: string, defs = ''): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${body}</svg>`;

const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

/** Annular sector between two angles. */
function sector(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  const [x0, y0] = polar(cx, cy, r1, a0);
  const [x1, y1] = polar(cx, cy, r1, a1);
  const [x2, y2] = polar(cx, cy, r0, a1);
  const [x3, y3] = polar(cx, cy, r0, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${x0} ${y0}A${r1} ${r1} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${large} 0 ${x3} ${y3}Z`;
}

const bar = (x: number, y: number, w: number, h: number, fill: string, rx = h / 2): string =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;

// ----------------------------------------------------------------- dashboard
function dashboard({ rand, hue }: SceneContext): string {
  const accent = hsl(hue, 80, 60);
  const accent2 = hsl(hue + 150, 70, 60);
  const panelFill = hsl(hue, 30, 13);
  const panelLine = hsl(hue, 30, 21);
  const muted = hsl(hue, 22, 28);
  const mutedSoft = hsl(hue, 22, 21);
  const grip = [0, 1, 2]
    .map((r) => [0, 1].map((c) => `<circle cx="${28 + c * 9}" cy="${24 + r * 9}" r="2.6" fill="${hsl(hue, 15, 45)}"/>`).join(''))
    .join('');
  const panel = (x: number, y: number, w: number, h: number, content: string): string =>
    `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="22" fill="${panelFill}" stroke="${panelLine}" stroke-width="2"/>${grip}${bar(62, 24, 150, 14, muted)}${content}</g>`;

  // line chart
  let value = 0.25;
  const points: [number, number][] = [];
  for (let i = 0; i < 24; i += 1) {
    value = Math.min(0.92, Math.max(0.12, value + (rand() - 0.36) * 0.16));
    points.push([60 + i * 30.4, 350 - value * 250]);
  }
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
  const area = `${line}L${points[points.length - 1]?.[0] ?? 0} 360L${points[0]?.[0] ?? 0} 360Z`;
  const last = points[points.length - 1] ?? [0, 0];
  const grid = [100, 162, 225, 287, 350].map((y) => `<line x1="40" x2="760" y1="${y}" y2="${y}" stroke="${mutedSoft}" stroke-width="2"/>`).join('');
  const volume = points.map(([x], i) => bar(x - 8, 450 - (14 + ((i * 37) % 40)), 16, 14 + ((i * 37) % 40), muted, 3)).join('');
  const chart = `${grid}<path d="${area}" fill="url(#area)"/><path d="${line}" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="12" fill="${accent}" stroke="${panelFill}" stroke-width="6"/>${volume}`;

  const kpis = [0, 1, 2]
    .map((i) => `<g transform="translate(${30 + i * 170} 76)">${bar(0, 0, 110, 12, muted)}${bar(0, 26, 130, 34, i === 1 ? accent2 : accent, 8)}${bar(0, 76, 80, 10, mutedSoft)}</g>`)
    .join('');

  const donut = `<g transform="translate(40 70)"><path d="${sector(110, 100, 62, 98, 0, 200)}" fill="${accent}"/><path d="${sector(110, 100, 62, 98, 200, 300)}" fill="${accent2}"/><path d="${sector(110, 100, 62, 98, 300, 360)}" fill="${muted}"/></g>
    <g transform="translate(280 100)">${bar(0, 0, 220, 14, muted)}${bar(0, 34, 170, 12, mutedSoft)}${bar(0, 62, 200, 12, mutedSoft)}${bar(0, 90, 140, 12, mutedSoft)}${bar(0, 150, 220, 22, accent)}</g>`;

  const bars = Array.from({ length: 9 }, (_, i) => {
    const h = 40 + rand() * 120;
    return bar(36 + i * 56, 215 - h, 36, h, i % 3 === 0 ? accent2 : accent, 8);
  }).join('');

  const rows = [0, 1, 2, 3]
    .map((i) => `<g transform="translate(30 ${70 + i * 42})">${bar(0, 0, 70, 28, i === 0 ? accent : mutedSoft, 10)}${bar(100, 6, 260 - i * 20, 12, muted)}${bar(560, 4, 90, 18, i % 2 ? accent2 : accent)}</g>`)
    .join('');

  return svg(
    `<rect width="${W}" height="${H}" fill="${hsl(hue, 35, 7)}"/>
     <circle cx="1400" cy="120" r="320" fill="${hsl(hue, 80, 50, 0.08)}"/>
     <circle cx="160" cy="940" r="300" fill="${hsl(hue + 150, 70, 50, 0.08)}"/>
     ${panel(110, 130, 800, 500, chart)}${panel(950, 130, 540, 190, kpis)}${panel(950, 350, 540, 280, donut)}${panel(110, 670, 560, 250, bars)}${panel(710, 670, 780, 250, rows)}`,
    `<linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${accent}" stop-opacity=".35"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></linearGradient>`,
  );
}

// ------------------------------------------------------------------- palette
function palette({ hue }: SceneContext): string {
  const cx = 560;
  const cy = 500;
  let wheel = '';
  for (let i = 0; i < 24; i += 1) {
    wheel += `<path d="${sector(cx, cy, 118, 370, i * 15, (i + 1) * 15)}" fill="${hsl(hue + i * 15, 78, 58)}" stroke="#F6F1EA" stroke-width="5"/>`;
  }
  const hues = [hue, hue + 120, hue + 240];
  const pts = hues.map((h) => polar(cx, cy, 255, h - hue + hue)).map(([x, y]) => [x, y] as const);
  const tri = `<path d="M${pts.map((p) => p.join(' ')).join('L')}Z" fill="none" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>`;
  const dots = pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="34" fill="${hsl(hues[i] ?? hue, 78, 58)}" stroke="#fff" stroke-width="10"/>`).join('');
  const swatches = [hue, hue + 30, hue + 180, hue + 210, hue + 330]
    .map((h, i) => `<g transform="translate(0 ${i * 96})"><rect width="440" height="76" rx="22" fill="${hsl(h, 70 - i * 4, 56 + (i % 2) * 8)}"/>${bar(36, 30, 120, 16, 'rgba(255,255,255,0.75)')}</g>`)
    .join('');
  return svg(
    `<rect width="${W}" height="${H}" fill="${hsl(hue, 35, 95)}"/>
     <circle cx="1450" cy="120" r="260" fill="${hsl(hue + 240, 70, 90)}"/><circle cx="120" cy="900" r="220" fill="${hsl(hue, 80, 90)}"/>
     ${wheel}<circle cx="${cx}" cy="${cy}" r="116" fill="${hsl(hue, 35, 95)}"/><circle cx="${cx}" cy="${cy}" r="62" fill="${hsl(hue, 78, 58)}"/>${tri}${dots}
     <g transform="translate(1040 230)" filter="url(#shadow)"><rect x="-24" y="-24" width="488" height="520" rx="36" fill="#fff"/><g transform="translate(0 0)">${swatches}</g></g>`,
    `<filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#2A2438" flood-opacity=".2"/></filter>`,
  );
}

// ----------------------------------------------------------------------- map
function map({ rand, hue }: SceneContext): string {
  const accent = hsl(hue, 78, 52);
  const cx = 800;
  const cy = 540;
  const streets: string[] = [];
  for (let i = 0; i < 9; i += 1) streets.push(bar(-40 + i * 210, 0, 26, H, '#fff', 13));
  for (let j = 0; j < 6; j += 1) streets.push(bar(0, 60 + j * 190, W, 26, '#fff', 13));
  const pin = (x: number, y: number, color: string): string =>
    `<g transform="translate(${x} ${y})" filter="url(#pinShadow)"><path d="M0 0C-60 -70 -64 -150 0 -150S64 -70 0 0Z" fill="${color}"/><circle cy="-92" r="22" fill="#fff"/><circle cy="-92" r="9" fill="${color}"/></g>`;
  const pins = Array.from({ length: 5 }, (_, i) => {
    const angle = (i / 5) * 360 + rand() * 40;
    const [x, y] = polar(cx, cy + 40, 150 + rand() * 260, angle);
    return pin(x, Math.max(190, Math.min(940, y)), i === 3 ? hsl(hue + 40, 85, 55) : accent);
  }).join('');
  const chip = (x: number, y: number): string =>
    `<g transform="translate(${x} ${y})" filter="url(#pinShadow)"><rect width="190" height="68" rx="34" fill="#fff"/><circle cx="40" cy="34" r="14" fill="#FFB400"/>${bar(72, 20, 64, 12, '#2A2438')}${bar(72, 40, 100, 10, '#CFC8DA')}</g>`;
  return svg(
    `<rect width="${W}" height="${H}" fill="${hsl(hue, 70, 92)}"/>
     <rect x="1180" y="90" width="330" height="220" rx="40" fill="#DDEFC9"/><rect x="70" y="620" width="300" height="250" rx="40" fill="#DDEFC9"/>
     <path d="M-60 330C260 250 520 480 860 400S1380 120 1700 230L1700 330C1380 220 1100 520 800 500S240 420 -60 450Z" fill="#CFE8F2"/>
     ${streets.join('')}
     <circle cx="${cx}" cy="${cy}" r="430" fill="${hsl(hue, 78, 52, 0.05)}" stroke="${accent}" stroke-width="5" stroke-dasharray="4 18" stroke-linecap="round"/>
     <circle cx="${cx}" cy="${cy}" r="290" fill="${hsl(hue, 78, 52, 0.07)}" stroke="${accent}" stroke-width="5" stroke-dasharray="4 18" stroke-linecap="round"/>
     <circle cx="${cx}" cy="${cy}" r="150" fill="${hsl(hue, 78, 52, 0.1)}" stroke="${accent}" stroke-width="6" stroke-dasharray="4 18" stroke-linecap="round"/>
     <circle cx="${cx}" cy="${cy}" r="46" fill="rgba(45,108,223,0.25)"/><circle cx="${cx}" cy="${cy}" r="24" fill="#2D6CDF" stroke="#fff" stroke-width="9"/>
     ${pins}${chip(1040, 215)}${chip(300, 190)}${chip(1250, 790)}`,
    `<filter id="pinShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#2a1a10" flood-opacity=".28"/></filter>`,
  );
}

// --------------------------------------------------------------------- pixel
function pixel({ rand, hue }: SceneContext): string {
  const S = 20;
  const px = (c: number, r: number, color: string, k = 1): string => `<rect x="${c * S}" y="${r * S}" width="${S * k}" height="${S * k}" fill="${color}"/>`;
  const sprite = (map: string[], pal: Record<string, string>, c0: number, r0: number, k = 1): string => {
    let out = '';
    map.forEach((line, r) => [...line].forEach((ch, c) => {
      const color = pal[ch];
      if (color) out += px(c0 + c * k, r0 + r * k, color, k);
    }));
    return out;
  };
  let sky = '';
  for (let i = 0; i < 8; i += 1) sky += `<rect x="0" y="${i * 6 * S}" width="${W}" height="${6 * S + 1}" fill="${hsl(hue + i * 4, 55 + i * 3, 12 + i * 5)}"/>`;
  let stars = '';
  for (let i = 0; i < 70; i += 1) stars += px(Math.floor(rand() * 80), Math.floor(rand() * 24), rand() > 0.7 ? '#FFE98A' : '#fff');
  let moon = '';
  for (let r = -5; r <= 5; r += 1) for (let c = -5; c <= 5; c += 1) if (c * c + r * r <= 25) moon += px(68 + c, 8 + r, '#FFF6D5');
  let hills = '';
  for (let c = 0; c < 80; c += 1) {
    const h = 5 + Math.round(2.5 * Math.sin(c / 5) + 1.8 * Math.sin(c / 2.3 + 1));
    for (let r = 41 - h; r < 41; r += 1) hills += px(c, r, hsl(hue + 10, 45, r === 41 - h ? 22 : 16));
  }
  let ground = '';
  for (let c = 0; c < 80; c += 1) {
    ground += px(c, 41, '#5be06b') + px(c, 42, '#3fbf5f');
    for (let r = 43; r < 50; r += 1) ground += px(c, r, (c + r) % 7 === 0 ? '#6b3f22' : '#7a4a2a');
  }
  const heart = ['.##...##.', '#hh#.####', '#########', '#########', '.#######.', '..#####..', '...###...', '....#....'];
  const coin = ['..####..', '.#YYYY#.', '#YYYYYY#', '#YYooYY#', '#YYooYY#', '#YYYYYY#', '.#YYYY#.', '..####..'];
  const chest = ['..BBBBBBBBBB..', '.BWWWWWWWWWWB.', 'BWWWWWWWWWWWWB', 'BBBBBBBBBBBBBB', 'BWWWWYYYYWWWWB', 'BWWWWYKKYWWWWB', 'BWWWWYYYYWWWWB', 'BWWWWWWWWWWWWB', 'BWWWWWWWWWWWWB', 'BBBBBBBBBBBBBB'];
  const tree = ['..GGG..', '.GGGGG.', 'GGGGGGG', '.GGGGG.', '..GGG..', '...T...', '...T...', '...T...'];
  const spark = (c: number, r: number): string => px(c, r, '#fff') + px(c - 1, r, '#FFE98A') + px(c + 1, r, '#FFE98A') + px(c, r - 1, '#FFE98A') + px(c, r + 1, '#FFE98A');
  return svg(
    `${sky}${stars}${moon}${hills}${ground}
     ${sprite(tree, { G: '#2e9c4f', T: '#5a3a22' }, 8, 25, 2)}${sprite(tree, { G: '#238a43', T: '#5a3a22' }, 30, 25, 2)}
     ${sprite(chest, { B: '#3b1f0e', W: '#b36a2e', Y: '#ffd23f', K: '#3b1f0e' }, 46, 21, 2)}
     ${sprite(heart, { '#': '#e83b3b', h: '#ff9a9a' }, 3, 3)}${sprite(heart, { '#': '#e83b3b', h: '#ff9a9a' }, 14, 3)}${sprite(heart, { '#': '#e83b3b', h: '#ff9a9a' }, 25, 3)}
     ${sprite(coin, { '#': '#b8741a', Y: '#ffd23f', o: '#ffe98a' }, 3, 14)}${spark(40, 16)}${spark(62, 14)}${spark(76, 30)}`,
  );
}

// --------------------------------------------------------------------- cards
function cards({ hue }: SceneContext): string {
  const card = (x: number, y: number, rot: number, scale: number, g: string): string => `
    <g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})" filter="url(#cardShadow)">
      <rect x="-190" y="-250" width="380" height="500" rx="30" fill="#fff"/>
      <rect x="-160" y="-220" width="320" height="200" rx="20" fill="url(#${g})"/><circle cx="-95" cy="-135" r="46" fill="rgba(255,255,255,.35)"/>
      ${bar(-160, 10, 190, 22, '#2A2438')}${bar(-160, 52, 300, 14, '#CFC8DA')}${bar(-160, 80, 250, 14, '#CFC8DA')}
      ${bar(-160, 130, 78, 30, '#E6E1F2')}${bar(-70, 130, 78, 30, '#E6E1F2')}${bar(40, 168, 120, 52, hsl(hue, 70, 55), 26)}
    </g>`;
  const sparkle = (x: number, y: number, r: number): string => `<path transform="translate(${x} ${y})" d="M0 ${-r}Q${r * 0.15} ${-r * 0.15} ${r} 0Q${r * 0.15} ${r * 0.15} 0 ${r}Q${-r * 0.15} ${r * 0.15} ${-r} 0Q${-r * 0.15} ${-r * 0.15} 0 ${-r}Z" fill="#fff" opacity=".9"/>`;
  const grad = (id: string, h: number): string => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hsl(h, 85, 68)}"/><stop offset="1" stop-color="${hsl(h + 50, 85, 58)}"/></linearGradient>`;
  return svg(
    `<rect width="${W}" height="${H}" fill="url(#bg)"/><circle cx="260" cy="180" r="300" fill="rgba(255,255,255,.06)"/><circle cx="1400" cy="860" r="380" fill="rgba(255,255,255,.07)"/>
     ${card(430, 540, -9, 0.9, 'gA')}${card(1170, 540, 9, 0.9, 'gB')}${card(800, 500, 0, 1.12, 'gC')}
     ${sparkle(250, 760, 42)}${sparkle(1360, 200, 56)}${sparkle(560, 120, 28)}${sparkle(1210, 880, 30)}`,
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hsl(hue + 230, 55, 16)}"/><stop offset="1" stop-color="${hsl(hue, 65, 42)}"/></linearGradient>${grad('gA', hue + 20)}${grad('gB', hue + 140)}${grad('gC', hue + 260)}
     <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="26" stdDeviation="26" flood-color="#000" flood-opacity=".4"/></filter>`,
  );
}

// ------------------------------------------------------------------- network
function network({ rand, hue }: SceneContext): string {
  const accent = hsl(hue, 85, 62);
  const warn = hsl(hue + 180, 85, 62);
  const cx = 800;
  const cy = 500;
  const count = 7 + Math.floor(rand() * 3);
  let links = '';
  let nodes = '';
  for (let i = 0; i < count; i += 1) {
    const [x, y] = polar(cx, cy, 270 + rand() * 170, (i / count) * 360 + rand() * 18);
    const alert = i === 2;
    const color = alert ? warn : accent;
    links += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${hsla(color, alert ? 0.6 : 0.35)}" stroke-width="5" ${alert ? 'stroke-dasharray="10 12"' : ''} stroke-linecap="round"/>`;
    nodes += `<g transform="translate(${x - 56} ${y - 40})"><rect width="112" height="80" rx="18" fill="${hsl(hue, 30, 14)}" stroke="${color}" stroke-width="4"/><rect x="14" y="14" width="84" height="40" rx="8" fill="${hsl(hue, 30, 22)}"/>${bar(34, 62, 44, 8, color)}${alert ? `<circle cx="112" cy="0" r="14" fill="${warn}" stroke="${hsl(hue, 35, 8)}" stroke-width="6"/>` : ''}</g>`;
  }
  const rings = [210, 350, 490].map((r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${hsl(hue, 30, 20)}" stroke-width="3" stroke-dasharray="6 14"/>`).join('');
  return svg(
    `<rect width="${W}" height="${H}" fill="${hsl(hue, 35, 7)}"/><circle cx="${cx}" cy="${cy}" r="360" fill="url(#glow)"/>
     ${rings}${links}${nodes}
     <circle cx="${cx}" cy="${cy}" r="86" fill="${hsl(hue, 30, 14)}" stroke="${accent}" stroke-width="6"/><circle cx="${cx}" cy="${cy}" r="42" fill="${accent}"/>
     <path d="M${cx - 26} ${cy + 6}a30 30 0 0 1 52 0M${cx - 14} ${cy + 18}a16 16 0 0 1 28 0" stroke="${hsl(hue, 35, 8)}" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="${cx}" cy="${cy + 28}" r="5" fill="${hsl(hue, 35, 8)}"/>`,
    `<radialGradient id="glow"><stop offset="0" stop-color="${hsl(hue, 85, 55, 0.28)}"/><stop offset="1" stop-color="${hsl(hue, 85, 55, 0)}"/></radialGradient>`,
  );
}

const hsla = (color: string, alpha: number): string => color.replace('hsl(', 'hsla(').replace(')', `, ${alpha})`);

// ---------------------------------------------------------------------- code
function code({ rand, hue }: SceneContext): string {
  const colors = [hsl(hue, 85, 68), hsl(hue + 60, 80, 66), hsl(hue + 180, 75, 66), hsl(hue, 15, 42)];
  let lines = '';
  for (let i = 0; i < 14; i += 1) {
    const indent = i === 0 ? 0 : Math.floor(rand() * 3);
    let x = 300 + indent * 48;
    let segments = '';
    for (let s = 0; s < 2 + Math.floor(rand() * 3); s += 1) {
      const w = 60 + Math.floor(rand() * 160);
      segments += bar(x, 0, w, 16, colors[Math.floor(rand() * colors.length)] ?? '#999');
      x += w + 16;
    }
    lines += `<g transform="translate(0 ${200 + i * 42})">${bar(236, 0, 28, 14, hsl(hue, 15, 26))}${segments}</g>`;
  }
  return svg(
    `<rect width="${W}" height="${H}" fill="${hsl(hue, 35, 7)}"/><circle cx="1350" cy="150" r="340" fill="${hsl(hue, 85, 55, 0.1)}"/><circle cx="200" cy="900" r="320" fill="${hsl(hue + 120, 80, 55, 0.08)}"/>
     <g filter="url(#win)"><rect x="170" y="110" width="1260" height="720" rx="30" fill="${hsl(hue, 25, 12)}" stroke="${hsl(hue, 25, 22)}" stroke-width="2"/></g>
     <circle cx="226" cy="156" r="11" fill="#FF5F57"/><circle cx="262" cy="156" r="11" fill="#FEBC2E"/><circle cx="298" cy="156" r="11" fill="#28C840"/>
     ${bar(520, 146, 240, 20, hsl(hue, 20, 20))}<line x1="170" x2="1430" y1="200" y2="200" stroke="${hsl(hue, 25, 20)}" stroke-width="2"/>
     ${lines}<rect x="${300 + 3 * 48 + 20}" y="${200 + 13 * 42 - 4}" width="12" height="24" fill="${colors[0]}"/>
     <g filter="url(#win)" transform="translate(1000 700)"><rect width="420" height="200" rx="24" fill="${hsl(hue, 30, 9)}" stroke="${hsl(hue, 25, 24)}" stroke-width="2"/><path d="M36 76l22 16-22 16" stroke="${colors[0]}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${bar(80, 84, 200, 14, colors[1] ?? '#999')}${bar(36, 128, 300, 12, colors[3] ?? '#999')}${bar(36, 156, 230, 12, colors[3] ?? '#999')}</g>`,
    `<filter id="win" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="30" stdDeviation="30" flood-color="#000" flood-opacity=".5"/></filter>`,
  );
}

// ------------------------------------------------------------------ abstract
function abstract({ rand, hue }: SceneContext): string {
  let blobs = '';
  for (let i = 0; i < 6; i += 1) {
    blobs += `<circle cx="${rand() * W}" cy="${rand() * H}" r="${160 + rand() * 260}" fill="${hsl(hue + i * 24, 85, 60, 0.4)}"/>`;
  }
  let dots = '';
  for (let r = 0; r < 5; r += 1) for (let c = 0; c < 9; c += 1) dots += `<circle cx="${1010 + c * 56}" cy="${700 + r * 56}" r="5" fill="rgba(255,255,255,.55)"/>`;
  return svg(
    `<rect width="${W}" height="${H}" fill="url(#bg)"/><g filter="url(#blur)">${blobs}</g>
     <g fill="none" stroke="rgba(255,255,255,.7)" stroke-width="6"><circle cx="560" cy="500" r="120"/><circle cx="560" cy="500" r="210" stroke-opacity=".6"/><circle cx="560" cy="500" r="310" stroke-opacity=".4"/><circle cx="560" cy="500" r="420" stroke-opacity=".25"/></g>
     <circle cx="560" cy="500" r="52" fill="#fff"/>
     <g transform="rotate(${Math.round(rand() * 30) - 15} 1150 330)"><rect x="960" y="190" width="380" height="280" rx="48" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="6"/><rect x="1000" y="230" width="300" height="200" rx="32" fill="rgba(255,255,255,.18)"/></g>${dots}`,
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hsl(hue + 230, 60, 16)}"/><stop offset="1" stop-color="${hsl(hue, 70, 36)}"/></linearGradient><filter id="blur"><feGaussianBlur stdDeviation="60"/></filter>`,
  );
}

export const SCENES: Record<Motif, (context: SceneContext) => string> = {
  dashboard,
  palette,
  map,
  pixel,
  cards,
  network,
  code,
  abstract,
};
