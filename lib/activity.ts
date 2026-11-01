// What the tool on the page is doing, for chrome outside the tool (the live logo). One tool is mounted at a time.
export type Activity = 'idle' | 'working' | 'live'

let current: Activity = 'idle'
const listeners = new Set<() => void>()

export const activity = {
  get: (): Activity => current,
  set(next: Activity) {
    if (next === current) return
    current = next
    listeners.forEach((notify) => notify())
  },
  subscribe(notify: () => void) {
    listeners.add(notify)
    return () => { listeners.delete(notify) }
  },
}

/** Id of the element in the site header where a tool puts its own actions (Start again). */
export const HEADER_ACTIONS_ID = 'header-actions'
