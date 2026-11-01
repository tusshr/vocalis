'use client'

import { useCallback, useRef, useSyncExternalStore } from 'react'
import { player } from '@/lib/audio-stage'

/** The shared player's state (what plays, what is loaded, where it is), re-rendering on change. */
export function usePlayback() {
  const stateRef = useRef({ playingId: null as string | null, activeId: null as string | null, position: 0, duration: 0 })
  const subscribe = useCallback((notify: () => void) => player.subscribe((state) => {
    stateRef.current = state
    notify()
  }), [])
  return useSyncExternalStore(subscribe, () => stateRef.current, () => stateRef.current)
}

export type Playback = ReturnType<typeof usePlayback>
