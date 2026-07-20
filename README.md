# CityChoice — Shopify Theme Setup & Architecture

Premium Electronics Ecommerce theme for **Shopify Online Store 2.0**, built from scratch
with **Liquid · HTML5 · CSS3 · Vanilla JS** plus GSAP, Lenis, Swiper, Three.js, Rive/Lottie,
and Lucide Icons.

> Scope: this document covers **project setup, architecture, and development workflow only**.
> No sections/pages/UI are designed yet.

---

## 1. Install Shopify CLI

Shopify CLI (`@shopify/cli`) is distributed via npm and requires Node.js. Install it globally:

```bash
npm install -g @shopify/cli@latest
```

Verify:

```bash
shopify version
shopify theme --help
```

> Recommendation: install it **per-project** (see `package.json`) instead of globally to lock
> the version. Run all commands through `npx shopify ...` or `npm run dev`.

---

## 2. Required Software

| Tool        | Version        | Purpose                                  | Install |
|-------------|----------------|------------------------------------------|---------|
| Node.js     | ≥ 20 LTS       | Runs Shopify CLI + npm                    | https://nodejs.org (LTS) |
| Git         | ≥ 2.40         | Version control                          | https://git-scm.com |
| VS Code     | Latest         | Editor (Liquid/Theme Check support)      | https://code.visualstudio.com |
| Shopify CLI | ≥ 3.70         | Dev server, push/pull, preview           | `npm i -g @shopify/cli` |

VS Code recommended extensions (auto-suggested via `.vscode/settings.json`):
- `Shopify.theme-check-vscode` — Liquid lint/validation
- `sissel.liquid` — Liquid syntax highlighting
- `esbenp.prettier-vscode` — formatting

---

## 3. Authenticate Shopify CLI

1. Create a **Shopify Partner account**: https://partners.shopify.com
2. Create a **Development Store** (no transaction fees, full feature access).
3. From the project root, run:

```bash
shopify auth login
```

This opens a browser to authenticate with your Partner account and stores tokens locally.
For CI/machines use a **Partner API token** + store domain:

```bash
shopify auth login --store your-dev-store.myshopify.com
```

To connect to a store directly (non-partner) use the Shopify admin → Apps → develop app,
then `shopify app dev` or theme commands against the store.

---

## 4. Create a New Theme Project

Initialize from this scaffold:

```bash
cd citychoice-theme
npm install            # installs @shopify/cli + animation vendors
shopify theme dev      # serves theme against your dev store with hot reload
```

To pull an existing theme from a store:

```bash
shopify theme pull --store your-dev-store.myshopify.com
```

`shopify theme dev` outputs a **preview URL** and a separate **editor URL** for the
Shopify admin theme editor (customize). Edits to Liquid/CSS/JS sync automatically.

---

## 5. Folder Structure & Purpose

```
citychoice-theme/
├── assets/          Raw + compiled static files Shopify serves (CSS, JS, images, fonts, models). The ONLY folder Shopify treats as a static CDN. Subfolders below are organizational; anything referenced by Liquid must resolve to a file here or be referenced via asset_url.
│   ├── css/         Compiled/aggregated stylesheets (base.css, sections, components)
│   ├── js/          Compiled JS bundles (theme.js, vendor bundles)
│   ├── images/      raster/vector images (png, jpg, svg, webp)
│   ├── fonts/       self-hosted fonts (woff2) — Space Grotesk, Satoshi, Inter
│   ├── models/      3D models / textures for Three.js (.glb, .gltf)
│   ├── icons/       SVG sprites / icon assets
│   └── animations/  Lottie JSON, Rive (.riv) files
├── config/          Theme settings: settings_schema.json (editor controls) + settings_data.json (default values/presets)
├── layout/          Top-level HTML wrappers. theme.liquid is the master shell (head, body, header/footer groups, content_for_layout)
├── locales/         Translation JSON files (en.default.json, etc.) for Shopify's i18n
├── sections/        Reusable, drag-and-drop page building blocks (hero, featured collection). Each can have schema + blocks
├── snippets/        Small reusable Liquid partials (price, card, icon). Included via {% render %} / {% include %}
├── templates/       Page-level JSON (OS 2.0) that arrange sections, plus .liquid fallbacks (404.liquid, etc.)
├── blocks/          Reusable sub-units inside sections (section-level block definitions / dynamic blocks)
├── javascript/      Source JS (NOT served directly). Vendors + ES modules authored here, compiled/copied into assets/js
│   ├── vendors/     GSAP, Lenis, Swiper, Three, Rive, Lottie, Lucide source
│   └── modules/     Theme feature modules (header, cart, animations)
├── styles/          Source CSS (NOT served directly). Authored as CSS3, compiled/copied into assets/css
│   ├── base/        tokens, reset, typography, variables
│   ├── components/  buttons, cards, forms
│   └── sections/    section-specific styles
├── components/      Framework-agnostic reusable building units (icons/, cards/) — logical groupings mirrored into snippets/assets
└── package.json     Dependencies + Shopify CLI scripts (dev, pull, push, check, deploy)
```

**Key rule:** Only `assets/` is a public CDN. Source files in `javascript/` and `styles/`
are authored locally and copied/compiled into `assets/` (see Assets section). Keep that
pipeline explicit so Shopify never serves uncompiled source.

---

## 6. Development Workflow

```
VS Code  →  Shopify CLI (shopify theme dev)  →  Shopify Dev Store (preview)  →  GitHub (source of truth)
```

- **Theme preview**: `shopify theme dev` serves the theme from your dev store with a live
  preview URL. A second "editor" URL opens the Shopify customizer.
- **Hot reload**: CLI watches files and injects changes; CSS/JS refresh without full reload,
  Liquid changes re-render sections. Use `--theme-editor-sync` to push local edits into the
  customizer live (`npm run dev:hot`).
- **Version control**: `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`,
  `templates/`, `blocks/`, `package.json` are committed. Never commit `node_modules/`, `.shopify/`, secrets.
- **Git branches**:
  - `main` — production-ready, deployed to live theme.
  - `development` — integration branch for stable work.
  - `feature/*` — one per feature (e.g. `feature/product-hero`), merged into `development`, then `main`.

---

## 7. Recommended Git Structure

```
main            (live / production theme)
  └── development   (integration)
        └── feature/homepage-hero
        └── feature/product-card
        └── feature/cart-drawer
```

Flow: `feature/*` → PR into `development` → QA on dev store → PR into `main` → `shopify theme push`.

---

## 8. Asset Management (where files live)

| Asset type   | Author in                | Serve from (asset_url)        |
|--------------|--------------------------|-------------------------------|
| CSS          | `styles/` (source)       | `assets/css/*.css`            |
| JS           | `javascript/` (source)   | `assets/js/*.js`              |
| Images       | —                        | `assets/images/*`             |
| 3D models    | —                        | `assets/models/*.glb`         |
| Fonts        | —                        | `assets/fonts/*.woff2`        |
| Icons (SVG)  | —                        | `assets/icons/*`              |
| Animations   | —                        | `assets/animations/*` (lottie/rive) |

Pipeline: keep `styles/` and `javascript/` as **source**. Copy/compile outputs into `assets/`.
For a no-build setup, you may author CSS/JS directly in `assets/` and skip the source dirs —
but the source-split approach scales better for vendored libraries.

Fonts: self-host woff2 in `assets/fonts/` and declare `@font-face` in `styles/base/`. Avoid
render-blocking external font CDNs for performance/SEO.

---

## 9. Integrating Animation Libraries (Vanilla, no frameworks)

All libraries are vanilla and framework-free. Load order matters: load vendors first, then theme.

**Install (already in package.json):**
```bash
npm install gsap lenis swiper three @rive-app/canvas lottie-web lucide
```

**Load strategy (preferred: copy vendors into assets/js, reference via asset_url):**

In `layout/theme.liquid`, before `theme.js`:
```liquid
<script src="{{ 'gsap.min.js' | asset_url }}" defer></script>
<script src="{{ 'lenis.min.js' | asset_url }}" defer></script>
<script src="{{ 'swiper.min.js' | asset_url }}" defer></script>
<script src="{{ 'three.min.js' | asset_url }}" defer></script>
<script src="{{ 'lottie.min.js' | asset_url }}" defer></script>
<script src="{{ 'rive.min.js' | asset_url }}" defer></script>
<script src="{{ 'lucide.min.js' | asset_url }}" defer></script>
<script src="{{ 'theme.js' | asset_url }}" defer></script>
```

**Module wiring (`javascript/modules/`):**

- **GSAP** — `import gsap from 'gsap';` for scroll/timeline animations; pair with ScrollTrigger plugin.
- **Lenis** — `import Lenis from 'lenis';` instantiate once, drive `requestAnimationFrame`, sync with GSAP ticker for smooth scroll.
- **Swiper** — `import Swiper from 'swiper';` initialize on `.swiper` containers for product/carousel sliders.
- **Three.js** — `import * as THREE from 'three';` lazy-load only on pages with 3D hero (`assets/models/*.glb` via GLTFLoader). Code-split to protect performance.
- **Rive** — `@rive-app/canvas` `new rive.Rive({ src: 'assets/animations/x.riv', canvas, autoplay: true })`.
- **Lottie** — `lottie.loadAnimation({ container, path: 'assets/animations/x.json' })`.
- **Lucide** — `lucide.createIcons()` after DOM ready; use `<i data-lucide="name"></i>`.

Performance guardrails: `defer` all scripts, lazy-init Three.js/Rive, respect
`prefers-reduced-motion`, and keep total JS lean for Core Web Vitals.

---

## 10. Shopify Liquid Architecture

| Layer      | Responsibility |
|------------|----------------|
| `layout`   | Master HTML shell. `theme.liquid` holds `<head>`, `content_for_header`, `content_for_layout`, global header/footer groups. |
| `templates`| Per-page JSON (OS 2.0) composing sections; `.liquid` for logic-heavy/error pages. |
| `sections` | Drag-and-drop building blocks with `{% schema %}`; render on templates; can contain blocks. |
| `blocks`   | Configurable sub-elements inside a section (repeater items like feature columns, menu items). |
| `snippets` | Reusable partials (`{% render 'product-card' %}`) for DRY markup. |
| `assets`   | Static files referenced via `{{ 'file' | asset_url }}`. |

Data flow: **layout → template → section → block / snippet**. Global settings from
`config/settings_schema.json` are read via `settings.*`; section settings via `section.settings.*`.

---

## 11. Online Store 2.0 JSON Templates

Templates are **JSON files** (e.g. `templates/index.json`, `product.json`) that declaratively
list which sections appear and in what order. Merchants rearrange them in the theme editor
without touching code. Each section entry maps `type` → a `sections/*.liquid` file and may
carry `blocks` and `settings`. Liquid templates (`.liquid`) remain for `404`, `password`,
`gift_card`, and dynamic behavior.

Example `templates/product.json`:
```json
{
  "sections": {
    "main": { "type": "main-product" },
    "recommendations": { "type": "product-recommendations" }
  },
  "order": ["main", "recommendations"]
}
```

---

## 12. Scalable Page Architecture

```
templates/
├── index.json          Homepage (hero, featured, collections, 3D showcase)
├── product.json        Product page (gallery, buybox, tabs, recommendations)
├── collection.json     Collection / listing (filters, grid, swiper)
├── page.about.json     About (brand story, motion sections)
├── page.contact.json   Contact (form, map)
├── cart.json           Cart (drawer/ajax cart)
├── search.json         Search (predictive, results grid)
└── 404.liquid          Error page
```

Each maps to `sections/` blocks (e.g. `main-product.liquid`, `collection-grid.liquid`),
reuses `snippets/` (product-card, price, icon), and pulls styles from `styles/sections/`.
Shared `layout/theme.liquid` guarantees consistent header/footer and global animation init.

---

## Production Readiness Checklist (apply during build)

- Performance: deferred JS, lazy media, self-hosted fonts, code-split Three.js.
- SEO: semantic HTML, `canonical`, `page_description`, JSON-LD product/brand, hreflang.
- Responsive: mobile-first CSS, fluid type, accessible tap targets.
- Quality: `shopify theme check` in CI, liquid lint, a11y (skip link, ARIA, reduced motion).
