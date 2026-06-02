import AdminShell from '@/components/admin/AdminShell'
import { requireAdmin } from '@/lib/admin'
import { getUnreadActivityCount } from '@/lib/activity'

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
