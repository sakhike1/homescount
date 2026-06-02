'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BedDouble, MapPin } from 'lucide-react'
import SafeImage from '@/components/SafeImage'

export type GridProperty = {
  id: string
  title: string
  price: number
  city: string
  province: string
  bedrooms: number
  listingType: string
  imageUrl: string | null
}

function formatPrice(price: number, listingType: string) {
  const formatted = price.toLocaleString('en-ZA')
  return listingType === 'RENT' ? `R ${formatted}/mo` : `R ${formatted}`
}

export default function FeaturedPropertiesGrid({
  properties,
  isDemo = false,
}: {
  properties: GridProperty[]
  isDemo?: boolean
}) {
  if (properties.length === 0) return null

  return (
    <section className="section-white py-16 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
              Featured listings
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-stone-900 text-section-title">
              Homes across South Africa
            </h2>
            <p className="mt-2 text-stone-600 max-w-xl">
              {isDemo
                ? 'Sample homes for sale and rent across South Africa — real seller listings will replace these once published.'
                : 'Browse verified properties for sale and rent — from city apartments to family homes in every province.'}
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 shrink-0"
          >
            View all properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {properties.map((property) => (
            <motion.article
              key={property.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
              }}
            >
              <Link
                href={`/properties/${property.id}`}
                className="group block rounded-2xl border border-stone-200/80 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-amber-200/60 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <SafeImage
                    src={property.imageUrl ?? '/property-images/2f8ec23c4d9785a449ea604b22f3d2d8.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span
                    className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold ${
                      property.listingType === 'RENT'
                        ? 'bg-sky-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {property.listingType === 'RENT' ? 'For rent' : 'For sale'}
                  </span>
                </div>

                <div className="p-4 sm:p-5">
                  <p className="text-xl font-bold text-amber-600">
                    {formatPrice(property.price, property.listingType)}
                  </p>
                  <h3 className="mt-1 font-bold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                    {property.title}
                  </h3>
                  <p className="mt-2 flex items-center gap-1 text-sm text-stone-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {property.city}, {property.province}
                  </p>
                  {property.bedrooms > 0 && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-stone-400">
                      <BedDouble className="h-3.5 w-3.5" />
                      {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
