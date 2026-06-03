import AdminShell from '@/components/admin/AdminShell'
import AdminSetupNotice from '@/components/admin/AdminSetupNotice'
import { requireAdmin } from '@/lib/admin'
import { isPrismaMissingTableError } from '@/lib/admin-errors'
import { buildPageMetadata } from '@/lib/seo'
import { getUnreadActivityCount } from '@/lib/activity'

export const metadata = buildPageMetadata({
  title: 'Admin portal',
  description: 'Homescount administration.',
  noIndex: true,
})

/** Auth + DB — must not prerender at build (no DATABASE_URL on Netlify build workers). */
export const dynamic = 'force-dynamic'

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAdmin()

  let unreadCount = 0
  let dbError: string | undefined

  try {
    unreadCount = await getUnreadActivityCount()
  } catch (error) {
    if (isPrismaMissingTableError(error)) {
      dbError = 'missing_tables'
    } else {
      dbError = String(error)
    }
  }

  return (
    <AdminShell adminName={session.user.name ?? 'Admin'} unreadCount={unreadCount}>
      {dbError && (
        <div className="mb-6">
          <AdminSetupNotice detail={dbError === 'missing_tables' ? undefined : dbError} />
        </div>
      )}
      {children}
    </AdminShell>
  )
}
