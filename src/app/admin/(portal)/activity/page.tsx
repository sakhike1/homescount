import ActivityFeed from '@/components/admin/ActivityFeed'
import { getRecentActivities } from '@/lib/activity'

export default async function AdminActivityPage() {
  const activities = await getRecentActivities(100)

  const serialized = activities.map((a) => ({
    id: a.id,
    type: a.type,
    message: a.message,
    read: a.read,
    createdAt: a.createdAt.toISOString(),
    user: a.user,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Site activity</h1>
        <p className="mt-1 text-sm text-stone-600">
          Registrations, subscriptions, payments, enquiries, and admin actions.
        </p>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <ActivityFeed activities={serialized} showMarkAllRead />
      </div>
    </div>
  )
}
