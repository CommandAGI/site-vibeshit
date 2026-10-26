/*
 * VibeShit's order sheet. One file, no dependencies, no network: the catalog is data, the run lives in
 * localStorage and in the URL hash, and the only way anything leaves this page is a link the visitor copies
 * or a mailto they send themselves (connect-src 'none' in the page's CSP enforces the rest).
 */
'use strict';

const LOCALES = ['en', 'es', 'zh-Hans'];

/** The three lines, then the pieces in them. `days` is the partner's production window; `min` its smallest run. */
const LINES = {
  headwear: { en: 'Headwear', es: 'Sombreros', 'zh-Hans': '帽子' },
  trinkets: { en: 'Trinkets', es: 'Chácharas', 'zh-Hans': '小物' },
  threads: { en: 'Threads', es: 'Prendas', 'zh-Hans': '衣物' },
};

const COLORS = {
  ink: { hex: '#121417', en: 'Ink', es: 'Tinta', 'zh-Hans': '墨黑' },
  bone: { hex: '#e8e2d3', en: 'Bone', es: 'Hueso', 'zh-Hans': '骨白' },
  signal: { hex: '#e2541f', en: 'Signal', es: 'Señal', 'zh-Hans': '信号橙' },
  moss: { hex: '#3d4b3a', en: 'Moss', es: 'Musgo', 'zh-Hans': '苔绿' },
  oat: { hex: '#d8c9a8', en: 'Oat', es: 'Avena', 'zh-Hans': '燕麦' },
  clay: { hex: '#b4644a', en: 'Clay', es: 'Arcilla', 'zh-Hans': '陶土' },
  brass: { hex: '#b08d4f', en: 'Brass', es: 'Latón', 'zh-Hans': '黄铜' },
  nickel: { hex: '#8d9299', en: 'Black nickel', es: 'Níquel negro', 'zh-Hans': '黑镍' },
};

const ITEMS = [
  {
    id: 'cap', line: 'headwear', days: [14, 18], min: 12,
    name: { en: 'Structured cap', es: 'Gorra estructurada', 'zh-Hans': '硬顶棒球帽' },
    note: {
      en: 'Heavy cotton twill, six panels, embroidery front or side.',
      es: 'Sarga de algodón gruesa, seis paneles, bordado al frente o al lado.',
      'zh-Hans': '厚棉斜纹，六片帽型，正面或侧面刺绣。',
    },
    colors: ['ink', 'bone', 'signal'],
  },
  {
    id: 'beanie', line: 'headwear', days: [14, 18], min: 12,
    name: { en: 'Rib beanie', es: 'Gorro acanalado', 'zh-Hans': '罗纹针织帽' },
    note: {
      en: 'Merino blend, cuff or flat, a woven label or a small embroidery.',
      es: 'Mezcla de merino, con vuelta o liso, etiqueta tejida o bordado pequeño.',
      'zh-Hans': '美利奴混纺，翻边或平口，织唛或小面积刺绣。',
    },
    colors: ['moss', 'ink', 'oat'],
  },
  {
    id: 'pin', line: 'trinkets', days: [18, 24], min: 25,
    name: { en: 'Soft enamel pin', es: 'Pin de esmalte blando', 'zh-Hans': '烤漆徽章' },
    note: {
      en: 'Two inks, metal edges, butterfly clutch or a magnet back.',
      es: 'Dos tintas, borde metálico, cierre de mariposa o imán.',
      'zh-Hans': '两色烤漆，金属边，蝴蝶扣或磁吸背。',
    },
    colors: ['brass', 'nickel'],
  },
  {
    id: 'keyring', line: 'trinkets', days: [18, 24], min: 25,
    name: { en: 'Die-cut keyring', es: 'Llavero troquelado', 'zh-Hans': '异形钥匙扣' },
    note: {
      en: 'Acrylic or metal, your silhouette, one or two faces.',
      es: 'Acrílico o metal, tu silueta, una o dos caras.',
      'zh-Hans': '亚克力或金属，按你的轮廓开模，单面或双面。',
    },
    colors: ['ink', 'signal', 'bone'],
  },
  {
    id: 'stickers', line: 'trinkets', days: [10, 14], min: 50,
    name: { en: 'Sticker pack', es: 'Pack de pegatinas', 'zh-Hans': '贴纸包' },
    note: {
      en: 'Five die-cut vinyl stickers, matte, packed in a paper sleeve.',
      es: 'Cinco pegatinas de vinilo troqueladas, mate, en funda de papel.',
      'zh-Hans': '五张异形乙烯基贴纸，哑光，纸套包装。',
    },
    colors: ['bone', 'ink'],
  },
  {
    id: 'tee', line: 'threads', days: [10, 14], min: 12,
    name: { en: 'Heavy tee', es: 'Camiseta gruesa', 'zh-Hans': '重磅 T 恤' },
    note: {
      en: '240 gsm ring-spun cotton, screen print one to three inks.',
      es: 'Algodón peinado de 240 g, serigrafía de una a tres tintas.',
      'zh-Hans': '240 克环纺棉，一到三色丝网印刷。',
    },
    colors: ['bone', 'ink', 'moss'],
  },
  {
    id: 'hoodie', line: 'threads', days: [12, 16], min: 12,
    name: { en: 'Boxy hoodie', es: 'Sudadera boxy', 'zh-Hans': '宽松连帽衫' },
    note: {
      en: '400 gsm fleece, embroidery or puff print, kangaroo pocket.',
      es: 'Felpa de 400 g, bordado o estampado puff, bolsillo canguro.',
      'zh-Hans': '400 克抓绒，刺绣或发泡印花，袋鼠口袋。',
    },
    colors: ['oat', 'ink', 'clay'],
  },
];

const STR = {
  en: {
    remove: 'Remove', added: 'Added to the run.', copied: 'Order sheet copied.',
    linkCopied: 'Link copied. It carries the run, nothing else.',
    nothing: 'Add a piece first.', empty: 'Empty', run: 'run', pieces: 'pieces',
    subject: 'Order sheet from vibeshit.co', heading: 'VibeShit order sheet',
    window: 'Production window', partners: 'Partners', units: 'Pieces',
    art: 'Art', noArt: 'no art note', from: 'Built at vibeshit.co',
  },
  es: {
    remove: 'Quitar', added: 'Añadido al pedido.', copied: 'Hoja de pedido copiada.',
    linkCopied: 'Enlace copiado. Lleva el pedido, nada más.',
    nothing: 'Añade una pieza primero.', empty: 'Vacío', run: 'pedido', pieces: 'piezas',
    subject: 'Hoja de pedido de vibeshit.co', heading: 'Hoja de pedido de VibeShit',
    window: 'Plazo de producción', partners: 'Socios', units: 'Piezas',
    art: 'Arte', noArt: 'sin nota de arte', from: 'Creada en vibeshit.co',
  },
  'zh-Hans': {
    remove: '移除', added: '已加入订单。', copied: '订单表已复制。',
    linkCopied: '链接已复制，只包含订单内容。',
    nothing: '请先添加一件商品。', empty: '空', run: '单', pieces: '件',
    subject: '来自 vibeshit.co 的订单表', heading: 'VibeShit 订单表',
    window: '生产周期', partners: '合作方', units: '件数',
    art: '图案', noArt: '未填图案说明', from: '在 vibeshit.co 生成',
  },
};

const locale = LOCALES.includes(document.documentElement.lang) ? document.documentElement.lang : 'en';
const t = STR[locale];
const say = (key) => (t[key] ?? STR.en[key]);
const byId = (id) => ITEMS.find((item) => item.id === id);

/** The state: one piece per line entry, each a plain object the URL hash can carry. */
let run = [];
let picked = { item: ITEMS[0].id, color: ITEMS[0].colors[0], qty: ITEMS[0].min };

const store = {
  read() {
    try {
      const fromHash = new URLSearchParams(location.hash.slice(1)).get('run');
      if (fromHash) {
        const parsed = JSON.parse(atob(fromHash));
        if (Array.isArray(parsed)) return parsed.filter((line) => byId(line.item)).slice(0, 24);
      }
      const saved = JSON.parse(localStorage.getItem('vibeshit-run') ?? '[]');
      return Array.isArray(saved) ? saved.filter((line) => byId(line.item)).slice(0, 24) : [];
    } catch { return []; }
  },
  write() {
    try { localStorage.setItem('vibeshit-run', JSON.stringify(run)); } catch { /* private mode: the sheet still works */ }
  },
};

const element = (tag, props = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'class') node.className = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else if (value !== undefined && value !== null) node.setAttribute(key, value);
  }
  for (const child of children.flat()) if (child !== null && child !== undefined) node.append(child);
  return node;
};

/** The three line cards, drawn from the catalog so the page and the builder never disagree. */
function drawCards() {
  const cards = document.getElementById('cards');
  if (!cards) return;
  cards.textContent = '';
  for (const [lineId, lineName] of Object.entries(LINES)) {
    const items = ITEMS.filter((item) => item.line === lineId);
    const list = element('ul', {}, items.map((item) => element(
      'li', {},
      element('span', {}, item.name[locale]),
      element('span', {}, `min ${item.min}`),
    )));
    const label = {
      headwear: { en: 'An embroidery shop', es: 'Un taller de bordado', 'zh-Hans': '一家刺绣工坊' },
      trinkets: { en: 'A soft-enamel studio', es: 'Un estudio de esmalte', 'zh-Hans': '一家烤漆工坊' },
      threads: { en: 'A cut-and-sew mill', es: 'Un taller de confección', 'zh-Hans': '一家针织成衣厂' },
    }[lineId];
    const days = { headwear: '14–18', trinkets: '10–24', threads: '10–16' }[lineId];
    cards.append(element(
      'article', { class: 'card' },
      element('div', { class: 'icon', 'aria-hidden': 'true' }, icon(lineId)),
      element('h3', {}, lineName[locale]),
      element('p', {}, label[locale]),
      list,
      element('p', { class: 'partner' }, `${days} days · made to order`),
    ));
  }
}

/** A line drawing per product line: enough to read at 24 px, no external asset. */
function icon(lineId) {
  const markup = {
    headwear: '<path d="M4 15h16l-1 3H5l-1-3Zm2 0c0-5 2-8 6-8s6 3 6 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    trinkets: '<path d="M12 3l7 4v10l-7 4-7-4V7l7-4Zm0 0v18M5 7l7 4 7-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    threads: '<path d="M8 3l4 4 4-4 4 4v14H4V7l4-4Zm0 0 4 4-4 4m8-8-4 4 4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  }[lineId];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  const inner = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  inner.innerHTML = markup;
  svg.append(inner);
  return svg;
}

function drawItemChips() {
  const box = document.getElementById('item-chips');
  box.textContent = '';
  for (const item of ITEMS) {
    box.append(element('button', {
      type: 'button', class: 'chip', 'aria-pressed': String(picked.item === item.id),
      onclick: () => { picked = { item: item.id, color: item.colors[0], qty: item.min }; drawAll(); },
    }, item.name[locale]));
  }
}

function drawColorChips() {
  const box = document.getElementById('color-chips');
  const item = byId(picked.item);
  box.textContent = '';
  for (const colorId of item.colors) {
    const color = COLORS[colorId];
    const swatch = element('i', {});
    swatch.style.background = color.hex;
    box.append(element('button', {
      type: 'button', class: 'swatch', 'aria-pressed': String(picked.color === colorId),
      onclick: () => { picked.color = colorId; drawAll(); },
    }, swatch, color[locale]));
  }
}

/** Quantities: the minimum and three steps above it, which is the whole of how a partner prices a run. */
function quantitiesFor(item) {
  return [item.min, item.min * 4, item.min * 12, item.min * 40];
}

function drawQtyChips() {
  const box = document.getElementById('qty-chips');
  const item = byId(picked.item);
  box.textContent = '';
  for (const qty of quantitiesFor(item)) {
    box.append(element('button', {
      type: 'button', class: 'chip', 'aria-pressed': String(picked.qty === qty),
      onclick: () => { picked.qty = qty; drawAll(); },
    }, String(qty)));
  }
}

function drawSheet() {
  const list = document.getElementById('sheet-lines');
  const empty = document.getElementById('sheet-empty');
  const totals = document.getElementById('totals');
  const tag = document.getElementById('sheet-tag');
  list.textContent = '';
  run.forEach((line, index) => {
    const item = byId(line.item);
    list.append(element(
      'li', {},
      element('span', {}, item.name[locale], element('small', {}, `${COLORS[line.color]?.[locale] ?? line.color} · ${line.art || say('noArt')}`)),
      element('span', {}, `× ${line.qty}`),
      element('button', {
        type: 'button', 'aria-label': `${say('remove')}: ${item.name[locale]}`,
        onclick: () => { run.splice(index, 1); store.write(); drawSheet(); },
      }, say('remove')),
    ));
  });
  empty.hidden = run.length > 0;
  totals.hidden = run.length === 0;
  tag.textContent = run.length ? `${run.length} ${say('run')}` : say('empty');
  const pieces = run.reduce((sum, line) => sum + line.qty, 0);
  const partners = new Set(run.map((line) => byId(line.item).line));
  const low = Math.min(...run.map((line) => byId(line.item).days[0]));
  const high = Math.max(...run.map((line) => byId(line.item).days[1]));
  document.getElementById('total-pieces').textContent = String(pieces);
  document.getElementById('total-partners').textContent = String(partners.size);
  document.getElementById('total-window').textContent = run.length ? `${low}–${high} days` : '–';
  const email = document.getElementById('email-button');
  email.href = run.length ? `mailto:hello@vibeshit.co?subject=${encodeURIComponent(say('subject'))}&body=${encodeURIComponent(orderSheetText())}` : 'mailto:hello@vibeshit.co';
}

/** The sheet as plain text: what the copy button and the mailto carry. */
function orderSheetText() {
  const lines = run.map((line) => {
    const item = byId(line.item);
    return `- ${item.name.en} × ${line.qty} · ${COLORS[line.color]?.en ?? line.color} · ${line.art || 'no art note'}`;
  });
  const pieces = run.reduce((sum, line) => sum + line.qty, 0);
  const high = Math.max(...run.map((line) => byId(line.item).days[1]), 0);
  return [say('heading'), '', ...lines, '', `${say('units')}: ${pieces}`, `${say('window')}: ${high} days`, '', say('from'), 'hello@vibeshit.co'].join('\n');
}

function drawAll() {
  drawItemChips();
  drawColorChips();
  drawQtyChips();
  drawSheet();
}

function status(id, text) {
  const node = document.getElementById(id);
  if (!node) return;
  node.textContent = text;
  window.setTimeout(() => { if (node.textContent === text) node.textContent = ''; }, 4000);
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

function wire() {
  document.getElementById('builder-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const art = document.getElementById('art-note').value.trim().slice(0, 240);
    run.push({ item: picked.item, color: picked.color, qty: picked.qty, art });
    document.getElementById('art-note').value = '';
    store.write();
    drawSheet();
    status('saved', say('added'));
  });

  document.getElementById('clear-button').addEventListener('click', () => {
    run = [];
    document.getElementById('art-note').value = '';
    store.write();
    drawSheet();
  });

  document.getElementById('copy-button').addEventListener('click', async () => {
    if (!run.length) return status('sheet-status', say('nothing'));
    const ok = await copy(orderSheetText());
    status('sheet-status', ok ? say('copied') : say('nothing'));
  });

  document.getElementById('link-button').addEventListener('click', async () => {
    if (!run.length) return status('sheet-status', say('nothing'));
    const payload = btoa(JSON.stringify(run));
    const url = `${location.origin}${location.pathname}#run=${payload}`;
    const ok = await copy(url);
    status('sheet-status', ok ? say('linkCopied') : say('nothing'));
  });

  const button = document.getElementById('lang-button');
  const dialog = document.getElementById('lang-dialog');
  if (button && dialog) {
    button.addEventListener('click', () => dialog.showModal());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  }
}

function start() {
  run = store.read();
  drawCards();
  drawAll();
  wire();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
