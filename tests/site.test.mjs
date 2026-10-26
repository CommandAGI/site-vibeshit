/**
 * The site's own test. A static folder has no build step, so what can break is a link, a locale that lost a
 * string, an external asset that crept in, or a page that started talking to the network. Each rule here is
 * one of those; run it with `node --test tests/` from the site's folder.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = { en: 'index.html', es: 'es/index.html', 'zh-Hans': 'zh-Hans/index.html' };
const read = (path) => readFileSync(join(ROOT, path), 'utf8');

test('site.json names the site and ships no build', () => {
  const site = JSON.parse(read('site.json'));
  assert.equal(site.slug, 'vibeshit');
  assert.equal(site.status, 'active');
  assert.equal(site.build, undefined, 'a static folder: the platform serves the files as they are');
});

test('every locale page exists and says which locale it is', () => {
  for (const [locale, path] of Object.entries(LOCALES)) {
    assert.ok(existsSync(join(ROOT, path)), `${path} exists`);
    const html = read(path);
    assert.match(html, new RegExp(`<html lang="${locale}"`), `${path} declares its lang`);
    for (const other of Object.keys(LOCALES)) {
      assert.ok(html.includes(`hreflang="${other}"`), `${path} alternates to ${other}`);
    }
  }
});

test('each page links to the other two locales, and the A/文 picker sits on every page', () => {
  const reach = {
    en: { es: 'es/', 'zh-Hans': 'zh-Hans/' },
    es: { en: '../', 'zh-Hans': '../zh-Hans/' },
    'zh-Hans': { en: '../', es: '../es/' },
  };
  for (const [locale, path] of Object.entries(LOCALES)) {
    const html = read(path);
    assert.match(html, /id="lang-button"/, `${path} has the language button`);
    assert.match(html, /id="lang-dialog"/, `${path} has the language dialog`);
    assert.match(html, /A<span>\/<\/span><span lang="zh-Hans">文<\/span>/, `${path} draws A/文`);
    const dialog = html.slice(html.indexOf('id="lang-dialog"'), html.indexOf('</dialog>'));
    for (const [other, href] of Object.entries(reach[locale])) {
      assert.ok(dialog.includes(`href="${href}"`), `${path}'s picker links ${other} at ${href}`);
    }
    assert.ok(dialog.includes('aria-current="true"'), `${path} marks its own locale in the picker`);
  }
});

test('every relative link and asset of every page exists', () => {
  for (const path of Object.values(LOCALES)) {
    const html = read(path);
    const dir = dirname(path);
    const refs = [...html.matchAll(/(?:href|src)="([^"#:]+)"/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (ref.startsWith('mailto:')) continue;
      const target = normalize(join(ROOT, dir, ref));
      const resolved = ref.endsWith('/') ? target : target;
      const exists = existsSync(resolved) || existsSync(join(resolved, 'index.html'));
      assert.ok(exists, `${path}: ${ref} resolves to a file`);
    }
  }
});

test('no page or script reaches another origin', () => {
  const files = [...Object.values(LOCALES), 'app.js', 'style.css', 'mark.svg'];
  for (const path of files) {
    const text = read(path);
    for (const match of text.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)) {
      const url = match[1];
      const allowed = url.startsWith('https://vibeshit.co/') || url.startsWith('http://www.w3.org/');
      assert.ok(allowed, `${path}: ${url} is not an external asset`);
    }
    assert.ok(!/@import\s+url\(/.test(text), `${path} imports no remote stylesheet`);
    assert.ok(!/fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(text), `${path} sends nothing`);
  }
  for (const path of Object.values(LOCALES)) {
    const policy = read(path).match(/Content-Security-Policy" content="([^"]+)"/)[1];
    // The hosting platform injects Cloudflare Web Analytics on every site it serves; it is the only
    // other origin the page's policy names, and no script of ours reaches it.
    assert.match(policy, /script-src 'self' https:\/\/static\.cloudflareinsights\.com;/, `${path}'s policy runs our script and the host's counter`);
    assert.match(policy, /connect-src 'self' https:\/\/cloudflareinsights\.com;/, `${path}'s policy lets nothing else connect (the counter posts to /cdn-cgi/rum on this origin)`);
    assert.match(policy, /default-src 'self'/, `${path} allows no other origin`);
  }
});

test('the catalog carries every locale, and every piece names a line, a minimum and a window', () => {
  const js = read('app.js');
  const items = [...js.matchAll(/id: '([a-z]+)', line: '([a-z]+)', days: \[(\d+), (\d+)\], min: (\d+)/g)];
  assert.ok(items.length >= 6, 'at least six pieces across the three lines');
  for (const [, id, line, low, high, min] of items) {
    assert.ok(['headwear', 'trinkets', 'threads'].includes(line), `${id} belongs to a line`);
    assert.ok(Number(low) < Number(high), `${id}'s window runs forward`);
    assert.ok(Number(min) >= 12, `${id} has a real minimum`);
  }
  for (const key of ['en', 'es', "'zh-Hans'"]) {
    for (const name of ['Structured cap', 'Rib beanie', 'Soft enamel pin', 'Die-cut keyring', 'Sticker pack', 'Heavy tee', 'Boxy hoodie']) {
      assert.ok(js.includes(name), 'the catalog names its pieces');
    }
    assert.ok(js.includes(`${key === "'zh-Hans'" ? "'zh-Hans'" : key}: {`), `the strings carry ${key}`);
  }
  for (const locale of ['en', 'es', 'zh-Hans']) {
    const page = read(LOCALES[locale]);
    assert.ok(page.includes('id="builder-form"'), `${locale} has the order builder`);
    assert.ok(page.includes('id="sheet-lines"'), `${locale} has the sheet`);
  }
});

test('the order sheet is the only thing that leaves the page, and it leaves by the visitor', () => {
  const js = read('app.js');
  assert.match(js, /mailto:hello@vibeshit\.co\?subject=/, 'the email button composes a mailto');
  assert.match(js, /localStorage\.setItem\('vibeshit-run'/, 'the run is kept on the device');
  assert.match(js, /#run=\$\{payload\}/, 'a copied link carries the run in the fragment');
  assert.ok(!/\$\s?\d/.test(js), 'the page shows no price: a run is quoted by a person');
  for (const path of Object.values(LOCALES)) {
    assert.ok(read(path).includes('Quoted per run') || read(path).includes('Se cotiza por pedido') || read(path).includes('按单报价'), `${path} says the price is quoted, not listed`);
  }
});
