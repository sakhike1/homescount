/**
 * Backfill seller phone + company fields so all listings show the same contact card.
 * Run: npx tsx scripts/backfill-seller-contact.ts
 */
import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma = new PrismaClient({ adapter })

  const result = await prisma.user.updateMany({
    where: { role: 'SELLER' },
    data: {
      phone: '082 555 0100',
      companyName: 'Homescout Property Group',
      companyAddress: '1 Sandton Drive, Sandton, Johannesburg',
      showPhone: true,
    },
  })

  console.log(`Updated ${result.count} seller profile(s).`)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
