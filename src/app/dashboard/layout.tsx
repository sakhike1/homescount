import { buildPageMetadata } from '@/lib/seo'
import HomescoutLogo from '@/components/brand/HomescoutLogo'
import { requireSeller } from '@/lib/seller'

export const metadata = buildPageMetadata({
  title: 'Seller dashboard',
  description: 'Manage your property listings and enquiries on Homescout.',
  noIndex: true,
})
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
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-6">
            <HomescoutLogo href="/" size="md" />
            <span className="hidden rounded-full bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-800 sm:inline">
              Seller portal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-stone-600 sm:inline">
              {session.user.name}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="shrink-0 lg:w-60">
            <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm lg:sticky lg:top-6">
              <DashboardNav unreadCount={unreadCount} />
            </div>
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
