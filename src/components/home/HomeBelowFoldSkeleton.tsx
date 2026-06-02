export default function HomeBelowFoldSkeleton() {
  return (
    <>
      <div className="section-warm relative">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="rounded-3xl bg-white border border-stone-200 h-28 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-stone-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl bg-stone-200 h-72 animate-pulse" />
          ))}
        </div>
      </div>
    </>
  )
}
