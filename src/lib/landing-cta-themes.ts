export type LandingCtaVariant = 'buy' | 'rent' | 'sell'

export type LandingCtaTheme = {
  gradient: string
}

/** Purple gradient washes — aligned with site violet accent. */
const violetDeep: LandingCtaTheme = {
  gradient: 'bg-gradient-to-br from-violet-950 via-violet-800 to-violet-600',
}

const violetRoyal: LandingCtaTheme = {
  gradient: 'bg-gradient-to-r from-violet-900 via-violet-700 to-purple-500',
}

const violetGlow: LandingCtaTheme = {
  gradient: 'bg-gradient-to-br from-purple-950 via-violet-800 to-violet-500',
}

const violetSunset: LandingCtaTheme = {
  gradient: 'bg-gradient-to-r from-violet-950 via-violet-700 to-fuchsia-600',
}

const violetIndigo: LandingCtaTheme = {
  gradient: 'bg-gradient-to-br from-indigo-950 via-violet-800 to-violet-600',
}

const violetPlum: LandingCtaTheme = {
  gradient: 'bg-gradient-to-r from-violet-950 via-purple-800 to-violet-500',
}

export const landingCtaRotations: Record<LandingCtaVariant, LandingCtaTheme[]> = {
  buy: [violetDeep, violetRoyal, violetGlow],
  rent: [violetRoyal, violetIndigo, violetSunset],
  sell: [violetDeep, violetPlum, violetGlow],
}

export const landingCtaThemes: Record<LandingCtaVariant, LandingCtaTheme> = {
  buy: landingCtaRotations.buy[0],
  rent: landingCtaRotations.rent[0],
  sell: landingCtaRotations.sell[0],
}

const STORAGE_PREFIX = 'Homescout-cta-index'

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
