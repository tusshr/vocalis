'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { HEADER_ACTIONS_ID } from '@/lib/activity'

/** Renders a tool's actions into the server-rendered site header (after hydration, so the first paint never changes). */
export function HeaderActions({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  useEffect(() => setTarget(document.getElementById(HEADER_ACTIONS_ID)), [])
  return target ? createPortal(children, target) : null
}
