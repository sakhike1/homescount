export const AD_PLANS = {
  BASIC: {
    label: 'Basic boost',
    price: 299,
    days: 7,
    description: 'Featured on homepage for 7 days',
  },
  FEATURED: {
    label: 'Featured listing',
    price: 799,
    days: 30,
    description: 'Priority placement for 30 days',
  },
  PREMIUM: {
    label: 'Premium spotlight',
    price: 1499,
    days: 30,
    description: 'Top carousel + featured badge for 30 days',
  },
} as const

export type AdPlanKey = keyof typeof AD_PLANS
