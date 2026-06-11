import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { requireSeller } from '@/lib/seller'
import PropertyListingForm from '@/components/dashboard/PropertyListingForm'
import ImageUploader from '@/components/dashboard/ImageUploader'
import PromotePanel from '@/components/dashboard/PromotePanel'
import PublishListingPanel from '@/components/dashboard/PublishListingPanel'
import DeleteListingButton from '@/components/dashboard/DeleteListingButton'
import ListingAnalyticsPanel from '@/components/dashboard/ListingAnalyticsPanel'
import { canPublishListing } from '@/lib/publish'
import { getListingAnalytics } from '@/lib/listing-analytics'
import { parsePropertyFeatures } from '@/lib/property-features'

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await requireSeller()
  const { id } = await params

  const [property, user] = await Promise.all([
    prisma.property.findFirst({
      where: { id, sellerId: session.user.id },
      include: { images: { orderBy: { createdAt: 'asc' } } },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        phone: true,
        companyName: true,
        companyAddress: true,
        companyLogoUrl: true,
        showPhone: true,
      },
    }),
  ])

  if (!property) notFound()

  const publishCheck = canPublishListing(property)
  const analytics = await getListingAnalytics(property.id, session.user.id)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <PublishListingPanel
            propertyId={property.id}
            published={property.published}
            missing={publishCheck.missing}
          />
        </div>
        <DeleteListingButton
          propertyId={property.id}
          propertyTitle={property.title}
        />
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          Edit listing
        </h1>
        <p className="text-sm text-gray-500 mb-8">{property.title}</p>
        <PropertyListingForm
          mode="edit"
          propertyId={property.id}
          listerName={user?.name ?? session.user.name ?? 'Seller'}
          imageCount={property.images.length}
          initialFeatures={parsePropertyFeatures(property.features)}
          initialValues={{
            title: property.title,
            description: property.description,
            price: String(property.price),
            location: property.location,
            suburb: property.suburb,
            city: property.city,
            province: property.province,
            bedrooms: String(property.bedrooms),
            bathrooms: String(property.bathrooms),
            parkings: String(property.parkings),
            size: String(property.size),
            type: property.type,
            listingType: property.listingType,
            virtualTourUrl: property.virtualTourUrl ?? '',
            phone: user?.phone ?? '',
            companyName: user?.companyName ?? '',
            companyAddress: user?.companyAddress ?? '',
            companyLogoUrl: user?.companyLogoUrl ?? '',
            showPhone: user?.showPhone ?? true,
          }}
        />
      </div>

      <div
        id="property-photos"
        className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
      >
        {property.images.length === 0 && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Step 2 — Add photos.</strong> Upload at least one image before
            you can publish this listing to the properties page.
          </div>
        )}
        <ImageUploader propertyId={property.id} images={property.images} />
      </div>

      {analytics && <ListingAnalyticsPanel analytics={analytics} />}

      <PromotePanel
        propertyId={property.id}
        featured={property.featured}
        featuredUntil={property.featuredUntil?.toISOString() ?? null}
        adPlan={property.adPlan}
      />
    </div>
  )
}
