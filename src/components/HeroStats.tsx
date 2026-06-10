'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { BadgeCheck, Building2, MapPinned, type LucideIcon } from 'lucide-react'

type Props = {
  listings: number
  sellers: number
  provinces: number
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

function StatCard({
  value,
  rawValue,
  label,
  icon: Icon,
  accentColor,
  className,
  delay,
  floatDelay,
}: {
  value: string
  rawValue: number
  label: string
  icon: LucideIcon
  accentColor: string
  className: string
  delay: number
  floatDelay: number
}) {
  const { count, ref } = useAnimatedCounter(rawValue, 2200, delay * 1000)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 6,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: floatDelay,
        }}
        whileHover={{ y: -12, scale: 1.03 }}
        className="group relative rounded-3xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] p-6 will-change-transform overflow-hidden"
      >
        {/* Glow effect */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${accentColor} opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500`} />
        
        {/* Shimmer on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="text-4xl font-bold tracking-tight bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
              {formatCount(count)}
            </div>
            <div className="mt-2 text-sm text-white/60 font-medium">{label}</div>
          </div>
          <div className={`h-12 w-12 rounded-2xl ${accentColor} shadow-lg grid place-items-center text-white ring-1 ring-white/20`}>
            <Icon className="h-5 w-5" aria-hidden />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function HeroStats({ listings, sellers, provinces }: Props) {
  const stats = [
    {
      value: formatCount(listings),
      rawValue: listings,
      label: 'Active listings',
      icon: Building2,
      accentColor: 'bg-gradient-to-br from-amber-500 to-orange-600',
      delay: 0.3,
      floatDelay: 0,
      className: 'absolute right-0 top-8 w-[280px]',
    },
    {
      value: formatCount(sellers),
      rawValue: sellers,
      label: 'Verified sellers',
      icon: BadgeCheck,
      accentColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      delay: 0.45,
      floatDelay: 0.8,
      className: 'absolute left-4 top-44 w-[280px]',
    },
    {
      value: String(provinces),
      rawValue: provinces,
      label: 'Provinces covered',
      icon: MapPinned,
      accentColor: 'bg-gradient-to-br from-violet-500 to-purple-600',
      delay: 0.6,
      floatDelay: 0.4,
      className: 'absolute right-8 bottom-4 w-[270px]',
    },
  ]

  return (
    <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[260px] lg:min-h-[440px]">
      <div className="hidden lg:block">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="lg:hidden grid grid-cols-3 gap-3">
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
              <div className={`absolute -top-8 -right-8 w-16 h-16 rounded-full ${s.accentColor} opacity-30 blur-2xl`} />
              <div className={`relative h-8 w-8 rounded-xl ${s.accentColor} grid place-items-center mb-3 shadow-lg`}>
                <Icon className="h-4 w-4 text-white" aria-hidden />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                {s.value}
              </div>
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
