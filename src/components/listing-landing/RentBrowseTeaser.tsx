import Link from 'next/link'
import PropertyListingCard from '@/components/properties/PropertyListingCard'
import { getPropertyImageUrl } from '@/lib/properties'
import { ArrowRight } from 'lucide-react'

type Property = {
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

export default function RentBrowseTeaser({
  properties,
  browseHref,
  isDemo = false,
  variant = 'rent',
}: {
  properties: Property[]
  browseHref: string
  isDemo?: boolean
  variant?: 'rent' | 'buy'
}) {
  const isBuy = variant === 'buy'
  const emptyTitle = isBuy ? 'Homes for sale' : 'Available rentals'
  const emptyBody = isBuy
    ? 'No published sale listings yet. Check back soon or list your property as a seller.'
    : 'No published rentals yet. Check back soon or list your property as a seller.'
  const emptyLink = isBuy ? '/properties?type=buy' : '/properties?type=rent'
  const emptyLinkLabel = isBuy ? 'View all homes for sale' : 'View all rentals'
  const featuredTitle = isBuy ? 'Featured homes for sale' : 'Featured rentals'
  const featuredBody = isDemo
    ? isBuy
      ? 'Sample listings to explore the site — real homes appear once sellers publish.'
      : 'Sample rentals to explore the site — real listings appear once sellers publish.'
    : isBuy
      ? 'A sample of homes currently for sale on Homescount.'
      : 'A sample of homes currently available to rent on Homescount.'
  const viewAllLabel = isBuy ? 'View all for sale' : 'View all rentals'

  if (properties.length === 0) {
    return (
      <section className="section-white px-4 py-14 border-t border-stone-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-stone-900">{emptyTitle}</h2>
          <p className="mt-3 text-stone-600">{emptyBody}</p>
          <Link
            href={emptyLink}
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800"
          >
            {emptyLinkLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-white px-4 py-14 sm:py-16 border-t border-stone-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 text-section-title">
              {featuredTitle}
            </h2>
            <p className="mt-2 text-stone-600">{featuredBody}</p>
          </div>
          <Link
            href={browseHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800 shrink-0"
          >
            {viewAllLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
      </div>
    </section>
  )
}
