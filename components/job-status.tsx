'use client'

import { useEffect, useState } from 'react'
import { Bell, BellRing } from 'lucide-react'
import { JOBS } from '@/content/jobs'
import { useJobs } from '@/hooks/use-jobs'
import { jobs } from '@/lib/jobs'
import { fmt, type Locale } from '@/lib/i18n'

/** Notifications can be asked for here: supported, and not blocked before. */
const canAsk = () => 'Notification' in window && 'serviceWorker' in navigator && Notification.permission !== 'denied'

/**
 * Takes the voice chip's place in the action bar while a long job runs (fixed height: nothing moves):
 * progress ring, time left, "you can browse other pages" (desktop) and a bell to get a notification.
 */
export function JobStatus({ lang, progress, secondsLeft }: { lang: Locale; progress?: number; secondsLeft?: number }) {
  const text = JOBS[lang]
  const { notify } = useJobs()
  const [askable, setAskable] = useState(false)
  useEffect(() => setAskable(canAsk()), [])

  const ask = async () => {
    const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()
    if (permission === 'granted') jobs.setNotify(true)
    else setAskable(false)
  }

  return (
    <div className="voice-chip job-status" role="status">
      <span className="job-ring" style={{ '--p': progress ?? 0 } as React.CSSProperties} aria-hidden />
      <span className="voice-chip-text">
        {secondsLeft === undefined ? text.working : <>
          <span className="job-status-long">{fmt(text.left, { n: secondsLeft })}</span>
          <span className="job-status-short">{fmt(text.leftShort, { n: secondsLeft })}</span>
        </>}
        <span className="job-status-hint"> · {text.canLeave}</span>
      </span>
      {(askable || notify) && (
        <button type="button" className={notify ? 'icon-btn job-bell is-on' : 'icon-btn job-bell'} aria-pressed={notify}
          aria-label={notify ? text.notifyOn : text.notifyMe} title={notify ? text.notifyOn : text.notifyMe}
          onClick={() => { if (!notify) void ask() }}>
          {notify ? <BellRing size={16} /> : <Bell size={16} />}
        </button>
      )}
    </div>
  )
}
