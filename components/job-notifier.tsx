'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { excerpt, JobCard, ReadyCard } from '@/components/job-dock'
import { JOBS } from '@/content/jobs'
import { useJobs } from '@/hooks/use-jobs'
import { jobs, type FinishedJob } from '@/lib/jobs'
import { formatTime, localePath, type Locale } from '@/lib/i18n'
import { SITE_NAME } from '@/lib/site'

// The player brings the audio code; it loads only when Play is tapped.
const VoiceNote = dynamic(() => import('@/components/voice-note'), { ssr: false })

/**
 * One per page (mounted by the root document), so it survives client navigation. Shows one floating card at a time:
 * the voice note player, else "ready" (job done while on another page), else the running long job (closable, stays closed).
 * In a hidden tab the title changes and, if the visitor asked for it, a system notification appears.
 * While a job runs, leaving the site asks first.
 */
export function JobNotifier({ lang }: { lang: Locale }) {
  const text = JOBS[lang]
  const { running, finished, notify } = useJobs()
  const pathname = usePathname()
  const toolHref = localePath(lang)
  const onTool = pathname.replace(/\/$/, '') === toolHref.replace(/\/$/, '')
  const [ready, setReady] = useState<FinishedJob | null>(null)
  const [note, setNote] = useState<string | null>(null) // take id in the voice note player
  const [closedJob, setClosedJob] = useState<number | null>(null)
  const closeNote = useCallback(() => setNote(null), [])
  const titleRef = useRef<string | null>(null)
  const router = useRouter()

  // A tapped notification focuses this tab; go to the tool with client navigation, so the take (in memory) is kept.
  useEffect(() => {
    const worker = navigator.serviceWorker
    if (!worker) return
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'open' && typeof event.data.url === 'string') router.push(new URL(event.data.url).pathname)
    }
    worker.addEventListener('message', onMessage)
    return () => worker.removeEventListener('message', onMessage)
  }, [router])

  // A reload or closing the tab would end the job: ask first.
  useEffect(() => {
    if (!running) return
    const onLeave = (event: BeforeUnloadEvent) => { event.preventDefault() }
    addEventListener('beforeunload', onLeave)
    return () => removeEventListener('beforeunload', onLeave)
  }, [running])

  useEffect(() => {
    if (!finished) return
    const line = `“${excerpt(finished.excerpt)}” · ${formatTime(finished.seconds)}`
    if (document.hidden) {
      titleRef.current ??= document.title
      document.title = `✓ ${text.ready} · ${SITE_NAME}`
      if (jobs.get().notify && 'Notification' in window && Notification.permission === 'granted') {
        void navigator.serviceWorker?.ready.then((registration) => registration.showNotification(text.ready, {
          body: line, icon: '/icon-192.png', tag: 'vocalis-job', data: { url: new URL(toolHref, location.origin).href },
        }))
      }
    }
    // Shown when the visitor is looking at another page (now, or when they come back to the tab).
    const show = () => {
      if (document.hidden) return
      if (titleRef.current !== null) { document.title = titleRef.current; titleRef.current = null }
      if (!onTool) setReady(finished)
      jobs.seen()
    }
    show()
    document.addEventListener('visibilitychange', show)
    return () => document.removeEventListener('visibilitychange', show)
  }, [finished, onTool, text.ready, toolHref])

  // On the tool the take is in the list already.
  useEffect(() => { if (onTool) setReady(null) }, [onTool])

  if (note) return <VoiceNote lang={lang} id={note} onClose={closeNote} />
  if (ready) return <ReadyCard lang={lang} job={ready} onPlay={() => { setNote(ready.id); setReady(null) }} onClose={() => setReady(null)} />
  if (running?.long && running.id !== closedJob) return <JobCard lang={lang} job={running} onTool={onTool} notify={notify} onClose={() => setClosedJob(running.id)} />
  return null
}
