import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    redirect('/admin/login')
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/')
  }
  return session
}

export async function getAdminStats() {
  const prisma = (await import('@/lib/prisma')).default

  const [
    buyerCount,
    sellerCount,
    activeSellers,
    publishedListings,
    newsletterCount,
    adPaymentCount,
    inquiryCount,
    unreadActivities,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'BUYER' } }),
    prisma.user.count({ where: { role: 'SELLER' } }),
    prisma.user.count({ where: { role: 'SELLER', active: true } }),
    prisma.property.count({ where: { published: true } }),
    prisma.newsletterSubscriber.count(),
    prisma.adPayment.count({ where: { status: 'COMPLETED' } }),
    prisma.inquiry.count(),
    prisma.siteActivity.count({ where: { read: false } }),
  ])

  return {
    buyerCount,
    sellerCount,
    activeSellers,
    suspendedSellers: sellerCount - activeSellers,
    publishedListings,
    newsletterCount,
    adPaymentCount,
    inquiryCount,
    unreadActivities,
  }
}
