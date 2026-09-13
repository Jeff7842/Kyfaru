---
name: kyfaru-preline-ui-library
description: Kyfaru admin added preline@5.0.0 (Tailwind UI/interaction lib) — supply chain is clean, but its Select plugin's toggle display renders option "title" via innerHTML (not textContent) while the option list itself is safe.
metadata:
  type: project
---

Kyfaru's admin panel (`app/admin/(app)/layout.tsx`) added `preline@5.0.0` as a client-side
UI/interaction library, mounted via `components/admin/PrelineScript.tsx` (dynamic
`import('preline')` + `HSStaticMethods.autoInit()` on every `usePathname()` change).
Reviewed 2026-09-13, commit not yet made (working tree change).

**Supply chain: clean.** Legit repo (github.com/htmlstreamofficial/preline), homepage
preline.co, MIT + "Preline UI Fair Use License" dual license. No install-time scripts
(no `postinstall`/`preinstall` in package.json). pnpm-lock.yaml pins an integrity hash
for 5.0.0. No `eval`/`new Function`/remote phone-home in the shipped dist — the only
`fetch(...)` calls are the library's own documented `apiUrl` feature (Combobox/Select/
Datepicker fetching from a URL the *consuming app* configures), not calls to a
preline.co telemetry endpoint. No install-time network calls.

**Real (latent) XSS finding — for later phases wiring real data into Preline components:**
Preline's **Select** plugin (`src/plugins/select/core.ts`) is internally inconsistent:
- The dropdown **option list** renders titles/descriptions via `textContent` (safe) —
  e.g. lines ~779, 781, 950, 1291, 1293, 1337, 1543, 1565, 1580 in that source file.
- The **toggle button** (the element showing the currently-selected value) renders the
  *same* title data via `innerHTML` instead — lines ~402, 596, 600, 698, 702, 1614,
  1616, 2170-2206, 2433, 2435. This includes `remoteData.title` (from the plugin's own
  `apiUrl` remote-JSON feature) and `staticOption.title` (from `data-title`/`<option>`
  attributes the consuming app renders).
- Net effect: if Kyfaru ever binds a `data-hs-select` toggle's option titles to
  user-controlled text (a project name, client name, invoice line item, etc.) without
  stripping HTML first, selecting that option injects raw HTML into the toggle via
  `innerHTML` — real stored/reflected XSS in the authenticated admin session. Note this
  survives React's JSX-attribute escaping: Preline reads the value back with
  `getAttribute()`/JSON and re-parses it as HTML, so an already-escaped HTML attribute
  is not a mitigation.
- By contrast, Preline's **Combobox** plugin (`src/plugins/combobox/core.ts`,
  `jsonItemsRender`) is safe throughout: it only calls `htmlToElement` on the
  developer's own static template string, then populates dynamic JSON fields into it
  via `el.textContent`. **Tooltip** and **Dropdown** don't inject dynamic text via JS
  at all (Tooltip just repositions an existing DOM node; Dropdown just toggles
  visibility of developer-authored markup) — no library-side risk there.

**How to apply:** Whenever a future Kyfaru admin task wires real DB-backed data (project
names, client/tenant names, invoice descriptions, etc.) into a Preline `data-hs-select`
component, require the option `title`/`data-title` value to be HTML-stripped/sanitized
before it reaches Preline, specifically because the *toggle display* path is
`innerHTML`-based even though the option-list path is not. Combobox does not need this
extra caution — its rendering path already uses `textContent` end-to-end.

**Bundle/attack-surface note:** `PrelineScript.tsx` does `import('preline')`, which
resolves to the barrel `dist/index.mjs` (~410KB minified / ~90KB gzipped as of 5.0.0).
Because `package.json`'s `sideEffects` array marks `dist/index.mjs` as side-effecting,
bundlers won't tree-shake unused plugins out of it — all ~27 lightweight DOM-interaction
plugins (accordion, carousel, collapse, dropdown, select, tabs, tooltip, etc.) parse and
auto-init on every authenticated admin page even though only one is exercised today.
This is a moderate, quantifiable increase in third-party JS on the admin bundle — worth
noting, not blocking. The heavy sub-dependencies (`apexcharts`, `datatables.net`,
`vanilla-calendar-pro`, `nouislider`, `culori`) are NOT inlined into `index.mjs` — they
only load if a specific plugin subpath (e.g. `preline/plugins/datatable`) is imported
directly, so today's actual added weight is the ~90KB gzip figure above, not more.

**Auth gating confirmed:** `PrelineScript` is referenced in exactly two files in the
repo — its own definition and the single import in `app/admin/(app)/layout.tsx`, which
gates on `await auth()` + `redirect('/admin/login')` before rendering children. Not
reachable pre-auth. (`app/globals.css`'s `@import ".../preline/variants.css"` is
build-time-only Tailwind CSS, loaded globally including pre-auth pages, but it is inert
utility-class CSS with only local `@import`s — no `url()`/`javascript:`/`expression()` —
not a security concern by itself.)

**License:** Fair Use License's "no competing product" clause targets someone building
a rival UI-component library / template marketplace with Preline's code — does not
restrict an app merely *using* Preline as a dependency. Its attribution/redistribution
clauses apply to redistributing the Software itself (themes, page builders, forks), not
to compiling it into a private internal app's bundle. No action needed for Kyfaru's use
case, but don't strip the LICENSE file from `node_modules` distribution if this project
is ever open-sourced or redistributed as a template.
