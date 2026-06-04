export const COOKIE_CONSENT_KEY = 'Homescout-cookie-consent'

export type CookieConsentChoice = {
  essential: true
  analytics: boolean
  decidedAt: string
}

export function parseCookieConsent(raw: string | null): CookieConsentChoice | null {
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as CookieConsentChoice
    if (data.essential !== true || typeof data.analytics !== 'boolean') return null
    return data
  } catch {
    return null
  }
}

export function hasAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim())
}
