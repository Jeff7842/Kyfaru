---
name: project-kyfaru-phase6-9-review
description: QA findings from reviewing Kyfaru phases 6-9 (redis cache, StackInput portal rewrite, confirm-close drawers, DatePicker bugfix pass, audit.ts icon/title, project-requirements completeness gate) on 2026-09-13
metadata:
  type: project
---

Reviewed on 2026-09-13 for team-lead, uncommitted working-tree changes (repo had no commits yet for this session's work). Full findings sent via SendMessage; key durable facts below.

**StackInput.tsx portal click-outside bug (HIGH, unfixed as of review).** `components/admin/shared/StackInput.tsx` renders its dropdown via `createPortal(..., document.body)` but the click-outside handler (`document.addEventListener('mousedown', ...)`) still checks containment against a `ref` that only wraps the label/chips/search-input, NOT the portaled node. Since `mousedown` fires before `click`, clicking any dropdown item closes (unmounts) the dropdown before its own `onClick` can fire — nothing in the dropdown is selectable via click. Standard fix: give the portaled node its own ref and check both, or use `onMouseDown{preventDefault()}` on dropdown options. Verified via static analysis (event-ordering + portal target), not live browser (shared dev server on :3000 was mid-edit by other phase agents and returned 500 on /admin/projects at review time — didn't push further to avoid interfering).

**isRequirementsComplete has no defense against partial shapes.** `lib/admin/types/project-requirements.ts` `isRequirementsComplete()` only guards `!doc` (null/undefined); it directly accesses `doc.pages.items.length`, `doc.hosting.provider`, etc. `app/api/admin/projects/[id]/route.ts` PATCH writes `body.scopeDocument` completely unvalidated (no zod). A partial scopeDocument (e.g. `{purpose: 'x'}`) would throw a TypeError inside `agreement-pdf`/`scope-pdf` GET routes (no try/catch there) → raw 500 instead of the intended 409 "Complete the project details first". Not currently reachable since nothing writes a partial shape today, but there's no guard preventing it.

**Activity route day-bucketing uses server timezone, not Africa/Nairobi.** `app/api/admin/projects/[id]/activity/route.ts` `dayLabel()` uses bare `new Date()`/`toDateString()` — mislabels entries created ~21:00-00:00 UTC (00:00-03:00 EAT) by one day for a Nairobi-based admin. No file anywhere in the codebase normalizes to Africa/Nairobi server-side (grepped `Africa/Nairobi|timeZone|process.env.TZ` — only hits are client-side currency/pricing hooks), so this is a systemic gap, not a regression against an established pattern.

**Confirm-close pattern (useConfirmClose + 4 drawers) is solid — good reference for future dirty-tracking work.** All four drawers (Client/Expense/Invoice/ProjectFormDrawer) use the identical, correct pattern: `snapshotRef.current = JSON.stringify(next)` set synchronously in the same effect that calls `setForm(next)` (keyed on `[open, record]`), and `handleSave()` calls `onClose()` directly (bypassing the confirm gate) rather than `requestClose()`. No stale-snapshot races found. Use this as the template if asked to add dirty-tracking to another drawer.

**Upstash Redis `get()` on a cache miss resolves to `null`, confirmed from source.** Traced `@upstash/redis@1.38.4`'s `GetCommand`/`parseResponse`/`parseRecursive` — a REST miss returns `{result: null}`, `JSON.parse(null)` coerces to the string `"null"` and returns JS `null` (not `undefined`), and `Command.exec` only throws on `result === undefined`. So `lib/admin/cache.ts`'s `cachedJson()` check `cached !== null` is correct — don't second-guess this pattern in future cache reviews unless the upstash version changes.

**DatePicker.tsx bugfix pass (latestPropsRef, enableDateToggle:false, hide()+destroy()+init()-cleanup) verified correct against `vanilla-calendar-pro@3.3.2` actual type defs** (`init(): () => void`, `hide()`, `destroy()`, `enableDateToggle: boolean`). Ref-write-in-render-body pattern is StrictMode-safe by construction (idempotent per render). Supersedes the concerns in [[project_kyfaru_datepicker_review]] (stale-closure race and enableDateToggle default-true) — both are now fixed.

**Don't run `pnpm db:migrate` during a read-only QA review** — `.env.local` has a real `DATABASE_URL` pointing at a live Neon instance; applying migrations is a mutating action outside review scope. Instead sanity-check the SQL file + `meta/_journal.json` registration, and tell the team lead to confirm applied state themselves (`__drizzle_migrations` table or run it themselves).

Related: [[project_kyfaru_datepicker_review]], [[project_kyfaru_docgen_review]], [[project_kyfaru_authz_gaps]]
