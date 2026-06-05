import { Eye, MessageSquare, TrendingDown, TrendingUp } from 'lucide-react'
import type { ListingAnalytics } from '@/lib/listing-analytics'

export default function ListingAnalyticsPanel({
  analytics,
}: {
  analytics: ListingAnalytics
}) {
  const change = analytics.weekChangePercent

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <h2 className="text-lg font-black text-gray-900 mb-1">Listing analytics</h2>
      <p className="text-sm text-gray-500 mb-6">
        How buyers are engaging with this property.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl bg-stone-50 border border-stone-100 p-4">
          <Eye className="h-5 w-5 text-amber-600 mb-2" aria-hidden />
          <p className="text-2xl font-black text-gray-900">{analytics.totalViews}</p>
          <p className="text-xs text-gray-500 mt-1">Total views</p>
        </div>
        <div className="rounded-xl bg-stone-50 border border-stone-100 p-4">
          <Eye className="h-5 w-5 text-sky-600 mb-2" aria-hidden />
          <p className="text-2xl font-black text-gray-900">{analytics.viewsThisWeek}</p>
          <p className="text-xs text-gray-500 mt-1">Views this week</p>
        </div>
        <div className="rounded-xl bg-stone-50 border border-stone-100 p-4">
          {change != null && change >= 0 ? (
            <TrendingUp className="h-5 w-5 text-emerald-600 mb-2" aria-hidden />
          ) : (
            <TrendingDown className="h-5 w-5 text-stone-400 mb-2" aria-hidden />
          )}
          <p className="text-2xl font-black text-gray-900">
            {change != null ? `${change > 0 ? '+' : ''}${change}%` : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1">vs last week</p>
        </div>
        <div className="rounded-xl bg-stone-50 border border-stone-100 p-4">
          <MessageSquare className="h-5 w-5 text-violet-600 mb-2" aria-hidden />
          <p className="text-2xl font-black text-gray-900">{analytics.inquiryCount}</p>
          <p className="text-xs text-gray-500 mt-1">Enquiries</p>
        </div>
      </div>

      {analytics.totalViews === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          Views are recorded when buyers open your published listing page.
        </p>
      )}
    </div>
  )
}
