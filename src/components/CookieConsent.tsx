'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  COOKIE_CONSENT_KEY,
  hasAnalyticsEnabled,
  parseCookieConsent,
  type CookieConsentChoice,
} from '@/lib/cookie-consent'

function saveConsent(choice: CookieConsentChoice) {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(choice))
  window.dispatchEvent(new CustomEvent('Homescout-cookie-consent', { detail: choice }))
}

export default function CookieConsent() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const analyticsAvailable = hasAnalyticsEnabled()

  useEffect(() => {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      setVisible(false)
      return
    }
    const existing = parseCookieConsent(localStorage.getItem(COOKIE_CONSENT_KEY))
    setVisible(!existing)
  }, [pathname])

  if (!visible) return null

  function acceptAll() {
    saveConsent({
      essential: true,
      analytics: analyticsAvailable,
      decidedAt: new Date().toISOString(),
    })
    setVisible(false)
  }

  function essentialOnly() {
    saveConsent({
      essential: true,
      analytics: false,
      decidedAt: new Date().toISOString(),
    })
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none"
    >
      <div className="pointer-events-auto max-w-3xl mx-auto rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xl shadow-stone-900/15">
        <h2 id="cookie-consent-title" className="text-base font-bold text-stone-900">
          Cookies &amp; privacy
        </h2>
        <p id="cookie-consent-desc" className="mt-2 text-sm text-stone-600 leading-relaxed">
          We use essential cookies to keep you signed in and run Homescout.
          {analyticsAvailable
            ? ' With your permission, we also use analytics cookies to understand how the site is used.'
            : ' We do not use advertising cookies.'}{' '}
          See our{' '}
          <Link href="/cookies" className="font-semibold text-violet-700 hover:underline">
            Cookie Policy
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-semibold text-violet-700 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-2">
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-full bg-violet-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-800 transition"
          >
            {analyticsAvailable ? 'Accept all' : 'Accept & continue'}
          </button>
          {analyticsAvailable && (
            <button
              type="button"
              onClick={essentialOnly}
              className="rounded-full border border-stone-200 bg-stone-50 px-5 py-2.5 text-sm font-bold text-stone-800 hover:bg-stone-100 transition"
            >
              Essential only
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
