import { buildPageMetadata } from '@/lib/seo'
import AdminShell from '@/components/admin/AdminShell'
import { requireAdmin } from '@/lib/admin'

export const metadata = buildPageMetadata({
  title: 'Admin portal',
  description: 'Homescount administration.',
  noIndex: true,
})
import { getUnreadActivityCount } from '@/lib/activity'

/** Auth + DB — must not prerender at build (no DATABASE_URL on Netlify build workers). */
export const dynamic = 'force-dynamic'

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAdmin()
  const unreadCount = await getUnreadActivityCount()

  return (
    <AdminShell adminName={session.user.name ?? 'Admin'} unreadCount={unreadCount}>
      {children}
    </AdminShell>
  )
}
