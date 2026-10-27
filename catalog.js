/*
 * VibeShit's catalog: the three lines, the pieces in them, their colourways and where art can go. Pure data, read by
 * the page (app.js) and by the page generator (redesign/locales.mjs), so the tags, the stickers and the order builder
 * never disagree. `days` is the shop's production window; `min` its smallest run.
 */

export const LOCALES = ['en', 'es', 'zh-Hans'];

export const LINES = {
  headwear: {
    name: { en: 'Headwear', es: 'Sombreros', 'zh-Hans': '帽子' },
    shop: { en: 'An embroidery shop', es: 'Un taller de bordado', 'zh-Hans': '一家刺绣工坊' },
    days: '14–18',
  },
  trinkets: {
    name: { en: 'Trinkets', es: 'Chácharas', 'zh-Hans': '小物' },
    shop: { en: 'A soft-enamel studio', es: 'Un estudio de esmalte', 'zh-Hans': '一家烤漆工坊' },
    days: '10–24',
  },
  threads: {
    name: { en: 'Threads', es: 'Prendas', 'zh-Hans': '衣物' },
    shop: { en: 'A cut-and-sew mill', es: 'Un taller de confección', 'zh-Hans': '一家针织成衣厂' },
    days: '10–16',
  },
};

export const COLORS = {
  ink: { hex: '#121417', en: 'Ink', es: 'Tinta', 'zh-Hans': '墨黑' },
  bone: { hex: '#e8e2d3', en: 'Bone', es: 'Hueso', 'zh-Hans': '骨白' },
  signal: { hex: '#e2541f', en: 'Signal', es: 'Señal', 'zh-Hans': '信号橙' },
  moss: { hex: '#3d4b3a', en: 'Moss', es: 'Musgo', 'zh-Hans': '苔绿' },
  oat: { hex: '#d8c9a8', en: 'Oat', es: 'Avena', 'zh-Hans': '燕麦' },
  clay: { hex: '#b4644a', en: 'Clay', es: 'Arcilla', 'zh-Hans': '陶土' },
  brass: { hex: '#b08d4f', en: 'Brass', es: 'Latón', 'zh-Hans': '黄铜' },
  nickel: { hex: '#8d9299', en: 'Black nickel', es: 'Níquel negro', 'zh-Hans': '黑镍' },
};

/** Where art can go. `box` is the art's rectangle on the piece's drawing (viewBox 0 0 200 200), for the proof. */
export const PLACES = {
  front: { box: [74, 64, 52, 30], en: 'Front panel', es: 'Panel frontal', 'zh-Hans': '正面' },
  side: { box: [112, 86, 36, 24], en: 'Side', es: 'Lateral', 'zh-Hans': '侧面' },
  back: { box: [60, 92, 40, 18], en: 'Back, above the strap', es: 'Atrás, sobre el cierre', 'zh-Hans': '后方，调节带上方' },
  cuff: { box: [80, 134, 40, 26], en: 'Cuff', es: 'Vuelta', 'zh-Hans': '翻边' },
  label: { box: [128, 138, 20, 18], en: 'Woven label', es: 'Etiqueta tejida', 'zh-Hans': '织唛' },
  whole: { box: [50, 20, 100, 160], en: 'The whole piece', es: 'Toda la pieza', 'zh-Hans': '整件' },
  bothfaces: { box: [64, 70, 72, 72], en: 'Both faces', es: 'Ambas caras', 'zh-Hans': '双面' },
  chest: { box: [110, 62, 26, 22], en: 'Left chest', es: 'Pecho izquierdo', 'zh-Hans': '左胸' },
  fullfront: { box: [68, 64, 64, 72], en: 'Full front', es: 'Frente completo', 'zh-Hans': '正面大图' },
  fullback: { box: [68, 64, 64, 72], en: 'Full back', es: 'Espalda completa', 'zh-Hans': '背面大图' },
};

export const ITEMS = [
  {
    id: 'cap', line: 'headwear', days: [14, 18], min: 12,
    name: { en: 'Structured cap', es: 'Gorra estructurada', 'zh-Hans': '硬顶棒球帽' },
    note: {
      en: 'Heavy cotton twill, six panels, embroidery front or side.',
      es: 'Sarga de algodón gruesa, seis paneles, bordado al frente o al lado.',
      'zh-Hans': '厚棉斜纹，六片帽型，正面或侧面刺绣。',
    },
    colors: ['ink', 'bone', 'signal'], places: ['front', 'side', 'back'],
  },
  {
    id: 'beanie', line: 'headwear', days: [14, 18], min: 12,
    name: { en: 'Rib beanie', es: 'Gorro acanalado', 'zh-Hans': '罗纹针织帽' },
    note: {
      en: 'Merino blend, cuff or flat, a woven label or a small embroidery.',
      es: 'Mezcla de merino, con vuelta o liso, etiqueta tejida o bordado pequeño.',
      'zh-Hans': '美利奴混纺，翻边或平口，织唛或小面积刺绣。',
    },
    colors: ['moss', 'ink', 'oat'], places: ['cuff', 'label'],
  },
  {
    id: 'pin', line: 'trinkets', days: [18, 24], min: 25,
    name: { en: 'Soft enamel pin', es: 'Pin de esmalte blando', 'zh-Hans': '烤漆徽章' },
    note: {
      en: 'Two inks, metal edges, butterfly clutch or a magnet back.',
      es: 'Dos tintas, borde metálico, cierre de mariposa o imán.',
      'zh-Hans': '两色烤漆，金属边，蝴蝶扣或磁吸背。',
    },
    colors: ['brass', 'nickel'], places: ['whole'],
  },
  {
    id: 'keyring', line: 'trinkets', days: [18, 24], min: 25,
    name: { en: 'Die-cut keyring', es: 'Llavero troquelado', 'zh-Hans': '异形钥匙扣' },
    note: {
      en: 'Acrylic or metal, your silhouette, one or two faces.',
      es: 'Acrílico o metal, tu silueta, una o dos caras.',
      'zh-Hans': '亚克力或金属，按你的轮廓开模，单面或双面。',
    },
    colors: ['ink', 'signal', 'bone'], places: ['front', 'bothfaces'],
  },
  {
    id: 'stickers', line: 'trinkets', days: [10, 14], min: 50,
    name: { en: 'Sticker pack', es: 'Pack de pegatinas', 'zh-Hans': '贴纸包' },
    note: {
      en: 'Five die-cut vinyl stickers, matte, packed in a paper sleeve.',
      es: 'Cinco pegatinas de vinilo troqueladas, mate, en funda de papel.',
      'zh-Hans': '五张异形乙烯基贴纸，哑光，纸套包装。',
    },
    colors: ['bone', 'ink'], places: ['whole'],
  },
  {
    id: 'tee', line: 'threads', days: [10, 14], min: 12,
    name: { en: 'Heavy tee', es: 'Camiseta gruesa', 'zh-Hans': '重磅 T 恤' },
    note: {
      en: '240 gsm ring-spun cotton, screen print one to three inks.',
      es: 'Algodón peinado de 240 g, serigrafía de una a tres tintas.',
      'zh-Hans': '240 克环纺棉，一到三色丝网印刷。',
    },
    colors: ['bone', 'ink', 'moss'], places: ['chest', 'fullfront', 'fullback'],
  },
  {
    id: 'hoodie', line: 'threads', days: [12, 16], min: 12,
    name: { en: 'Boxy hoodie', es: 'Sudadera boxy', 'zh-Hans': '宽松连帽衫' },
    note: {
      en: '400 gsm fleece, embroidery or puff print, kangaroo pocket.',
      es: 'Felpa de 400 g, bordado o estampado puff, bolsillo canguro.',
      'zh-Hans': '400 克抓绒，刺绣或发泡印花，袋鼠口袋。',
    },
    colors: ['oat', 'ink', 'clay'], places: ['chest', 'fullfront', 'fullback'],
  },
];

/**
 * Each piece drawn once, in a 200 × 200 box: the sticker in the pile, the chip in the builder and the proof all use it.
 * `body` takes the colourway; `detail` is drawn over it in ink at low opacity.
 */
export const DRAWINGS = {
  cap: {
    body: 'M34 122C30 70 58 42 100 40c42 2 66 30 66 82ZM30 122h160c6 0 8 6 4 12-10 12-40 14-80 12l-84-4c-6 0-8-12 0-20Z',
    detail: 'M100 40v82M66 52c10 20 14 44 14 70M134 52c-10 20-14 44-14 70M96 36h8',
  },
  beanie: {
    body: 'M46 128V102c0-44 22-68 54-70 32 2 54 26 54 70v26ZM40 126h120v42H40Z',
    detail: 'M52 132v32M64 132v32M76 132v32M88 132v32M100 132v32M112 132v32M124 132v32M136 132v32M148 132v32M100 32v-4',
  },
  pin: {
    body: 'M116 12 48 114h46l-16 76 76-110h-48l30-68Z',
    detail: 'M104 48 74 98M116 96l-24 52',
  },
  keyring: {
    body: 'M100 62l18 36 40 6-29 28 7 40-36-19-36 19 7-40-29-28 40-6Z',
    detail: 'M100 62V40M100 38a14 14 0 1 1 0-28 14 14 0 1 1 0 28Z',
  },
  stickers: {
    body: 'M30 70c10-30 50-36 64-10 20-22 58-10 56 22 30 4 34 46 8 60 8 30-30 48-50 28-20 22-62 10-60-20-30-8-34-56-18-80Z',
    detail: 'M86 80 70 116h22l-8 30 34-44H96l14-22ZM132 88a8 8 0 1 1 0 .1',
  },
  tee: {
    body: 'M66 28 84 22c6 12 26 12 32 0l18 6 44 30-20 32-20-12v102H62V78L42 90 22 58Z',
    detail: 'M84 22c6 16 26 16 32 0M62 78v-6M138 78v-6',
  },
  hoodie: {
    body: 'M64 50c-2-24 14-38 36-38s38 14 36 38l26 6 26 72-24 10-20-40v94H56V88l-20 40-24-10 26-72Z',
    detail: 'M78 50c6 16 38 16 44 0M94 62v24M106 62v24M70 140h60l8 30H62Z',
  },
};
