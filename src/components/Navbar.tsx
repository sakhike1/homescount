'use client'

import Link from 'next/link'
import HomescoutLogo from '@/components/brand/HomescoutLogo'
import { useSession, signOut } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import MobileNavDrawer from '@/components/nav/MobileNavDrawer'

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

  function navLinkClass(active: boolean) {
    return active
      ? isHero
        ? 'bg-white/15 text-white'
        : 'bg-white text-gray-900 shadow-sm'
      : `${linkBase} hover:bg-white/10`
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
            <HomescoutLogo tone={isHero ? 'hero' : 'default'} size="md" />

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
