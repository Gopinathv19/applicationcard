# applicationcard

Visual product handbooks, written as content modules and rendered to fixed-page
HTML and PDF. The system is product-agnostic; each product brings its own theme,
icons, assets and content.

```bash
npm install                # once: playwright-core (uses the cached Playwright Chromium)
npm run handbook           # every product: build HTML, export PDF, write page previews
npm run handbook memora    # one product
npm run build pingie       # HTML only
npm run pdf pingie         # PDF + previews from an existing build
```

| Product | Source repository | Evidence baseline | Pages |
| --- | --- | --- | --- |
| `pingie` | `../ping` | `1e01ad8` (2026-10-20), plus the product-brief PDF and its screenshots | 29 |
| `memora` | `../Memora` | `f4c6b8c` (2026-10-19); no screenshots exist, so product views are labelled mocks | 31 |

Output for each product is in `dist/<product>/`:

| File | What it is |
| --- | --- |
| `index.html` | Browser preview. Open it directly; every page is one A4-landscape sheet. |
| `<product>-handbook.pdf` | The exported PDF. |
| `preview/page-NN.png` | One image per page, for reviewing without a PDF viewer. |

The PDF step **fails if any page overflows** and names the page and element.
Pass `--allow-overflow` to export anyway. If Chromium isn't in the Playwright
cache, set `CHROMIUM_PATH` to a Chromium or Chrome binary.

## Layout

```text
system/                    product-agnostic, reused by every handbook
  handbook.css             page sheet, three layouts, components, print rules
  components.mjs           cover, contents, cards, screenshots, steps, matrices, flashcards…
  diagrams.mjs             SVG primitives: box, edge, diamond, zone, auto-laid-out sequence
  render.mjs               numbers pages, builds the contents, wraps headers and footers
scripts/
  handbook.mjs             build + export in one step, same arguments to both
  build.mjs                products/<p>/handbook.mjs → dist/<p>/index.html
  export-pdf.mjs           Chromium → PDF, overflow check, PNG previews
products/<p>/              one folder per product (pingie, memora), same shape:
  handbook.mjs             all content and page order
  diagrams.mjs             the product's diagrams, built from the system primitives
  theme.css                design tokens copied from the product's own stylesheet
  icons.mjs                icon paths from the product's own icon set, plus a few additions
  assets/                  embedded fonts (with licences) and screenshots
```

## Editing content

Each entry in `pages` is one sheet:

```js
{
  section: "features",          // id from `sections`; the first page of a section gets the big number
  layout: "atlas",              // "atlas" (default) | "editorial" (left rail + figure) | "cards"
  title: "Conversations inbox",
  lede: "One or two sentences.",
  body: (c) => `${c.cardGrid([...], 3)} ${c.takeaway("...")}`,
}
```

`c` is the component kit (`system/components.mjs`); `c.d` is the SVG kit for
diagrams. Keep one idea per page. When the overflow check fails, shorten text,
lower a figure's `height`, or split the page.

### Status of a capability

Every feature can carry a status badge: `implemented`, `partial`, `planned`,
`unknown`. A product adds its own in `statuses`: Pingie has `brief` ("described in
the product brief; not found in the repository"), Memora has `api` ("reachable
through the API only") and relabels `planned` as "Not built". Change the one
`status` field when the code changes. Each handbook's footer names the commit
it was verified against.

### Screenshots and mocks

Put images in `products/<p>/assets/screens/` and annotate them with
`c.screenshot({ src, pins: [{ x, y }] })` (percent of the image) next to
`c.callouts([...])`, which numbers its items in the same order.

When a product has no screenshots, `c.mock({ caption, body })` frames a view
built from components and always carries an "Illustrative" badge. Memora uses
this; swap in real screenshots when they exist.

## Adding a product

1. Copy `products/pingie/` to `products/<name>/`.
2. Replace the token values in `theme.css` with the product's own. Keep the
   variable names: they are the contract `system/handbook.css` relies on
   (`--bg`, `--surface*`, `--border*`, `--text*`, `--accent*`, `--ok`, `--warn*`,
   `--danger*`, `--font-sans`, `--font-mono`, `--radius`). Optional:
   `--on-accent` (text on a filled accent, white by default), `--mark-bg`,
   `--info` / `--info-border` (for an `info` status badge).
   Embed fonts with full glyph coverage: subsetted "latin" files lack → and ≤,
   and Chromium silently substitutes another font. `pdffonts` shows what landed.
3. Replace icons, fonts, screenshots and `handbook.mjs` content. If the product's
   icons use round caps, export `iconStyle = { width, linecap, linejoin }` and
   pass it in the handbook module (see `products/memora`).
4. `npm run handbook <name>`.
