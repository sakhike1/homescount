import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { computeListingQualityScore } from '../src/lib/listing-quality'
import type { PropertyFeatures } from '../src/lib/property-features'

const propertyImages = [
  '/property-images/2f8ec23c4d9785a449ea604b22f3d2d8.jpg',
  '/property-images/4d82ac2618a6added7fea05b8870d899.jpg',
  '/property-images/59f7a7ad7ff6f13afbfc384144a0628d.jpg',
  '/property-images/70ce4843500bfc0fca113bdfa97addbc.jpg',
  '/property-images/8081603765d99262541199bac9d805c6.jpg',
  '/property-images/c4e964396df2a1f95b4e4757df7b34bd.jpg',
]

const listings = [
  { title: 'Modern family home with pool', suburb: 'Sandton', city: 'Johannesburg', province: 'Gauteng', price: 4250000, listingType: 'SALE' as const, beds: 4, baths: 3, park: 2, size: 320 },
  { title: 'Luxury apartment with city views', suburb: 'Sea Point', city: 'Cape Town', province: 'Western Cape', price: 2850000, listingType: 'SALE' as const, beds: 2, baths: 2, park: 1, size: 95 },
  { title: 'Spacious suburban townhouse', suburb: 'Umhlanga', city: 'Durban', province: 'KwaZulu-Natal', price: 1890000, listingType: 'SALE' as const, beds: 3, baths: 2, park: 2, size: 180 },
  { title: 'Bright open-plan apartment', suburb: 'Menlyn', city: 'Pretoria', province: 'Gauteng', price: 12500, listingType: 'RENT' as const, beds: 2, baths: 1, park: 1, size: 72 },
  { title: 'Garden cottage to rent', suburb: 'Stellenbosch', city: 'Stellenbosch', province: 'Western Cape', price: 18500, listingType: 'RENT' as const, beds: 3, baths: 2, park: 2, size: 140 },
  { title: 'Executive penthouse', suburb: 'Bryanston', city: 'Johannesburg', province: 'Gauteng', price: 8900000, listingType: 'SALE' as const, beds: 4, baths: 4, park: 3, size: 280 },
  { title: 'Coastal duplex near the beach', suburb: 'Ballito', city: 'Ballito', province: 'KwaZulu-Natal', price: 3100000, listingType: 'SALE' as const, beds: 3, baths: 2, park: 2, size: 165 },
  { title: 'Student-friendly flat', suburb: 'Hatfield', city: 'Pretoria', province: 'Gauteng', price: 7500, listingType: 'RENT' as const, beds: 1, baths: 1, park: 0, size: 48 },
  { title: 'Family estate home', suburb: 'Centurion', city: 'Pretoria', province: 'Gauteng', price: 3650000, listingType: 'SALE' as const, beds: 5, baths: 3, park: 3, size: 350 },
  { title: 'Renovated Victorian charmer', suburb: 'Observatory', city: 'Cape Town', province: 'Western Cape', price: 2200000, listingType: 'SALE' as const, beds: 3, baths: 2, park: 1, size: 155 },
  { title: 'Lock-up-and-go apartment', suburb: 'Rosebank', city: 'Johannesburg', province: 'Gauteng', price: 14500, listingType: 'RENT' as const, beds: 2, baths: 2, park: 1, size: 88 },
  { title: 'Wine estate villa', suburb: 'Franschhoek', city: 'Franschhoek', province: 'Western Cape', price: 12500000, listingType: 'SALE' as const, beds: 5, baths: 5, park: 4, size: 520 },
  { title: 'Compact starter apartment', suburb: 'Durban North', city: 'Durban', province: 'KwaZulu-Natal', price: 980000, listingType: 'SALE' as const, beds: 2, baths: 1, park: 1, size: 65 },
  { title: 'Corporate rental near CBD', suburb: 'Foreshore', city: 'Cape Town', province: 'Western Cape', price: 22000, listingType: 'RENT' as const, beds: 2, baths: 2, park: 1, size: 102 },
  { title: 'Double-storey family residence', suburb: 'Fourways', city: 'Johannesburg', province: 'Gauteng', price: 4750000, listingType: 'SALE' as const, beds: 4, baths: 3, park: 3, size: 310 },
  { title: 'Pet-friendly garden flat', suburb: 'Parktown North', city: 'Johannesburg', province: 'Gauteng', price: 11000, listingType: 'RENT' as const, beds: 2, baths: 1, park: 1, size: 78 },
  { title: 'New development apartment', suburb: 'Green Point', city: 'Cape Town', province: 'Western Cape', price: 3450000, listingType: 'SALE' as const, beds: 2, baths: 2, park: 1, size: 92 },
  { title: 'Secure complex townhouse', suburb: 'Midrand', city: 'Midrand', province: 'Gauteng', price: 16800, listingType: 'RENT' as const, beds: 3, baths: 2, park: 2, size: 130 },
]

function seedFeatures(L: (typeof listings)[number]): PropertyFeatures {
  const isApartment = L.beds <= 2 && L.size < 120
  const features: PropertyFeatures = {
    kitchen: true,
    aircon: true,
    lounges: L.beds >= 3 ? 2 : 1,
    diningAreas: 1,
  }
  if (L.baths >= 2) features.ensuites = 1
  if (L.park >= 2) features.paving = true
  if (isApartment) {
    features.balcony = true
  } else {
    features.garden = true
    features.builtInBrai = L.listingType === 'SALE'
    features.pool = L.beds >= 4
    features.petFriendly = L.listingType === 'RENT'
  }
  if (L.beds >= 4) {
    features.familyTvRoom = true
    features.study = true
    features.guestToilet = true
  }
  return features
}

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  })
  const prisma = new PrismaClient({ adapter })

  const password = await bcrypt.hash('password123', 10)

  const seller = await prisma.user.upsert({
    where: { email: 'seller@Homescout.com' },
    update: {
      phone: '082 555 0100',
      companyName: 'Homescout Property Group',
      companyAddress: '1 Sandton Drive, Sandton, Johannesburg',
      showPhone: true,
    },
    create: {
      email: 'seller@Homescout.com',
      name: 'Homescout Demo Seller',
      password,
      role: 'SELLER',
      phone: '082 555 0100',
      companyName: 'Homescout Property Group',
      companyAddress: '1 Sandton Drive, Sandton, Johannesburg',
      showPhone: true,
    },
  })

  await prisma.user.upsert({
    where: { email: 'admin@Homescout.com' },
    update: { role: 'ADMIN', active: true },
    create: {
      email: 'admin@Homescout.com',
      name: 'Homescout Admin',
      password,
      role: 'ADMIN',
    },
  })

  await prisma.image.deleteMany({
    where: { property: { sellerId: seller.id } },
  })
  await prisma.property.deleteMany({ where: { sellerId: seller.id } })

  for (let i = 0; i < listings.length; i++) {
    const L = listings[i]
    const imgBase = i % propertyImages.length

    const features = seedFeatures(L)
    const imageRows = [
      { url: propertyImages[imgBase] },
      { url: propertyImages[(imgBase + 1) % propertyImages.length] },
      { url: propertyImages[(imgBase + 2) % propertyImages.length] },
      { url: propertyImages[(imgBase + 3) % propertyImages.length] },
      { url: propertyImages[(imgBase + 4) % propertyImages.length] },
      { url: propertyImages[(imgBase + 5) % propertyImages.length] },
    ]
    const description = `Beautiful ${L.listingType === 'RENT' ? 'rental' : 'home'} in ${L.suburb}, ${L.city}. Open-plan living, modern finishes, and great access to schools, shops, and transport. Ideal for families or professionals seeking comfort and convenience in ${L.province}.`
    const qualityScore = computeListingQualityScore({
      title: L.title,
      description,
      price: L.price,
      location: `${10 + i} Main Road`,
      suburb: L.suburb,
      city: L.city,
      province: L.province,
      bedrooms: L.beds,
      bathrooms: L.baths,
      parkings: L.park,
      size: L.size,
      images: imageRows,
      features,
    })

    const property = await prisma.property.create({
      data: {
        title: L.title,
        description,
        price: L.price,
        location: `${10 + i} Main Road`,
        suburb: L.suburb,
        city: L.city,
        province: L.province,
        bedrooms: L.beds,
        bathrooms: L.baths,
        parkings: L.park,
        size: L.size,
        type: i % 3 === 0 ? 'APARTMENT' : 'HOUSE',
        listingType: L.listingType,
        status: 'AVAILABLE',
        published: true,
        publishedAt: new Date(),
        featured: i < 4,
        verified: true,
        verifiedAt: new Date(),
        sellerId: seller.id,
        features,
        qualityScore,
        images: { create: imageRows },
      },
    })

    console.log('Created:', property.title)
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: 'demo.subscriber@Homescout.com' },
    update: {},
    create: {
      email: 'demo.subscriber@Homescout.com',
      privacyConsentAt: new Date(),
    },
  })

  const firstProperty = await prisma.property.findFirst({
    where: { sellerId: seller.id },
    orderBy: { createdAt: 'asc' },
  })

  await prisma.siteActivity.deleteMany({})
  await prisma.siteActivity.createMany({
    data: [
      {
        type: 'SELLER_REGISTERED',
        message: `Seller registered: ${seller.name} (${seller.email})`,
        userId: seller.id,
        read: true,
      },
      {
        type: 'NEWSLETTER_SUBSCRIBED',
        message: 'Newsletter subscription: demo.subscriber@Homescout.com',
        metadata: { email: 'demo.subscriber@Homescout.com' },
        read: false,
      },
      ...(firstProperty
        ? [
            {
              type: 'LISTING_PUBLISHED' as const,
              message: `Listing published: "${firstProperty.title}"`,
              userId: seller.id,
              metadata: { propertyId: firstProperty.id },
              read: false,
            },
          ]
        : []),
    ],
  })

  await prisma.user.updateMany({
    where: {
      role: 'SELLER',
      OR: [{ phone: null }, { phone: '' }],
    },
    data: {
      phone: '082 555 0100',
      companyName: 'Homescout Property Group',
      companyAddress: '1 Sandton Drive, Sandton, Johannesburg',
      showPhone: true,
    },
  })

  await prisma.user.updateMany({
    where: {
      role: 'SELLER',
      companyName: null,
    },
    data: {
      companyName: 'Homescout Property Group',
      companyAddress: '1 Sandton Drive, Sandton, Johannesburg',
      showPhone: true,
    },
  })

  console.log('\nSeed complete!')
  console.log('Seller login: seller@Homescout.com / password123')
  console.log('Admin login:  admin@Homescout.com / password123  → /admin/login')
  console.log(`${listings.length} published properties created.`)
  console.log('Admin portal: sample newsletter + activity records added.')
}

main().catch(console.error)
