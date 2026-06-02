export default function RootLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 bg-[#faf9f7]">
      <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      <p className="text-sm text-stone-500">Loading…</p>
    </div>
  )
}
