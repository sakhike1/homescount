import PropertyBrowseHero from '@/components/properties/PropertyBrowseHero'
import PropertiesGridSkeleton from '@/components/properties/PropertiesGridSkeleton'

export default function PropertiesLoading() {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <PropertyBrowseHero type="all">
        <div className="rounded-[1.75rem] bg-white p-8 h-52 animate-pulse shadow-2xl ring-1 ring-stone-200/60" />
      </PropertyBrowseHero>
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <PropertiesGridSkeleton />
      </div>
    </main>
  )
}
