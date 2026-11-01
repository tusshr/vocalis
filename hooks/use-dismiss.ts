'use client'

import { useEffect, useRef, type RefObject } from 'react'

/** While `open`, a pointer down outside `ref` or the Escape key calls `onDismiss` (menus, popovers). */
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, onDismiss: () => void) {
  const dismiss = useRef(onDismiss)
  dismiss.current = onDismiss
  useEffect(() => {
    if (!open) return
    const onDown = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node)) dismiss.current() }
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') dismiss.current() }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey) }
  }, [ref, open])
}
