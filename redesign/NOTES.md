# VibeShit redesign: notes (2026-10-26)

## generated media (fal): not made

`redesign/media.mjs` is ready: seven piece stills (fal-ai/nano-banana-pro, $0.15 each) cut out with
fal-ai/birefnet/v2 for the sticker pile, and three full-bleed loops (a still, then
fal-ai/kling-video/v2.5-turbo/pro/image-to-video at $0.07/s: `table` 10 s, `pull` 5 s, `pile` 5 s), encoded to
AV1 + H.264 at 1280 wide with WebP posters. Estimated cost $3.00 of the $15 budget. The prompts are in the script.

The first request was refused on 2026-10-26: `403 User is locked. Reason: Exhausted balance.` The cascade has one
fal account (`SVC__FAL__MAIN`); topping it up is the owner's money decision. Spent: $0.00 (`media-log.json` has no
paid rows). After a top-up: `COMMANDAGI_ENV_ROOT=<folder with .env> FFMPEG=<ffmpeg with libaom, libx264, libwebp>
node redesign/media.mjs`, then put the loops into the page (the full-bleed sections between the lines, the how and
the why) and the cut-outs into the pile.

Until then, every image on the site is a drawing made in code (`catalog.js` DRAWINGS: one path per piece), and the
page says so.

## other assets

`wordmark.svg` and `mark.svg`: Bowlby One outlines with hand-set kerning and tilt, cut out like a sticker
(`redesign/wordmark.py`). `og.png` (1200×630) and `touch-icon.png` (180×180) rendered from the page by
`redesign/shots.py`. Fonts: Bowlby One and Space Mono (OFL, `fonts/OFL.txt`), latin subsets with fontTools.

## look-at-it rounds (Playwright: 1440, 768, 390, 320, reduced motion, three locales; `redesign/shots.py`)

1. The grain tile at 55 % alpha turned the acid olive and the paper grey → 13 %.
2. The pile sat below the first screen at 1440 (the headline took 830 px) and its stickers waited, visible, over the
   copy → headline capped by 9.6svh, pile row 30svh, stickers hidden until the pile enters the viewport.
   Every width was 16–56 px wider than the viewport (the tape's bleed, the rotated stamps) → `overflow-x: clip` on html.
3. The run's tape buttons vanished on the kraft envelope → paper tape there. "1 lines" → singular. The tally's
   fifth stroke drawn as a broken diagonal → a magenta fifth stroke and a gap. The hoodie's hood read as a lump →
   redrawn.
4. zh-Hans hero lines collided at 0.86 leading → 1.08. The lede touched the magenta "wanted it." block → more space.

## measured (local static server, Chromium, 1.6 Mb/s + 150 ms RTT, CPU ×4)

| | LCP | CLS | JS before interaction | axe-core 4.10 (WCAG 2 A/AA, 2.1 AA, 2.2 AA) |
|---|---|---|---|---|
| 390 | 0.94 s | 0 | app.js + catalog.js, 28 KB raw | none in en, es, zh-Hans |
| 1440 | 0.97 s | 0 | same | none in en, es, zh-Hans |
