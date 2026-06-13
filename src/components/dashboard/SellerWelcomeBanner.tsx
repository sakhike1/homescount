import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function SellerWelcomeBanner() {
  return (
    <div className="mb-6 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-900 text-white">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-bold text-stone-900">Welcome to your seller portal</p>
            <p className="mt-1 text-sm text-stone-600">
            Add your property details below, upload photos, choose a package, and pay to
            go live — most sellers finish in under 10 minutes.
            </p>
          </div>
        </div>
        <Link
          href="/sell"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-800"
        >
          Listing tips
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  )
}
