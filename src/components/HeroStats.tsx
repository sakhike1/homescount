'use client'

import { motion } from 'framer-motion'
import { BadgeCheck, Building2, MapPinned, type LucideIcon } from 'lucide-react'
import { formatStatCount } from '@/lib/format-stats'

type Props = {
  listings: number
  sellers: number
  provinces: number
}

function StatCard({
  value,
  label,
  icon: Icon,
  className,
  delay,
  floatDelay,
}: {
  value: string
  label: string
  icon: LucideIcon
  className: string
  delay: number
  floatDelay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 5.5,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: floatDelay,
        }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur p-5 will-change-transform"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            <div className="mt-1 text-sm text-white/75">{label}</div>
          </div>
          <div className="h-11 w-11 rounded-full bg-amber-500/85 ring-1 ring-white/20 grid place-items-center text-white">
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
      value: formatStatCount(listings),
      label: 'Active listings',
      icon: Building2,
      delay: 0.2,
      floatDelay: 0.1,
      className: 'absolute right-2 top-10 w-[260px]',
    },
    {
      value: formatStatCount(sellers),
      label: 'Verified sellers',
      icon: BadgeCheck,
      delay: 0.32,
      floatDelay: 0.6,
      className: 'absolute left-8 top-40 w-[280px]',
    },
    {
      value: String(provinces),
      label: 'Provinces covered',
      icon: MapPinned,
      delay: 0.44,
      floatDelay: 0.25,
      className: 'absolute right-10 bottom-8 w-[260px]',
    },
  ]

  return (
    <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[260px] lg:min-h-[420px]">
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 + idx * 0.08 }}
              className="rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur p-4"
            >
              <Icon className="h-4 w-4 text-amber-300 mb-2" aria-hidden />
              <div className="text-xl font-bold">{s.value}</div>
              <div className="mt-0.5 text-[10px] sm:text-xs text-white/75 leading-tight">
                {s.label}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
