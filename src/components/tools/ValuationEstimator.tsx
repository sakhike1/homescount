'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, Loader2, TrendingUp } from 'lucide-react'
import {
  formButtonPrimaryClass,
  formInputClass,
  formSelectClass,
} from '@/lib/form-styles'

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
]

type ValuationResult = {
  estimatedLow: number
  estimatedHigh: number
  estimatedMid: number
  pricePerSqm: number | null
  comparableCount: number
  confidence: 'low' | 'medium' | 'high'
  message: string
}

function formatRand(n: number) {
  return `R ${n.toLocaleString('en-ZA')}`
}

export default function ValuationEstimator() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ValuationResult | null>(null)
  const [form, setForm] = useState({
    suburb: '',
    city: '',
    province: 'Gauteng',
    bedrooms: '3',
    bathrooms: '2',
    size: '',
    type: 'HOUSE',
    listingType: 'SALE',
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/tools/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Valuation failed')
        return
      }
      setResult(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const confidenceColor = {
    low: 'bg-amber-100 text-amber-800',
    medium: 'bg-sky-100 text-sky-800',
    high: 'bg-emerald-100 text-emerald-800',
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Suburb</label>
            <input
              required
              value={form.suburb}
              onChange={(e) => update('suburb', e.target.value)}
              className={formInputClass}
              placeholder="Sandton"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">City</label>
            <input
              required
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              className={formInputClass}
              placeholder="Johannesburg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Province</label>
            <select
              value={form.province}
              onChange={(e) => update('province', e.target.value)}
              className={formSelectClass}
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Listing type</label>
            <select
              value={form.listingType}
              onChange={(e) => update('listingType', e.target.value)}
              className={formSelectClass}
            >
              <option value="SALE">For sale</option>
              <option value="RENT">For rent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Property type</label>
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              className={formSelectClass}
            >
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="TOWNHOUSE">Townhouse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Size (m²)</label>
            <input
              type="number"
              min="0"
              value={form.size}
              onChange={(e) => update('size', e.target.value)}
              className={formInputClass}
              placeholder="180"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Bedrooms</label>
            <input
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={(e) => update('bedrooms', e.target.value)}
              className={formInputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Bathrooms</label>
            <input
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={(e) => update('bathrooms', e.target.value)}
              className={formInputClass}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className={formButtonPrimaryClass}>
          {loading ? (
            <>
              <Loader2 className="inline h-4 w-4 animate-spin mr-2" aria-hidden />
              Estimating…
            </>
          ) : (
            <>
              <Calculator className="inline h-4 w-4 mr-2" aria-hidden />
              Get estimate
            </>
          )}
        </button>
      </form>

      {result && result.comparableCount > 0 && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-amber-600" aria-hidden />
            <h2 className="text-lg font-bold text-stone-900">Estimated value range</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${confidenceColor[result.confidence]}`}
            >
              {result.confidence} confidence
            </span>
          </div>

          <p className="text-3xl sm:text-4xl font-black text-amber-600">
            {formatRand(result.estimatedLow)} – {formatRand(result.estimatedHigh)}
          </p>
          <p className="mt-2 text-stone-600">
            Mid-point estimate: <strong>{formatRand(result.estimatedMid)}</strong>
          </p>
          {result.pricePerSqm != null && (
            <p className="mt-1 text-sm text-stone-500">
              Avg. {formatRand(result.pricePerSqm)}/m² from comparables
            </p>
          )}
          <p className="mt-4 text-sm text-stone-600">{result.message}</p>
          <p className="mt-2 text-xs text-stone-400">
            Based on {result.comparableCount} similar listing
            {result.comparableCount === 1 ? '' : 's'} on Homescout. Not a formal valuation.
          </p>

          <Link
            href={`/properties?type=${form.listingType === 'RENT' ? 'rent' : 'buy'}&suburb=${encodeURIComponent(form.suburb)}&maxPrice=${result.estimatedHigh}`}
            className="mt-6 inline-flex items-center text-sm font-bold text-amber-700 hover:underline"
          >
            Browse listings in this range →
          </Link>
        </div>
      )}

      {result && result.comparableCount === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
          <p className="text-stone-600">{result.message}</p>
        </div>
      )}
    </div>
  )
}
