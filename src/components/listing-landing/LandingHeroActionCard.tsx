'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useHeroTheme } from '@/components/listing-landing/hero-theme-context'
import type { LandingHeroVariant } from '@/lib/landing-hero-themes'

type Props = {
  variant: LandingHeroVariant
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
}

export default function LandingHeroActionCard({
  variant,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: Props) {
  const theme = useHeroTheme()

  const sellHint =
    'Create your seller account, add photos, and publish when your listing is ready.'

  return (
    <div className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-white/95 backdrop-blur-md p-5 sm:p-6 lg:p-7 shadow-2xl shadow-stone-900/10 ring-1 ring-stone-200/60">
      {variant === 'sell' ? (
        <p className="text-sm text-stone-600 max-w-lg leading-relaxed">{sellHint}</p>
      ) : null}
      <div
        className={`flex flex-col sm:flex-row flex-wrap gap-3 ${variant === 'sell' ? 'mt-5' : ''}`}
      >
        <Link
          href={primaryHref}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-lg transition ${theme.primaryButton}`}
          suppressHydrationWarning
        >
          {primaryLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href={secondaryHref}
          className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-stone-50 px-8 py-3.5 text-sm font-bold text-stone-800 hover:bg-stone-100 transition"
        >
          {secondaryLabel}
        </Link>
      </div>
    </div>
  )
}
