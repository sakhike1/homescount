import { buildPropertyFeatureRows, type PropertyFeatures } from '@/lib/property-features'

export default function PropertyFeaturesSection({
  bedrooms,
  bathrooms,
  parkings,
  features,
}: {
  bedrooms: number
  bathrooms: number
  parkings: number
  features?: PropertyFeatures | null
}) {
  const rows = buildPropertyFeatureRows({ bedrooms, bathrooms, parkings, features })

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-bold text-stone-900">Property features</h2>
      <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 border-b border-stone-100 pb-3"
          >
            <dt className="text-sm text-stone-500">{label}</dt>
            <dd className="text-sm font-semibold text-stone-800">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
