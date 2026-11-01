import Link from 'next/link'
import { ViewTransition } from 'react'
import { LanguageSwitcher } from '@/components/language-switcher'
import { LogoMark } from '@/components/logo-mark'
import { ToolSwitch } from '@/components/tool-switch'
import { CHROME } from '@/content/pages'
import { HEADER_ACTIONS_ID } from '@/lib/activity'
import { localePath, type Locale } from '@/lib/i18n'
import { SITE_NAME } from '@/lib/site'

/**
 * The one header of every page (server component). The shared view transition name keeps it still while the page cross-fades.
 * `active` marks the tool on a tool page; `page` is set only for pages that exist in every language (the language menu stays on it).
 * A tool adds its own actions (Start again) with `HeaderActions`.
 */
export function SiteHeader({ lang, page, active }: { lang: Locale; page?: string; active?: 'tts' | 'stt' }) {
  return (
    <ViewTransition name="site-header" share="auto" default="none">
      <header className="topbar">
        <Link className="wordmark" href={localePath(lang)}><LogoMark />{SITE_NAME}</Link>
        <ToolSwitch lang={lang} active={active} variant="header" />
        <div className="topbar-actions">
          <div id={HEADER_ACTIONS_ID} className="header-actions" />
          <LanguageSwitcher lang={lang} page={page} label={CHROME[lang].language} />
        </div>
      </header>
    </ViewTransition>
  )
}
