'use client'

import Link, { type LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { useIsAnyPageDirty } from '@/hooks/useNavigationGuard'
import { useConfirm } from '@/hooks/useConfirm'

type Props = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & {
    children: React.ReactNode
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  }

/** Drop-in <Link> that prompts before navigating away from a dirty page. */
export default function GuardedLink({ href, onClick, children, ...rest }: Props) {
  const router = useRouter()
  const isDirty = useIsAnyPageDirty()
  const confirm = useConfirm()

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (e.defaultPrevented || !isDirty()) return
    e.preventDefault()
    const ok = await confirm({
      title: 'Discard changes?',
      description: 'You have unsaved changes. Leaving now will lose them.',
      confirmLabel: 'Discard',
      cancelLabel: 'Keep editing',
      variant: 'warning',
    })
    if (ok) router.push(href.toString())
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
