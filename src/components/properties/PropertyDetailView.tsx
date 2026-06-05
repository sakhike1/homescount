import Link from 'next/link'
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Car,
  Home,
  Mail,
  MapPin,
  Maximize2,
  UserRound,
} from 'lucide-react'
import SafeImage from '@/components/SafeImage'
import VerifiedBadge from '@/components/badges/VerifiedBadge'
import { formatPrice } from '@/lib/properties'
import { getMatterportEmbedUrl } from '@/lib/virtual-tour'
import PropertyContactForm from '@/components/properties/PropertyContactForm'
import PropertyJourneyGuide from '@/components/properties/PropertyJourneyGuide'

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
  images: { id: string; url: string }[]
  seller: { name: string; email: string }
}

export default function PropertyDetailView({
  property,
  isDemo = false,
}: {
  property: Property
  isDemo?: boolean
}) {
  const mainImage = property.images[0]?.url
  const area = property.suburb
    ? `${property.suburb}, ${property.location}`
    : property.location

  const isRent = property.listingType === 'RENT'
  const backHref = isRent ? '/properties?type=rent' : '/properties?type=buy'
  const backLabel = isRent ? 'Back to rentals' : 'Back to homes for sale'
  const tourEmbedUrl = property.virtualTourUrl
    ? getMatterportEmbedUrl(property.virtualTourUrl)
    : null

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <section className="px-4 pt-4 sm:pt-6 pb-2">
        <div className="max-w-7xl mx-auto">
          <nav
            className="flex flex-wrap items-center gap-2 sm:gap-3"
            aria-label="Property navigation"
          >
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 shadow-sm ring-1 ring-stone-900/[0.04] transition hover:border-amber-200 hover:bg-amber-50/60 hover:text-amber-900"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
              {backLabel}
            </Link>
            <span className="hidden sm:inline text-stone-300" aria-hidden>
              /
            </span>
            <span className="hidden sm:inline min-w-0 max-w-xl truncate text-sm font-medium text-stone-500">
              {property.title}
            </span>
            <Link
              href="/properties"
              className="sm:ml-auto text-sm font-bold text-amber-700 hover:text-amber-800 hover:underline underline-offset-2"
            >
              All properties
            </Link>
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-8 sm:pb-10">
        {isDemo && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            This is a <strong>sample listing</strong> for preview purposes. Contact
            forms are disabled until real sellers publish live properties.
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-8 space-y-6">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-200 ring-1 ring-stone-200">
              {mainImage && (
                <SafeImage
                  src={mainImage}
                  alt={property.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 66vw"
                />
              )}
            </div>

            {property.images.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {property.images.slice(1).map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden ring-1 ring-stone-200"
                  >
                    <SafeImage
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-2xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                  {property.listingType === 'RENT' ? 'For rent' : 'For sale'}
                </span>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                  {property.type.replace('_', ' ')}
                </span>
                {property.verified && <VerifiedBadge size="md" />}
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                {property.title}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-stone-600">
                <MapPin className="h-5 w-5 text-amber-500 shrink-0" />
                {area}, {property.city}, {property.province}
              </p>
              <p className="mt-5 text-3xl font-bold text-amber-600">
                {formatPrice(property.price, property.listingType)}
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms },
                  { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                  { icon: Car, label: 'Garage / parking', value: property.parkings },
                  { icon: Maximize2, label: 'Floor size', value: `${property.size} m²` },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-stone-50 border border-stone-100 p-4 text-center"
                  >
                    <Icon className="mx-auto h-5 w-5 text-amber-600" />
                    <p className="mt-2 text-lg font-bold text-stone-900">{value}</p>
                    <p className="text-xs text-stone-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-bold text-stone-900">About this property</h2>
                <p className="mt-3 text-stone-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {tourEmbedUrl && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-stone-900">Virtual tour</h2>
                  <div className="mt-4 relative aspect-video rounded-2xl overflow-hidden ring-1 ring-stone-200 bg-stone-100">
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
            </div>

            <PropertyJourneyGuide listingType={property.listingType} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-6 space-y-6">
              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm ring-1 ring-stone-900/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Listed by
                    </p>
                    <p className="font-bold text-stone-900">{property.seller.name}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-stone-600">
                  {property.verified
                    ? 'Admin-verified Homescout listing. Reach out to arrange a viewing or ask questions about this '
                    : 'Homescout seller. Reach out to arrange a viewing or ask questions about this '}
                  {property.listingType === 'RENT' ? 'rental' : 'home'}.
                </p>
                <a
                  href={`mailto:${property.seller.email}?subject=${encodeURIComponent(`Enquiry: ${property.title}`)}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {property.seller.email}
                </a>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-stone-50 px-3 py-2 text-xs text-stone-500">
                  <Home className="h-4 w-4 text-amber-500" />
                  Homescout guides you from enquiry to handover
                </div>
              </div>

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
