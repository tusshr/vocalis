// Text to voice session state that outlives the tool component: the engine and its model, the chosen voice,
// the running generation and the takes. Pages change without a reload, so a generation keeps going while
// the visitor reads another page, and everything is still there when they come back.
import { jobs } from '@/lib/jobs'
import type { Mood } from '@/lib/script'
import { createEngine, type LoadProgress, type TTSEngine } from '@/lib/tts-engine'
import type { Preset } from '@/lib/voices'
import type { Locale } from '@/lib/i18n'

export type Clip = { audio: Float32Array; source: 'preset' | 'mic' | 'file'; preset?: Preset }
export type Busy = { label: string; progress?: number; secondsLeft?: number; long?: boolean } | null
/** A sentence of the take and where it is in the audio, in seconds. The read-along uses these. */
/** `words` are character ranges of the piece's words in the script the take was made from. */
export type Piece = { text: string; start: number; end: number; words?: [number, number][] }
export type Take = { id: string; text: string; script?: string; audio: Float32Array; pieces: Piece[]; voice?: string; at?: number }
export type ModelState = 'idle' | 'loading' | 'ready' | 'failed'

export type StudioState = {
  base: Clip | null
  moods: Partial<Record<Mood, Clip>>
  consent: boolean
  model: ModelState
  loadProgress: LoadProgress | null
  modelError: string | null
  busy: Busy
  genError: string | null
  stopped: boolean
  takes: Take[]
}

const initial: StudioState = {
  base: null, moods: {}, consent: false,
  model: 'idle', loadProgress: null, modelError: null,
  busy: null, genError: null, stopped: false, takes: [],
}

let state = initial
const listeners = new Set<() => void>()

type Update<K extends keyof StudioState> = StudioState[K] | ((current: StudioState[K]) => StudioState[K])

export const studio = {
  get: () => state,
  getInitial: () => initial,
  subscribe(notify: () => void) {
    listeners.add(notify)
    return () => { listeners.delete(notify) }
  },
  set<K extends keyof StudioState>(key: K, update: Update<K>) {
    const value = typeof update === 'function' ? (update as (current: StudioState[K]) => StudioState[K])(state[key]) : update
    if (Object.is(value, state[key])) return
    state = { ...state, [key]: value }
    if (key === 'busy') jobs.run(state.busy && { kind: 'tts', progress: state.busy.progress, secondsLeft: state.busy.secondsLeft, long: state.busy.long })
    listeners.forEach((notify) => notify())
  },
}

/** Setters with React's `setState` shape, so the tool reads like plain component state. */
const setter = <K extends keyof StudioState>(key: K) => (update: Update<K>) => studio.set(key, update)
export const setBase = setter('base')
export const setMoods = setter('moods')
export const setConsent = setter('consent')
export const setModel = setter('model')
export const setLoadProgress = setter('loadProgress')
export const setModelError = setter('modelError')
export const setBusy = setter('busy')
export const setGenError = setter('genError')
export const setStopped = setter('stopped')
export const setTakes = setter('takes')

/** Engine bookkeeping (not rendered). */
export const session = {
  engine: null as TTSEngine | null,
  modelLang: null as Locale | null, // language the engine has (or is loading); null when idle or failed
  loading: null as Promise<void> | null,
  loadToken: 0, // a newer load makes an older one's result stale
  encoded: new Map<string, Float32Array>(), // voice name -> audio it was cloned from
  stopRequested: false,
  toolMounted: false, // a finished take plays by itself only while the tool is on screen
  getEngine() { return (this.engine ??= createEngine()) },
}
