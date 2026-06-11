'use client'

import { useCallback, useEffect, useState } from 'react'
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react'
import SafeImage from '@/components/SafeImage'
import PropertyListingSaveShare from '@/components/properties/PropertyListingSaveShare'

type GalleryImage = { id: string; url: string }

export default function PropertyListingGallery({
  images,
  title,
  propertyId,
}: {
  images: GalleryImage[]
  title: string
  propertyId: string
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const photos = images.length > 0 ? images : [{ id: 'placeholder', url: '/property-images/2f8ec23c4d9785a449ea604b22f3d2d8.jpg' }]

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))
  }, [photos.length])

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length))
  }, [photos.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, goPrev, goNext])

  /** Mosaic always shows 1 large + 2 side tiles — wrap when fewer than 3 photos exist. */
  const photoAt = (index: number) => photos[index % photos.length]
  const heroMain = photoAt(0)
  const heroSideSlots = [1, 2].map((index) => ({
    image: photoAt(index),
    lightboxIndex: index % photos.length,
  }))
  const gridPhotos = photos.slice(0, 9)

  return (
    <>
      {/* Hero mosaic */}
      <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-3 sm:grid-rows-2 sm:gap-2">
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200 sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[420px]"
        >
          <SafeImage
            src={heroMain.url}
            alt={title}
            fill
            priority
            className="object-cover transition duration-500 hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, 66vw"
          />
        </button>

        {heroSideSlots.map(({ image, lightboxIndex }, i) => (
          <button
            key={`${image.id}-mosaic-${i}`}
            type="button"
            onClick={() => openLightbox(lightboxIndex)}
            className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200 sm:block sm:aspect-auto sm:min-h-[206px]"
          >
            <SafeImage
              src={image.url}
              alt=""
              fill
              className="object-cover transition duration-500 hover:scale-[1.02]"
              sizes="33vw"
            />
          </button>
        ))}

        {/* Mobile: show 2nd thumb inline */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={() => openLightbox(1 % photos.length)}
            className="relative aspect-[16/9] overflow-hidden rounded-xl bg-stone-200 sm:hidden"
          >
            <SafeImage src={photoAt(1).url} alt="" fill className="object-cover" sizes="50vw" />
          </button>
        )}

        <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="inline-flex items-center gap-2 rounded-full bg-stone-900/75 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-stone-900/90"
          >
            <Camera className="h-4 w-4" aria-hidden />
            Photos ({photos.length})
          </button>
        </div>

        <div className="absolute bottom-4 right-4 z-10">
          <PropertyListingSaveShare propertyId={propertyId} title={title} />
        </div>
      </div>

      {/* Photo grid */}
      {photos.length > 1 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">Photo gallery</h2>
            {photos.length > 9 && (
              <button
                type="button"
                onClick={() => openLightbox(0)}
                className="text-sm font-semibold text-amber-700 hover:text-amber-800 hover:underline"
              >
                View all ({photos.length})
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {gridPhotos.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => openLightbox(i)}
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200/80 transition hover:ring-amber-300/60"
              >
                <SafeImage
                  src={img.url}
                  alt={`${title} photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:left-6"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="relative h-[70vh] w-full max-w-5xl">
            <SafeImage
              src={photos[lightboxIndex].url}
              alt={`${title} — photo ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:right-6"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium text-white/80">
            {lightboxIndex + 1} / {photos.length}
          </p>
        </div>
      )}
    </>
  )
}
