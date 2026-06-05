'use client'

import { useEffect } from 'react'

export default function ListingViewTracker({
  propertyId,
  isDemo,
}: {
  propertyId: string
  isDemo?: boolean
}) {
  useEffect(() => {
    if (isDemo) return
    fetch(`/api/properties/${propertyId}/view`, { method: 'POST' }).catch(() => {})
  }, [propertyId, isDemo])

  return null
}
