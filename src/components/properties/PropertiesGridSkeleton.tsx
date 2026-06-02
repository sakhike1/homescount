export default function PropertiesGridSkeleton() {
  return (
    <div className="mt-6 sm:mt-8 space-y-6 animate-pulse" aria-hidden>
      <div className="h-4 w-40 rounded bg-stone-200" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[1.35rem] bg-stone-200 overflow-hidden"
          >
            <div className="aspect-[5/4] bg-stone-300" />
            <div className="p-4 space-y-3">
              <div className="h-6 w-28 rounded bg-stone-300" />
              <div className="h-4 w-full rounded bg-stone-300" />
              <div className="h-3 w-2/3 rounded bg-stone-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
