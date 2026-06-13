'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Check,
  Circle,
  CreditCard,
  Globe,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  LISTING_PACKAGES,
  formatPackagePrice,
  type ListingPackageKey,
} from '@/lib/listing-packages'

const CHECKLIST = [
  'Title',
  'Description',
  'Price',
  'Street address',
  'City',
  'Province',
  'Property size (m²)',
  'At least one photo',
] as const

type Props = {
  propertyId: string
  propertyTitle: string
  published: boolean
  missing: string[]
  currentPlan?: string
}

export default function ListingPackageCheckout({
  propertyId,
  propertyTitle,
  published,
  missing,
  currentPlan = 'NONE',
}: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<ListingPackageKey>('FEATURED')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const ready = missing.length === 0
  const packages = Object.values(LISTING_PACKAGES)

  async function handlePayAndPublish() {
    if (!ready) return

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch(`/api/properties/${propertyId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selected }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(
          data.missing?.length
            ? `Still needed: ${data.missing.join(', ')}`
            : data.error || 'Payment could not be completed'
        )
        return
      }

      setSuccess(true)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (published) {
    const active = LISTING_PACKAGES[currentPlan as ListingPackageKey]

    return (
      <div className="overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white shadow-sm">
        <div className="border-b border-green-100 px-6 py-5 sm:px-8">
          <p className="flex items-center gap-2 text-lg font-bold text-green-800">
            <Globe className="h-5 w-5" aria-hidden />
            Your listing is live
          </p>
          <p className="mt-1 text-sm text-green-700">
            <strong>{propertyTitle}</strong> is visible to buyers on Homescout.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-stone-900">
                {active?.label ?? 'Standard'} package
              </p>
              <p className="text-xs text-stone-500">Payment confirmed · listing published</p>
            </div>
          </div>
          <Link
            href="/properties"
            className="text-sm font-bold text-green-800 hover:underline"
          >
            View public listings →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      id="listing-checkout"
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
    >
      <div className="border-b border-stone-100 bg-gradient-to-br from-violet-950 via-violet-900 to-violet-800 px-6 py-8 text-white sm:px-8">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200">
          Step 3 — Final step
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Choose your listing package
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-violet-100/90">
          Select how you want your property promoted, complete payment, and your listing
          goes live immediately.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {!ready && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
            <p className="text-sm font-bold text-amber-900">
              Complete these items before checkout
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {CHECKLIST.map((item) => {
                const done = !missing.includes(item)
                return (
                  <li
                    key={item}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      done ? 'bg-white text-stone-600' : 'bg-amber-100/80 text-amber-900'
                    }`}
                  >
                    {done ? (
                      <Check className="h-4 w-4 shrink-0 text-green-600" aria-hidden />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0" aria-hidden />
                    )}
                    {item}
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          {packages.map((pkg) => {
            const isSelected = selected === pkg.key
            return (
              <button
                key={pkg.key}
                type="button"
                onClick={() => setSelected(pkg.key)}
                className={`relative flex flex-col rounded-2xl border-2 p-6 text-left transition ${
                  isSelected
                    ? 'border-violet-600 bg-violet-50/50 shadow-lg shadow-violet-900/10 ring-2 ring-violet-600/20'
                    : 'border-stone-200 bg-white hover:border-violet-300 hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    Most popular
                  </span>
                )}

                <p className="text-sm font-bold text-violet-700">{pkg.label}</p>
                <p className="mt-1 text-xs text-stone-500">{pkg.tagline}</p>
                <p className="mt-4 text-3xl font-black text-stone-900">
                  {formatPackagePrice(pkg.price)}
                </p>
                <p className="text-xs text-stone-400">{pkg.days}-day listing</p>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-stone-600"
                    >
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          isSelected ? 'text-violet-600' : 'text-stone-400'
                        }`}
                        aria-hidden
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <span
                  className={`mt-6 inline-flex items-center justify-center rounded-xl py-2.5 text-sm font-bold ${
                    isSelected
                      ? 'bg-violet-900 text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select package'}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-stone-900">Order summary</p>
              <p className="mt-1 text-stone-600">
                {LISTING_PACKAGES[selected].label} package for{' '}
                <strong>{propertyTitle || 'your listing'}</strong>
              </p>
              <p className="mt-3 text-2xl font-black text-stone-900">
                {formatPackagePrice(LISTING_PACKAGES[selected].price)}
              </p>
              <p className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Secure demo checkout — listing publishes instantly on payment
              </p>
            </div>

            <button
              type="button"
              onClick={handlePayAndPublish}
              disabled={loading || !ready}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-900 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-violet-900/25 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Processing payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" aria-hidden />
                  Pay & publish listing
                </>
              )}
            </button>
          </div>
        </div>

        {success && (
          <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            Payment successful — your listing is now live on Homescout!
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
