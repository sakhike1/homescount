'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { slideHeroImages } from '@/lib/slide-hero'

const INTERVAL_MS = 6000

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
    <div className="absolute inset-0">
      {slideHeroImages.map((item, i) => (
        <motion.div
          key={item.src}
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0"
          aria-hidden={i !== index}
        >
          <motion.div
            initial={false}
            animate={{ scale: i === index ? 1.08 : 1 }}
            transition={{
              duration: INTERVAL_MS / 1000 + 1.4,
              ease: 'linear',
            }}
            className="absolute inset-0"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              priority={i === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
        {slideHeroImages.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            className="group p-1"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-500 ${
                i === index
                  ? 'w-8 bg-amber-400'
                  : 'w-1.5 bg-white/40 group-hover:bg-white/70'
              }`}
            />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={slide.src}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45 }}
          className="absolute bottom-6 left-6 z-10 hidden sm:block text-xs font-medium text-white/60 tracking-wide"
        >
          {index + 1} / {slideHeroImages.length}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
