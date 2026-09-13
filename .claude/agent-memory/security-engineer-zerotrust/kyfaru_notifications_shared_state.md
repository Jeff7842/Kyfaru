---
name: kyfaru-notifications-shared-state
description: notifications table has no per-user read-receipt tracking — broadcast rows (userId IS NULL) are a shared mutable flag across all admin users
metadata:
  type: project
---

`lib/admin/db/schema.ts` `notifications` table has a single `isRead`/`readAt` pair per row, not a per-user join table. Rows with `userId: null` are created by public-facing routes (`app/api/quote/route.ts`, `app/api/contact/route.ts`) to alert *all* admins of a new lead/contact-form submission — genuinely broadcast/shared rows.

As of 2026-09-13, `app/api/admin/notifications/mark-all-read/route.ts` and `.../unread-count/route.ts` were changed to also match `isNull(notifications.userId)` in addition to the caller's own `userId`. Because there's no per-user read state, **one user's "mark all read" flips `isRead=true` globally for every other admin** — a lead notification can be silently dismissed for the whole team by whichever admin happens to open their notification bell first, with no role check gating who can do this (any authenticated user, any role, per [[kyfaru-admin-authz-model]]).

**How to apply:** Treat this as a real (not hypothetical) finding, not just a hardening suggestion, if asked to re-review these routes — it directly causes lost/suppressed business notifications, which matters for a sales/lead-intake flow. The proper fix is a `notification_reads (notification_id, user_id, read_at)` junction table rather than mutating the shared row. Also relevant: `app/admin/(app)/notifications/page.tsx` already shows every notification (including other users' targeted ones) to any logged-in user with zero scoping — a separate, pre-existing gap noted in [[kyfaru-admin-authz-model]].
