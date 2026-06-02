import PropertyServices from '@/components/PropertyServices'
import PropertyQuickLinks from '@/components/PropertyQuickLinks'
import { BadgeCheck, Building2, MapPinned, type LucideIcon } from 'lucide-react'
import { formatStatCount } from '@/lib/format-stats'

type Props = {
  listings: number
  sellers: number
  provinces: number
  isLive: boolean
}

export default function HomePlatform({ listings, sellers, provinces, isLive }: Props) {
  const stats: { value: string; label: string; icon: LucideIcon }[] = [
    {
      value: formatStatCount(listings),
      label: isLive ? 'Active Listings' : 'Sample Listings',
      icon: Building2,
    },
    {
      value: formatStatCount(sellers),
      label: isLive ? 'Verified Sellers' : 'Demo Sellers',
      icon: BadgeCheck,
    },
    {
      value: String(provinces),
      label: 'Provinces Covered',
      icon: MapPinned,
    },
  ]

  return (
    <div className="section-warm relative">
      <div className="relative pt-12 sm:pt-16 pb-4 sm:pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-2xl sm:rounded-3xl bg-amber-500 border border-amber-600/30 shadow-md shadow-amber-500/25 px-6 py-8 sm:px-10 sm:py-10 transition-shadow duration-300 hover:shadow-xl hover:shadow-amber-600/40">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-amber-400/60">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="text-center sm:px-6">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/30">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                      {stat.value}
                    </div>
                    <div className="mt-1.5 text-sm font-semibold text-amber-50">
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <PropertyServices />
        <PropertyQuickLinks />
      </div>
    </div>
  )
}
