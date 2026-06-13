import { HOME_STATS_CONTAINER } from '@/lib/home-hero-layout'

export default function HomeHeroStatsSkeleton() {
  return (
    <div className={`${HOME_STATS_CONTAINER} mt-10 sm:mt-14 lg:mt-16`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-1 items-center gap-4 rounded-2xl border border-stone-200/90 bg-white px-5 py-5 sm:px-6 sm:py-6 animate-pulse"
          >
            <div className="h-12 w-12 shrink-0 rounded-xl bg-stone-100" />
            <div className="flex-1 space-y-2">
              <div className="h-7 w-16 rounded bg-stone-100" />
              <div className="h-4 w-28 rounded bg-stone-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
