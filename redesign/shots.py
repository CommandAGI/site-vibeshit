"""
Look at the site: full-page screenshots at 1440, 768, 390 and 320, reduced motion, each locale, into redesign/.shots/
(not committed). Also renders og.png (1200x630) and touch-icon.png (180x180) from the page's own CSS, and drives the
order builder once (pick, add, the sheet's totals) so a broken run shows up here first.

  python3 redesign/shots.py [base-url]     (default: serves this folder on a free port)
"""
import functools, http.server, os, sys, threading
from playwright.sync_api import sync_playwright

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(SITE, "redesign", ".shots")
os.makedirs(OUT, exist_ok=True)

server = None
if len(sys.argv) > 1:
    base = sys.argv[1].rstrip("/")
else:
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=SITE)
    handler.log_message = lambda *a: None
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"

errors = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    for width, height in [(1440, 900), (768, 1024), (390, 844), (320, 640)]:
        for locale, path in [("en", "/"), ("es", "/es/"), ("zh-Hans", "/zh-Hans/")]:
            if locale != "en" and width not in (1440, 390):
                continue
            for motion in ["no-preference", "reduce"]:
                if motion == "reduce" and (locale != "en" or width not in (1440, 390)):
                    continue
                page = browser.new_page(viewport={"width": width, "height": height}, reduced_motion=motion)
                page.on("console", lambda m: m.type == "error" and errors.append(m.text))
                page.on("pageerror", lambda e: errors.append(str(e)))
                page.goto(base + path)
                page.wait_for_timeout(3500)
                tag = f"{locale}-{width}{'-reduced' if motion == 'reduce' else ''}"
                page.screenshot(path=os.path.join(OUT, f"{tag}-fold.png"))
                page.screenshot(path=os.path.join(OUT, f"{tag}-full.png"), full_page=True)
                overflow = page.evaluate("document.documentElement.scrollWidth - innerWidth")
                if overflow > 0:
                    errors.append(f"{tag}: page is {overflow}px wider than the viewport")
                page.close()

    # Drive the run once: pick the hoodie from the set list, add it, check the sheet.
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(base + "/")
    page.click('[data-pick="hoodie"]')
    page.wait_for_timeout(600)
    page.locator("#place-chips button").nth(1).click()
    page.locator("#qty-chips button").nth(2).click()
    page.fill("#art-note", "Puff print, one ink")
    page.click("#add-button")
    pieces = page.inner_text("#total-pieces")
    if pieces != "144":
        errors.append(f"the run counts {pieces} pieces, not 144")
    page.locator("#build").screenshot(path=os.path.join(OUT, "en-1440-build.png"))
    # The four-ink print builds with scroll: look at it part way and all the way in.
    for frac in (0.25, 0.6):
        page.evaluate(f"(() => {{ const h = document.getElementById('how'); scrollTo(0, h.offsetTop - innerHeight + h.offsetHeight * {frac}); }})()")
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(OUT, f"en-1440-how-{int(frac*100)}.png"))
    page.close()

    # The OG image and the touch icon, from the page itself.
    page = browser.new_page(viewport={"width": 1200, "height": 630}, reduced_motion="reduce", bypass_csp=True)
    page.goto(base + "/")
    page.add_style_tag(content=".tape{display:none}.hero{min-height:630px;padding-top:56px}.setlist{display:none}.hero .lede,.actions{display:none}.hero h1{font-size:104px}")
    page.wait_for_timeout(1500)
    page.screenshot(path=os.path.join(SITE, "og.png"))
    page.set_viewport_size({"width": 180, "height": 180})
    page.set_content(f'<body style="margin:0;background:#e6ff58;display:grid;place-items:center;height:180px"><img src="{base}/mark.svg" width="150" height="150"></body>')
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(SITE, "touch-icon.png"))
    browser.close()

if server:
    server.shutdown()
print("\n".join(errors) if errors else "no errors")
