import Link from 'next/link'
import ActivityFeed from '@/components/admin/ActivityFeed'
import { getAdminStats } from '@/lib/admin'
import { expireOverdueAdvertisements, getRecentActivities } from '@/lib/activity'

export default async function AdminDashboardPage() {
  await expireOverdueAdvertisements()

  const [stats, activities] = await Promise.all([
    getAdminStats(),
    getRecentActivities(15),
  ])

  const serialized = activities.map((a) => ({
    id: a.id,
    type: a.type,
    message: a.message,
    read: a.read,
    createdAt: a.createdAt.toISOString(),
    user: a.user,
  }))

  const statCards = [
    { label: 'Buyers', value: stats.buyerCount, href: '/admin/users' },
    { label: 'Sellers (active)', value: stats.activeSellers, href: '/admin/sellers' },
    { label: 'Suspended sellers', value: stats.suspendedSellers, href: '/admin/sellers' },
    { label: 'Published listings', value: stats.publishedListings, href: '/properties' },
    { label: 'Newsletter subs', value: stats.newsletterCount, href: '/admin/subscriptions' },
    { label: 'Ad payments', value: stats.adPaymentCount, href: '/admin/subscriptions' },
    { label: 'Buyer enquiries', value: stats.inquiryCount, href: '/admin/activity' },
    { label: 'Unread alerts', value: stats.unreadActivities, href: '/admin/activity' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Overview</h1>
        <p className="mt-1 text-sm text-stone-600">
          Monitor site activity, subscriptions, sellers, and buyers.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:border-amber-200 transition"
          >
            <p className="text-2xl font-bold text-stone-900">{card.value}</p>
            <p className="mt-1 text-xs font-medium text-stone-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold text-stone-900">Recent activity</h2>
          <Link
            href="/admin/activity"
            className="text-sm font-bold text-amber-700 hover:underline"
          >
            View all
          </Link>
        </div>
        <ActivityFeed activities={serialized} />
      </div>
    </div>
  )
}
