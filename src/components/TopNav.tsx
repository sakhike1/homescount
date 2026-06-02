'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function TopNav() {
  const pathname = usePathname()
  if (pathname === '/' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) return null
  return (
    <Suspense fallback={null}>
      <Navbar />
    </Suspense>
  )
}

