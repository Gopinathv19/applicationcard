// Build one or more product handbooks into dist/<product>/index.html.
//   node scripts/build.mjs            # every folder in products/
//   node scripts/build.mjs pingie     # one product

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { renderHandbook } from "../system/render.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const requested = process.argv.slice(2);
const products = requested.length ? requested : readdirSync(join(root, "products"));

for (const name of products) {
  const src = join(root, "products", name);
  const entry = join(src, "handbook.mjs");
  if (!existsSync(entry)) throw new Error(`products/${name}/handbook.mjs not found`);

  const hb = (await import(pathToFileURL(entry).href)).default;
  const out = join(root, "dist", name);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  writeFileSync(join(out, "index.html"), renderHandbook(hb));
  cpSync(join(root, "system", "handbook.css"), join(out, "handbook.css"));
  cpSync(join(src, hb.theme), join(out, hb.theme));
  if (existsSync(join(src, "assets"))) cpSync(join(src, "assets"), join(out, "assets"), { recursive: true });

  console.log(`built dist/${name}/index.html (${hb.pages.length} pages)`);
}
