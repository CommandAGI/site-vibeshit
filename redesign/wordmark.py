"""
VibeShit's wordmark and favicon, from Bowlby One's outlines (OFL), each letter set by hand: its own nudge, its own
tilt, the kerning tightened until the letters touch, then the whole word cut out like a sticker (a white border, an
ink hairline round it). Needs fontTools:  python redesign/wordmark.py <BowlbyOne-Regular.ttf>
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

font = TTFont(sys.argv[1])
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font["head"].unitsPerEm
scale = 120 / upm  # cap height ~ 86 px at this size

# (letter, extra advance in font units after it, rise in px, tilt in degrees). Hand-set: the lower-case bounces,
# the S leans back against the e, the t kicks forward.
SET = [("V", -40, 0, -3), ("i", -30, -4, 4), ("b", -50, 2, -2), ("e", -60, -2, 5),
       ("S", -40, 4, -6), ("h", -50, -3, 3), ("i", -30, 3, -4), ("t", 0, -2, 7)]


def word_paths(set_):
    x = 0.0
    parts = []
    for ch, extra, rise, tilt in set_:
        name = cmap[ord(ch)]
        g = glyphs[name]
        pen = SVGPathPen(glyphs)
        bounds = BoundsPen(glyphs)
        g.draw(bounds)
        xmin, ymin, xmax, ymax = bounds.bounds
        cx = (xmin + xmax) / 2 * scale
        cy = -(ymin + ymax) / 2 * scale
        # flip y (font units are y-up), place at x, then tilt round the glyph's own centre
        tp = TransformPen(pen, (scale, 0, 0, -scale, 0, 0))
        g.draw(tp)
        parts.append((pen.getCommands(), x, rise, tilt, cx, cy))
        x += (g.width + extra) * scale
    return parts, x


def svg(parts, width, height, baseline, pad):
    paths = []
    for d, x, rise, tilt, cx, cy in parts:
        tx = x + pad
        ty = baseline + rise
        paths.append(f'<path transform="translate({tx:.1f} {ty:.1f}) rotate({tilt} {cx:.1f} {cy:.1f})" d="{d}"/>')
    group = "".join(paths)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.0f} {height}" role="img" aria-label="VibeShit">'
        f'<defs><g id="w">{group}</g></defs>'
        '<use href="#w" fill="#0b0b0b" stroke="#0b0b0b" stroke-width="22" stroke-linejoin="round"/>'
        '<use href="#w" fill="#ffffff" stroke="#ffffff" stroke-width="16" stroke-linejoin="round"/>'
        '<use href="#w" fill="#0b0b0b"/>'
        "</svg>\n"
    )


parts, advance = word_paths(SET)
pad = 16
open("wordmark.svg", "w").write(svg(parts, advance + pad * 2, 132, 104, pad))

# The favicon: a V on an acid die-cut blob.
v = glyphs[cmap[ord("V")]]
pen = SVGPathPen(glyphs)
b = BoundsPen(glyphs)
v.draw(b)
xmin, ymin, xmax, ymax = b.bounds
s = 18 / (ymax - ymin)
tx = 16 - (xmin + xmax) / 2 * s
ty = 16 + (ymin + ymax) / 2 * s
v.draw(TransformPen(pen, (s, 0, 0, -s, tx, ty)))
blob = "M5 9c2-6 9-7 12-3 4-3 11-1 10 5 4 2 3 10-2 11 0 5-7 7-10 3-4 4-11 1-10-4-5-2-4-9 0-12Z"
open("mark.svg", "w").write(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
    f'<path d="{blob}" fill="#e6ff58" stroke="#0b0b0b" stroke-width="1.6" stroke-linejoin="round"/>'
    f'<path transform="rotate(-6 16 16)" d="{pen.getCommands()}" fill="#0b0b0b"/></svg>\n'
)
print(f"wordmark.svg {advance + pad * 2:.0f}x132, mark.svg")
