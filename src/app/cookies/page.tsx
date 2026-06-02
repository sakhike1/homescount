import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { LEGAL } from '@/lib/legal'
import { hasAnalyticsEnabled } from '@/lib/cookie-consent'

export const metadata: Metadata = {
  title: `Cookie Policy | ${LEGAL.siteName}`,
  description: `How ${LEGAL.siteName} uses cookies and similar technologies.`,
}

export default function CookiePolicyPage() {
  const analyticsConfigured = hasAnalyticsEnabled()

  return (
    <LegalPageLayout title="Cookie Policy">
      <p>
        This Cookie Policy explains how {LEGAL.operatorName} uses cookies and similar technologies
        on the Homescount website. It should be read together with our{' '}
        <Link href="/privacy" className="text-amber-700 font-semibold hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <section>
        <h2 className="text-lg font-bold text-stone-900">1. What are cookies?</h2>
        <p className="mt-2">
          Cookies are small text files stored on your device when you visit a website. They help
          the site remember preferences, keep you signed in, and understand how the site is used.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">2. How we use cookies</h2>
        <h3 className="mt-3 font-semibold text-stone-800">Strictly necessary (essential)</h3>
        <p className="mt-1">
          These cookies are required for the website to function. They include session and
          authentication cookies (for example, when you sign in as a buyer, seller, or admin) and
          security-related storage. You cannot opt out of essential cookies while using signed-in
          features.
        </p>
        <h3 className="mt-4 font-semibold text-stone-800">Preference</h3>
        <p className="mt-1">
          We store your cookie consent choice in your browser (local storage) so we do not show the
          banner on every visit.
        </p>
        <h3 className="mt-4 font-semibold text-stone-800">Analytics (optional)</h3>
        <p className="mt-1">
          {analyticsConfigured
            ? 'If you accept analytics cookies, we may use Google Analytics (or similar) to understand aggregated traffic and improve the site. These cookies are only placed after you consent via our cookie banner.'
            : 'We do not currently use analytics cookies on this site. If we enable analytics in future, we will update this policy and ask for your consent before placing non-essential tracking cookies.'}
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">3. Managing your choices</h2>
        <p className="mt-2">
          When you first visit Homescount, you can accept all cookies or continue with essential
          cookies only. You can change your browser settings to block or delete cookies; note that
          blocking essential cookies may prevent sign-in and other features from working.
        </p>
        <p className="mt-2">
          To clear your consent choice on this device, remove site data for Homescount in your
          browser settings — the cookie banner will appear again on your next visit.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">4. Third parties</h2>
        <p className="mt-2">
          Third-party services embedded on our site (such as payment or SMS providers when used)
          may set their own cookies. Their use is governed by their respective policies.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">5. Updates</h2>
        <p className="mt-2">
          We may update this Cookie Policy from time to time. The date at the top of this page
          indicates when it was last revised.
        </p>
      </section>
    </LegalPageLayout>
  )
}
