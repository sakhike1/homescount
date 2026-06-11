/** Structured property amenities — stored as JSON on Property.features */
export type PropertyFeatures = {
  ensuites?: number
  lounges?: number
  diningAreas?: number
  petFriendly?: boolean
  balcony?: boolean
  pool?: boolean
  staffQuarters?: boolean
  study?: boolean
  kitchen?: boolean
  garden?: boolean
  familyTvRoom?: boolean
  paving?: boolean
  guestToilet?: boolean
  builtInBrai?: boolean
  aircon?: boolean
}

export type FeatureRow =
  | { kind: 'number'; key: keyof Pick<PropertyFeatures, 'ensuites' | 'lounges' | 'diningAreas'>; label: string }
  | { kind: 'boolean'; key: keyof Omit<PropertyFeatures, 'ensuites' | 'lounges' | 'diningAreas'>; label: string }

export const PROPERTY_FEATURE_DEFINITIONS: FeatureRow[] = [
  { kind: 'number', key: 'ensuites', label: 'En-suite' },
  { kind: 'number', key: 'lounges', label: 'Lounges' },
  { kind: 'number', key: 'diningAreas', label: 'Dining areas' },
  { kind: 'boolean', key: 'petFriendly', label: 'Pet friendly' },
  { kind: 'boolean', key: 'balcony', label: 'Balcony' },
  { kind: 'boolean', key: 'pool', label: 'Pool' },
  { kind: 'boolean', key: 'staffQuarters', label: 'Staff quarters' },
  { kind: 'boolean', key: 'study', label: 'Study' },
  { kind: 'boolean', key: 'kitchen', label: 'Kitchen' },
  { kind: 'boolean', key: 'garden', label: 'Garden' },
  { kind: 'boolean', key: 'familyTvRoom', label: 'Family TV room' },
  { kind: 'boolean', key: 'paving', label: 'Paving' },
  { kind: 'boolean', key: 'guestToilet', label: 'Guest toilet' },
  { kind: 'boolean', key: 'builtInBrai', label: 'Built-in braai' },
  { kind: 'boolean', key: 'aircon', label: 'Aircon' },
]

export const EMPTY_PROPERTY_FEATURES: PropertyFeatures = {}

export function parsePropertyFeatures(raw: unknown): PropertyFeatures {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {}
  }

  const input = raw as Record<string, unknown>
  const features: PropertyFeatures = {}

  for (const def of PROPERTY_FEATURE_DEFINITIONS) {
    if (def.kind === 'number') {
      const v = input[def.key]
      if (typeof v === 'number' && v > 0) features[def.key] = v
      else if (typeof v === 'string' && v.trim() !== '') {
        const n = Number(v)
        if (!Number.isNaN(n) && n > 0) features[def.key] = n
      }
    } else {
      if (input[def.key] === true) features[def.key] = true
    }
  }

  return features
}

export type PropertyFeatureDisplayItem = { label: string; value: string }

/** Rows for the public “Property features” block (core stats + amenities). */
export function buildPropertyFeatureRows(input: {
  bedrooms: number
  bathrooms: number
  parkings: number
  features?: PropertyFeatures | null
}): PropertyFeatureDisplayItem[] {
  const features = input.features ?? {}
  const rows: PropertyFeatureDisplayItem[] = [
    { label: 'Bedrooms', value: String(input.bedrooms) },
    { label: 'Bathrooms', value: String(input.bathrooms) },
    { label: 'Garage parking', value: String(input.parkings) },
  ]

  for (const def of PROPERTY_FEATURE_DEFINITIONS) {
    if (def.kind === 'number') {
      const v = features[def.key]
      if (typeof v === 'number' && v > 0) {
        rows.push({ label: def.label, value: String(v) })
      }
    } else if (features[def.key]) {
      rows.push({ label: def.label, value: 'Yes' })
    }
  }

  return rows
}

export function countFilledFeatures(features: PropertyFeatures): number {
  let n = 0
  for (const def of PROPERTY_FEATURE_DEFINITIONS) {
    if (def.kind === 'number') {
      const v = features[def.key]
      if (typeof v === 'number' && v > 0) n++
    } else if (features[def.key]) {
      n++
    }
  }
  return n
}
