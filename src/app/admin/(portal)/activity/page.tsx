import AdminActivityPanel from '@/components/admin/AdminActivityPanel'
import AdminSetupNotice from '@/components/admin/AdminSetupNotice'
import { isPrismaMissingTableError } from '@/lib/admin-errors'
import { getAdminInquiries } from '@/lib/admin-listings'
import { getRecentActivities } from '@/lib/activity'

export default async function AdminActivityPage() {
  try {
    const [activities, inquiries] = await Promise.all([
      getRecentActivities(100),
      getAdminInquiries(30),
    ])

    const serialized = activities.map((a) => ({
      id: a.id,
      type: a.type,
      message: a.message,
      read: a.read,
      createdAt: a.createdAt.toISOString(),
      user: a.user,
    }))

    const unreadInquiries = inquiries.filter((i) => !i.read).length

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-stone-900">Site activity</h1>
          <p className="mt-1 text-sm text-stone-600">
            Registrations, newsletter sign-ups, payments, enquiries, listing changes, and admin
            actions.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <AdminActivityPanel activities={serialized} />
        </div>

        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-bold text-stone-900">Buyer enquiries</h2>
            {unreadInquiries > 0 && (
              <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">
                {unreadInquiries} unread
              </span>
            )}
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">Date</th>
                  <th className="text-left px-4 py-3 font-bold">From</th>
                  <th className="text-left px-4 py-3 font-bold">Property</th>
                  <th className="text-left px-4 py-3 font-bold">Message</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-stone-500">
                      No enquiries yet. They appear here and in the activity feed when buyers
                      contact sellers.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr
                      key={inq.id}
                      className={`border-b border-stone-100 ${!inq.read ? 'bg-amber-50/50' : ''}`}
                    >
                      <td className="px-4 py-3 text-stone-500 whitespace-nowrap">
                        {inq.createdAt.toLocaleString('en-ZA')}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-stone-900">{inq.name}</p>
                        <p className="text-xs text-stone-500">{inq.email}</p>
                      </td>
                      <td className="px-4 py-3 text-stone-700">
                        {inq.property.title}
                        <p className="text-xs text-stone-400">{inq.property.seller.name}</p>
                      </td>
                      <td className="px-4 py-3 text-stone-600 max-w-xs truncate">
                        {inq.message}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-stone-900">Site activity</h1>
        <AdminSetupNotice
          detail={isPrismaMissingTableError(error) ? undefined : String(error)}
        />
      </div>
    )
  }
}
