import Link from 'next/link'
import BondCalculator from '@/components/tools/BondCalculator'
import { buildPageMetadata } from '@/lib/seo'
import { CircleDollarSign } from 'lucide-react'

export const metadata = buildPageMetadata({
  title: 'Bond Affordability Calculator',
  description:
    'Estimate how much property you can afford in South Africa. Enter monthly income and expenses to see max bond repayment, loan amount, and homes in your budget.',
  path: '/tools/bond-calculator',
  keywords: [
    'bond calculator South Africa',
    'home loan affordability',
    'how much house can I afford',
    'bond repayment calculator',
    'mortgage affordability SA',
  ],
})

export default function BondCalculatorPage() {
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
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300/90">
                <CircleDollarSign className="h-3.5 w-3.5" aria-hidden />
                Buyer tool
              </p>
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-display">
                Bond affordability calculator
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/75 leading-relaxed">
                See what home price you may qualify for based on your income and monthly expenses —
                then browse listings that fit your budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:py-14">
        <BondCalculator />
      </section>
    </main>
  )
}
