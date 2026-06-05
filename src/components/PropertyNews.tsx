import Link from 'next/link'
import SafeImage from '@/components/SafeImage'
import {
  getFeaturedNewsArticles,
  getSideNewsArticles,
} from '@/lib/property-news-articles'

export default function PropertyNews() {
  const featured = getFeaturedNewsArticles()
  const sideStories = getSideNewsArticles()

  return (
    <section className="section-warm py-16 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 text-section-title">
            Property news
          </h2>
          <Link
            href="/news"
            className="text-sm font-bold text-amber-700 hover:text-amber-800 hover:underline underline-offset-2"
          >
            View all articles →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {featured.map((article) => (
              <article key={article.slug} className="group">
                <Link href={`/news/${article.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
                    <SafeImage
                      src={article.image}
                      alt={article.imageAlt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  </div>
                  <span className="mt-4 inline-block rounded-md bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">
                    {article.category}
                  </span>
                  <h3 className="mt-3 text-lg sm:text-xl font-bold text-gray-900 leading-snug group-hover:text-amber-800 transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-5 sm:gap-6">
            {sideStories.map((story) => (
              <article key={story.slug} className="group">
                <Link href={`/news/${story.slug}`} className="flex gap-4 items-start">
                  <div className="relative h-16 w-16 sm:h-[72px] sm:w-[72px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <SafeImage
                      src={story.image}
                      alt={story.imageAlt}
                      fill
                      sizes="72px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug pt-0.5 group-hover:text-amber-800 transition-colors">
                    {story.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
