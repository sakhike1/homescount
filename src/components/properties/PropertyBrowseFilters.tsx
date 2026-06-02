'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

const filterInputClass =
  'w-full rounded-full border border-gray-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition-[box-shadow,border-color,background-color] focus:outline-none focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200/80'

const heroFieldClass =
  'w-full rounded-2xl border border-stone-200/80 bg-stone-50/60 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200/60'

type Props = {
  variant?: 'default' | 'hero'
  defaultType?: string
  defaultQ?: string
  defaultSuburb?: string
  defaultAddress?: string
  defaultMinPrice?: string
  defaultMaxPrice?: string
}

function buildParamsFromForm(form: HTMLFormElement, type: string) {
  const data = new FormData(form)
  const params = new URLSearchParams()

  if (type !== 'all') {
    params.set('type', type)
  }

  for (const key of ['q', 'suburb', 'address', 'minPrice', 'maxPrice'] as const) {
    const value = String(data.get(key) ?? '').trim()
    if (value) params.set(key, value)
  }

  return params
}

export default function PropertyBrowseFilters({
  variant = 'default',
  defaultType = 'all',
  defaultQ = '',
  defaultSuburb = '',
  defaultAddress = '',
  defaultMinPrice = '',
  defaultMaxPrice = '',
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeType = searchParams.get('type') ?? defaultType ?? 'all'
  const isHero = variant === 'hero'

  const navigateWithForm = useCallback(
    (form: HTMLFormElement, type: string) => {
      const params = buildParamsFromForm(form, type)
      const qs = params.toString()
      router.push(qs ? `/properties?${qs}` : '/properties')
    },
    [router]
  )

  const onTypeChange = (type: string, form: HTMLFormElement | null) => {
    if (form) {
      navigateWithForm(form, type)
      return
    }
    const params = new URLSearchParams(searchParams.toString())
    if (type === 'all') {
      params.delete('type')
    } else {
      params.set('type', type)
    }
    const qs = params.toString()
    router.push(qs ? `/properties?${qs}` : '/properties')
  }

  const typeTabs = (
    <div className={`flex flex-wrap gap-2 ${isHero ? 'shrink-0' : ''}`}>
      {[
        { value: 'all', label: 'All' },
        { value: 'buy', label: 'Buy' },
        { value: 'rent', label: 'Rent' },
      ].map((tab) => (
        <label
          key={tab.value}
          className={`cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition ${
            activeType === tab.value
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <input
            type="radio"
            name="type"
            value={tab.value}
            checked={activeType === tab.value}
            onChange={(e) => onTypeChange(tab.value, e.currentTarget.form)}
            className="sr-only"
          />
          {tab.label}
        </label>
      ))}
    </div>
  )

  return (
    <form
      id="property-browse-filters"
      action="/properties"
      method="get"
      className={
        isHero
          ? 'rounded-[1.5rem] sm:rounded-[1.75rem] bg-white p-5 sm:p-6 lg:p-8 shadow-2xl shadow-stone-900/10 ring-1 ring-stone-200/60 space-y-4 sm:space-y-5'
          : 'rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-7 shadow-sm space-y-5'
      }
      onSubmit={(e) => {
        e.preventDefault()
        const form = e.currentTarget
        const type =
          (new FormData(form).get('type') as string | null) ?? activeType ?? 'all'
        navigateWithForm(form, type)
      }}
    >
      {isHero ? (
        <>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400"
                aria-hidden
              />
              <input
                name="q"
                defaultValue={defaultQ}
                placeholder="Enter an address, city or area"
                className={`${heroFieldClass} pl-11 rounded-full`}
              />
            </div>
            {typeTabs}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              name="suburb"
              defaultValue={defaultSuburb}
              placeholder="Suburb"
              className={heroFieldClass}
              aria-label="Suburb"
            />
            <input
              name="address"
              defaultValue={defaultAddress}
              placeholder="Street / address"
              className={heroFieldClass}
              aria-label="Street or address"
            />
            <input
              name="minPrice"
              type="number"
              min="0"
              defaultValue={defaultMinPrice}
              placeholder="Min price (R)"
              className={heroFieldClass}
              aria-label="Minimum price"
            />
            <input
              name="maxPrice"
              type="number"
              min="0"
              defaultValue={defaultMaxPrice}
              placeholder="Max price (R)"
              className={heroFieldClass}
              aria-label="Maximum price"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            <p className="text-xs text-stone-500 flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
              Refine with suburb, address, and price range
            </p>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-stone-900 px-10 py-3.5 text-sm font-bold text-white shadow-lg shadow-stone-900/20 hover:bg-stone-800 transition"
            >
              Search properties
            </button>
          </div>
        </>
      ) : (
        <>
          {typeTabs}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 pl-1">
                City or area
              </label>
              <input
                name="q"
                defaultValue={defaultQ}
                placeholder="e.g. Sandton, Cape Town"
                className={filterInputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 pl-1">
                Suburb
              </label>
              <input
                name="suburb"
                defaultValue={defaultSuburb}
                placeholder="e.g. Bryanston"
                className={filterInputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 pl-1">
                Street / address
              </label>
              <input
                name="address"
                defaultValue={defaultAddress}
                placeholder="e.g. Main Road"
                className={filterInputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 pl-1">
                Min price (R)
              </label>
              <input
                name="minPrice"
                type="number"
                min="0"
                defaultValue={defaultMinPrice}
                placeholder="0"
                className={filterInputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 pl-1">
                Max price (R)
              </label>
              <input
                name="maxPrice"
                type="number"
                min="0"
                defaultValue={defaultMaxPrice}
                placeholder="Any"
                className={filterInputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto rounded-full bg-stone-900 px-10 py-3.5 text-sm font-bold text-white shadow-sm shadow-stone-900/20 hover:bg-stone-800 transition"
          >
            Search properties
          </button>
        </>
      )}
    </form>
  )
}
