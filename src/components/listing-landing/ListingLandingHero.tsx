'use client'

import Image from 'next/image'
import { useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import { HeroThemeProvider } from '@/components/listing-landing/hero-theme-context'
import {
  advanceHeroThemeIndexForNextVisit,
  getLandingHeroCopy,
  landingHeroImage,
  landingHeroThemes,
  resolveHeroThemeForVisit,
  type LandingHeroVariant,
} from '@/lib/landing-hero-themes'

type Props = {
  variant: LandingHeroVariant
  locationHint?: string
  browseType?: string
  children?: ReactNode
}

function themeForRender(variant: LandingHeroVariant) {
  if (typeof window === 'undefined') {
    return landingHeroThemes[variant]
  }
  return resolveHeroThemeForVisit(variant)
}

export default function ListingLandingHero({
  variant,
  locationHint,
  browseType,
  children,
}: Props) {
  const copy = getLandingHeroCopy(variant, { browseType })
  const location = locationHint?.trim() || 'South Africa'
  const theme = themeForRender(variant)

  useLayoutEffect(() => {
    return () => advanceHeroThemeIndexForNextVisit(variant)
  }, [variant])

  return (
    <HeroThemeProvider key={variant} theme={theme}>
      <section
        key={variant}
        className={`bg-[#faf9f7] px-4 pt-6 sm:pt-8 ${children ? 'pb-6 sm:pb-4' : 'pb-4'}`}
        suppressHydrationWarning
      >
        <div className="max-w-7xl mx-auto">
          <div
            key={`hero-card-${variant}`}
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

            <div
              className={`relative z-10 flex h-full flex-col px-6 py-8 sm:px-10 sm:py-12 lg:px-14 max-w-xl min-h-[300px] sm:min-h-[340px] lg:min-h-[380px] ${
                children
                  ? 'justify-start sm:justify-center pb-6 sm:pb-24 lg:pb-20'
                  : 'justify-center py-10 sm:py-12'
              }`}
            >
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
                className={`mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed max-w-md ${theme.subtitle} ${
                  children ? 'pr-1 sm:pr-0' : ''
                }`}
                suppressHydrationWarning
              >
                {copy.description}
              </p>
            </div>
          </div>

          {children ? (
            <div className="relative z-20 mt-5 sm:-mt-14 lg:-mt-18 px-0 sm:px-4 lg:px-8">
              {children}
            </div>
          ) : null}
        </div>
      </section>
    </HeroThemeProvider>
  )
}
