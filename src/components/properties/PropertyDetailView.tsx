import Link from 'next/link'
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Car,
  MapPin,
  Maximize2,
} from 'lucide-react'
import VerifiedBadge from '@/components/badges/VerifiedBadge'
import { formatPrice } from '@/lib/format-price'
import { getMatterportEmbedUrl } from '@/lib/virtual-tour'
import PropertyContactForm from '@/components/properties/PropertyContactForm'
import PropertyDescription from '@/components/properties/PropertyDescription'
import PropertyFeaturesSection from '@/components/properties/PropertyFeaturesSection'
import PropertyListingBond from '@/components/properties/PropertyListingBond'
import PropertyListingGallery from '@/components/properties/PropertyListingGallery'
import PropertyReportListing from '@/components/properties/PropertyReportListing'
import PropertySellerCard from '@/components/properties/PropertySellerCard'
import ListingQualityBadge from '@/components/properties/ListingQualityBadge'
import type { PropertyFeatures } from '@/lib/property-features'
import type { ListingSeller } from '@/components/properties/PropertySellerCard'

type Property = {
  id: string
  title: string
  description: string
  price: number
  location: string
  suburb: string
  city: string
  province: string
  bedrooms: number
  bathrooms: number
  parkings: number
  size: number
  type: string
  listingType: string
  verified?: boolean
  virtualTourUrl?: string | null
  createdAt?: string | Date
  qualityScore?: number
  features?: PropertyFeatures | null
  images: { id: string; url: string }[]
  seller: ListingSeller
}

function formatListingDate(value?: string | Date) {
  if (!value) return '—'
  const d = typeof value === 'string' ? new Date(value) : value
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

function listingRef(id: string) {
  return id.replace(/^demo-/, 'HS-').toUpperCase().slice(0, 12)
}

export default function PropertyDetailView({
  property,
  isDemo = false,
}: {
  property: Property
  isDemo?: boolean
}) {
  const isRent = property.listingType === 'RENT'
  const backHref = isRent ? '/properties?type=rent' : '/properties?type=buy'
  const backLabel = isRent ? 'Back to rentals' : 'Back to results'
  const address = property.suburb
    ? `${property.suburb}, ${property.location}`
    : property.location
  const tourEmbedUrl = property.virtualTourUrl
    ? getMatterportEmbedUrl(property.virtualTourUrl)
    : null

  const stats = [
    { icon: BedDouble, label: `${property.bedrooms} bed${property.bedrooms !== 1 ? 's' : ''}` },
    { icon: Bath, label: `${property.bathrooms} bath${property.bathrooms !== 1 ? 's' : ''}` },
    { icon: Car, label: `${property.parkings} garage${property.parkings !== 1 ? 's' : ''}` },
    { icon: Maximize2, label: `${property.size} m²` },
  ]

  return (
    <main className="min-h-screen bg-[#f8f7f5]">
      {/* Breadcrumb bar */}
      <div className="border-b border-stone-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 text-sm">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 font-semibold text-amber-700 hover:text-amber-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {backLabel}
          </Link>
          <span className="text-stone-300" aria-hidden>/</span>
          <Link href={`/properties?q=${encodeURIComponent(property.city)}`} className="text-stone-500 hover:text-stone-800">
            {property.city}
          </Link>
          {property.suburb && (
            <>
              <span className="text-stone-300" aria-hidden>/</span>
              <span className="text-stone-500">{property.suburb}</span>
            </>
          )}
          <span className="text-stone-300" aria-hidden>/</span>
          <span className="truncate font-medium text-stone-700">{listingRef(property.id)}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {isDemo && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Sample listing</strong> — sellers upload their own photos when they list on
            Homescout. Contact forms are disabled on demos.
          </div>
        )}

        {/* Gallery hero — full width */}
        <PropertyListingGallery
          images={property.images}
          title={property.title}
          propertyId={property.id}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Main column */}
          <div className="space-y-8 lg:col-span-8">
            {/* Price & title */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                    {formatPrice(property.price, property.listingType)}
                  </p>
                  {!isRent && (
                    <a
                      href="#bond-calculator"
                      className="mt-1 inline-block text-sm font-semibold text-amber-700 hover:text-amber-800 hover:underline"
                    >
                      Calculate bond costs
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                    {isRent ? 'For rent' : 'For sale'}
                  </span>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                    {property.type.replace(/_/g, ' ')}
                  </span>
                  {property.verified && <VerifiedBadge size="md" />}
                  {typeof property.qualityScore === 'number' && property.qualityScore > 0 && (
                    <ListingQualityBadge score={property.qualityScore} />
                  )}
                </div>
              </div>

              <h1 className="mt-4 text-2xl font-bold text-stone-900 sm:text-3xl">
                {property.bedrooms} Bedroom {property.type.replace(/_/g, ' ')} in{' '}
                {property.suburb || property.city}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-stone-600">
                <MapPin className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
                <span>
                  {address}, {property.city}, {property.province}
                </span>
              </p>

              {/* Quick stats bar */}
              <div className="mt-6 flex flex-wrap gap-4 border-y border-stone-100 py-5">
                {stats.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                    <Icon className="h-5 w-5 text-amber-600" aria-hidden />
                    {label}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-bold text-stone-900">Description</h2>
                <div className="mt-3">
                  <PropertyDescription text={property.description} />
                </div>
              </div>
            </div>

            <PropertyFeaturesSection
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              parkings={property.parkings}
              features={property.features}
            />

            {/* Property details grid */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold text-stone-900">Property details</h2>
              <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {[
                  ['Listing number', listingRef(property.id)],
                  ['Listing date', formatListingDate(property.createdAt)],
                  ['Property type', property.type.replace(/_/g, ' ')],
                  ['Listing type', isRent ? 'Rental' : 'Sale'],
                  ['Floor size', `${property.size} m²`],
                  ['Bedrooms', String(property.bedrooms)],
                  ['Bathrooms', String(property.bathrooms)],
                  ['Parking', String(property.parkings)],
                  ['City', property.city],
                  ['Province', property.province],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-stone-100 pb-3">
                    <dt className="text-sm text-stone-500">{label}</dt>
                    <dd className="text-sm font-semibold text-stone-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {tourEmbedUrl && (
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-lg font-bold text-stone-900">Virtual tour</h2>
                <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200">
                  <iframe
                    src={tourEmbedUrl}
                    title={`Virtual tour of ${property.title}`}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="fullscreen; vr"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            <div id="bond-calculator">
              <PropertyListingBond
                purchasePrice={property.price}
                listingType={property.listingType}
              />
            </div>

            <PropertyReportListing
              propertyId={property.id}
              propertyTitle={property.title}
              disabled={isDemo}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-6">
              <PropertySellerCard
                seller={property.seller}
                verified={property.verified}
                listingType={property.listingType}
                isDemo={isDemo}
                propertyTitle={property.title}
                listingAddress={`${address}, ${property.city}`}
              />
              <PropertyContactForm
                propertyId={property.id}
                propertyTitle={property.title}
                sellerName={property.seller.name}
                disabled={isDemo}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
