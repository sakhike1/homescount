'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import {
  COOKIE_CONSENT_KEY,
  hasAnalyticsEnabled,
  parseCookieConsent,
} from '@/lib/cookie-consent'

export default function AnalyticsScripts() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  const [loadAnalytics, setLoadAnalytics] = useState(false)

  useEffect(() => {
    if (!hasAnalyticsEnabled()) return

    function check() {
      const consent = parseCookieConsent(localStorage.getItem(COOKIE_CONSENT_KEY))
      setLoadAnalytics(Boolean(consent?.analytics))
    }

    check()
    window.addEventListener('homescount-cookie-consent', check)
    window.addEventListener('storage', check)
    return () => {
      window.removeEventListener('homescount-cookie-consent', check)
      window.removeEventListener('storage', check)
    }
  }, [])

  if (!measurementId || !loadAnalytics) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
