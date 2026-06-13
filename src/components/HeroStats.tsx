'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { BadgeCheck, Building2, MapPinned, type LucideIcon } from 'lucide-react'
import { HOME_STATS_CONTAINER } from '@/lib/home-hero-layout'

type Props = {
  listings: number
  sellers: number
  provinces: number
  variant?: 'overlay' | 'below'
}

function useAnimatedCounter(end: number, duration: number = 2000, startDelay: number = 0) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return

    const timeout = setTimeout(() => {
      let startTime: number | null = null
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(easeOut * end))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, startDelay)

    return () => clearTimeout(timeout)
  }, [isInView, end, duration, startDelay])

  return { count, ref }
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k+`
  return String(n)
}

function BelowStatCard({
  rawValue,
  label,
  icon: Icon,
  iconClass,
  delay,
}: {
  rawValue: number
  label: string
  icon: LucideIcon
  iconClass: string
  delay: number
}) {
  const { count, ref } = useAnimatedCounter(rawValue, 2200, delay * 1000)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className="flex flex-1 items-center gap-4 rounded-2xl border border-stone-200/90 bg-white px-5 py-5 shadow-sm ring-1 ring-stone-100 sm:px-6 sm:py-6"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 tabular-nums">
          {formatCount(count)}
        </div>
        <div className="mt-0.5 text-sm font-medium text-stone-500">{label}</div>
      </div>
    </motion.div>
  )
}

export default function HeroStats({ listings, sellers, provinces, variant = 'below' }: Props) {
  const stats = [
    {
      rawValue: listings,
      label: 'Active listings',
      icon: Building2,
      iconClass: 'bg-stone-100 text-stone-600 ring-1 ring-stone-200/80',
      delay: 0.1,
    },
    {
      rawValue: sellers,
      label: 'Verified sellers',
      icon: BadgeCheck,
      iconClass: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80',
      delay: 0.2,
    },
    {
      rawValue: provinces,
      label: 'Provinces covered',
      icon: MapPinned,
      iconClass: 'bg-stone-100 text-stone-600 ring-1 ring-stone-200/80',
      delay: 0.3,
    },
  ]

  if (variant === 'below') {
    return (
      <div className={`${HOME_STATS_CONTAINER} mt-10 sm:mt-14 lg:mt-16`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          {stats.map((s) => (
            <BelowStatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[260px] lg:min-h-[440px]">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s, idx) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 + idx * 0.1 }}
              className="relative rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] p-4 overflow-hidden"
            >
              <div className={`relative h-8 w-8 rounded-xl ${s.iconClass} grid place-items-center mb-3`}>
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <div className="text-2xl font-bold text-white">{formatCount(s.rawValue)}</div>
              <div className="mt-1 text-[10px] sm:text-xs text-white/50 font-medium leading-tight">
                {s.label}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
