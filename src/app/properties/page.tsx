import { Suspense } from 'react'
import PropertyBrowseFilters from '@/components/properties/PropertyBrowseFilters'
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
