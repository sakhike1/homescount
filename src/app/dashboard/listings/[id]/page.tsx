import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { requireSeller } from '@/lib/seller'
import PropertyListingForm from '@/components/dashboard/PropertyListingForm'
import ImageUploader from '@/components/dashboard/ImageUploader'
import ListingPackageCheckout from '@/components/dashboard/ListingPackageCheckout'
import ListingUpgradePanel from '@/components/dashboard/ListingUpgradePanel'
import ListingWizardSteps from '@/components/dashboard/ListingWizardSteps'
import ListingSection from '@/components/dashboard/ListingSection'
import DeleteListingButton from '@/components/dashboard/DeleteListingButton'
import ListingAnalyticsPanel from '@/components/dashboard/ListingAnalyticsPanel'
import { propertyImageOrderBy } from '@/lib/property-image-order'
import { canPublishListing } from '@/lib/publish'
import { getListingAnalytics } from '@/lib/listing-analytics'
import { parsePropertyFeatures } from '@/lib/property-features'
import { packageRank } from '@/lib/listing-packages'
import { FileText, ImageIcon } from 'lucide-react'

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
      include: { images: { orderBy: propertyImageOrderBy } },
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
  const hasPhotos = property.images.length > 0
  const detailsComplete = publishCheck.missing.filter(
    (m) => m !== 'At least one photo'
  ).length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-black text-stone-900 sm:text-3xl">
            {property.published ? 'Manage listing' : 'Finish your listing'}
          </h1>
          <p className="mt-1 text-sm text-stone-500">{property.title}</p>
        </div>
        <DeleteListingButton
          propertyId={property.id}
          propertyTitle={property.title}
        />
      </div>

      <ListingWizardSteps
        steps={[
          { id: 'details', label: '1. Details', done: detailsComplete, active: !detailsComplete },
          {
            id: 'photos',
            label: '2. Photos',
            done: hasPhotos,
            active: detailsComplete && !hasPhotos,
          },
          {
            id: 'package',
            label: '3. Package & pay',
            done: property.published,
            active: hasPhotos && !property.published,
          },
          {
            id: 'live',
            label: '4. Live',
            done: property.published,
            active: property.published,
          },
        ]}
      />

      {property.published && (
        <ListingPackageCheckout
          propertyId={property.id}
          propertyTitle={property.title}
          published
          missing={[]}
          currentPlan={property.adPlan}
        />
      )}

      <ListingSection
        id="listing-details"
        step={1}
        title="Property details"
        description="Title, price, location, features, and your contact card."
        icon={<FileText className="h-5 w-5" aria-hidden />}
      >
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
      </ListingSection>

      <ListingSection
        id="property-photos"
        step={2}
        title="Property photos"
        description="Upload high-quality images. The first photo is your cover image."
        icon={<ImageIcon className="h-5 w-5" aria-hidden />}
      >
        {!hasPhotos && !property.published && (
          <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
            Add at least one photo to unlock package selection and payment.
          </div>
        )}
        <ImageUploader propertyId={property.id} images={property.images} />
      </ListingSection>

      {!property.published && (
        <ListingPackageCheckout
          propertyId={property.id}
          propertyTitle={property.title}
          published={false}
          missing={publishCheck.missing}
          currentPlan={property.adPlan}
        />
      )}

      {property.published && packageRank(property.adPlan) < packageRank('PREMIUM') && (
        <ListingUpgradePanel
          propertyId={property.id}
          currentPlan={property.adPlan}
          featuredUntil={property.featuredUntil?.toISOString() ?? null}
        />
      )}

      {analytics && <ListingAnalyticsPanel analytics={analytics} />}
    </div>
  )
}
