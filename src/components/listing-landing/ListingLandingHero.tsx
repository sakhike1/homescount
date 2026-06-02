'use client'

import Image from 'next/image'
import { useLayoutEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import { HeroThemeProvider } from '@/components/listing-landing/hero-theme-context'
import {
  advanceHeroThemeIndexForNextVisit,
  getHeroThemeForIndex,
  getHeroThemeIndexForVisit,
  getLandingHeroCopy,
  landingHeroImage,
  landingHeroThemes,
  type LandingHeroTheme,
  type LandingHeroVariant,
} from '@/lib/landing-hero-themes'

type Props = {
  variant: LandingHeroVariant
  locationHint?: string
  browseType?: string
  children?: ReactNode
}

export default function ListingLandingHero({
  variant,
  locationHint,
  browseType,
  children,
}: Props) {
  const copy = getLandingHeroCopy(variant, { browseType })
  const location = locationHint?.trim() || 'South Africa'
  const [theme, setTheme] = useState<LandingHeroTheme>(() => landingHeroThemes[variant])

  useLayoutEffect(() => {
    const index = getHeroThemeIndexForVisit(variant)
    setTheme(getHeroThemeForIndex(variant, index))
    return () => advanceHeroThemeIndexForNextVisit(variant)
  }, [variant])

  return (
    <HeroThemeProvider theme={theme}>
      <section className="bg-[#faf9f7] px-4 pt-6 sm:pt-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <div
            className={`relative rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden shadow-xl ${theme.shadow} min-h-[300px] sm:min-h-[340px] lg:min-h-[380px]`}
            suppressHydrationWarning
          >
            <Image
              src={landingHeroImage}
              alt="Modern residential architecture"
              fill
              priority
              className="object-cover object-center sm:object-right"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />

            <div className={`absolute inset-0 ${theme.gradient}`} aria-hidden suppressHydrationWarning />

            <svg
              className={`hidden sm:block absolute inset-y-0 left-[42%] lg:left-[44%] h-full w-20 lg:w-28 pointer-events-none z-[1] ${theme.wave}`}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
              suppressHydrationWarning
            >
              <path
                fill="currentColor"
                d="M0,0 C35,8 25,42 40,55 C55,68 30,92 0,100 L0,0 Z"
              />
            </svg>

            <div
              className={`hidden sm:block absolute inset-y-0 left-0 w-[46%] lg:w-[42%] z-[2] ${theme.panel}`}
              aria-hidden
              suppressHydrationWarning
            />

            <div className="relative z-10 flex flex-col justify-center h-full min-h-[300px] sm:min-h-[340px] lg:min-h-[380px] px-6 sm:px-10 lg:px-14 py-10 sm:py-12 max-w-xl">
              <p className={`text-xs font-bold uppercase tracking-[0.2em] ${theme.eyebrow}`} suppressHydrationWarning>
                {copy.eyebrow}
              </p>
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.1] tracking-tight">
                {copy.title}
                {copy.highlight && (
                  <>
                    <br />
                    <span className={theme.highlight} suppressHydrationWarning>
                      {copy.highlight}
                    </span>
                  </>
                )}
              </h1>
              {copy.showLocation && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-white/95">
                  <MapPin className={`h-5 w-5 shrink-0 ${theme.icon}`} aria-hidden suppressHydrationWarning />
                  <span className="text-xl sm:text-2xl font-semibold">{location}</span>
                  <ChevronDown className="h-5 w-5 opacity-70" aria-hidden />
                </div>
              )}
              <p
                className={`mt-4 text-sm sm:text-base leading-relaxed max-w-md ${theme.subtitle}`}
                suppressHydrationWarning
              >
                {copy.description}
              </p>
            </div>
          </div>

          {children ? (
            <div className="relative z-20 -mt-14 sm:-mt-16 lg:-mt-20 px-0 sm:px-4 lg:px-8">
              {children}
            </div>
          ) : null}
        </div>
      </section>
    </HeroThemeProvider>
  )
}
