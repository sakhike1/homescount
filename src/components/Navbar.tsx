'use client'

import Link from 'next/link'
import HomescoutLogo from '@/components/brand/HomescoutLogo'
import { useSession, signOut } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, Menu } from 'lucide-react'
import MobileNavDrawer from '@/components/nav/MobileNavDrawer'
import {
  signupNavButtonClass,
  signupNavIconClass,
} from '@/components/auth/auth-styles'
import { HOME_HERO_CONTAINER } from '@/lib/home-hero-layout'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/buy', label: 'Buy' },
  { href: '/sell', label: 'Sell' },
  { href: '/rent', label: 'Rent' },
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
  const isHeroOverlay = placement === 'hero'
  const isModernNav = placement === 'top'
  const isHome = pathname === '/'

  const visibleNavLinks = isHome
    ? navLinks.filter((link) => link.href !== '/')
    : navLinks

  const navShell = isHeroOverlay
    ? 'border-transparent bg-transparent text-white shadow-none'
    : isHome
      ? 'border-0 bg-transparent text-stone-900 shadow-none'
      : 'border-b border-stone-200/80 bg-[#faf9f7]/95 text-stone-900 shadow-none backdrop-blur supports-[backdrop-filter]:bg-[#faf9f7]/90'

  const linkBase = isHeroOverlay
    ? 'text-white/85 hover:text-white'
    : 'text-stone-600 hover:text-stone-900'

  const placementShell = isHeroOverlay
    ? 'absolute left-0 right-0 top-4 sm:top-6 z-40 border-b-0'
    : isHome
      ? 'relative z-40 border-b-0'
      : 'sticky top-0 z-50 border-b-0'

  const containerClass = isHome ? HOME_HERO_CONTAINER : 'max-w-7xl mx-auto w-full'

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

  function navLinkClass(active: boolean) {
    if (isModernNav) {
      return active
        ? 'text-stone-900 font-semibold'
        : `${linkBase} font-medium`
    }
    return active
      ? 'bg-white/15 text-white'
      : `${linkBase} hover:bg-white/10`
  }

  function renderAuthActions() {
    if (session) {
      return (
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
              className={`flex items-center gap-2 rounded-full px-3 py-2 transition ${
                isHeroOverlay
                  ? 'bg-white/10 hover:bg-white/15'
                  : 'bg-stone-100 hover:bg-stone-200'
              }`}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold bg-violet-700">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
              <span
                className={`text-sm font-semibold ${
                  isHeroOverlay ? 'text-white/90' : 'text-stone-700'
                }`}
              >
                {session.user.name}
              </span>
            </button>
            {userMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border py-1 z-50 ${
                  isHeroOverlay
                    ? 'bg-gray-950/80 border-white/10 text-white backdrop-blur'
                    : 'bg-white border-stone-100'
                }`}
              >
                <Link
                  href="/dashboard"
                  className={`block px-4 py-2 text-sm ${
                    isHeroOverlay
                      ? 'text-white/90 hover:bg-white/10'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                  onClick={() => setUserMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <hr className={`my-1 ${isHeroOverlay ? 'border-white/10' : 'border-stone-100'}`} />
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    isHeroOverlay
                      ? 'text-red-300 hover:bg-white/10'
                      : 'text-red-500 hover:bg-stone-50'
                  }`}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </>
      )
    }

    return (
      <>
        <Link
          href="/login"
          className={`hidden md:inline-flex text-sm font-semibold transition ${linkBase}`}
        >
          Sign in
        </Link>
        <Link href="/register" className={signupNavButtonClass}>
          Get started
          <span className={signupNavIconClass}>
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </Link>
      </>
    )
  }

  if (isHeroOverlay) {
    return (
      <>
        <nav className={`${placementShell} ${navShell}`}>
          <div className={`${containerClass} px-4 sm:px-6 lg:px-8`}>
            <div className="flex justify-between items-center h-14 sm:h-16 gap-2 sm:gap-4 rounded-full px-2 sm:px-4 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/15">
              <HomescoutLogo tone="hero" size="md" />
              <div className="hidden md:flex items-center gap-1 rounded-full px-2 py-1 bg-white/10 ring-1 ring-white/15">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${navLinkClass(
                      isNavLinkActive(link.href, pathname, listingType)
                    )}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                {renderAuthActions()}
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(true)}
                  className="md:hidden inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                  aria-label="Open menu"
                  aria-expanded={mobileNavOpen}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>
        <MobileNavDrawer
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          session={session ?? null}
          pathname={pathname}
          listingType={listingType}
        />
      </>
    )
  }

  return (
    <>
      <nav className={`${placementShell} ${navShell}`}>
        <div className={`${containerClass} px-4 sm:px-6 lg:px-8`}>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 sm:h-[4.5rem] gap-4">
            <div className="flex justify-start min-w-0">
              <HomescoutLogo tone="home" size="md" />
            </div>

            <div className="hidden md:flex items-center justify-center gap-1 lg:gap-2">
              {visibleNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3.5 lg:px-4 py-2 text-sm transition ${navLinkClass(
                    isNavLinkActive(link.href, pathname, listingType)
                  )}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
              {renderAuthActions()}
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition"
                aria-label="Open menu"
                aria-expanded={mobileNavOpen}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileNavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        session={session ?? null}
        pathname={pathname}
        listingType={listingType}
      />
    </>
  )
}
