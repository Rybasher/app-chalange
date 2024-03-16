import { $Enums, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Додавання користувачів, якщо вони відсутні
  const userCount = await prisma.user.count()
  if (userCount === 0) {
    for (let i = 1; i <= 10; i++) {
      await prisma.user.create({
        data: {
          name: `User ${i}`,
          email: `user${i}@example.com`,
          password: `Password${i}` // Add a password for each user
        }
      })
    }
    console.log('Users have been added.')
  }

  // Отримуємо список усіх користувачів для прив'язки колекцій
  const users = await prisma.user.findMany({ select: { id: true } })

  // Додавання колекцій, якщо вони відсутні
  const collectionCount = await prisma.collection.count()
  if (collectionCount === 0) {
    for (let i = 1; i <= 100; i++) {
      const userIndex = Math.floor(Math.random() * users.length) // Вибір випадкового користувача
      await prisma.collection.create({
        data: {
          name: `Collection ${i}`,
          descriptions: `Description for Collection ${i}`,
          stocks: Math.floor(Math.random() * 100) + 1,
          price: Math.random() * 1000,
          userId: users[userIndex].id // Встановлення userId для колекції
        }
      })
    }
    console.log('Collections have been added.')
  }

  // Отримуємо список усіх колекцій для прив'язки ставок
  const collections = await prisma.collection.findMany({
    select: { id: true }
  })

  // Додавання ставок, якщо вони відсутні
  for (const collection of collections) {
    const bidCount = await prisma.bid.count({
      where: { collectionId: collection.id }
    })
    if (bidCount === 0) {
      for (let j = 1; j <= 10; j++) {
        const userIndex = Math.floor(Math.random() * users.length) // Вибір випадкового користувача
        const statusValues = ['PENDING', 'ACCEPTED', 'REJECTED'] // Пряме визначення значень статусу
        const status =
          statusValues[Math.floor(Math.random() * statusValues.length)]
        await prisma.bid.create({
          data: {
            collectionId: collection.id,
            price: Math.random() * 1000,
            userId: users[userIndex].id,
            status: status as $Enums.StatusType
          }
        })
      }
    }
  }
  console.log('Bids have been added where missing.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
