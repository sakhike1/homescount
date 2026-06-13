import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Clock,
  ExternalLink,
  Home,
  Newspaper,
} from 'lucide-react'
import SafeImage from '@/components/SafeImage'
import NewsArticleShare from '@/components/news/NewsArticleShare'
import NewsReadingProgress from '@/components/news/NewsReadingProgress'
import {
  formatNewsDate,
  getRelatedNewsArticles,
  type PropertyNewsArticle,
} from '@/lib/property-news-articles'

const categoryStyles: Record<
  PropertyNewsArticle['category'],
  { badge: string }
> = {
  News: {
    badge: 'bg-sky-50 text-sky-800 ring-sky-200/80',
  },
  Analysis: {
    badge: 'bg-violet-50 text-violet-800 ring-violet-200/80',
  },
  'Market outlook': {
    badge: 'bg-stone-100 text-stone-700 ring-stone-200/80',
  },
}

function RelatedCard({ article }: { article: PropertyNewsArticle }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex gap-4 rounded-2xl border border-stone-200/80 bg-white p-3 shadow-sm transition hover:border-stone-300 hover:shadow-md"
    >
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100">
        <SafeImage
          src={article.image}
          alt={article.imageAlt}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="96px"
        />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="text-xs font-bold uppercase tracking-wide text-stone-400">
          {article.category}
        </p>
        <p className="mt-1 line-clamp-2 text-sm font-bold text-stone-900 group-hover:text-violet-800">
          {article.title}
        </p>
        <p className="mt-1 text-xs text-stone-500">
          {formatNewsDate(article.publishedAt)}
        </p>
      </div>
    </Link>
  )
}

export default function NewsArticleView({ article }: { article: PropertyNewsArticle }) {
  const related = getRelatedNewsArticles(article.slug, 4)
  const styles = categoryStyles[article.category]
  const takeaway = article.body[article.body.length - 1]
  const bodyParagraphs = article.body.slice(0, -1)

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <NewsReadingProgress />

      <section className="border-b border-stone-200/80 bg-[#faf9f7]">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All property news
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-stone-500">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-stone-600 ring-1 ring-stone-200/80">
              <Newspaper className="h-3.5 w-3.5" aria-hidden />
              Homescout news
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles.badge}`}
            >
              {article.category}
            </span>
            <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {article.readMinutes} min read
            </span>
          </div>

          <h1 className="mt-5 font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600 sm:text-xl">
            {article.excerpt}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 mt-8 sm:mt-10">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone-100 shadow-sm ring-1 ring-stone-200/80 sm:rounded-3xl">
          <SafeImage
            src={article.image}
            alt={article.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <article className="lg:col-span-8">
            <div className="rounded-2xl border border-stone-200/80 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-6">
                <NewsArticleShare title={article.title} />
                <p className="text-sm text-stone-500">
                  Updated for South African buyers & sellers
                </p>
              </div>

              <div id="news-article-body" className="max-w-none">
                <p className="text-xl font-medium leading-relaxed text-stone-800 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-5xl first-letter:font-bold first-letter:text-stone-400">
                  {bodyParagraphs[0]}
                </p>

                {bodyParagraphs.slice(1).map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="mt-6 text-[1.0625rem] leading-[1.8] text-stone-700"
                  >
                    {paragraph}
                  </p>
                ))}

                <blockquote className="my-10 rounded-2xl border-l-4 border-violet-400 bg-violet-50/50 px-6 py-5 text-lg font-medium not-italic text-stone-800 ring-1 ring-violet-100">
                  <p className="m-0 flex gap-3">
                    <BookOpen
                      className="mt-1 h-5 w-5 shrink-0 text-violet-600"
                      aria-hidden
                    />
                    <span>{takeaway}</span>
                  </p>
                  <footer className="mt-3 text-sm font-semibold text-violet-700">
                    Key takeaway
                  </footer>
                </blockquote>
              </div>

              <aside className="mt-12 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/50">
                <div className="border-b border-stone-100 bg-white px-6 py-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                    Sources & further reading
                  </h2>
                  <p className="mt-1 text-sm text-stone-600">
                    Summarised from publicly reported news — visit publishers for full context.
                  </p>
                </div>
                <ul className="divide-y divide-stone-100 bg-white">
                  {article.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 px-6 py-4 transition hover:bg-stone-50"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500 transition group-hover:bg-violet-50 group-hover:text-violet-700">
                          <ExternalLink className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-stone-900 group-hover:text-violet-800">
                            {source.label}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-stone-400">
                            {source.url.replace(/^https?:\/\/(www\.)?/, '')}
                          </span>
                        </span>
                        <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-stone-300 transition group-hover:text-violet-600" />
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-stone-900">Ready to act on this news?</h2>
                <p className="mt-2 max-w-xl text-sm text-stone-600">
                  Browse live listings or estimate what a rate change means for your monthly
                  bond repayment.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/properties?type=buy"
                    className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-800 shadow-sm shadow-violet-900/15"
                  >
                    <Home className="h-4 w-4" aria-hidden />
                    Browse homes for sale
                  </Link>
                  <Link
                    href="/tools/bond-calculator"
                    className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-5 py-2.5 text-sm font-bold text-stone-800 transition hover:bg-stone-100"
                  >
                    <Calculator className="h-4 w-4" aria-hidden />
                    Bond calculator
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-8">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                  In this article
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-stone-600">
                  <li className="flex gap-2">
                    <span className="font-bold text-violet-600">1.</span>
                    Market reaction & affordability
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-violet-600">2.</span>
                    What experts are saying
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-violet-600">3.</span>
                    Practical takeaway for buyers
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <Calculator className="h-8 w-8 text-violet-600" aria-hidden />
                <h2 className="mt-3 font-bold text-stone-900">Bond calculator</h2>
                <p className="mt-2 text-sm text-stone-600">
                  See how rate moves affect your monthly repayment before you make an offer.
                </p>
                <Link
                  href="/tools/bond-calculator"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-violet-700 hover:text-violet-800 hover:underline"
                >
                  Try the calculator
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              {related.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                    Related stories
                  </h2>
                  <div className="mt-4 space-y-3">
                    {related.map((item) => (
                      <RelatedCard key={item.slug} article={item} />
                    ))}
                  </div>
                  <Link
                    href="/news"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-violet-700 hover:text-violet-800 hover:underline"
                  >
                    View all news
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
