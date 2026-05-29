'use client'

import { signOut } from 'next-auth/react'
import { useConfirm } from '@/hooks/useConfirm'

/** Returns a handler that confirms before signing the user out. */
export function useLogout(callbackUrl = '/admin/login') {
  const confirm = useConfirm()
  return async () => {
    const ok = await confirm({
      title: 'Log out?',
      description: 'You will need to sign in again to access the dashboard.',
      variant: 'danger',
      confirmLabel: 'Log out',
      cancelLabel: 'Stay signed in',
    })
    if (ok) signOut({ callbackUrl })
  }
}
