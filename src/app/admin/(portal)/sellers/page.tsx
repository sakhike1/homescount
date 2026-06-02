import SellerManageActions from '@/components/admin/SellerManageActions'
import prisma from '@/lib/prisma'
import { AD_PLANS } from '@/lib/ad-plans'

export default async function AdminSellersPage() {
  const now = new Date()

  const sellers = await prisma.user.findMany({
    where: { role: 'SELLER' },
    include: {
      properties: {
        select: {
          id: true,
          title: true,
          published: true,
          featured: true,
          featuredUntil: true,
          adPlan: true,
        },
      },
      adPayments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: { select: { properties: true, adPayments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Sellers</h1>
        <p className="mt-1 text-sm text-stone-600">
          Suspend sellers who have not paid, or end expired advertisement deals.
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-4 py-3 font-bold text-stone-700">Seller</th>
              <th className="text-left px-4 py-3 font-bold text-stone-700">Status</th>
              <th className="text-left px-4 py-3 font-bold text-stone-700">Listings</th>
              <th className="text-left px-4 py-3 font-bold text-stone-700">Active ads</th>
              <th className="text-left px-4 py-3 font-bold text-stone-700">Last payment</th>
              <th className="text-left px-4 py-3 font-bold text-stone-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => {
              const activeAds = seller.properties.filter(
                (p) =>
                  p.featured &&
                  (!p.featuredUntil || p.featuredUntil > now)
              )
              const expiredAds = seller.properties.filter(
                (p) => p.featured && p.featuredUntil && p.featuredUntil <= now
              )
              const lastPayment = seller.adPayments[0]

              return (
                <tr key={seller.id} className="border-b border-stone-100 align-top">
                  <td className="px-4 py-4">
                    <p className="font-medium text-stone-900">{seller.name}</p>
                    <p className="text-xs text-stone-500">{seller.email}</p>
                    {seller.phone && (
                      <p className="text-xs text-stone-400">{seller.phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {seller.active ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">
                        Suspended
                      </span>
                    )}
                    {!seller.active && seller.suspendedReason && (
                      <p className="mt-1 text-xs text-stone-500 max-w-[140px]">
                        {seller.suspendedReason}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-stone-600">
                    {seller._count.properties} total
                    <br />
                    <span className="text-xs">
                      {seller.properties.filter((p) => p.published).length} published
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {activeAds.length > 0 ? (
                      <ul className="text-xs space-y-1">
                        {activeAds.map((p) => (
                          <li key={p.id} className="text-stone-700">
                            {p.title.slice(0, 30)}
                            {p.featuredUntil && (
                              <span className="text-stone-400">
                                {' '}
                                until {p.featuredUntil.toLocaleDateString('en-ZA')}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : expiredAds.length > 0 ? (
                      <span className="text-xs text-amber-700 font-medium">
                        {expiredAds.length} expired ad(s)
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs text-stone-600">
                    {lastPayment ? (
                      <>
                        {AD_PLANS[lastPayment.plan as keyof typeof AD_PLANS]?.label ??
                          lastPayment.plan}
                        <br />
                        R {lastPayment.amount.toLocaleString('en-ZA')}
                        <br />
                        {lastPayment.createdAt.toLocaleDateString('en-ZA')}
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <SellerManageActions
                      sellerId={seller.id}
                      active={seller.active}
                      properties={seller.properties.map((p) => ({
                        id: p.id,
                        title: p.title,
                        featured: p.featured,
                        featuredUntil: p.featuredUntil?.toISOString() ?? null,
                      }))}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
