'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SellerManageActions({
  sellerId,
  active,
  properties,
}: {
  sellerId: string
  active: boolean
  properties: { id: string; title: string; featured: boolean; featuredUntil: string | null }[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function suspend() {
    const reason = window.prompt('Reason for suspension (optional):')
    if (reason === null) return
    if (!window.confirm('Suspend this seller? Their published listings will be hidden.')) return

    setLoading('suspend')
    try {
      const res = await fetch(`/api/admin/sellers/${sellerId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      if (!res.ok) alert('Could not suspend seller')
      else router.refresh()
    } finally {
      setLoading(null)
    }
  }

  async function reactivate() {
    if (!window.confirm('Reactivate this seller?')) return
    setLoading('reactivate')
    try {
      const res = await fetch(`/api/admin/sellers/${sellerId}/reactivate`, {
        method: 'POST',
      })
      if (!res.ok) alert('Could not reactivate seller')
      else router.refresh()
    } finally {
      setLoading(null)
    }
  }

  async function expireAd(propertyId: string) {
    if (!window.confirm('End advertisement for this listing?')) return
    setLoading(`expire-${propertyId}`)
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}/expire-ad`, {
        method: 'POST',
      })
      if (!res.ok) alert('Could not end advertisement')
      else router.refresh()
    } finally {
      setLoading(null)
    }
  }

  const activeAds = properties.filter((p) => p.featured)

  return (
    <div className="flex flex-col gap-2">
      {active ? (
        <button
          type="button"
          onClick={suspend}
          disabled={!!loading}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
        >
          {loading === 'suspend' ? '…' : 'Suspend seller'}
        </button>
      ) : (
        <button
          type="button"
          onClick={reactivate}
          disabled={!!loading}
          className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 hover:bg-green-100 disabled:opacity-50"
        >
          {loading === 'reactivate' ? '…' : 'Reactivate'}
        </button>
      )}
      {activeAds.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => expireAd(p.id)}
          disabled={!!loading}
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50 text-left"
          title={p.title}
        >
          {loading === `expire-${p.id}` ? '…' : `End ad: ${p.title.slice(0, 24)}…`}
        </button>
      ))}
    </div>
  )
}
