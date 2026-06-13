/** Consistent image ordering — cover photo is sortOrder 0. */
export const propertyImageOrderBy = [
  { sortOrder: 'asc' as const },
  { createdAt: 'asc' as const },
  { id: 'asc' as const },
]
