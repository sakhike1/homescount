'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SafeImage from '@/components/SafeImage'
import { propertyImageAt, propertyImages } from '@/lib/property-images'

export type ShowcaseProperty = {
  id: string
  title: string
  description: string
  price: number
  city: string
  province: string
  imageUrl: string | null
}

const fallbackProperties: ShowcaseProperty[] = [
  {
    id: '1',
    title: 'Forest retreat cabin',
    description:
      'We connect buyers and sellers through a trusted platform with verified properties and expert guidance.',
    price: 2340000,
    city: 'Knysna',
    province: 'Western Cape',
    imageUrl: propertyImages[0],
  },
  {
    id: '2',
    title: 'Modern forest villa',
    description:
      'Transparent deals and expert guidance—supporting you at every step of your property journey.',
    price: 3890000,
    city: 'Stellenbosch',
    province: 'Western Cape',
    imageUrl: propertyImages[1],
  },
  {
    id: '3',
    title: 'Lakeside dome home',
    description:
      'Discover unique homes across South Africa with Homescount’s verified listings platform.',
    price: 5120000,
    city: 'Hartbeespoort',
    province: 'North West',
    imageUrl: propertyImages[2],
  },
  {
    id: '4',
    title: 'Coastal family home',
    description:
      'Spacious living with modern finishes — ideal for families looking for comfort and style.',
    price: 4250000,
    city: 'Durban',
    province: 'KwaZulu-Natal',
    imageUrl: propertyImages[3],
  },
  {
    id: '5',
    title: 'Urban apartment with views',
    description:
      'Bright, open-plan apartment in a sought-after neighbourhood with city skyline views.',
    price: 2890000,
    city: 'Cape Town',
    province: 'Western Cape',
    imageUrl: propertyImages[4],
  },
  {
    id: '6',
    title: 'Suburban estate living',
    description:
      'Secure estate home with garden space and easy access to schools and amenities.',
    price: 3675000,
    city: 'Pretoria',
    province: 'Gauteng',
    imageUrl: propertyImages[5],
  },
]

const introCopy =
  'We connect buyers and sellers through a trusted platform with verified properties, transparent deals, and expert guidance—supporting you at every step.'

function formatPrice(price: number) {
  if (price >= 1_000_000) {
    return `R ${(price / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`
  }
  return `R ${price.toLocaleString()}`
}

export default function FeaturedShowcase({
  properties,
}: {
  properties: ShowcaseProperty[]
}) {
  const items = properties.length > 0 ? properties : fallbackProperties
  const [index, setIndex] = useState(0)
  const current = items[index]
  const currentImage = current.imageUrl ?? propertyImageAt(index)

  function goPrev() {
    setIndex((i) => (i === 0 ? items.length - 1 : i - 1))
  }

  function goNext() {
    setIndex((i) => (i === items.length - 1 ? 0 : i + 1))
  }

  return (
    <section className="bg-white py-16 sm:py-20 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-gray-900 tracking-tight leading-[1.12]">
            Your primary home might begin to feel left out
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed lg:pt-2">
            {introCopy}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Featured large image */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-[2rem] bg-gray-100 shadow-lg">
              <SafeImage
                src={currentImage}
                alt={current.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          </div>

          {/* Carousel panel */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex justify-end gap-2 mb-4">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous property"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:border-amber-400 hover:text-amber-600 transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next property"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:border-amber-400 hover:text-amber-600 transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex-1 min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-gray-100 mb-5">
                    <SafeImage
                      src={currentImage}
                      alt={current.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 35vw"
                    />
                  </div>

                  <p className="text-lg font-black text-gray-900">
                    Price starts at{' '}
                    <span className="text-amber-600">{formatPrice(current.price)}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {current.description}
                  </p>
                  <Link
                    href={`/properties/${current.id}`}
                    className="mt-5 inline-flex items-center justify-center rounded-full border-2 border-gray-900 px-8 py-2.5 text-sm font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition"
                  >
                    Details
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="mt-8 text-xs sm:text-sm text-gray-500 leading-relaxed hidden sm:block">
              {introCopy}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
