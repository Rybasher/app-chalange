import { PrismaClient, StatusType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Добавление пользователей, если они отсутствуют
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    for (let i = 1; i <= 10; i++) {
      await prisma.user.create({
        data: {
          name: `User ${i}`,
          email: `user${i}@example.com`,
        },
      });
    }
    console.log("Users have been added.");
  }

  // Добавление коллекций, если они отсутствуют
  const collectionCount = await prisma.collection.count();
  if (collectionCount === 0) {
    for (let i = 1; i <= 100; i++) {
      await prisma.collection.create({
        data: {
          name: `Collection ${i}`,
          descriptions: `Description for Collection ${i}`,
          stocks: Math.floor(Math.random() * 100) + 1,
          price: Math.random() * 1000,
        },
      });
    }
    console.log("Collections have been added.");
  }

  // Получаем список всех пользователей и коллекций для связывания ставок
  const users = await prisma.user.findMany({ select: { id: true } });
  const collections = await prisma.collection.findMany({
    select: { id: true },
  });

  // Добавление ставок, если они отсутствуют
  for (const collection of collections) {
    const bidCount = await prisma.bid.count({
      where: { collectionId: collection.id },
    });
    if (bidCount === 0) {
      for (let j = 1; j <= 10; j++) {
        const userIndex = Math.floor(Math.random() * users.length); // Выбор случайного пользователя
        const statusValues = Object.values(StatusType); // Получаем массив всех значений перечисления
        const status = statusValues[
          Math.floor(Math.random() * statusValues.length)
        ] as StatusType;
        await prisma.bid.create({
          data: {
            collectionId: collection.id,
            price: Math.random() * 1000,
            userId: users[userIndex].id,
            status: status,
          },
        });
      }
    }
  }
  console.log("Bids have been added where missing.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
