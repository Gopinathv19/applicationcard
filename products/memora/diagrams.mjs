// Memora diagrams, drawn with the system's SVG primitives. Labels were checked
// against Memora/backend (config.py defaults, services, routes) at f4c6b8c.

// The ownership chain (db/models, README "The ownership chain").
export function ownership({ svg, box, edge }) {
  const rows = [
    ["Tenant", "the organisation that owns the data", "Acme Law Firm"],
    ["Application", "the consuming system", "LegalCase"],
    ["Subject", "the workspace and data boundary", "case-ABC-456"],
    ["Source", "registered file, URL or chat", "complaint.pdf"],
    ["Extraction", "a versioned reading (v1, v2, …)", "v2 · completed"],
  ];
  const X = (i) => i * 64, Y = (i) => 4 + i * 64;
  let o = "";
  rows.forEach(([t, s, ex], i) => {
    o += box({ x: X(i), y: Y(i), w: 300, h: 54, title: t, sub: s, mono: ex, variant: i < 4 ? "accent" : "", align: "left" });
    if (i) o += edge({ points: [[X(i) - 40, Y(i) - 10], [X(i) - 40, Y(i) + 27], [X(i) - 2, Y(i) + 27]], variant: "accent" });
  });
  const side = (i, x, t, s, label) => {
    o += box({ x, y: Y(i) + 5, w: 220, h: 44, title: t, sub: s, variant: "soft" });
    o += edge({ points: [[X(i) + 300, Y(i) + 27], [x - 2, Y(i) + 27]], variant: "dash", label, at: [(X(i) + 300 + x) / 2, Y(i) + 21] });
  };
  side(1, 520, "Actor", "who caused it · audit only", "records");
  o += box({ x: 790, y: Y(1) + 5, w: 230, h: 44, title: "API credential", sub: "memora_… · only an HMAC stored", variant: "soft" });
  o += edge({ points: [[364, Y(1) + 8], [364, Y(1) - 8], [905, Y(1) - 8], [905, Y(1) + 3]], variant: "dash", label: "holds", at: [640, Y(1) - 13] });
  side(2, 560, "Subject (folder)", "parent_subject_id · nests", "contains");
  side(4, 640, "Chunks · embeddings · graph", "derived from the active version", "feeds");
  return svg(1040, 330, o, { title: "The ownership chain" });
}

// End-to-end pipeline (README; PROJECT_CONTEXT §4).
export function pipeline({ svg, box, edge }) {
  const S = [
    ["Register", "upload ≤ 50 MiB, URL, chat"],
    ["Extract", "triage + NVIDIA models"],
    ["Chunk", "local, no LLM, no cost"],
    ["Embed", "strategy → pgvector HNSW"],
    ["Retrieve", "hybrid · MMR · rerank"],
    ["Answer", "grounded, cited, streamed"],
  ];
  let o = "";
  S.forEach(([t, s], i) => {
    const x = i * 174;
    o += box({ x, y: 10, w: 150, h: 52, title: t, sub: s, variant: "accent", num: i + 1 });
    if (i) o += edge({ points: [[x - 24, 36], [x - 2, 36]], variant: "accent" });
  });
  o += box({ x: 348, y: 104, w: 324, h: 48, title: "Knowledge graph · Graph RAG", sub: "FalkorDB, one graph per tenant; compared against vector RAG" });
  o += edge({ points: [[249, 62], [249, 128], [346, 128]], variant: "dash", label: "build_graph", at: [300, 122] });
  o += edge({ points: [[672, 128], [783, 128], [783, 64]], variant: "dash", label: "graph evidence", at: [728, 122] });
  return svg(1040, 160, o, { title: "Memora processing pipeline" });
}

// Per-page triage (docs/extraction-agent.md §3; enums.Difficulty / Route).
export function triage({ svg, box, edge }) {
  let o = "";
  o += box({ x: 300, y: 0, w: 260, h: 52, title: "Page measurements", sub: ["text amount · image coverage", "table signal · text quality"], variant: "soft" });
  const cols = [
    ["easy", ["plenty of clean text", "no table, images < 15%"], "local text", "free", "ok"],
    ["medium", ["good text + 1–2", "small images"], "local text + vision", "pictures described", "warn"],
    ["hard", ["scan or garbled text,", "a table, or images > 15%"], "whole page → layout", "nemotron-parse", "danger"],
  ];
  cols.forEach(([t, s, r, rs, v], i) => {
    const x = 40 + i * 290;
    o += edge({ points: [[430, 52], [430, 72], [x + 110, 72], [x + 110, 90]] });
    o += box({ x, y: 92, w: 220, h: 56, title: t, sub: s, variant: v });
    o += edge({ points: [[x + 110, 148], [x + 110, 176]] });
    o += box({ x, y: 178, w: 220, h: 44, title: r, sub: rs });
  });
  o += box({ x: 180, y: 260, w: 500, h: 48, title: "Merge in reading order → distil with the extract model", sub: "windowed map-reduce, 18,000 characters per window; every unit keeps a provenance marker", variant: "accent" });
  cols.forEach((_, i) => { o += edge({ points: [[150 + i * 290, 222], [150 + i * 290, 240], [430, 240], [430, 258]] }); });
  return svg(860, 312, o, { title: "Per-page triage" });
}

// Chunking vocabulary (docs/chunking.md; app/chunking).
export function chunking({ svg, box, edge }) {
  const S = [
    ["readings", "per-page Markdown from extraction", "soft"],
    ["document units", "heading · text · list · table · figure", ""],
    ["semantic blocks", "units grouped per leaf section", ""],
    ["retrieval chunks", "300–500 tokens, 1,200 hard max", "accent"],
  ];
  let o = "";
  S.forEach(([t, s, v], i) => {
    const x = i * 262;
    o += box({ x, y: 10, w: 226, h: 52, title: t, sub: s, variant: v });
    if (i) o += edge({ points: [[x - 34, 36], [x - 2, 36]], variant: "accent" });
  });
  o += box({ x: 786, y: 92, w: 226, h: 44, title: "embedding_text", sub: "“Section: A > B” + content", variant: "soft" });
  o += edge({ points: [[899, 62], [899, 90]] });
  return svg(1016, 140, o, { title: "Chunking stages" });
}

// The query pipeline with its default sizes (config.py retrieval_*).
export function retrieval({ svg, box, edge }) {
  let o = "";
  o += box({ x: 0, y: 70, w: 120, h: 52, title: "Question", sub: "scoped to the caller", variant: "soft" });
  o += box({ x: 160, y: 20, w: 150, h: 52, title: "Dense", sub: "HNSW top 40", variant: "accent" });
  o += box({ x: 160, y: 120, w: 150, h: 52, title: "Lexical", sub: "tsvector top 40", variant: "accent" });
  o += box({ x: 350, y: 70, w: 120, h: 52, title: "RRF fusion", sub: "k = 60 · keep 40" });
  o += box({ x: 505, y: 70, w: 120, h: 52, title: "MMR", sub: "λ 0.7 · keep 30" });
  o += box({ x: 660, y: 70, w: 120, h: 52, title: "Reranker", sub: "cross-encoder" });
  o += box({ x: 815, y: 70, w: 100, h: 52, title: "Top 6", sub: "final context", variant: "ok" });
  o += box({ x: 940, y: 54, w: 96, h: 84, title: "Answer", sub: ["grounded LLM,", "or says the", "knowledge is", "insufficient"], variant: "ok" });
  o += edge({ points: [[120, 88], [140, 88], [140, 46], [158, 46]] });
  o += edge({ points: [[120, 104], [140, 104], [140, 146], [158, 146]] });
  o += edge({ points: [[310, 46], [330, 46], [330, 88], [348, 88]] });
  o += edge({ points: [[310, 146], [330, 146], [330, 104], [348, 104]] });
  o += edge({ points: [[470, 96], [503, 96]] });
  o += edge({ points: [[625, 96], [658, 96]] });
  o += edge({ points: [[780, 96], [813, 96]] });
  o += edge({ points: [[915, 96], [938, 96]] });
  o += `<text class="d-edge-label" x="235" y="196" text-anchor="middle">retrieval_mode: "dense" skips lexical + RRF (HNSW top 50)</text>`;
  return svg(1040, 204, o, { title: "Query pipeline" });
}

// Knowledge-graph build (docs/graph-rag.md; app/graph).
export function graphBuild({ svg, box, edge }) {
  const S = [
    ["Extraction content", "merged Markdown", "soft"],
    ["Page-aware units", "3,000 chars, 300 overlap", ""],
    ["One NVIDIA call", "per unit, ontology-typed", "accent"],
    ["Validate · normalise", "per item; canonical keys", ""],
    ["Resolve", "one node per real thing", ""],
    ["FalkorDB", "one graph per tenant", "ok"],
  ];
  let o = "";
  S.forEach(([t, s, v], i) => {
    const x = i * 174;
    o += box({ x, y: 10, w: 150, h: 52, title: t, sub: s, variant: v });
    if (i) o += edge({ points: [[x - 24, 36], [x - 2, 36]] });
  });
  o += `<text class="d-edge-label" x="520" y="88" text-anchor="middle">Graph writes happen after the PostgreSQL commit; a startup sweep repairs anything missed.</text>`;
  return svg(1040, 96, o, { title: "Knowledge graph build" });
}

// Arena pipelines (docs/graph-rag-compare.md).
export function arena({ svg, box, edge }) {
  let o = "";
  o += box({ x: 0, y: 92, w: 130, h: 52, title: "One question", sub: "same subject", variant: "soft" });
  const P = [
    ["vector", "dense + lexical, RRF, MMR", 10],
    ["graph", "one technique over FalkorDB", 92],
    ["hybrid", "vector + graph fused by RRF", 174],
  ];
  P.forEach(([t, s, y]) => {
    o += edge({ points: [[130, 118], [150, 118], [150, y + 26], [178, y + 26]] });
    o += box({ x: 180, y, w: 240, h: 52, title: t, sub: s, variant: "accent" });
    o += edge({ points: [[420, y + 26], [478, y + 26]] });
  });
  o += box({ x: 480, y: 10, w: 230, h: 216, title: "Same reranker, same answer model", sub: ["every pipeline returns", "retrieval chunks, so", "Recall@k means the", "same for each"] });
  o += edge({ points: [[710, 118], [768, 118]] });
  o += box({ x: 770, y: 40, w: 266, h: 156, title: "Side by side", sub: ["answer and citations", "latency and cost", "evidence overlap", "weak-evidence flag (rerank < −5.0)"], variant: "ok" });
  return svg(1040, 232, o, { title: "Arena pipelines" });
}

// Unified Graph RAG (docs/graph-rag-unified.md; app/graphrag/unified.py).
export function unified({ svg, box, edge }) {
  let o = "";
  o += box({ x: 0, y: 22, w: 180, h: 52, title: "Retrieval chunks", sub: "the ones vector search uses", variant: "soft" });
  o += box({ x: 220, y: 22, w: 180, h: 52, title: "~1,000-token windows", sub: "never cross documents" });
  o += box({ x: 440, y: 22, w: 180, h: 52, title: "Extract with quotes", sub: "facts need verbatim evidence", variant: "accent" });
  o += box({ x: 660, y: 22, w: 180, h: 52, title: "Resolve with guards", sub: "two reviewers, recorded merges" });
  o += box({ x: 880, y: 22, w: 156, h: 52, title: "Communities", sub: "Louvain, summarised" });
  [220, 440, 660, 880].forEach((x) => { o += edge({ points: [[x - 40, 48], [x - 2, 48]] }); });
  o += box({ x: 0, y: 134, w: 180, h: 52, title: "Question analyser", sub: "lookup · relational · corpus", variant: "soft" });
  const ch = [["vector list", 112], ["atomic-fact chunks", 162], ["PageRank walk", 212]];
  ch.forEach(([t, y]) => {
    o += edge({ points: [[180, 160], [200, 160], [200, y], [218, y]] });
    o += box({ x: 220, y: y - 20, w: 180, h: 40, title: t });
    o += edge({ points: [[400, y], [420, y], [420, 186], [438, 186]] });
  });
  o += box({ x: 440, y: 160, w: 180, h: 52, title: "Weighted RRF", sub: "analyser sets the weights", variant: "accent" });
  o += edge({ points: [[620, 186], [658, 186]] });
  o += box({ x: 660, y: 160, w: 180, h: 52, title: "Reranker", sub: "weak → widen 3×, then abstain" });
  o += edge({ points: [[840, 186], [878, 186]] });
  o += box({ x: 880, y: 144, w: 156, h: 84, title: "Checked answer", sub: ["[C] passages · [F] facts", "[G] overviews", "markers verified"], variant: "ok" });
  o += `<text class="d-zone-label" x="0" y="120">Retrieve</text><text class="d-zone-label" x="0" y="12">Build</text>`;
  return svg(1040, 236, o, { title: "Unified Graph RAG" });
}

// Drive connector modes (app/connectors/google_drive).
export function drive({ svg, box, edge, zone }) {
  let o = "";
  o += box({ x: 0, y: 96, w: 170, h: 60, title: "Google Drive", sub: ["drive.readonly scope", "PDFs only"], variant: "ext" });
  o += zone({ x: 210, y: 0, w: 826, h: 116, label: "Private mode · zero retention" });
  o += zone({ x: 210, y: 134, w: 826, h: 116, label: "Import mode · persistent" });
  const a = [["Download to memory", "≤ 10 files, ≤ 100 pages"], ["Parse · read · chunk", "same code as uploads"], ["Rank in memory", "embed + rerank, then answer"], ["Discarded", "no rows, files or vectors", "ok"]];
  a.forEach(([t, s, v], i) => { const x = 230 + i * 200; o += box({ x, y: 34, w: 180, h: 60, title: t, sub: s, variant: v || "" }); if (i) o += edge({ points: [[x - 20, 64], [x - 2, 64]] }); });
  const b = [["Download server-side", "per user connection"], ["New source", "same pipeline as upload"], ["Extract · chunk · embed", "graph if requested"], ["Ask Memora", "answers it later", "accent"]];
  b.forEach(([t, s, v], i) => { const x = 230 + i * 200; o += box({ x, y: 168, w: 180, h: 60, title: t, sub: s, variant: v || "" }); if (i) o += edge({ points: [[x - 20, 198], [x - 2, 198]] }); });
  o += edge({ points: [[170, 116], [190, 116], [190, 64], [228, 64]] });
  o += edge({ points: [[170, 136], [190, 136], [190, 198], [228, 198]] });
  return svg(1040, 254, o, { title: "Google Drive connector modes" });
}

// System map (app/main.py, deps.get_scope, config providers).
export function architecture({ svg, box, edge, zone }) {
  const svc = [
    ["Registration & storage", "ownership chain · sources"],
    ["Extraction Agent", "triage · layout · vision · extract"],
    ["Chunking", "units → blocks → chunks"],
    ["Embeddings & retrieval", "strategies · hybrid · answer"],
    ["Knowledge graph · Graph RAG", "build · techniques · Arena"],
    ["Drive connector", "private and import modes"],
  ];
  const ext = [
    ["Object storage", "local disk · Cloudflare R2"],
    ["NVIDIA models", "build.nvidia.com · Nebius (prod)"],
    ["PostgreSQL + pgvector", "Neon · every service"],
    ["NVIDIA NIM", "embedding · reranking"],
    ["FalkorDB", "graph per tenant · optional"],
    ["Google", "sign-in · Drive API"],
  ];
  const y = (i) => 18 + i * 68, c = (i) => y(i) + 24;
  let o = zone({ x: 330, y: 0, w: 466, h: 430, label: "backend · FastAPI", variant: "trust" });
  o += box({ x: 0, y: 40, w: 130, h: 56, title: "Client app", sub: "e.g. Pingie", variant: "soft" });
  o += box({ x: 0, y: 170, w: 130, h: 56, title: "Operator", sub: "tenant owner", variant: "soft" });
  o += box({ x: 0, y: 320, w: 130, h: 56, title: "Integrator", sub: "reads the docs", variant: "soft" });
  o += box({ x: 160, y: 164, w: 150, h: 68, title: "Console", sub: ["console/ · Next.js 16", "Google sign-in"] });
  o += box({ x: 160, y: 314, w: 150, h: 68, title: "Public site", sub: ["web/ · static", "API reference"] });
  o += box({ x: 350, y: 40, w: 150, h: 192, title: "get_scope()", sub: ["one dependency for", "every request", "", "Bearer memora_… →", "one tenant + app", "", "session cookie →", "tenants you own"], variant: "accent" });
  o += edge({ points: [[130, 68], [348, 68]], label: "HTTP + SSE · Bearer", at: [240, 62] });
  o += edge({ points: [[130, 198], [158, 198]] });
  o += edge({ points: [[310, 198], [348, 198]] });
  o += edge({ points: [[130, 348], [158, 348]], variant: "dash" });
  o += `<path class="d-edge" d="M500 136 H522 M522 ${c(0)} V${c(5)}"/>`;
  svc.forEach(([t, s], i) => {
    o += box({ x: 546, y: y(i), w: 230, h: 48, title: t, sub: s });
    o += edge({ points: [[522, c(i)], [544, c(i)]] });
    o += box({ x: 836, y: y(i), w: 200, h: 48, title: ext[i][0], sub: ext[i][1], variant: "ext" });
    o += edge({ points: [[776, c(i)], [834, c(i)]] });
  });
  return svg(1040, 434, o, { title: "Memora system map" });
}

// An application asks a question over SSE (routes/retrieval.py).
export function askSequence({ sequence }) {
  return sequence({
    width: 1040,
    rowH: 25,
    title: "An application asks a question",
    actors: [
      { id: "app", label: "Client app", sub: "e.g. Pingie" },
      { id: "api", label: "Retrieval API", sub: "/query/stream", accent: true },
      { id: "scope", label: "get_scope", sub: "deps.py" },
      { id: "ret", label: "Retrieval", sub: "retrieval_service", accent: true },
      { id: "pg", label: "PostgreSQL", sub: "pgvector" },
      { id: "nim", label: "NVIDIA NIM", sub: "embed · rerank" },
      { id: "llm", label: "Answer LLM", sub: "nemotron" },
    ],
    steps: [
      { from: "app", to: "api", label: "POST /query/stream (Bearer)" },
      { from: "api", to: "scope", label: "credential → tenant + application" },
      { from: "api", to: "ret", label: "run, filtered to owned chunks" },
      { from: "ret", to: "nim", label: "embed the question" },
      { from: "ret", to: "pg", label: "dense top 40 + lexical top 40" },
      { from: "ret", to: "ret", label: "RRF → 40, MMR → 30" },
      { from: "ret", to: "nim", label: "rerank 30 → keep 6" },
      { from: "ret", to: "app", label: "event start: chunks + trace", reply: true, accent: true },
      { group: "Answer (a client that only needs evidence can stop here)", span: ["app", "llm"], steps: [
        { from: "ret", to: "llm", label: "grounded prompt + 6 chunks" },
        { from: "llm", to: "app", label: "event delta: answer text", reply: true, accent: true },
        { from: "ret", to: "app", label: "event done: tokens, latency", reply: true },
      ] },
    ],
  });
}

// Tables in creation order (docs/data-flow.md; db/models).
export function dataFlow({ svg, box, edge, zone }) {
  const pg = [
    ["sources", "file · url · chat"],
    ["source_extractions", "result · readings · content"],
    ["document_units", "page, kind, section path"],
    ["semantic_blocks", "per leaf section"],
    ["retrieval_chunks", "embedding_text · is_active"],
    ["chunk_embeddings", "vector · strategy · hash"],
  ];
  let o = zone({ x: 0, y: 0, w: 780, h: 196, label: "PostgreSQL · source of truth" });
  pg.forEach(([t, s], i) => {
    const x = 14 + (i % 3) * 258, yy = 30 + Math.floor(i / 3) * 84;
    o += box({ x, y: yy, w: 236, h: 50, title: t, sub: s, variant: i === 4 ? "accent" : "" });
    if (i % 3) o += edge({ points: [[x - 22, yy + 25], [x - 2, yy + 25]] });
  });
  o += edge({ points: [[634, 80], [634, 96], [132, 96], [132, 112]] });
  o += box({ x: 820, y: 4, w: 216, h: 50, title: "Object storage", sub: "original bytes; source of truth", variant: "ext" });
  o += box({ x: 820, y: 74, w: 216, h: 50, title: "extraction_usage", sub: "one row per model call · cost" });
  o += box({ x: 820, y: 144, w: 216, h: 50, title: "FalkorDB", sub: "derived; rebuilt from PostgreSQL", variant: "ext" });
  o += edge({ points: [[250, 55], [270, 55], [270, 4], [818, 29]], variant: "dash" });
  o += edge({ points: [[508, 55], [520, 55], [520, 99], [818, 99]], variant: "dash" });
  o += edge({ points: [[766, 139], [800, 139], [800, 169], [818, 169]], variant: "dash" });
  return svg(1040, 200, o, { title: "Data in creation order" });
}

// How Pingie maps onto Memora (ping-backend/app/clients/memora.py).
export function pingie({ svg, box, edge }) {
  let o = "";
  const rows = [
    ["Pingie application", "one Memora application + credential", "Application", "found via GET /whoami"],
    ["A Pingie bot", "external_id = the bot's public id", "Subject", "its data boundary"],
    ["Files, pages, team answers", "pages are crawled by Pingie", "Sources", "uploaded or sent as text"],
    ["A visitor's question", "Pingie writes its own answer", "POST /query/stream", "reads the start event only"],
  ];
  rows.forEach(([a, as, b, bs], i) => {
    const y = 6 + i * 62;
    o += box({ x: 0, y, w: 320, h: 48, title: a, sub: as, variant: "soft" });
    o += box({ x: 716, y, w: 320, h: 48, title: b, sub: bs, variant: "accent" });
    o += edge({ points: [[320, y + 24], [714, y + 24]], both: i === 3 });
  });
  o += `<text class="d-zone-label" x="0" y="268">Pingie (consumer)</text><text class="d-zone-label" x="1036" y="268" text-anchor="end">Memora</text>`;
  return svg(1040, 272, o, { title: "Pingie on Memora" });
}

// Trust boundaries (deps.get_scope, scope.py, connectors service, config guard).
export function trust({ svg, box, edge, zone }) {
  let o = "";
  o += zone({ x: 0, y: 0, w: 230, h: 410, label: "Callers" });
  o += box({ x: 20, y: 36, w: 190, h: 60, title: "Client application", sub: ["Bearer memora_…", "256 random bits"] });
  o += box({ x: 20, y: 170, w: 190, h: 60, title: "Console user", sub: ["Google ID token →", "memora_session cookie"] });
  o += box({ x: 20, y: 312, w: 190, h: 60, title: "Drive account", sub: ["OAuth, drive.readonly", "per console user"] });
  o += zone({ x: 262, y: 0, w: 500, h: 410, label: "backend", variant: "trust" });
  o += box({ x: 282, y: 26, w: 230, h: 90, title: "Credential gate", sub: ["HMAC-SHA256 lookup", "status + expiry checked", "→ exactly one application"], variant: "accent" });
  o += box({ x: 282, y: 156, w: 230, h: 90, title: "Session gate", sub: ["HS256 JWT · 7 days", "HttpOnly, SameSite=Lax", "→ every tenant you own"], variant: "accent" });
  o += box({ x: 282, y: 296, w: 230, h: 90, title: "Connection gate", sub: ["filtered on user_id", "another user's → 404"], variant: "accent" });
  o += box({ x: 542, y: 86, w: 200, h: 118, title: "Scope check", sub: ["in every service call", "owners must match", "cross-tenant → 404", "chain must agree", "ownership derived"] });
  o += box({ x: 542, y: 296, w: 200, h: 90, title: "Model guard", sub: ["every model id must", "start with nvidia/", "checked at startup"] });
  o += box({ x: 820, y: 26, w: 216, h: 54, title: "PostgreSQL", sub: "denormalised scope columns", variant: "ext" });
  o += box({ x: 820, y: 120, w: 216, h: 54, title: "FalkorDB", sub: "facts filtered by provenance", variant: "ext" });
  o += box({ x: 820, y: 214, w: 216, h: 54, title: "Object storage", sub: "bytes written after the scope check", variant: "ext" });
  o += box({ x: 820, y: 316, w: 216, h: 54, title: "NVIDIA · Nebius", sub: "keys stay on the server", variant: "ext" });
  o += edge({ points: [[210, 66], [280, 66]] });
  o += edge({ points: [[210, 200], [280, 200]] });
  o += edge({ points: [[210, 342], [280, 342]] });
  o += edge({ points: [[512, 71], [527, 71], [527, 130], [540, 130]] });
  o += edge({ points: [[512, 201], [527, 201], [527, 160], [540, 160]] });
  o += edge({ points: [[742, 120], [780, 120], [780, 53], [818, 53]] });
  o += edge({ points: [[742, 145], [818, 147]] });
  o += edge({ points: [[742, 170], [780, 170], [780, 241], [818, 241]] });
  o += edge({ points: [[742, 342], [818, 343]] });
  return svg(1040, 414, o, { title: "Trust boundaries" });
}

// A document's statuses through the stages (schemas/enums.py).
export function journey({ svg, box, edge }) {
  const lanes = [
    ["Source", ["pending", "processing"], ["completed", "failed"]],
    ["Extraction run", ["processing"], ["completed", "partial", "failed"], "each run is a new version"],
    ["Chunk set", ["new version"], ["is_active = true"], "earlier versions switched off"],
    ["Embedding", ["pending", "processing"], ["completed", "failed"], "failed retried, up to 3 times"],
    ["Graph build", ["processing"], ["completed", "partial", "failed"], "one live extraction per source"],
  ];
  let o = "";
  lanes.forEach(([name, steps, ends, note], r) => {
    const y = 4 + r * 56;
    o += `<text class="d-t" x="0" y="${y + 24}">${name}</text>`;
    let x = 160;
    steps.forEach((t, i) => {
      o += box({ x, y, w: 150, h: 38, title: t, variant: i === steps.length - 1 && t === "processing" ? "warn" : "" });
      o += edge({ points: [[x + 150, y + 19], [x + 178, y + 19]] });
      x += 180;
    });
    o += box({ x, y, w: 250, h: 38, title: ends.join(" · "), variant: "ok" });
    if (note) o += `<text class="d-s" x="${x + 266}" y="${y + 23}">${note}</text>`;
  });
  return svg(1040, 284, o, { title: "Statuses through the stages" });
}
