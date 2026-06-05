import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import NewsArticleView from '@/components/news/NewsArticleView'
import { buildPageMetadata } from '@/lib/seo'
import { getNewsArticle, propertyNewsArticles } from '@/lib/property-news-articles'

export function generateStaticParams() {
  return propertyNewsArticles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getNewsArticle(slug)
  if (!article) return { title: 'Article not found' }

  return buildPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/news/${slug}`,
    keywords: ['property news South Africa', article.category, 'Homescout'],
  })
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getNewsArticle(slug)
  if (!article) notFound()

  return <NewsArticleView article={article} />
}
