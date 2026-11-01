'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Check, Play, X } from 'lucide-react'
import { JOBS } from '@/content/jobs'
import { useJobs } from '@/hooks/use-jobs'
import { jobs, type FinishedJob } from '@/lib/jobs'
import { formatTime, localePath, type Locale } from '@/lib/i18n'
import { SITE_NAME } from '@/lib/site'

const TOAST_MS = 8000
const excerpt = (text: string) => (text.length > 60 ? `${text.slice(0, 57).trimEnd()}…` : text)

/**
 * One per page (mounted by the root document). When a background job ends:
 * on the tool page nothing extra (the take appears); on another page a toast; in a hidden tab the title changes
 * and, if the visitor asked for it, a system notification. While a job runs, leaving the site asks first.
 */
export function JobNotifier({ lang }: { lang: Locale }) {
  const text = JOBS[lang]
  const { running, finished } = useJobs()
  const pathname = usePathname()
  const toolHref = localePath(lang)
  const onTool = pathname.replace(/\/$/, '') === toolHref.replace(/\/$/, '')
  const [toast, setToast] = useState<FinishedJob | null>(null)
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
      if (!onTool) setToast(finished)
      jobs.seen()
    }
    show()
    document.addEventListener('visibilitychange', show)
    return () => document.removeEventListener('visibilitychange', show)
  }, [finished, onTool, text.ready, toolHref])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), TOAST_MS)
    return () => clearTimeout(timer)
  }, [toast])

  if (!toast) return null
  // The take's audio lives in the text to voice session; load that module only when Play is tapped.
  const play = async () => {
    const [{ studio }, { player }] = await Promise.all([import('@/lib/tts-studio'), import('@/lib/audio-stage')])
    const take = studio.get().takes.find((item) => item.id === toast.id)
    if (take) player.play(take.id, take.audio)
  }
  return (
    <div className="job-toast" role="status">
      <span className="job-toast-icon" aria-hidden><Check size={16} /></span>
      <Link href={toolHref} className="job-toast-text" onClick={() => setToast(null)}>
        <strong>{text.ready}</strong>
        <span>“{excerpt(toast.excerpt)}” · {formatTime(toast.seconds)}</span>
      </Link>
      <button type="button" className="btn btn-primary btn-small" onClick={() => void play()}><Play size={13} aria-hidden /> {text.play}</button>
      <button type="button" className="icon-btn" aria-label={text.dismiss} onClick={() => setToast(null)}><X size={16} /></button>
    </div>
  )
}
