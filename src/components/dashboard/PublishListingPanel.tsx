'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, Circle, Globe, Loader2 } from 'lucide-react'

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

  const checklist = [
    'Title',
    'Description',
    'Price',
    'Street address',
    'City',
    'Province',
    'Property size (m²)',
    'At least one photo',
  ]

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
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
        <p className="flex items-center gap-2 font-bold text-green-800">
          <Globe className="h-5 w-5" />
          Published — live on Homescout
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
    <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-stone-900">Ready to publish?</h3>
      <p className="mt-2 text-sm text-stone-600">
        Complete the checklist below, then publish to make your listing visible to
        buyers and renters across South Africa.
      </p>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {checklist.map((item) => {
          const done = !missing.includes(item)
          return (
            <li
              key={item}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                done ? 'bg-white text-stone-700' : 'bg-violet-100/60 text-violet-900'
              }`}
            >
              {done ? (
                <Check className="h-4 w-4 shrink-0 text-green-600" aria-hidden />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-violet-500" aria-hidden />
              )}
              {item}
            </li>
          )
        })}
      </ul>

      {success && (
        <p className="mt-4 text-sm font-medium text-green-700">
          Published successfully!
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handlePublish}
        disabled={loading || missing.length > 0}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
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
