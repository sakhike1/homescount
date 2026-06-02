import { notFound } from 'next/navigation'

import PropertyDetailView from '@/components/properties/PropertyDetailView'

import { getPublicPropertyById } from '@/lib/properties'



export default async function PropertyDetailPage({

  params,

}: {

  params: Promise<{ id: string }>

}) {

  const { id } = await params

  const result = await getPublicPropertyById(id)



  if (!result) notFound()



  return <PropertyDetailView property={result.property} isDemo={result.isDemo} />

}


