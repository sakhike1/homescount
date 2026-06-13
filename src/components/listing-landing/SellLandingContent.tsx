import ListingLandingHero from '@/components/listing-landing/ListingLandingHero'
import LandingHeroActionCard from '@/components/listing-landing/LandingHeroActionCard'
import LandingCtaBanner from '@/components/listing-landing/LandingCtaBanner'
import BenefitCards from '@/components/listing-landing/BenefitCards'
import JourneyStepsSection from '@/components/listing-landing/JourneyStepsSection'
import SellPromoteSection from '@/components/listing-landing/SellPromoteSection'
import { sellJourneySteps } from '@/lib/property-journey'
import { Camera, HousePlus, Users } from 'lucide-react'

export default function SellLandingContent() {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <ListingLandingHero key="sell" variant="sell">
        <LandingHeroActionCard
          variant="sell"
          primaryHref="/register?role=SELLER"
          primaryLabel="Start listing free"
          secondaryHref="/login?intent=seller"
          secondaryLabel="Seller sign in"
        />
      </ListingLandingHero>

      <BenefitCards
        heading="Why list on Homescout"
        benefits={[
          {
            title: 'Sale or rent',
            description:
              'One dashboard for both listing types. Set the right price and reach buyers or tenants.',
            icon: HousePlus,
          },
          {
            title: 'Photos & publish control',
            description:
              'Upload images, save drafts, and publish only when your listing is complete.',
            icon: Camera,
          },
          {
            title: 'Reach serious searchers',
            description:
              'Your property appears on browse pages and the homepage when buyers search your area.',
            icon: Users,
          },
        ]}
      />

      <JourneyStepsSection
        title="How to list your property"
        subtitle="Six simple steps from sign-up to enquiries — you stay in control of when your listing goes live."
        steps={sellJourneySteps}
        footnote="Already a seller? Sign in, complete your listing, choose a package, and pay to go live."
      />

      <SellPromoteSection />

      <LandingCtaBanner
        variant="sell"
        title="Start listing today"
        description="Create your listing, upload photos, choose a package, and pay to publish — your property goes live on Homescout immediately."
        primaryHref="/register?role=SELLER"
        primaryLabel="Register as seller"
        secondaryHref="/login?intent=seller"
        secondaryLabel="Seller sign in"
      />
    </main>
  )
}
