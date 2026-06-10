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
      className="mt-10 w-full max-w-2xl"
    >
      {/* Tabs */}
      <div className="inline-flex rounded-2xl bg-white/[0.08] p-1.5 ring-1 ring-white/[0.12] backdrop-blur-xl">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
              tab === t.id
                ? 'text-white'
                : 'text-white/60 hover:text-white/90'
            }`}
          >
            {tab === t.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <motion.div 
        layout
        className={`mt-5 relative rounded-3xl bg-white/[0.08] backdrop-blur-xl border transition-all duration-500 p-6 sm:p-7 overflow-hidden ${
          isFocused ? 'border-amber-500/30 shadow-2xl shadow-amber-500/10' : 'border-white/[0.12]'
        }`}
      >
        {/* Subtle glow when focused */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-20 -left-20 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"
            />
          )}
        </AnimatePresence>

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
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 grid place-items-center shadow-lg shadow-amber-500/25">
                  <Sparkles className="h-5 w-5 text-white" aria-hidden />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    List your property on Homescout
                  </p>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">
                    Reach buyers and renters across South Africa. Upload photos, set
                    your price, and promote your listing.
                  </p>
                </div>
              </div>
              <Link
                href="/sell"
                className="group mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-4 text-sm font-bold text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02]"
              >
                Learn how to sell
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
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
              <p className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {tab === 'rent'
                  ? 'Find a rental you\'ll love'
                  : 'Find your next home'}
              </p>
              <p className="mt-2 text-sm text-white/50">
                Search by city, suburb or address across all 9 provinces.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-6 bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl ring-1 ring-black/5"
              >
                <div className="relative flex-1">
                  <MapPin
                    className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-300 ${
                      isFocused ? 'text-amber-500' : 'text-stone-400'
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
                    className="w-full pl-12 pr-4 py-4 text-stone-800 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-400/50 transition-shadow duration-300 placeholder:text-stone-400"
                  />
                </div>
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="px-4 py-4 text-stone-600 rounded-xl outline-none text-sm bg-stone-50 border-0 focus:ring-2 focus:ring-amber-400/50 transition-shadow duration-300 cursor-pointer hover:bg-stone-100"
                >
                  <option value="">Any price</option>
                  <option value="500000">Under R500k</option>
                  <option value="1000000">Under R1M</option>
                  <option value="2000000">Under R2M</option>
                  <option value="5000000">Under R5M</option>
                </select>
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-7 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="h-4 w-4" aria-hidden />
                  Search
                </button>
              </form>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-xs text-white/40 self-center mr-1">Popular:</span>
                {popularAreas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setQuery(area)}
                    className="rounded-full bg-white/[0.08] px-4 py-1.5 text-xs font-medium text-white/70 ring-1 ring-white/[0.1] hover:bg-white/[0.15] hover:text-white transition-all duration-300 hover:ring-white/20"
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
