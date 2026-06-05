import PropertyListingCard from '@/components/properties/PropertyListingCard'
import {
  getBrowseListings,
  getPropertyImageUrl,
  parseListingTypeFromParam,
  type PropertyFilters,
} from '@/lib/properties'
import { Info } from 'lucide-react'

type Props = {
  filters: PropertyFilters
  type: string
}

export default async function PropertiesBrowseResults({ filters, type }: Props) {
  const { properties, isDemo } = await getBrowseListings({
    ...filters,
    listingType: parseListingTypeFromParam(type),
  })

  const typeLabel =
    type === 'rent' ? 'rentals' : type === 'buy' ? 'homes for sale' : 'listings'

  return (
    <div className="mt-6 sm:mt-8">
      {isDemo && (
        <div className="mb-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:px-5 sm:py-4">
          <Info className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" aria-hidden />
          <p className="text-sm text-amber-900 leading-relaxed">
            These are <strong>sample listings</strong> so you can explore the site.
            Once sellers publish real properties, only live listings will appear here.
          </p>
        </div>
      )}

      <p className="text-sm font-medium text-stone-600">
        {properties.length}{' '}
        {properties.length === 1 ? typeLabel.replace(/s$/, '') : typeLabel}{' '}
        {isDemo ? '(sample)' : 'found'}
      </p>

      {properties.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center">
          <p className="text-stone-600 font-medium">No properties match your filters.</p>
          <p className="mt-2 text-sm text-stone-500">
            Try widening your search or check back when new sellers publish listings.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
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
              verified={p.verified}
              isDemo={isDemo}
            />
          ))}
        </div>
      )}
    </div>
  )
}
