'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, ArrowRight, Sparkles } from 'lucide-react'

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
  const [isFocused, setIsFocused] = useState(false)

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 w-full max-w-xl"
    >
      <div className="inline-flex rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/15">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              tab === t.id
                ? 'text-violet-900'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {tab === t.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-white shadow-md"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <motion.div
        layout
        className={`mt-4 relative rounded-2xl bg-white/10 ring-1 transition-all duration-500 p-5 sm:p-6 overflow-hidden ${
          isFocused ? 'ring-violet-300/40 shadow-lg shadow-violet-900/20' : 'ring-white/15'
        }`}
      >
        <AnimatePresence mode="wait">
          {tab === 'sell' ? (
            <motion.div
              key="sell"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white grid place-items-center shadow-md">
                  <Sparkles className="h-5 w-5 text-violet-700" aria-hidden />
                </div>
                <div>
                  <p className="text-lg font-bold text-white tracking-tight">
                    List your property on Homescout
                  </p>
                  <p className="mt-2 text-sm text-violet-100/70 leading-relaxed">
                    Reach buyers and renters across South Africa. Upload photos, set
                    your price, and promote your listing.
                  </p>
                </div>
              </div>
              <Link
                href="/sell"
                className="group mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-violet-900 hover:bg-violet-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Learn how to sell
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-900 text-white">
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-base font-bold text-white tracking-tight">
                {tab === 'rent'
                  ? "Find a rental you'll love"
                  : 'Find your next home'}
              </p>
              <p className="mt-1.5 text-sm text-violet-100/60">
                Search by city, suburb or address across all 9 provinces.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-4 bg-white rounded-xl p-1.5 flex flex-col sm:flex-row gap-1.5 shadow-lg ring-1 ring-black/5"
              >
                <div className="relative flex-1">
                  <MapPin
                    className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300 ${
                      isFocused ? 'text-violet-600' : 'text-stone-400'
                    }`}
                    aria-hidden
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="City, suburb or address..."
                    className="w-full pl-10 pr-3 py-3 text-stone-800 rounded-lg outline-none text-sm focus:ring-2 focus:ring-violet-400/50 transition-shadow duration-300 placeholder:text-stone-400"
                  />
                </div>
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="px-3 py-3 text-stone-600 rounded-lg outline-none text-sm bg-stone-50 border-0 focus:ring-2 focus:ring-violet-400/50 transition-shadow duration-300 cursor-pointer hover:bg-stone-100"
                >
                  <option value="">Any price</option>
                  <option value="500000">Under R500k</option>
                  <option value="1000000">Under R1M</option>
                  <option value="2000000">Under R2M</option>
                  <option value="5000000">Under R5M</option>
                </select>
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 bg-violet-900 text-white px-5 py-3 rounded-lg font-semibold hover:bg-violet-800 transition-all duration-300 text-sm shadow-md active:scale-[0.98]"
                >
                  <Search className="h-4 w-4" aria-hidden />
                  Search
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-violet-100/50 self-center mr-1">Popular:</span>
                {popularAreas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setQuery(area)}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-violet-100/80 ring-1 ring-white/15 hover:bg-white/20 hover:text-white transition-all duration-300"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
