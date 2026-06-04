import { Suspense } from 'react'
import { buildPageMetadata, SITE } from '@/lib/seo'
import Navbar from '@/components/Navbar'

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
import HeroSlideshow from '@/components/HeroSlideshow'
import HeroSearch from '@/components/HeroSearch'
import HomeDynamicContent from '@/components/home/HomeDynamicContent'
import HomeHeroStats from '@/components/home/HomeHeroStats'
import HomeHeroStatsSkeleton from '@/components/home/HomeHeroStatsSkeleton'
import HomeBelowFoldSkeleton from '@/components/home/HomeBelowFoldSkeleton'

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden text-white">
        <HeroSlideshow />

        <div className="relative max-w-7xl mx-auto px-4 pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28">
          <Suspense fallback={null}>
            <Navbar placement="hero" />
          </Suspense>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur">
                Homescout
                <span className="h-1 w-1 rounded-full bg-white/60" />
                South Africa
              </p>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-display">
                <span className="text-white">Find the home</span>
                <br />
                <span className="text-amber-300">you&apos;ll love</span>
              </h1>

              <p className="mt-5 max-w-xl text-white/75 text-sm sm:text-base leading-relaxed">
                Search thousands of properties for sale and rent across all 9
                provinces — trusted sellers, verified listings.
              </p>

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
