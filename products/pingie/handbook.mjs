// Pingie product handbook: content and page order.
//
// Evidence baseline: the ping repository, main @ 1e01ad8 (2026-10-20).
// Screenshots come from the product brief ("Pingie: AI Customer Support for
// Your Website") and show a newer build than that commit. Anything the brief
// describes that the code does not contain is marked status "brief".

import icons from "./icons.mjs";
import * as fig from "./diagrams.mjs";

const SHOT = "assets/screens";
const briefShot = "Screenshot from the product brief; it may show a newer build than the repository.";

export default {
  product: {
    name: "Pingie",
    mark: "P",
    handbookTitle: "Product Handbook",
    footer: "Pingie Product Handbook · evidence: ping repository @ 1e01ad8",
  },
  theme: "theme.css",
  icons,
  statuses: {
    brief: { label: "In brief only", cls: "ghost", note: "Described in the product brief; not found in this repository." },
  },
  sections: [
    { id: "overview", title: "Product overview" },
    { id: "capabilities", title: "Capabilities" },
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
        title: "AI customer support that answers <em>only from what you teach it.</em>",
        subtitle: "What Pingie is, who it serves, what it does, and how its parts fit together: a visual guide for product, support and engineering readers.",
        tag: "October 2026",
        visual: c.chatMock({
          title: "Acme Help",
          status: "Typically replies instantly",
          messages: [
            { from: "visitor", text: "Can I get a refund on an annual plan?" },
            { from: "bot", meta: "Assistant", text: "Yes. Annual plans can be refunded within 30 days of purchase.", sources: ["refund-policy.docx"], actions: `${c.icon("thumbUp", 12)} ${c.icon("thumbDown", 12)}` },
            { from: "visitor", text: "Do you ship to Iceland?" },
            { from: "bot", meta: "Assistant", text: "I don't have that information. Leave your email and the team will follow up.", actions: `<span class="btn">Talk to a person</span>` },
          ],
          footer: "<span>Ask a question…</span><span>Powered by Pingie</span>",
        }),
        meta: [
          ["Product", "Pingie · AI support chatbot SaaS"],
          ["Evidence", "ping repository, main @ 1e01ad8"],
          ["Audience", "Product, support and engineering"],
          ["Example chat", "Illustrative, built from the widget's design"],
        ],
      }),
    },

    { kind: "contents", title: "Contents", kicker: "Handbook", lede: "Nine sections, from what Pingie is to how it is built. Each page covers one idea." },

    /* ------------------------------------------------------------ 1 Overview */
    {
      section: "overview",
      title: "What Pingie is",
      lede: "Pingie puts an AI support assistant on a business's website. The business teaches it with its own files, pages and written answers. The assistant answers visitors only from that material, shows its sources, and says so when it doesn't know. The support team sees every chat in one dashboard and can take over any conversation.",
      body: (c) => `
        <div class="row grow">
          <div class="col grow" style="flex:1.35">
            <div class="grid g2">
              ${c.featureCard({ icon: "knowledge", title: "Answers from your content", summary: "Files, web pages, sitemaps and team-written answers are the only knowledge the assistant uses." })}
              ${c.featureCard({ icon: "link", title: "Sources on every answer", summary: "Only the passages an answer actually cites become source chips under the reply." })}
              ${c.featureCard({ icon: "user", title: "Honest fallback, human handoff", summary: "When nothing relevant is found, it says so and offers a person or takes the visitor's email." })}
              ${c.featureCard({ icon: "overview", title: "One dashboard for the team", summary: "Knowledge, conversations, live chat, analytics, appearance and team access in one place." })}
            </div>
            ${c.takeaway("Pingie trades breadth for trust: it would rather say “I don't know” than answer from outside the business's own material.")}
          </div>
          <div class="col" style="flex:1">
            ${c.panel({ title: "Four steps", hint: "from the product brief", body: c.steps([
              { title: "Teach", text: "Upload files, add pages or a sitemap, write team answers." },
              { title: "Install", text: "One script tag, limited to allowed domains." },
              { title: "Answer", text: "Retrieve passages, write a short cited reply." },
              { title: "Improve", text: "Review chats, teach missed answers." },
            ], { vertical: true }) })}
          </div>
        </div>`,
    },
    {
      section: "overview",
      title: "Who it serves and what it solves",
      lede: "Small and growing businesses whose support or marketing staff are mostly non-technical. The design goal is a live bot within ten minutes of signing up.",
      body: (c) => `
        <div class="row grow">
          <div class="col grow" style="flex:1.5">
            <span class="label">Problem → how Pingie responds</span>
            ${[
              ["clock", "Visitors wait hours for an email reply.", "Answers stream word by word within seconds, around the clock, from the business's own content."],
              ["refresh", "The team answers the same questions again and again.", "Common questions are answered automatically. An answer taught once is reused word for word."],
              ["help", "Questions the bot can't answer get lost.", "Each one becomes a lead, a live handoff, or a knowledge gap listed on the Overview page."],
            ].map(([ic, p, r]) => `
              <div class="row" style="align-items:stretch">
                <div class="card" style="flex:1"><div class="card-top">${c.iconTile(ic, { plain: true })}<span class="label">Problem</span></div><p style="color:var(--text-2);font-size:13px">${p}</p></div>
                <div style="display:flex;align-items:center;color:var(--accent-soft)">${c.icon("send", 16)}</div>
                <div class="card accent" style="flex:1.3"><span class="label" style="color:var(--accent-soft)">Response</span><p style="color:var(--text);font-size:13px">${r}</p></div>
              </div>`).join("")}
          </div>
          <div class="col" style="flex:1">
            ${c.panel({ title: "Who uses which part", body: c.matrix({
              columns: [{ label: "Uses" }],
              rows: [
                { head: "Website visitors", cells: ["Chat widget"] },
                { head: "Support team", cells: ["Dashboard: owner, editor or viewer"] },
                { head: "Pingie team", cells: ["Admin console: plans and workspaces"] },
                { head: "Everyone", cells: ["Documentation site and API reference"] },
              ],
            }) })}
            ${c.panel({ title: "How to read this handbook", body: `<p class="small muted">Every capability carries a status. Status reflects the code in the ping repository (main @ 1e01ad8, 20 Oct 2026). Screenshots come from the product brief and can show a newer build.</p>${c.statusLegend(["implemented", "partial", "brief"])}` })}
          </div>
        </div>`,
    },

    /* ------------------------------------------------------------ 2 Capabilities */
    {
      section: "capabilities",
      layout: "cards",
      title: "Capability map",
      lede: "Everything Pingie does, grouped the way the dashboard groups it. Status shows what the repository implements today.",
      body: (c) => c.cardGrid([
        { icon: "conversations", title: "Chat widget", summary: "One-file widget with streamed answers, source chips, suggestions, feedback and memory across pages.", status: "implemented" },
        { icon: "knowledge", title: "Knowledge sources", summary: "Files up to 25 MB, single pages, sitemaps up to 200 pages, and team answers.", status: "implemented" },
        { icon: "check", title: "Grounded answers", summary: "Similarity floor, cited passages, partial and fallback outcomes, no general-knowledge answers.", status: "implemented" },
        { icon: "filter", title: "Conversations inbox", summary: "Filters, search, full transcripts with outcomes and citations, leads and CSV export.", status: "implemented" },
        { icon: "users", title: "Live chat & handoff", summary: "Visitors ask for a person; available agents are alerted, take over and hand back.", status: "implemented" },
        { icon: "spark", title: "Teach the bot", summary: "Answers written from the inbox join the “Team answers” source and are sent word for word.", status: "implemented" },
        { icon: "layers", title: "Chat memory", summary: "Finished chats a teammate answered are scrubbed and added to retrieval automatically.", status: "partial" },
        { icon: "chart", title: "Insights", summary: "KPIs with period comparison, trends, outcomes, top pages, top questions and knowledge gaps.", status: "implemented" },
        { icon: "appearance", title: "Appearance", summary: "Title, welcome text, suggestions, accent colour, theme, launcher icon, position and badge.", status: "implemented" },
        { icon: "install", title: "Install & domains", summary: "Snippets for HTML, React, Next.js and WordPress; allowed-domain list; install check; JS API.", status: "implemented" },
        { icon: "shield", title: "Teams & sharing", summary: "Workspaces with owner, editor and viewer roles, invitations, and single-bot sharing.", status: "implemented" },
        { icon: "settings", title: "Plans & admin", summary: "Plans stored in the database, enforced as limits, managed from the admin console.", status: "implemented" },
      ], 4),
    },

    /* ------------------------------------------------------------ 3 Features */
    {
      section: "features",
      title: "The chat widget",
      lede: "What visitors see: a small chat window opened from a corner button. It is one script, about 10 kB gzipped, rendered in a Shadow DOM so the site's styles and the widget's never mix.",
      body: (c) => `
        <div class="row grow">
          <div style="width:62mm;flex:none">${c.screenshot({ src: `${SHOT}/widget-live.png`, alt: "Widget during a live chat with the satisfaction prompt open", caption: "widget · live chat", pins: [{ x: 31, y: 7 }, { x: 69, y: 6 }, { x: 15, y: 13 }, { x: 50, y: 22 }, { x: 30, y: 36 }, { x: 50, y: 66 }] })}
            <p class="shot-note" style="margin-top:6px">${briefShot}</p></div>
          <div class="col" style="width:68mm;flex:none">${c.callouts([
            { title: "Who is answering", text: "The header shows the agent's name during a live chat." },
            { title: "End or restart", text: "Visitors can start a new conversation." },
            { title: "Thumbs up / down", text: "On every answer; dislikes feed the inbox filter." },
            { title: "Handoff notice", text: "“Connecting you with a person…” while waiting." },
            { title: "Agent reply", text: "Team messages are labelled and styled apart from the bot." },
            { title: "Satisfaction survey", text: "Rate the chat on ending it.", status: "brief" },
          ])}</div>
          <div class="col grow">
            ${c.panel({ title: "Behaviour", body: c.bullets([
              { text: "<b>Streamed answers</b> appear word by word, with escaped Markdown.", status: "implemented" },
              { text: "<b>Source chips</b> under answers; web sources link to the page.", status: "implemented" },
              { text: "<b>Up to 4 suggested questions</b> until the first message.", status: "implemented" },
              { text: "<b>Talk to a person</b> when a teammate is available; email capture otherwise.", status: "implemented" },
              { text: "<b>Remembers the chat</b> for 7 days across page loads.", status: "implemented" },
              { text: "<b>Full screen</b> at 480 px wide or less; Esc closes.", status: "implemented" },
              { text: "<b>Help Center</b> articles inside the widget.", status: "brief" },
            ]) })}
            ${c.limitBox("If the bot is unknown, the domain isn't allowed or the API is unreachable, the widget stays hidden and logs one console warning. It never breaks the host page.", "Failure mode")}
          </div>
        </div>`,
    },
    {
      section: "features",
      title: "Knowledge: teaching the bot",
      lede: "A bot can answer only from its sources. The Sources page adds them, shows their indexing status and keeps them fresh.",
      body: (c) => `
        <div class="row grow">
          <div class="col" style="flex:1.3">
            ${c.screenshot({ src: `${SHOT}/sources.png`, alt: "Sources page", caption: "dashboard · knowledge · sources", pins: [{ x: 21, y: 30 }, { x: 21, y: 55 }, { x: 87, y: 44 }, { x: 37, y: 87 }, { x: 88, y: 94 }, { x: 75, y: 84 }] })}
            <p class="shot-note">${briefShot}</p>
            ${c.figure({ title: "Source status", svg: fig.sourceLifecycle(c.d), height: "31mm" })}
          </div>
          <div class="col" style="flex:1">${c.callouts([
            { title: "Health at a glance", text: "Sources ready, chunks indexed, indexing now, last sync." },
            { title: "Upload files", text: "PDF, DOCX, TXT, MD, CSV, up to 25 MB each." },
            { title: "Single page or sitemap", text: "Sitemaps become child pages, crawled four at a time." },
            { title: "Status per source", text: "Queued, indexing, ready, or failed with the error." },
            { title: "Re-sync or edit", text: "Fetch a page again or edit team answers." },
            { title: "Help Center column", text: "Publishing sources as help articles.", status: "brief" },
          ])}
            ${c.takeaway("Files go straight to Memora. Pages are fetched, cleaned to Markdown and indexed. A sweeper refreshes status every 20 seconds.", "How it behaves")}
          </div>
        </div>`,
    },
    {
      section: "features",
      title: "Answers you can trust",
      lede: "Pingie is built to avoid made-up answers. Every reply gets an outcome that says how well the sources supported it.",
      body: (c) => `
        <span class="label">Every bot reply is tagged with one outcome</span>
        <div class="grid g3">
          ${c.featureCard({ title: "<code>answered</code>", summary: "Answered from the sources. Only the passages it cites become source chips." })}
          ${c.featureCard({ title: "<code>partial</code>", summary: "Part of the question was covered; the reply says what is missing." })}
          ${c.featureCard({ title: "<code>fallback</code>", summary: "Nothing relevant was found, so the bot shows its fallback message instead of guessing." })}
          ${c.featureCard({ title: "<code>smalltalk</code>", summary: "Greetings and thanks get a short reply without searching or calling the model." })}
          ${c.featureCard({ title: "<code>lead</code>", summary: "The visitor left an email after a fallback; the team is notified." })}
          ${c.featureCard({ title: "<code>offline</code>", summary: "The bot is paused and replies with its offline message." })}
        </div>
        <div class="row grow">
          <div style="flex:1.25">${c.matrix({
            firstLabel: "Setting",
            columns: [{ label: "Effect" }, { label: "Status" }],
            rows: [
              { head: "Similarity threshold", cells: ["Passages below it (default 0.30) are dropped before the model sees them.", c.status("implemented")] },
              { head: "Tone · reply language", cells: ["Friendly, professional or concise; auto, English, Hindi or Tamil.", c.status("implemented")] },
              { head: "Model tier", cells: ["Fast, balanced or best, limited by plan.", c.status("implemented")] },
              { head: "Strictness presets · blocked topics", cells: ["Strict / Balanced / Helpful modes; refusing named topics.", c.status("brief")] },
            ],
          })}</div>
          <div class="col" style="flex:1">
            ${c.takeaway("The model never answers from general knowledge: if the passages don't cover a request, it must reply NO_ANSWER and the visitor sees the fallback.")}
            ${c.limitBox("Off-topic questions are declined because nothing in the sources matches them, not by a separate topic filter.", "Scope note")}
          </div>
        </div>`,
    },
    {
      section: "features",
      title: "Conversations inbox",
      lede: "Every chat is saved with its outcomes, sources and feedback. The inbox is where the team reviews the bot, replies live, and turns misses into knowledge.",
      body: (c) => `
        <div class="row grow">
          <div style="flex:1.6">${c.screenshot({ src: `${SHOT}/conversations.png`, alt: "Conversations inbox", caption: "dashboard · conversations", pins: [{ x: 18.5, y: 27.5 }, { x: 31, y: 37.5 }, { x: 65, y: 19 }, { x: 85, y: 19 }, { x: 44, y: 54 }, { x: 52, y: 86.5 }, { x: 87, y: 8 }] })}
            <p class="shot-note" style="margin-top:6px">${briefShot}</p></div>
          <div class="col" style="flex:1">${c.callouts([
            { title: "Filters and search", text: "All, Live, Unanswered, Disliked, Handoffs. Search covers text, name and email." },
            { title: "Status and outcome badges", text: "Who is on the chat and its worst answer outcome." },
            { title: "Save as knowledge", text: "Turn this chat into a team answer or summary." },
            { title: "Hand back · End chat", text: "Return the chat to the bot, or close it." },
            { title: "Teach from a message", text: "Under fallbacks and dislikes: write the right answer once." },
            { title: "Reply box", text: "Enter sends; the visitor sees it within seconds. Saved replies (“/”) are brief-only.", status: "partial" },
            { title: "Export CSV", text: "One row per message for the whole bot." },
          ])}
          ${c.limitBox(["<b>Unhappy</b> needs satisfaction ratings, which the repository lacks.", "Leads live under <b>Handoffs</b>; there is no leads screen."])}
          </div>
        </div>`,
    },
    {
      section: "features",
      title: "Live chat and human handoff",
      lede: "When a visitor needs a person, an available teammate takes the chat in the dashboard. No websocket server is involved: state lives in PostgreSQL.",
      body: (c) => `
        ${c.figure({ title: "Conversation status", hint: "live_service.py", svg: fig.liveStates(c.d), height: "62mm" })}
        <div class="row grow">
          <div class="col" style="flex:1">${c.panel({ title: "Being available", body: c.bullets([
            "Switch on <b>Available for live chat</b> from <b>Live</b> in the top bar.",
            "An open tab checks in every 30 s; you count as away 75 s after the last check-in.",
            "Owners, editors and editor shares can reply. Viewers can only read.",
          ]) })}</div>
          <div class="col" style="flex:1">${c.panel({ title: "Alerts when a visitor waits", body: c.bullets([
            { text: "Browser notification and chime; amber <b>Live</b> count; count in the tab title.", status: "implemented" },
            { text: "Missed chats email the bot's handoff address.", status: "implemented" },
            { text: "Slack and webhook alerts.", status: "brief" },
          ]) })}</div>
          <div class="col" style="flex:1">${c.panel({ title: "Not in this repository", body: c.bullets([
            { text: "Business hours with “back at …” messages.", status: "brief" },
            { text: "Handoff styles: immediate, button first, bot first.", status: "brief" },
            { text: "Saved replies inserted with “/”.", status: "brief" },
          ]) })}</div>
        </div>`,
    },
    {
      section: "features",
      title: "Learning from conversations",
      lede: "Two paths turn real chats into knowledge: an answer a teammate writes on purpose, and the automatic memory of chats the team handled.",
      body: (c) => `
        ${c.panel({ title: "Teach the bot", hint: "answer_service.py · implemented", body: c.steps([
          { title: "Spot a miss", text: "A fallback or thumbs-down answer in a transcript." },
          { title: "Write the answer", text: "The question is pre-filled; write it as the bot should say it." },
          { title: "Re-index", text: "All team answers are rebuilt into one source and pushed to Memora." },
          { title: "Answer verbatim", text: "When “Team answers” ranks first and the question matches, the bot sends it word for word." },
        ]) })}
        ${c.panel({ title: "Chat memory", hint: "memory_service.py · partial", body: c.steps([
          { title: "Team replies", text: "A teammate answered in the chat." },
          { title: "Chat finishes", text: "Closed, or idle for 30 minutes with nobody live." },
          { title: "Scrub", text: "Only team replies are kept; emails and phone numbers are removed." },
          { title: "Remember", text: "Pushed to Memora as a past conversation for future retrieval." },
        ]) })}
        <div class="row">
          <div style="flex:1">${c.takeaway("Team answers can also be shared with other bots in the same workspace, and count as one source on the plan.")}</div>
          <div style="flex:1">${c.limitBox("Chat memory is automatic and on by default. The brief's manual and review-before-adding modes are not in this repository.", "Partial")}</div>
        </div>`,
    },
    {
      section: "features",
      title: "Insights and analytics",
      lede: "The Overview page shows how the bot is doing over 24 hours, 7, 30 or 90 days, compared with the previous period.",
      body: (c) => `
        <div class="row grow">
          <div style="flex:1.55">${c.screenshot({ src: `${SHOT}/overview.png`, alt: "Overview analytics page", caption: "dashboard · overview", pins: [{ x: 84, y: 15 }, { x: 23, y: 33 }, { x: 42, y: 33 }, { x: 45, y: 78 }, { x: 83, y: 71 }, { x: 8, y: 42 }] })}
            <p class="shot-note" style="margin-top:6px">${briefShot}</p></div>
          <div class="col" style="flex:1">${c.callouts([
            { title: "Range picker", text: "24h, 7d, 30d or 90d, with deltas against the previous period." },
            { title: "Eight KPIs", text: "Conversations, resolution rate, first response, sources ready, visitors, thumbs down, handoffs to email, messages." },
            { title: "Satisfaction KPI", text: "Shown in the brief's build; this repository shows Messages here.", status: "brief" },
            { title: "Trend chart", text: "Conversations and unanswered ones per day or hour." },
            { title: "Answer outcomes", text: "Share of answered, partial and fallback replies." },
            { title: "Bot navigation", text: "Bot, Knowledge, Widget and Manage groups." },
          ])}
          ${c.panel({ title: "Below the fold", body: c.bullets(["Messages per day, top pages", "<b>Knowledge gaps</b>: questions that keep falling back", "<b>Top questions</b> with resolution rate and source"]) })}
          </div>
        </div>`,
    },
    {
      section: "features",
      title: "Appearance and installation",
      lede: "The widget is styled from the dashboard with a live preview, then installed with one script tag that only loads on allowed domains.",
      body: (c) => `
        <div class="row grow">
          <div style="flex:1.45">${c.screenshot({ src: `${SHOT}/install.png`, alt: "Install and embed page", caption: "dashboard · widget · install & embed", pins: [{ x: 18.5, y: 34 }, { x: 22, y: 51 }, { x: 22, y: 64 }, { x: 86, y: 60 }, { x: 20.5, y: 84 }, { x: 1.6, y: 66 }] })}
            <div class="col" style="margin-top:10px">${c.matrix({ firstLabel: "Allowed domain entry", columns: [{ label: "Matches" }], rows: [
              { head: "<code>help.acme.com</code>", cells: ["Exactly that host"] },
              { head: "<code>*.acme.com</code>", cells: ["acme.com and every subdomain"] },
              { head: "<b>Allow localhost</b>", cells: ["localhost for testing; drafts run only there"] },
            ] })}</div>
          </div>
          <div class="col" style="flex:1">${c.callouts([
            { title: "Add your domain", text: "The widget refuses to load anywhere else." },
            { title: "Platform snippets", text: "HTML, React, Next.js and WordPress." },
            { title: "One script tag", text: "<code>data-bot-id</code>, optional <code>data-api</code> and <code>data-open</code>." },
            { title: "Copy", text: "Paste before <code>&lt;/body&gt;</code>." },
            { title: "Verify installation", text: "Shows the last host that loaded the widget." },
            { title: "Allowed domains", text: "Hostnames with when each last loaded the widget." },
          ])}
          ${c.panel({ title: "Appearance options", body: c.bullets([
            { text: "Title, welcome, placeholder, 4 suggestions, accent, theme, launcher icon, side, sources, badge.", status: "implemented" },
            { text: "Layouts, gradient headers, logo, fonts, bubble styles.", status: "brief" },
          ]) })}
          </div>
        </div>`,
    },
    {
      section: "features",
      title: "Teams, roles and sharing",
      lede: "Each business works in its own workspace. People join the whole workspace, or get access to one bot. Only owners manage people.",
      body: (c) => `
        <div class="row grow">
          <div class="col" style="flex:1.35">
            <span class="label">Permission matrix</span>
            ${c.matrix({
              columns: [{ label: "Owner", hl: true }, { label: "Editor" }, { label: "Viewer" }],
              rows: [
                { head: "Read overview, chats, sources, test retrieval", cells: [true, true, true] },
                { head: "Change settings, knowledge, appearance, domains", cells: [true, true, false] },
                { head: "Reply in live chat, take over", cells: [true, true, false] },
                { head: "Create bots in the workspace", cells: [true, true, false] },
                { head: "Delete bots, clear history, rename workspace", cells: [true, false, false] },
                { head: "Invite, change roles, remove people, share bots", cells: [true, false, false] },
              ],
            })}
            ${c.takeaway("Removing someone or lowering their role takes effect on their next request: roles are read from the database every time.")}
          </div>
          <div class="col" style="flex:1">
            ${c.matrix({
              firstLabel: "",
              columns: [{ label: "Workspace member" }, { label: "Shared bot" }],
              rows: [
                { head: "Access to", cells: ["Every bot", "One bot"] },
                { head: "Shows in", cells: ["Workspace switcher", "Shared with me"] },
                { head: "Counts against", cells: ["Member seats", "People per shared bot"] },
                { head: "Roles", cells: ["Editor · viewer", "Editor · viewer"] },
              ],
            })}
            ${c.panel({ title: "Invitations", body: c.bullets([
              "Valid for 7 days; emailed when SMTP is set up, or copied as a link.",
              "Accepting needs Google sign-in with the <b>invited email</b>.",
              "Only a SHA-256 hash of the token is stored.",
            ]) })}
          </div>
        </div>`,
    },
    {
      section: "features",
      title: "Plans and limits",
      lede: "Plans live in the database and are edited in the admin console, so prices and limits change without a deploy. Upgrades are handled by email.",
      body: (c) => `
        ${c.matrix({
          columns: [{ label: "Free" }, { label: "Pro", hl: true }, { label: "Enterprise" }],
          rows: [
            { head: "Price", cells: ["$0", "$49 / month", "Custom"] },
            { head: "Messages per month", cells: ["100", "100,000", "Unlimited"] },
            { head: "Bots", cells: ["3", "10", "Unlimited"] },
            { head: "Sources per bot", cells: ["5", "25", "Unlimited"] },
            { head: "Workspace members", cells: ["1", "5", "Unlimited"] },
            { head: "People per shared bot", cells: ["3", "Unlimited", "Unlimited"] },
            { head: "Model tiers", cells: ["Fast", "Fast, Balanced", "Fast, Balanced, Best"] },
            { head: "Remove “Powered by Pingie”", cells: [false, true, true] },
          ],
        })}
        <div class="row">
          <div style="flex:1.3">${c.panel({ title: "At a limit", body: c.bullets([
            "Monthly messages: the widget stops answering and the API returns <code>402 quota_exceeded</code>.",
            "Bots, sources, members: the action is refused with an upgrade message.",
            "Model tier outside the plan: disabled in settings; <code>402 plan_restriction</code>.",
          ]) })}</div>
          <div style="flex:1">${c.limitBox(["No self-serve payment: customers email support@pingie.app and an admin changes the plan.", "Values shown are the documented defaults; the live catalogue can differ."])}</div>
        </div>`,
    },

    /* ------------------------------------------------------------ 4 Workflows */
    {
      section: "workflows",
      title: "Getting started",
      lede: "From sign-in to a live bot. The new-bot wizard covers the first three steps; the rest happen on the bot's own pages.",
      body: (c) => `
        ${c.steps([
          { title: "Sign in", text: "Google sign-in creates a personal workspace." },
          { title: "Create a bot", text: "Name and website; the site becomes an allowed domain." },
          { title: "Add knowledge", text: "Crawl a sitemap, upload files, or skip for now." },
          { title: "Test", text: "Test retrieval shows passages, scores and the answer." },
          { title: "Customise", text: "Tone, instructions, appearance and fallback." },
          { title: "Install & go live", text: "Paste the snippet, then switch the bot to Live." },
        ])}
        <span class="label">A bot is always in one of three states</span>
        <div class="grid g3">
          ${c.featureCard({ icon: "edit", title: "Draft", summary: "Loads only on localhost with Allow localhost on. New bots start here." })}
          ${c.featureCard({ icon: "play", title: "Live", summary: "Loads on allowed domains and answers visitors.", variant: "accent" })}
          ${c.featureCard({ icon: "pause", title: "Paused", summary: "Shows Offline; every message gets the offline message." })}
        </div>
        ${c.takeaway("Test retrieval runs the same search the bot runs, without saving anything: use it before going live.")}`,
    },
    {
      section: "workflows",
      title: "Who answers a visitor's message",
      lede: "Before any search, the backend checks the conversation's state in a fixed order. The first check that matches decides the reply.",
      body: (c) => `
        ${c.figure({ title: "Message routing", hint: "chat_service.begin() · down: yes · right: no", svg: fig.routing(c.d), height: "62mm" })}
        <div class="grid g3">
          ${c.featureCard({ icon: "user", title: "Asking twice is deliberate", summary: "The first “talk to a person” gets a normal answer, so a taught reply can help. Asking again starts the handover." })}
          ${c.featureCard({ icon: "clock", title: "Waiting has a deadline", summary: "If nobody joins within 2 minutes, the chat returns to the bot, which asks for an email." })}
          ${c.featureCard({ icon: "bolt", title: "Repeat questions are cached", summary: "A chat's first question with unchanged knowledge reuses the earlier answer." })}
        </div>`,
    },

    /* ------------------------------------------------------------ 5 Architecture */
    {
      section: "architecture",
      title: "System map",
      lede: "Five apps in one repository and three outside services. Every request enters the backend through one of three doors, each with its own authentication.",
      body: (c) => `
        ${c.figure({ title: "Pingie system map", hint: "left: people · centre: ping-backend · right, dashed: outside the repository", svg: fig.architecture(c.d), height: "98mm" })}
        <div class="row">
          <div style="flex:1">${c.takeaway("Memora finds passages; Pingie decides what to say. Memora never writes Pingie's answers.")}</div>
          <div style="flex:1">${c.limitBox("Crawls, status refresh and rate limiting run inside the API process. With several workers they need a queue and Redis.", "Known limit")}</div>
        </div>`,
    },
    {
      section: "architecture",
      layout: "cards",
      title: "Component responsibilities",
      lede: "What each part owns. Apps in the repository first, then the services Pingie depends on.",
      body: (c) => `
        <div class="grid g4">
          ${c.responsibility({ icon: "server", name: "ping-backend", who: "API · Python", text: "Auth, workspaces, bots, ingestion, the answer pipeline, inbox, live chat, sharing and plans. Also serves widget.js.", stack: "FastAPI · SQLAlchemy 2 · Alembic" })}
          ${c.responsibility({ icon: "overview", name: "ping-frontend", who: "Dashboard", text: "The support team's app. Calls the API through its own origin, so the session cookie stays first-party.", stack: "Next.js 16 · React 19 · CSS modules" })}
          ${c.responsibility({ icon: "conversations", name: "ping-widget", who: "Embeddable", text: "The visitor chat: one dependency-free file in a Shadow DOM, with a small JS API.", stack: "TypeScript · Vite · IIFE" })}
          ${c.responsibility({ icon: "settings", name: "ping-admin", who: "Internal", text: "Pingie staff manage plans and workspaces, including custom limits, without SQL.", stack: "Next.js 16" })}
          ${c.responsibility({ icon: "book", name: "ping-doc", who: "Docs", text: "Customer guides, how Pingie works, and an API reference generated from the backend's OpenAPI schema.", stack: "Next.js 16 · Markdown" })}
          ${c.responsibility({ icon: "test", name: "Memora", who: "External · retrieval", text: "Extracts, chunks, embeds and searches. Each bot is a subject; each source a Memora source.", stack: "HNSW · MMR · rerank" })}
          ${c.responsibility({ icon: "spark", name: "LLM provider", who: "External · generation", text: "Writes answers per model tier. VizhiOps by default, logging cost and latency; Nebius or build.nvidia direct.", stack: "OpenAI-compatible, streamed" })}
          ${c.responsibility({ icon: "database", name: "PostgreSQL (Neon)", who: "External · state", text: "Users, workspaces, bots, sources, chats, messages, leads, plans, and live-chat state.", stack: "psycopg 3" })}
        </div>
        <div class="row">
          <div style="flex:1">${c.responsibility({ icon: "refresh", name: "Background sweeper", who: "Inside the backend", text: "Every 20 seconds: refreshes indexing status, expires waiting handoffs and pushes finished chats to chat memory." })}</div>
          <div style="flex:1">${c.responsibility({ icon: "check", name: "Tests", who: "ping-backend/tests", text: "pytest unit and integration tests with in-memory fakes of Memora and the LLM gateway. Integration tests need a throwaway PostgreSQL." })}</div>
        </div>`,
    },
    {
      section: "architecture",
      layout: "editorial",
      title: "How an answer is made",
      lede: "Retrieval and reasoning are separate. Memora returns candidate passages; Pingie's pipeline decides whether they are good enough, writes the answer, then checks it.",
      body: (c) => `
        <div class="col">
          ${c.explain({
            purpose: "Answer only when the business's content supports it.",
            behavior: "Weak passages are dropped before the model sees them. The model must cite [n] or reply NO_ANSWER.",
            value: "Fallbacks are measurable, so gaps show up on Overview.",
            limits: "Answers are capped at 700 tokens at temperature 0.2.",
          })}
          ${c.panel({ title: "Recorded per reply", body: `<p class="small muted">Outcome, cited passages, a trace (standalone query, scores, kept passages, timings), latency, time to first token, tokens and model.</p>` })}
        </div>
        ${c.figure({ title: "Answer pipeline", hint: "app/reasoning/", svg: fig.pipeline(c.d), height: "118mm" })}`,
    },
    {
      section: "architecture",
      title: "Sequence: a visitor asks a question",
      lede: "The services behind one streamed answer. Shortcuts return before the knowledge base is touched.",
      body: (c) => c.figure({ title: "A visitor asks a question", hint: "routes/widget.py → chat_service → reasoning", svg: fig.askSequence(c.d), height: "126mm" }),
    },

    /* ------------------------------------------------------------ 6 Data */
    {
      section: "data",
      title: "How information moves",
      lede: "Two flows matter most: knowledge going into Memora, and live-chat messages moving between widget and dashboard through the database.",
      body: (c) => `
        ${c.figure({ title: "Knowledge ingestion", hint: "source_service · crawler · memory_service", svg: fig.ingestion(c.d), height: "66mm" })}
        ${c.figure({ title: "Live chat by polling", hint: "no websocket server", svg: fig.livePolling(c.d), height: "44mm" })}`,
    },
    {
      section: "data",
      title: "What a workspace owns, and who Pingie talks to",
      lede: "A conceptual view of stored data, not the full schema, and the outside services each with its role.",
      body: (c) => `
        ${c.figure({ title: "What a workspace owns", hint: "app/db/models", svg: fig.dataMap(c.d), height: "62mm" })}
        <div class="grid g5">
          ${c.featureCard({ icon: "test", title: "Memora", summary: "Retrieval only: called with generate=false, returns ranked passages with file names." })}
          ${c.featureCard({ icon: "spark", title: "VizhiOps / LLM", summary: "One model token per tier. Gateway logs link to each reply." })}
          ${c.featureCard({ icon: "database", title: "PostgreSQL", summary: "All state, including live-chat status and presence." })}
          ${c.featureCard({ icon: "key", title: "Google Sign-In", summary: "The only sign-in, for the dashboard and admin console." })}
          ${c.featureCard({ icon: "mail", title: "SMTP", summary: "Lead, missed-chat and invite emails, only when configured." })}
        </div>`,
    },

    /* ------------------------------------------------------------ 7 Security */
    {
      section: "security",
      title: "Trust boundaries",
      lede: "Three kinds of caller reach the backend, and each passes a different gate. The widget can't hold a session, so the page's Origin plus a signed per-conversation token stand in for one.",
      body: (c) => `
        ${c.figure({ title: "Trust boundaries", svg: fig.trust(c.d), height: "96mm" })}
        <div class="row">
          <div style="flex:1">${c.takeaway("Outsiders get 404, not 403, so they can't learn which bot IDs exist.")}</div>
          <div style="flex:1">${c.limitBox("Origin checks stop other websites, not scripts that forge headers. Rate limits and monthly quotas bound the cost.", "Known limit")}</div>
        </div>`,
    },
    {
      section: "security",
      title: "Security controls and stored data",
      lede: "Controls verified in the backend, followed by what Pingie keeps and why.",
      body: (c) => `
        <div class="grid g4">
          ${c.featureCard({ icon: "key", title: "Google-only sign-in", summary: "Token checked for Pingie's client ID and a verified email; HttpOnly, SameSite=Lax cookie.", status: "implemented" })}
          ${c.featureCard({ icon: "shield", title: "Workspace isolation", summary: "Every bot route joins membership or a share; an ID in the URL is never trusted alone.", status: "implemented" })}
          ${c.featureCard({ icon: "globe", title: "SSRF-safe crawling", summary: "Private, loopback and link-local addresses refused; robots.txt honoured.", status: "implemented" })}
          ${c.featureCard({ icon: "file", title: "Formula-safe CSV export", summary: "Escaping cells that start with = + - @.", status: "brief" })}
        </div>
        ${c.matrix({
          firstLabel: "Data",
          columns: [{ label: "Why it is kept" }, { label: "Note" }],
          rows: [
            { head: "Team members' Google name, email, avatar", cells: ["Sign-in and team features", "—"] },
            { head: "Sources", cells: ["Answering", "Text and embeddings in Memora; deleted with the source or bot"] },
            { head: "Conversations and messages", cells: ["Inbox, analytics, live chat", "Owners can clear a bot's history"] },
            { head: "Visitors", cells: ["Continuity across visits", "Anonymous ID; email or name only if given or set by the site"] },
            { head: "Leads", cells: ["Follow-up", "Email and the unanswered question"] },
          ],
        })}`,
    },

    /* ------------------------------------------------------------ 8 Scope */
    {
      section: "scope",
      layout: "cards",
      title: "What is built, partial, or only described",
      lede: "The product brief describes more than the repository contains. This page lists every difference found while verifying the brief against the code.",
      body: (c) => `
        ${c.scope([
          { status: "implemented", title: "In the repository", items: [
            { text: "Widget, knowledge, grounded answers", note: "files, pages, sitemaps, team answers" },
            { text: "Inbox, leads via Handoffs, CSV export" },
            { text: "Live chat, presence, browser alerts", note: "polling, 2-minute handoff wait" },
            { text: "Overview analytics and knowledge gaps" },
            { text: "Roles, invitations, bot sharing" },
            { text: "Plans, quotas, admin console" },
          ] },
          { status: "partial", title: "Narrower than the brief", items: [
            { text: "Chat memory", note: "automatic only; no manual or review mode" },
            { text: "Alerts", note: "browser and email; no Slack or webhooks" },
            { text: "Stay on topic", note: "by grounding; no topic list" },
            { text: "Leads list", note: "under the Handoffs filter, not its own screen" },
          ] },
          { status: "brief", title: "Not found in the repository", items: [
            { text: "Help Center inside the widget" },
            { text: "Satisfaction survey and Unhappy filter" },
            { text: "Business hours and handoff styles" },
            { text: "Saved replies" },
            { text: "Strictness presets and blocked topics" },
            { text: "Advanced widget design options" },
            { text: "Answer-quality evaluation suite", note: "pytest tests exist; no eval dataset" },
            { text: "Formula-safe CSV export" },
          ] },
        ])}
        ${c.limitBox(["Background work (crawls, status sweeps, rate limits) is in-process; scaling out needs a queue and Redis.", "Self-serve billing does not exist; plan changes are manual.", "The screenshots suggest a newer build exists. Re-verify these statuses against it and update one field per item in handbook.mjs."], "Technical limits and next checks")}`,
    },

    /* ------------------------------------------------------------ 9 Reference */
    {
      section: "reference",
      layout: "cards",
      title: "Quick reference",
      lede: "The numbers people ask about most, with their defaults from the backend configuration.",
      body: (c) => `
        ${c.stats([
          { k: "Upload size", v: "25<small>MB</small>", s: "PDF · DOCX · TXT · MD · CSV" },
          { k: "Sitemap crawl", v: "200<small>pages</small>", s: "4 at a time · 5 MB · 15 s" },
          { k: "Similarity floor", v: "0.30", s: "per bot, Bot settings" },
          { k: "Passages retrieved", v: "5", s: "after MMR and rerank" },
          { k: "Widget messages", v: "20<small>/min</small>", s: "per visitor IP per bot" },
          { k: "Live-chat polls", v: "60<small>/min</small>", s: "per visitor IP" },
          { k: "Handoff wait", v: "2<small>min</small>", s: "then ask for email" },
          { k: "Agent away after", v: "75<small>s</small>", s: "heartbeat every 30 s" },
          { k: "Conversation token", v: "30<small>days</small>", s: "X-Conversation-Token" },
          { k: "Dashboard session", v: "7<small>days</small>", s: "HttpOnly cookie" },
          { k: "Admin session", v: "8<small>hours</small>", s: "separate secret" },
          { k: "Chat memory idle", v: "30<small>min</small>", s: "before a chat is remembered" },
        ], 4)}
        <div class="row">
          <div style="flex:1">${c.panel({ title: "Widget JavaScript API", body: `<p class="small"><code>Pingie.open()</code> · <code>close()</code> · <code>toggle()</code> · <code>ask(text)</code> · <code>identify({ email, name })</code> · <code>reset()</code> · <code>destroy()</code> · <code>version</code></p><p class="small muted">Calls made before the widget loads are queued.</p>` })}</div>
          <div style="flex:1">${c.panel({ title: "Ports in local development", body: `<p class="small">backend <code>:8080</code> · dashboard <code>:3000</code> · admin <code>:3001</code> · docs <code>:3003</code> · Memora <code>:8000</code></p>` })}</div>
        </div>`,
    },
    {
      section: "reference",
      layout: "cards",
      title: "Flashcards",
      lede: "Check your understanding. Each answer fits on one line.",
      body: (c) => c.flashcards([
        { q: "Where does the bot's knowledge come from?", a: "Only the bot's sources and team answers." },
        { q: "What happens when no passage clears the similarity floor?", a: "No LLM call; the fallback message is shown." },
        { q: "Which service writes the answer text?", a: "The LLM, via VizhiOps by default. Never Memora." },
        { q: "When is a team answer sent word for word?", a: "When “Team answers” ranks first and the question matches." },
        { q: "How does a visitor reach a person?", a: "Ask twice, or press Talk to a person, while an agent is online." },
        { q: "What if nobody joins a waiting chat?", a: "After 2 minutes the bot asks for an email." },
        { q: "How does live chat work without websockets?", a: "Widget and dashboard poll; status lives in PostgreSQL." },
        { q: "Why does an outsider get 404 for a bot?", a: "So nobody can learn which bot IDs exist." },
        { q: "What stops other sites embedding a bot?", a: "The Origin check against allowed domains." },
        { q: "What can a viewer do?", a: "Read everything; change nothing." },
        { q: "What does a draft bot allow?", a: "Loading on localhost only, for testing." },
        { q: "How do customers upgrade?", a: "Email support; an admin changes the plan." },
      ], 4),
    },
    {
      section: "reference",
      title: "Glossary",
      lede: "Terms used in the dashboard, the API and this handbook.",
      body: (c) => c.glossary([
        { term: "Workspace", code: "organization", def: "Owns bots, members and the plan's limits." },
        { term: "Bot", code: "bot_…", def: "One assistant with its own sources, settings, appearance and domains." },
        { term: "Source", def: "A file, page or sitemap the bot may answer from." },
        { term: "Team answers", def: "One source holding every answer the team wrote." },
        { term: "Chat memory", def: "Finished chats a teammate answered, scrubbed and added to retrieval." },
        { term: "Subject", def: "Memora's container for one bot's sources." },
        { term: "Similarity floor", code: "min_similarity", def: "Minimum passage score to count as evidence." },
        { term: "Condense", def: "Rewriting a follow-up into a standalone query." },
        { term: "Outcome", def: "answered, partial, fallback, smalltalk, lead or offline." },
        { term: "Fallback", def: "The reply used when the sources don't cover a question." },
        { term: "Lead", def: "A visitor email captured after a fallback." },
        { term: "Handoff", def: "Passing a chat from the bot to a person." },
        { term: "Conversation status", def: "bot, waiting, human or closed." },
        { term: "Take over", def: "A teammate joins any chat; the bot stops answering." },
        { term: "Presence", def: "A heartbeat row saying an agent is available." },
        { term: "Allowed domain", def: "A hostname where the widget may load." },
        { term: "Conversation token", def: "Signed token that authorises one chat for 30 days." },
        { term: "Model tier", def: "fast, balanced or best; limited by plan." },
        { term: "Share", def: "Access to one bot for someone outside the workspace." },
        { term: "Sweeper", def: "Background loop that syncs status every 20 s." },
        { term: "VizhiOps", def: "The default LLM gateway, one token per tier." },
        { term: "Memora", def: "The retrieval engine Pingie builds on." },
        { term: "Quota", def: "Monthly message allowance; over it the API returns 402." },
        { term: "Draft · Live · Paused", def: "A bot's status: testing, answering, or offline." },
      ]),
    },
  ],
};
