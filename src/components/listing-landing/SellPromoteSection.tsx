import Link from 'next/link'
import { AD_PLANS } from '@/lib/ad-plans'
import { Megaphone, Sparkles } from 'lucide-react'

export default function SellPromoteSection() {
  const plans = Object.entries(AD_PLANS)

  return (
    <section className="section-warm px-4 py-14 sm:py-16 border-t border-stone-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-3 max-w-2xl">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-amber-400">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 text-section-title">
              Promote your listing
            </h2>
            <p className="mt-2 text-stone-600 leading-relaxed">
              Optional paid boosts after you publish — more visibility on the
              homepage and in search results.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(([key, plan]) => (
            <div
              key={key}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  {plan.label}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-stone-900">
                R {plan.price.toLocaleString('en-ZA')}
              </p>
              <p className="text-sm text-stone-500">{plan.days} days</p>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                {plan.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-stone-500">
          Promote from your seller dashboard after a listing is published.{' '}
          <Link
            href="/register?role=SELLER"
            className="font-bold text-amber-700 hover:text-amber-800"
          >
            Create a seller account
          </Link>
        </p>
      </div>
    </section>
  )
}
