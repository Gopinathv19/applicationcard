// Pingie diagrams, drawn with the system's SVG primitives. Every label here
// was checked against ping-backend (see the comments for the source files).

// System map: who uses what, the backend's three entry points, its services
// and the services it relies on. (app/main.py, app/api/routes/*)
export function architecture({ svg, box, edge, zone }) {
  const svc = [
    ["Knowledge", ["uploads · crawler", "team answers"]],
    ["Reasoning pipeline", ["condense · retrieve · ground", "generate · verify"]],
    ["Live chat & inbox", ["handoff · take over", "presence · transcripts"]],
    ["Access & plans", ["roles · shares", "quotas · limits"]],
    ["Notifications", ["lead and missed-chat", "email"]],
  ];
  const ext = [
    ["Memora", ["retrieval engine", "extract · embed · rerank"]],
    ["LLM provider", ["VizhiOps gateway (default)", "or Nebius · build.nvidia"]],
    ["PostgreSQL (Neon)", ["bots · chats · members", "plans · leads"]],
    ["Google Sign-In", ["verifies ID tokens"]],
    ["SMTP (optional)", ["logged only if unset"]],
  ];
  const sy = (i) => 44 + i * 84; // service / external row top
  const cy = (i) => sy(i) + 26;
  let o = zone({ x: 336, y: 8, w: 468, h: 448, label: "ping-backend · FastAPI", variant: "trust" });
  const rows = [
    ["Website visitor", "anonymous", "Chat widget", ["widget.js on the site", "TypeScript · Shadow DOM"], "Widget API", ["/api/v1/widget/*", "Origin + conversation token"]],
    ["Support team", "owner · editor · viewer", "Dashboard", ["ping-frontend", "Next.js · React 19"], "Dashboard API", ["/api/v1/*", "session cookie (Google)"]],
    ["Pingie team", "allow-listed admins", "Admin console", ["ping-admin", "Next.js"], "Admin API", ["/api/v1/admin/*", "short-lived admin token"]],
  ];
  rows.forEach(([actor, aSub, client, cSub, api, apiSub], i) => {
    const y = 50 + i * 150, c = y + 32;
    o += box({ x: 0, y: y + 6, w: 120, h: 52, title: actor, sub: aSub, variant: "soft" });
    o += box({ x: 150, y, w: 160, h: 64, title: client, sub: cSub });
    o += box({ x: 356, y, w: 180, h: 64, title: api, sub: apiSub, variant: "accent" });
    o += edge({ points: [[120, c], [148, c]] });
    o += edge({ points: [[310, c], [354, c]] });
    o += `<path class="d-edge" d="M536 ${c} H561"/>`;
  });
  o += `<path class="d-edge" d="M561 ${cy(0)} V${cy(4)}"/>`;
  svc.forEach(([t, s], i) => {
    o += box({ x: 586, y: sy(i), w: 196, h: 52, title: t, sub: s });
    o += edge({ points: [[561, cy(i)], [584, cy(i)]] });
  });
  ext.forEach(([t, s], i) => { o += box({ x: 840, y: sy(i), w: 196, h: 52, title: t, sub: s, variant: "ext" }); });
  o += edge({ points: [[782, cy(0) - 8], [838, cy(0) - 8]], label: "index", at: [810, cy(0) - 13] });
  o += edge({ points: [[782, cy(1) - 10], [812, cy(1) - 10], [812, cy(0) + 12], [838, cy(0) + 12]], variant: "accent", label: "retrieve", at: [812, cy(0) + 52] });
  o += edge({ points: [[782, cy(1) + 8], [838, cy(1) + 8]], variant: "accent", label: "generate", at: [810, cy(1) + 22] });
  o += edge({ points: [[782, cy(2)], [838, cy(2)]], label: "state", at: [810, cy(2) - 5] });
  o += edge({ points: [[782, cy(3)], [838, cy(3)]], label: "verify", at: [810, cy(3) - 5] });
  o += edge({ points: [[782, cy(4)], [838, cy(4)]], label: "send", at: [810, cy(4) - 5] });
  return svg(1040, 460, o, { title: "Pingie system map" });
}

// Who answers a widget message, in the order chat_service.begin() checks.
export function routing({ svg, box, edge, diamond }) {
  const D = [
    ["Person on", ["the chat?"], "Goes to the agent", ["bot stays quiet"]],
    ["Bot paused?", [], "Offline message", ["from Bot settings"]],
    ["Email after", ["a fallback?"], "Lead saved", ["handoff email notified"]],
    ["Asked for a", ["person twice?"], "Hand over", ["if an agent is online,", "otherwise save a lead"]],
    ["First question", ["seen before?"], "Cached answer", ["same knowledge version"]],
  ];
  let o = "";
  D.forEach(([t, s, rt, rs], i) => {
    const x = 10 + i * 172;
    o += diamond({ x, y: 14, w: 150, h: 92, title: t, sub: s });
    o += edge({ points: [[x + 75, 106], [x + 75, 154]], label: "yes", at: [x + 90, 134], anchor: "start" });
    o += box({ x, y: 156, w: 150, h: 64, title: rt, sub: rs, variant: i === 3 ? "warn" : "" });
    o += edge({ points: [[x + 150, 60], [x + 170, 60]] });
    o += `<text class="d-edge-label" x="${x + 160}" y="50" text-anchor="middle">no</text>`;
  });
  o += box({ x: 870, y: 34, w: 166, h: 52, title: "Answer pipeline", sub: "next page", variant: "accent" });
  return svg(1040, 226, o, { title: "Message routing decisions" });
}

// The reasoning pipeline (app/reasoning/pipeline.py, chat_service._taught_reply).
export function pipeline({ svg, box, edge }) {
  const main = [
    ["Visitor message", "after the routing checks"],
    ["1 · Small talk?", "greetings and thanks"],
    ["2 · Condense", "follow-ups → standalone query"],
    ["3 · Retrieve", "Memora · MMR · rerank · top 5"],
    ["4 · Ground", "similarity floor, default 0.30"],
    ["5 · Team answer?", "Team answers ranked first"],
    ["6 · Generate", "bot tier, instructions, tone"],
    ["7 · Verify", "parse [n] · [[PARTIAL]] · NO_ANSWER"],
  ];
  const branch = {
    1: ["Canned reply", "no search, no LLM call", "ok", "yes"],
    4: ["Fallback message", "ask for email or offer a person", "warn", "nothing left"],
    5: ["Team answer, word for word", "cited as “Team answers”", "ok", "question matches"],
  };
  let o = "";
  main.forEach(([t, s], i) => {
    const y = i * 54;
    o += box({ x: 10, y, w: 230, h: 40, title: t, sub: s, variant: i === 0 ? "soft" : "accent" });
    if (i) o += edge({ points: [[125, y - 14], [125, y - 1]], variant: "accent" });
    const b = branch[i];
    if (b) {
      o += edge({ points: [[240, y + 20], [458, y + 20]], label: b[3], at: [349, y + 15], variant: b[2] });
      o += box({ x: 460, y, w: 230, h: 40, title: b[0], sub: b[1], variant: b[2] });
    }
  });
  const outs = [["answered", "cited passages become source chips", "ok"], ["partial", "part of the question covered", "warn"], ["fallback", "NO_ANSWER: fallback shown instead", "danger"]];
  o += `<path class="d-edge" d="M125 418 V432 H595"/>`;
  outs.forEach(([t, s, v], i) => {
    const x = 10 + i * 235, cx = x + 115;
    o += edge({ points: [[cx, 432], [cx, 444]], variant: v });
    o += box({ x, y: 446, w: 230, h: 40, title: t, sub: s, variant: v });
  });
  return svg(700, 490, o, { title: "Answer pipeline" });
}

// A visitor asks a question (routes/widget.py → chat_service → reasoning).
export function askSequence({ sequence }) {
  return sequence({
    width: 1040,
    rowH: 25,
    title: "A visitor asks a question",
    actors: [
      { id: "w", label: "Chat widget", sub: "widget.js" },
      { id: "api", label: "Widget API", sub: "routes/widget", accent: true },
      { id: "chat", label: "Chat service", sub: "chat_service" },
      { id: "r", label: "Reasoning", sub: "pipeline", accent: true },
      { id: "m", label: "Memora", sub: "retrieval" },
      { id: "llm", label: "LLM", sub: "VizhiOps" },
      { id: "db", label: "PostgreSQL", sub: "Neon" },
    ],
    steps: [
      { from: "w", to: "api", label: "POST …/messages + X-Conversation-Token" },
      { from: "api", to: "api", label: "origin · rate limit · quota" },
      { from: "api", to: "chat", label: "begin turn" },
      { from: "chat", to: "db", label: "save visitor message" },
      { group: "Small talk, team answer or cached answer", span: ["w", "db"], steps: [
        { from: "chat", to: "w", label: "instant reply, no LLM call", reply: true },
      ] },
      { group: "Needs the knowledge base", span: ["w", "db"], steps: [
        { from: "r", to: "llm", label: "rewrite follow-up (fast tier)" },
        { from: "r", to: "m", label: "retrieve(query, bot subject)" },
        { from: "m", to: "r", label: "ranked passages", reply: true },
        { from: "r", to: "r", label: "drop below floor" },
        { from: "r", to: "llm", label: "prompt + numbered passages", accent: true },
        { from: "llm", to: "w", label: "tokens streamed over SSE", reply: true, accent: true },
        { from: "r", to: "r", label: "verify: outcome + citations" },
      ] },
      { from: "chat", to: "db", label: "save reply, outcome, citations, trace" },
      { from: "chat", to: "w", label: "final event: answer + sources", reply: true },
    ],
  });
}

// Conversation status (app/services/live_service.py).
export function liveStates({ svg, box, edge }) {
  const S = [["bot", "the assistant answers"], ["waiting", "visitor asked for a person"], ["human", "an agent is replying"], ["closed", "next message restarts the bot"]];
  const x = [20, 300, 580, 850];
  let o = "";
  S.forEach(([t, s], i) => { o += box({ x: x[i], y: 96, w: 170, h: 56, title: t, sub: s, variant: i === 0 ? "accent" : i === 1 ? "warn" : i === 2 ? "ok" : "soft" }); });
  o += edge({ points: [[190, 124], [298, 124]], label: ["asks for a person", "(agent online)"], at: [244, 104] });
  o += edge({ points: [[470, 124], [578, 124]], label: ["agent joins", "or replies"], at: [524, 104] });
  o += edge({ points: [[750, 124], [848, 124]], label: "End chat", at: [799, 116] });
  o += edge({ points: [[385, 152], [385, 190], [125, 190], [125, 154]], variant: "warn dash", label: "nobody joins in 2 minutes → ask for email", at: [255, 204] });
  o += edge({ points: [[665, 152], [665, 232], [75, 232], [75, 154]], label: "Hand back to bot", at: [370, 246] });
  o += edge({ points: [[105, 96], [105, 56], [665, 56], [665, 94]], label: "agent takes over any chat", at: [385, 50] });
  o += edge({ points: [[935, 96], [935, 20], [60, 20], [60, 94]], variant: "dash", label: "visitor writes again", at: [500, 14] });
  return svg(1040, 254, o, { title: "Conversation status" });
}

export function sourceLifecycle({ svg, box, edge }) {
  let o = "";
  o += box({ x: 0, y: 46, w: 110, h: 44, title: "queued", sub: "URLs, sitemaps" });
  o += box({ x: 150, y: 46, w: 130, h: 44, title: "indexing", sub: "extract · chunk · embed", variant: "warn" });
  o += box({ x: 320, y: 46, w: 110, h: 44, title: "ready", sub: "searchable", variant: "ok" });
  o += box({ x: 150, y: 128, w: 130, h: 44, title: "failed", sub: "error on the row", variant: "danger" });
  o += edge({ points: [[110, 68], [148, 68]] });
  o += edge({ points: [[280, 68], [318, 68]] });
  o += edge({ points: [[215, 90], [215, 126]] });
  o += edge({ points: [[150, 150], [55, 150], [55, 92]], variant: "dash", label: "Re-sync", at: [100, 144] });
  o += edge({ points: [[430, 68], [448, 68], [448, 22], [55, 22], [55, 44]], variant: "dash", label: "Re-sync after a page changes", at: [250, 16] });
  return svg(460, 176, o, { title: "Source status" });
}

// Knowledge ingestion (source_service, ingestion/crawler.py, answer_service, memory_service).
export function ingestion({ svg, box, edge }) {
  let o = "";
  const ins = [["File upload", "PDF · DOCX · TXT · MD · CSV"], ["Single URL", "one page"], ["Sitemap", "up to 200 pages"], ["Team answers", "taught from the inbox"]];
  ins.forEach(([t, s], i) => { o += box({ x: 0, y: 8 + i * 60, w: 180, h: 46, title: t, sub: s, variant: "soft" }); });
  o += box({ x: 240, y: 60, w: 200, h: 112, title: "Crawler", sub: ["robots.txt aware", "refuses private addresses", "HTML → Markdown", "15 s · 5 MB per page"] });
  o += box({ x: 240, y: 192, w: 200, h: 42, title: "One rebuilt document", sub: "on every change" });
  o += box({ x: 520, y: 40, w: 210, h: 150, title: "Memora", sub: ["one subject per bot", "extract · chunk · embed", "HNSW index"], variant: "accent" });
  o += box({ x: 810, y: 8, w: 226, h: 60, title: "Status sweeper", sub: ["every 20 s: progress,", "chunk counts, errors"] });
  o += box({ x: 810, y: 92, w: 226, h: 46, title: "PostgreSQL", sub: "source rows mirror Memora status", variant: "ext" });
  o += box({ x: 810, y: 162, w: 226, h: 72, title: "Chat memory", sub: ["chats a teammate answered,", "closed or idle 30 min,", "emails & phones scrubbed"] });
  o += edge({ points: [[180, 31], [500, 31], [500, 70], [518, 70]], label: "sent straight to Memora", at: [340, 25] });
  o += edge({ points: [[180, 91], [238, 91]] });
  o += edge({ points: [[180, 151], [238, 151]] });
  o += edge({ points: [[180, 211], [238, 211]] });
  o += edge({ points: [[440, 116], [518, 116]], label: "text", at: [479, 110] });
  o += edge({ points: [[440, 213], [480, 213], [480, 170], [518, 170]] });
  o += edge({ points: [[808, 38], [760, 38], [760, 70], [732, 70]], variant: "dash", label: "poll", at: [784, 52] });
  o += edge({ points: [[923, 68], [923, 90]] });
  o += edge({ points: [[808, 198], [760, 198], [760, 160], [732, 160]], label: "push", at: [784, 192] });
  return svg(1040, 240, o, { title: "Knowledge ingestion" });
}

// Live chat without websockets (live_service.updates, heartbeat).
export function livePolling({ svg, box, edge }) {
  let o = "";
  o += box({ x: 0, y: 44, w: 230, h: 70, title: "Chat widget", sub: ["polls “updates since …”", "every 3 s while a person is on"] });
  o += box({ x: 405, y: 10, w: 230, h: 64, title: "ping-backend", sub: ["live service", "any number of processes"], variant: "accent" });
  o += box({ x: 405, y: 112, w: 230, h: 56, title: "PostgreSQL", sub: ["status · messages · presence rows"], variant: "ext" });
  o += box({ x: 810, y: 44, w: 230, h: 70, title: "Dashboard", sub: ["polls the inbox; heartbeat", "every 30 s while available"] });
  o += edge({ points: [[230, 70], [403, 50]], both: true, label: "messages · updates", at: [316, 50] });
  o += edge({ points: [[808, 70], [637, 50]], both: true, label: "replies · take over · heartbeat", at: [722, 50] });
  o += edge({ points: [[520, 74], [520, 110]], both: true, label: "source of truth", at: [528, 96], anchor: "start" });
  return svg(1040, 172, o, { title: "Live chat by polling" });
}

// What a workspace owns (db/models). Conceptual, not the full schema.
export function dataMap({ svg, box, edge }) {
  let o = "";
  o += box({ x: 0, y: 70, w: 150, h: 56, title: "Workspace", sub: ["plan limits copied", "onto the row"], variant: "accent" });
  o += box({ x: 0, y: 6, w: 150, h: 44, title: "Members", sub: "owner · editor · viewer", variant: "soft" });
  o += box({ x: 0, y: 146, w: 150, h: 44, title: "Plan", sub: "catalogue, set by admins", variant: "soft" });
  o += box({ x: 220, y: 70, w: 150, h: 56, title: "Bot", sub: ["public id bot_…", "settings · appearance"], variant: "accent" });
  const kids = [["Sources", "files, pages, sitemaps"], ["Allowed domains", "with last seen"], ["Team answers", "one Memora source"], ["Shares", "one bot, one person"]];
  kids.forEach(([t, s], i) => {
    o += box({ x: 450, y: 2 + i * 50, w: 170, h: 42, title: t, sub: s });
    o += edge({ points: [[370, 98], [410, 98], [410, 23 + i * 50], [448, 23 + i * 50]] });
  });
  o += box({ x: 690, y: 2, w: 170, h: 42, title: "Visitor", sub: "anonymous id; email optional" });
  o += box({ x: 690, y: 76, w: 170, h: 42, title: "Conversation", sub: "status · outcome · page" });
  o += box({ x: 690, y: 150, w: 170, h: 42, title: "Lead", sub: "email + unanswered question" });
  o += box({ x: 896, y: 76, w: 140, h: 42, title: "Message", sub: "outcome · citations" });
  o += edge({ points: [[150, 98], [218, 98]] });
  o += edge({ points: [[75, 50], [75, 68]], both: true });
  o += edge({ points: [[75, 146], [75, 128]] });
  o += edge({ points: [[775, 44], [775, 74]] });
  o += edge({ points: [[775, 118], [775, 148]] });
  o += edge({ points: [[860, 97], [894, 97]] });
  o += edge({ points: [[295, 126], [295, 204], [672, 204], [672, 23], [688, 23]], label: "visitors on its sites", at: [480, 199] });
  return svg(1040, 212, o, { title: "What a workspace owns" });
}

// Trust boundaries (core/security, access_service, ingestion/crawler.py).
export function trust({ svg, box, edge, zone }) {
  let o = "";
  o += zone({ x: 0, y: 0, w: 230, h: 130, label: "Customer websites" });
  o += zone({ x: 0, y: 145, w: 230, h: 130, label: "Team browsers" });
  o += zone({ x: 0, y: 290, w: 230, h: 120, label: "Pingie staff" });
  o += box({ x: 20, y: 40, w: 190, h: 64, title: "Chat widget", sub: ["anonymous visitors", "Shadow DOM, escaped text"] });
  o += box({ x: 20, y: 185, w: 190, h: 64, title: "Dashboard", sub: ["signed-in team members"] });
  o += box({ x: 20, y: 328, w: 190, h: 58, title: "Admin console", sub: ["allow-listed emails"] });
  o += zone({ x: 262, y: 0, w: 500, h: 410, label: "ping-backend", variant: "trust" });
  o += box({ x: 282, y: 26, w: 230, h: 92, title: "Widget gate", sub: ["Origin on allowed domains", "conversation token · 30 days", "20 messages / min / IP", "monthly quota → 402"], variant: "accent" });
  o += box({ x: 282, y: 170, w: 230, h: 92, title: "Dashboard gate", sub: ["Google ID token verified", "HttpOnly JWT cookie · 7 days", "email must be verified"], variant: "accent" });
  o += box({ x: 282, y: 306, w: 230, h: 84, title: "Admin gate", sub: ["Google + ADMIN_EMAILS", "own signing secret", "8-hour token"], variant: "accent" });
  o += box({ x: 542, y: 170, w: 200, h: 92, title: "Access check", sub: ["membership or share", "no access → 404", "role too low → 403"] });
  o += box({ x: 542, y: 306, w: 200, h: 84, title: "Outbound guard", sub: ["no private or loopback", "addresses · robots.txt", "200 pages · 5 MB · 15 s"] });
  o += box({ x: 542, y: 26, w: 200, h: 92, title: "Answer pipeline", sub: ["scoped to the bot's", "Memora subject only"] });
  o += box({ x: 820, y: 26, w: 216, h: 54, title: "Memora · LLM", sub: "API tokens from server config", variant: "ext" });
  o += box({ x: 820, y: 186, w: 216, h: 54, title: "PostgreSQL", sub: "every bot query joins access", variant: "ext" });
  o += box({ x: 820, y: 320, w: 216, h: 54, title: "Sites being crawled", sub: "public addresses only", variant: "ext" });
  o += edge({ points: [[210, 72], [280, 72]] });
  o += edge({ points: [[210, 217], [280, 217]] });
  o += edge({ points: [[210, 357], [280, 357]] });
  o += edge({ points: [[512, 72], [540, 72]] });
  o += edge({ points: [[512, 216], [540, 216]] });
  o += edge({ points: [[742, 72], [818, 53]] });
  o += edge({ points: [[742, 216], [818, 213]] });
  o += edge({ points: [[742, 348], [818, 347]] });
  o += edge({ points: [[642, 262], [642, 304]], variant: "dash" });
  return svg(1040, 414, o, { title: "Trust boundaries" });
}
