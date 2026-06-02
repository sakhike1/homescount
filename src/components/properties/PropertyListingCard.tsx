import Link from 'next/link'
import { Bath, BedDouble, Car, MapPin, Maximize2 } from 'lucide-react'
import SafeImage from '@/components/SafeImage'
import { formatPrice } from '@/lib/properties'

type Props = {
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
  imageUrl: string
  featured?: boolean
  isDemo?: boolean
}

export default function PropertyListingCard({
  id,
  title,
  price,
  suburb,
  location,
  city,
  province,
  bedrooms,
  bathrooms,
  parkings,
  size,
  listingType,
  imageUrl,
  featured,
  isDemo,
}: Props) {
  const areaLabel = suburb || location
  const isRent = listingType === 'RENT'

  return (
    <Link
      href={`/properties/${id}`}
      className="group block rounded-2xl border border-stone-200/80 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-amber-200/60 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <SafeImage
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              isRent ? 'bg-sky-600 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {isRent ? 'For rent' : 'For sale'}
          </span>
          {isDemo && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-stone-700 ring-1 ring-stone-200">
              Sample
            </span>
          )}
          {featured && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-200">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-xl font-bold text-amber-600">
          {formatPrice(price, listingType)}
        </p>
        <h3 className="mt-1 font-bold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
          {title}
        </h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-stone-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden />
          <span className="line-clamp-2">
            {areaLabel}, {city}, {province}
          </span>
        </p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-stone-400">
          <span className="inline-flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" aria-hidden />
            {bedrooms} bed{bedrooms !== 1 ? 's' : ''}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" aria-hidden />
            {bathrooms} bath{bathrooms !== 1 ? 's' : ''}
          </span>
          {parkings > 0 && (
            <span className="inline-flex items-center gap-1">
              <Car className="h-3.5 w-3.5" aria-hidden />
              {parkings} park
            </span>
          )}
          {size > 0 && (
            <span className="inline-flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" aria-hidden />
              {size} m²
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
