<<<<<<< HEAD
# Distill — Frontend

Find the AI tool that actually fits your task. Distill takes a plain-language query, scores it
against a catalog of AI tools, and returns one best match plus two alternatives — instead of
another directory to scroll through.

This is the **frontend only**: static HTML/CSS/JS, no backend, no build step. Every "API call"
(recommendations, auth, history) is mocked on-device so the whole flow is clickable end to end.

## Why plain HTML/CSS/JS instead of React + Vite

The build environment this was created in has no network access, so `npm`/`pnpm` couldn't install
anything. Rather than hand over a project that can't be installed, it's built with the tech stack
the original brief also specified as acceptable — HTML, CSS, JS, Tailwind, Bootstrap-style icons,
Inter — loaded via CDN with **zero build step**. Open `index.html` and it runs.

If you do want this ported to React + Vite + shadcn/ui later, the component boundaries below
(sidebar, top nav, search bar, recommendation card, tool grid card) map cleanly onto React
components — each is already an isolated render function in `js/`, not tangled into page markup.

## Quick start

No install required.

```bash
# from this folder
python3 -m http.server 8080
# then open http://localhost:8080/index.html
```

Or just double-click `index.html` — everything works from `file://` too, since there's no backend.

**Try it:** Sign up with any name + a real-looking email (e.g. `you@gmail.com`) + a 6+ character
password → you're logged in → search something like "AI tools for writing" from Home.

## Folder structure

```
distill-frontend/
├── index.html          Public landing page (marketing/welcome)
├── login.html           Auth: log in
├── signup.html          Auth: create account
├── home.html             Post-login home: sidebar + hero + search
├── results.html          Recommendation results (1 best + 2 alternatives)
├── trendy.html           Grid of trending tools
├── offers.html           Grid of free/hybrid-tier tools
├── history.html          Full search history + clear all
├── dashboard.html        Stats cards, quick actions, recent activity
├── profile.html          Account details + log out
├── css/
│   └── styles.css        Design tokens (font, focus states, glass, motion)
├── js/
│   ├── tailwind-config.js  Tailwind CDN theme (colors, radii, shadows)
│   ├── data.js              Mock AI tool catalog + keyword search/rank
│   ├── auth.js               Mock signup/login/session (localStorage)
│   ├── history.js            Search history store (localStorage)
│   ├── components.js         Sidebar / top nav / mobile drawer / footer
│   ├── search.js             Search bar: suggestions, voice input, submit
│   ├── results.js             Results page: loading/error/success states
│   └── tools-grid.js          Card grid renderer (Trendy, Offers)
└── assets/
    └── favicon.svg
```

## Component hierarchy

Nothing here uses a framework, so "components" are small render functions in `js/` that each own
one piece of markup and get called from a page's inline `<script>`. No page hand-writes sidebar or
nav markup — they call `renderShell()`.

```
renderShell(activePage)              [js/components.js]
├── renderSidebar(activePage)          → desktop <aside> + mobile drawer, same inner markup
│     ├── logo (links home)
│     ├── Trendy / Offers links
│     ├── History (collapsible, last 5 searches)
│     └── "View All History" → history.html
├── renderTopNav(activePage)           → Home / Dashboard / Profile / Log out
└── renderFooter()                     → contact + year

initSearchBar({...})                 [js/search.js]
├── type-ahead suggestions (suggestQueries)
├── voice search (Web Speech API, graceful fallback)
└── submit → results.html?q=...      (or a custom onSubmit on results.html itself)

Results page                          [js/results.js]
├── showState(loading|error|empty|results)
├── searchTools(query) → { best, alt1, alt2 }
└── fillCard(template, tool)          → clones <template id="recCardTemplate">

Tool grid (Trendy / Offers)           [js/tools-grid.js]
└── renderToolGrid(rootId, tools, badge)
```

Pages that require login call `requireAuth()` (from `js/auth.js`) before `renderShell()`, which
bounces to `login.html` if there's no session.

## Data & state (all mocked, all client-side)

| Store | Key | Shape |
|---|---|---|
| Accounts | `distill_users` (localStorage) | `[{ name, email, password }]` |
| Session | `distill_session` (localStorage) | `{ name, email }` |
| Search history | `distill_history` (localStorage) | `[{ query, time }]`, newest first |
| Tool catalog | `js/data.js` → `AI_TOOLS` | in-memory array, see below |

`searchTools(query, limit)` in `js/data.js` does simple keyword-overlap scoring against each
tool's name/category/description/keywords — this stands in for the brief's "Gemini decides the
fit" step. **To wire up a real backend:** replace the body of `searchTools()` with a `fetch()` to
your recommendation API (Gemini or otherwise) and keep the same return shape
(`[{ name, category, pricing, rating, description, pros, cons, url }, ...]`) — nothing else needs
to change, since `results.js` only depends on that shape.

## Design tokens

Matches the provided spec: cream background (`#FFFDF8`), green accent (`#4CAF50`), white sidebar,
Inter typeface, 16–24px radii, soft card shadows, a light glass hint on floating cards. All values
live in `js/tailwind-config.js` (Tailwind theme) and `css/styles.css` (everything Tailwind
utilities don't cover: focus rings, glass, motion, spinner, typing dots).

## Accessibility & responsiveness

- Semantic landmarks (`header`, `nav`, `main`, `footer`) on every page.
- Visible focus rings on every interactive element (`:focus-visible`).
- `aria-label` on icon-only buttons (menu, voice search, close drawer).
- `prefers-reduced-motion` disables all animation/transition durations.
- Sidebar collapses into a mobile drawer with a hamburger trigger under the `lg` breakpoint;
  search bar and hero scale down on mobile.

## Known limitations (frontend-only mock)

- Auth is `localStorage`-based, not a real backend — passwords aren't hashed. Don't reuse a real
  password when testing signup.
- Recommendations are keyword-matched against a fixed 18-tool catalog, not a live Gemini call.
- The results page randomly simulates an API timeout (~12% of searches) so the retry/error UI
  required by the spec is actually reachable in a demo — remove that in `js/results.js` once a
  real API is wired in.
=======
# distill
>>>>>>> 5a6711084958e0c4374a11f290c91b09a2305541
