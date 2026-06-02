import NewsletterSignup from '@/components/NewsletterSignup'
import SafeImage from '@/components/SafeImage'
import { newsImages } from '@/lib/news-images'

const featured = [
  {
    title: 'Property industry reacts to latest interest rate hike',
    excerpt:
      'The latest interest rate hike has been met with mixed reactions from the property industry, with some experts warning of a slowdown in the market.',
    image: newsImages.featured.rates,
    alt: 'Modern residential property exterior',
  },
  {
    title: 'Oil price shocks will affect household spending',
    excerpt:
      'The latest fuel price increases are expected to have a significant impact on household spending, with many South Africans feeling the pinch.',
    image: newsImages.featured.oil,
    alt: 'Contemporary home with landscaped garden',
  },
]

const sideStories = [
  { title: 'Feedback from SONA 2026', image: newsImages.side.sona },
  { title: 'Interest rate – February 2026 – remains unchanged', image: newsImages.side.febRates },
  { title: 'Be prepared for climate-induced States of Emergency', image: newsImages.side.climate },
  { title: "What's ahead for real estate 2026: the comeback year", image: newsImages.side.outlook },
]

export default function PropertyNews() {
  return (
    <section className="section-warm py-16 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 text-section-title">
            Property news
          </h2>
          <p className="text-sm text-stone-500">Full articles coming soon</p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {featured.map((article) => (
              <article key={article.title} className="group">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
                  <SafeImage
                    src={article.image}
                    alt={article.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                <span className="mt-4 inline-block rounded-md bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">
                  News
                </span>
                <h3 className="mt-3 text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </article>
            ))}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-5 sm:gap-6">
            {sideStories.map((story) => (
              <article key={story.title} className="flex gap-4 items-start">
                <div className="relative h-16 w-16 sm:h-[72px] sm:w-[72px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <SafeImage
                    src={story.image}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug pt-0.5">
                  {story.title}
                </h3>
              </article>
            ))}
          </div>
        </div>

        <NewsletterSignup />
      </div>
    </section>
  )
}
