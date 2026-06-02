export default function PropertyBrowseHeader({ type }: { type: string }) {
  const typeLabel =
    type === 'rent'
      ? 'for rent'
      : type === 'buy'
        ? 'for sale'
        : 'for sale & rent'

  return (
    <div className="border-b border-stone-200 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white px-4 py-14 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
          Homescount listings
        </p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl">
          Find your next home {typeLabel}
        </h1>
        <p className="mt-4 text-stone-300 max-w-xl">
          Browse properties across South Africa — verified sellers, clear prices,
          and support at every step.
        </p>
      </div>
    </div>
  )
}
