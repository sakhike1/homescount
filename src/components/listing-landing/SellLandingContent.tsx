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
      <ListingLandingHero variant="sell">
        <LandingHeroActionCard
          variant="sell"
          primaryHref="/register?role=SELLER"
          primaryLabel="Start listing free"
          secondaryHref="/login?intent=seller"
          secondaryLabel="Seller sign in"
        />
      </ListingLandingHero>

      <BenefitCards
        heading="Why list on Homescount"
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
        footnote="Already a seller? Sign in and open your dashboard to manage listings, upload photos, and promote."
      />

      <SellPromoteSection />

      <LandingCtaBanner
        variant="sell"
        title="Start listing today — it's free to publish"
        description="Create a seller account, add your first property, and go live when you are ready. Promotion plans are optional."
        primaryHref="/register?role=SELLER"
        primaryLabel="Register as seller"
        secondaryHref="/login?intent=seller"
        secondaryLabel="Seller sign in"
      />
    </main>
  )
}
