'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Calculator,
  ChevronRight,
  MapPin,
  MessageSquareText,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

type QuickLink = {
  label: string
  description: string
  href?: string
  icon: LucideIcon
  comingSoon?: boolean
}

const links: QuickLink[] = [
  {
    label: 'Property advice',
    description: 'Expert tips & insights',
    href: '/properties',
    icon: MessageSquareText,
  },
  {
    label: 'Bond calculator',
    description: 'See what you can afford',
    href: '/tools/bond-calculator',
    icon: Calculator,
  },
  {
    label: 'Property guides',
    description: 'Buy, sell & rent help',
    href: '/buy',
    icon: BookOpen,
  },
  {
    label: 'Neighbourhoods',
    description: 'Explore areas near you',
    href: '/properties',
    icon: MapPin,
  },
]

function QuickLinkCard({ link, idx }: { link: QuickLink; idx: number }) {
  const Icon = link.icon

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/20 transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </span>
        {link.comingSoon ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 ring-1 ring-amber-200">
            <Sparkles className="h-3 w-3" aria-hidden />
            Soon
          </span>
        ) : (
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition-all group-hover:border-amber-300 group-hover:bg-amber-50 group-hover:text-amber-600"
            aria-hidden
          >
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="mt-5">
        <span className="block text-base font-bold text-stone-900 tracking-tight group-hover:text-amber-800 transition-colors">
          {link.label}
        </span>
        <span className="mt-1 block text-sm text-stone-500">
          {link.comingSoon ? 'Coming soon' : link.description}
        </span>
      </div>
    </>
  )

  const className = `group relative flex min-h-[148px] flex-col justify-between rounded-2xl border border-stone-200/90 bg-white px-5 py-5 shadow-sm transition-all duration-300 ${
    link.comingSoon
      ? 'opacity-90 cursor-default'
      : 'hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md hover:shadow-amber-500/10'
  }`

  if (link.comingSoon || !link.href) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: idx * 0.07 }}
        className={className}
      >
        {inner}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: idx * 0.07 }}
    >
      <Link href={link.href} className={className}>
        {inner}
      </Link>
    </motion.div>
  )
}

export default function PropertyQuickLinks() {
  return (
    <section className="relative px-4 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-stone-200/80 bg-gradient-to-br from-white via-amber-50/30 to-stone-50 px-6 py-10 sm:px-10 sm:py-12 shadow-sm"
        >
          <div
            className="pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full bg-amber-200/30 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-sky-200/20 blur-3xl"
            aria-hidden
          />

          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8 lg:mb-10">
            <div className="max-w-lg">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                Tools & resources
              </p>
              <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-stone-900 text-display leading-tight">
                Smarter decisions,{' '}
                <span className="text-stone-500 font-semibold">every step</span>
              </h3>
            </div>
            <p className="text-sm text-stone-600 max-w-md leading-relaxed lg:text-right">
              Guides, area search, and seller tools — with more features launching soon
              for buyers and agents.
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {links.map((link, idx) => (
              <QuickLinkCard key={link.label} link={link} idx={idx} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
