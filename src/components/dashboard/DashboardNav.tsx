'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Plus } from 'lucide-react'

export default function DashboardNav({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname()

  const linkClass = (href: string) =>
    `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
      pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        ? 'bg-white text-amber-700 shadow-sm ring-1 ring-amber-100'
        : 'text-gray-700 hover:bg-white hover:shadow-sm'
    }`

  return (
    <nav className="flex lg:flex-col gap-2">
      <Link href="/dashboard" className={linkClass('/dashboard')}>
        <LayoutDashboard className="h-4 w-4" />
        My listings
      </Link>
      <Link href="/dashboard/messages" className={linkClass('/dashboard/messages')}>
        <MessageSquare className="h-4 w-4" />
        Messages
        {unreadCount > 0 && (
          <span className="ml-auto rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Link>
      <Link
        href="/dashboard/listings/new"
        className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-bold text-white hover:bg-amber-600"
      >
        <Plus className="h-4 w-4" />
        New listing
      </Link>
    </nav>
  )
}
