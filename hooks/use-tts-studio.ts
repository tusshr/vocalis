'use client'

import { useSyncExternalStore } from 'react'
import { studio } from '@/lib/tts-studio'

/** The text to voice session (voice, model, job, takes); survives moving between pages. */
export function useTtsStudio() {
  return useSyncExternalStore(studio.subscribe, studio.get, studio.getInitial)
}
