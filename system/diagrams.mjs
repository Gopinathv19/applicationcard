// SVG diagram primitives. They emit class names only (no colours), so the
// product theme decides how every box, edge and label looks.

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const lines = (v) => (v == null ? [] : Array.isArray(v) ? v : String(v).split("\n"));

export function svg(w, h, inner, { title = "", className = "" } = {}) {
  return `<svg viewBox="0 0 ${w} ${h}" class="${className}" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

// A labelled box. `sub` may be a string with \n or an array of lines.
export function box({ x, y, w, h, title, sub, mono, variant = "", align = "center", num }) {
  const subLines = lines(sub);
  const monoLines = lines(mono);
  const total = (title ? 1 : 0) + subLines.length + monoLines.length;
  const lh = 14;
  let ty = y + h / 2 - ((total - 1) * lh) / 2 + 4;
  const tx = align === "left" ? x + 12 : x + w / 2;
  const anchor = align === "left" ? "start" : "middle";
  let out = `<rect class="d-box ${variant}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  if (title) { out += `<text class="d-t" x="${tx}" y="${ty}" text-anchor="${anchor}">${esc(title)}</text>`; ty += lh; }
  for (const l of subLines) { out += `<text class="d-s" x="${tx}" y="${ty}" text-anchor="${anchor}">${esc(l)}</text>`; ty += lh; }
  for (const l of monoLines) { out += `<text class="d-m" x="${tx}" y="${ty}" text-anchor="${anchor}">${esc(l)}</text>`; ty += lh; }
  if (num != null) out += badgeNum(x, y, num);
  return out;
}

export function badgeNum(x, y, n) {
  return `<rect class="d-num" x="${x - 9}" y="${y - 9}" width="18" height="18"/><text class="d-num-t" x="${x}" y="${y + 3.5}" text-anchor="middle">${esc(n)}</text>`;
}

export function diamond({ x, y, w, h, title, sub }) {
  const cx = x + w / 2, cy = y + h / 2;
  let out = `<polygon class="d-diamond" points="${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}"/>`;
  const all = [title, ...lines(sub)].filter(Boolean);
  let ty = cy - ((all.length - 1) * 13) / 2 + 4;
  all.forEach((l, i) => { out += `<text class="${i === 0 ? "d-t" : "d-s"}" x="${cx}" y="${ty}" text-anchor="middle">${esc(l)}</text>`; ty += 13; });
  return out;
}

export function zone({ x, y, w, h, label, variant = "" }) {
  return `<rect class="d-zone ${variant}" x="${x}" y="${y}" width="${w}" height="${h}"/>` +
    (label ? `<text class="d-zone-label" x="${x + 10}" y="${y + 16}">${esc(label)}</text>` : "");
}

function arrowHead([x1, y1], [x2, y2], variant) {
  const a = Math.atan2(y2 - y1, x2 - x1), s = 7;
  const p = (da) => `${x2 - s * Math.cos(a - da)},${y2 - s * Math.sin(a - da)}`;
  return `<polygon class="d-arrow ${variant}" points="${x2},${y2} ${p(0.45)} ${p(-0.45)}"/>`;
}

// A polyline edge with an arrowhead at the end (and optionally the start).
export function edge({ points, label, at, variant = "", both = false, anchor = "middle" }) {
  const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  let out = `<path class="d-edge ${variant}" d="${d}"/>`;
  const n = points.length;
  out += arrowHead(points[n - 2], points[n - 1], variant.replace("dash", "").trim());
  if (both) out += arrowHead(points[1], points[0], variant.replace("dash", "").trim());
  if (label) {
    const [lx, ly] = at || [(points[0][0] + points[n - 1][0]) / 2, (points[0][1] + points[n - 1][1]) / 2 - 5];
    out += lines(label).map((l, i) =>
      `<text class="d-edge-label" x="${lx}" y="${ly + i * 12}" text-anchor="${anchor}" paint-order="stroke" stroke="var(--surface)" stroke-width="4">${esc(l)}</text>`).join("");
  }
  return out;
}

export function text(x, y, s, cls = "d-s", anchor = "start") {
  return lines(s).map((l, i) => `<text class="${cls}" x="${x}" y="${y + i * 13}" text-anchor="${anchor}">${esc(l)}</text>`).join("");
}

/**
 * Auto-laid-out sequence diagram.
 * actors: [{ id, label, sub?, accent? }]
 * steps:  [{ from, to, label, reply? }]  (from === to draws a self-step)
 *         [{ group: "label", steps: [...] }]  draws a bracket around steps
 *         [{ note: "text", over: actorId }]
 */
export function sequence({ actors, steps, width = 1000, colW, rowH = 30, title = "" }) {
  const top = 52, left = 70;
  const gap = colW || (width - left * 2) / Math.max(1, actors.length - 1);
  const xOf = Object.fromEntries(actors.map((a, i) => [a.id, left + i * gap]));
  let y = top + 26;
  let body = "";
  const flat = [];
  const walk = (list, depth) => {
    for (const s of list) {
      if (s.group) {
        const y0 = y; y += 30;
        walk(s.steps, depth + 1);
        flat.push({ groupBox: true, y0, y1: y - 4, label: s.group, ids: s.span || null, depth });
        y += 18;
      } else { flat.push({ ...s, y }); y += s.from === s.to ? rowH + 16 : rowH; }
    }
  };
  walk(steps, 0);
  const h = y + 10;
  // Groups first so they sit behind messages.
  for (const g of flat.filter((f) => f.groupBox)) {
    const x0 = (g.ids ? xOf[g.ids[0]] : left) - 52 + g.depth * 6, x1 = (g.ids ? xOf[g.ids[1]] : left + gap * (actors.length - 1)) + 52 - g.depth * 6;
    body += `<rect class="d-group" x="${x0}" y="${g.y0}" width="${x1 - x0}" height="${g.y1 - g.y0}"/>`;
    body += `<text class="d-group-label" x="${x0 + 8}" y="${g.y0 + 12}">${esc(g.label)}</text>`;
  }
  let head = "";
  for (const a of actors) {
    const x = xOf[a.id];
    head += `<line class="d-life" x1="${x}" y1="${top}" x2="${x}" y2="${h}"/>`;
    head += `<rect class="d-actor ${a.accent ? "accent" : ""}" x="${x - 58}" y="4" width="116" height="${a.sub ? 40 : 30}"/>`;
    head += `<text class="d-t" x="${x}" y="${a.sub ? 21 : 23}" text-anchor="middle">${esc(a.label)}</text>`;
    if (a.sub) head += `<text class="d-m" x="${x}" y="35" text-anchor="middle">${esc(a.sub)}</text>`;
  }
  for (const s of flat.filter((f) => !f.groupBox)) {
    if (s.note) {
      const x = xOf[s.over];
      body += `<rect class="d-box soft" x="${x - 90}" y="${s.y - 14}" width="180" height="22"/>` + text(x, s.y + 1, s.note, "d-s", "middle");
      continue;
    }
    const x1 = xOf[s.from], x2 = xOf[s.to];
    const v = `${s.reply ? "dash" : ""} ${s.accent ? "accent" : ""}`.trim();
    if (x1 === x2) {
      body += edge({ points: [[x1, s.y], [x1 + 34, s.y], [x1 + 34, s.y + 14], [x1 + 4, s.y + 14]], variant: v });
      body += text(x1 + 42, s.y + 11, s.label, "d-edge-label");
    } else {
      const dir = Math.sign(x2 - x1);
      body += edge({ points: [[x1 + dir * 3, s.y], [x2 - dir * 3, s.y]], variant: v });
      body += `<text class="d-edge-label" x="${(x1 + x2) / 2}" y="${s.y - 6}" text-anchor="middle">${esc(s.label)}</text>`;
    }
  }
  return svg(width, h, head + body, { title });
}
