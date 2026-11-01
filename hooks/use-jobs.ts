'use client'

import { useSyncExternalStore } from 'react'
import { jobs } from '@/lib/jobs'

/** Background job state for the header pill, the toast and notifications. */
export function useJobs() {
  return useSyncExternalStore(jobs.subscribe, jobs.get, jobs.get)
}
