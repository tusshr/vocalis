'use client'

import { useEffect, useRef } from 'react'
import type { WaveMode } from '@/components/waveform'

/**
 * The Vocalis mark: four bars on the gradient tile. At rest they breathe (CSS); while working they bounce (CSS);
 * while audio plays or the mic records ("live") they follow the shared analyser. `still` turns motion off (footer).
 */
export function LogoMark({ mode = 'idle', still = false }: { mode?: WaveMode; still?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const live = mode === 'live' && !still

  useEffect(() => {
    const bars = ref.current ? [...ref.current.children] as HTMLElement[] : []
    if (!live || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let stopped = false
    let getAnalyser: () => AnalyserNode | null = () => null
    let data = new Uint8Array(256)
    const levels = [0, 0, 0, 0]
    const BINS = [2, 5, 9, 15] // low → higher voice bands, one per bar
    const tick = () => {
      const analyser = getAnalyser()
      if (analyser) {
        if (data.length !== analyser.frequencyBinCount) data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(data)
      }
      bars.forEach((bar, i) => {
        const target = analyser ? data[BINS[i]] / 255 : 0
        levels[i] += (target - levels[i]) * 0.35
        bar.style.transform = `scaleY(${(0.5 + levels[i] * 1.2).toFixed(3)})`
      })
      raf = requestAnimationFrame(tick)
    }
    // Loaded on first use, so pages where nothing plays (about, legal) do not ship the audio code.
    void import('@/lib/audio-stage').then((audio) => { if (!stopped) { getAnalyser = audio.getAnalyser; raf = requestAnimationFrame(tick) } })
    return () => { stopped = true; cancelAnimationFrame(raf); bars.forEach((bar) => { bar.style.transform = '' }) }
  }, [live])

  const state = still ? ' is-still' : live ? ' is-live' : mode === 'working' ? ' is-working' : ''
  return <span ref={ref} className={`wordmark-mark${state}`} aria-hidden><i /><i /><i /><i /></span>
}
