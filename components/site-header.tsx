import Link from 'next/link'
import { ViewTransition } from 'react'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ToolSwitch } from '@/components/tool-switch'
import { CHROME } from '@/content/pages'
import { localePath, type Locale } from '@/lib/i18n'
import { SITE_NAME } from '@/lib/site'

/** Every page's header: it stays still while the page cross-fades. */
export function PinnedHeader({ children }: { children: React.ReactNode }) {
  return <ViewTransition name="site-header" share="auto" default="none">{children}</ViewTransition>
}

/** Header of the reading pages (about, contact, legal, 404): same grid as the tool pages, so nothing moves when you switch. `page` is set only for pages that exist in every language. */
export function SiteHeader({ lang, page }: { lang: Locale; page?: string }) {
  return (
    <PinnedHeader>
      <header className="topbar">
        <Link className="wordmark" href={localePath(lang)}><span className="wordmark-mark" aria-hidden />{SITE_NAME}</Link>
        <ToolSwitch lang={lang} variant="header" />
        <div className="topbar-actions">
          <LanguageSwitcher lang={lang} page={page} label={CHROME[lang].language} />
        </div>
      </header>
    </PinnedHeader>
  )
}
