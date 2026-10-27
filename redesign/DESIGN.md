# VibeShit: the design (zine and DIY-merch designer)

**Concept.** A merch table at a basement show. The page is acid paper with black gaffer tape across the top; the
pieces are die-cut stickers dumped on a strip of kraft at the bottom of the first screen, and you can throw them
around. Everything that shouts breaks the grid. Everything that takes an order does not: the job ticket is the one
square, untilted thing on the site, because a transaction has to be impeccable.

## type

- **Bowlby One** (display, one weight) for headlines, at sizes that break the scale: 6.3vw on the hero (capped by
  9.6svh so the pile stays in the first screen), 6–8vw on section heads, line height 0.86–0.92, each hero line
  jostled by hand (a translate and a degree or two).
- **Space Mono** 400/700/italic for everything read: body at 1rem/1.6, a 1.333 scale (0.8125, 1, 1.333, 1.777,
  2.369 rem), uppercase tracked labels, tabular numerals for quantities and totals.
- zh-Hans: Bowlby has no CJK; headings fall to the system's heaviest CJK sans (Noto Sans CJK SC 900, PingFang SC),
  hero leading 1.08.
- Self-hosted latin subsets (21 KB + 3×19 KB), preloaded, with metric-adjusted stand-ins (Arial Black, Courier New).

## colour (OKLCH, sRGB fallbacks)

| role | value | on it | contrast |
|---|---|---|---|
| acid ground | oklch(96% .2 118) / #e6ff58 | ink #0b0b0b | 17.6:1 |
| magenta sticker, tag | oklch(68% .22 355) / #f448a1 | ink | 5.9:1 |
| cyan sticker, tag | oklch(83% .11 205) / #55d7e5 | ink | 11.5:1 |
| kraft table, lines | oklch(65% .08 70) / #b68a57 | ink | 6.3:1 |
| black (tape, why, proof, foot) | #0b0b0b | paper #fbfaf2 / acid | 18.8:1 / 17.6:1 |

A 13 %-alpha turbulence grain over every paper (one 160 px SVG tile, a data URL). Riso overprint is
`mix-blend-mode: multiply` on the four-ink print. axe-core 4.10 (WCAG 2.2 AA rules): no violations in any locale.

## shape language (none shared with the set)

- Primary button: a **ticket stub**, black, notched at both ends (clip-path), tilted −1.5°; hover goes magenta and
  straightens. Secondary: a **strip of masking tape**, torn ends, tilted +1°.
- Nav: a **strip of gaffer tape**, sticky, tilted −0.6°, torn ends, numbered like a set list (01–04).
- Language: a round cyan sticker. Tags: **hang tags** (clipped shoulders, a punched hole). Values: **rubber stamps**
  (a rule and an outline 4 px out). FAQ: ruled strips with a Bowlby +/–. Focus: a 3 px **dashed cut line**, magenta
  (acid on black).
- No radius anywhere except the round things that are round (word stickers, ink drops, the language sticker).

## layout

- **1440**: hero copy over 8 columns, the set list (the pile as buttons) taped at columns 9–12, the pile across the
  full bleed in the last ~30svh. Lines: three hang tags at three heights. How: copy left, the print sticky right.
  Builder: job ticket (7fr) beside the proof and the run (5fr).
- **768**: nav collapses to "04 Start a run"; set list under the pile; builder stacks ticket → proof → run.
- **390**: hero headline 13.4vw in four lines, pile 46svh, set list full width; piece chips two up; stamps full width.
- **320**: wordmark 104 px, headline 2.35rem, chip drawings 2.6rem. No horizontal scroll at any width (checked).
- **2560**: the same grid; type caps at 8–8.5rem, so the page widens, not inflates.

## motion (each with a reduced-motion state)

| motion | what it explains | reduced motion |
|---|---|---|
| the pile falls when it first enters the viewport, then can be thrown (a disc physics, 4 passes, sleeps when still) | the merch is a pile; you can pick any piece | the same pile, settled off-screen by the same seed, drawn still; no drag |
| four inks land one per step as "How a run runs" scrolls (`animation-timeline`, misregistered then settling) | a run is four passes, nothing is made before the proof | all four inks printed |
| the proof redraws with a small snap on each choice | the proof follows the ticket | no snap |
| buttons straighten on hover | — | no transition |

Nothing flashes. No autoplaying video at all in this round (see NOTES on fal).

## the signature moment

The sticker pile: 14 die-cut stickers (the seven pieces, three in loud colourways, four facts as round stickers)
fall onto the kraft strip and can be dragged and thrown; a tap on a piece starts a run with it and scrolls to the
ticket. The keyboard way is the set list beside it, the same seven pieces as buttons. The same drawings are the
builder's chips, the proof (with the art box and registration marks) and the run's thumbnails: one drawing per
piece, from `catalog.js`.

## the order builder as a production run

01 Piece → 02 Colourway → 03 Placement → 04 Quantity (a tally: one stroke per minimum run) → 05 Art note → the
proof (black cutting mat, "Proof · illustrative drawing · not approved") → the run (a kraft envelope: lines with
thumbnails, pieces, shops, window, "Quoted per run", copy / email / link).

## media plan

fal: three graded full-bleed loops (the merch table, a squeegee pull, the dumpster of unwanted swag) and seven piece
stills cut out for the pile; prompts and models in `redesign/media.mjs`, budget $15. Not made in this round: the fal
account's balance is exhausted (NOTES). The drawn stickers stand in and are labelled as drawings.

## don'ts

No photos of people. No logos of real companies on any piece. No price. No countdown or "limited". No gradient, no
glass, no soft shadow (hard offset shadows only). No icon pack: every drawing is ours.

## scores (self, after round 4 of looking)

Art direction 8 · brand specificity 9 · product expression 8 · interaction 8 · technical quality 8 · craft 7 —
average 8.0. Craft stays at 7 until the fal loops replace the drawn stand-ins in the full-bleed sections.
