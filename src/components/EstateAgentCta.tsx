import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default function EstateAgentCta() {
  return (
    <section className="section-white px-4 py-16 sm:py-20 border-t border-stone-100">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl lg:text-[2.5rem]">
            Find a trusted Estate Agent in your area
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
            Search our property database and contact estate agents directly. On
            Homescout you can refine your search to areas where you would like
            to live and then contact the most suitable estate agent for that
            area directly.
          </p>
          <Link
            href="/sell"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-900 transition hover:border-stone-400 hover:bg-stone-50"
          >
            <Search className="h-4 w-4" aria-hidden />
            List your property
          </Link>
        </div>

        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg shadow-stone-900/10 lg:aspect-auto lg:min-h-[360px]">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80"
            alt="Estate agent meeting with a client"
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  )
}
