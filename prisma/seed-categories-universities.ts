import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed categories
  const categories = [
    'Agriculture',
    'Healthcare',
    'Environment',
    'Education',
    'Accessibility',
    'IoT',
    'AI/ML',
    'Robotics',
    'Other'
  ]

  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
        isActive: true
      }
    })
  }

  // Seed universities
  const universities = [
    'Makerere University',
    'Kyambogo University',
    'Uganda Martyrs University',
    'Mbarara University of Science and Technology',
    'University of Rwanda',
    'Other'
  ]

  for (const universityName of universities) {
    await prisma.university.upsert({
      where: { name: universityName },
      update: {},
      create: {
        name: universityName,
        isActive: true
      }
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })