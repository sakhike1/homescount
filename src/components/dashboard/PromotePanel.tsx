'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Megaphone, Sparkles } from 'lucide-react'
import { AD_PLANS, type AdPlanKey } from '@/lib/ad-plans'

export default function PromotePanel({
  propertyId,
  featured,
  featuredUntil,
  adPlan,
}: {
  propertyId: string
  featured: boolean
  featuredUntil: string | null
  adPlan: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<AdPlanKey | null>(null)
  const [message, setMessage] = useState('')

  async function purchase(plan: AdPlanKey) {
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
        setMessage(data.error || 'Payment failed')
        return
      }
      setMessage('Advertising activated! Your listing is now promoted.')
      router.refresh()
    } catch {
      setMessage('Payment failed')
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
    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white">
          <Megaphone className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Advertise this listing</h3>
          <p className="text-sm text-gray-600">
            Boost visibility on Homescount. Demo checkout — no real payment yet.
          </p>
        </div>
      </div>

      {featured && untilLabel && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-white border border-amber-200 px-3 py-2 text-sm text-amber-800">
          <Sparkles className="h-4 w-4 shrink-0" />
          Active plan: <strong>{adPlan}</strong> until {untilLabel}
        </div>
      )}

      {message && (
        <p className="mb-4 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
          {message}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(AD_PLANS) as AdPlanKey[]).map((key) => {
          const plan = AD_PLANS[key]
          return (
            <button
              key={key}
              type="button"
              disabled={loading !== null}
              onClick={() => purchase(key)}
              className="rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-amber-400 hover:shadow-sm transition disabled:opacity-50"
            >
              <p className="font-bold text-gray-900">{plan.label}</p>
              <p className="mt-1 text-2xl font-black text-amber-600">
                R{plan.price}
              </p>
              <p className="mt-2 text-xs text-gray-500">{plan.description}</p>
              <p className="mt-3 text-xs font-bold text-amber-700">
                {loading === key ? 'Processing...' : 'Pay & activate →'}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
