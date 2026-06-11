'use client'

import {
  EMPTY_PROPERTY_FEATURES,
  PROPERTY_FEATURE_DEFINITIONS,
  type PropertyFeatures,
} from '@/lib/property-features'
import { formInputClass } from '@/lib/form-styles'

export default function PropertyFeaturesForm({
  value,
  onChange,
}: {
  value: PropertyFeatures
  onChange: (next: PropertyFeatures) => void
}) {
  const features = value ?? EMPTY_PROPERTY_FEATURES

  function setNumber(
    key: 'ensuites' | 'lounges' | 'diningAreas',
    raw: string
  ) {
    const n = raw === '' ? undefined : Number(raw)
    onChange({
      ...features,
      [key]: n && n > 0 ? n : undefined,
    })
  }

  function toggleBoolean(
    key: Exclude<keyof PropertyFeatures, 'ensuites' | 'lounges' | 'diningAreas'>
  ) {
    onChange({
      ...features,
      [key]: features[key] ? undefined : true,
    })
  }

  const numberDefs = PROPERTY_FEATURE_DEFINITIONS.filter((d) => d.kind === 'number')
  const booleanDefs = PROPERTY_FEATURE_DEFINITIONS.filter((d) => d.kind === 'boolean')

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-gray-50/80 p-5 sm:p-6">
      <div>
        <h3 className="text-base font-bold text-gray-900">Property features</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add rooms and amenities buyers look for — bedrooms, bathrooms, and parking are
          captured above.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {numberDefs.map((def) => (
          <div key={def.key}>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {def.label}
            </label>
            <input
              type="number"
              min="0"
              value={features[def.key] ?? ''}
              onChange={(e) => setNumber(def.key, e.target.value)}
              className={formInputClass}
              placeholder="0"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {booleanDefs.map((def) => (
          <button
            key={def.key}
            type="button"
            onClick={() => toggleBoolean(def.key)}
            className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
              features[def.key]
                ? 'border-amber-500 bg-amber-50 text-amber-900'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            {def.label}
          </button>
        ))}
      </div>
    </div>
  )
}
