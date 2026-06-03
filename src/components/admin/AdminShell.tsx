import HomescountLogo from '@/components/brand/HomescountLogo'
import SignOutButton from '@/components/SignOutButton'
import AdminNav from '@/components/admin/AdminNav'

export default function AdminShell({
  children,
  adminName,
  unreadCount,
}: {
  children: React.ReactNode
  adminName: string
  unreadCount: number
}) {
  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b border-stone-200 bg-stone-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-4">
            <HomescountLogo
              href="/admin"
              tone="onDark"
              size="md"
              suffix={
                <span className="text-xs font-semibold text-stone-400">Admin</span>
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-stone-400">{adminName}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-56 shrink-0">
            <div className="rounded-2xl border border-stone-200 bg-white p-2 shadow-sm lg:p-3">
              <AdminNav unreadCount={unreadCount} />
            </div>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
