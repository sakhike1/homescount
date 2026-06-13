'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Plus } from 'lucide-react'

export default function DashboardNav({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname()

  const linkClass = (href: string) =>
    `inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
      pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        ? 'bg-white text-violet-800 shadow-sm ring-1 ring-violet-100'
        : 'text-stone-600 hover:bg-white hover:text-stone-900 hover:shadow-sm'
    }`

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
      <Link href="/dashboard" className={linkClass('/dashboard')}>
        <LayoutDashboard className="h-4 w-4" />
        My listings
      </Link>
      <Link href="/dashboard/messages" className={linkClass('/dashboard/messages')}>
        <MessageSquare className="h-4 w-4" />
        Messages
        {unreadCount > 0 && (
          <span className="ml-auto rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Link>
      <Link
        href="/dashboard/listings/new"
        className="inline-flex items-center gap-2 rounded-xl bg-violet-900 px-3 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800"
      >
        <Plus className="h-4 w-4" />
        New listing
      </Link>
    </nav>
  )
}
