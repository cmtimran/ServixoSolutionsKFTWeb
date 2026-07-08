const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@servixo.com' }
  });
  console.log("USER RECORD:");
  console.log(user);
}

main().catch(console.error).finally(() => prisma.$disconnect());
