import AdminSetupNotice from '@/components/admin/AdminSetupNotice'
import { isPrismaMissingTableError } from '@/lib/admin-errors'
import prisma from '@/lib/prisma'

export default async function AdminUsersPage() {
  try {
  const buyers = await prisma.user.findMany({
    where: { role: 'BUYER' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Buyers</h1>
        <p className="mt-1 text-sm text-stone-600">
          {buyers.length} registered buyer{buyers.length === 1 ? '' : 's'} on Homescout.
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-4 py-3 font-bold text-stone-700">Name</th>
              <th className="text-left px-4 py-3 font-bold text-stone-700">Email</th>
              <th className="text-left px-4 py-3 font-bold text-stone-700">Joined</th>
            </tr>
          </thead>
          <tbody>
            {buyers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-stone-500">
                  No buyers yet.
                </td>
              </tr>
            ) : (
              buyers.map((u) => (
                <tr key={u.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-stone-900">{u.name}</td>
                  <td className="px-4 py-3 text-stone-600">{u.email}</td>
                  <td className="px-4 py-3 text-stone-500">
                    {u.createdAt.toLocaleDateString('en-ZA')}
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
        <h1 className="text-2xl font-black text-stone-900">Buyers</h1>
        <AdminSetupNotice
          detail={isPrismaMissingTableError(error) ? undefined : String(error)}
        />
      </div>
    )
  }
}
