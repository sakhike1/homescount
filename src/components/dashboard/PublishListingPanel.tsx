'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Globe, Loader2 } from 'lucide-react'

export default function PublishListingPanel({
  propertyId,
  published,
  missing,
}: {
  propertyId: string
  published: boolean
  missing: string[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handlePublish() {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch(`/api/properties/${propertyId}/publish`, {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok) {
        setError(
          data.missing?.length
            ? `Still needed: ${data.missing.join(', ')}`
            : data.error || 'Could not publish'
        )
        return
      }

      setSuccess(true)
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (published) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <p className="font-bold text-green-800 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Published — live on Homescount
        </p>
        <p className="mt-2 text-sm text-green-700">
          Buyers and renters can see this listing on the properties page.
        </p>
        <Link
          href="/properties"
          className="mt-4 inline-block text-sm font-bold text-green-800 hover:underline"
        >
          View public listings →
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
      <h3 className="text-lg font-bold text-stone-900">Publish listing</h3>
      <p className="mt-2 text-sm text-stone-600">
        When everything is complete — details, price, and at least one photo — publish
        to make this property visible to everyone on the properties page.
      </p>

      {missing.length > 0 && (
        <ul className="mt-4 text-sm text-amber-900 bg-white rounded-xl border border-amber-100 px-4 py-3 list-disc list-inside">
          {missing.map((item) => (
            <li key={item}>Add {item}</li>
          ))}
        </ul>
      )}

      {success && (
        <p className="mt-4 text-sm font-medium text-green-700">
          Published successfully!
        </p>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handlePublish}
        disabled={loading || missing.length > 0}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Publishing...
          </>
        ) : (
          <>
            <Globe className="h-4 w-4" />
            Publish to properties page
          </>
        )}
      </button>
    </div>
  )
}
