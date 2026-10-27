#!/usr/bin/env node
/*
 * Writes the three locale pages (index.html, es/index.html, zh-Hans/index.html) from one template and the catalog,
 * so the locales never drift apart in structure. The pages are the shipped files; this runs only when the copy or the
 * structure changes: `node redesign/locales.mjs`.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LINES, COLORS, ITEMS } from '../catalog.js';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const COPY = {
  en: {
    path: 'index.html', root: '', url: 'https://vibeshit.co/', native: 'English',
    title: 'VibeShit — swag that exists because someone wanted it',
    description: 'Promotional merchandise and giveaways — hats, trinkets and threads — made on demand through a vertical partner for each product line. No warehouse, no landfill pile, no minimum of 5,000.',
    ogDescription: 'Hats, trinkets and threads for your team, made when you order them. One order sheet, three vertical partners.',
    skip: 'Skip to content', home: 'VibeShit home', navLabel: 'Main', langLabel: 'Language: English',
    nav: ['The table', 'How a run runs', 'Why the name', 'Start a run'],
    eyebrow: 'Promotional merchandise, made on demand',
    h1: ['Swag that', 'exists because', 'someone', '<em>wanted it.</em>'],
    lede: 'Hats, trinkets and threads. Made when you order them, by three shops that each do one thing. No pile.',
    cta: 'Start a run', cta2: 'How a run runs',
    pileLabel: 'On the table', pileHint: 'Drag the pile. Tap a piece to start a run with it. Drawings, not photos.',
    words: { min: 'from 12 pieces', warehouse: '0 warehouses', proof: 'proof in 24 h', after: 'made after you order' },
    linesH: ['Three lines.', 'Three shops that only do that one thing.'],
    linesP: 'You order once. Each shop makes only what was ordered and ships it direct.',
    min: 'min', daysWord: 'days', madeToOrder: 'made to order',
    howH: 'How a run runs', howP: 'Four passes, like a four-ink print. Nothing is made before you approve the proof.',
    steps: [
      ['Pick the pieces', 'Piece, colourway, where the art goes, how many.'],
      ['We route the lines', 'Each line goes to its own shop with the size run and the art.'],
      ['Proof in a day', 'A proof for every decorated piece. You say yes or you say change it.'],
      ['Made, then shipped', 'Boxes leave the shop. Not a warehouse of ours.'],
    ],
    printLabel: 'A four-ink print building up as you scroll',
    whyEyebrow: 'Why the name',
    whyH: ['The joke is the name.', 'The problem is the pile.'],
    whyP: 'Most swag is ordered in bulk, handed out once and worn for a week. Then a drawer. Then a bin. We named the company after the bin, so nobody has to pretend.',
    whyNote: 'We do not claim to be carbon-neutral. We claim to make fewer things nobody wants.',
    stamps: [
      ['Made after you order', 'No stock waits for a conference that got cancelled.'],
      ['From 12 pieces', 'A pilot run beats a pallet you regret.'],
      ['Worth wearing twice', 'Real embroidery, soft enamel, ring-spun cotton.'],
      ['Paper, not plastic', 'Paper wraps and cartons by default.'],
      ['Send it back', 'Unworn pieces go back to the shop for remaking.'],
    ],
    buildH: 'Start a run', buildP: 'This page quotes nothing and charges nothing. It builds the sheet you send us. The run stays on this device until you copy it.',
    ticket: 'Job ticket', stages: ['Piece', 'Colourway', 'Placement', 'Quantity', 'Art note'],
    artPlaceholder: 'Your logo, one ink. The art file follows the sheet.',
    add: 'Add to the run', clear: 'Start over',
    proofH: 'Proof', proofLabel: 'Proof · illustrative drawing · not approved', tallyLabel: 'one stroke = one minimum run',
    runH: 'Your run', emptyTag: 'Empty', emptyP: 'Nothing on the ticket yet. Add a piece and it lands here.',
    totals: ['Pieces', 'Shops', 'Production window', 'Price'], quoted: 'Quoted per run',
    copy: 'Copy the sheet', email: 'Email the sheet', link: 'Copy a link',
    faqH: 'Questions people actually ask',
    faq: [
      ['Why is it called VibeShit?', 'Because that is what most of it becomes. The name keeps us honest: if a piece is not worth wearing twice, we should not make it. The logo is the joke. The production is not.'],
      ['What is the smallest order?', '12 pieces on caps, beanies, tees and hoodies; 25 on pins and keyrings; 50 on sticker packs. Each line has its own shop and its own minimum.'],
      ['What does it cost?', 'We quote each run: quantity, colourways, decoration and the shop’s current rate decide it. Send the sheet and you get one quote with the production window, not a price list that expires.'],
      ['Can we see a sample first?', 'Yes. A single plain piece from any line ships before a decorated run, and its cost comes off the order if the run goes ahead.'],
      ['How long does it take?', 'Headwear 14–18 days, trinkets 10–24 days, threads 10–16 days after the proof is approved. A mixed run ships in the longest window, part-shipped from each shop.'],
      ['Do you ship outside the United States?', 'Yes. Each shop quotes its own freight; the sheet names the destination before we confirm anything.'],
      ['Are the pictures on this page real products?', 'No. The stickers and the proof are drawings made for this page. Your proof comes from the shop, drawn on your art.'],
    ],
    footWho: '<strong>VibeShit</strong> — promotional merchandise and giveaways, made on demand. A company of CommandAGI.',
    footFine: 'Order sheets are built on this device. This page takes no payment and sends us nothing; our host counts a page view.',
    footBuild: 'Start a run',
  },
  es: {
    path: 'es/index.html', root: '../', url: 'https://vibeshit.co/es/', native: 'Español',
    title: 'VibeShit — merchandising que existe porque alguien lo quiso',
    description: 'Merchandising promocional y regalos — gorras, chácharas y prendas — hechos bajo pedido con un socio vertical para cada línea. Sin almacén, sin montaña de descartes, sin mínimo de 5.000.',
    ogDescription: 'Gorras, chácharas y prendas para tu equipo, hechas cuando haces el pedido. Una hoja de pedido, tres socios verticales.',
    skip: 'Saltar al contenido', home: 'Inicio de VibeShit', navLabel: 'Principal', langLabel: 'Idioma: español',
    nav: ['La mesa', 'Cómo va un pedido', 'Por qué el nombre', 'Empezar un pedido'],
    eyebrow: 'Merchandising promocional, hecho bajo pedido',
    h1: ['Merch que', 'existe porque', 'alguien', '<em>lo quiso.</em>'],
    lede: 'Gorras, chácharas y prendas. Hechas cuando haces el pedido, por tres talleres que hacen una sola cosa cada uno. Sin montaña.',
    cta: 'Empezar un pedido', cta2: 'Cómo va un pedido',
    pileLabel: 'En la mesa', pileHint: 'Arrastra la pila. Toca una pieza para empezar un pedido con ella. Dibujos, no fotos.',
    words: { min: 'desde 12 piezas', warehouse: '0 almacenes', proof: 'prueba en 24 h', after: 'hecho tras tu pedido' },
    linesH: ['Tres líneas.', 'Tres talleres que solo hacen eso.'],
    linesP: 'Pides una vez. Cada taller hace solo lo pedido y lo envía directo.',
    min: 'mín.', daysWord: 'días', madeToOrder: 'bajo pedido',
    howH: 'Cómo va un pedido', howP: 'Cuatro pasadas, como una impresión a cuatro tintas. Nada se fabrica antes de que apruebes la prueba.',
    steps: [
      ['Eliges las piezas', 'Pieza, color, dónde va el arte, cuántas.'],
      ['Repartimos las líneas', 'Cada línea va a su taller con las tallas y el arte.'],
      ['Prueba en un día', 'Una prueba por cada pieza decorada. Dices sí o dices cámbialo.'],
      ['Se fabrica y se envía', 'Las cajas salen del taller. No de un almacén nuestro.'],
    ],
    printLabel: 'Una impresión a cuatro tintas que se forma al desplazarte',
    whyEyebrow: 'Por qué el nombre',
    whyH: ['El chiste es el nombre.', 'El problema es la montaña.'],
    whyP: 'Casi todo el merch se pide al por mayor, se reparte una vez y se usa una semana. Luego un cajón. Luego la basura. Le pusimos a la empresa el nombre de la basura para que nadie tenga que fingir.',
    whyNote: 'No decimos ser neutrales en carbono. Decimos fabricar menos cosas que nadie quiere.',
    stamps: [
      ['Hecho tras tu pedido', 'Nada espera en stock a un congreso cancelado.'],
      ['Desde 12 piezas', 'Un piloto vale más que un palé del que te arrepientes.'],
      ['Para usar dos veces', 'Bordado real, esmalte blando, algodón peinado.'],
      ['Papel, no plástico', 'Envoltorios y cajas de papel por defecto.'],
      ['Devuélvelo', 'Las piezas sin usar vuelven al taller para rehacerse.'],
    ],
    buildH: 'Empezar un pedido', buildP: 'Esta página no cotiza ni cobra. Crea la hoja que nos envías. El pedido queda en este dispositivo hasta que lo copies.',
    ticket: 'Orden de trabajo', stages: ['Pieza', 'Color', 'Ubicación', 'Cantidad', 'Nota de arte'],
    artPlaceholder: 'Tu logo, una tinta. El archivo de arte va después de la hoja.',
    add: 'Añadir al pedido', clear: 'Empezar de nuevo',
    proofH: 'Prueba', proofLabel: 'Prueba · dibujo ilustrativo · sin aprobar', tallyLabel: 'un trazo = un pedido mínimo',
    runH: 'Tu pedido', emptyTag: 'Vacío', emptyP: 'Aún no hay nada en la orden. Añade una pieza y aparece aquí.',
    totals: ['Piezas', 'Talleres', 'Plazo de producción', 'Precio'], quoted: 'Se cotiza por pedido',
    copy: 'Copiar la hoja', email: 'Enviar la hoja por correo', link: 'Copiar un enlace',
    faqH: 'Lo que la gente pregunta de verdad',
    faq: [
      ['¿Por qué se llama VibeShit?', 'Porque en eso se convierte casi todo. El nombre nos mantiene honestos: si una pieza no vale para usarse dos veces, no deberíamos fabricarla. El logo es el chiste. La producción no.'],
      ['¿Cuál es el pedido mínimo?', '12 piezas en gorras, gorros, camisetas y sudaderas; 25 en pins y llaveros; 50 en packs de pegatinas. Cada línea tiene su taller y su mínimo.'],
      ['¿Cuánto cuesta?', 'Cotizamos cada pedido: la cantidad, los colores, la decoración y la tarifa actual del taller lo deciden. Envía la hoja y recibes una cotización con el plazo, no una lista de precios que caduca.'],
      ['¿Podemos ver una muestra antes?', 'Sí. Una pieza lisa de cualquier línea se envía antes del pedido decorado, y su costo se descuenta si el pedido sigue adelante.'],
      ['¿Cuánto tarda?', 'Sombreros 14–18 días, chácharas 10–24 días, prendas 10–16 días tras aprobar la prueba. Un pedido mixto sale en el plazo más largo, en envíos parciales desde cada taller.'],
      ['¿Envían fuera de Estados Unidos?', 'Sí. Cada taller cotiza su propio flete; la hoja indica el destino antes de confirmar nada.'],
      ['¿Las imágenes de esta página son productos reales?', 'No. Las pegatinas y la prueba son dibujos hechos para esta página. Tu prueba viene del taller, dibujada con tu arte.'],
    ],
    footWho: '<strong>VibeShit</strong> — merchandising promocional y regalos, hechos bajo pedido. Una empresa de CommandAGI.',
    footFine: 'Las hojas de pedido se crean en este dispositivo. Esta página no cobra nada ni nos envía nada; nuestro hosting cuenta una visita.',
    footBuild: 'Empezar un pedido',
  },
  'zh-Hans': {
    path: 'zh-Hans/index.html', root: '../', url: 'https://vibeshit.co/zh-Hans/', native: '简体中文',
    title: 'VibeShit — 有人想要，才会存在的周边',
    description: '促销周边与赠品——帽子、小物与衣物——按订单生产，每条产品线由一个垂直合作方完成。没有仓库，没有垃圾山，不需要 5000 件起订。',
    ogDescription: '为你的团队做帽子、小物与衣物，下单后才生产。一张订单表，三个垂直合作方。',
    skip: '跳到正文', home: 'VibeShit 首页', navLabel: '主导航', langLabel: '语言：简体中文',
    nav: ['桌上的货', '一单怎么走', '为什么叫这个名字', '开一单'],
    eyebrow: '按订单生产的促销周边',
    h1: ['有人想要，', '才会存在的', '<em>周边。</em>'],
    lede: '帽子、小物、衣物。你下单才生产，由三家各只做一件事的工坊完成。没有垃圾山。',
    cta: '开一单', cta2: '一单怎么走',
    pileLabel: '桌上的货', pileHint: '拖动这堆贴纸。点一件，就用它开一单。都是画，不是照片。',
    words: { min: '12 件起', warehouse: '0 个仓库', proof: '24 小时出样', after: '下单后才做' },
    linesH: ['三条产品线，', '三家只做这一件事的工坊。'],
    linesP: '你只下一次单。每家工坊只做订了的东西，直接发货。',
    min: '起订', daysWord: '天', madeToOrder: '按单生产',
    howH: '一单怎么走', howP: '四遍，就像四色印刷。你确认打样之前，什么都不生产。',
    steps: [
      ['选好商品', '款式、颜色、图案位置、数量。'],
      ['我们分派产品线', '每条线连同尺码和图案交给各自的工坊。'],
      ['一天出样', '每件有装饰的商品都有打样。你说好，或者说改。'],
      ['生产，然后发货', '箱子从工坊发出，不经过我们的仓库。'],
    ],
    printLabel: '随滚动逐层叠印的四色印刷',
    whyEyebrow: '为什么叫这个名字',
    whyH: ['名字是个玩笑，', '问题是那座垃圾山。'],
    whyP: '大多数周边都是批量订购，发一次，穿一周。然后进抽屉，再进垃圾桶。我们用垃圾桶给公司起名，这样谁都不用假装。',
    whyNote: '我们不声称碳中和。我们只声称少做没人要的东西。',
    stamps: [
      ['下单后才做', '不会有库存等着一场取消的会议。'],
      ['12 件起', '试做一小批，胜过后悔一整托盘。'],
      ['值得穿第二次', '真刺绣、烤漆、环纺棉。'],
      ['用纸，不用塑料', '默认纸包装和纸箱。'],
      ['可以寄回', '没穿过的商品退回工坊重做。'],
    ],
    buildH: '开一单', buildP: '这个页面不报价，也不收费。它只生成你发给我们的订单表。订单保存在这台设备上，直到你复制它。',
    ticket: '工单', stages: ['商品', '颜色', '位置', '数量', '图案说明'],
    artPlaceholder: '你的标志，单色。图案文件在订单表之后发送。',
    add: '加入订单', clear: '重新开始',
    proofH: '打样', proofLabel: '打样 · 示意图 · 未确认', tallyLabel: '一笔 = 一个起订量',
    runH: '你的订单', emptyTag: '空', emptyP: '工单上还没有东西。添加一件，它会出现在这里。',
    totals: ['件数', '工坊', '生产周期', '价格'], quoted: '按单报价',
    copy: '复制订单表', email: '用邮件发送订单表', link: '复制链接',
    faqH: '大家真正会问的问题',
    faq: [
      ['为什么叫 VibeShit？', '因为大多数周边最后都成了这个。这个名字让我们保持诚实：一件东西不值得穿第二次，我们就不该做。标志是玩笑，生产不是。'],
      ['最小起订量是多少？', '帽子、针织帽、T 恤和连帽衫 12 件；徽章和钥匙扣 25 件；贴纸包 50 件。每条线有自己的工坊和起订量。'],
      ['价格是多少？', '每单单独报价：数量、颜色、工艺和工坊当前的价格决定它。发来订单表，你会收到一份带生产周期的报价，而不是一张会过期的价目表。'],
      ['可以先看样品吗？', '可以。任何产品线都可以先寄一件素色样品，如果正式下单，样品费用从订单中扣除。'],
      ['需要多长时间？', '打样确认后：帽子 14–18 天，小物 10–24 天，衣物 10–16 天。混合订单按最长周期，从各工坊分批发货。'],
      ['可以寄到美国以外吗？', '可以。每家工坊单独报运费；确认之前，订单表会写明目的地。'],
      ['页面上的图是真实商品吗？', '不是。贴纸和打样都是为这个页面画的示意图。你的打样由工坊根据你的图案绘制。'],
    ],
    footWho: '<strong>VibeShit</strong> — 按订单生产的促销周边与赠品。CommandAGI 旗下公司。',
    footFine: '订单表在这台设备上生成。这个页面不收款，也不向我们发送任何东西；我们的托管方会统计一次页面访问。',
    footBuild: '开一单',
  },
};

const ALTERNATES = { en: '', es: 'es/', 'zh-Hans': 'zh-Hans/' };
const INK_PASSES = ['chartreuse', 'magenta', 'cyan', 'ink'];

function page(lang) {
  const c = COPY[lang];
  const r = c.root;
  const href = (target) => {
    if (lang === 'en') return ALTERNATES[target] || './';
    return target === 'en' ? '../' : target === lang ? './' : `../${ALTERNATES[target]}`;
  };
  const tags = Object.entries(LINES).map(([lineId, line], i) => {
    const items = ITEMS.filter((item) => item.line === lineId);
    return `
        <article class="tag tag--${lineId}" style-index="${i}">
          <span class="tag__hole" aria-hidden="true"></span>
          <h3>${esc(line.name[lang])}</h3>
          <p class="tag__shop">${esc(line.shop[lang])}</p>
          <ul>
${items.map((item) => `            <li><span>${esc(item.name[lang])}</span><span>${esc(c.min)} ${item.min}</span></li>`).join('\n')}
          </ul>
          <p class="tag__days">${line.days} ${esc(c.daysWord)} · ${esc(c.madeToOrder)}</p>
        </article>`;
  }).join('');

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.title)}</title>
<meta name="description" content="${esc(c.description)}">
<meta property="og:title" content="${esc(c.title)}">
<meta property="og:description" content="${esc(c.ogDescription)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${c.url}">
<meta property="og:image" content="https://vibeshit.co/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' https://cloudflareinsights.com; img-src 'self' data:; style-src 'self'; script-src 'self' https://static.cloudflareinsights.com; base-uri 'none'; form-action 'none'">
<meta name="theme-color" content="#e6ff58">
<link rel="icon" href="${r}mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${r}touch-icon.png">
<link rel="preload" href="${r}fonts/bowlby-one.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${r}fonts/space-mono-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r}style.css">
<link rel="alternate" hreflang="en" href="https://vibeshit.co/">
<link rel="alternate" hreflang="es" href="https://vibeshit.co/es/">
<link rel="alternate" hreflang="zh-Hans" href="https://vibeshit.co/zh-Hans/">
</head>
<body>
<a class="skip" href="#main">${esc(c.skip)}</a>

<header class="tape">
  <a class="tape__brand" href="./" aria-label="${esc(c.home)}"><img src="${r}wordmark.svg" alt="VibeShit" width="201" height="44"></a>
  <nav class="tape__nav" aria-label="${esc(c.navLabel)}">
    <a href="#lines"><b>01</b> ${esc(c.nav[0])}</a>
    <a href="#how"><b>02</b> ${esc(c.nav[1])}</a>
    <a href="#landfill"><b>03</b> ${esc(c.nav[2])}</a>
    <a class="tape__go" href="#build"><b>04</b> ${esc(c.nav[3])}</a>
  </nav>
  <button class="lang-btn" type="button" id="lang-button" aria-haspopup="dialog" aria-label="${esc(c.langLabel)}">
    <span class="lang-btn__glyph" aria-hidden="true">A<span>/</span><span lang="zh-Hans">文</span></span>
  </button>
</header>

<dialog id="lang-dialog" aria-label="Language">
  <ul class="lang-list">
${Object.keys(COPY).map((other) => `    <li><a href="${href(other)}"${other === lang ? ' aria-current="true"' : ''}${other !== lang ? ` hreflang="${other}"` : ''}><span${other === 'zh-Hans' ? ' lang="zh-Hans"' : other === 'es' ? ' lang="es"' : ' lang="en"'}>${COPY[other].native}</span><small>${other}</small></a></li>`).join('\n')}
  </ul>
</dialog>

<main id="main">

  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__copy">
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h1 id="hero-title">${c.h1.map((line, i) => `<span class="h1-line h1-line--${i}">${line}</span>`).join(' ')}</h1>
      <p class="lede">${esc(c.lede)}</p>
      <p class="actions"><a class="button button--go" href="#build">${esc(c.cta)}</a> <a class="button button--tape" href="#how">${esc(c.cta2)}</a></p>
    </div>
    <div class="pile" id="pile" aria-hidden="true" data-words="${esc(JSON.stringify(c.words))}"></div>
    <div class="setlist">
      <h2 class="setlist__title" id="pile-label">${esc(c.pileLabel)}</h2>
      <ul aria-labelledby="pile-label">
${ITEMS.map((item) => `        <li><button type="button" data-pick="${item.id}">${esc(item.name[lang])}<span aria-hidden="true">→</span></button></li>`).join('\n')}
      </ul>
      <p class="setlist__hint">${esc(c.pileHint)}</p>
    </div>
  </section>

  <section id="lines" class="lines" aria-labelledby="lines-title">
    <h2 id="lines-title"><span>${esc(c.linesH[0])}</span> <span>${esc(c.linesH[1])}</span></h2>
    <p class="lines__lede">${esc(c.linesP)}</p>
    <div class="tags">${tags}
    </div>
  </section>

  <section id="how" class="how" aria-labelledby="how-title">
    <div class="how__copy">
      <h2 id="how-title">${esc(c.howH)}</h2>
      <p>${esc(c.howP)}</p>
      <ol class="passes">
${c.steps.map(([h, p], i) => `        <li class="pass pass--${INK_PASSES[i]}"><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('\n')}
      </ol>
    </div>
    <div class="print" role="img" aria-label="${esc(c.printLabel)}">
      <svg viewBox="0 0 400 400" aria-hidden="true">
        <g class="ink ink--chartreuse"><path d="M60 120c20-70 120-90 160-40 50-40 140-10 120 70 60 20 50 120-10 130 10 70-80 90-120 50-40 50-140 20-130-50-60-20-70-110-20-160Z"/></g>
        <g class="ink ink--magenta"><path d="M206 52 120 214h68l-26 128 116-178h-74l46-112Z"/></g>
        <g class="ink ink--cyan"><circle cx="300" cy="300" r="46"/><circle cx="96" cy="96" r="22"/><circle cx="330" cy="92" r="14"/></g>
        <g class="ink ink--ink"><path d="M40 360c40-30 80 30 120 0s80 30 120 0 80 30 100 10" fill="none" stroke-width="12" stroke-linecap="round"/><path d="M28 28h30M43 13v30M342 28h30M357 13v30M28 372h30M43 357v30M342 372h30M357 357v30" fill="none" stroke-width="3"/></g>
      </svg>
    </div>
  </section>

  <section id="landfill" class="landfill" aria-labelledby="landfill-title">
    <p class="eyebrow">${esc(c.whyEyebrow)}</p>
    <h2 id="landfill-title"><span>${esc(c.whyH[0])}</span> <span>${esc(c.whyH[1])}</span></h2>
    <p class="landfill__p">${esc(c.whyP)}</p>
    <ul class="stamps">
${c.stamps.map(([b, s], i) => `      <li class="stamp stamp--${i}"><b>${esc(b)}</b><span>${esc(s)}</span></li>`).join('\n')}
    </ul>
    <p class="landfill__note">${esc(c.whyNote)}</p>
  </section>

  <section id="build" class="build" aria-labelledby="build-title">
    <header class="build__head">
      <h2 id="build-title">${esc(c.buildH)}</h2>
      <p>${esc(c.buildP)}</p>
    </header>
    <div class="builder">
      <form class="ticket" id="builder-form" novalidate>
        <p class="ticket__label">${esc(c.ticket)}</p>
        <fieldset class="stage" id="stage-piece"><legend><b>01</b> ${esc(c.stages[0])}</legend><div class="chips chips--pieces" id="item-chips"></div></fieldset>
        <fieldset class="stage"><legend><b>02</b> ${esc(c.stages[1])}</legend><div class="chips chips--drops" id="color-chips"></div></fieldset>
        <fieldset class="stage"><legend><b>03</b> ${esc(c.stages[2])}</legend><div class="chips" id="place-chips"></div></fieldset>
        <fieldset class="stage"><legend><b>04</b> ${esc(c.stages[3])}</legend><div class="chips chips--qty" id="qty-chips"></div><p class="tally" id="tally" title="${esc(c.tallyLabel)}"></p></fieldset>
        <div class="stage"><label class="stage__label" for="art-note"><b>05</b> ${esc(c.stages[4])}</label><textarea id="art-note" rows="3" maxlength="240" placeholder="${esc(c.artPlaceholder)}"></textarea></div>
        <p class="ticket__actions"><button class="button button--go" type="submit" id="add-button">${esc(c.add)}</button> <button class="button button--tape" type="button" id="clear-button">${esc(c.clear)}</button></p>
        <p class="saved" id="saved" role="status" aria-live="polite"></p>
      </form>

      <figure class="proof" aria-labelledby="proof-caption">
        <p class="proof__label">${esc(c.proofLabel)}</p>
        <div class="proof__art" id="proof"></div>
        <figcaption id="proof-caption"></figcaption>
        <p class="proof__note" id="proof-note"></p>
      </figure>

      <div class="sheet" id="sheet" aria-live="polite">
        <header><h3>${esc(c.runH)}</h3><span class="sheet__tag" id="sheet-tag">${esc(c.emptyTag)}</span></header>
        <ul class="sheet-lines" id="sheet-lines"></ul>
        <p class="sheet__empty" id="sheet-empty">${esc(c.emptyP)}</p>
        <dl class="totals" id="totals" hidden>
          <div><dt>${esc(c.totals[0])}</dt><dd id="total-pieces">0</dd></div>
          <div><dt>${esc(c.totals[1])}</dt><dd id="total-partners">0</dd></div>
          <div><dt>${esc(c.totals[2])}</dt><dd id="total-window">–</dd></div>
          <div><dt>${esc(c.totals[3])}</dt><dd>${esc(c.quoted)}</dd></div>
        </dl>
        <p class="sheet__actions">
          <button class="button button--tape" type="button" id="copy-button">${esc(c.copy)}</button>
          <a class="button button--go" id="email-button" href="mailto:hello@vibeshit.co">${esc(c.email)}</a>
          <button class="button button--tape" type="button" id="link-button">${esc(c.link)}</button>
        </p>
        <p class="saved" id="sheet-status" role="status" aria-live="polite"></p>
      </div>
    </div>
  </section>

  <section id="faq" class="faq" aria-labelledby="faq-title">
    <h2 id="faq-title">${esc(c.faqH)}</h2>
${c.faq.map(([q, a]) => `    <details>
      <summary>${esc(q)}</summary>
      <p>${esc(a)}</p>
    </details>`).join('\n')}
  </section>

</main>

<footer class="foot">
  <img class="foot__mark" src="${r}wordmark.svg" alt="" width="603" height="132">
  <div class="foot__who">
    <p>${c.footWho}</p>
    <p class="fine">${esc(c.footFine)}</p>
  </div>
  <p class="foot__links">
    <a href="mailto:hello@vibeshit.co">hello@vibeshit.co</a>
    <a href="#build">${esc(c.footBuild)}</a>
${Object.keys(COPY).filter((o) => o !== lang).map((o) => `    <a href="${href(o)}" hreflang="${o}" lang="${o}">${COPY[o].native}</a>`).join('\n')}
    <span class="fine">vibeshit.co</span>
  </p>
</footer>

<script type="module" src="${r}app.js"></script>
</body>
</html>
`;
}

for (const lang of Object.keys(COPY)) {
  const out = join(SITE, COPY[lang].path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page(lang).replace(/ style-index="\d"/g, ''));
  console.log(`wrote ${COPY[lang].path}`);
}
export { COPY, COLORS };
