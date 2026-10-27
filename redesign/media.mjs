#!/usr/bin/env node
/*
 * VibeShit's generated media: fal stills (cut out for the sticker pile), fal image-to-video for the full-bleed
 * sections, then the encodes the site serves.
 *
 *   COMMANDAGI_ENV_ROOT=<folder with .env> FFMPEG=<ffmpeg with libaom/libx264/libwebp> node redesign/media.mjs [id …]
 *
 * The key is read from SVC__FAL__MAIN__API_KEY (the env, or <COMMANDAGI_ENV_ROOT>/.env*) and never printed or written.
 * fal's originals stay in redesign/.src/ (not committed, not deployed); a shot whose original exists is not generated
 * again, so a rerun costs nothing. Every paid request is appended to redesign/media-log.json with model, prompt, price.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, "..");
const SRC = join(HERE, ".src");
const OUT = join(SITE, "media");
const LOG = join(HERE, "media-log.json");
const FFMPEG = process.env.FFMPEG || "ffmpeg";

const STILL = { model: "fal-ai/nano-banana-pro", price: 0.15 };
const MOTION = { model: "fal-ai/kling-video/v2.5-turbo/pro/image-to-video", perSecond: 0.07 };
const CUTOUT = { model: "fal-ai/birefnet/v2", price: 0.01 };

// The pieces are shot like a flatbed scan of merch on a table: flat, hard light, every piece blank but for one
// abstract mark, so nothing pretends to be a real client's order.
const PIECE = "Product photograph, perfectly top-down flat lay, hard direct flash, crisp shadow edges, on a seamless plain light grey paper background, the whole object in frame with margin around it, no text, no letters, no logo, no brand, no watermark. Fictional sample, not a real company's merchandise.";
// The full-bleed shots: a basement show's merch corner, tungsten and one acid-green gel, kraft paper, nobody's face.
const ROOM = "Gritty documentary photograph, 35mm film, available light, tungsten warm bulbs with one acid chartreuse-green gel light spill, deep blacks, heavy film grain, no faces visible, no readable text, no logos, no watermark. Fictional, not a real band, venue or event.";

const PIECES = [
  { id: "cap", prompt: `A six-panel structured baseball cap in black heavy cotton twill, seen from the front three-quarter, a small abstract squiggle embroidered on the front panel in acid chartreuse thread. ${PIECE}` },
  { id: "beanie", prompt: `A folded-cuff ribbed knit beanie in dark moss green merino, lying flat, a small plain woven label on the cuff with no writing. ${PIECE}` },
  { id: "pin", prompt: `A soft enamel lapel pin shaped like a lightning-bolt blob, polished brass metal edges, hot magenta and cyan enamel fills, shot close so it fills the frame. ${PIECE}` },
  { id: "keyring", prompt: `A die-cut acrylic keyring in a chunky irregular star silhouette, bone-white with a black abstract doodle printed on it, a steel split ring and short chain. ${PIECE}` },
  { id: "stickers", prompt: `A small fan of five die-cut matte vinyl stickers with thick white borders: abstract blobs, a lightning bolt, a star and a squiggle in acid chartreuse, hot magenta, cyan and black, half slid out of a kraft paper sleeve. ${PIECE}` },
  { id: "tee", prompt: `A heavyweight boxy t-shirt in bone off-white cotton laid perfectly flat, sleeves out, a single large abstract black splat printed on the chest. ${PIECE}` },
  { id: "hoodie", prompt: `A boxy fleece hoodie in oat beige laid flat, hood up behind the shoulders, kangaroo pocket, a small puff-printed abstract black squiggle on the left chest. ${PIECE}` },
];

const SHOTS = [
  {
    id: "table", seconds: "10",
    still: `Low angle across a folding table in the corner of a bare concrete basement, the table covered with brown kraft paper and piled with folded heavy t-shirts, stacked caps, paper-sleeved sticker packs and a jar of enamel pins. A single clamp lamp, a strand of bare bulbs, a sticker-bombed amplifier in the dark behind. Wide 16:9 composition, the left third mostly dark for type. ${ROOM}`,
    motion: "Very slow push in across the table. A gloved hand, face never shown, slides one folded t-shirt onto the pile and leaves. The bulbs glow steadily, no flicker, no flashing. Calm, real time, no cuts.",
  },
  {
    id: "pull", seconds: "5",
    still: `Straight top-down close-up of a screen-printing press: a wooden-handled squeegee resting on a stretched mesh screen above a black t-shirt on a platen, a thick bead of hot magenta ink along the squeegee edge, ink-stained hands in black nitrile gloves at the frame edges. Acid green tape on the screen frame. Wide 16:9 composition. ${ROOM}`,
    motion: "Locked-off top-down camera. The gloved hands pull the squeegee slowly and evenly from left to right across the screen once, the ink spreads in an even sheet. Smooth, steady, no cuts, no flashing.",
  },
  {
    id: "pile", seconds: "5",
    still: `An open steel dumpster behind an office park on an overcast day, heaped with identical cheap giveaway swag: plain blue lanyards, foam stress balls, plastic pens, unworn grey t-shirts still in plastic bags, cheap tote bags, all blank, no writing. Flat dull daylight, desaturated, wide 16:9 composition. Gritty documentary photograph, 35mm film, heavy grain, no people, no readable text, no logos. Fictional.`,
    motion: "Very slow dolly sideways along the dumpster, a light breeze moves one plastic bag. Nothing else moves. Calm, real time, no cuts.",
  },
];

function key() {
  if (process.env.SVC__FAL__MAIN__API_KEY) return process.env.SVC__FAL__MAIN__API_KEY;
  const root = process.env.COMMANDAGI_ENV_ROOT;
  if (!root) throw Error("set COMMANDAGI_ENV_ROOT to the folder whose .env holds SVC__FAL__MAIN__API_KEY");
  for (const f of readdirSync(root).filter((f) => f.startsWith(".env") && !f.includes("example"))) {
    const m = readFileSync(join(root, f), "utf8").match(/^SVC__FAL__MAIN__API_KEY=["']?([^"'\n]+)/m);
    if (m) return m[1];
  }
  throw Error("no SVC__FAL__MAIN__API_KEY in the .env cascade");
}

const log = existsSync(LOG) ? JSON.parse(readFileSync(LOG, "utf8")) : [];
const record = (row) => { log.push({ at: new Date().toISOString(), ...row }); writeFileSync(LOG, JSON.stringify(log, null, 2) + "\n"); };

async function fal(model, input) {
  const auth = { Authorization: `Key ${key()}`, "Content-Type": "application/json" };
  const sub = await fetch(`https://queue.fal.run/${model}`, { method: "POST", headers: auth, body: JSON.stringify(input) });
  const job = await sub.json();
  if (!sub.ok) throw Error(`fal ${model} ${sub.status}: ${JSON.stringify(job).slice(0, 300)}`);
  for (;;) {
    await new Promise((r) => setTimeout(r, 4000));
    const st = await (await fetch(job.status_url, { headers: auth })).json();
    if (st.status === "COMPLETED") break;
    if (st.status !== "IN_QUEUE" && st.status !== "IN_PROGRESS") throw Error(`fal ${model}: ${JSON.stringify(st).slice(0, 300)}`);
  }
  const res = await fetch(job.response_url, { headers: auth });
  const body = await res.json();
  if (!res.ok) throw Error(`fal ${model} result ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
  return { id: job.request_id, body };
}

async function download(url, to) {
  const r = await fetch(url);
  if (!r.ok) throw Error(`download ${r.status}`);
  writeFileSync(to, Buffer.from(await r.arrayBuffer()));
}

const ff = (...a) => execFileSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...a], { stdio: "inherit" });
const dataUrl = (file) => `data:image/png;base64,${readFileSync(file).toString("base64")}`;

async function piece(p) {
  const still = join(SRC, `${p.id}.png`), cut = join(SRC, `${p.id}-cut.png`);
  if (!existsSync(still)) {
    const { id, body } = await fal(STILL.model, { prompt: p.prompt, aspect_ratio: "1:1", num_images: 1, output_format: "png" });
    await download(body.images[0].url, still);
    record({ shot: p.id, kind: "still", model: STILL.model, requestId: id, prompt: p.prompt, usd: STILL.price });
  }
  if (!existsSync(cut)) {
    const { id, body } = await fal(CUTOUT.model, { image_url: dataUrl(still), model: "General Use (Heavy)", operating_resolution: "1024x1024", output_format: "png" });
    await download(body.image.url, cut);
    record({ shot: p.id, kind: "cutout", model: CUTOUT.model, requestId: id, usd: CUTOUT.price });
  }
  mkdirSync(OUT, { recursive: true });
  // Trimmed to the piece, 640 px on its long side: the pile draws them at most ~300 px wide on a 2x screen.
  ff("-i", cut, "-vf", "scale=640:640:force_original_aspect_ratio=decrease:flags=lanczos", "-c:v", "libwebp", "-lossless", "0", "-quality", "78", "-pix_fmt", "yuva420p", join(OUT, `${p.id}.webp`));
  console.log(`${p.id}: done`);
}

// The grade: crushed blacks, a push towards acid green in the shadows, grain. 1280 wide, muted, no audio.
const GRADE = "scale=1280:-2:flags=lanczos,eq=saturation=1.08:contrast=1.12,colorbalance=rs=-0.02:gs=0.04:bs=-0.03,noise=alls=9:allf=t";

async function shot(s) {
  const still = join(SRC, `${s.id}.png`), clip = join(SRC, `${s.id}.mp4`);
  let stillUrl = null;
  if (!existsSync(still)) {
    const { id, body } = await fal(STILL.model, { prompt: s.still, aspect_ratio: "16:9", num_images: 1, output_format: "png" });
    stillUrl = body.images[0].url;
    await download(stillUrl, still);
    record({ shot: s.id, kind: "still", model: STILL.model, requestId: id, prompt: s.still, usd: STILL.price });
  }
  if (!existsSync(clip)) {
    const image_url = stillUrl ?? dataUrl(still);
    const { id, body } = await fal(MOTION.model, { prompt: s.motion, image_url, duration: s.seconds, negative_prompt: "text, logo, watermark, faces, cuts, fast motion, flashing, strobe, flicker" });
    await download(body.video.url, clip);
    record({ shot: s.id, kind: "video", model: MOTION.model, requestId: id, prompt: s.motion, seconds: Number(s.seconds), usd: MOTION.perSecond * Number(s.seconds) });
  }
  mkdirSync(OUT, { recursive: true });
  ff("-i", clip, "-an", "-vf", GRADE, "-c:v", "libaom-av1", "-crf", "40", "-b:v", "0", "-cpu-used", "6", "-row-mt", "1", "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(OUT, `${s.id}.av1.mp4`));
  ff("-i", clip, "-an", "-vf", GRADE, "-c:v", "libx264", "-crf", "29", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(OUT, `${s.id}.mp4`));
  // The poster is the clip's first frame, graded like the clip, so the swap to video does not jump.
  ff("-i", join(OUT, `${s.id}.mp4`), "-frames:v", "1", "-c:v", "libwebp", "-quality", "72", join(OUT, `${s.id}.webp`));
  ff("-i", join(OUT, `${s.id}.mp4`), "-frames:v", "1", "-vf", "scale=640:-2", "-c:v", "libwebp", "-quality", "60", join(OUT, `${s.id}-640.webp`));
  console.log(`${s.id}: done`);
}

mkdirSync(SRC, { recursive: true });
const want = process.argv.slice(2);
const pick = (list) => list.filter((s) => !want.length || want.includes(s.id));
await Promise.all([...pick(PIECES).map(piece), ...pick(SHOTS).map(shot)]);
const spent = log.reduce((a, r) => a + (r.usd || 0), 0);
console.log(`fal spent so far: $${spent.toFixed(2)}`);
