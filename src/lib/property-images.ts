/** Local property photos in /public/property-images */
export const propertyImages = [
  '/property-images/2f8ec23c4d9785a449ea604b22f3d2d8.jpg',
  '/property-images/4d82ac2618a6added7fea05b8870d899.jpg',
  '/property-images/59f7a7ad7ff6f13afbfc384144a0628d.jpg',
  '/property-images/70ce4843500bfc0fca113bdfa97addbc.jpg',
  '/property-images/8081603765d99262541199bac9d805c6.jpg',
  '/property-images/c4e964396df2a1f95b4e4757df7b34bd.jpg',
] as const

export function propertyImageAt(index: number): string {
  return propertyImages[index % propertyImages.length]
}
