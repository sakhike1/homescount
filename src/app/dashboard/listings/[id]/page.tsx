import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { requireSeller } from '@/lib/seller'
import PropertyListingForm from '@/components/dashboard/PropertyListingForm'
import ImageUploader from '@/components/dashboard/ImageUploader'
import PromotePanel from '@/components/dashboard/PromotePanel'
import PublishListingPanel from '@/components/dashboard/PublishListingPanel'
import DeleteListingButton from '@/components/dashboard/DeleteListingButton'
import { canPublishListing } from '@/lib/publish'

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await requireSeller()
  const { id } = await params

  const property = await prisma.property.findFirst({
    where: { id, sellerId: session.user.id },
    include: { images: { orderBy: { createdAt: 'asc' } } },
  })

  if (!property) notFound()

  const publishCheck = canPublishListing(property)

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
          }}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <ImageUploader propertyId={property.id} images={property.images} />
      </div>

      <PromotePanel
        propertyId={property.id}
        featured={property.featured}
        featuredUntil={property.featuredUntil?.toISOString() ?? null}
        adPlan={property.adPlan}
      />
    </div>
  )
}
