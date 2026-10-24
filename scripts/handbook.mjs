// Build and export in one step, passing the same arguments to both.
//   node scripts/handbook.mjs [product...] [--no-preview] [--allow-overflow]

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const products = args.filter((a) => !a.startsWith("--"));

const run = (script, argv) => execFileSync(process.execPath, [join(here, script), ...argv], { stdio: "inherit" });
try {
  run("build.mjs", products);
  run("export-pdf.mjs", args);
} catch {
  process.exit(1);
}
