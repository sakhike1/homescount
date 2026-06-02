import HeroStats from '@/components/HeroStats'
import { getPlatformStats } from '@/lib/properties'

export default async function HomeHeroStats() {
  const platformStats = await getPlatformStats()
  return (
    <HeroStats
      listings={platformStats.listings}
      sellers={platformStats.sellers}
      provinces={platformStats.provinces}
    />
  )
}
