import type { ReactNode } from 'react'
import HeroSlideshow from '@/components/HeroSlideshow'
import { HOME_HERO_CONTAINER } from '@/lib/home-hero-layout'

type Props = {
  children: ReactNode
}

export default function HeroCard({ children }: Props) {
  return (
    <div className={`${HOME_HERO_CONTAINER} mt-4 sm:mt-6`}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-12 rounded-[2rem] sm:rounded-[2.25rem] bg-violet-900 p-6 sm:p-8 lg:p-12 min-h-0 lg:min-h-[480px] overflow-hidden shadow-xl shadow-violet-900/25">
        <div className="flex flex-col justify-center order-1">
          {children}
        </div>
        <div className="relative order-2 min-h-[280px] sm:min-h-[320px] lg:min-h-0 lg:h-full">
          <HeroSlideshow />
        </div>
      </div>
    </div>
  )
}
