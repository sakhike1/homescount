'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ListingManageActions({
  propertyId,
  title,
  published,
  status,
  sellerActive,
  featured,
}: {
  propertyId: string
  title: string
  published: boolean
  status: string
  sellerActive: boolean
  featured: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function callApi(
    key: string,
    url: string,
    method: 'POST' | 'DELETE',
    body?: object
  ) {
    setError(null)
    setLoading(key)
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Action failed')
        return
      }
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  async function unpublish() {
    if (!window.confirm(`Unpublish "${title}"? It will be hidden from buyers.`)) return
    await callApi('unpublish', `/api/admin/properties/${propertyId}/unpublish`, 'POST')
  }

  async function suspendListing() {
    const reason = window.prompt('Reason for suspending this listing (optional):')
    if (reason === null) return
    if (!window.confirm(`Suspend "${title}"? It will be hidden and marked pending review.`)) return
    await callApi('suspend', `/api/admin/properties/${propertyId}/suspend`, 'POST', { reason })
  }

  async function republish() {
    if (!window.confirm(`Publish "${title}" again?`)) return
    await callApi('republish', `/api/admin/properties/${propertyId}/republish`, 'POST')
  }

  async function remove() {
    if (!window.confirm(`Permanently delete "${title}"? This cannot be undone.`)) return
    await callApi('remove', `/api/admin/properties/${propertyId}/remove`, 'DELETE')
  }

  async function expireAd() {
    if (!window.confirm('End paid advertisement for this listing?')) return
    await callApi('expire', `/api/admin/properties/${propertyId}/expire-ad`, 'POST')
  }

  return (
    <div className="flex flex-col gap-1.5 min-w-[9rem]">
      {error && <p className="text-[10px] text-red-600 font-medium">{error}</p>}
      {published ? (
        <>
          <button
            type="button"
            onClick={unpublish}
            disabled={!!loading}
            className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
          >
            {loading === 'unpublish' ? '…' : 'Unpublish'}
          </button>
          <button
            type="button"
            onClick={suspendListing}
            disabled={!!loading}
            className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
          >
            {loading === 'suspend' ? '…' : 'Suspend'}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={republish}
          disabled={!!loading || !sellerActive}
          title={!sellerActive ? 'Reactivate seller first' : undefined}
          className="rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-bold text-green-800 hover:bg-green-100 disabled:opacity-50"
        >
          {loading === 'republish' ? '…' : 'Publish'}
        </button>
      )}
      {featured && (
        <button
          type="button"
          onClick={expireAd}
          disabled={!!loading}
          className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
        >
          {loading === 'expire' ? '…' : 'End ad'}
        </button>
      )}
      <Link
        href={`/properties/${propertyId}`}
        target="_blank"
        className="rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-bold text-stone-600 text-center hover:bg-stone-50"
      >
        View
      </Link>
      <button
        type="button"
        onClick={remove}
        disabled={!!loading}
        className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
      >
        {loading === 'remove' ? '…' : 'Delete'}
      </button>
      {!sellerActive && !published && (
        <p className="text-[10px] text-stone-500">Seller suspended</p>
      )}
      {status === 'PENDING' && (
        <p className="text-[10px] text-amber-700 font-medium">Under review</p>
      )}
    </div>
  )
}
