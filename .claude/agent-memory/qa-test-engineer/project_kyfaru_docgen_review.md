---
name: project-kyfaru-docgen-review
description: Findings from reviewing Kyfaru's invoice-pdf/agreement-docx/scope-docx overhaul (2026-09-13) — paidAt backfill gap, invoice continuation-page header overlap, document-code concurrency verified correct
metadata:
  type: project
---

Reviewed (as code review, not test-writing) an uncommitted 3-phase change in F:\Web Dev\Kyfaru:
paidAt plumbing, shared `getOrCreateDocumentCode()` for Agreement/SOW docs, and an invoice-pdf.ts +
agreement-docx.ts/scope-docx.ts overhaul. Full findings were reported inline; the durable bits worth
remembering for next time:

- **`getOrCreateDocumentCode` (lib/admin/docs/document-code.ts) concurrency is actually correct.**
  UPDATE ... WHERE document_code IS NULL RETURNING, followed by a fallback SELECT on 0-rows-affected,
  correctly resolves concurrent same-project races via ordinary Postgres row-locking + EvalPlanQual —
  verified by reasoning through Postgres's UPDATE/EPQ semantics, not just "looks right." The only
  side effect is that a losing concurrent caller burns a `nextval()` (a gap in the sequence) — expected/
  acceptable, not a bug. Uses `drizzle-orm/neon-http` (`@neondatabase/serverless`) — each statement is its
  own implicit transaction over HTTP, which is sufficient for this single-statement-atomicity pattern.

- **Revenue chart (`app/api/admin/finance/revenue-chart/route.ts`) filters `status='paid' AND paidAt BETWEEN`.**
  Confirmed via a **read-only** query against the real dev DB (2026-09-13) that all 4 existing 'paid'
  invoices already in the DB have `paid_at = NULL` — they were paid before the paidAt-write fix shipped,
  so they will stay invisible to the revenue chart forever unless someone runs a one-time backfill
  (`UPDATE invoices SET paid_at = updated_at WHERE status='paid' AND paid_at IS NULL`, or similar). This
  is a real, verified gap, not a theoretical one — worth checking whether it's since been backfilled.

- **Invoice PDF pagination math (lib/admin/docs/invoice-pdf.ts) is correct** for 5/6/12-item traces —
  no Y-offset collisions, continuation pages correctly reset `row`/`pageFirstYTop`. The actual bug found
  was different: continuation-page column headers are drawn at a fixed `yTop=0.08`, and the real template
  artwork (`public/invoice/Invoice Template.png`, 2552x3579) has the "KYFARU" logo/wordmark baked in at
  roughly x∈[0.62,0.91] y∈[0.04,0.10] of page fraction — so the "Quantity" (x=0.62) and "Total" (x=0.8)
  header labels on any continuation page render on top of the logo. Found by actually viewing the
  template PNG and cross-checking coordinates, not just reading the code. If this pattern (full template
  background reused via `newPage()` + text drawn near the top) recurs, always check the artwork at the
  literal fraction coordinates being drawn to, not just whether the loop math is self-consistent.

- **DB inspection workaround:** a throwaway `tsx` script placed under the scratchpad dir failed with
  `Cannot find module '@neondatabase/serverless'` — tsx/node module resolution needs the script inside
  the project tree (`node_modules` lookup walks up from the script's own path). Put throwaway inspection
  scripts in `scripts/_tmp-*.ts` (gitignored pattern not required — just delete after) and run via
  `pnpm exec tsx scripts/_tmp-*.ts`, not from an external scratchpad path.

See [[project-kyfaru-authz-gaps]] for the permission-check-shaped finding from the same review (scope-pdf
missing the `requireRole('manager')` guard that its sibling agreement-pdf has, despite both now calling
the same side-effecting `getOrCreateDocumentCode`).
