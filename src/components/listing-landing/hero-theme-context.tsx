'use client'

import { createContext, useContext } from 'react'
import type { LandingHeroTheme } from '@/lib/landing-hero-themes'
import { landingHeroThemes } from '@/lib/landing-hero-themes'

const HeroThemeContext = createContext<LandingHeroTheme>(landingHeroThemes.browse)

export function HeroThemeProvider({
  theme,
  children,
}: {
  theme: LandingHeroTheme
  children: React.ReactNode
}) {
  return <HeroThemeContext.Provider value={theme}>{children}</HeroThemeContext.Provider>
}

export function useHeroTheme() {
  return useContext(HeroThemeContext)
}
