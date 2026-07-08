import { prisma } from './src/lib/prisma';

async function main() {
  const users = await prisma.$queryRaw`SELECT * FROM "User"`;
  console.log("RAW USERS:");
  console.log(users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
