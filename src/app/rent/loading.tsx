import ListingLandingHero from '@/components/listing-landing/ListingLandingHero'

export default function RentLoading() {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <ListingLandingHero variant="rent">
        <div className="rounded-[1.75rem] bg-white p-8 h-36 animate-pulse shadow-2xl" />
      </ListingLandingHero>
    </main>
  )
}
