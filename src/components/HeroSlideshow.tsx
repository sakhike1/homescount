'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { slideHeroImages } from '@/lib/slide-hero'

const INTERVAL_MS = 7000

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slideHeroImages.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  const slide = slideHeroImages[index]

  return (
    <div className="relative h-full min-h-[280px] sm:min-h-[320px] rounded-[1.5rem] overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.src}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-violet-950/30 via-transparent to-transparent pointer-events-none" />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {slideHeroImages.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            className="group relative p-1"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-500 ease-out ${
                i === index
                  ? 'w-8 bg-white shadow-sm'
                  : 'w-1.5 bg-white/40 group-hover:bg-white/70 group-hover:w-3'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
