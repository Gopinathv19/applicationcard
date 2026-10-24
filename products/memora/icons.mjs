// Memora icons. The first block is copied verbatim from the console's rail
// (Memora/console/src/components/Shell.tsx: 24px grid, round caps, 1.6 stroke).
// The second block adds concepts the console has no icon for, in the same style.

export const iconStyle = { width: 1.6, linecap: "round", linejoin: "round" };

export default {
  home: "M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5",
  tenants: "M4 21V5.5L12 3l8 2.5V21M4 21h16M9 21v-4h6v4M8 9h2M14 9h2M8 13h2M14 13h2",
  applications: "M4 5.5h6v6H4zM14 5.5h6v6h-6zM4 14.5h6v6H4zM14 14.5h6v6h-6z",
  actors: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 20c0-3 2.7-5 6-5s6 2 6 5M16.5 5.2a3.5 3.5 0 0 1 0 6.6M18 15.4c2 .8 3 2.3 3 4.6",
  subjects: "M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h9A1.5 1.5 0 0 1 21 10v8.5A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5Z",
  sources: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3ZM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  chunks: "M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z",
  embeddings: "M12 3v3M12 18v3M3 12h3M18 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M17.7 6.3l-2.1 2.1M8.4 15.6l-2.1 2.1M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z",
  ask: "M12 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 17.5V19M12 7.5a4.5 4.5 0 0 0-4.5 4.5M9.75 12h.01M14.25 12h.01",
  credentials: "M14.5 3a6.5 6.5 0 0 1 0 13 6.6 6.6 0 0 1-2.4-.45L10 18H8v2H6v2H3v-3l6.6-6.6A6.5 6.5 0 0 1 14.5 3ZM16 7.5h.01",
  compare: "M6 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM18 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM18 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6 9v4a2 2 0 0 0 2 2h8M18 9v2",
  docs: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  gdrive: "M8.5 4h7L21 14l-3 6H6L3 14 8.5 4M8.5 4l3.5 6M6 20l3.5-6",

  // Handbook additions in the same style.
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  graph: "M6 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM18 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM12 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM7 7.7l4 8.4M17 7.7l-4 8.4M8 6h8",
  scan: "M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M7 12h10",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  chart: "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 3",
  check: "M5 12l5 5 9-10",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  server: "M3 4h18v7H3zM3 13h18v7H3zM7 7.5h.01M7 16.5h.01",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 17h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7",
  cost: "M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3S9.5 10.5 12 11s4.5 1.3 4.5 3-2 3-4.5 3-4.5-1.3-4.5-3",
  test: "M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1",
};
