import { propertyImageAt } from '@/lib/property-images'
import type { ListingType } from '@/generated/prisma/client'

export type DemoPropertyFilters = {
  listingType?: ListingType
  q?: string
  suburb?: string
  address?: string
  minPrice?: number
  maxPrice?: number
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
  images: { id: string; url: string }[]
  seller: { name: string; email: string }
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
    bathrooms: 3,
    parkings: 2,
    size: 220,
    type: 'HOUSE',
    listingType: 'SALE',
    featured: true,
    images: [{ id: 'demo-sale-1-0', url: propertyImageAt(0) }],
    seller: { name: 'Homescount Demo', email: 'demo@homescount.com' },
  },
  {
    id: 'demo-sale-2',
    title: 'Suburban townhouse with patio',
    description:
      'Low-maintenance townhouse in a secure complex with communal pool and 24-hour access control. Ideal for young families.',
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
    images: [{ id: 'demo-sale-2-0', url: propertyImageAt(1) }],
    seller: { name: 'Homescount Demo', email: 'demo@homescount.com' },
  },
  {
    id: 'demo-sale-3',
    title: 'Estate living with pool',
    description:
      'Executive home in a gated estate featuring a heated pool, study, and landscaped garden. Premium finishes throughout.',
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
    images: [{ id: 'demo-sale-3-0', url: propertyImageAt(2) }],
    seller: { name: 'Homescount Demo', email: 'demo@homescount.com' },
  },
  {
    id: 'demo-sale-4',
    title: 'Winelands villa with views',
    description:
      'Stunning villa overlooking vineyards with high ceilings, fireplace, and outdoor entertainment area. Minutes from the town centre.',
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
    images: [{ id: 'demo-sale-4-0', url: propertyImageAt(3) }],
    seller: { name: 'Homescount Demo', email: 'demo@homescount.com' },
  },
  {
    id: 'demo-sale-5',
    title: 'City apartment near offices',
    description:
      'Bright two-bedroom apartment with balcony, concierge, and gym in the building. Walk to Sandton City and Gautrain.',
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
    images: [{ id: 'demo-sale-5-0', url: propertyImageAt(4) }],
    seller: { name: 'Homescount Demo', email: 'demo@homescount.com' },
  },
  {
    id: 'demo-sale-6',
    title: 'Coastal family home',
    description:
      'Relaxed beach-side living with sea glimpses, open deck, and generous living spaces. Perfect weekend retreat or full-time home.',
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
    images: [{ id: 'demo-sale-6-0', url: propertyImageAt(5) }],
    seller: { name: 'Homescount Demo', email: 'demo@homescount.com' },
  },
  {
    id: 'demo-rent-1',
    title: 'Sea-facing apartment',
    description:
      'Furnished two-bedroom apartment with Atlantic views, secure parking, and walking distance to the promenade and restaurants.',
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
    images: [{ id: 'demo-rent-1-0', url: propertyImageAt(1) }],
    seller: { name: 'Homescount Demo', email: 'demo@homescount.com' },
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
    images: [{ id: 'demo-rent-2-0', url: propertyImageAt(4) }],
    seller: { name: 'Homescount Demo', email: 'demo@homescount.com' },
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
    images: [{ id: 'demo-rent-3-0', url: propertyImageAt(0) }],
    seller: { name: 'Homescount Demo', email: 'demo@homescount.com' },
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
    images: [{ id: 'demo-rent-4-0', url: propertyImageAt(2) }],
    seller: { name: 'Homescount Demo', email: 'demo@homescount.com' },
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
    images: [{ id: 'demo-rent-5-0', url: propertyImageAt(3) }],
    seller: { name: 'Homescount Demo', email: 'demo@homescount.com' },
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
    images: [{ id: 'demo-rent-6-0', url: propertyImageAt(5) }],
    seller: { name: 'Homescount Demo', email: 'demo@homescount.com' },
  },
]

export function getDemoPropertyById(id: string): DemoProperty | undefined {
  return demoProperties.find((p) => p.id === id)
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

  return results.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return 0
  })
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
    images: d.images.map((img) => ({ url: img.url })),
  }
}

export function demoToFeaturedGrid(d: DemoProperty) {
  return {
    id: d.id,
    title: d.title,
    price: d.price,
    city: d.city,
    province: d.province,
    bedrooms: d.bedrooms,
    listingType: d.listingType,
    imageUrl: d.images[0]?.url ?? propertyImageAt(0),
  }
}
