'use client'

import { useCallback, useSyncExternalStore } from 'react'

/** False on the server: anything shown only on desktop must also be hidden by CSS on phones (see CLAUDE.md). */
export function useMediaQuery(query: string) {
  const subscribe = useCallback((notify: () => void) => {
    const list = window.matchMedia(query)
    list.addEventListener('change', notify)
    return () => list.removeEventListener('change', notify)
  }, [query])
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}
