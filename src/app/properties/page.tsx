import { Suspense } from 'react'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'
import PropertyBrowseFilters from '@/components/properties/PropertyBrowseFilters'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; q?: string }>
}): Promise<Metadata> {
  const { type, q } = await searchParams
  const isRent = type === 'rent'
  const isBuy = type === 'buy' || !type

  if (q?.trim()) {
    return buildPageMetadata({
      title: `Properties matching “${q.trim()}”`,
      description: `Search results for “${q.trim()}” — homes and apartments for ${isRent ? 'rent' : 'sale'} on Homescout across South Africa.`,
      path: `/properties?q=${encodeURIComponent(q.trim())}`,
    })
  }

  if (isRent) {
    return buildPageMetadata({
      title: 'Rental Property Search',
      description:
        'Search all rental listings on Homescout. Filter by price, suburb, and city to find apartments and houses to rent.',
      path: '/properties?type=rent',
      keywords: ['rental property search', 'apartments to rent', 'lease homes South Africa'],
    })
  }

  return buildPageMetadata({
    title: isBuy ? 'Property Search — Homes for Sale' : 'Property Search',
    description:
      'Search thousands of homes for sale and rent. Use filters for price, location, and listing type across all South African provinces.',
    path: isBuy ? '/properties?type=buy' : '/properties',
    keywords: ['property search', 'real estate listings', 'browse homes South Africa'],
  })
}
import PropertyBrowseHero from '@/components/properties/PropertyBrowseHero'
import PropertiesBrowseResults from '@/components/properties/PropertiesBrowseResults'
import PropertiesGridSkeleton from '@/components/properties/PropertiesGridSkeleton'

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string
    q?: string
    suburb?: string
    address?: string
    minPrice?: string
    maxPrice?: string
    price?: string
  }>
}) {
  const params = await searchParams
  const type = params.type ?? 'all'

  const filters = {
    q: params.q,
    suburb: params.suburb,
    address: params.address,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice
      ? Number(params.maxPrice)
      : params.price
        ? Number(params.price)
        : undefined,
  }

  const filterKey = JSON.stringify({ type, ...params })
  const locationHint = params.q || params.suburb || undefined

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <PropertyBrowseHero type={type} locationHint={locationHint}>
        <Suspense
          fallback={
            <div className="rounded-[1.75rem] bg-white p-8 h-52 animate-pulse shadow-2xl" />
          }
        >
          <PropertyBrowseFilters
            key={filterKey}
            variant="hero"
            defaultType={type}
            defaultQ={params.q}
            defaultSuburb={params.suburb}
            defaultAddress={params.address}
            defaultMinPrice={params.minPrice}
            defaultMaxPrice={params.maxPrice}
          />
        </Suspense>
      </PropertyBrowseHero>

      <div className="max-w-7xl mx-auto px-4 pb-10 sm:pb-14">
        <Suspense key={filterKey} fallback={<PropertiesGridSkeleton />}>
          <PropertiesBrowseResults filters={filters} type={type} />
        </Suspense>
      </div>
    </main>
  )
}
