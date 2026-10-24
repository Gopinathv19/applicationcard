// Reusable handbook components. Each returns an HTML string. Content strings
// are authored by the product module and may contain inline markup
// (<b>, <code>); values that come from data are escaped with esc().

import { esc } from "./diagrams.mjs";

export { esc };

// Default status vocabulary. A product can relabel these in its handbook module.
export const DEFAULT_STATUSES = {
  implemented: { label: "Implemented", cls: "ok", note: "Verified in the source code." },
  partial: { label: "Partial", cls: "warn", note: "Works, with narrower scope than described." },
  planned: { label: "Planned", cls: "accent", note: "Designed but not built." },
  unknown: { label: "Unverified", cls: "ghost", note: "No evidence either way." },
};

// iconStyle matches the product's own icon set: { width, linecap, linejoin }.
export function createKit({ icons = {}, iconStyle = {}, statuses = DEFAULT_STATUSES, product }) {
  const { width = 1.9, linecap = "square", linejoin = "miter" } = iconStyle;
  const icon = (name, size = 16, sw = width) => {
    const d = icons[name];
    if (!d) throw new Error(`Unknown icon "${name}"`);
    return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="${linecap}" stroke-linejoin="${linejoin}" aria-hidden="true"><path d="${d}"/></svg>`;
  };

  const status = (key) => {
    if (!key) return "";
    const s = statuses[key];
    if (!s) throw new Error(`Unknown status "${key}"`);
    return `<span class="badge ${s.cls}"><span class="dot"></span>${esc(s.label)}</span>`;
  };

  const statusLegend = (keys = Object.keys(statuses)) =>
    `<div class="status-legend">${keys.map((k) => `<span>${status(k)} ${esc(statuses[k].note)}</span>`).join("")}</div>`;

  const iconTile = (name, { size = "", plain = false } = {}) =>
    `<span class="icon-tile ${size} ${plain ? "plain" : ""}">${icon(name, size === "lg" ? 20 : 16)}</span>`;

  /* ---------- Structure ---------- */

  const cover = ({ eyebrow, title, subtitle, meta = [], visual = "", tag = "" }) => `
    <div class="cover-top"><span class="mark lg">${esc(product.mark)}</span>${esc(product.name)}${tag ? `<span class="tag badge accent">${tag}</span>` : ""}</div>
    <div class="cover-main">
      <div>
        ${eyebrow ? `<div class="kicker">${eyebrow}</div>` : ""}
        <h1>${title}</h1>
        ${subtitle ? `<p class="sub">${subtitle}</p>` : ""}
      </div>
      <div>${visual}</div>
    </div>
    <div class="cover-meta">${meta.map(([k, v]) => `<div>${esc(k)}<b>${v}</b></div>`).join("")}</div>`;

  const contents = (sections) => `
    <div class="toc">${sections.map((s) => `
      <div class="toc-sec">
        <div class="toc-h"><span class="toc-n">${esc(s.n)}</span><a href="#${s.anchor}">${esc(s.title)}</a><span class="toc-p">${s.page}</span></div>
        <ul>${s.pages.map((p) => `<li><a href="#${p.anchor}">${esc(p.title)}</a><span>${p.page}</span></li>`).join("")}</ul>
      </div>`).join("")}
    </div>`;

  /* ---------- Content blocks ---------- */

  const panel = ({ title, hint = "", body, className = "" }) =>
    `<div class="panel ${className}">${title ? `<div class="ph">${title}${hint ? `<span class="hint">${hint}</span>` : ""}</div>` : ""}<div class="pb">${body}</div></div>`;

  const featureCard = ({ icon: ic, title, summary, status: st, variant = "" }) => `
    <div class="card ${variant}">
      <div class="card-top">${ic ? iconTile(ic) : ""}${status(st)}</div>
      <h3>${title}</h3>
      <p>${summary}</p>
    </div>`;

  const cardGrid = (items, cols = 3) => `<div class="grid g${cols}">${items.map(featureCard).join("")}</div>`;

  // Purpose / behaviour / value / limits, the four questions every feature answers.
  const explain = ({ purpose, behavior, value, limits }, { wide = false } = {}) => `
    <div class="explain ${wide ? "cols4" : ""}">
      <div><span class="label">Purpose</span><p>${purpose}</p></div>
      <div><span class="label">How it behaves</span><p>${behavior}</p></div>
      <div><span class="label">Why it matters</span><p>${value}</p></div>
      ${limits ? `<div class="limit"><span class="label">Limits</span><p>${limits}</p></div>` : ""}
    </div>`;

  const bullets = (items) =>
    `<ul class="bullets">${items.map((i) => (typeof i === "string" ? `<li><span>${i}</span></li>` : `<li><span>${i.text}</span>${status(i.status)}</li>`)).join("")}</ul>`;

  // pins: [{ x, y }] in percent of the image; legend: [{ title, text, status }]
  const screenshot = ({ src, alt, caption = "", pins = [], maxHeight }) => `
    <figure class="shot" style="margin:0">
      <div class="shot-bar"><i></i><i></i><i></i><span>${esc(caption)}</span></div>
      <div class="shot-img"${maxHeight ? ` style="max-height:${maxHeight};overflow:hidden"` : ""}>
        <img src="${src}" alt="${esc(alt)}"/>
        ${pins.map((p, i) => `<span class="pin" style="left:${p.x}%;top:${p.y}%">${i + 1}</span>`).join("")}
      </div>
    </figure>`;

  // A product view drawn from tokens when no screenshot exists. Always labelled.
  const mock = ({ caption, body, label = "Illustrative" }) => `
    <figure class="mock" style="margin:0">
      <div class="mock-bar"><i></i><i></i><i></i><span>${esc(caption)}</span><span class="badge ghost">${esc(label)}</span></div>
      <div class="mock-body">${body}</div>
    </figure>`;

  const callouts = (items) => `
    <ol class="callouts">${items.map((c, i) => `
      <li><span class="pin">${i + 1}</span><div><b>${c.title}</b><span class="t">${c.text}</span>${c.status ? `<div>${status(c.status)}</div>` : ""}</div></li>`).join("")}
    </ol>`;

  const steps = (items, { vertical = false } = {}) => `
    <div class="steps ${vertical ? "v" : "h"}">${items.map((s, i) => `
      <div class="step"><span class="sn">${String(i + 1).padStart(2, "0")}</span><div><h3>${s.title}</h3><p>${s.text}</p></div></div>`).join("")}
    </div>`;

  let figN = 0;
  // `height` fixes the canvas height (CSS length); the SVG letterboxes inside it.
  const figure = ({ title, hint = "", svg, className = "", style = "", height }) => {
    figN += 1;
    const canvas = height ? `<div class="canvas fixed" style="height:${height}">` : `<div class="canvas">`;
    return `<div class="figure ${className}" style="${style}"><div class="fig-h"><span class="fig-n">FIG ${String(figN).padStart(2, "0")}</span><h2>${title}</h2>${hint ? `<span class="hint">${hint}</span>` : ""}</div>${canvas}${svg}</div></div>`;
  };

  // Illustrative chat window built from tokens, for heroes and covers.
  // messages: [{ from: "visitor" | "bot" | "agent" | "system", text, sources?: [], meta? }]
  const chatMock = ({ title, status = "", messages, footer = "" }) => `
    <div class="chat-mock">
      <div class="cm-head"><span class="mark">${esc(product.mark)}</span><div><b>${esc(title)}</b>${status ? `<span>${status}</span>` : ""}</div></div>
      <div class="cm-body">${messages.map((m) => m.from === "system"
        ? `<div class="cm-sys">${m.text}</div>`
        : `<div class="cm-msg ${m.from}">${m.meta ? `<span class="cm-meta">${m.meta}</span>` : ""}<div class="cm-bubble">${m.text}</div>${m.sources ? `<div class="cm-src">${m.sources.map((s) => `<span>${icon("file", 11)}${esc(s)}</span>`).join("")}</div>` : ""}${m.actions ? `<div class="cm-act">${m.actions}</div>` : ""}</div>`).join("")}
      </div>
      ${footer ? `<div class="cm-foot">${footer}</div>` : ""}
    </div>`;

  // columns: [{ label, hl? }], rows: [{ head, cells: [...] }]; cells may be true/false.
  const matrix = ({ columns, rows, firstLabel = "" }) => {
    const cell = (v, hl) => {
      const c = hl ? "hl" : "";
      // Drawn, not typed: not every brand font has a check-mark glyph.
      if (v === true) return `<td class="c ${c}"><span class="yes"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" style="display:inline-block;vertical-align:-2px" aria-label="yes"><path d="M5 12l5 5 9-10"/></svg></span></td>`;
      if (v === false) return `<td class="c ${c}"><span class="no">—</span></td>`;
      return `<td class="${c}">${v}</td>`;
    };
    return `<table class="matrix"><thead><tr><th>${firstLabel}</th>${columns.map((c) => `<th class="${c.hl ? "hl" : ""}">${c.label}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((r) => `<tr><th>${r.head}</th>${r.cells.map((v, i) => cell(v, columns[i].hl)).join("")}</tr>`).join("")}</tbody></table>`;
  };

  const takeaway = (text, label = "Key takeaway") => `<div class="takeaway"><div><span class="label">${label}</span><p>${text}</p></div></div>`;

  const limitBox = (items, label = "Limits") =>
    `<div class="limit-box"><span class="label">${label}</span>${Array.isArray(items) ? `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>` : `<p>${items}</p>`}</div>`;

  const stats = (items, cols = items.length) =>
    `<div class="stats" style="grid-template-columns:repeat(${cols},1fr)">${items.map((s) => `<div class="stat"><span class="k">${s.k}</span><span class="v">${s.v}</span>${s.s ? `<span class="s">${s.s}</span>` : ""}</div>`).join("")}</div>`;

  const responsibility = ({ icon: ic, name, who, text, stack }) => `
    <div class="card"><div class="resp">${iconTile(ic, { plain: true })}<h3>${name}</h3>${who ? `<span class="who">${who}</span>` : "<span></span>"}<p>${text}</p></div>${stack ? `<span class="resp stack">${stack}</span>` : ""}</div>`;

  const flashcards = (cards, cols = 4) =>
    `<div class="grid g${cols}" style="grid-auto-rows:1fr">${cards.map((c, i) => `
      <div class="flash"><div class="q"><span class="label">Q${String(i + 1).padStart(2, "0")}</span><p>${c.q}</p></div><div class="a"><span class="label">A</span>${c.a}</div></div>`).join("")}</div>`;

  const glossary = (terms) =>
    `<div class="glossary"><dl>${terms.map((t) => `<div class="gl"><dt>${t.term}${t.code ? ` <code>${t.code}</code>` : ""}</dt><dd>${t.def}</dd></div>`).join("")}</dl></div>`;

  // columns: [{ status, title, items: [{ text, note }] }]
  const scope = (columns) => `<div class="scope">${columns.map((c) => `
    <div class="panel"><div class="pb"><div class="col-h">${status(c.status)}<b>${c.title}</b></div>
      <ul>${c.items.map((i) => `<li>${i.text}${i.note ? `<span>${i.note}</span>` : ""}</li>`).join("")}</ul></div></div>`).join("")}</div>`;

  return {
    icon, iconTile, status, statusLegend, cover, contents, panel, featureCard, cardGrid, explain, bullets,
    screenshot, mock, callouts, steps, figure, chatMock, matrix, takeaway, limitBox, stats, responsibility, flashcards, glossary, scope,
  };
}
