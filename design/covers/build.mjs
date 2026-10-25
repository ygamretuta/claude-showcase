// Generates the cover illustrations (SVG + PNG) for each tracked project.
// Run: node design/covers/build.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const W = 1600;
const H = 1000;
const out = dirname(fileURLToPath(import.meta.url));

const svg = (body, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${body}</svg>`;

const polar = (cx, cy, r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

/** Annular sector path between two angles. */
function sector(cx, cy, r0, r1, a0, a1) {
  const [x0, y0] = polar(cx, cy, r1, a0);
  const [x1, y1] = polar(cx, cy, r1, a1);
  const [x2, y2] = polar(cx, cy, r0, a1);
  const [x3, y3] = polar(cx, cy, r0, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${x0} ${y0}A${r1} ${r1} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${large} 0 ${x3} ${y3}Z`;
}

// ---------------------------------------------------------------- colorwheel
function colorwheel() {
  const cx = 600;
  const cy = 500;
  const segments = 24;
  let wheel = '';
  for (let i = 0; i < segments; i += 1) {
    const hue = (i * 360) / segments;
    const a0 = (i * 360) / segments;
    const a1 = ((i + 1) * 360) / segments;
    wheel += `<path d="${sector(cx, cy, 118, 370, a0, a1)}" fill="hsl(${hue} 78% 58%)" stroke="#F6F1EA" stroke-width="5"/>`;
  }
  const base = 15;
  const hues = [base, base + 120, base + 240];
  const pts = hues.map((h) => polar(cx, cy, 260, h));
  const tri = `<path d="M${pts.map((p) => p.join(' ')).join('L')}Z" fill="rgba(255,255,255,0.0)" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>`;
  const dots = pts
    .map(
      (p, i) =>
        `<circle cx="${p[0]}" cy="${p[1]}" r="34" fill="hsl(${hues[i]} 78% 58%)" stroke="#fff" stroke-width="10"/>`,
    )
    .join('');
  const hole = `<circle cx="${cx}" cy="${cy}" r="116" fill="#F6F1EA"/><circle cx="${cx}" cy="${cy}" r="62" fill="hsl(${base} 80% 58%)"/>`;

  // UI mock-up card using the palette
  const p1 = `hsl(${base} 80% 58%)`;
  const p2 = `hsl(${base + 120} 55% 45%)`;
  const p3 = `hsl(${base + 240} 65% 60%)`;
  const card = `
    <g transform="translate(1040 190)">
      <rect width="440" height="560" rx="32" fill="#fff" filter="url(#shadow)"/>
      <rect width="440" height="170" rx="32" fill="${p1}"/>
      <rect y="120" width="440" height="50" fill="${p1}"/>
      <circle cx="64" cy="64" r="26" fill="#fff" opacity=".9"/>
      <rect x="110" y="50" width="170" height="16" rx="8" fill="#fff" opacity=".9"/>
      <rect x="110" y="78" width="110" height="12" rx="6" fill="#fff" opacity=".6"/>
      <rect x="40" y="210" width="360" height="18" rx="9" fill="#2A2438"/>
      <rect x="40" y="248" width="300" height="12" rx="6" fill="#CFC8DA"/>
      <rect x="40" y="274" width="330" height="12" rx="6" fill="#CFC8DA"/>
      <rect x="40" y="318" width="170" height="64" rx="32" fill="${p3}"/>
      <rect x="230" y="318" width="170" height="64" rx="32" fill="none" stroke="${p2}" stroke-width="6"/>
      <rect x="40" y="420" width="90" height="90" rx="20" fill="${p1}"/>
      <rect x="150" y="420" width="90" height="90" rx="20" fill="${p2}"/>
      <rect x="260" y="420" width="90" height="90" rx="20" fill="${p3}"/>
      <rect x="370" y="420" width="30" height="90" rx="15" fill="hsl(${base} 60% 92%)"/>
    </g>`;
  return svg(
    `<rect width="${W}" height="${H}" fill="#F6F1EA"/>
     <circle cx="1450" cy="120" r="260" fill="hsl(${base + 240} 70% 90%)"/>
     <circle cx="120" cy="900" r="220" fill="hsl(${base} 80% 90%)"/>
     ${wheel}${hole}${tri}${dots}${card}`,
    `<filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#2A2438" flood-opacity=".22"/></filter>`,
  );
}

// ------------------------------------------------------------------- santayo
function pin(x, y, icon, color = '#E8512F') {
  const icons = {
    fork: `<g fill="#fff"><rect x="-13" y="-22" width="5" height="18" rx="2"/><rect x="-3" y="-22" width="5" height="18" rx="2"/><rect x="7" y="-22" width="5" height="18" rx="2"/><rect x="-13" y="-8" width="25" height="7" rx="3"/><rect x="-3" y="-4" width="5" height="26" rx="2.5"/></g>`,
    plate: `<circle r="20" fill="none" stroke="#fff" stroke-width="5"/><circle r="9" fill="#fff"/>`,
    knife: `<path d="M-4 -24C12 -22 14 -2 6 8L6 24L-3 24L-3 -24Z" fill="#fff"/>`,
    cup: `<path d="M-16 -16H12L9 14Q8 20 2 20H-6Q-12 20-13 14Z" fill="#fff"/><path d="M12 -8H20Q24 -8 24 -2 24 6 16 6" fill="none" stroke="#fff" stroke-width="5"/>`,
  };
  return `<g transform="translate(${x} ${y})" filter="url(#pinShadow)">
    <path d="M0 0C-60 -70 -64 -150 0 -150S64 -70 0 0Z" fill="${color}" transform="translate(0 0)"/>
    <g transform="translate(0 -92) scale(1.1)">${icons[icon]}</g>
  </g>`;
}

function chip(x, y) {
  const star = `<path d="M0 -17L5 -6L17 -5L8 3L11 15L0 9L-11 15L-8 3L-17 -5L-5 -6Z" fill="#FFB400"/>`;
  return `<g transform="translate(${x} ${y})" filter="url(#pinShadow)">
    <rect width="190" height="68" rx="34" fill="#fff"/>
    <g transform="translate(40 34)">${star}</g>
    <rect x="72" y="20" width="64" height="12" rx="6" fill="#2A2438"/>
    <rect x="72" y="40" width="100" height="10" rx="5" fill="#CFC8DA"/>
  </g>`;
}

function santayo() {
  const cx = 800;
  const cy = 560;
  const streets = [];
  for (let i = 0; i < 9; i += 1) streets.push(`<rect x="${-40 + i * 210}" y="0" width="26" height="${H}" rx="13" fill="#fff"/>`);
  for (let j = 0; j < 6; j += 1) streets.push(`<rect x="0" y="${60 + j * 190}" width="${W}" height="26" rx="13" fill="#fff"/>`);
  return svg(
    `<rect width="${W}" height="${H}" fill="#FFEFD9"/>
     <rect x="1180" y="90" width="330" height="220" rx="40" fill="#DDEFC9"/>
     <rect x="70" y="620" width="300" height="250" rx="40" fill="#DDEFC9"/>
     <path d="M-60 330C260 250 520 480 860 400S1380 120 1700 230L1700 330C1380 220 1100 520 800 500S240 420 -60 450Z" fill="#CFE8F2"/>
     ${streets.join('')}
     <circle cx="${cx}" cy="${cy}" r="430" fill="rgba(232,81,47,0.05)" stroke="#E8512F" stroke-width="5" stroke-dasharray="4 18" stroke-linecap="round"/>
     <circle cx="${cx}" cy="${cy}" r="290" fill="rgba(232,81,47,0.07)" stroke="#E8512F" stroke-width="5" stroke-dasharray="4 18" stroke-linecap="round"/>
     <circle cx="${cx}" cy="${cy}" r="150" fill="rgba(232,81,47,0.10)" stroke="#E8512F" stroke-width="6" stroke-dasharray="4 18" stroke-linecap="round"/>
     <circle cx="${cx}" cy="${cy}" r="46" fill="rgba(45,108,223,0.25)"/>
     <circle cx="${cx}" cy="${cy}" r="24" fill="#2D6CDF" stroke="#fff" stroke-width="9"/>
     ${pin(560, 470, 'fork')}${pin(1010, 400, 'plate')}${pin(1180, 730, 'knife')}${pin(430, 780, 'cup', '#F29B1D')}${pin(850, 880, 'fork', '#C23B22')}
     ${chip(1040, 215)}${chip(300, 190)}${chip(1250, 790)}`,
    `<filter id="pinShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#5a2a10" flood-opacity=".28"/></filter>`,
  );
}

// -------------------------------------------------------------- pixel-quests
function pixelQuests() {
  const S = 20;
  const cols = W / S;
  const rows = H / S;
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const px = (c, r, color, k = 1) =>
    `<rect x="${c * S}" y="${r * S}" width="${S * k}" height="${S * k}" fill="${color}"/>`;
  const sprite = (map, pal, c0, r0, k = 1) => {
    let s = '';
    map.forEach((line, r) => {
      [...line].forEach((ch, c) => {
        if (pal[ch]) s += px(c0 + c * k, r0 + r * k, pal[ch], k);
      });
    });
    return s;
  };

  const bands = ['#1b1464', '#271a78', '#34208a', '#4a2a9a', '#6a36a6', '#94459f', '#c4559b', '#ee7a8f'];
  let sky = '';
  bands.forEach((color, i) => {
    sky += `<rect x="0" y="${i * 6 * S}" width="${W}" height="${6 * S + 1}" fill="${color}"/>`;
  });
  let stars = '';
  for (let i = 0; i < 70; i += 1) {
    const c = Math.floor(rnd() * cols);
    const r = Math.floor(rnd() * 24);
    stars += px(c, r, rnd() > 0.7 ? '#FFE98A' : '#fff', 1);
  }
  // moon
  let moon = '';
  for (let r = -6; r <= 6; r += 1)
    for (let c = -6; c <= 6; c += 1)
      if (c * c + r * r <= 36) moon += px(70 + c, 8 + r, c * c + (r + 1) * (r + 1) > 25 && c > 1 ? '#D8D2F0' : '#FFF6D5');
  // hills
  let hills = '';
  for (let c = 0; c < cols; c += 1) {
    const h = 5 + Math.round(2.5 * Math.sin(c / 5) + 1.8 * Math.sin(c / 2.3 + 1));
    for (let r = 41 - h; r < 41; r += 1) hills += px(c, r, r === 41 - h ? '#3b2a8a' : '#2a1a5e');
  }
  // ground
  let ground = '';
  for (let c = 0; c < cols; c += 1) {
    ground += px(c, 41, '#5be06b') + px(c, 42, '#3fbf5f');
    for (let r = 43; r < rows; r += 1) ground += px(c, r, (c + r) % 7 === 0 ? '#6b3f22' : '#7a4a2a');
    if (c % 5 === 2) ground += px(c, 40, '#5be06b');
  }

  const heart = ['.##...##.', '#hh#.####'.replace('#hh#', '#hh#'), '#########', '#########', '.#######.', '..#####..', '...###...', '....#....'];
  const heartPal = { '#': '#e83b3b', h: '#ff9a9a' };
  const coin = ['..####..', '.#YYYY#.', '#YYYYYY#', '#YYooYY#', '#YYooYY#', '#YYYYYY#', '.#YYYY#.', '..####..'];
  const coinPal = { '#': '#b8741a', Y: '#ffd23f', o: '#ffe98a' };
  const chest = [
    '..BBBBBBBBBB..',
    '.BWWWWWWWWWWB.',
    'BWWWWWWWWWWWWB',
    'BBBBBBBBBBBBBB',
    'BWWWWYYYYWWWWB',
    'BWWWWYKKYWWWWB',
    'BWWWWYYYYWWWWB',
    'BWWWWWWWWWWWWB',
    'BWWWWWWWWWWWWB',
    'BBBBBBBBBBBBBB',
  ];
  const chestPal = { B: '#3b1f0e', W: '#b36a2e', Y: '#ffd23f', K: '#3b1f0e' };
  const hero = [
    '...MMMM...',
    '..MMMMMM..',
    '..MFFFFM..',
    '..MFEFEM..',
    '..MFFFFM..',
    '...MMMM...',
    '.MMBBBBMM.',
    'SMMBBBBMMS',
    'SMMBBBBMMS',
    '.MMBBBBMM.',
    '..BB..BB..',
    '..BB..BB..',
    '..LL..LL..',
    '.LLL..LLL.',
  ];
  const heroPal = { M: '#c9d3e6', F: '#f4c9a0', E: '#2b2b2b', B: '#3a6fe0', S: '#8a93a8', L: '#5a3a22' };
  const sword = ['..K..', '.KWK.', '.KWK.', '.KWK.', '.KWK.', '.KWK.', '.KWK.', '.KWK.', 'KKKKK', '.KBK.', '.KBK.', '..K..'];
  const swordPal = { K: '#2b2f4a', W: '#e8eefc', B: '#a8662b' };
  const bang = ['.YY.', '.YY.', '.YY.', '.YY.', '.YY.', '....', '.YY.', '.YY.'];
  const bangPal = { Y: '#ffd23f' };
  const spark = (c, r) => px(c, r, '#fff') + px(c - 1, r, '#FFE98A') + px(c + 1, r, '#FFE98A') + px(c, r - 1, '#FFE98A') + px(c, r + 1, '#FFE98A');

  const hud =
    sprite(heart, heartPal, 3, 3, 1) +
    sprite(heart, heartPal, 14, 3, 1) +
    sprite(heart, heartPal, 25, 3, 1).replace(/#e83b3b/g, '#5a2a6a').replace(/#ff9a9a/g, '#5a2a6a') +
    sprite(coin, coinPal, 3, 14, 1) +
    px(13, 16, '#fff', 1) + px(14, 16, '#fff') + px(15, 16, '#fff') + px(16, 16, '#fff') + px(17, 16, '#FFE98A');

  return svg(
    `${sky}${stars}${moon}${hills}${ground}
     ${sprite(sword, swordPal, 38, 17, 2)}
     ${spark(35, 20)}${spark(46, 14)}${spark(76, 28)}${spark(8, 30)}
     ${sprite(chest, chestPal, 50, 21, 2)}
     ${sprite(bang, bangPal, 58, 4, 2)}
     ${sprite(hero, heroPal, 14, 13, 2)}
     ${hud}`,
  );
}

// ------------------------------------------------------------ claude-showcase
function showcase() {
  const card = (x, y, rot, scale, g0, g1, z) => `
    <g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})" filter="url(#cardShadow)">
      <rect x="-190" y="-250" width="380" height="500" rx="30" fill="#fff"/>
      <rect x="-160" y="-220" width="320" height="200" rx="20" fill="url(#${g0})"/>
      <circle cx="-95" cy="-135" r="46" fill="rgba(255,255,255,.35)"/>
      <rect x="-160" y="10" width="190" height="22" rx="11" fill="#2A2438"/>
      <rect x="-160" y="52" width="300" height="14" rx="7" fill="#CFC8DA"/>
      <rect x="-160" y="80" width="250" height="14" rx="7" fill="#CFC8DA"/>
      <rect x="-160" y="130" width="78" height="30" rx="15" fill="#E6E1F2"/>
      <rect x="-70" y="130" width="78" height="30" rx="15" fill="#E6E1F2"/>
      <rect x="40" y="168" width="120" height="52" rx="26" fill="url(#${g1})"/>
    </g>`;
  const sparkle = (x, y, r) =>
    `<path transform="translate(${x} ${y})" d="M0 ${-r}Q${r * 0.15} ${-r * 0.15} ${r} 0Q${r * 0.15} ${r * 0.15} 0 ${r}Q${-r * 0.15} ${r * 0.15} ${-r} 0Q${-r * 0.15} ${-r * 0.15} 0 ${-r}Z" fill="#fff" opacity=".9"/>`;
  return svg(
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>
     <circle cx="260" cy="180" r="300" fill="rgba(255,255,255,.06)"/>
     <circle cx="1400" cy="860" r="380" fill="rgba(255,255,255,.07)"/>
     ${card(430, 540, -9, 0.9, 'gA', 'gP', 1)}
     ${card(1170, 540, 9, 0.9, 'gB', 'gP', 1)}
     ${card(800, 500, 0, 1.12, 'gC', 'gP', 2)}
     <g transform="translate(940 640) rotate(-8)" filter="url(#cardShadow)">
       <path d="M0 0L0 112L30 86L52 134L76 123L54 76L96 76Z" fill="#fff" stroke="#2A2438" stroke-width="6" stroke-linejoin="round"/>
     </g>
     ${sparkle(250, 760, 42)}${sparkle(1360, 200, 56)}${sparkle(560, 120, 28)}${sparkle(1210, 880, 30)}`,
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e1b4b"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
     <linearGradient id="gA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fb7185"/><stop offset="1" stop-color="#f59e0b"/></linearGradient>
     <linearGradient id="gB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34d399"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient>
     <linearGradient id="gC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#ec4899"/></linearGradient>
     <linearGradient id="gP" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6d28d9"/><stop offset="1" stop-color="#a855f7"/></linearGradient>
     <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="26" stdDeviation="26" flood-color="#0b0630" flood-opacity=".4"/></filter>`,
  );
}


// -------------------------------------------------------------- pse-tracker
function pseTracker() {
  const up = '#22C55E';
  const down = '#EF4444';
  let seed = 11;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const grip = [0, 1, 2]
    .map((r) => [0, 1].map((c) => `<circle cx="${28 + c * 9}" cy="${24 + r * 9}" r="2.6" fill="#64748B"/>`).join(''))
    .join('');
  /** A widget: rounded panel with a grip and a title bar; content is in panel-local coordinates. */
  const panel = (x, y, w, h, content, extra = '') =>
    `<g transform="translate(${x} ${y})" ${extra}><rect width="${w}" height="${h}" rx="22" fill="#131C2E" stroke="#22304A" stroke-width="2"/>${grip}<rect x="62" y="24" width="150" height="14" rx="7" fill="#33435F"/>${content}</g>`;

  // price chart (local coords of the 800x500 panel)
  const chartTop = 100;
  const chartBottom = 350;
  let price = 0.18;
  let candles = '';
  let volume = '';
  for (let i = 0; i < 22; i += 1) {
    const open = price;
    price = Math.min(0.92, Math.max(0.08, price + (rnd() - 0.34) * 0.3));
    const close = price;
    const hi = Math.max(open, close) + rnd() * 0.06;
    const lo = Math.min(open, close) - rnd() * 0.06;
    const y = (v) => chartBottom - v * (chartBottom - chartTop);
    const color = close >= open ? up : down;
    const x = 70 + i * 32;
    candles += `<line x1="${x}" x2="${x}" y1="${y(hi)}" y2="${y(lo)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/><rect x="${x - 8}" y="${y(Math.max(open, close))}" width="16" height="${Math.max(6, Math.abs(y(open) - y(close)))}" rx="3" fill="${color}"/>`;
    const h = 14 + rnd() * 44;
    volume += `<rect x="${x - 8}" y="${450 - h}" width="16" height="${h}" rx="3" fill="#33435F"/>`;
  }
  const gridlines = [100, 162, 225, 287, 350]
    .map((y) => `<line x1="40" x2="760" y1="${y}" y2="${y}" stroke="#1E2B44" stroke-width="2"/>`)
    .join('');
  const chart = gridlines + candles + volume;

  // watchlist rows (540x190 panel)
  const row = (y, positive) => {
    const c = positive ? up : down;
    const tri = positive ? 'M0 20L12 0L24 20Z' : 'M0 0L12 20L24 0Z';
    return `<g transform="translate(0 ${y})"><rect x="30" y="0" width="86" height="40" rx="10" fill="#1E2B44"/><rect x="134" y="8" width="150" height="13" rx="6.5" fill="#33435F"/><rect x="134" y="28" width="80" height="9" rx="4.5" fill="#25344F"/><path transform="translate(380 8)" d="${tri}" fill="${c}"/><rect x="430" y="12" width="76" height="16" rx="8" fill="${c}" opacity=".85"/></g>`;
  };
  const watchlist = row(70, true) + row(124, false);

  // market breadth (540x280 panel): donut + bars
  const donut = `<g transform="translate(40 80)"><path d="${sector(110, 100, 62, 98, 0, 214)}" fill="${up}"/><path d="${sector(110, 100, 62, 98, 214, 360)}" fill="${down}"/></g>
    <g transform="translate(280 110)"><rect width="220" height="14" rx="7" fill="#33435F"/><rect y="34" width="170" height="12" rx="6" fill="#25344F"/><rect y="62" width="200" height="12" rx="6" fill="#25344F"/><rect y="90" width="140" height="12" rx="6" fill="#25344F"/></g>
    <g transform="translate(280 230)"><rect width="220" height="22" rx="11" fill="${down}"/><rect width="140" height="22" rx="11" fill="${up}"/></g>`;

  // "Put money on" calculator (560x250 panel)
  const calc = `<rect x="30" y="70" width="230" height="52" rx="14" fill="#1E2B44"/><rect x="300" y="70" width="230" height="52" rx="14" fill="#1E2B44"/><rect x="30" y="150" width="500" height="64" rx="32" fill="${up}"/><rect x="190" y="174" width="180" height="16" rx="8" fill="#0B1220" opacity=".65"/>`;

  // news widget being dragged (360x270 panel)
  const news = `<g transform="translate(30 90)"><rect width="300" height="14" rx="7" fill="#33435F"/><rect y="30" width="240" height="12" rx="6" fill="#25344F"/><rect y="68" width="290" height="14" rx="7" fill="#33435F"/><rect y="98" width="210" height="12" rx="6" fill="#25344F"/></g>`;

  return svg(
    `<rect width="${W}" height="${H}" fill="#0B1220"/>
     <circle cx="1400" cy="120" r="320" fill="rgba(34,197,94,0.07)"/>
     <circle cx="160" cy="940" r="300" fill="rgba(59,130,246,0.09)"/>
     ${panel(110, 130, 800, 500, chart)}
     ${panel(950, 130, 540, 190, watchlist)}
     ${panel(950, 350, 540, 280, donut)}
     ${panel(110, 670, 560, 250, calc)}
     <rect x="710" y="700" width="380" height="220" rx="22" fill="rgba(59,130,246,0.06)" stroke="#3B82F6" stroke-width="4" stroke-dasharray="14 12" opacity=".8"/>
     <g transform="rotate(-3 1310 785)">${panel(1130, 650, 360, 270, news, 'filter="url(#lift)"')}</g>
     <g transform="translate(1010 770) rotate(-8)" filter="url(#lift)"><path d="M0 0L0 112L30 86L52 134L76 123L54 76L96 76Z" fill="#fff" stroke="#0B1220" stroke-width="6" stroke-linejoin="round"/></g>`,
    `<filter id="lift" x="-20%" y="-20%" width="150%" height="160%"><feDropShadow dx="0" dy="30" stdDeviation="24" flood-color="#000" flood-opacity=".55"/></filter>`,
  );
}

const covers = {
  colorwheel,
  santayo,
  'pixel-quests': pixelQuests,
  'claude-showcase': showcase,
  'pse-tracker': pseTracker,
};

for (const [slug, make] of Object.entries(covers)) {
  const markup = make();
  writeFileSync(join(out, `${slug}.svg`), markup);
  await sharp(Buffer.from(markup)).png({ compressionLevel: 9 }).toFile(join(out, `${slug}.png`));
  console.log('wrote', slug);
}
