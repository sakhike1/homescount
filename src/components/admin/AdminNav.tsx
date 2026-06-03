'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  Building2,
  CreditCard,
  LayoutDashboard,
  Store,
  Users,
} from 'lucide-react'

const links = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/activity', label: 'Activity', icon: Activity },
  { href: '/admin/listings', label: 'Listings', icon: Building2 },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/admin/sellers', label: 'Sellers', icon: Store },
  { href: '/admin/users', label: 'Buyers', icon: Users },
]

export default function AdminNav({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap lg:flex-col gap-1 lg:sticky lg:top-24">
      {links.map((link) => {
        const Icon = link.icon
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              active
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Icon className="h-4 w-4" />
            {link.label}
            {link.href === '/admin/activity' && unreadCount > 0 && (
              <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        )
      })}
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:text-stone-800 mt-2 lg:mt-4"
      >
        ← Public site
      </Link>
    </nav>
  )
}
