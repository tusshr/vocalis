'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { activity, type Activity } from '@/lib/activity'

/** The current tool activity (idle on the server and on pages without a tool). */
export function useActivity(): Activity {
  return useSyncExternalStore(activity.subscribe, activity.get, () => 'idle')
}

/** A tool reports what it is doing; back to idle when it unmounts. */
export function usePublishActivity(mode: Activity) {
  useEffect(() => {
    activity.set(mode)
    return () => activity.set('idle')
  }, [mode])
}
