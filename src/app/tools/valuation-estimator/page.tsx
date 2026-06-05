import Link from 'next/link'
import ValuationEstimator from '@/components/tools/ValuationEstimator'
import { buildPageMetadata } from '@/lib/seo'
import { TrendingUp } from 'lucide-react'

export const metadata = buildPageMetadata({
  title: 'Property Valuation Estimator',
  description:
    'Get an estimated price range for your home based on comparable listings on Homescout. Enter suburb, size, and bedrooms for a data-driven estimate.',
  path: '/tools/valuation-estimator',
  keywords: [
    'property valuation South Africa',
    'home value estimate',
    'house price calculator',
    'property comparables SA',
  ],
})

export default function ValuationEstimatorPage() {
  return (
    <main className="bg-[#faf9f7] min-h-screen">
      <section className="relative overflow-hidden border-b border-stone-200/80 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_0%,rgba(251,191,36,0.22),transparent_55%)]"
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <Link
            href="/buy"
            className="text-sm font-semibold text-amber-200/90 hover:text-amber-100 transition"
          >
            ← Buying a home
          </Link>
          <div className="mt-6 max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300/90">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />
              Buyer & seller tool
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Property valuation estimator
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/75 leading-relaxed">
              See what similar homes are listed for on Homescout — powered by real comparables
              from our database, not generic national averages.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:py-14">
        <ValuationEstimator />
      </section>
    </main>
  )
}
