import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import TopNav from '@/components/TopNav'
import SiteFooter from '@/components/SiteFooter'
import AuthSessionProvider from '@/components/SessionProvider'
import ScrollToTop from '@/components/ScrollToTop'
import CookieConsent from '@/components/CookieConsent'
import AnalyticsScripts from '@/components/AnalyticsScripts'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  title: 'Homescount — Find Your Dream Home',
  description: 'Browse thousands of properties for sale across South Africa',
  icons: {
    icon: [{ url: '/logo-icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/logo-icon.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geist.className} min-h-full flex flex-col antialiased`}
      >
        <AuthSessionProvider>
          <TopNav />
          <div className="flex-1 flex flex-col">{children}</div>
          <SiteFooter />
          <CookieConsent />
          <AnalyticsScripts />
          <ScrollToTop />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
