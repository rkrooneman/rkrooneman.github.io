# rkrooneman.github.io

The personal online profile and CV of **Roderik Krooneman**, Commercial Domain Lead at Infinitas Learning. It is a static, dependency-free website hosted on GitHub Pages at **[rkrooneman.github.io](https://rkrooneman.github.io/)**.

The site is built with plain HTML, CSS and vanilla JavaScript — no framework, no build step, and no external runtime requests. Everything (fonts, icons, scripts) is self-hosted.

## Parts of This Repo

| File / Folder | Description |
|---|---|
| `index.html` | The main single-page profile: hero, about, experience timeline, education, skills, contact |
| `cv.html` | A standalone, print-friendly classic CV page (save-as-PDF via the browser) |
| `css/style.css` | All styling: palette (CSS custom properties), fluid typography, layout, animations, print styles, and the Konami "history mode" theme |
| `js/index.js` | All interactivity: typewriter intro, scroll-driven nav colouring, the animated experience timeline, education & skills carousels, back-to-top button, and easter eggs |
| `fonts/` | Self-hosted web fonts (Lato, Archivo, EB Garamond) as `woff2`, each with its SIL Open Font License (`*-OFL.txt`) |
| `icons/` | Favicon/PWA icon set (`icon-16/32/180/192/512.png`) and the source `logo.svg` |
| `images/` | The Open Graph / profile share image |
| `favicon.ico` | Multi-size favicon generated from the logo |
| `site.webmanifest` | PWA web app manifest (name, theme colour, icons) |
| `robots.txt`, `sitemap.xml` | SEO: crawler directives and the URL sitemap |
| `.nojekyll` | Tells GitHub Pages to serve files as-is and skip the Jekyll build |

## Quick Start

No build step or package manager is required — it's a static site. To preview locally, serve the folder with any static file server:

```bash
git clone git@github.com:rkrooneman/rkrooneman.github.io.git
cd rkrooneman.github.io

# then use any static server, e.g. one of:
npx serve -l 8000          # Node
# python -m http.server 8000   # Python (if installed)
```

Opens at http://localhost:8000. You can also just open `index.html` directly in a browser, though a local server is recommended so relative asset paths and fonts resolve correctly.

## Prerequisites

- **None to view** — a modern web browser is all that's needed.
- **To preview locally** — any static file server (e.g. `npx serve`, which requires Node, or Python's `http.server`).

## Editing

Because everything is data-driven where it counts, most content updates are small and localized:

- **Experience roles** — edit the `roles` array near the top of the Experience section in `js/index.js` (chronological, oldest first). The timeline nodes, years and detail panel regenerate automatically.
- **Education items** — edit the `items` array in the Education section of `js/index.js`.
- **Skills** — edit the `skills` array in the Skills section of `js/index.js`.
- **Intro, About, Contact** — edit the corresponding sections directly in `index.html`.
- **The printable CV** — `cv.html` is standalone; keep its content in sync with `index.html` when roles or skills change.
- **Colours & typography** — the palette lives in CSS custom properties (`:root`) at the top of `css/style.css`.

### Easter egg

Entering the Konami code (↑ ↑ ↓ ↓ ← → ← → B A) permanently transforms the page into an aged-document theme (parchment palette, EB Garamond serif, sepia wash) until the page is refreshed. There is also a console greeting for anyone who opens dev tools.

## Deployment

Deployment is automatic via **GitHub Pages**: pushing to the `master` branch triggers the built-in `pages-build-deployment` workflow, which publishes the site to https://rkrooneman.github.io/. There is no separate build or CI configuration in the repo.

## Accessibility & Performance

- Fully self-contained — no external network requests at runtime.
- Respects `prefers-reduced-motion` (animations are disabled for users who opt out).
- Skip link, `<main>` landmark, keyboard-navigable carousels/timeline, and focus styles.
- Fluid `clamp()` typography; lightweight, no framework overhead.

## Contributing

This is a personal profile site maintained by its owner. Suggestions and fixes are welcome:

- Create a branch from `master`
- Make your changes and preview them with a local static server
- Open a pull request against `master`

## Contact

Roderik Krooneman — [r.krooneman@gmail.com](mailto:r.krooneman@gmail.com) · [LinkedIn](https://www.linkedin.com/in/krooneman)
