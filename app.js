/*
 * VibeShit's page: the sticker pile and the production run. No dependencies, no network: the catalog is data, the run
 * lives in localStorage and in the URL hash, and the only way anything leaves this page is a link the visitor copies
 * or a mailto they send themselves (the page's CSP lets nothing else connect).
 */
import { LOCALES, LINES, COLORS, PLACES, ITEMS, DRAWINGS } from './catalog.js';

const STR = {
  en: {
    remove: 'Remove', added: 'Added to the run.', copied: 'Order sheet copied.',
    linkCopied: 'Link copied. It carries the run, nothing else.', copyFailed: 'This browser would not copy. Select the sheet and copy it by hand.',
    nothing: 'Add a piece first.', empty: 'Empty', line: 'line', lines: 'lines',
    subject: 'Order sheet from vibeshit.co', heading: 'VibeShit order sheet',
    window: 'Production window', units: 'Pieces', days: 'days',
    noArt: 'no art note', from: 'Built at vibeshit.co', picked: 'Picked for the run',
    proof: 'Proof · illustrative drawing · not approved', placement: 'Placement',
  },
  es: {
    remove: 'Quitar', added: 'Añadido al pedido.', copied: 'Hoja de pedido copiada.',
    linkCopied: 'Enlace copiado. Lleva el pedido, nada más.', copyFailed: 'Este navegador no copió. Selecciona la hoja y cópiala a mano.',
    nothing: 'Añade una pieza primero.', empty: 'Vacío', line: 'línea', lines: 'líneas',
    subject: 'Hoja de pedido de vibeshit.co', heading: 'Hoja de pedido de VibeShit',
    window: 'Plazo de producción', units: 'Piezas', days: 'días',
    noArt: 'sin nota de arte', from: 'Creada en vibeshit.co', picked: 'Elegido para el pedido',
    proof: 'Prueba · dibujo ilustrativo · sin aprobar', placement: 'Ubicación',
  },
  'zh-Hans': {
    remove: '移除', added: '已加入订单。', copied: '订单表已复制。',
    linkCopied: '链接已复制，只包含订单内容。', copyFailed: '浏览器未能复制，请手动选中订单表复制。',
    nothing: '请先添加一件商品。', empty: '空', line: '行', lines: '行',
    subject: '来自 vibeshit.co 的订单表', heading: 'VibeShit 订单表',
    window: '生产周期', units: '件数', days: '天',
    noArt: '未填图案说明', from: '在 vibeshit.co 生成', picked: '已选入订单',
    proof: '打样 · 示意图 · 未确认', placement: '位置',
  },
};

const locale = LOCALES.includes(document.documentElement.lang) ? document.documentElement.lang : 'en';
const say = (key) => STR[locale][key] ?? STR.en[key];
const byId = (id) => ITEMS.find((item) => item.id === id);
const $ = (id) => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const SVG = 'http://www.w3.org/2000/svg';

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

const svgNode = (tag, attrs = {}) => {
  const node = document.createElementNS(SVG, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
};

/** A piece as a die-cut sticker: the white border is the body stroked wide under itself. */
function drawing(id, fill, { place = null, label = null } = {}) {
  const shape = DRAWINGS[id];
  const svg = svgNode('svg', { viewBox: '-14 -14 228 228', class: 'drawing', 'aria-hidden': 'true' });
  svg.append(
    svgNode('path', { d: shape.body, class: 'drawing__cut' }),
    svgNode('path', { d: shape.body, class: 'drawing__body', fill }),
    svgNode('path', { d: shape.detail, class: 'drawing__detail' }),
  );
  if (place) {
    const [x, y, w, h] = PLACES[place].box;
    svg.append(svgNode('rect', { x, y, width: w, height: h, class: 'drawing__place' }));
    for (const [cx, cy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
      svg.append(svgNode('path', { d: `M${cx - 6} ${cy}h12M${cx} ${cy - 6}v12`, class: 'drawing__reg' }));
    }
  }
  if (label) {
    const text = svgNode('text', { x: 100, y: 206, class: 'drawing__label', 'text-anchor': 'middle' });
    text.textContent = label;
    svg.append(text);
  }
  return svg;
}

/* ---------------------------------------------------------------- the pile ---------------------------------------- */

/*
 * The hero's stickers fall onto the table and can be thrown. Each sticker is a disc for collisions (cheap and stable at
 * 60 fps on a phone); the drawing rotates with the disc's spin. The pile is decoration for pointers: the same pieces
 * are a plain list of buttons beside it, which is how a keyboard or a screen reader picks one.
 */
const PILE = [
  ...ITEMS.map((item) => ({ kind: 'piece', id: item.id, fill: COLORS[item.colors[0]].hex })),
  { kind: 'word', key: 'min' }, { kind: 'word', key: 'warehouse' }, { kind: 'word', key: 'proof' }, { kind: 'word', key: 'after' },
  { kind: 'piece', id: 'pin', fill: '#f448a1' }, { kind: 'piece', id: 'stickers', fill: '#55d7e5' }, { kind: 'piece', id: 'keyring', fill: '#e6ff58' },
];

function startPile() {
  const stage = $('pile');
  if (!stage) return;
  const words = JSON.parse(stage.dataset.words || '{}');
  const bodies = [];
  let width = 0, height = 0, unit = 0, frame = 0, last = 0, drag = null;

  for (const [index, sticker] of PILE.entries()) {
    const node = element('div', { class: `sticker sticker--${sticker.kind}`, 'data-index': String(index) });
    if (sticker.kind === 'piece') node.append(drawing(sticker.id, sticker.fill));
    else node.append(element('span', {}, words[sticker.key] ?? ''));
    stage.append(node);
    bodies.push({ node, sticker, x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0, r: 0, scale: sticker.kind === 'word' ? 0.78 : 1 });
  }

  const measure = () => {
    width = stage.clientWidth;
    height = stage.clientHeight;
    unit = Math.max(40, Math.min(118, width * (width < 600 ? 0.12 : 0.072)));
    for (const body of bodies) {
      body.r = unit * body.scale;
      body.node.style.width = body.node.style.height = `${body.r * 2}px`;
    }
  };

  // A seeded scatter, so the reduced-motion pile and the first frame of the fall are the same every visit.
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const scatter = () => {
    bodies.forEach((body, i) => {
      body.x = body.r + rand() * (width - body.r * 2);
      body.y = -body.r * (1.5 + i * 1.1);
      body.vx = (rand() - 0.5) * 160;
      body.vy = 0;
      body.a = (rand() - 0.5) * 1.2;
      body.va = (rand() - 0.5) * 3;
    });
  };

  const step = (dt) => {
    const g = 2400;
    for (const body of bodies) {
      if (body === drag?.body) continue;
      body.vy += g * dt;
      body.x += body.vx * dt;
      body.y += body.vy * dt;
      body.a += body.va * dt;
      body.va *= 0.985;
    }
    for (let pass = 0; pass < 4; pass++) {
      for (let i = 0; i < bodies.length; i++) {
        const p = bodies[i];
        for (let j = i + 1; j < bodies.length; j++) {
          const q = bodies[j];
          const dx = q.x - p.x, dy = q.y - p.y, min = (p.r + q.r) * 0.86;
          const d2 = dx * dx + dy * dy;
          if (d2 >= min * min || d2 === 0) continue;
          const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, push = (min - d) / 2;
          const pFixed = p === drag?.body, qFixed = q === drag?.body;
          if (!pFixed) { p.x -= nx * push * (qFixed ? 2 : 1); p.y -= ny * push * (qFixed ? 2 : 1); }
          if (!qFixed) { q.x += nx * push * (pFixed ? 2 : 1); q.y += ny * push * (pFixed ? 2 : 1); }
          const rel = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny;
          if (rel < 0) {
            const impulse = -rel * 0.6;
            if (!pFixed) { p.vx -= nx * impulse; p.vy -= ny * impulse; }
            if (!qFixed) { q.vx += nx * impulse; q.vy += ny * impulse; }
            const slide = (q.vx - p.vx) * -ny + (q.vy - p.vy) * nx;
            p.va -= slide / p.r * 0.2;
            q.va += slide / q.r * 0.2;
          }
        }
      }
      for (const body of bodies) {
        if (body === drag?.body) continue;
        const floor = height - body.r * 0.9;
        if (body.y > floor) { body.y = floor; body.vy *= -0.18; body.vx *= 0.9; body.va = body.vx / body.r; }
        if (body.x < body.r * 0.7) { body.x = body.r * 0.7; body.vx = Math.abs(body.vx) * 0.4; }
        if (body.x > width - body.r * 0.7) { body.x = width - body.r * 0.7; body.vx = -Math.abs(body.vx) * 0.4; }
      }
    }
  };

  const paint = () => {
    for (const body of bodies) {
      body.node.style.transform = `translate(${body.x - body.r}px, ${body.y - body.r}px) rotate(${body.a}rad)`;
    }
  };

  const restless = () => drag || bodies.some((b) => Math.abs(b.vx) + Math.abs(b.vy) > 6 || b.y < 0);

  const tick = (now) => {
    const dt = Math.min(1 / 30, (now - last) / 1000 || 1 / 60);
    last = now;
    step(dt / 2);
    step(dt / 2);
    paint();
    frame = restless() ? requestAnimationFrame(tick) : 0;
  };
  const wake = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); } };

  // Settled without being watched: the still pile reduced motion shows, and the pile a resize lands on.
  const settle = () => {
    scatter();
    for (let i = 0; i < 900; i++) step(1 / 120);
    for (const body of bodies) { body.vx = body.vy = body.va = 0; }
    paint();
    stage.classList.add('is-still');
  };

  const toPoint = (event) => {
    const box = stage.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top, t: event.timeStamp };
  };

  stage.addEventListener('pointerdown', (event) => {
    const node = event.target.closest('.sticker');
    if (!node || reduced.matches) return;
    const body = bodies[Number(node.dataset.index)];
    const at = toPoint(event);
    drag = { body, dx: body.x - at.x, dy: body.y - at.y, last: at, start: at, moved: false };
    node.setPointerCapture(event.pointerId);
    node.classList.add('is-held');
    wake();
  });
  stage.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const at = toPoint(event);
    const dt = Math.max(1, at.t - drag.last.t) / 1000;
    drag.body.vx = (at.x - drag.last.x) / dt;
    drag.body.vy = (at.y - drag.last.y) / dt;
    drag.body.x = at.x + drag.dx;
    drag.body.y = at.y + drag.dy;
    if (Math.hypot(at.x - drag.start.x, at.y - drag.start.y) > 6) drag.moved = true;
    drag.last = at;
  });
  const release = () => {
    if (!drag) return;
    const { body, moved } = drag;
    body.node.classList.remove('is-held');
    // A tap on a piece picks it, like its button in the list does.
    if (!moved && body.sticker.kind === 'piece') pick(body.sticker.id, { scroll: true });
    drag = null;
    wake();
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  measure();
  if (reduced.matches) settle();
  else {
    // The fall starts when the table is on screen, so a visitor arriving mid-page does not miss it.
    scatter();
    paint();
    new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) { observer.disconnect(); stage.classList.add('is-falling'); wake(); }
    }).observe(stage);
  }
  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { const w = width; measure(); if (w && w !== width) settle(); }, 120);
  }).observe(stage);
  stage.classList.add('is-live');
}

/* ---------------------------------------------------------------- the run ----------------------------------------- */

/** The state: one entry per line of the run, each a plain object the URL hash can carry. */
let run = [];
let picked = null;
const fresh = (item) => ({ item: item.id, color: item.colors[0], place: item.places[0], qty: item.min });

const store = {
  read() {
    const clean = (lines) => lines
      .filter((line) => byId(line?.item))
      .map((line) => {
        const item = byId(line.item);
        return {
          item: item.id,
          color: item.colors.includes(line.color) ? line.color : item.colors[0],
          place: item.places.includes(line.place) ? line.place : item.places[0],
          qty: Math.max(item.min, Math.min(100000, Math.round(Number(line.qty) || item.min))),
          art: String(line.art ?? '').slice(0, 240),
        };
      })
      .slice(0, 24);
    try {
      const fromHash = new URLSearchParams(location.hash.slice(1)).get('run');
      if (fromHash) {
        const parsed = JSON.parse(decodeURIComponent(escape(atob(fromHash))));
        if (Array.isArray(parsed)) return clean(parsed);
      }
      const saved = JSON.parse(localStorage.getItem('vibeshit-run') ?? '[]');
      return Array.isArray(saved) ? clean(saved) : [];
    } catch { return []; }
  },
  write() {
    try { localStorage.setItem('vibeshit-run', JSON.stringify(run)); } catch { /* private mode: the sheet still works */ }
  },
};

function pick(id, { scroll = false } = {}) {
  picked = fresh(byId(id));
  drawBuilder();
  if (scroll) {
    $('build')?.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
    $('stage-piece')?.querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true });
  }
  status('saved', `${say('picked')}: ${byId(id).name[locale]}`);
}

function chips(boxId, options, isOn, onPick, render) {
  const box = $(boxId);
  box.textContent = '';
  for (const option of options) {
    box.append(element('button', {
      type: 'button', class: 'chip', 'aria-pressed': String(isOn(option)),
      onclick: () => { onPick(option); drawBuilder(); },
    }, render(option)));
  }
}

/** Quantities: the minimum and three steps above it, which is the whole of how a shop prices a run. */
const quantitiesFor = (item) => [item.min, item.min * 4, item.min * 12, item.min * 40];

function drawBuilder() {
  const item = byId(picked.item);
  chips('item-chips', ITEMS, (it) => it.id === picked.item, (it) => { picked = fresh(it); },
    (it) => [drawing(it.id, COLORS[it.colors[0]].hex), element('span', {}, it.name[locale])]);
  chips('color-chips', item.colors, (c) => c === picked.color, (c) => { picked.color = c; }, (c) => {
    const drop = element('i', { 'aria-hidden': 'true' });
    drop.style.background = COLORS[c].hex;
    return [drop, COLORS[c][locale]];
  });
  chips('place-chips', item.places, (p) => p === picked.place, (p) => { picked.place = p; }, (p) => PLACES[p][locale]);
  chips('qty-chips', quantitiesFor(item), (q) => q === picked.qty, (q) => { picked.qty = q; }, (q) => String(q));

  const proof = $('proof');
  proof.textContent = '';
  proof.append(drawing(item.id, COLORS[picked.color].hex, { place: picked.place }));
  $('proof-caption').textContent = `${item.name[locale]} · ${COLORS[picked.color][locale]} · ${PLACES[picked.place][locale]} · × ${picked.qty}`;
  $('proof-note').textContent = item.note[locale];
  // The tally: one stroke per minimum run, so a quantity reads as a size before it reads as a number.
  const tally = $('tally');
  tally.textContent = '';
  const strokes = Math.round(picked.qty / item.min);
  for (let i = 0; i < Math.min(strokes, 40); i++) tally.append(element('i', { 'aria-hidden': 'true' }));
}

function drawSheet() {
  const list = $('sheet-lines');
  list.textContent = '';
  run.forEach((line, index) => {
    const item = byId(line.item);
    list.append(element(
      'li', {},
      element('span', { class: 'sheet-art' }, drawing(item.id, COLORS[line.color]?.hex ?? '#888', { place: line.place })),
      element('span', { class: 'sheet-what' },
        element('b', {}, item.name[locale]),
        element('small', {}, `${COLORS[line.color]?.[locale] ?? line.color} · ${PLACES[line.place]?.[locale] ?? ''} · ${line.art || say('noArt')}`)),
      element('span', { class: 'sheet-qty' }, `× ${line.qty}`),
      element('button', {
        type: 'button', class: 'sheet-remove', 'aria-label': `${say('remove')}: ${item.name[locale]}`,
        onclick: () => { run.splice(index, 1); store.write(); drawSheet(); },
      }, say('remove')),
    ));
  });
  $('sheet-empty').hidden = run.length > 0;
  $('totals').hidden = run.length === 0;
  $('sheet-tag').textContent = run.length ? `${run.length} ${say(run.length === 1 ? 'line' : 'lines')}` : say('empty');
  const pieces = run.reduce((sum, line) => sum + line.qty, 0);
  const shops = new Set(run.map((line) => byId(line.item).line));
  const low = Math.min(...run.map((line) => byId(line.item).days[0]));
  const high = Math.max(...run.map((line) => byId(line.item).days[1]));
  $('total-pieces').textContent = String(pieces);
  $('total-partners').textContent = String(shops.size);
  $('total-window').textContent = run.length ? `${low}–${high} ${say('days')}` : '–';
  $('email-button').href = run.length
    ? `mailto:hello@vibeshit.co?subject=${encodeURIComponent(say('subject'))}&body=${encodeURIComponent(orderSheetText())}`
    : 'mailto:hello@vibeshit.co';
}

/** The sheet as plain text: what the copy button and the mailto carry. The pieces stay in English for the shops. */
function orderSheetText() {
  const lines = run.map((line) => {
    const item = byId(line.item);
    return `- ${item.name.en} × ${line.qty} · ${COLORS[line.color]?.en ?? line.color} · ${PLACES[line.place]?.en ?? ''} · ${line.art || 'no art note'}`;
  });
  const pieces = run.reduce((sum, line) => sum + line.qty, 0);
  const high = Math.max(...run.map((line) => byId(line.item).days[1]), 0);
  return [say('heading'), '', ...lines, '', `${say('units')}: ${pieces}`, `${say('window')}: ${high} ${say('days')}`, '', say('from'), 'hello@vibeshit.co'].join('\n');
}

function status(id, text) {
  const node = $(id);
  if (!node) return;
  node.textContent = text;
  window.setTimeout(() => { if (node.textContent === text) node.textContent = ''; }, 4000);
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

function wire() {
  $('builder-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const art = $('art-note').value.trim().slice(0, 240);
    run.push({ ...picked, art });
    $('art-note').value = '';
    store.write();
    drawSheet();
    status('saved', say('added'));
  });

  $('clear-button').addEventListener('click', () => {
    run = [];
    $('art-note').value = '';
    store.write();
    drawSheet();
  });

  $('copy-button').addEventListener('click', async () => {
    if (!run.length) return status('sheet-status', say('nothing'));
    status('sheet-status', (await copy(orderSheetText())) ? say('copied') : say('copyFailed'));
  });

  $('link-button').addEventListener('click', async () => {
    if (!run.length) return status('sheet-status', say('nothing'));
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(run))));
    const url = `${location.origin}${location.pathname}#run=${payload}`;
    status('sheet-status', (await copy(url)) ? say('linkCopied') : say('copyFailed'));
  });

  for (const button of document.querySelectorAll('[data-pick]')) {
    button.addEventListener('click', () => pick(button.dataset.pick, { scroll: true }));
  }

  const button = $('lang-button');
  const dialog = $('lang-dialog');
  if (button && dialog) {
    button.addEventListener('click', () => dialog.showModal());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  }
}

function start() {
  run = store.read();
  picked = fresh(ITEMS[0]);
  drawBuilder();
  drawSheet();
  wire();
  startPile();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
