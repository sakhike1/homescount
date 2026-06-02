export default function PropertyDetailLoading() {
  return (
    <main className="min-h-screen bg-[#faf9f7] animate-pulse">
      <div className="bg-stone-900 h-14" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="aspect-[16/10] rounded-2xl bg-stone-200" />
            <div className="rounded-2xl bg-white border border-stone-200 p-8 space-y-4">
              <div className="h-8 w-3/4 rounded bg-stone-200" />
              <div className="h-4 w-1/2 rounded bg-stone-200" />
              <div className="h-10 w-40 rounded bg-stone-200" />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl bg-white border border-stone-200 h-48" />
            <div className="rounded-2xl bg-white border border-stone-200 h-64" />
          </div>
        </div>
      </div>
    </main>
  )
}
