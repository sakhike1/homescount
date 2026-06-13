import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { requireSeller } from '@/lib/seller'
import { getSellerInquiries, getUnreadInquiryCount } from '@/lib/inquiries'
import { propertyImageOrderBy } from '@/lib/property-image-order'
import DeleteListingButton from '@/components/dashboard/DeleteListingButton'
import { MessageSquare, Plus, Pencil } from 'lucide-react'

function formatPrice(price: number, listingType: string) {
  const formatted = price.toLocaleString('en-ZA')
  return listingType === 'RENT' ? `R ${formatted}/mo` : `R ${formatted}`
}

export default async function DashboardPage() {
  const session = await requireSeller()

  const [properties, recentInquiries, unreadCount] = await Promise.all([
    prisma.property.findMany({
      where: { sellerId: session.user.id },
      include: { images: { take: 1, orderBy: propertyImageOrderBy } },
      orderBy: { updatedAt: 'desc' },
    }),
    getSellerInquiries(session.user.id).then((list) => list.slice(0, 3)),
    getUnreadInquiryCount(session.user.id),
  ])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My listings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage properties for sale or rent, upload photos, and advertise.
          </p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800"
        >
          <Plus className="h-4 w-4" />
          Add listing
        </Link>
      </div>

      {(unreadCount > 0 || recentInquiries.length > 0) && (
        <div className="mb-8 rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
              <div>
                <p className="font-bold text-gray-900">
                  {unreadCount > 0
                    ? `${unreadCount} new buyer ${unreadCount === 1 ? 'message' : 'messages'}`
                    : 'Recent buyer messages'}
                </p>
                {recentInquiries[0] && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                    Latest from {recentInquiries[0].name} — &ldquo;
                    {recentInquiries[0].message.slice(0, 60)}
                    {recentInquiries[0].message.length > 60 ? '…' : ''}&rdquo;
                  </p>
                )}
              </div>
            </div>
            <Link
              href="/dashboard/messages"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-violet-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-800"
            >
              View all messages
            </Link>
          </div>
        </div>
      )}

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center shadow-sm">
          <p className="text-stone-600">You haven&apos;t listed any properties yet.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
            Create your first listing in three steps — details, photos, publish.
          </p>
          <Link
            href="/dashboard/listings/new"
            className="mt-4 inline-block text-sm font-bold text-violet-700 hover:underline"
          >
            Create your first listing →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((property) => (
            <article
              key={property.id}
              className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm"
            >
              <div className="relative aspect-[16/10] bg-gray-100">
                {property.images[0] ? (
                  <Image
                    src={property.images[0].url}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                    No photos
                  </div>
                )}
                {property.featured && (
                  <span className="absolute top-3 left-3 rounded-full bg-violet-600 px-2.5 py-1 text-xs font-bold text-white">
                    Promoted
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700">
                    {property.listingType === 'RENT' ? 'For rent' : 'For sale'}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                      property.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-violet-100 text-violet-800'
                    }`}
                  >
                    {property.published ? 'Published' : 'Draft — payment required'}
                  </span>
                </div>
                <h2 className="font-bold text-gray-900 line-clamp-1">
                  {property.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {property.city}, {property.province}
                </p>
                <p className="mt-2 text-lg font-black text-stone-900">
                  {formatPrice(property.price, property.listingType)}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/dashboard/listings/${property.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-900 hover:text-violet-700"
                  >
                    <Pencil className="h-4 w-4" />
                    Manage listing
                  </Link>
                  <DeleteListingButton
                    propertyId={property.id}
                    propertyTitle={property.title}
                    variant="link"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
