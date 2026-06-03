'use client'

import Link from 'next/link'
import HomescountLogo from '@/components/brand/HomescountLogo'
import { useSession, signOut } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Building2,
  Home,
  KeyRound,
  LayoutDashboard,
  LogIn,
  Menu,
  Sparkles,
  Store,
  Tag,
  X,
} from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/buy', label: 'Buy', icon: Store },
  { href: '/sell', label: 'Sell', icon: Tag },
  { href: '/rent', label: 'Rent', icon: KeyRound },
] as const

function isNavLinkActive(
  href: (typeof navLinks)[number]['href'],
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

export default function Navbar({
  placement = 'top',
}: {
  placement?: 'top' | 'hero'
}) {
  const { data: session } = useSession()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const listingType = searchParams.get('type')
  const isHome = pathname === '/'
  const isHero = placement === 'hero' || isHome

  const navShell =
    placement === 'hero'
      ? 'border-transparent bg-transparent text-white shadow-none'
      : isHome
        ? 'border-white/10 bg-black/15 text-white shadow-none backdrop-blur supports-[backdrop-filter]:bg-black/10'
        : 'border-black/[.08] bg-white/80 text-gray-900 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60'

  const pillShell = isHero
    ? 'bg-white/10 ring-1 ring-white/15 text-white'
    : 'bg-gray-900/5 ring-1 ring-black/[.06] text-gray-900'

  const linkBase = isHero
    ? 'text-white/85 hover:text-white'
    : 'text-gray-600 hover:text-gray-900'

  const placementShell =
    placement === 'hero'
      ? 'absolute left-0 right-0 top-4 sm:top-6 z-40 border-b-0'
      : 'sticky top-0 z-50 border-b'

  useEffect(() => {
    setMobileNavOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileNavOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileNavOpen])

  function navLinkClass(active: boolean, mobile = false) {
    if (mobile) {
      return active
        ? 'bg-amber-500/20 text-amber-50 ring-1 ring-amber-400/40 shadow-sm shadow-amber-500/10'
        : 'text-white/85 hover:bg-white/10 hover:text-white'
    }
    return active
      ? isHero
        ? 'bg-white/15 text-white'
        : 'bg-white text-gray-900 shadow-sm'
      : `${linkBase} hover:bg-white/10`
  }

  function mobileNavLinkContent(link: (typeof navLinks)[number], active: boolean) {
    const Icon = link.icon
    return (
      <>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
            active ? 'bg-amber-500/25 text-amber-200' : 'bg-white/10 text-white/70'
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="flex-1">{link.label}</span>
        {active && (
          <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
        )}
      </>
    )
  }

  return (
    <>
      <nav className={`${placementShell} ${navShell}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center h-14 sm:h-16 gap-2 sm:gap-4 ${
              placement === 'hero'
                ? 'rounded-full px-2 sm:px-4 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/15'
                : ''
            }`}
          >
            <HomescountLogo tone={isHero ? 'hero' : 'default'} size="md" />

            {/* Desktop center links */}
            <div className={`hidden md:flex items-center gap-1 rounded-full px-2 py-1 ${pillShell}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${navLinkClass(isNavLinkActive(link.href, pathname, listingType))}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop + mobile auth */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {session ? (
                <>
                  {session.user.role === 'SELLER' && (
                    <Link
                      href="/dashboard"
                      className={`hidden md:block text-sm font-semibold transition ${linkBase}`}
                    >
                      My Listings
                    </Link>
                  )}
                  <div className="relative hidden md:block">
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={`flex items-center gap-2 rounded-full px-3 py-2 transition ${isHero ? 'bg-white/10 hover:bg-white/15' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className={`text-sm font-semibold ${isHero ? 'text-white/90' : 'text-gray-700'}`}>
                        {session.user.name}
                      </span>
                    </button>
                    {userMenuOpen && (
                      <div
                        className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border py-1 z-50 ${isHero ? 'bg-gray-950/80 border-white/10 text-white backdrop-blur' : 'bg-white border-gray-100'}`}
                      >
                        <Link
                          href="/dashboard"
                          className={`block px-4 py-2 text-sm ${isHero ? 'text-white/90 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50'}`}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <hr className={`my-1 ${isHero ? 'border-white/10' : ''}`} />
                        <button
                          type="button"
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className={`block w-full text-left px-4 py-2 text-sm ${isHero ? 'text-red-300 hover:bg-white/10' : 'text-red-500 hover:bg-gray-50'}`}
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`hidden md:inline-flex text-sm font-semibold transition ${linkBase}`}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="hidden md:inline-flex bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-amber-600 transition whitespace-nowrap shadow-sm shadow-amber-500/20"
                  >
                    Get started
                  </Link>
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className={`md:hidden inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full transition ${
                  isHero
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                }`}
                aria-label="Open menu"
                aria-expanded={mobileNavOpen}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-stone-950/70 backdrop-blur-md transition-opacity"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />

          <div
            className="absolute inset-y-0 right-0 flex w-[min(100%,18.5rem)] flex-col border-l border-white/10 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white shadow-2xl shadow-black/40"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent"
              aria-hidden
            />

            <div className="relative flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
              <HomescountLogo tone="hero" size="sm" />
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {session ? (
              <div className="relative shrink-0 border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 ring-1 ring-white/10">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-white shadow-md shadow-amber-500/30">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{session.user.name}</p>
                    <p className="truncate text-xs text-white/55">{session.user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative shrink-0 border-b border-white/10 px-4 py-3">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-200/90">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Find your next home
                </p>
                <p className="mt-1 text-sm text-white/55">Browse sale and rental listings across SA</p>
              </div>
            )}

            <nav className="relative shrink-0 space-y-1.5 overflow-y-auto px-3 py-3">
              {navLinks.map((link) => {
                const active = isNavLinkActive(link.href, pathname, listingType)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-base font-semibold transition ${navLinkClass(active, true)}`}
                  >
                    {mobileNavLinkContent(link, active)}
                  </Link>
                )
              })}

              {session?.user.role === 'SELLER' && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-base font-semibold transition ${navLinkClass(pathname.startsWith('/dashboard'), true)}`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/70">
                    <LayoutDashboard className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="flex-1">My Listings</span>
                </Link>
              )}
            </nav>

            <div className="relative shrink-0 space-y-2 border-t border-white/10 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
                  >
                    <LayoutDashboard className="h-4 w-4" aria-hidden />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileNavOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="block w-full rounded-2xl px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
                  >
                    <LogIn className="h-4 w-4" aria-hidden />
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition hover:from-amber-400 hover:to-amber-500"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden />
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
