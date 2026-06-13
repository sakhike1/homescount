import dynamic from 'next/dynamic'

const PropertyServices = dynamic(() => import('@/components/PropertyServices'))
const PropertyQuickLinks = dynamic(() => import('@/components/PropertyQuickLinks'))

type Props = {
  listings: number
  sellers: number
  provinces: number
  isLive: boolean
}

export default function HomePlatform(_props: Props) {
  return (
    <div className="section-warm relative">
      <div className="relative pt-8 sm:pt-12 pb-4 sm:pb-6">
        <PropertyServices />
        <PropertyQuickLinks />
      </div>
    </div>
  )
}
