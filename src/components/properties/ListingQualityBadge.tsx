import { listingQualityLabel, listingQualityTier } from '@/lib/listing-quality'

const tierStyles = {
  excellent: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  good: 'bg-sky-50 text-sky-800 ring-sky-200',
  fair: 'bg-amber-50 text-amber-800 ring-amber-200',
  'needs-work': 'bg-stone-100 text-stone-700 ring-stone-200',
} as const

export default function ListingQualityBadge({ score }: { score: number }) {
  const tier = listingQualityTier(score)

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${tierStyles[tier]}`}
      title={listingQualityLabel(score)}
    >
      <span className="tabular-nums">{score}/100</span>
      <span className="hidden sm:inline">{listingQualityLabel(score)}</span>
    </div>
  )
}
