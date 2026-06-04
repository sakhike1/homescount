import PropertyBrowseFilters from '@/components/properties/PropertyBrowseFilters'

import PropertyListingCard from '@/components/properties/PropertyListingCard'

import { getPropertyImageUrl } from '@/lib/properties'

import { Info } from 'lucide-react'



export type BrowseProperty = {

  id: string

  title: string

  price: number

  suburb: string

  location: string

  city: string

  province: string

  bedrooms: number

  bathrooms: number

  parkings: number

  size: number

  type: string

  listingType: string

  featured: boolean

  images: { url: string }[]

}



type Props = {

  properties: BrowseProperty[]

  filters: {

    type: string

    q?: string

    suburb?: string

    address?: string

    minPrice?: string

    maxPrice?: string

  }

  totalCount: number

  isDemo?: boolean

}



export default function PropertyBrowsePage({

  properties,

  filters,

  totalCount,

  isDemo = false,

}: Props) {

  const typeLabel =

    filters.type === 'rent'

      ? 'for rent'

      : filters.type === 'buy'

        ? 'for sale'

        : 'for sale & rent'



  return (

    <main className="min-h-screen bg-[#faf9f7]">

      <div className="border-b border-stone-200 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white px-4 py-14 sm:py-16">

        <div className="max-w-7xl mx-auto">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">

            Homescout listings

          </p>

          <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl">

            Find your next home {typeLabel}

          </h1>

          <p className="mt-4 text-stone-300 max-w-xl">

            {totalCount} {isDemo ? 'sample' : 'published'}{' '}

            {totalCount === 1 ? 'property' : 'properties'} across South Africa —

            verified sellers, clear prices, and support at every step.

          </p>

        </div>

      </div>



      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">

        {isDemo && (

          <div className="mb-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:px-5 sm:py-4">

            <Info className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" aria-hidden />

            <p className="text-sm text-amber-900 leading-relaxed">

              These are <strong>sample listings</strong> so you can explore the

              site. Once sellers publish real properties, only live listings will

              appear here.

            </p>

          </div>

        )}



        <PropertyBrowseFilters

          defaultType={filters.type}

          defaultQ={filters.q}

          defaultSuburb={filters.suburb}

          defaultAddress={filters.address}

          defaultMinPrice={filters.minPrice}

          defaultMaxPrice={filters.maxPrice}

        />



        {properties.length === 0 ? (

          <div className="mt-12 rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center">

            <p className="text-stone-600 font-medium">No properties match your filters.</p>

            <p className="mt-2 text-sm text-stone-500">

              Try widening your search or check back when new sellers publish listings.

            </p>

          </div>

        ) : (

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">

            {properties.map((p, i) => (

              <PropertyListingCard

                key={p.id}

                id={p.id}

                title={p.title}

                price={p.price}

                suburb={p.suburb}

                location={p.location}

                city={p.city}

                province={p.province}

                bedrooms={p.bedrooms}

                bathrooms={p.bathrooms}

                parkings={p.parkings}

                size={p.size}

                type={p.type}

                listingType={p.listingType}

                imageUrl={getPropertyImageUrl(p.images, i)}

                featured={p.featured}

                isDemo={isDemo}

              />

            ))}

          </div>

        )}

      </div>

    </main>

  )

}


