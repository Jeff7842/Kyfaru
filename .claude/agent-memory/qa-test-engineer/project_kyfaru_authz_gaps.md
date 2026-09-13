---
name: project-kyfaru-authz-gaps
description: Kyfaru admin tool has inconsistent/missing per-role and per-resource authorization on many routes — affects what "permission check" tests can assert
metadata:
  type: project
---

Kyfaru (F:\Web Dev\Kyfaru) is an internal admin/CRM tool. Role hierarchy in `lib/admin/permissions.ts`:
tier 1 = viewer/communications/tech/finance/sales, tier 2 = manager, tier 3 = admin, tier 4 = super_admin.
`requireRole()` throws a plain `Error` on failure — uncaught in route handlers, so a failed check surfaces as a generic 500, not a 403.

**Confirmed gaps (as of 2026-09-13, cross-referenced with `security-engineer-zerotrust`'s
`kyfaru_admin_authz_model.md` / `kyfaru_docgen_conventions.md` memories, which independently found the same things):**
- `GET /api/admin/invoices` and `GET /api/admin/projects` return ALL rows system-wide to any authenticated user — no ownership/tenant scoping.
- `app/admin/(app)/notifications/page.tsx` does an unscoped `db.select().from(notifications)` — every logged-in user sees every other user's targeted notifications, not just their own + broadcasts. This sits awkwardly next to `unread-count`/`mark-all-read`, which (as of the 2026-09-13 diff) DO scope to `eq(userId, self) OR isNull(userId)` — so the bell-badge count and the full notifications-list page can now disagree (one is scoped, one isn't).
- `app/api/admin/projects/[id]/agreement-pdf/route.ts` requires `requireRole(role, 'manager')` (tier 2+) before generating the doc. Its sibling `app/api/admin/projects/[id]/scope-pdf/route.ts` has **no role check at all** (any authenticated tier-1 user) despite both routes calling the identical side-effecting `getOrCreateDocumentCode()` (a real, permanent DB write/sequence-claim triggered by a GET). Reported as a priority finding in the 2026-09-13 review of the invoice/agreement-docx overhaul; check whether it's been fixed before assuming parity between these two routes.

**How to apply:** When asked to write "permission check" tests per the mandatory-coverage list for this repo, verify first whether the target route actually has a `requireRole` call and row-level scoping — many don't. Report the absence as a coverage/security gap rather than assuming RBAC is enforced and writing a test that would pass trivially (any authenticated user allowed) or fail for reasons unrelated to the feature under test. See [[project-kyfaru-docgen-review]] for the document-generation-specific findings from that same review.
