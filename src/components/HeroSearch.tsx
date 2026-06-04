'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Search } from 'lucide-react'

type SearchTab = 'buy' | 'rent' | 'sell'

const tabs: { id: SearchTab; label: string }[] = [
  { id: 'buy', label: 'Buy' },
  { id: 'rent', label: 'Rent' },
  { id: 'sell', label: 'Sell' },
]

const popularAreas = ['Sandton', 'Cape Town', 'Durban', 'Pretoria', 'Stellenbosch']

export default function HeroSearch() {
  const router = useRouter()
  const [tab, setTab] = useState<SearchTab>('buy')
  const [query, setQuery] = useState('')
  const [price, setPrice] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (price) params.set('price', price)

    if (tab === 'sell') {
      router.push('/sell')
      return
    }

    const base = tab === 'rent' ? '/rent' : '/buy'
    const qs = params.toString()
    router.push(qs ? `${base}?${qs}` : base)
  }

  return (
    <div className="mt-8 w-full max-w-2xl">
      {/* Tabs */}
      <div className="inline-flex rounded-full bg-black/30 p-1 ring-1 ring-white/15 backdrop-blur">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur p-5 sm:p-6">
        {tab === 'sell' ? (
          <>
            <p className="text-base sm:text-lg font-bold text-white tracking-tight">
              List your property on Homescout
            </p>
            <p className="mt-2 text-xs sm:text-sm text-white/80">
              Reach buyers and renters across South Africa. Upload photos, set
              your price, and promote your listing.
            </p>
            <Link
              href="/sell"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white hover:bg-amber-600 transition shadow-lg shadow-amber-500/20"
            >
              Learn how to sell
            </Link>
          </>
        ) : (
          <>
            <p className="text-base sm:text-lg font-bold text-white tracking-tight">
              {tab === 'rent'
                ? 'Find a rental you’ll love'
                : 'Find your next home'}
            </p>
            <p className="mt-2 text-xs sm:text-sm text-white/80">
              Search by city, suburb or address across all 9 provinces.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-5 bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-xl ring-1 ring-black/5"
            >
              <div className="relative flex-1">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                  aria-hidden
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="City, suburb or address..."
                  className="w-full pl-10 pr-4 py-3 text-stone-800 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-400/40"
                />
              </div>
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="px-4 py-3 text-stone-600 rounded-xl outline-none text-sm bg-stone-50 border-0 focus:ring-2 focus:ring-amber-400/40"
              >
                <option value="">Any price</option>
                <option value="500000">Under R500k</option>
                <option value="1000000">Under R1M</option>
                <option value="2000000">Under R2M</option>
                <option value="5000000">Under R5M</option>
              </select>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition text-sm shadow-md shadow-amber-500/25"
              >
                <Search className="h-4 w-4" aria-hidden />
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {popularAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setQuery(area)}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15 hover:bg-white/20 transition"
                >
                  {area}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
