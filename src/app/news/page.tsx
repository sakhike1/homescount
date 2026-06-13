import Link from 'next/link'
import SafeImage from '@/components/SafeImage'
import { buildPageMetadata } from '@/lib/seo'
import {
  formatNewsDate,
  getFeaturedNewsArticles,
  getSideNewsArticles,
  propertyNewsArticles,
} from '@/lib/property-news-articles'
import { Newspaper } from 'lucide-react'

export const metadata = buildPageMetadata({
  title: 'Property News & Market Insights',
  description:
    'Latest South African property news — interest rates, fuel costs, SONA housing policy, climate risk, and the 2026 market outlook.',
  path: '/news',
  keywords: [
    'South Africa property news',
    'interest rates housing',
    'real estate market 2026',
    'SA home buying news',
  ],
})

export default function NewsIndexPage() {
  const featured = getFeaturedNewsArticles()
  const side = getSideNewsArticles()

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <section className="border-b border-stone-200/80 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
            <Newspaper className="h-3.5 w-3.5" aria-hidden />
            Homescout news
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 max-w-3xl">
            Property news & market insights
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-stone-600 leading-relaxed">
            In-depth articles on rates, fuel costs, government policy, climate risk, and
            what they mean for buyers and sellers across South Africa.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {featured.map((article) => (
              <article key={article.slug} id={article.slug} className="group scroll-mt-24">
                <Link href={`/news/${article.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200/80">
                    <SafeImage
                      src={article.image}
                      alt={article.imageAlt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  </div>
                  <span className="mt-4 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700 ring-1 ring-stone-200/80">
                    {article.category}
                  </span>
                  <h2 className="mt-3 text-lg sm:text-xl font-bold text-stone-900 leading-snug group-hover:text-violet-800 transition-colors">
                    {article.title}
                  </h2>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                  <p className="mt-3 text-xs font-medium text-stone-400">
                    {formatNewsDate(article.publishedAt)} · {article.readMinutes} min read
                  </p>
                </Link>
              </article>
            ))}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-5 sm:gap-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
              More stories
            </h2>
            {side.map((story) => (
              <article
                key={story.slug}
                id={story.slug}
                className="group scroll-mt-24"
              >
                <Link href={`/news/${story.slug}`} className="flex gap-4 items-start">
                  <div className="relative h-16 w-16 sm:h-[72px] sm:w-[72px] shrink-0 overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200/80">
                    <SafeImage
                      src={story.image}
                      alt={story.imageAlt}
                      fill
                      sizes="72px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug group-hover:text-violet-800 transition-colors">
                      {story.title}
                    </h3>
                    <p className="mt-1 text-xs text-stone-400">
                      {formatNewsDate(story.publishedAt)}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        <section className="mt-16 border-t border-stone-200 pt-10">
          <h2 className="text-xl font-bold text-stone-900">All articles</h2>
          <ul className="mt-6 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm">
            {propertyNewsArticles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/news/${article.slug}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-4 hover:bg-stone-50 transition"
                >
                  <span className="font-semibold text-stone-900">{article.title}</span>
                  <span className="text-sm text-stone-500 shrink-0">
                    {formatNewsDate(article.publishedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
