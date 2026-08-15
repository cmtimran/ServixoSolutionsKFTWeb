const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.payment.findMany().then(console.log).finally(() => prisma.$disconnect());
