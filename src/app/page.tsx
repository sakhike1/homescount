import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { buildPageMetadata, SITE } from '@/lib/seo'
import Navbar from '@/components/Navbar'

const HeroSlideshow = dynamic(() => import('@/components/HeroSlideshow'), {
  loading: () => <div className="absolute inset-0 bg-stone-900" aria-hidden />,
})

export const metadata = buildPageMetadata({
  title: 'Homes for Sale & Rent in South Africa',
  description: SITE.defaultDescription,
  path: '/',
  keywords: [
    'property portal South Africa',
    'search homes for sale',
    'find rentals near me',
  ],
})
import HeroSearch from '@/components/HeroSearch'
import HomeDynamicContent from '@/components/home/HomeDynamicContent'
import HomeHeroStats from '@/components/home/HomeHeroStats'
import HomeHeroStatsSkeleton from '@/components/home/HomeHeroStatsSkeleton'
import HomeBelowFoldSkeleton from '@/components/home/HomeBelowFoldSkeleton'
import HeroHeadline from '@/components/HeroHeadline'
import HeroBadge from '@/components/HeroBadge'

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-[100svh] overflow-hidden text-white">
        <HeroSlideshow />

        <div className="relative max-w-7xl mx-auto px-4 pt-28 pb-24 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
          <Suspense fallback={null}>
            <Navbar placement="hero" />
          </Suspense>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <HeroBadge />
              <HeroHeadline />
              <HeroSearch />
            </div>

            <Suspense fallback={<HomeHeroStatsSkeleton />}>
              <HomeHeroStats />
            </Suspense>
          </div>
        </div>
      </section>

      <Suspense fallback={<HomeBelowFoldSkeleton />}>
        <HomeDynamicContent />
      </Suspense>
    </main>
  )
}
