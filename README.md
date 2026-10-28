# Ulo Job Joseph — Personal Portfolio

Single-page portfolio for **Ulo Job Joseph**, Lagos-based Data Analyst growing into AI development. Built with plain HTML5, CSS3, and vanilla JavaScript (no frameworks, no build step).

## Quick start
1. Unzip / clone this folder anywhere.
2. Replace `/assets/ulo.jpg` with your professional headshot (circular crop works best).
3. Replace `/assets/Ulo_Job_Joseph_Resume.pdf` with your actual resume PDF.
4. Open `index.html` in a browser — no server required for local review.
5. Edit the `[ADD]` placeholders (see "Content I still need to provide" below) before publishing.

## File structure
```
index.html              # Single-page site (all sections)
css/styles.css          # Design tokens, layout, components
js/main.js              # Theme, menu, scroll spy, reveal, stats, filter, modal, form, slider
assets/                 # Images, resume, favicon
robots.txt / sitemap.xml # SEO
README.md               # This file
```

## How to edit content

### Central config
Most copy lives directly in `index.html` — each editable spot is marked with an `<!-- EDIT: -->` or `[ADD]` comment. Key areas:
- **Hero headline / subhead / CTA links** — `<section class="hero">`
- **Stats** — `.stat__number` elements in `#credibility` (replace `[ADD]` with true numbers)
- **About story** — `#about`
- **Skills tags & context** — `#skills .skill-group`
- **Projects** — `#projects .project-card` plus matching `#modal-1`…`#modal-3`
- **Experience** — `#experience .timeline__item` (fix employer names, dates, metrics)
- **Education** — `#education`
- **Services** — `#services`
- **Testimonials** — `#testimonials` (get permission before publishing names)
- **Contact** — `#contact` form and social links

### Form endpoint
In `js/main.js`, set `CONFIG.formEndpoint` to your Formspree URL:
```js
formEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
```
The form posts via `fetch` with `Accept: application/json`, which is what Formspree expects. A honeypot field (`name="hp"`) blocks bots.

## How to change colors & fonts
All design tokens live at the top of `css/styles.css` in the `:root` block:
- `--color-accent` — gold accent (default `#d9a427` dark mode, `#b47312` light mode)
- `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-border`
- `--font-display` — Outfit (headings)
- `--font-body` — Inter (body text)

Change the Google Fonts import in `index.html` `<head>` if you swap fonts, then update the two token variables.

Light/dark theme toggles automatically, persists in `localStorage`, and respects `prefers-color-scheme`.

## How to add a project
1. Add a `<article class="project-card project-card--CATEGORY" data-category="CATEGORY">` in `#projects .projects__grid`. Categories: `dashboards`, `sql`, `ai-ml` (or add your own and a matching filter button).
2. Add a filter button `<button class="filter-btn" data-filter="CATEGORY">Label</button>` in `.projects__filters`.
3. Duplicate one of the `.modal` blocks, update its `id` to match `data-modal`, and fill in the case study (problem / solution / tools / impact / links).
4. Mark any metrics or links you can't verify yet as `[ADD]`.

## Deploy for free
This is a static site — no build step, no server.

**GitHub Pages:** create a repo, push these files, enable Pages in repo settings (source: main branch, root folder).

**Netlify:** drag-and-drop the folder into Netlify Drop, or connect your GitHub repo for continuous deploys.

**Vercel:** import the GitHub repo or run `vercel` after installing the Vercel CLI. Use the "Other" preset (static HTML).

Remember to update `canonical`, Open Graph, and `sitemap.xml` URLs with your real domain before launch.

## Accessibility & performance notes
- Skip link, visible focus styles, WCAG AA contrast targets, semantic headings, ARIA on modals/nav/toggle.
- Lazy-loaded hero photo with explicit width/height to prevent layout shift.
- Canvas network animation pauses when off-screen and disables under `prefers-reduced-motion`.
- Scroll and resize handlers are throttled; modal traps focus and closes on `Escape`.
## Placeholder quick-reference ([ADD] items)
These must be replaced before launch — they appear in `index.html`, `js/main.js`, and `css/styles.css`:
- Hero subhead niche (headline already set)
- Contact availability (remote / hybrid / freelance / full-time)
- Current employer/sector + 2–3 achievements with numbers (Data Analyst role)
- Python / pandas / scikit-learn / LLM-RAG only if truly known or in progress
- WhatsApp link (`https://wa.me/[ADD]`) and LinkedIn / GitHub / Hugging Face URLs
- Stat numbers (dashboards built, datasets analyzed, years in data, certifications) — true numbers only
- Project metrics and live/GitHub links
- Data Analyst employer and achievements
- Machine Operator year
- Testimonial quotes + names (get referee permission first)
- Formspree endpoint in `js/main.js`

## License
MIT. Feel free to adapt for your own portfolio.