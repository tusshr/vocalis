'use client'

import Link from 'next/link'
import { JOBS } from '@/content/jobs'
import { useJobs } from '@/hooks/use-jobs'
import { localePath, type Locale } from '@/lib/i18n'

/** Header pill on every page while a generation runs; a tap goes to the tool. */
export function JobPill({ lang }: { lang: Locale }) {
  const { running } = useJobs()
  const toolHref = localePath(lang)
  if (!running) return null
  const progress = running.progress ?? 0
  const pct = Math.round(progress * 100)
  return (
    <Link href={toolHref} className="job-pill" aria-label={`${JOBS[lang].working}, ${pct}%`} title={JOBS[lang].working}>
      <span className="job-ring" style={{ '--p': progress } as React.CSSProperties} aria-hidden />
      <span aria-hidden>{pct}%</span>
    </Link>
  )
}
