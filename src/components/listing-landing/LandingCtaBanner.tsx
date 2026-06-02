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
    <section className="border-t border-stone-200 bg-stone-50 px-4 py-14 sm:py-16">
      <div
        className={`max-w-7xl mx-auto rounded-3xl px-6 py-10 sm:px-12 sm:py-12 shadow-lg ${theme.gradient}`}
        suppressHydrationWarning
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-white/90 drop-shadow-sm sm:text-base">
              {description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-stone-900 shadow-md transition hover:bg-stone-50"
            >
              <PrimaryIcon className="h-4 w-4" aria-hidden />
              {primaryLabel}
            </Link>
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
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
