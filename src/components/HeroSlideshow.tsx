'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { slideHeroImages } from '@/lib/slide-hero'

const INTERVAL_MS = 7000

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)
  
  const rotateX = useTransform(y, [-0.5, 0.5], [2, -2])
  const rotateY = useTransform(x, [-0.5, 0.5], [-2, 2])
  const parallaxX = useTransform(x, [-0.5, 0.5], [15, -15])
  const parallaxY = useTransform(y, [-0.5, 0.5], [15, -15])

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slideHeroImages.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      mouseX.set((e.clientX - centerX) / rect.width)
      mouseY.set((e.clientY - centerY) / rect.height)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const slide = slideHeroImages[index]

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 50, 0],
            y: [0, 50, 100, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, -40, 0],
            y: [0, 80, 40, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-rose-500/15 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 60, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-sky-500/10 blur-[80px]"
        />
      </div>

      {/* Background image with parallax */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.src}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <motion.div
            style={{ x: parallaxX, y: parallaxY }}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.15 }}
            transition={{
              duration: INTERVAL_MS / 1000 + 2,
              ease: 'linear',
            }}
            className="absolute inset-[-20px]"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      {/* Subtle grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Slide indicators */}
      <div className="absolute bottom-8 right-8 z-10 flex items-center gap-3">
        {slideHeroImages.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            className="group relative p-1.5"
          >
            <span
              className={`block h-1 rounded-full transition-all duration-700 ease-out ${
                i === index
                  ? 'w-10 bg-gradient-to-r from-amber-400 to-amber-300 shadow-lg shadow-amber-500/30'
                  : 'w-1 bg-white/30 group-hover:bg-white/60 group-hover:w-2'
              }`}
            />
            {i === index && (
              <motion.span
                layoutId="activeSlide"
                className="absolute inset-0 rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 left-8 z-10 hidden sm:flex items-center gap-3">
        <span className="text-2xl font-light text-white/90 tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="w-8 h-px bg-gradient-to-r from-white/60 to-transparent" />
        <span className="text-sm text-white/40 tabular-nums">
          {String(slideHeroImages.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
