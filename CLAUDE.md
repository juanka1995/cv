# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Bilingual CV (English + Spanish), each maintained as one HTML file. English is the primary version; Spanish is kept in lockstep. The HTMLs in `src/` are the source of truth; the PDFs in `dist/` are generated artifacts committed alongside them so they can be downloaded directly from GitHub.

## Repo layout

```text
src/
  cv.en.html      English source (primary)
  cv.es.html      Spanish source (kept in sync)
  styles.css      Shared print/screen CSS — both HTMLs <link> to this
logos/
  perfil.jpg               portrait photo (JPEG flattened on navy — no alpha needed,
                           the photo is clipped to a circle in CSS)
  jubilame.png             referenced from both HTMLs as ../logos/jubilame.png
  unie.png                 ditto
  uam.png                  ditto
  granada-dynamics.png     ditto
  github.png               GitHub icon for repo links
dist/
  Juan_Carlos_Ruiz_Garcia_CV_EN.pdf    generated, committed
  Juan_Carlos_Ruiz_Garcia_CV_ES.pdf    generated, committed
scripts/
  build-pdf.mjs   Playwright render: src/*.html → dist/*.pdf
```

Never put HTML in `dist/` or PDFs in `src/`. The PDF filenames in `dist/` are the public-facing download names — keep them descriptive (full real name) regardless of how short the HTML filenames are.

**CSS is shared.** Both HTMLs `<link rel="stylesheet" href="styles.css">` from the same file. **Never inline styles back into one HTML** — any style edit goes once into `src/styles.css` and applies to both languages. If you ever need a language-specific style override, add a `<style>` block inside the body of just that file (not in the head), and document why.

Logos are referenced with relative path `../logos/<name>.png` from each HTML. Playwright's Chromium resolves these via `file://` when rendering and embeds the image bytes into the PDF.

## Workflow when the user asks to update the CV

1. Edit `src/cv.en.html` (EN).
2. Mirror the same content change in `src/cv.es.html` (ES) — translated.
3. Run `npm run build` to regenerate **both** PDFs.
4. Commit all four files together (HTML × 2 + PDF × 2). If a logo changed, commit it too.

**Never let the two HTMLs drift.** If the user only gives the change in one language, translate it to the other. If you can't translate something confidently (proper nouns, brand-specific terms, role titles), keep the original term and flag it.

Do not split the HTMLs into partials, introduce a templating engine, or restructure layout/styles unless the user explicitly asks. Content edits must preserve the existing class names and section structure — the print CSS depends on them.

### Adding a new experience entry that needs a logo

1. Drop the logo PNG (transparent background preferred) into `logos/<slug>.png` — pick a slug that's lowercase, kebab-case, matches the company. **Downscale before committing**: the logo prints at ~14 mm wide, so ~600 px on the long edge is plenty. Embedding a 3000 px PNG bloats the PDF and makes scrolling laggy in viewers because they decode raw RGBA per page.
2. In each HTML's `.exp-head`, wrap the new company name with the logo: `<div class="exp-company"><img class="exp-logo" src="../logos/<slug>.png" alt="">Company Name</div>`. The `.exp-logo` CSS rule already handles sizing (6 mm tall, max 14 mm wide, vertically centered).
3. Rebuild.

## Commands

- `npm install` — one-time; installs Playwright and (via `postinstall`) downloads Chromium into `~/.cache/ms-playwright/`.
- `npm run build` — renders both `src/*.html` to `dist/*.pdf` via Playwright headless Chromium.

There are no tests, no linter, no dev server. To preview while editing, open `src/cv.en.html` (or `cv.es.html`) in a regular browser and use Chrome's print preview (Cmd/Ctrl+P).

On Linux/WSL, Chromium needs system libs once:
`sudo apt-get install -y libnss3 libnspr4 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2t64`

## Architecture

Two HTML files, identical structure, content swapped per language. They `<link>` to the same shared `src/styles.css`. The layout is a CSS grid with a 72 mm navy sidebar and a fluid main column.

The navy sidebar bleeds to every printed page via three cooperating mechanisms (overlapping for resilience across Chromium quirks):

1. `html` background `linear-gradient` — propagates to the canvas (incl. @page margin areas).
2. `body` background — same gradient as fallback if Chromium clips html background.
3. `<div class="page-band">` with `position: fixed` and negative top/bottom offsets — re-painted per printed page by Chromium.

This is fragile. If you change `@page`, the html/body background, or `.page-band`, verify in the generated PDF that there are no white seams between pages — and remember to apply the same CSS change to both language files.

Per-page text spacing on top of new pages is provided by `@page { margin: 9mm 0 }`. Some sidebar sections (`Languages`, `At a Glance`) have an explicit `<br>` before their `<div class="s-h">` heading so they sit lower from the navy column's top edge when they land at the top of a printed page. If you reorganise the sidebar order, you may need to move these `<br>` hints to whichever section ends up landing first on page 2/3.

Page-break behaviour relies on `page-break-inside: avoid` on `.s-section`, `.experience-item`, and `.project-item`, plus `page-break-after: avoid` on `.m-h` so a section heading is never stranded at the bottom of a page without its first item. Keep those classes if you add new sections of the same shape.

## Editing rules for content updates

- Sections in the main column are `<section class="m-section">` with an `<h2 class="m-h">` heading. New experience entries follow the existing `.experience-item` block; new projects follow `.project-item`; publications are `<li>` inside `<ol class="pubs">`.
- Sidebar contact links, stats, languages, and skills use `.contact`, `.stats`, `.langs` lists — match the existing markup so spacing and bullets render correctly.
- Inline `style="..."` attributes exist on a few links (e.g. repo URLs) — preserve them; they're load-bearing for colour.
- The `<html lang="…">` attribute and the small greeting in the sidebar must match the file's language ("Hi, I'm" vs "Hola, soy").

### Section titles (current)

- 01 — EN: `Profile` · ES: `Resumen`
- 02 — EN: `Professional Experience` · ES: `Experiencia Profesional`
- 03 — EN: `Key Projects` · ES: `Proyectos Destacados`
- 04 — EN: `International Publications` · ES: `Publicaciones Internacionales`

If renaming a section, update **both** files in the same commit.

### Translation rules (EN ↔ ES)

User preference: translate the minimum necessary. Spanglish is fine and often preferred — keep technical / professional terms in English when they read more natural that way.

- Keep proper nouns (company names, lab names, university names, repo URLs) **untouched**.
- **Keep job/role titles in English** in the ES file (e.g. "Lead AI Engineer", "AI/ML Engineer", "Adjunct Professor", "Research Data Scientist"). Don't translate them.
- **Keep publication / article titles untouched** in their original language (typically English).
- Top-level section headings → translate naturally to Spanish.
- Narrative descriptions, tagline, greeting, soft-skill bullets, project blurbs → translate to Spanish.
- Tech stacks, framework names, language names (Python, React, AWS, MOOC, NLP, AI/ML, FastAPI, GCP, etc.) stay as-is in both files.
- Dates: same numeric format; the word "Present" → "Actualidad".
- When in doubt, leave the English term — Spanglish in a tech CV is normal and the user explicitly prefers it.

## PDF generation notes

`scripts/build-pdf.mjs` uses Playwright's bundled Chromium (currently ~v148) instead of Puppeteer's (v131) because the newer engine respects `html`/`body` background propagation through `@page` margins more reliably. Options used:

- `preferCSSPageSize: true` — honour the `@page A4` rule in the HTML.
- `printBackground: true` — required so the navy sidebar and gradients are painted.
- `margin: 0` on all sides — `@page` already declares the 9 mm top/bottom margins.
- `waitUntil: 'networkidle'` — gives logos and the portrait photo (`logos/perfil.jpg`) time to load before snapshot.

If you ever revert to Puppeteer or upgrade Playwright and the page-break seam reappears, see the comment near the top of `src/styles.css` for the three-mechanism navy bleed and verify each one is still in place.
