// Export built handbooks to PDF with headless Chromium, check every page for
// overflowing content, and save PNG previews for visual review.
//   node scripts/export-pdf.mjs [product...] [--no-preview] [--allow-overflow]

import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const named = args.filter((a) => !a.startsWith("--"));
const products = named.length ? named : readdirSync(join(root, "dist"));

// A4 landscape at 96 dpi.
const PAGE = { width: 1123, height: 794 };

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
let failed = false;

for (const name of products) {
  const dir = join(root, "dist", name);
  const html = join(dir, "index.html");
  if (!existsSync(html)) throw new Error(`dist/${name}/index.html missing; run npm run build first`);

  const page = await browser.newPage({ viewport: PAGE, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(html).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: "print" });

  // Any element that extends past its page's body area is clipped in print.
  const problems = await page.evaluate(() => {
    const out = [];
    for (const sheet of document.querySelectorAll(".page")) {
      const body = sheet.querySelector(".pg-body") || sheet;
      const b = body.getBoundingClientRect();
      for (const el of body.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || el.closest(".shot-img")) continue;
        const over = Math.max(r.bottom - b.bottom, r.right - b.right);
        if (over > 1.5) {
          const label = (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : el.tagName.toLowerCase());
          out.push({ page: sheet.dataset.page || "cover", label, over: Math.round(over), text: (el.textContent || "").trim().slice(0, 50) });
          break;
        }
      }
    }
    return out;
  });
  for (const p of problems) console.warn(`  overflow p${p.page}: ${p.label} by ${p.over}px  "${p.text}"`);
  if (problems.length && !flags.has("--allow-overflow")) failed = true;

  const pdf = join(dir, `${name}-handbook.pdf`);
  await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
  console.log(`exported dist/${name}/${name}-handbook.pdf`);

  if (!flags.has("--no-preview")) {
    const prev = join(dir, "preview");
    rmSync(prev, { recursive: true, force: true });
    mkdirSync(prev);
    const sheets = await page.$$(".page");
    for (const [i, el] of sheets.entries()) await el.screenshot({ path: join(prev, `page-${String(i + 1).padStart(2, "0")}.png`) });
    console.log(`previews in dist/${name}/preview/ (${sheets.length})`);
  }
  await page.close();
}

await browser.close();
if (failed) { console.error("Overflowing pages found (pass --allow-overflow to export anyway)."); process.exit(1); }
