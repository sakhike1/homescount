import HomePlatform from '@/components/HomePlatform'
import FeaturedPropertiesGrid from '@/components/FeaturedPropertiesGrid'
import PropertyNews from '@/components/PropertyNews'
import EstateAgentCta from '@/components/EstateAgentCta'
import { getFeaturedListings, getPlatformStats } from '@/lib/properties'
import { localImageCacheBust } from '@/lib/local-image-url'

export default async function HomeDynamicContent() {
  const [{ items: gridProperties, isDemo }, platformStats] = await Promise.all([
    getFeaturedListings(6),
    getPlatformStats(),
  ])

  const propertiesWithFreshImages = gridProperties.map((property) => ({
    ...property,
    imageUrl: property.imageUrl ? localImageCacheBust(property.imageUrl) : property.imageUrl,
  }))

  return (
    <>
      <HomePlatform
        listings={platformStats.listings}
        sellers={platformStats.sellers}
        provinces={platformStats.provinces}
        isLive={platformStats.isLive}
      />
      <FeaturedPropertiesGrid properties={propertiesWithFreshImages} isDemo={isDemo} />
      <PropertyNews />
      <EstateAgentCta />
    </>
  )
}
