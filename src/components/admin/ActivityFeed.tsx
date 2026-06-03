'use client'

import { useRouter } from 'next/navigation'

export type ActivityItem = {
  id: string
  type: string
  message: string
  read: boolean
  createdAt: string
  user: { name: string; email: string; role: string } | null
}

const typeColors: Record<string, string> = {
  USER_REGISTERED: 'bg-blue-100 text-blue-800',
  SELLER_REGISTERED: 'bg-purple-100 text-purple-800',
  NEWSLETTER_SUBSCRIBED: 'bg-sky-100 text-sky-800',
  INQUIRY_SENT: 'bg-amber-100 text-amber-800',
  LISTING_PUBLISHED: 'bg-green-100 text-green-800',
  AD_PAYMENT: 'bg-emerald-100 text-emerald-800',
  SELLER_SUSPENDED: 'bg-red-100 text-red-800',
  SELLER_REACTIVATED: 'bg-teal-100 text-teal-800',
  AD_EXPIRED: 'bg-stone-200 text-stone-800',
  LISTING_UNPUBLISHED: 'bg-orange-100 text-orange-800',
  LISTING_SUSPENDED: 'bg-red-100 text-red-800',
  LISTING_REMOVED: 'bg-red-200 text-red-900',
  LISTING_REPUBLISHED: 'bg-green-100 text-green-800',
}

export default function ActivityFeed({
  activities,
  showMarkAllRead = false,
}: {
  activities: ActivityItem[]
  showMarkAllRead?: boolean
}) {
  const router = useRouter()

  async function markAllRead() {
    await fetch('/api/admin/activities/read-all', { method: 'POST' })
    router.refresh()
  }

  if (activities.length === 0) {
    return (
      <p className="text-sm text-stone-500 py-8 text-center">No activity yet.</p>
    )
  }

  return (
    <div>
      {showMarkAllRead && activities.some((a) => !a.read) && (
        <button
          type="button"
          onClick={markAllRead}
          className="mb-4 text-sm font-bold text-amber-700 hover:text-amber-800"
        >
          Mark all as read
        </button>
      )}
      <ul className="space-y-2">
        {activities.map((a) => (
          <li
            key={a.id}
            className={`rounded-xl border px-4 py-3 text-sm ${
              a.read
                ? 'border-stone-200 bg-white'
                : 'border-amber-200 bg-amber-50/80'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                  typeColors[a.type] ?? 'bg-stone-100 text-stone-700'
                }`}
              >
                {a.type.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-stone-400 ml-auto">
                {new Date(a.createdAt).toLocaleString('en-ZA')}
              </span>
            </div>
            <p className="mt-2 text-stone-800">{a.message}</p>
            {a.user && (
              <p className="mt-1 text-xs text-stone-500">
                {a.user.name} · {a.user.email} · {a.user.role}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
