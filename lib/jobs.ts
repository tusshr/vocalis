// Background jobs, for chrome outside the tools (header pill, toast, system notification, tab title).
// Tiny on purpose: every page imports it; the engines stay in their own modules.

export type JobKind = 'tts'
export type RunningJob = { kind: JobKind; id: number; progress?: number; secondsLeft?: number; long?: boolean }
export type FinishedJob = { kind: JobKind; id: string; excerpt: string; seconds: number }
type State = { running: RunningJob | null; finished: FinishedJob | null; notify: boolean }

let state: State = { running: null, finished: null, notify: false }
const listeners = new Set<() => void>()
const emit = (patch: Partial<State>) => {
  state = { ...state, ...patch }
  listeners.forEach((notify) => notify())
}

export const jobs = {
  get: () => state,
  subscribe(notify: () => void) {
    listeners.add(notify)
    return () => { listeners.delete(notify) }
  },
  /** Report the running job (null when it ends). The id stays the same for one job, so a closed card stays closed. */
  run(update: Omit<RunningJob, 'id'> | null) {
    const current = state.running
    if (!update) { if (current) emit({ running: null }); return }
    const running = { ...update, id: current?.id ?? Date.now() }
    if (current && current.progress === running.progress && current.secondsLeft === running.secondsLeft && current.long === running.long) return
    emit({ running })
  },
  finish: (finished: FinishedJob) => emit({ running: null, finished }),
  /** The toast (or the visitor) has dealt with the finished job. */
  seen: () => emit({ finished: null }),
  /** The visitor asked for a system notification when the current job ends (kept for this visit). */
  setNotify: (notify: boolean) => emit({ notify }),
}
