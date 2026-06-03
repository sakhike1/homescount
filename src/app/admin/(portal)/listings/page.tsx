import AdminSetupNotice from '@/components/admin/AdminSetupNotice'
import ListingManageActions from '@/components/admin/ListingManageActions'
import { isPrismaMissingTableError } from '@/lib/admin-errors'
import { getAdminListings } from '@/lib/admin-listings'
import { AD_PLANS } from '@/lib/ad-plans'

export default async function AdminListingsPage() {
  try {
    const listings = await getAdminListings()
    const publishedCount = listings.filter((p) => p.published).length

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-stone-900">Listings</h1>
          <p className="mt-1 text-sm text-stone-600">
            {listings.length} total · {publishedCount} published — unpublish, suspend, or delete
            listings that break the rules.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-stone-700">Property</th>
                <th className="text-left px-4 py-3 font-bold text-stone-700">Seller</th>
                <th className="text-left px-4 py-3 font-bold text-stone-700">Price</th>
                <th className="text-left px-4 py-3 font-bold text-stone-700">Status</th>
                <th className="text-left px-4 py-3 font-bold text-stone-700">Enquiries</th>
                <th className="text-left px-4 py-3 font-bold text-stone-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-stone-500">
                    No listings in the database yet.
                  </td>
                </tr>
              ) : (
                listings.map((p) => (
                  <tr key={p.id} className="border-b border-stone-100 align-top">
                    <td className="px-4 py-4">
                      <p className="font-medium text-stone-900 max-w-[200px]">{p.title}</p>
                      <p className="text-xs text-stone-500">
                        {p.suburb}, {p.city}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {p.listingType === 'RENT' ? 'Rent' : 'Sale'}
                        {p.featured && (
                          <span className="ml-1 text-amber-700 font-semibold">
                            · {AD_PLANS[p.adPlan as keyof typeof AD_PLANS]?.label ?? 'Featured'}
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-stone-800">{p.seller.name}</p>
                      <p className="text-xs text-stone-500">{p.seller.email}</p>
                      {!p.seller.active && (
                        <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                          Seller suspended
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 font-medium text-stone-800 whitespace-nowrap">
                      R {p.price.toLocaleString('en-ZA')}
                      {p.listingType === 'RENT' && (
                        <span className="text-xs font-normal text-stone-500">/mo</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {p.published ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
                          Live
                        </span>
                      ) : (
                        <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-bold text-stone-700">
                          Hidden
                        </span>
                      )}
                      <p className="mt-1 text-xs text-stone-500">{p.status}</p>
                    </td>
                    <td className="px-4 py-4 text-stone-600">{p._count.inquiries}</td>
                    <td className="px-4 py-4">
                      <ListingManageActions
                        propertyId={p.id}
                        title={p.title}
                        published={p.published}
                        status={p.status}
                        sellerActive={p.seller.active}
                        featured={p.featured}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-stone-900">Listings</h1>
        <AdminSetupNotice
          detail={isPrismaMissingTableError(error) ? undefined : String(error)}
        />
      </div>
    )
  }
}
