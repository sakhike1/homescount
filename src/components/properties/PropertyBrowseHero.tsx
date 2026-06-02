import type { ReactNode } from 'react'
import ListingLandingHero from '@/components/listing-landing/ListingLandingHero'

type Props = {
  type: string
  locationHint?: string
  children: ReactNode
}

export default function PropertyBrowseHero({ type, locationHint, children }: Props) {
  return (
    <ListingLandingHero variant="browse" browseType={type} locationHint={locationHint}>
      {children}
    </ListingLandingHero>
  )
}
