# VibeShit: the audit (2026-10-26)

What the site was before the redesign, and what it must keep.

- **Routes**: `/`, `/es/`, `/zh-Hans/`. Static folder, no build. A/文 language dialog on every page, `hreflang` alternates.
- **The working feature**: the order-sheet builder. Pick a piece, a colourway, a quantity (the minimum ×1, ×4, ×12,
  ×40), an art note; the run is kept in `localStorage` (`vibeshit-run`) and in a copied link (`#run=<base64 JSON>`);
  copy as plain text; email through a `mailto:` the visitor sends. Nothing leaves the page by itself. No price:
  "Quoted per run".
- **The catalog**: 3 lines (headwear, trinkets, threads), 7 pieces, each with a minimum and a production window, 8
  colourways. Unchanged in the redesign; **placement** is added (where the art goes), with the rule that a link
  cannot carry a placement the piece does not have.
- **Claims** (all kept, none added): made after you order; from 12 pieces (25 pins and keyrings, 50 sticker packs);
  three specialist shops, no warehouse of ours; a proof within a day; sample before a run; paper packaging by default;
  unworn pieces taken back; "not claiming to be carbon-neutral". No customers, logos, counts or prices were on the
  site and none are on it now.
- **Disclosures** kept: this page takes no payment and sends nothing; the host counts a page view (Cloudflare Web
  Analytics, named in the CSP).
- **What was weak**: a generic 2024 layout (centered hero, facts strip, three icon cards, four step cards, two-panel
  builder), soft orange on beige, nothing that looked like merchandise.
- **What is a demo**: nothing. The builder is the real way to send an order. The proof drawing and the stickers are
  drawings and say so (the proof's label, the pile's hint, a FAQ answer).
