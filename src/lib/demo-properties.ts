import { propertyImageAt } from '@/lib/property-images'
import type { ListingType } from '@/generated/prisma/client'
import { computeListingQualityScore } from '@/lib/listing-quality'
import type { PropertyFeatures } from '@/lib/property-features'

export type DemoPropertyFilters = {
  listingType?: ListingType
  q?: string
  suburb?: string
  address?: string
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
}

/** Sample listings — hidden automatically once sellers publish real properties. */
export type DemoProperty = {
  id: string
  title: string
  description: string
  price: number
  location: string
  suburb: string
  city: string
  province: string
  bedrooms: number
  bathrooms: number
  parkings: number
  size: number
  type: string
  listingType: ListingType
  featured: boolean
  verified: boolean
  virtualTourUrl?: string | null
  createdAt?: string
  features?: PropertyFeatures
  qualityScore?: number
  images: { id: string; url: string }[]
  seller: {
    name: string
    email: string
    phone?: string | null
    companyName?: string | null
    companyAddress?: string | null
    companyLogoUrl?: string | null
    showPhone?: boolean
  }
}

function demoImages(idPrefix: string, count: number, startIndex = 0) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${idPrefix}-${i}`,
    url: propertyImageAt(startIndex + i),
  }))
}

function saleDemoImageStart(id: string): number {
  const n = Number.parseInt(id.replace('demo-sale-', ''), 10)
  return Number.isNaN(n) ? 0 : n - 1
}

const DEMO_SALE_SELLERS: Record<string, DemoProperty['seller']> = {
  'demo-sale-1': {
    name: 'Thandi Mokoena',
    email: 'demo@homescout.com',
    phone: '082 555 1234',
    companyName: 'Sandton Property Group',
    companyAddress: 'Shop 4, Sandton City, Johannesburg',
    showPhone: true,
  },
  'demo-sale-2': {
    name: 'Nomsa Dlamini',
    email: 'demo@homescout.com',
    phone: '083 212 4567',
    companyName: 'Coastal Living Realty',
    companyAddress: '14 Lighthouse Road, Umhlanga, Durban',
    showPhone: true,
  },
  'demo-sale-3': {
    name: 'Pieter Botha',
    email: 'demo@homescout.com',
    phone: '082 901 3344',
    companyName: 'Pretoria Estate Agents',
    companyAddress: 'Block C, Menlyn Maine, Pretoria',
    showPhone: true,
  },
  'demo-sale-4': {
    name: 'Johan van Wyk',
    email: 'demo@homescout.com',
    phone: '021 555 8899',
    companyName: 'Winelands Property Co.',
    companyAddress: '22 Dorp Street, Stellenbosch',
    showPhone: true,
  },
  'demo-sale-5': {
    name: 'Lerato Molefe',
    email: 'demo@homescout.com',
    phone: '011 555 2211',
    companyName: 'Sandton Urban Homes',
    companyAddress: 'Maude Street, Sandton CBD, Johannesburg',
    showPhone: true,
  },
  'demo-sale-6': {
    name: 'Sarah Naidoo',
    email: 'demo@homescout.com',
    phone: '041 555 6677',
    companyName: 'Eastern Cape Coastal',
    companyAddress: 'Marine Drive, Summerstrand, Gqeberha',
    showPhone: true,
  },
}

function defaultSaleFeatures(p: DemoProperty): PropertyFeatures {
  const features: PropertyFeatures = {
    kitchen: true,
    paving: p.type === 'HOUSE' || p.type === 'TOWNHOUSE',
    aircon: p.type === 'APARTMENT' || p.type === 'TOWNHOUSE',
  }

  if (p.bedrooms >= 2) {
    features.lounges = p.bedrooms >= 4 ? 2 : 1
    features.diningAreas = 1
  }
  if (p.bathrooms >= 2) {
    features.ensuites = Math.min(Math.max(p.bathrooms - 1, 1), 3)
    features.guestToilet = p.bathrooms >= 3
  }
  if (p.bedrooms >= 3) {
    features.familyTvRoom = p.type === 'HOUSE'
    features.study = p.bedrooms >= 4
  }
  if (p.type === 'HOUSE') {
    features.garden = true
    features.builtInBrai = true
    if (p.description.toLowerCase().includes('pool')) features.pool = true
  }
  if (p.type === 'APARTMENT' || p.type === 'TOWNHOUSE') {
    features.balcony = true
  }
  if (p.type === 'TOWNHOUSE') {
    features.pool = true
    features.petFriendly = true
  }
  if (p.parkings >= 2) {
    features.paving = true
  }

  return features
}

function isRichSaleDemo(p: DemoProperty): boolean {
  return (
    p.listingType === 'SALE' &&
    p.id.startsWith('demo-sale-') &&
    p.images.length >= 5 &&
    Boolean(p.features && Object.keys(p.features).length > 0) &&
    Boolean(p.seller.phone)
  )
}

const DEFAULT_DEMO_SELLER: DemoProperty['seller'] = {
  name: 'Homescout Demo',
  email: 'demo@homescout.com',
  phone: '082 555 0100',
  companyName: 'Homescout Property Group',
  companyAddress: '1 Sandton Drive, Sandton, Johannesburg',
  showPhone: true,
}

function applyDemoListingDefaults(p: DemoProperty): DemoProperty {
  if (!p.id.startsWith('demo-')) return p

  let next = { ...p }

  if (p.listingType === 'SALE' && p.id.startsWith('demo-sale-') && !isRichSaleDemo(p)) {
    const index = saleDemoImageStart(p.id)
    next = {
      ...next,
      createdAt: next.createdAt ?? `2026-0${Math.min(index + 1, 9)}-15T10:00:00.000Z`,
      images: next.images.length >= 5 ? next.images : demoImages(next.id, 6, index),
      features:
        next.features && Object.keys(next.features).length > 0
          ? next.features
          : defaultSaleFeatures(next),
    }
  }

  if (!next.seller.phone) {
    next = {
      ...next,
      seller: DEMO_SALE_SELLERS[next.id] ?? DEFAULT_DEMO_SELLER,
    }
  }

  return {
    ...next,
    verified: true,
  }
}

export const demoProperties: DemoProperty[] = [
  {
    id: 'demo-sale-1',
    title: 'Modern family home with garden',
    description:
      'Spacious open-plan living with a private garden, modern kitchen, and double garage. Close to schools and shopping in the heart of Sandton.',
    price: 2890000,
    location: 'Rivonia Road',
    suburb: 'Sandton',
    city: 'Johannesburg',
    province: 'Gauteng',
    bedrooms: 4,
    bathrooms: 4,
    parkings: 3,
    size: 220,
    type: 'HOUSE',
    listingType: 'SALE',
    featured: true,
    verified: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    features: {
      ensuites: 3,
      lounges: 2,
      diningAreas: 1,
      petFriendly: true,
      balcony: true,
      pool: true,
      study: true,
      kitchen: true,
      garden: true,
      familyTvRoom: true,
      paving: true,
      guestToilet: true,
      builtInBrai: true,
      aircon: true,
    },
    images: demoImages('demo-sale-1', 6, 0),
    seller: {
      name: 'Thandi Mokoena',
      email: 'demo@homescout.com',
      phone: '082 555 1234',
      companyName: 'Sandton Property Group',
      companyAddress: 'Shop 4, Sandton City, Johannesburg',
      showPhone: true,
    },
  },
  {
    id: 'demo-sale-2',
    title: 'Suburban townhouse with patio',
    description:
      'Low-maintenance townhouse in a secure complex with communal pool and 24-hour access control. Open-plan living opens to a covered patio, ideal for young families. The kitchen offers ample cupboard space, and both bedrooms include built-in wardrobes. Walk to Umhlanga beach and local schools.',
    price: 1650000,
    location: 'Umhlanga Ridge',
    suburb: 'Umhlanga',
    city: 'Durban',
    province: 'KwaZulu-Natal',
    bedrooms: 3,
    bathrooms: 2,
    parkings: 1,
    size: 145,
    type: 'TOWNHOUSE',
    listingType: 'SALE',
    featured: false,
    verified: true,
    images: [{ id: 'demo-sale-2-0', url: propertyImageAt(1) }],
    seller: { name: 'Homescout Demo', email: 'demo@Homescout.com' },
  },
  {
    id: 'demo-sale-3',
    title: 'Estate living with pool',
    description:
      'Executive home in a gated estate featuring a heated pool, study, and landscaped garden. Premium finishes throughout. Double-volume entrance, pyjama lounge, and staff quarters complete this family residence. Easy access to highways and top schools in the east of Pretoria.',
    price: 4250000,
    location: 'Silver Lakes',
    suburb: 'Silver Lakes',
    city: 'Pretoria',
    province: 'Gauteng',
    bedrooms: 5,
    bathrooms: 4,
    parkings: 3,
    size: 380,
    type: 'HOUSE',
    listingType: 'SALE',
    featured: true,
    verified: true,
    images: [{ id: 'demo-sale-3-0', url: propertyImageAt(2) }],
    seller: { name: 'Homescout Demo', email: 'demo@Homescout.com' },
  },
  {
    id: 'demo-sale-4',
    title: 'Winelands villa with views',
    description:
      'Stunning villa overlooking vineyards with high ceilings, fireplace, and outdoor entertainment area. Minutes from the Stellenbosch town centre. Four generous bedrooms, a gourmet kitchen, and a covered braai patio make this ideal for entertainers. Mountain views from the main suite.',
    price: 5120000,
    location: 'Devon Valley Road',
    suburb: 'Devon Valley',
    city: 'Stellenbosch',
    province: 'Western Cape',
    bedrooms: 4,
    bathrooms: 3,
    parkings: 2,
    size: 310,
    type: 'HOUSE',
    listingType: 'SALE',
    featured: false,
    verified: false,
    images: [{ id: 'demo-sale-4-0', url: propertyImageAt(3) }],
    seller: { name: 'Homescout Demo', email: 'demo@Homescout.com' },
  },
  {
    id: 'demo-sale-5',
    title: 'City apartment near offices',
    description:
      'Bright two-bedroom apartment with balcony, concierge, and gym in the building. Walk to Sandton City and Gautrain. Floor-to-ceiling windows flood the open-plan living area with natural light. Secure parking, backup water, and 24-hour security included in the levy.',
    price: 1890000,
    location: 'Maude Street',
    suburb: 'Sandton CBD',
    city: 'Johannesburg',
    province: 'Gauteng',
    bedrooms: 2,
    bathrooms: 2,
    parkings: 1,
    size: 95,
    type: 'APARTMENT',
    listingType: 'SALE',
    featured: false,
    verified: false,
    images: [{ id: 'demo-sale-5-0', url: propertyImageAt(4) }],
    seller: { name: 'Homescout Demo', email: 'demo@Homescout.com' },
  },
  {
    id: 'demo-sale-6',
    title: 'Coastal family home',
    description:
      'Relaxed beach-side living with sea glimpses, open deck, and generous living spaces. Perfect weekend retreat or full-time home. Four bedrooms include a main en-suite, with a separate TV room and study. Landscaped garden with built-in braai and double garage.',
    price: 3100000,
    location: 'Marine Drive',
    suburb: 'Summerstrand',
    city: 'Gqeberha',
    province: 'Eastern Cape',
    bedrooms: 4,
    bathrooms: 2,
    parkings: 2,
    size: 240,
    type: 'HOUSE',
    listingType: 'SALE',
    featured: false,
    verified: false,
    images: [{ id: 'demo-sale-6-0', url: propertyImageAt(5) }],
    seller: { name: 'Homescout Demo', email: 'demo@Homescout.com' },
  },
  {
    id: 'demo-rent-1',
    title: 'Sea-facing apartment',
    description:
      'SOLE MANDATE — Furnished two-bedroom apartment with Atlantic views, secure parking, and walking distance to the promenade and restaurants. Open-plan living flows to a balcony overlooking the ocean. The kitchen is fully fitted with modern appliances. Both bedrooms have built-in cupboards; the main bedroom enjoys an en-suite shower. The complex offers 24-hour security, a communal pool, and visitor parking. Ideal for professionals or a lock-up-and-go coastal lifestyle. Available immediately — book a viewing today.',
    price: 18500,
    location: 'Beach Road',
    suburb: 'Sea Point',
    city: 'Cape Town',
    province: 'Western Cape',
    bedrooms: 2,
    bathrooms: 1,
    parkings: 1,
    size: 78,
    type: 'APARTMENT',
    listingType: 'RENT',
    featured: true,
    verified: true,
    createdAt: '2026-02-10',
    images: demoImages('demo-rent-1', 9, 0),
    seller: { name: 'Thandi Mokoena', email: 'demo@homescout.co.za' },
  },
  {
    id: 'demo-rent-2',
    title: 'City centre studio',
    description:
      'Compact studio ideal for professionals. Includes Wi-Fi, laundry, and access to rooftop lounge in a secure building.',
    price: 9500,
    location: 'Maboneng',
    suburb: 'Maboneng',
    city: 'Johannesburg',
    province: 'Gauteng',
    bedrooms: 1,
    bathrooms: 1,
    parkings: 0,
    size: 42,
    type: 'APARTMENT',
    listingType: 'RENT',
    featured: false,
    verified: false,
    images: [{ id: 'demo-rent-2-0', url: propertyImageAt(4) }],
    seller: { name: 'Homescout Demo', email: 'demo@Homescout.com' },
  },
  {
    id: 'demo-rent-3',
    title: 'Sandton luxury apartment',
    description:
      'Premium one-bedroom with floor-to-ceiling windows, inverter backup, and hotel-style amenities in a landmark tower.',
    price: 22000,
    location: 'Alice Lane',
    suburb: 'Sandton',
    city: 'Johannesburg',
    province: 'Gauteng',
    bedrooms: 1,
    bathrooms: 1,
    parkings: 1,
    size: 65,
    type: 'APARTMENT',
    listingType: 'RENT',
    featured: true,
    verified: false,
    images: [{ id: 'demo-rent-3-0', url: propertyImageAt(0) }],
    seller: { name: 'Homescout Demo', email: 'demo@Homescout.com' },
  },
  {
    id: 'demo-rent-4',
    title: 'Durban north family rental',
    description:
      'Three-bedroom home with flat garden, domestic quarters, and easy access to the N2 and Umhlanga beaches.',
    price: 14500,
    location: 'Durban North',
    suburb: 'Durban North',
    city: 'Durban',
    province: 'KwaZulu-Natal',
    bedrooms: 3,
    bathrooms: 2,
    parkings: 2,
    size: 160,
    type: 'HOUSE',
    listingType: 'RENT',
    featured: false,
    verified: false,
    images: [{ id: 'demo-rent-4-0', url: propertyImageAt(2) }],
    seller: { name: 'Homescout Demo', email: 'demo@Homescout.com' },
  },
  {
    id: 'demo-rent-5',
    title: 'Pretoria family home to rent',
    description:
      'Well-maintained four-bedroom home in a quiet street with borehole, solar, and space for home office.',
    price: 16800,
    location: 'Faerie Glen',
    suburb: 'Faerie Glen',
    city: 'Pretoria',
    province: 'Gauteng',
    bedrooms: 4,
    bathrooms: 2,
    parkings: 2,
    size: 210,
    type: 'HOUSE',
    listingType: 'RENT',
    featured: false,
    verified: false,
    images: [{ id: 'demo-rent-5-0', url: propertyImageAt(3) }],
    seller: { name: 'Homescout Demo', email: 'demo@Homescout.com' },
  },
  {
    id: 'demo-rent-6',
    title: 'Stellenbosch cottage',
    description:
      'Charming two-bedroom cottage on a wine farm with mountain views. Pets considered. Available immediately.',
    price: 12500,
    location: 'Koelenhof',
    suburb: 'Koelenhof',
    city: 'Stellenbosch',
    province: 'Western Cape',
    bedrooms: 2,
    bathrooms: 1,
    parkings: 1,
    size: 88,
    type: 'HOUSE',
    listingType: 'RENT',
    featured: false,
    verified: false,
    images: [{ id: 'demo-rent-6-0', url: propertyImageAt(5) }],
    seller: { name: 'Homescout Demo', email: 'demo@Homescout.com' },
  },
]

function enrichDemoProperty(p: DemoProperty): DemoProperty {
  const withDefaults = applyDemoListingDefaults(p)
  return {
    ...withDefaults,
    qualityScore:
      withDefaults.qualityScore ??
      computeListingQualityScore({
        title: withDefaults.title,
        description: withDefaults.description,
        price: withDefaults.price,
        location: withDefaults.location,
        suburb: withDefaults.suburb,
        city: withDefaults.city,
        province: withDefaults.province,
        bedrooms: withDefaults.bedrooms,
        bathrooms: withDefaults.bathrooms,
        parkings: withDefaults.parkings,
        size: withDefaults.size,
        virtualTourUrl: withDefaults.virtualTourUrl,
        images: withDefaults.images,
        features: withDefaults.features,
      }),
  }
}

export function getDemoPropertyById(id: string): DemoProperty | undefined {
  const found = demoProperties.find((p) => p.id === id)
  return found ? enrichDemoProperty(found) : undefined
}

export function filterDemoProperties(
  filters: DemoPropertyFilters = {}
): DemoProperty[] {
  let results = [...demoProperties]

  if (filters.listingType) {
    results = results.filter((p) => p.listingType === filters.listingType)
  }

  if (filters.suburb?.trim()) {
    const suburb = filters.suburb.trim().toLowerCase()
    results = results.filter((p) => p.suburb.toLowerCase().includes(suburb))
  }

  if (filters.address?.trim()) {
    const address = filters.address.trim().toLowerCase()
    results = results.filter(
      (p) =>
        p.location.toLowerCase().includes(address) ||
        p.suburb.toLowerCase().includes(address)
    )
  }

  if (filters.q?.trim()) {
    const q = filters.q.trim().toLowerCase()
    results = results.filter(
      (p) =>
        p.city.toLowerCase().includes(q) ||
        p.province.toLowerCase().includes(q) ||
        p.suburb.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
    )
  }

  if (filters.minPrice && filters.minPrice > 0) {
    results = results.filter((p) => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice && filters.maxPrice > 0) {
    results = results.filter((p) => p.price <= filters.maxPrice!)
  }

  if (filters.minBedrooms && filters.minBedrooms > 0) {
    results = results.filter((p) => p.bedrooms >= filters.minBedrooms!)
  }

  return results
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return 0
    })
    .map(enrichDemoProperty)
}

export function demoToBrowseProperty(d: DemoProperty) {
  return {
    id: d.id,
    title: d.title,
    price: d.price,
    suburb: d.suburb,
    location: d.location,
    city: d.city,
    province: d.province,
    bedrooms: d.bedrooms,
    bathrooms: d.bathrooms,
    parkings: d.parkings,
    size: d.size,
    type: d.type,
    listingType: d.listingType,
    featured: d.featured,
    verified: d.verified,
    images: d.images.map((img) => ({ url: img.url })),
  }
}

export function demoToFeaturedGrid(d: DemoProperty) {
  const enriched = enrichDemoProperty(d)
  return {
    id: enriched.id,
    title: enriched.title,
    price: enriched.price,
    city: enriched.city,
    province: enriched.province,
    bedrooms: enriched.bedrooms,
    listingType: enriched.listingType,
    imageUrl: enriched.images[0]?.url ?? propertyImageAt(0),
  }
}
