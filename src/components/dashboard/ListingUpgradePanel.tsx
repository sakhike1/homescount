'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUp, Loader2, Sparkles } from 'lucide-react'
import {
  LISTING_PACKAGES,
  formatPackagePrice,
  packageRank,
  type ListingPackageKey,
} from '@/lib/listing-packages'

export default function ListingUpgradePanel({
  propertyId,
  currentPlan,
  featuredUntil,
}: {
  propertyId: string
  currentPlan: string
  featuredUntil: string | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<ListingPackageKey | null>(null)
  const [message, setMessage] = useState('')

  const currentRank = packageRank(currentPlan)
  const upgrades = (Object.keys(LISTING_PACKAGES) as ListingPackageKey[]).filter(
    (key) => packageRank(key) > currentRank
  )

  if (upgrades.length === 0) return null

  async function upgrade(plan: ListingPackageKey) {
    setLoading(plan)
    setMessage('')

    try {
      const res = await fetch(`/api/properties/${propertyId}/promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Upgrade failed')
        return
      }
      setMessage('Package upgraded successfully.')
      router.refresh()
    } catch {
      setMessage('Upgrade failed')
    } finally {
      setLoading(null)
    }
  }

  const untilLabel = featuredUntil
    ? new Date(featuredUntil).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-900 text-white">
          <ArrowUp className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-lg font-bold text-stone-900">Upgrade your visibility</h3>
          <p className="mt-1 text-sm text-stone-600">
            You&apos;re on the{' '}
            <strong>
              {LISTING_PACKAGES[currentPlan as ListingPackageKey]?.label ?? 'Standard'}
            </strong>{' '}
            package
            {untilLabel ? ` until ${untilLabel}` : ''}. Upgrade for more exposure.
          </p>
        </div>
      </div>

      {message && (
        <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {message}
        </p>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {upgrades.map((key) => {
          const pkg = LISTING_PACKAGES[key]
          return (
            <button
              key={key}
              type="button"
              disabled={loading !== null}
              onClick={() => upgrade(key)}
              className="rounded-xl border border-stone-200 bg-white p-4 text-left transition hover:border-violet-400 hover:shadow-sm disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-600" aria-hidden />
                <p className="font-bold text-stone-900">{pkg.label}</p>
              </div>
              <p className="mt-1 text-xl font-black text-violet-900">
                {formatPackagePrice(pkg.price)}
              </p>
              <p className="mt-2 text-xs text-stone-500">{pkg.tagline}</p>
              <p className="mt-3 text-xs font-bold text-violet-700">
                {loading === key ? 'Processing...' : 'Upgrade package →'}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
