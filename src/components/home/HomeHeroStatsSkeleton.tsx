export default function HomeHeroStatsSkeleton() {
  return (
    <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[260px] lg:min-h-[420px]">
      <div className="hidden lg:block">
        {['top-10 right-2', 'top-40 left-8', 'bottom-8 right-10'].map((pos) => (
          <div
            key={pos}
            className={`absolute ${pos} w-[260px] rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur p-5 animate-pulse h-24`}
          />
        ))}
      </div>
      <div className="lg:hidden grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur p-4 animate-pulse h-20"
          />
        ))}
      </div>
    </div>
  )
}
