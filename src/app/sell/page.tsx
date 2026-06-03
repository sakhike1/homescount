import { buildPageMetadata } from '@/lib/seo'
import SellLandingContent from '@/components/listing-landing/SellLandingContent'

export const metadata = buildPageMetadata({
  title: 'List Your Property for Sale or Rent',
  description:
    'Sell or rent your home on Homescount. Create a listing, reach buyers and tenants across South Africa, and manage enquiries from your seller dashboard.',
  path: '/sell',
  keywords: [
    'sell my house',
    'list property online South Africa',
    'rent out my apartment',
    'private property listing',
  ],
})

export default function SellPage() {
  return <SellLandingContent />
}
