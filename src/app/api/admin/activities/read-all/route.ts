import { NextResponse } from 'next/server'
import { markAllActivitiesRead } from '@/lib/activity'
import { getAdminSession, unauthorized } from '@/lib/api-auth'

export async function POST() {
  const session = await getAdminSession()
  if (!session) return unauthorized()

  await markAllActivitiesRead()
  return NextResponse.json({ success: true })
}
