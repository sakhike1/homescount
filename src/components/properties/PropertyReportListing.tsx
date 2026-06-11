'use client'

import { useState } from 'react'
import { Flag, Loader2 } from 'lucide-react'
import { formButtonPrimaryClass, formErrorClass, formInputClass, formSelectClass, formTextareaClass } from '@/lib/form-styles'

const REASONS = [
  { value: 'incorrect_price', label: 'Incorrect price' },
  { value: 'wrong_location', label: 'Wrong location or address' },
  { value: 'misleading_photos', label: 'Misleading photos' },
  { value: 'already_sold', label: 'Already sold or rented' },
  { value: 'spam', label: 'Spam or duplicate listing' },
  { value: 'other', label: 'Other' },
]

export default function PropertyReportListing({
  propertyId,
  propertyTitle,
  disabled,
}: {
  propertyId: string
  propertyTitle: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('misleading_photos')
  const [details, setDetails] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/properties/${propertyId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          details,
          reporterName: name,
          reporterEmail: email,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not submit report')
        return
      }
      setDone(true)
    } catch {
      setError('Could not submit report')
    } finally {
      setLoading(false)
    }
  }

  if (disabled) return null

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <Flag className="mt-0.5 h-5 w-5 shrink-0 text-stone-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-stone-900">Report this listing</h2>
          <p className="mt-1 text-sm text-stone-600">
            Something looks wrong with &ldquo;{propertyTitle}&rdquo;? Tell us what doesn&apos;t
            match the information shown.
          </p>
          {!open && !done && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-4 text-sm font-semibold text-amber-700 hover:text-amber-800 hover:underline"
            >
              Report listing
            </button>
          )}
          {done && (
            <p className="mt-4 text-sm font-medium text-emerald-700">
              Thank you — your report was submitted for review.
            </p>
          )}
          {open && !done && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {error && <div className={formErrorClass}>{error}</div>}
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={formSelectClass}
                >
                  {REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className={formTextareaClass}
                  placeholder="Describe what is incorrect or misleading about this listing…"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Your name <span className="font-normal text-stone-400">(optional)</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={formInputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Email <span className="font-normal text-stone-400">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={formInputClass}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={loading} className={formButtonPrimaryClass}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    'Submit report'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold text-stone-600 hover:text-stone-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
