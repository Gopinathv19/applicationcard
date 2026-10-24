// Turns a product handbook module into one HTML document of fixed pages.

import * as diagrams from "./diagrams.mjs";
import { createKit, DEFAULT_STATUSES, esc } from "./components.mjs";

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function renderHandbook(hb) {
  const { product } = hb;
  // Bodies get the components plus the SVG kit as `c.d`, for product diagrams.
  const kit = { ...createKit({ icons: hb.icons, iconStyle: hb.iconStyle, statuses: { ...DEFAULT_STATUSES, ...hb.statuses }, product }), d: diagrams };
  const sections = hb.sections.map((s, i) => ({ ...s, n: String(i + 1).padStart(2, "0"), anchor: `sec-${s.id}`, pages: [] }));
  const byId = Object.fromEntries(sections.map((s) => [s.id, s]));

  // Number pages and index them by section before rendering, so the
  // contents page can show page numbers.
  const pages = hb.pages.map((p, i) => ({ ...p, page: i + 1, anchor: `p-${i + 1}-${slug(p.title || p.kind || "page")}` }));
  for (const p of pages) {
    if (!p.section) continue;
    const s = byId[p.section];
    if (!s) throw new Error(`Page "${p.title}" names unknown section "${p.section}"`);
    if (!s.page) { s.page = p.page; p.firstOfSection = true; }
    s.pages.push(p);
  }
  const total = pages.length;

  const head = (p) => {
    const s = p.section ? byId[p.section] : null;
    return `<header class="pg-head"><span class="mark">${esc(product.mark)}</span><span>${esc(product.name)}</span>
      ${s ? `<span>/</span><span class="sec">${s.n} · ${esc(s.title)}</span>` : ""}<span class="spacer"></span><span>${esc(product.handbookTitle)}</span></header>`;
  };
  const foot = (p) => `<footer class="pg-foot"><span>${esc(product.footer || product.handbookTitle)}</span><span class="spacer"></span><span class="num">${String(p.page).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span></footer>`;

  const titleBlock = (p) => {
    const s = p.section ? byId[p.section] : null;
    const kicker = p.kicker ?? (s ? `${s.n} · ${esc(s.title)}` : "");
    const t = `<div class="pg-title">${kicker ? `<div class="kicker">${kicker}</div>` : ""}<h1>${p.title}</h1>${p.lede ? `<p class="lede">${p.lede}</p>` : ""}</div>`;
    if (p.firstOfSection && s && p.opener !== false) {
      return `<div class="opener"><span class="big-n">${s.n}</span>${t.replace('class="pg-title"', 'class="pg-title" style="margin-bottom:0"')}</div>`;
    }
    return t;
  };

  const renderPage = (p) => {
    const layout = p.layout || "atlas";
    if (p.kind === "cover") {
      return `<section class="page layout-atlas cover" id="${p.anchor}">${kit.cover(p.cover(kit, diagrams))}</section>`;
    }
    const body = p.kind === "contents" ? kit.contents(sections) : p.body(kit, diagrams, { sections: byId, pages });
    const anchors = p.firstOfSection ? `<a id="${byId[p.section].anchor}"></a>` : "";
    return `<section class="page layout-${layout}" id="${p.anchor}" data-page="${p.page}">${anchors}
      ${head(p)}${titleBlock(p)}
      <div class="pg-body ${p.bodyClass || ""}">${body}</div>
      ${foot(p)}</section>`;
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(product.name)} · ${esc(product.handbookTitle)}</title>
<link rel="stylesheet" href="${hb.theme}"/>
<link rel="stylesheet" href="handbook.css"/>
</head>
<body>
${pages.map(renderPage).join("\n")}
</body>
</html>`;
}
