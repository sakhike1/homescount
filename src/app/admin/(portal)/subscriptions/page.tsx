import AdminSetupNotice from '@/components/admin/AdminSetupNotice'
import { isPrismaMissingTableError } from '@/lib/admin-errors'
import { AD_PLANS } from '@/lib/ad-plans'
import prisma from '@/lib/prisma'

export default async function AdminSubscriptionsPage() {
  try {
    const [subscribers, payments] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.adPayment.findMany({
        include: {
          seller: { select: { name: true, email: true } },
          property: { select: { title: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const totalRevenue = payments
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0)

    const completedCount = payments.filter((p) => p.status === 'COMPLETED').length

    return (
      <div className="space-y-10">
        <div>
          <h1 className="text-2xl font-black text-stone-900">Subscriptions & payments</h1>
          <p className="mt-1 text-sm text-stone-600">
            Newsletter sign-ups from the site footer and seller advertisement payments when listings
            are promoted.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-stone-900">{subscribers.length}</p>
            <p className="text-xs font-medium text-stone-500 mt-1">Newsletter subscribers</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-stone-900">{completedCount}</p>
            <p className="text-xs font-medium text-stone-500 mt-1">Completed ad payments</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm col-span-2 sm:col-span-1">
            <p className="text-2xl font-bold text-amber-900">
              R {totalRevenue.toLocaleString('en-ZA')}
            </p>
            <p className="text-xs font-medium text-amber-800/80 mt-1">Ad revenue (completed)</p>
          </div>
        </div>

        <section>
          <h2 className="text-lg font-bold text-stone-900">Advertisement payments</h2>
          <p className="mt-1 text-sm text-stone-500">
            Recorded when sellers promote a listing from their dashboard.
          </p>
          <div className="mt-4 rounded-2xl border border-stone-200 bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">Date</th>
                  <th className="text-left px-4 py-3 font-bold">Seller</th>
                  <th className="text-left px-4 py-3 font-bold">Property</th>
                  <th className="text-left px-4 py-3 font-bold">Plan</th>
                  <th className="text-left px-4 py-3 font-bold">Amount</th>
                  <th className="text-left px-4 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-stone-500">
                      No ad payments yet. When a seller promotes a listing, it will appear here and
                      in Activity.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="border-b border-stone-100">
                      <td className="px-4 py-3 text-stone-500">
                        {p.createdAt.toLocaleString('en-ZA')}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{p.seller.name}</p>
                        <p className="text-xs text-stone-500">{p.seller.email}</p>
                      </td>
                      <td className="px-4 py-3 text-stone-700">{p.property.title}</td>
                      <td className="px-4 py-3">
                        {AD_PLANS[p.plan as keyof typeof AD_PLANS]?.label ?? p.plan}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        R {p.amount.toLocaleString('en-ZA')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            p.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : p.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900">Newsletter subscribers</h2>
          <p className="mt-1 text-sm text-stone-500">
            Collected via the footer form (with POPIA consent). Also logged under Activity.
          </p>
          <div className="mt-4 rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">Email</th>
                  <th className="text-left px-4 py-3 font-bold">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-12 text-center text-stone-500">
                      No subscribers yet. Use the newsletter form on the public site footer to test.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((s) => (
                    <tr key={s.id} className="border-b border-stone-100">
                      <td className="px-4 py-3 font-medium">{s.email}</td>
                      <td className="px-4 py-3 text-stone-500">
                        {s.createdAt.toLocaleString('en-ZA')}
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
        <h1 className="text-2xl font-black text-stone-900">Subscriptions & payments</h1>
        <AdminSetupNotice
          detail={isPrismaMissingTableError(error) ? undefined : String(error)}
        />
      </div>
    )
  }
}
