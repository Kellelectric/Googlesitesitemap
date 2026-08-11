import { PrismaClient } from '@prisma/client'
import { seedDatabase } from '../src/lib/seedDatabase'

const prisma = new PrismaClient()

seedDatabase(prisma)
  .then((summary) => {
    console.log(`Seeded ${summary.servicesUpserted} services, ${summary.engineersEnsured} engineers, ${summary.settingsUpserted} settings.`)
    if (summary.adminCreated) {
      console.log(`Created admin user ${summary.adminEmail} — change the password after first login.`)
    } else {
      console.log(`Admin user ${summary.adminEmail} already exists — left untouched.`)
    }
    console.log('Seed complete.')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
