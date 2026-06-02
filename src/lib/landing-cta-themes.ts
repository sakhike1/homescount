export type LandingCtaVariant = 'buy' | 'rent' | 'sell'

export type LandingCtaTheme = {
  gradient: string
}

/** Horizontal gradient washes — amber stays in every palette (brand). */
const charcoalAmberViolet: LandingCtaTheme = {
  gradient: 'bg-gradient-to-r from-gray-800 via-amber-200 to-violet-400',
}

const stoneAmberSky: LandingCtaTheme = {
  gradient: 'bg-gradient-to-r from-stone-800 via-amber-300 to-sky-400',
}

const violetAmberRose: LandingCtaTheme = {
  gradient: 'bg-gradient-to-r from-violet-900 via-amber-200 to-rose-300',
}

const charcoalAmberTeal: LandingCtaTheme = {
  gradient: 'bg-gradient-to-r from-gray-800 via-amber-200 to-teal-400',
}

const skyAmberViolet: LandingCtaTheme = {
  gradient: 'bg-gradient-to-r from-sky-900 via-amber-200 to-violet-400',
}

const stoneAmberRose: LandingCtaTheme = {
  gradient: 'bg-gradient-to-r from-stone-800 via-amber-300 to-rose-300',
}

export const landingCtaRotations: Record<LandingCtaVariant, LandingCtaTheme[]> = {
  buy: [charcoalAmberViolet, stoneAmberSky, violetAmberRose],
  rent: [charcoalAmberViolet, skyAmberViolet, charcoalAmberTeal],
  sell: [charcoalAmberViolet, violetAmberRose, stoneAmberRose],
}

export const landingCtaThemes: Record<LandingCtaVariant, LandingCtaTheme> = {
  buy: landingCtaRotations.buy[0],
  rent: landingCtaRotations.rent[0],
  sell: landingCtaRotations.sell[0],
}

const STORAGE_PREFIX = 'homescount-cta-index'

function storageKey(variant: LandingCtaVariant) {
  return `${STORAGE_PREFIX}:${variant}`
}

export function getCtaThemeIndexForVisit(variant: LandingCtaVariant): number {
  if (typeof window === 'undefined') return 0
  const palettes = landingCtaRotations[variant]
  const raw = sessionStorage.getItem(storageKey(variant))
  const idx = raw === null ? 0 : parseInt(raw, 10)
  if (!Number.isFinite(idx)) return 0
  return ((idx % palettes.length) + palettes.length) % palettes.length
}

export function advanceCtaThemeIndexForNextVisit(variant: LandingCtaVariant): void {
  if (typeof window === 'undefined') return
  const palettes = landingCtaRotations[variant]
  const current = getCtaThemeIndexForVisit(variant)
  sessionStorage.setItem(storageKey(variant), String((current + 1) % palettes.length))
}

export function getCtaThemeForIndex(variant: LandingCtaVariant, index: number): LandingCtaTheme {
  const palettes = landingCtaRotations[variant]
  return palettes[((index % palettes.length) + palettes.length) % palettes.length]
}
