'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Building2, Home, HousePlus, type LucideIcon } from 'lucide-react'

type Service = {
  title: string
  badge: string
  description: string
  href: string
  cta: string
  icon: LucideIcon
  accent: {
    border: string
    glow: string
    badge: string
    icon: string
    cta: string
    mesh: string
  }
}

const services: Service[] = [
  {
    title: 'Buy a Property',
    badge: 'For sale',
    description:
      'With thousands of properties for sale on our site, we can help you find your space.',
    href: '/buy',
    cta: 'Search properties',
    icon: Home,
    accent: {
      border: 'from-emerald-400/80 via-emerald-200/40 to-white',
      glow: 'bg-emerald-400/25',
      badge: 'bg-emerald-500/10 text-emerald-800 ring-emerald-500/25',
      icon: 'from-emerald-500 to-teal-600 shadow-emerald-500/30',
      cta: 'text-emerald-700 group-hover:text-emerald-800',
      mesh: 'from-emerald-100/80 to-transparent',
    },
  },
  {
    title: 'Rent a Property',
    badge: 'For rent',
    description:
      "Find a rental space that you'll love or advertise your rental property on our site.",
    href: '/rent',
    cta: 'Search rentals',
    icon: Building2,
    accent: {
      border: 'from-sky-400/80 via-sky-200/40 to-white',
      glow: 'bg-sky-400/25',
      badge: 'bg-sky-500/10 text-sky-900 ring-sky-500/25',
      icon: 'from-sky-500 to-blue-600 shadow-sky-500/30',
      cta: 'text-sky-700 group-hover:text-sky-800',
      mesh: 'from-sky-100/80 to-transparent',
    },
  },
  {
    title: 'Sell a Property',
    badge: 'List with us',
    description:
      'Advertise with us and have your property seen by millions of people.',
    href: '/sell',
    cta: 'List your property',
    icon: HousePlus,
    accent: {
      border: 'from-violet-400/80 via-violet-200/40 to-white',
      glow: 'bg-violet-400/25',
      badge: 'bg-violet-500/10 text-violet-900 ring-violet-500/25',
      icon: 'from-violet-600 to-purple-700 shadow-violet-500/30',
      cta: 'text-violet-700 group-hover:text-violet-800',
      mesh: 'from-violet-100/80 to-transparent',
    },
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function PropertyServices() {
  return (
    <section className="relative py-16 sm:py-20 px-4 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 platform-mesh opacity-60"
        aria-hidden
      />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-violet-400/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute top-1/2 -right-20 h-80 w-80 rounded-full bg-violet-400/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" aria-hidden />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-700 ring-1 ring-violet-500/20 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600 animate-pulse" />
            What we offer
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-stone-900 text-display leading-[1.08]">
            Everything property,{' '}
            <span className="bg-gradient-to-r from-violet-600 via-violet-700 to-violet-800 bg-clip-text text-transparent">
              all in one place
            </span>
          </h2>
          <p className="mt-4 text-base text-stone-600 max-w-xl leading-relaxed">
            Buy, rent, or list — one platform built for how South Africans search for
            property today.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-12 lg:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon
            const a = service.accent
            return (
              <motion.article
                key={service.title}
                variants={item}
                className="group relative"
              >
                <div
                  className={`absolute -inset-px rounded-[1.65rem] bg-gradient-to-br ${a.border} opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <Link
                  href={service.href}
                  className="relative flex h-full min-h-[340px] flex-col rounded-[1.6rem] bg-white/85 backdrop-blur-xl overflow-hidden shadow-lg shadow-stone-900/[0.04] ring-1 ring-white/80 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-stone-900/10 group-hover:-translate-y-1"
                >
                  <div
                    className={`absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl ${a.glow} transition-transform duration-700 group-hover:scale-110`}
                    aria-hidden
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${a.mesh} opacity-60`}
                    aria-hidden
                  />

                  <div className="relative flex flex-1 flex-col p-7 sm:p-8">
                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${a.badge}`}
                    >
                      {service.badge}
                    </span>

                    <div className="mt-8 flex items-end justify-between gap-4">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${a.icon} text-white shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3`}
                      >
                        <Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden />
                      </div>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-700 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-violet-700/30">
                        <ArrowUpRight className="h-5 w-5" aria-hidden />
                      </span>
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-stone-900 tracking-tight">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm text-stone-600 leading-relaxed flex-1">
                      {service.description}
                    </p>

                    <span
                      className={`mt-6 inline-flex items-center gap-2 text-sm font-bold ${a.cta} transition-colors`}
                    >
                      {service.cta}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
