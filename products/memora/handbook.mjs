// Memora product handbook: content and page order.
//
// Evidence baseline: the Memora repository, main @ f4c6b8c (2026-10-19), read
// from backend/app (config defaults, services, routes), console/src and the
// design records under docs/ at that commit. The repository has no product
// screenshots, so product views here are mocks drawn from the console's
// tokens and are labelled "Illustrative".

import icons, { iconStyle } from "./icons.mjs";
import * as fig from "./diagrams.mjs";

// An "Ask Memora" result as the console lays it out. Example content only.
const askMock = (c, { compact = false, question = true } = {}) => c.mock({
  caption: "console · ask memora",
  body: `
    ${question ? c.panel({ title: "Question", body: `<p class="small" style="color:var(--text)">What notice period does the lease require before termination?</p>` }) : ""}
    ${c.panel({ title: "Answer", hint: "grounded in 6 chunks", body: `<p class="small" style="color:var(--text-2)">The lease requires <b>60 days' written notice</b> before either party terminates it [1]. Notice must be delivered to the address in the schedule [2].</p>` })}
    ${compact ? "" : c.stats([{ k: "Dense", v: "40" }, { k: "Lexical", v: "40" }, { k: "RRF", v: "40" }, { k: "MMR", v: "30" }, { k: "Final", v: "6" }], 5)}
    ${c.panel({ title: "Supporting chunks", body: `
      <div class="row small" style="justify-content:space-between"><span><code>[1]</code> lease-agreement.pdf · §12 Termination · p.7</span><span class="badge ok">rerank 3.1</span></div>
      <div class="row small" style="justify-content:space-between"><span><code>[2]</code> lease-agreement.pdf · Schedule A · p.14</span><span class="badge ok">rerank 1.4</span></div>` })}`,
});

export default {
  product: {
    name: "Memora",
    mark: "M",
    handbookTitle: "Product Handbook",
    footer: "Memora Product Handbook · evidence: Memora repository @ f4c6b8c",
  },
  theme: "theme.css",
  icons,
  iconStyle,
  statuses: {
    api: { label: "API only", cls: "info", note: "Built; reachable through the API only." },
    planned: { label: "Not built", cls: "ghost", note: "Designed or named; no code yet." },
  },
  sections: [
    { id: "overview", title: "Product overview" },
    { id: "concepts", title: "Core concepts" },
    { id: "features", title: "Features" },
    { id: "workflows", title: "User workflows" },
    { id: "architecture", title: "Architecture" },
    { id: "data", title: "Data flows & integrations" },
    { id: "security", title: "Security & permissions" },
    { id: "scope", title: "Limitations & scope" },
    { id: "reference", title: "Quick reference" },
  ],
  pages: [
    /* ------------------------------------------------------------ Cover */
    {
      kind: "cover",
      title: "Cover",
      cover: (c) => ({
        eyebrow: "Product handbook",
        title: "Durable, retrievable memory <em>for applications that need context.</em>",
        subtitle: "What Memora is, who it serves, how a document becomes a cited answer, and how its parts fit together.",
        tag: "October 2026",
        visual: askMock(c, { compact: true }),
        meta: [
          ["Product", "Memora · memory and RAG service"],
          ["Evidence", "Memora repository, main @ f4c6b8c"],
          ["Audience", "Product, integration and engineering"],
          ["Product views", "Illustrative, drawn from the console's design"],
        ],
      }),
    },

    { kind: "contents", title: "Contents", kicker: "Handbook", lede: "Nine sections, from what Memora is to how it is built. Each page covers one idea." },

    /* ------------------------------------------------------------ 1 Overview */
    {
      section: "overview",
      title: "What Memora is",
      lede: "Memora is a memory service for other applications. An application registers files, URLs or chat transcripts in a workspace; Memora stores them, reads them with NVIDIA models, splits them into chunks, embeds and indexes them, builds a knowledge graph, and answers questions with cited evidence, scoped so each application sees only its own data.",
      body: (c) => `
        ${c.figure({ title: "From upload to answer", hint: "each stage runs on request or after the one before it", svg: fig.pipeline(c.d), height: "44mm" })}
        <div class="grid g4">
          ${c.featureCard({ icon: "tenants", title: "One ownership chain", summary: "Tenant → application → subject → source. Every row knows its owners, so nothing is reachable by ID alone." })}
          ${c.featureCard({ icon: "scan", title: "Reads hard documents", summary: "Per-page triage sends scans, tables and charts to layout and vision models; clean text stays local and free." })}
          ${c.featureCard({ icon: "ask", title: "Cited, honest answers", summary: "Hybrid search, reranking and a grounded prompt; the answer says when the knowledge is insufficient." })}
          ${c.featureCard({ icon: "compare", title: "Graph RAG, measured", summary: "A knowledge graph per tenant, and an Arena and benchmarks that compare it with vector RAG on your own questions." })}
        </div>
        ${c.takeaway("Memora is infrastructure, not an end-user app: client applications such as Pingie call its API, and operators manage it from the console.")}`,
    },
    {
      section: "overview",
      title: "Who it serves and what it solves",
      lede: "Teams whose applications must remember documents and conversations, without each building its own retrieval stack.",
      body: (c) => `
        <div class="row grow">
          <div class="col grow" style="flex:1.5">
            <span class="label">Problem → how Memora responds</span>
            ${[
              ["applications", "Every application rebuilds parsing, chunking, embeddings and search.", "One API covers registration through grounded answers; an application only sends files and questions."],
              ["scan", "Simple parsers lose tables, scans and charts.", "Hard pages are routed to NVIDIA layout and vision models; every run is versioned with its cost."],
              ["shield", "Customer data must never cross between tenants.", "A credential resolves to exactly one application; every service call checks ownership and answers 404 otherwise."],
              ["compare", "Nobody knows whether Graph RAG is worth its cost.", "The Arena and benchmarks score vector, graph and hybrid pipelines on the same questions."],
            ].map(([ic, p, r]) => `
              <div class="row" style="align-items:stretch">
                <div class="card" style="flex:1"><div class="card-top">${c.iconTile(ic, { plain: true })}<span class="label">Problem</span></div><p style="color:var(--text-2)">${p}</p></div>
                <div style="display:flex;align-items:center;color:var(--accent-soft)">${c.icon("route", 16)}</div>
                <div class="card accent" style="flex:1.3"><span class="label" style="color:var(--accent-soft)">Response</span><p style="color:var(--text)">${r}</p></div>
              </div>`).join("")}
          </div>
          <div class="col" style="flex:1">
            ${c.panel({ title: "Who uses which part", body: c.matrix({
              columns: [{ label: "Uses" }],
              rows: [
                { head: "Client applications", cells: ["The REST API with a <code>memora_…</code> token"] },
                { head: "Operators", cells: ["The console, signed in with Google"] },
                { head: "Integrators", cells: ["The public site's API reference"] },
              ],
            }) })}
            ${c.panel({ title: "How to read this handbook", body: `<p class="small muted">Status reflects the repository at f4c6b8c (19 Oct 2026); numbers are <code>config.py</code> defaults. The repository has no screenshots, so product views are labelled mocks.</p>${c.statusLegend(["implemented", "partial", "api", "planned"])}` })}
          </div>
        </div>`,
    },

    /* ------------------------------------------------------------ 2 Concepts */
    {
      section: "concepts",
      title: "The ownership chain",
      lede: "Everything in Memora hangs off one chain. Reading it top to bottom is the whole data model.",
      body: (c) => `
        ${c.figure({ title: "The ownership chain", hint: "README · db/models", svg: fig.ownership(c.d), height: "78mm" })}
        <div class="grid g4">
          ${c.featureCard({ icon: "actors", title: "An actor is not a subject", summary: "The actor caused a workspace to exist; the subject is the workspace." })}
          ${c.featureCard({ icon: "route", title: "Ownership is derived", summary: "A source's tenant and application are copied from its subject, never sent by the client." })}
          ${c.featureCard({ icon: "check", title: "The chain must agree", summary: "A source asked for under the wrong subject is not found, even when you own both." })}
          ${c.featureCard({ icon: "user", title: "Not an identity provider", summary: "An actor stores only your <code>external_id</code>: no email, password or role." })}
        </div>`,
    },

    /* ------------------------------------------------------------ 3 Features */
    {
      section: "features",
      layout: "cards",
      title: "Capability map",
      lede: "Everything Memora does, grouped as the console groups it. Status shows what the repository implements.",
      body: (c) => c.cardGrid([
        { icon: "subjects", title: "Ownership & folders", summary: "Tenants, applications, actors, subjects nested as folders, with ownership checked on every call.", status: "implemented" },
        { icon: "upload", title: "Source registration", summary: "Upload up to 50 MiB, or register a URL or chat; move, stream and delete files.", status: "implemented" },
        { icon: "scan", title: "Extraction Agent", summary: "Per-page triage, NVIDIA layout, vision and text models, versioned runs with cost.", status: "implemented" },
        { icon: "chunks", title: "Chunking", summary: "Local, structure-aware chunks of 300–500 tokens with section paths; no model cost.", status: "implemented" },
        { icon: "embeddings", title: "Embeddings", summary: "Immutable strategies over Nemotron embeddings in pgvector, with coverage and retries.", status: "implemented" },
        { icon: "ask", title: "Ask Memora", summary: "Hybrid retrieval, MMR, reranking and a grounded, cited, streamed answer.", status: "implemented" },
        { icon: "graph", title: "Knowledge graph", summary: "Ontology-typed entities and facts in FalkorDB, one graph per tenant, with provenance.", status: "implemented" },
        { icon: "compare", title: "Graph RAG Arena", summary: "Vector, graph and hybrid answers side by side, five graph techniques.", status: "implemented" },
        { icon: "chart", title: "Benchmarks & Advisor", summary: "Score pipelines on question sets; the Advisor weighs accuracy, cost and explainability.", status: "implemented" },
        { icon: "layers", title: "Unified Graph RAG", summary: "A rebuilt graph over retrieval chunks, with atomic facts, communities and checked citations.", status: "api" },
        { icon: "gdrive", title: "Google Drive", summary: "Ask Drive PDFs with nothing stored, or import them into the knowledge base.", status: "implemented" },
        { icon: "test", title: "Evaluation harness", summary: "Generate, review and run question sets; Recall@k, MRR, nDCG, refusals, latency, cost.", status: "implemented" },
      ], 4),
    },
    {
      section: "features",
      title: "Registering sources",
      lede: "A source is one piece of registered knowledge inside a subject. Files are stored; URLs and chats can be recorded as metadata only.",
      body: (c) => `
        <div class="grid g3">
          ${c.featureCard({ icon: "upload", title: "Upload a file", summary: "Any type up to 50 MiB. <code>extract=true</code> starts reading straight away; <code>build_graph=true</code> adds the graph.", status: "implemented" })}
          ${c.featureCard({ icon: "docs", title: "Register a URL or chat", summary: "A row that points at content stored elsewhere; no bytes move.", status: "implemented" })}
          ${c.featureCard({ icon: "subjects", title: "Folders", summary: "Subjects nest by parent; moves and subtree deletes are checked with recursive queries.", status: "implemented" })}
        </div>
        <div class="row grow">
          <div style="flex:1">${c.panel({ title: "Safe write and delete order", body: c.steps([
            { title: "Check scope", text: "The subject must belong to the caller." },
            { title: "Write bytes", text: "Original file to local disk or Cloudflare R2." },
            { title: "Write the row", text: "If it fails, the bytes are removed again." },
          ], { vertical: true }) })}</div>
          <div class="col" style="flex:1">
            ${c.explain({
              purpose: "Give every file a tracked, owned identity before any processing.",
              behavior: "The client never sends tenant or application ids; they are copied from the subject in the path.",
              value: "A caller cannot attach a file to data it does not own.",
              limits: "No file-type allow-list; the size limit applies only when the upload's size is known.",
            })}
          </div>
        </div>`,
    },
    {
      section: "features",
      title: "Extraction Agent: reading documents",
      lede: "Local parsers decide which pages are hard; only hard parts go to NVIDIA models. Each run is a new version, with every model call and its cost recorded.",
      body: (c) => `
        <div class="row grow">
          ${c.figure({ title: "Per-page triage", hint: "PDF pages; other types route by kind", svg: fig.triage(c.d), style: "flex:1.25", height: "70mm" })}
          <div class="col" style="flex:1">
            ${c.matrix({ firstLabel: "Role", columns: [{ label: "Default model" }], rows: [
              { head: "layout", cells: ["<code>nvidia/nemotron-parse</code>"] },
              { head: "vision", cells: ["<code>nemotron-3-nano-omni-30b</code>"] },
              { head: "extract · answer · graph", cells: ["<code>nemotron-3-super-120b</code>"] },
            ] })}
            ${c.bullets([
              "Reads PDF, DOCX, PPTX, XLSX, images and plain text.",
              "<b>Deep</b> mode sends every PDF page to the layout model.",
              "Up to 30 pages per document; 4 calls in parallel by default.",
              "Fallback: layout → vision → local text; some units failed means <code>partial</code>.",
            ])}
          </div>
        </div>
        ${c.takeaway("Extraction keeps the per-page readings and the merged text, so chunking and the graph never pay to read the document again.")}`,
    },
    {
      section: "features",
      title: "Chunking",
      lede: "Chunking is local and free. It turns an extraction's readings into retrieval-sized pieces that follow the document's own structure.",
      body: (c) => `
        ${c.figure({ title: "Chunking stages", hint: "app/chunking", svg: fig.chunking(c.d), height: "34mm" })}
        <div class="row">
          <div style="flex:1.2">${c.stats([
            { k: "Target size", v: "300–500", s: "tokens" },
            { k: "Soft max", v: "600", s: "tokens" },
            { k: "Hard max", v: "1,200", s: "tokens" },
            { k: "Overlap", v: "0", s: "by default" },
          ], 4)}</div>
        </div>
        <div class="row grow">
          <div style="flex:1">${c.explain({
            purpose: "Make pieces that answer one thing each, with their place in the document.",
            behavior: "Runs after every successful extraction, or on <code>POST /sources/{id}/rechunk</code>. A new version becomes active and older ones switch off in one transaction.",
            value: "Chunks can be rebuilt at will, without model cost, and every answer can name its section.",
            limits: "A coherent section under 300 tokens stays small: chunks are never padded.",
          }, { wide: true })}</div>
        </div>`,
    },
    {
      section: "features",
      title: "Embeddings and strategies",
      lede: "Each chunk is embedded into pgvector under a strategy, indexed with HNSW, and kept in step with the chunks.",
      body: (c) => `
        <div class="row grow">
          <div class="col" style="flex:1">
            ${c.matrix({ columns: [{ label: "Model" }, { label: "Strategy", hl: true }], firstLabel: "", rows: [
              { head: "What it is", cells: ["A physical embedding model", "How Memora uses it"] },
              { head: "Example", cells: ["<code>nvidia/nemotron-3-embed-1b</code>, 2,048 dims", "“Memora Dense v1”, seeded by migration"] },
              { head: "Holds", cells: ["Dimensions, normalisation", "Input field, templates, normalisation, metric"] },
              { head: "Changes", cells: ["—", "Immutable; a different setup is a new strategy"] },
            ] })}
            ${c.takeaway("Because strategies never change, every vector knows exactly what produced it, and several strategies can be compared side by side.")}
          </div>
          <div class="col" style="flex:1">
            ${c.featureCard({ icon: "bolt", title: "Idempotent", summary: "A hash of strategy, model and exact text: unchanged content re-embeds as a no-op and spends nothing." })}
            ${c.featureCard({ icon: "refresh", title: "Tracked and retried", summary: "Each vector goes pending → processing → completed or failed, retried up to 3 times with the error kept." })}
            ${c.featureCard({ icon: "chart", title: "Coverage you can see", summary: "The Embeddings page shows total, embedded and processing chunks, coverage, and the strategies." })}
          </div>
        </div>`,
    },
    {
      section: "features",
      title: "Ask Memora: retrieval and grounded answers",
      lede: "A question is answered only from chunks the caller owns. Two searches are fused, diversified and reranked; the model then answers from the best six, citing them.",
      body: (c) => `
        ${c.figure({ title: "Query pipeline", hint: "default sizes from config.py", svg: fig.retrieval(c.d), height: "44mm" })}
        <div class="row grow">
          <div style="flex:1.1">${askMock(c, { compact: true, question: false })}</div>
          <div class="col" style="flex:1">
            ${c.callouts([
              { title: "Scope it", text: "Optional subject, source or strategy narrows the search; none means everything you own." },
              { title: "See every stage", text: "The response traces how many candidates each stage kept, with similarity and rerank scores." },
              { title: "Stream it", text: "<code>/query/stream</code> sends the evidence first, then answer text, then token usage." },
            ])}
            ${c.limitBox("The answer is generated by the LLM from the chunks; whether each sentence is supported is not checked on this path. The unified Graph RAG pipeline does check citations.", "Scope note")}
          </div>
        </div>`,
    },
    {
      section: "features",
      title: "The knowledge graph",
      lede: "An NVIDIA model reads each extraction for entities and relationships from a fixed ontology. Facts land in one FalkorDB graph per tenant, each pointing back to its source and chunk.",
      body: (c) => `
        ${c.figure({ title: "Knowledge graph build", hint: "app/graph", svg: fig.graphBuild(c.d), height: "26mm" })}
        <div class="row grow">
          <div class="col" style="flex:1">
            <span class="label">Ontology v1 · 10 entity types</span>
            <div class="row" style="flex-wrap:wrap;gap:6px">${["PERSON", "ORGANIZATION", "COMPANY", "PRODUCT", "LOCATION", "TECHNOLOGY", "PROJECT", "DOCUMENT", "CONCEPT", "EVENT"].map((t) => `<span class="badge accent">${t}</span>`).join("")}</div>
            <span class="label">20 relation types, e.g.</span>
            <div class="row" style="flex-wrap:wrap;gap:6px">${["WORKS_FOR", "MANAGES", "OWNS", "USES", "SUPPLIES", "PARTY_TO", "LOCATED_IN", "PART_OF", "DEPENDS_ON", "RELATED_TO"].map((t) => `<span class="badge">${t}</span>`).join("")}</div>
            <p class="small muted">Unknown types fall back to <code>CONCEPT</code> and <code>RELATED_TO</code>, keeping the original label.</p>
          </div>
          <div class="col" style="flex:1">
            ${c.explain({
              purpose: "Capture who and what documents mention, and how they relate.",
              behavior: "Built on request per source. A subject's view is filtered to facts from its own sources and subfolders. Retrieval follows 1–3 deterministic hops.",
              value: "Relationship questions can use connected facts, not just similar text.",
              limits: "Optional: without a FalkorDB URL, graph endpoints answer 503 and everything else works.",
            })}
          </div>
        </div>`,
    },
    {
      section: "features",
      title: "Graph RAG and the Arena",
      lede: "Graph RAG runs as its own service beside vector RAG. The console's Arena asks one question of each pipeline and shows the answers, evidence, time and cost side by side.",
      body: (c) => `
        ${c.figure({ title: "Arena pipelines", hint: "docs/graph-rag-compare.md", svg: fig.arena(c.d), height: "52mm" })}
        <span class="label">Five graph techniques</span>
        <div class="grid g5">
          ${c.featureCard({ title: "spreading", summary: "Multi-seed spreading activation with hop decay." })}
          ${c.featureCard({ title: "ppr", summary: "Personalised PageRank around the question." })}
          ${c.featureCard({ title: "dual_level", summary: "LightRAG-style entity and theme matching." })}
          ${c.featureCard({ title: "paths", summary: "Shortest paths between seed entities, as chains." })}
          ${c.featureCard({ title: "community", summary: "Question against community summaries." })}
        </div>
        ${c.takeaway("Embedding similarity can't tell a match from a near-miss here, so “nothing relevant” is decided by the reranker: a best score under −5.0 is flagged as weak evidence.")}`,
    },
    {
      section: "features",
      title: "Benchmarks, Advisor and Source inspector",
      lede: "Three tools turn the comparison into evidence: score pipelines on many questions, weigh the trade-offs, and check how one file's graph was built.",
      body: (c) => `
        <div class="grid g3 grow" style="align-items:start">
          ${c.panel({ title: "Benchmarks", hint: "/compare/benchmarks", body: c.bullets([
            "Runs pipelines over a question set, loaded from a file.",
            "Scored against expected answers and supporting chunks.",
            "Scorecard, per-question wins and losses, results by question type.",
            "Shows set-up cost: Graph RAG spends effort before any question.",
          ]) })}
          ${c.panel({ title: "Advisor", hint: "reads a benchmark", body: c.bullets([
            "Weights accuracy, cost per question and explainability.",
            "Compares vector RAG with the best graph pipeline per question type.",
            "Says whether a lead is bigger than the noise for that many questions.",
            "Explainability is a property of the method, not a measurement.",
          ]) })}
          ${c.panel({ title: "Source inspector", hint: "/compare/inspect", body: c.bullets([
            "One file's graph beside the passages it came from.",
            "Each passage shows the entities and facts it produced.",
            "Flags weak extraction: empty passages, isolated entities, low-confidence facts.",
            "Shows only what that file contributed.",
          ]) })}
        </div>
        <div class="row">
          <div style="flex:1">${c.panel({ title: "Graph explorer", body: `<p class="small muted">Browse a subject's graph; double-click an entity to pull in its neighbours. Larger circles are mentioned in more passages.</p>` })}</div>
          <div style="flex:1">${c.panel({ title: "Unified pipeline in benchmarks", body: `<p class="small muted">The API adds it with <code>include_unified</code>, with citation and unsupported-number rates. ${c.status("api")}</p>` })}</div>
        </div>`,
    },
    {
      section: "features",
      title: "Unified Graph RAG",
      lede: "A second graph build reads the same chunks vector search uses, so every fact cites a real chunk. Its answers carry markers that are checked, never rewritten.",
      body: (c) => `
        ${c.figure({ title: "Unified Graph RAG", hint: "app/graphrag · build and retrieve", svg: fig.unified(c.d), height: "64mm" })}
        <div class="row grow">
          <div style="flex:1">${c.explain({
            purpose: "Make graph evidence exactly citable and safer to answer from.",
            behavior: "Facts need a verbatim quote; merges need a reason and are recorded. If evidence stays weak after widening, it abstains and lists the closest passages.",
            value: "Answers point to specific chunks, facts and overviews; uncited sentences and unsupported numbers are flagged.",
            limits: "Reached only through the API (<code>pipeline: \"unified\"</code>, <code>/graph-rag/build</code>). Measured on one small corpus; community summaries and the entity judge are not cost-metered.",
          }, { wide: true })}</div>
        </div>
        <div class="row"><div style="flex:1">${c.takeaway("Builds are planned per source (new, changed, outdated, orphaned) and one run per subject holds a lease in PostgreSQL, so it works across workers.")}</div></div>`,
    },
    {
      section: "features",
      title: "Google Drive connector",
      lede: "A console user connects Drive with read-only access. PDFs can then be asked about without storing anything, or imported into the knowledge base.",
      body: (c) => `
        ${c.figure({ title: "Two modes", hint: "app/connectors/google_drive", svg: fig.drive(c.d), height: "62mm" })}
        <div class="grid g3">
          ${c.featureCard({ icon: "lock", title: "Private mode", summary: "Zero retention: bytes, chunks and vectors live for one request, then are discarded with the answer.", status: "implemented" })}
          ${c.featureCard({ icon: "upload", title: "Import mode", summary: "Creates a normal source, so Ask Memora and Graph RAG can use it later.", status: "implemented" })}
          ${c.featureCard({ icon: "refresh", title: "Changes in Drive", summary: "Changed or vanished files are detected, but a re-import adds a new source beside the old one.", status: "partial" })}
        </div>`,
    },
    {
      section: "features",
      title: "The operator console",
      lede: "The console is the operator's view of everything above: a rail that follows the ownership chain, then processing, retrieval, Graph RAG and connectors.",
      body: (c) => `
        <div class="grid g4">
          ${[
            ["home", "Overview", ["Dashboard: live counts and growth"]],
            ["tenants", "Ownership chain", ["Tenants", "Applications", "Actors", "Subjects", "Sources"]],
            ["credentials", "Access", ["API credentials"]],
            ["chunks", "Processing", ["Chunks", "Embeddings"]],
            ["ask", "Retrieval", ["Ask Memora"]],
            ["compare", "Graph RAG", ["Arena", "Benchmarks", "Graph explorer", "Source inspector"]],
            ["gdrive", "Connectors", ["Google Drive"]],
            ["docs", "Elsewhere", ["Docs (public site)", "API /docs (OpenAPI)"]],
          ].map(([ic, t, items]) => `<div class="card"><div class="card-top">${c.iconTile(ic)}</div><h3>${t}</h3><p>${items.join(" · ")}</p></div>`).join("")}
        </div>
        <div class="row">
          <div style="flex:1">${c.featureCard({ icon: "tenants", title: "Tenant switcher", summary: "The top bar scopes every list and pre-fills every form with one tenant, or shows all of them." })}</div>
          <div style="flex:1">${c.featureCard({ icon: "eye", title: "Light and dark", summary: "One token file reskins the console; status colours stay muted so badges stand out." })}</div>
          <div style="flex:1">${c.featureCard({ icon: "sources", title: "Ownership on every page", summary: "A source's page shows its full chain, because it can never be reached by ID alone." })}</div>
        </div>`,
    },
    {
      section: "features",
      title: "Evaluation harness",
      lede: "A self-contained package in backend/evals measures retrieval and answers on real questions. It only reads the database.",
      body: (c) => `
        ${c.steps([
          { title: "Generate", text: "Sample chunks; a model drafts questions. Dry-run shows the cost first." },
          { title: "Review", text: "Approve, reject or edit each question interactively." },
          { title: "Run", text: "Approved questions go through the real pipeline stages." },
          { title: "Compare", text: "Diff a new report against a baseline." },
        ])}
        <div class="row">
          <div style="flex:1.2">${c.stats([
            { k: "Ranking", v: "Recall@5/10", s: "MRR · nDCG@10 · hit rate" },
            { k: "Context", v: "Precision", s: "and recall" },
            { k: "Honesty", v: "Refusals", s: "false answers on unanswerables" },
            { k: "Cost", v: "p50 / p95", s: "latency, spend per run" },
          ], 4)}</div>
        </div>
        <div class="row">
          <div style="flex:1">${c.panel({ title: "Lost at stage", body: `<p class="small muted">Shows where the right chunk dropped out: top-50 search, MMR or the reranker.</p>` })}</div>
          <div style="flex:1">${c.panel({ title: "Judge scores", body: `<p class="small muted">Optional, and always labelled as LLM-judged. A separate script checks the judge against your own grades.</p>` })}</div>
          <div style="flex:1">${c.limitBox("Eval data and reports are git-ignored: they come from real documents.", "Privacy")}</div>
        </div>`,
    },

    /* ------------------------------------------------------------ 4 Workflows */
    {
      section: "workflows",
      title: "Getting started as an integrating application",
      lede: "From an empty console to an application asking questions. An operator does the first three steps once; the application does the rest over the API.",
      body: (c) => `
        ${c.steps([
          { title: "Sign in", text: "Google sign-in to the console." },
          { title: "Tenant & application", text: "Create the organisation and the consuming system." },
          { title: "API credential", text: "Copy the <code>memora_…</code> token; it is shown once." },
          { title: "Subject", text: "Create a workspace with your own <code>external_id</code>." },
          { title: "Upload", text: "<code>extract=true</code> reads, chunks and embeds it." },
          { title: "Ask", text: "<code>POST /query</code> or <code>/query/stream</code>." },
        ])}
        ${c.figure({ title: "Statuses through the stages", hint: "schemas/enums.py", svg: fig.journey(c.d), height: "62mm" })}`,
    },

    /* ------------------------------------------------------------ 5 Architecture */
    {
      section: "architecture",
      title: "System map",
      lede: "Three deployables (backend, console, public site) and the services the backend depends on. Every request is resolved to a scope by one dependency before any service runs.",
      body: (c) => `
        ${c.figure({ title: "Memora system map", hint: "left: callers · centre: backend · right, dashed: outside the repository", svg: fig.architecture(c.d), height: "100mm" })}
        <div class="row">
          <div style="flex:1">${c.takeaway("Routes stay thin; all business logic and ownership checks live in services, so a new endpoint cannot skip them.")}</div>
          <div style="flex:1">${c.limitBox("Slow work runs as background tasks in the API process by default; a durable job table with separate workers is a setting away.", "Operations note")}</div>
        </div>`,
    },
    {
      section: "architecture",
      layout: "cards",
      title: "Component responsibilities",
      lede: "What each part owns. Code in the repository first, then the services Memora depends on.",
      body: (c) => `
        <div class="grid g4">
          ${c.responsibility({ icon: "server", name: "backend", who: "API · Python", text: "Ownership chain, storage, extraction, chunking, embeddings, retrieval, graph, Graph RAG, Drive and jobs.", stack: "FastAPI · SQLAlchemy 2 · Alembic" })}
          ${c.responsibility({ icon: "home", name: "console", who: "Operators", text: "A plain API client: every page fetches through one typed client, with shared loading and error states.", stack: "Next.js 16 · React 19 · Tailwind 4" })}
          ${c.responsibility({ icon: "docs", name: "web", who: "Public", text: "Landing page and static API reference, readable without an account; makes no API calls.", stack: "Next.js 16 · static" })}
          ${c.responsibility({ icon: "test", name: "evals", who: "backend/evals", text: "Question sets, metrics and reports over the real pipeline; read-only against the database.", stack: "Python CLI" })}
          ${c.responsibility({ icon: "sources", name: "PostgreSQL", who: "External · truth", text: "Every table, vectors via pgvector with HNSW, lexical search via tsvector, the job queue.", stack: "Neon in practice" })}
          ${c.responsibility({ icon: "graph", name: "FalkorDB", who: "External · optional", text: "One graph per tenant, derived from PostgreSQL and rebuilt from it.", stack: "Cypher" })}
          ${c.responsibility({ icon: "scan", name: "NVIDIA models", who: "External · models", text: "Layout, vision, extraction, graph, answers, embeddings and reranking; Nebius serves text models in production.", stack: "OpenAI-compatible API" })}
          ${c.responsibility({ icon: "layers", name: "Object storage", who: "External · bytes", text: "Original files: local disk in development, Cloudflare R2 in production.", stack: "StorageBackend protocol" })}
        </div>
        <div class="row">
          <div style="flex:1">${c.responsibility({ icon: "shield", name: "get_scope()", who: "backend/app/api/deps.py", text: "The single place a token or session becomes a scope. No endpoint validates a token itself." })}</div>
          <div style="flex:1">${c.responsibility({ icon: "check", name: "Tests", who: "backend/tests", text: "pytest against a real PostgreSQL, never SQLite; providers are faked so tests spend no credits." })}</div>
        </div>`,
    },
    {
      section: "architecture",
      title: "Sequence: an application asks a question",
      lede: "The streaming endpoint sends evidence before the answer. A client that writes its own answer, such as Pingie, can stop after the first event.",
      body: (c) => c.figure({ title: "An application asks a question", hint: "routes/retrieval.py → retrieval_service", svg: fig.askSequence(c.d), height: "118mm" }),
    },

    /* ------------------------------------------------------------ 6 Data */
    {
      section: "data",
      title: "How information is stored",
      lede: "PostgreSQL is the source of truth. Each stage writes its own table, so any later stage can be rebuilt without repeating the earlier ones.",
      body: (c) => `
        ${c.figure({ title: "Data in creation order", hint: "docs/data-flow.md · db/models", svg: fig.dataFlow(c.d), height: "62mm" })}
        <div class="grid g3">
          ${c.featureCard({ icon: "docs", title: "Three kinds of extraction output", summary: "<code>result</code> for API consumers, <code>readings</code> for chunking, <code>content</code> for the graph." })}
          ${c.featureCard({ icon: "cost", title: "One cost ledger", summary: "<code>extraction_usage</code> records every model call, failed ones too, for extraction, graph and judge." })}
          ${c.featureCard({ icon: "refresh", title: "Derived stores repair themselves", summary: "Graph writes follow the database commit; startup sweeps clear interrupted runs and orphans." })}
        </div>`,
    },
    {
      section: "data",
      title: "Integrations and environments",
      lede: "Memora uses NVIDIA open models only: every configured model id must start with nvidia/. The environment setting decides who serves them and where files live.",
      body: (c) => `
        ${c.matrix({
          firstLabel: "",
          columns: [{ label: "local (default)" }, { label: "production", hl: true }],
          rows: [
            { head: "Text models: extract, graph, answer", cells: ["build.nvidia.com", "Nebius Token Factory"] },
            { head: "Layout, vision, embeddings, reranker", cells: ["build.nvidia.com", "build.nvidia.com (Nebius has none)"] },
            { head: "File storage", cells: ["Local disk", "Cloudflare R2"] },
          ],
        })}
        <div class="grid g4">
          ${c.featureCard({ icon: "sources", title: "PostgreSQL + pgvector", summary: "Required. All state, vectors, lexical index and jobs." })}
          ${c.featureCard({ icon: "graph", title: "FalkorDB", summary: "Optional. Without it, graph endpoints answer 503." })}
          ${c.featureCard({ icon: "user", title: "Google", summary: "Console sign-in, and Drive with a read-only scope." })}
          ${c.featureCard({ icon: "cost", title: "Pricing file", summary: "Model prices in <code>pricing.json</code> turn token counts into cost." })}
        </div>
        ${c.takeaway("Both model providers speak the OpenAI API, so switching environments changes only configuration. Each call's cost is recorded under the provider that served it.")}`,
    },
    {
      section: "data",
      title: "Integration example: Pingie on Memora",
      lede: "Pingie, an AI support chatbot, uses Memora purely for retrieval. Its own reasoning layer decides what to say.",
      body: (c) => `
        ${c.figure({ title: "Pingie on Memora", hint: "ping-backend/app/clients/memora.py", svg: fig.pingie(c.d), height: "70mm" })}
        <div class="grid g3">
          ${c.featureCard({ icon: "subjects", title: "Bot = subject", summary: "Each bot is a subject, so one bot's sources never answer another's visitors." })}
          ${c.featureCard({ icon: "route", title: "Evidence, not answers", summary: "Pingie keeps the start event's ranked chunks and writes the reply with its own model." })}
          ${c.featureCard({ icon: "layers", title: "Chat memory", summary: "Finished chats a teammate answered are pushed back as sources for later retrieval." })}
        </div>`,
    },

    /* ------------------------------------------------------------ 7 Security */
    {
      section: "security",
      title: "Trust boundaries",
      lede: "Three kinds of caller pass three gates into the same scope check. Behind it, every service compares a row's owners with the caller's scope.",
      body: (c) => `
        ${c.figure({ title: "Trust boundaries", svg: fig.trust(c.d), height: "98mm" })}
        <div class="row">
          <div style="flex:1">${c.takeaway("Cross-tenant reads return 404, not 403: a 403 would confirm the ID exists in someone else's tenant.")}</div>
          <div style="flex:1">${c.limitBox("A console user's scope is every tenant they own. There are no per-actor permissions inside a subject yet.", "Known limit")}</div>
        </div>`,
    },
    {
      section: "security",
      title: "Security controls",
      lede: "Controls verified in the backend, and the ones still missing.",
      body: (c) => `
        <div class="grid g4">
          ${c.featureCard({ icon: "credentials", title: "Hashed API tokens", summary: "Only an HMAC-SHA256 keyed by a server secret is stored; the raw token is shown once.", status: "implemented" })}
          ${c.featureCard({ icon: "user", title: "Google-only console sign-in", summary: "ID token verified with Google; 7-day HttpOnly JWT cookie.", status: "implemented" })}
          ${c.featureCard({ icon: "shield", title: "Scope on every call", summary: "Ownership derived, chain checked, 404 for anything outside scope.", status: "implemented" })}
          ${c.featureCard({ icon: "lock", title: "Per-user Drive access", summary: "Connections are filtered by user; private mode stores nothing.", status: "implemented" })}
        </div>
        <div class="row grow">
          <div class="col" style="flex:1.1">
            ${c.panel({ title: "Why a keyed HMAC, not bcrypt", body: `<p class="small muted">Authentication must find the credential from the token alone, which needs an indexed lookup; a per-row salt would force a scan. Tokens are 256 random bits, so slow hashing adds nothing, and a database dump can't forge tokens because the key never touches the database. Rotating it invalidates every credential.</p>` })}
          </div>
          <div class="col" style="flex:1">
            ${c.panel({ title: "Gaps found in the repository", body: c.bullets([
              { text: "Per-actor permissions inside a subject (<code>subject_actors</code>).", status: "planned" },
              { text: "Upload file-type allow-list.", status: "planned" },
              { text: "The session secret falls back to a placeholder if unset; set it in production.", status: "partial" },
              { text: "The README still describes a removed admin-key login.", status: "partial" },
            ]) })}
          </div>
        </div>`,
    },

    /* ------------------------------------------------------------ 8 Scope */
    {
      section: "scope",
      layout: "cards",
      title: "What is built, partial, or not built",
      lede: "Every difference found between the code and the repository's own descriptions, in one place.",
      body: (c) => `
        ${c.scope([
          { status: "implemented", title: "Built and reachable", items: [
            { text: "Ownership chain, folders, credentials" },
            { text: "Upload, extraction, chunking, embeddings" },
            { text: "Hybrid retrieval and streamed answers", note: "the README's 50 → 10 → 5 sizes are out of date" },
            { text: "Knowledge graph, Arena, benchmarks, Advisor" },
            { text: "Drive private and import modes" },
            { text: "Evaluation harness, durable job mode" },
          ] },
          { status: "partial", title: "Narrower than described", items: [
            { text: "Unified Graph RAG", note: "API only; not in the console Arena" },
            { text: "Drive resync", note: "detects changes; re-import duplicates the source" },
            { text: "Cost cap", note: "meters graph extraction only" },
            { text: "Graph paths", note: "an out-of-scope edge drops a path instead of finding another" },
          ] },
          { status: "planned", title: "Not built", items: [
            { text: "Per-actor permissions in a subject" },
            { text: "Memory Agent and multi-turn conversation memory" },
            { text: "LLM-generated Cypher" },
            { text: "Drive formats other than PDF" },
            { text: "Deleting a tenant", note: "left out on purpose: cascades are too destructive" },
          ] },
        ])}
        ${c.limitBox(["Results from the unified pipeline come from one corpus of 15 sources; treat them as indications.", "The design records in docs/ are deleted in the working tree but present at f4c6b8c; this handbook read them from git."], "Evidence notes")}`,
    },

    /* ------------------------------------------------------------ 9 Reference */
    {
      section: "reference",
      layout: "cards",
      title: "Quick reference",
      lede: "The numbers people ask about most, with their defaults from the backend configuration.",
      body: (c) => `
        ${c.stats([
          { k: "Upload size", v: "50<small>MiB</small>", s: "any file type" },
          { k: "Pages per extraction", v: "30", s: "4 model calls in parallel" },
          { k: "Chunk target", v: "300–500", s: "tokens · 1,200 hard max" },
          { k: "Embedding", v: "2,048<small>dims</small>", s: "nemotron-3-embed-1b" },
          { k: "Candidates", v: "40 + 40", s: "dense + lexical, RRF k 60" },
          { k: "After MMR", v: "30", s: "λ 0.7, then reranker" },
          { k: "Final context", v: "6", s: "chunks to the answer model" },
          { k: "Weak evidence", v: "−5.0", s: "best rerank score (Graph RAG)" },
          { k: "Graph units", v: "3,000<small>chars</small>", s: "300 overlap" },
          { k: "Session", v: "7<small>days</small>", s: "memora_session cookie" },
          { k: "Drive private", v: "10 / 100", s: "files / pages per question" },
          { k: "Job attempts", v: "3", s: "30-minute lease" },
        ], 4)}
        <div class="row">
          <div style="flex:1">${c.panel({ title: "Main endpoints", body: `<p class="small"><code>POST /subjects/{id}/sources/upload</code> · <code>POST /sources/{id}/extractions</code> · <code>POST /query</code> · <code>POST /query/stream</code> · <code>POST /compare/query</code> · <code>GET /whoami</code></p>` })}</div>
          <div style="flex:1">${c.panel({ title: "Local ports", body: `<p class="small">backend <code>:8000</code> · console <code>:3000</code> · public site <code>:3001</code> · API docs <code>/docs</code></p>` })}</div>
        </div>`,
    },
    {
      section: "reference",
      layout: "cards",
      title: "Flashcards",
      lede: "Check your understanding. Each answer fits on one line.",
      body: (c) => c.flashcards([
        { q: "What is the difference between an actor and a subject?", a: "The actor caused it; the subject is the workspace." },
        { q: "Why does a cross-tenant read return 404?", a: "A 403 would confirm that the ID exists." },
        { q: "Which pages go to the layout model?", a: "Hard ones: scans, tables, or many images." },
        { q: "Why is chunking free?", a: "It runs locally on stored readings; no model call." },
        { q: "What makes an embedding strategy safe to change?", a: "It can't change: a new setup is a new strategy." },
        { q: "Which two searches does a question run?", a: "Dense HNSW and lexical tsvector, fused by RRF." },
        { q: "How many chunks reach the answer model?", a: "Six, after MMR and the reranker." },
        { q: "How does Graph RAG know nothing relevant was found?", a: "The best rerank score is below −5.0." },
        { q: "What does Drive private mode keep?", a: "Nothing: it is discarded with the answer." },
        { q: "Why are API tokens hashed with HMAC?", a: "Indexed lookup, and a dump can't forge tokens." },
        { q: "What happens without FalkorDB?", a: "Graph endpoints answer 503; the rest works." },
        { q: "How does Pingie use Memora?", a: "Retrieval only: it reads the stream's start event." },
      ], 4),
    },
    {
      section: "reference",
      title: "Glossary",
      lede: "Terms used in the console, the API and this handbook.",
      body: (c) => c.glossary([
        { term: "Tenant", def: "The organisation that owns the data; top of the chain." },
        { term: "Application", def: "A consuming system inside a tenant; holds credentials." },
        { term: "API credential", code: "memora_…", def: "A token that resolves to one application." },
        { term: "Actor", def: "Who or what caused something; audit only." },
        { term: "Subject", def: "A workspace and data boundary; nests as folders." },
        { term: "Source", def: "A registered file, URL or chat." },
        { term: "Extraction", def: "A versioned reading of a source, with its cost." },
        { term: "Triage", def: "Labelling each page easy, medium or hard." },
        { term: "Reading", def: "One page's Markdown transcription." },
        { term: "Document unit", def: "A heading, paragraph, list, table or figure." },
        { term: "Semantic block", def: "Units grouped under one leaf section." },
        { term: "Retrieval chunk", def: "The final piece that is embedded and searched." },
        { term: "Strategy", def: "An immutable way of embedding chunks with a model." },
        { term: "HNSW", def: "The approximate nearest-neighbour index in pgvector." },
        { term: "RRF", def: "Reciprocal rank fusion of several ranked lists." },
        { term: "MMR", def: "Maximal marginal relevance: diverse, relevant picks." },
        { term: "Reranker", def: "A cross-encoder that scores question–chunk pairs." },
        { term: "Ontology", def: "The allowed entity and relation types for the graph." },
        { term: "Graph RAG", def: "Retrieval that uses the knowledge graph for evidence." },
        { term: "Arena", def: "Console page comparing pipelines on one question." },
        { term: "Atomic fact", def: "One self-contained sentence with its quote (unified)." },
        { term: "Community", def: "A cluster of related entities, with a summary." },
        { term: "Scope", def: "What a request may see, resolved by get_scope()." },
        { term: "Private mode", def: "Drive Q&A with nothing stored." },
      ]),
    },
  ],
};
