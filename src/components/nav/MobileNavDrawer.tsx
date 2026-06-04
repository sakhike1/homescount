'use client'

import Image from 'next/image'
import Link from 'next/link'
import HomescoutLogo from '@/components/brand/HomescoutLogo'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import {
  Building2,
  ChevronRight,
  Home,
  KeyRound,
  LayoutDashboard,
  Store,
  Tag,
  X,
  type LucideIcon,
} from 'lucide-react'

const navLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/buy', label: 'Buy', icon: Store },
  { href: '/sell', label: 'Sell', icon: Tag },
  { href: '/rent', label: 'Rent', icon: KeyRound },
]

/** Hero photography from public/slide-hero — fills space above sign-in on mobile menu */
const MENU_FEATURE_IMAGE = '/slide-hero/0c4dc544712037037444983752fe0a52.jpg'

function isNavLinkActive(
  href: string,
  pathname: string,
  listingType: string | null
) {
  if (href === '/') return pathname === '/'
  if (href === '/buy') {
    return pathname === '/buy' || (pathname.startsWith('/properties') && listingType === 'buy')
  }
  if (href === '/rent') {
    return pathname === '/rent' || (pathname.startsWith('/properties') && listingType === 'rent')
  }
  if (href === '/sell') return pathname === '/sell'
  if (href === '/properties') {
    return (
      pathname.startsWith('/properties') &&
      listingType !== 'buy' &&
      listingType !== 'rent'
    )
  }
  return false
}

type Props = {
  open: boolean
  onClose: () => void
  session: Session | null
  pathname: string
  listingType: string | null
}

export default function MobileNavDrawer({
  open,
  onClose,
  session,
  pathname,
  listingType,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px] animate-[fadeIn_0.2s_ease-out]"
        aria-label="Close menu"
        onClick={onClose}
      />

      <div
        className="absolute inset-y-0 right-0 flex w-[min(100%,19.5rem)] flex-col bg-[#faf9f7] shadow-[-8px_0_32px_rgba(28,25,23,0.12)] animate-[slideInRight_0.28s_cubic-bezier(0.22,1,0.36,1)]"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <header className="flex h-[3.25rem] shrink-0 items-center justify-between border-b border-stone-200/90 px-4">
          <HomescoutLogo tone="default" size="sm" />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-200/60 hover:text-stone-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </header>

        {session ? (
          <div className="shrink-0 border-b border-stone-200/90 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-white">
                {session.user.name?.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-stone-900">{session.user.name}</p>
                <p className="truncate text-xs text-stone-500">{session.user.email}</p>
              </div>
            </div>
          </div>
        ) : null}

        <nav className="shrink-0 overflow-y-auto px-3 pt-4 pb-2">
          <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">
            Menu
          </p>
          <ul className="space-y-0.5">
            {navLinks.map((link) => {
              const active = isNavLinkActive(link.href, pathname, listingType)
              const Icon = link.icon
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3 rounded-xl py-3 pl-3 pr-2 text-[15px] font-semibold transition ${
                      active
                        ? 'border border-stone-200/90 bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:bg-white/70 hover:text-stone-900'
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${
                        active ? 'text-amber-600' : 'text-stone-400 group-hover:text-stone-600'
                      }`}
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="flex-1">{link.label}</span>
                    {active ? (
                      <ChevronRight className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                    ) : null}
                  </Link>
                </li>
              )
            })}
            {session?.user.role === 'SELLER' ? (
              <li>
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-xl py-3 pl-3 pr-2 text-[15px] font-semibold transition ${
                    pathname.startsWith('/dashboard')
                      ? 'border border-stone-200/90 bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:bg-white/70 hover:text-stone-900'
                  }`}
                >
                  <LayoutDashboard
                    className={`h-[18px] w-[18px] shrink-0 ${
                      pathname.startsWith('/dashboard')
                        ? 'text-amber-600'
                        : 'text-stone-400 group-hover:text-stone-600'
                    }`}
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="flex-1">My Listings</span>
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>

        <Link
          href="/properties"
          onClick={onClose}
          className="relative mx-3 my-2 min-h-[7.5rem] flex-1 overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-200 shadow-sm"
        >
          <Image
            src={MENU_FEATURE_IMAGE}
            alt="Homes for sale and rent in South Africa"
            fill
            className="object-cover"
            sizes="(max-width: 320px) 100vw, 312px"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/10 to-transparent"
            aria-hidden
          />
          <p className="absolute bottom-3 left-3 right-3 text-sm font-bold leading-snug text-white drop-shadow-md">
            Explore homes across South Africa
          </p>
        </Link>

        <footer className="shrink-0 border-t border-stone-200/90 bg-[#f5f4f1] px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {session ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full bg-stone-900 py-3 text-sm font-bold text-white transition hover:bg-stone-800"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  signOut({ callbackUrl: '/' })
                }}
                className="w-full py-2.5 text-sm font-semibold text-stone-500 transition hover:text-stone-800"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Link
                href="/register"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full bg-amber-500 py-3 text-sm font-bold text-white shadow-sm shadow-amber-500/20 transition hover:bg-amber-600"
              >
                Get started
              </Link>
              <Link
                href="/login"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full border border-stone-300/90 bg-white py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
              >
                Sign in
              </Link>
            </div>
          )}
        </footer>
      </div>
    </div>
  )
}
