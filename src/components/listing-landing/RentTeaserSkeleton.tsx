export default function RentTeaserSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      <div className="h-8 w-56 bg-stone-200 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-stone-200 h-64 animate-pulse" />
        ))}
      </div>
    </section>
  )
}
