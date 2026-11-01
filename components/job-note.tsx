'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { JOBS } from '@/content/jobs'
import { useJobs } from '@/hooks/use-jobs'
import { jobs } from '@/lib/jobs'
import { fmt, type Locale } from '@/lib/i18n'

type Support = 'ask' | 'install' | 'none'

/** Where system notifications work: ask on tap; on an iPhone outside the installed app, say how to get them; elsewhere nothing. */
function notifySupport(): Support {
  const iosBrowser = /iPhone|iPad|iPod/.test(navigator.userAgent) && !matchMedia('(display-mode: standalone)').matches
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return iosBrowser ? 'install' : 'none'
  return Notification.permission === 'denied' ? 'none' : 'ask'
}

/** Shown under the stage while a long job runs: time left, "you can leave", and an opt-in for a notification. */
export function JobNote({ lang, secondsLeft }: { lang: Locale; secondsLeft?: number }) {
  const text = JOBS[lang]
  const { notify } = useJobs()
  const [support, setSupport] = useState<Support>('none')
  useEffect(() => setSupport(notifySupport()), [])

  const ask = async () => {
    const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()
    if (permission === 'granted') jobs.setNotify(true)
    else setSupport('none')
  }

  return (
    <p className="note job-note">
      {secondsLeft !== undefined && <strong>{fmt(text.left, { n: secondsLeft })} </strong>}
      {text.keepBrowsing}
      {notify ? <span className="job-note-line">{text.notifyOn}</span>
        : support === 'ask' ? <button type="button" className="link job-note-line" onClick={() => void ask()}><Bell size={13} aria-hidden /> {text.notifyMe}</button>
        : support === 'install' ? <span className="job-note-line">{text.installHint}</span>
        : null}
    </p>
  )
}
