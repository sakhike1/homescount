import Link from 'next/link'
import { requireSeller } from '@/lib/seller'
import SignOutButton from '@/components/SignOutButton'
import DashboardNav from '@/components/dashboard/DashboardNav'
import { getUnreadInquiryCount } from '@/lib/inquiries'

/** Seller portal uses session + DB — skip static generation at build. */
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireSeller()
  const unreadCount = await getUnreadInquiryCount(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-gray-900">
              Homes<span className="text-amber-600">count</span>
            </Link>
            <span className="hidden sm:inline text-sm font-semibold text-gray-500">
              Seller Portal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-600">
              {session.user.name}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-56 shrink-0">
            <DashboardNav unreadCount={unreadCount} />
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
