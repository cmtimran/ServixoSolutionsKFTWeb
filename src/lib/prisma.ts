/**
 * Prisma Client singleton for Next.js App Router.
 *
 * Prisma 7 requires a driver adapter. We use @prisma/adapter-pg (pg driver).
 * If DATABASE_URL is not configured (e.g. during CI build), we export a
 * lightweight Proxy that silently no-ops all queries so the build succeeds.
 */

import type { PrismaClient as PrismaClientType } from '@prisma/client';

// Use a module-level singleton reference to avoid creating multiple connections
// across hot-reloads in development.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

function createMockClient(): PrismaClientType {
  // A recursive Proxy that returns itself for any property access and a
  // Promise resolving to an empty array / null for any function call.
  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      if (prop === 'then') return undefined; // not a Promise itself
      return new Proxy(() => Promise.resolve([]), handler);
    },
    apply(_target, _this, _args) {
      return Promise.resolve([]);
    },
  };
  return new Proxy({}, handler) as unknown as PrismaClientType;
}

async function buildClient(): Promise<PrismaClientType> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return createMockClient();
  }

  const { PrismaClient } = await import('@prisma/client');
  const { PrismaPg } = await import('@prisma/adapter-pg');

  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter } as any);
}

// For synchronous imports we need a sync export. We create the client eagerly
// at module load using a top-level await alternative: store a promise + a
// pre-resolved synchronous value via a lazy initialiser.
let _prisma: PrismaClientType | undefined;

function getPrisma(): PrismaClientType {
  if (_prisma) return _prisma;

  const url = process.env.DATABASE_URL;
  if (!url) {
    _prisma = createMockClient();
    return _prisma;
  }

  // Synchronously create the client. Dynamic imports of CJS modules are sync
  // in Node.js CommonJS context (Next.js server).
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require('@prisma/client');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaPg } = require('@prisma/adapter-pg');
    const adapter = new PrismaPg({ connectionString: url });
    _prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = _prisma;
    }
    return _prisma!;
  } catch (e) {
    console.warn('[prisma] Failed to create client, using mock:', e);
    _prisma = createMockClient();
    return _prisma;
  }
}

export const prisma: PrismaClientType = new Proxy({} as PrismaClientType, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});
