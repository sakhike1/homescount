import { propertiesPageHeroImage } from '@/lib/properties-page-hero'

export type LandingHeroVariant = 'browse' | 'buy' | 'rent' | 'sell'

export const landingHeroImage = propertiesPageHeroImage

export type LandingHeroTheme = {
  panel: string
  gradient: string
  wave: string
  shadow: string
  eyebrow: string
  highlight: string
  subtitle: string
  icon: string
  /** Primary CTA on hero action cards */
  primaryButton: string
}

/** Hand-tuned palettes — Tailwind needs full class strings at build time. */
const amber: LandingHeroTheme = {
  panel: 'bg-amber-500',
  gradient:
    'bg-gradient-to-t sm:bg-gradient-to-r from-amber-500 via-amber-500/92 to-amber-500/25 sm:to-transparent',
  wave: 'text-amber-500',
  shadow: 'shadow-amber-500/20',
  eyebrow: 'text-amber-100/90',
  highlight: 'text-amber-200',
  subtitle: 'text-amber-50/90',
  icon: 'text-amber-100',
  primaryButton: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30',
}

const slate: LandingHeroTheme = {
  panel: 'bg-stone-800',
  gradient:
    'bg-gradient-to-t sm:bg-gradient-to-r from-stone-800 via-stone-800/92 to-stone-800/20 sm:to-transparent',
  wave: 'text-stone-800',
  shadow: 'shadow-stone-900/25',
  eyebrow: 'text-stone-300/90',
  highlight: 'text-stone-200',
  subtitle: 'text-stone-100/90',
  icon: 'text-stone-300',
  primaryButton: 'bg-stone-900 hover:bg-stone-800 shadow-stone-900/30',
}

const sky: LandingHeroTheme = {
  panel: 'bg-sky-600',
  gradient:
    'bg-gradient-to-t sm:bg-gradient-to-r from-sky-600 via-sky-600/90 to-sky-600/15 sm:to-transparent',
  wave: 'text-sky-600',
  shadow: 'shadow-sky-900/15',
  eyebrow: 'text-sky-100/90',
  highlight: 'text-sky-200',
  subtitle: 'text-sky-50/90',
  icon: 'text-sky-100',
  primaryButton: 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/25',
}

const violet: LandingHeroTheme = {
  panel: 'bg-violet-700',
  gradient:
    'bg-gradient-to-t sm:bg-gradient-to-r from-violet-700 via-violet-700/92 to-violet-700/20 sm:to-transparent',
  wave: 'text-violet-700',
  shadow: 'shadow-violet-900/20',
  eyebrow: 'text-violet-200/90',
  highlight: 'text-violet-300',
  subtitle: 'text-violet-100/90',
  icon: 'text-violet-200',
  primaryButton: 'bg-violet-700 hover:bg-violet-800 shadow-violet-700/25',
}

const rose: LandingHeroTheme = {
  panel: 'bg-rose-600',
  gradient:
    'bg-gradient-to-t sm:bg-gradient-to-r from-rose-600 via-rose-600/90 to-rose-600/20 sm:to-transparent',
  wave: 'text-rose-600',
  shadow: 'shadow-rose-900/15',
  eyebrow: 'text-rose-100/90',
  highlight: 'text-rose-200',
  subtitle: 'text-rose-50/90',
  icon: 'text-rose-100',
  primaryButton: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25',
}

const teal: LandingHeroTheme = {
  panel: 'bg-teal-600',
  gradient:
    'bg-gradient-to-t sm:bg-gradient-to-r from-teal-600 via-teal-600/90 to-teal-600/15 sm:to-transparent',
  wave: 'text-teal-600',
  shadow: 'shadow-teal-900/15',
  eyebrow: 'text-teal-100/90',
  highlight: 'text-teal-200',
  subtitle: 'text-teal-50/90',
  icon: 'text-teal-100',
  primaryButton: 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/25',
}

/** Three palettes per page — cycles on each return visit (session). */
export const landingHeroRotations: Record<LandingHeroVariant, LandingHeroTheme[]> = {
  browse: [amber, slate, sky],
  buy: [amber, violet, rose],
  rent: [sky, teal, amber],
  sell: [violet, amber, slate],
}

/** Default (first paint / SSR) — first palette in each rotation. */
export const landingHeroThemes: Record<LandingHeroVariant, LandingHeroTheme> = {
  browse: landingHeroRotations.browse[0],
  buy: landingHeroRotations.buy[0],
  rent: landingHeroRotations.rent[0],
  sell: landingHeroRotations.sell[0],
}

const STORAGE_PREFIX = 'homescount-hero-index'

function storageKey(variant: LandingHeroVariant) {
  return `${STORAGE_PREFIX}:${variant}`
}

/** Index to show on this visit (before advancing for the next). */
export function getHeroThemeIndexForVisit(variant: LandingHeroVariant): number {
  if (typeof window === 'undefined') return 0
  const palettes = landingHeroRotations[variant]
  const raw = sessionStorage.getItem(storageKey(variant))
  const idx = raw === null ? 0 : parseInt(raw, 10)
  if (!Number.isFinite(idx)) return 0
  return ((idx % palettes.length) + palettes.length) % palettes.length
}

/** Call on hero unmount so the next visit shows the next color. */
export function advanceHeroThemeIndexForNextVisit(variant: LandingHeroVariant): void {
  if (typeof window === 'undefined') return
  const palettes = landingHeroRotations[variant]
  const current = getHeroThemeIndexForVisit(variant)
  sessionStorage.setItem(storageKey(variant), String((current + 1) % palettes.length))
}

export function getHeroThemeForIndex(
  variant: LandingHeroVariant,
  index: number
): LandingHeroTheme {
  const palettes = landingHeroRotations[variant]
  return palettes[((index % palettes.length) + palettes.length) % palettes.length]
}

/** Theme for this visit — SSR uses the default palette for the variant. */
export function resolveHeroThemeForVisit(variant: LandingHeroVariant): LandingHeroTheme {
  if (typeof window === 'undefined') {
    return landingHeroThemes[variant]
  }
  return getHeroThemeForIndex(variant, getHeroThemeIndexForVisit(variant))
}

export type LandingHeroCopy = {
  eyebrow: string
  title: string
  highlight?: string
  showLocation: boolean
  description: string
}

export function getLandingHeroCopy(
  variant: LandingHeroVariant,
  options?: { browseType?: string }
): LandingHeroCopy {
  const browseType = options?.browseType ?? 'all'

  if (variant === 'buy') {
    return {
      eyebrow: 'Buy on Homescount',
      title: 'Find a home',
      highlight: 'to buy',
      showLocation: true,
      description:
        'Browse homes for sale across South Africa — clear prices, trusted sellers, and guidance from viewing to transfer.',
    }
  }

  if (variant === 'rent') {
    return {
      eyebrow: 'Rent on Homescount',
      title: 'Find a rental',
      highlight: "you'll love",
      showLocation: true,
      description:
        'Discover rentals nationwide — monthly prices upfront, verified sellers, and support from enquiry to move-in.',
    }
  }

  if (variant === 'sell') {
    return {
      eyebrow: 'Sell on Homescount',
      title: 'List your property',
      highlight: 'reach more buyers',
      showLocation: false,
      description:
        'Advertise for sale or rent in minutes. Upload photos, publish when ready, and optionally promote to thousands of searchers.',
    }
  }

  const browseDesc =
    browseType === 'rent'
      ? 'rentals across South Africa'
      : browseType === 'buy'
        ? 'homes for sale'
        : 'properties across South Africa'

  return {
    eyebrow: 'Homescount listings',
    title: 'Search in',
    showLocation: true,
    description: `Find ${browseDesc} — filter by area, suburb, and budget in one place.`,
  }
}
