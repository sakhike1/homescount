import Link from 'next/link'
import { BedDouble, Bath, MapPin } from 'lucide-react'
import SafeImage from '@/components/SafeImage'
import { formatPrice } from '@/lib/properties'

type Props = {
  id: string
  title: string
  price: number
  city: string
  province: string
  bedrooms: number
  bathrooms: number
  listingType: string
  imageUrl: string
}

export default function PropertyCard({
  id,
  title,
  price,
  city,
  province,
  bedrooms,
  bathrooms,
  listingType,
  imageUrl,
}: Props) {
  return (
    <Link
      href={`/properties/${id}`}
      className="group block rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-amber-200 transition"
    >
      <div className="relative aspect-[4/3] bg-stone-100">
        <SafeImage
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <span className="absolute top-3 left-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white">
          {listingType === 'RENT' ? 'For rent' : 'For sale'}
        </span>
      </div>

      <div className="p-4">
        <p className="text-lg font-bold text-amber-600">
          {formatPrice(price, listingType)}
        </p>
        <h3 className="font-bold text-stone-900 line-clamp-1">{title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
          <MapPin className="h-3.5 w-3.5" />
          {city}, {province}
        </p>
        <div className="mt-2 flex gap-3 text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" /> {bedrooms} bed
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" /> {bathrooms} bath
          </span>
        </div>
      </div>
    </Link>
  )
}
