import prisma from '@/lib/prisma'
import { AD_PLANS } from '@/lib/ad-plans'

export default async function AdminSubscriptionsPage() {
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

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Subscriptions & payments</h1>
        <p className="mt-1 text-sm text-stone-600">
          Newsletter sign-ups and seller advertisement payments.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-stone-900">Advertisement payments</h2>
        <p className="mt-1 text-sm text-stone-500">
          Total revenue (completed): R {totalRevenue.toLocaleString('en-ZA')}
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
                    No payments yet.
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
        <p className="mt-1 text-sm text-stone-500">{subscribers.length} subscribers</p>
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
                    No subscribers yet.
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
}
