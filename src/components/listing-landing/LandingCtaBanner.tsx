'use client'

import Link from 'next/link'
import { useLayoutEffect, useState } from 'react'
import { HousePlus, Search } from 'lucide-react'
import {
  advanceCtaThemeIndexForNextVisit,
  getCtaThemeForIndex,
  getCtaThemeIndexForVisit,
  landingCtaThemes,
  type LandingCtaTheme,
  type LandingCtaVariant,
} from '@/lib/landing-cta-themes'

type Props = {
  variant: LandingCtaVariant
  title: string
  description: string
  primaryHref: string
  primaryLabel: string
  secondaryHref?: string
  secondaryLabel?: string
}

const primaryIcons = {
  buy: Search,
  rent: Search,
  sell: HousePlus,
} as const

export default function LandingCtaBanner({
  variant,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: Props) {
  const PrimaryIcon = primaryIcons[variant]
  const [theme, setTheme] = useState<LandingCtaTheme>(() => landingCtaThemes[variant])

  useLayoutEffect(() => {
    const index = getCtaThemeIndexForVisit(variant)
    setTheme(getCtaThemeForIndex(variant, index))
    return () => advanceCtaThemeIndexForNextVisit(variant)
  }, [variant])

  return (
    <section className="border-t border-stone-200 bg-[#faf9f7] px-4 py-14 sm:py-16">
      <div
        className={`relative max-w-7xl mx-auto overflow-hidden rounded-[1.75rem] px-6 py-10 sm:px-12 sm:py-12 shadow-xl shadow-violet-900/20 ring-1 ring-violet-900/10 ${theme.gradient}`}
        suppressHydrationWarning
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-violet-950/30 via-transparent to-white/5"
          aria-hidden
        />

        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-violet-100/90 sm:text-base">
              {description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-violet-900 shadow-lg shadow-violet-950/25 transition hover:bg-violet-50"
            >
              <PrimaryIcon className="h-4 w-4" aria-hidden />
              {primaryLabel}
            </Link>
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/20"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
