# site-vibeshit

The site of VibeShit (vibeshit.co), a company of CommandAGI (`org-vibeshit`): promotional merchandise and giveaways —
hats, trinkets and threads — made on demand through a vertical partner for each product line. A static folder served by
CommandAGI's site hosting; mounted in the CommandAGI repository at `seed/drive/platform/org-vibeshit/sites/vibeshit`.

- `index.html`, `style.css`, `app.js`, `catalog.js`, `wordmark.svg`, `mark.svg`, `fonts/`: the page in English — a merch
  table at a basement show (the 2027 redesign, `redesign/DESIGN.md`): a sticker pile of the pieces you can throw, the
  three product lines as hang tags, how a run runs as a four-ink print, the landfill problem the name owns, the
  production-run builder and questions. `catalog.js` holds the lines, pieces, colourways, placements and the one
  drawing of each piece.
- The three locale pages are written by `node redesign/locales.mjs` from one template; edit the copy there.
- `redesign/`: the audit (`CONTENT.md`), the design (`DESIGN.md`), the notes and measurements (`NOTES.md`), the fal
  media script (`media.mjs`), the wordmark (`wordmark.py`) and the screenshot pass (`shots.py`).
- `es/index.html`, `zh-Hans/index.html`: the same page in Spanish and Simplified Chinese. Every locale is a static
  page; the A/文 button in the masthead lists them, and each page says its alternates with `hreflang`.
- The **order sheet** is built in the visitor's browser: pick a piece, a colourway, a placement and a quantity, add an art note, and
  the run lands in `localStorage` and in a copied link (`#run=…`). It is copied as plain text, emailed by the visitor
  through a `mailto:` they send themselves, and nothing is sent by the page. The page's policy names one other
  origin, Cloudflare Web Analytics, because the hosting platform injects its counter on every site it serves; no
  script of ours reaches it. No price is shown:
  a run is quoted by a person, so the money stays the owner's decision.
- `tests/site.test.mjs` — the site's own test: `node --test tests/site.test.mjs`.
- The company's own docs are `seed/drive/platform/org-vibeshit/README.md` in the CommandAGI repository.

Domain → locale: `vibeshit.co` is the primary and serves English; `vibeshit.co/es/` and `vibeshit.co/zh-Hans/` carry
Spanish and Simplified Chinese. A generic TLD is an alias of the primary, not a locale, so no country-code domain is
wired yet.
