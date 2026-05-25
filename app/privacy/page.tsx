// ============================================================
// PRIVACY — REDIRECT
// Moved to /privacy-policy. This page redirects permanently.
// ============================================================

import { redirect } from 'next/navigation'

export default function PrivacyRedirectPage(): never {
  redirect('/privacy-policy')
}

