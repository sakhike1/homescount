'use client'

import { useMemo, useState } from 'react'
import ActivityFeed, { type ActivityItem } from '@/components/admin/ActivityFeed'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'INQUIRY_SENT', label: 'Enquiries' },
  { id: 'NEWSLETTER_SUBSCRIBED', label: 'Newsletter' },
  { id: 'AD_PAYMENT', label: 'Payments' },
  { id: 'LISTING', label: 'Listings' },
  { id: 'SELLER', label: 'Sellers' },
] as const

function matchesFilter(item: ActivityItem, filter: (typeof filters)[number]['id']) {
  if (filter === 'all') return true
  if (filter === 'LISTING') {
    return item.type.startsWith('LISTING_') || item.type === 'AD_EXPIRED'
  }
  if (filter === 'SELLER') {
    return item.type.startsWith('SELLER_')
  }
  return item.type === filter
}

export default function AdminActivityPanel({
  activities,
}: {
  activities: ActivityItem[]
}) {
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')

  const filtered = useMemo(
    () => activities.filter((a) => matchesFilter(a, filter)),
    [activities, filter]
  )

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              filter === f.id
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ActivityFeed activities={filtered} showMarkAllRead />
    </div>
  )
}
