'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Mic, Pause, Play, X } from 'lucide-react'
import { JOBS } from '@/content/jobs'
import { useTtsStudio } from '@/hooks/use-tts-studio'
import { encodeWav, player, SAMPLE_RATE } from '@/lib/audio-stage'
import { wavePeaks } from '@/lib/audio-fx'
import { formatTime, localePath, type Locale } from '@/lib/i18n'

const SPEEDS = [1, 1.5, 2]

/**
 * A WhatsApp-style voice note for a take, floating at the bottom of any page. Loaded only when Play is tapped.
 * It plays through an audio element, which keeps the pitch at 1.5× and 2×; it and the tool's player pause each other.
 */
export default function VoiceNote({ lang, id, onClose }: { lang: Locale; id: string; onClose: () => void }) {
  const text = JOBS[lang]
  const take = useTtsStudio().takes.find((item) => item.id === id)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [speed, setSpeed] = useState(1)
  const peaks = useMemo(() => (take ? wavePeaks(take.audio, 36) : []), [take])
  const duration = take ? take.audio.length / SAMPLE_RATE : 0

  // A deleted take closes the player.
  useEffect(() => { if (!take) onClose() }, [take, onClose])

  useEffect(() => {
    if (!take) return
    const url = URL.createObjectURL(encodeWav(take.audio))
    const audio = new Audio(url)
    audioRef.current = audio
    let raf = 0
    const tick = () => { setPosition(audio.currentTime); if (!audio.paused) raf = requestAnimationFrame(tick) }
    audio.onplay = () => { player.stop(); setPlaying(true); raf = requestAnimationFrame(tick) }
    audio.onpause = () => { setPlaying(false); cancelAnimationFrame(raf) }
    audio.onended = () => { setPlaying(false); setPosition(0) }
    const unsubscribe = player.subscribe((state) => { if (state.playingId) audio.pause() })
    void audio.play()
    return () => { cancelAnimationFrame(raf); unsubscribe(); audio.pause(); URL.revokeObjectURL(url); audioRef.current = null }
  }, [take])

  if (!take) return null
  const fraction = duration ? position / duration : 0
  const seekTo = (next: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(1, next)) * duration
    setPosition(audio.currentTime)
  }
  const seekFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    seekTo((event.clientX - rect.left) / rect.width)
  }
  const nextSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]
    setSpeed(next)
    if (audioRef.current) audioRef.current.playbackRate = next
  }

  return (
    <div className="dock-card voice-note" role="region" aria-label={text.ready}>
      <span className="voice-note-avatar" aria-hidden><Mic size={12} /></span>
      <button type="button" className="icon-btn voice-note-toggle" aria-label={playing ? text.pause : text.play}
        onClick={() => { const audio = audioRef.current; if (audio) { if (audio.paused) void audio.play(); else audio.pause() } }}>
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <span className="voice-note-main">
        <div className="voice-note-wave" role="slider" tabIndex={0} aria-label={text.position}
          aria-valuemin={0} aria-valuemax={Math.round(duration)} aria-valuenow={Math.round(position)} aria-valuetext={formatTime(position)}
          onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); seekFromPointer(event) }}
          onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) seekFromPointer(event) }}
          onKeyDown={(event) => {
            const delta = event.key === 'ArrowRight' ? 0.05 : event.key === 'ArrowLeft' ? -0.05 : 0
            if (delta) { event.preventDefault(); seekTo(fraction + delta) }
          }}>
          {peaks.map((peak, i) => <i key={i} className={i / peaks.length < fraction ? 'is-played' : undefined} style={{ height: `${Math.max(16, peak * 100)}%` }} />)}
          <b className="voice-note-knob" style={{ left: `${fraction * 100}%` }} aria-hidden />
        </div>
        <span className="voice-note-meta">
          <span>{formatTime(playing || position > 0 ? position : duration)}</span>
          {take.voice && <Link href={localePath(lang)} className="voice-note-voice" aria-label={`${text.open}: ${take.voice}`}>{take.voice}</Link>}
        </span>
      </span>
      <button type="button" className="voice-note-speed" aria-label={text.speed} onClick={nextSpeed}>{speed}×</button>
      <button type="button" className="icon-btn" aria-label={text.dismiss} onClick={onClose}><X size={16} /></button>
    </div>
  )
}
