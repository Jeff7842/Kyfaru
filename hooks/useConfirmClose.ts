import { useConfirm } from '@/hooks/useConfirm'

/**
 * Wraps a drawer's close handler with a "discard changes?" prompt when dirty.
 * Returns `requestClose`, meant to replace the raw `onClose` passed to `Drawer`.
 */
export function useConfirmClose(isDirty: boolean, onClose: () => void) {
  const confirm = useConfirm()

  async function requestClose() {
    if (!isDirty) return onClose()
    const ok = await confirm({
      title: 'Discard changes?',
      description: 'You have unsaved changes. Closing now will lose them.',
      confirmLabel: 'Discard',
      cancelLabel: 'Keep editing',
      variant: 'warning',
    })
    if (ok) onClose()
  }

  return requestClose
}
