export const LISTING_PACKAGES = {
  BASIC: {
    key: 'BASIC' as const,
    label: 'Standard',
    price: 299,
    days: 30,
    tagline: 'Everything you need to go live',
    description: 'Publish on Homescout and start receiving buyer enquiries.',
    popular: false,
    featured: false,
    features: [
      'Live on the properties search page',
      'Unlimited buyer messages',
      'Photo gallery & company card',
      '30-day listing period',
      'Edit anytime from your dashboard',
    ],
  },
  FEATURED: {
    key: 'FEATURED' as const,
    label: 'Featured',
    price: 799,
    days: 30,
    tagline: 'Stand out in search results',
    description: 'Priority placement so more buyers see your property first.',
    popular: true,
    featured: true,
    features: [
      'Everything in Standard',
      'Featured badge on your listing',
      'Priority in search & browse results',
      'Highlighted on the homepage carousel',
      '30-day featured period',
    ],
  },
  PREMIUM: {
    key: 'PREMIUM' as const,
    label: 'Premium',
    price: 1499,
    days: 30,
    tagline: 'Maximum exposure',
    description: 'Top-of-page spotlight for serious sellers who want the most views.',
    popular: false,
    featured: true,
    features: [
      'Everything in Featured',
      'Top carousel placement on homepage',
      'Premium spotlight badge',
      'Priority support for listing updates',
      '30-day premium spotlight period',
    ],
  },
} as const

export type ListingPackageKey = keyof typeof LISTING_PACKAGES

/** @deprecated Use LISTING_PACKAGES — kept for admin/subscriptions. */
export const AD_PLANS = Object.fromEntries(
  Object.entries(LISTING_PACKAGES).map(([key, pkg]) => [
    key,
    {
      label: pkg.label,
      price: pkg.price,
      days: pkg.days,
      description: pkg.description,
    },
  ])
) as Record<
  ListingPackageKey,
  { label: string; price: number; days: number; description: string }
>

export type AdPlanKey = ListingPackageKey

export function formatPackagePrice(price: number) {
  return `R ${price.toLocaleString('en-ZA')}`
}

export function packageRank(plan: string): number {
  const order: Record<string, number> = { NONE: 0, BASIC: 1, FEATURED: 2, PREMIUM: 3 }
  return order[plan] ?? 0
}
