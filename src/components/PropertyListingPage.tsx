import PropertyCard from '@/components/PropertyCard'
import PropertySearchForm from '@/components/PropertySearchForm'
import { getPropertyImages } from '@/lib/properties'

type Property = {
  id: string
  title: string
  price: number
  city: string
  province: string
  bedrooms: number
  bathrooms: number
  listingType: string
  images: { url: string }[]
}

type Props = {
  title: string
  subtitle: string
  searchAction: string
  searchQ?: string
  searchPrice?: string
  properties: Property[]
}

export default function PropertyListingPage({
  title,
  subtitle,
  searchAction,
  searchQ,
  searchPrice,
  properties,
}: Props) {
  return (
    <main className="section-warm min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900">{title}</h1>
        <p className="mt-2 text-stone-600">{subtitle}</p>

        <PropertySearchForm
          action={searchAction}
          defaultQ={searchQ}
          defaultPrice={searchPrice}
        />

        {properties.length === 0 ? (
          <p className="text-stone-500">
            No properties found. Try another search or list a property as a seller.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => (
              <PropertyCard
                key={p.id}
                id={p.id}
                title={p.title}
                price={p.price}
                city={p.city}
                province={p.province}
                bedrooms={p.bedrooms}
                bathrooms={p.bathrooms}
                listingType={p.listingType}
                imageUrl={getPropertyImages(p.images, i)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
