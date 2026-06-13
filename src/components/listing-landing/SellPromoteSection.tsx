import Link from 'next/link'
import { LISTING_PACKAGES, formatPackagePrice } from '@/lib/listing-packages'
import { Check, Megaphone } from 'lucide-react'

export default function SellPromoteSection() {
  const plans = Object.values(LISTING_PACKAGES)

  return (
    <section className="section-warm border-t border-stone-100 px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex max-w-2xl items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-900 text-white">
            <Megaphone className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-section-title text-2xl font-bold text-stone-900 sm:text-3xl">
              Listing packages
            </h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              Choose a package when you publish — pay once and your listing goes live
              immediately. Upgrade anytime from your dashboard.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative rounded-2xl border bg-white p-6 shadow-sm ${
                plan.popular
                  ? 'border-violet-300 ring-2 ring-violet-100'
                  : 'border-stone-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}
              <p className="text-sm font-bold text-violet-700">{plan.label}</p>
              <p className="mt-3 text-2xl font-bold text-stone-900">
                {formatPackagePrice(plan.price)}
              </p>
              <p className="text-sm text-stone-500">{plan.days}-day listing</p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {plan.tagline}
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.slice(0, 4).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs text-stone-600"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-stone-500">
          Create a seller account, add your listing, then pick a package at checkout.{' '}
          <Link
            href="/register?role=SELLER"
            className="font-bold text-violet-700 hover:text-violet-800"
          >
            Get started free
          </Link>
        </p>
      </div>
    </section>
  )
}
