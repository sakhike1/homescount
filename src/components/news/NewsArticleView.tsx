import Link from 'next/link'
import { ArrowLeft, Clock, ExternalLink } from 'lucide-react'
import SafeImage from '@/components/SafeImage'
import {
  formatNewsDate,
  type PropertyNewsArticle,
} from '@/lib/property-news-articles'

const categoryStyles: Record<PropertyNewsArticle['category'], string> = {
  News: 'bg-sky-100 text-sky-800',
  Analysis: 'bg-violet-100 text-violet-800',
  'Market outlook': 'bg-amber-100 text-amber-900',
}

export default function NewsArticleView({ article }: { article: PropertyNewsArticle }) {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800 hover:underline underline-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All property news
        </Link>

        <div className="mt-8 relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone-200 ring-1 ring-stone-200">
          <SafeImage
            src={article.image}
            alt={article.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-bold ${categoryStyles[article.category]}`}
            >
              {article.category}
            </span>
            <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {article.readMinutes} min read
            </span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">{article.excerpt}</p>
        </div>

        <div className="mt-10 space-y-5 text-stone-700 leading-relaxed">
          {article.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        <aside className="mt-12 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
            Sources & further reading
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            This article summarises publicly reported news and industry commentary. For
            full context, visit the original publishers below.
          </p>
          <ul className="mt-4 space-y-3">
            {article.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 hover:underline"
                >
                  <ExternalLink className="h-4 w-4 shrink-0 mt-0.5" aria-hidden />
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/properties?type=buy"
            className="inline-flex rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600"
          >
            Browse homes for sale
          </Link>
          <Link
            href="/tools/bond-calculator"
            className="inline-flex rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-bold text-stone-800 hover:bg-stone-50"
          >
            Bond calculator
          </Link>
        </div>
      </article>
    </main>
  )
}
