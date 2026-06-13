import { Suspense } from 'react'
import { buildPageMetadata, SITE } from '@/lib/seo'
import Navbar from '@/components/Navbar'
import HeroSearch from '@/components/HeroSearch'
import HomeDynamicContent from '@/components/home/HomeDynamicContent'
import HomeHeroStats from '@/components/home/HomeHeroStats'
import HomeHeroStatsSkeleton from '@/components/home/HomeHeroStatsSkeleton'
import HomeBelowFoldSkeleton from '@/components/home/HomeBelowFoldSkeleton'
import HeroHeadline from '@/components/HeroHeadline'
import HeroBadge from '@/components/HeroBadge'
import HeroCard from '@/components/HeroCard'

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

export default function HomePage() {
  return (
    <main>
      <section className="bg-[#faf9f7] px-3 sm:px-6 lg:px-10 pt-3 pb-16 sm:pb-20">
        <Suspense fallback={null}>
          <Navbar placement="top" />
        </Suspense>

        <HeroCard>
          <HeroBadge />
          <HeroHeadline />
          <HeroSearch />
        </HeroCard>

        <Suspense fallback={<HomeHeroStatsSkeleton />}>
          <HomeHeroStats />
        </Suspense>
      </section>

      <Suspense fallback={<HomeBelowFoldSkeleton />}>
        <HomeDynamicContent />
      </Suspense>
    </main>
  )
}
