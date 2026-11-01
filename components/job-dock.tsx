'use client'

import { useEffect, useState } from 'react'
import { Bell, BellRing, Check, Play, X } from 'lucide-react'
import { JOBS } from '@/content/jobs'
import { jobs, type FinishedJob, type RunningJob } from '@/lib/jobs'
import { fmt, formatTime, type Locale } from '@/lib/i18n'

/* The floating cards at the bottom of the page: one at a time (job, ready or the voice note player). */

export const excerpt = (text: string) => (text.length > 60 ? `${text.slice(0, 57).trimEnd()}…` : text)

/** Notifications can be asked for here: supported, and not blocked before. */
const canAsk = () => 'Notification' in window && 'serviceWorker' in navigator && Notification.permission !== 'denied'

/** A long job is running: progress, time left, and an opt-in for a notification. */
export function JobCard({ lang, job, onTool, notify, onClose }: { lang: Locale; job: RunningJob; onTool: boolean; notify: boolean; onClose: () => void }) {
  const text = JOBS[lang]
  const [askable, setAskable] = useState(false)
  useEffect(() => setAskable(canAsk()), [])
  const ask = async () => {
    const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()
    if (permission === 'granted') jobs.setNotify(true)
    else setAskable(false)
  }
  const left = job.secondsLeft !== undefined ? fmt(text.left, { n: job.secondsLeft }) : null
  return (
    <div className="dock-card" role="status">
      <span className="job-ring is-big" style={{ '--p': job.progress ?? 0 } as React.CSSProperties} aria-hidden />
      <span className="dock-text">
        <strong>{text.working}</strong>
        <span>{left}{onTool && <span className="dock-hint">{left && ' · '}{text.canLeave}</span>}</span>
      </span>
      {notify ? (
        <span className="btn btn-outline btn-small dock-notify is-on" aria-label={text.notifyOn} title={text.notifyOn}><BellRing size={14} aria-hidden /> <span className="dock-notify-label">{text.notifyOnShort}</span></span>
      ) : askable && (
        <button type="button" className="btn btn-outline btn-small dock-notify" aria-label={text.notifyMe} title={text.notifyMe} onClick={() => void ask()}>
          <Bell size={14} aria-hidden /> <span className="dock-notify-label">{text.notifyShort}</span>
        </button>
      )}
      <button type="button" className="icon-btn" aria-label={text.dismiss} onClick={onClose}><X size={16} /></button>
    </div>
  )
}

/** The job is done (seen from another page): Play opens the voice note player in its place. */
export function ReadyCard({ lang, job, onPlay, onClose }: { lang: Locale; job: FinishedJob; onPlay: () => void; onClose: () => void }) {
  const text = JOBS[lang]
  return (
    <div className="dock-card" role="status">
      <span className="dock-icon" aria-hidden><Check size={16} /></span>
      <span className="dock-text">
        <strong>{text.ready}</strong>
        <span>“{excerpt(job.excerpt)}” · {formatTime(job.seconds)}</span>
      </span>
      <button type="button" className="btn btn-primary btn-small" onClick={onPlay}><Play size={13} aria-hidden /> {text.play}</button>
      <button type="button" className="icon-btn" aria-label={text.dismiss} onClick={onClose}><X size={16} /></button>
    </div>
  )
}
