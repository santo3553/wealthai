import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

function resolveDatabaseUrl(): string {
  // If explicitly specified and not on Vercel
  if (process.env.DATABASE_URL && !process.env.VERCEL) {
    if (process.env.DATABASE_URL.startsWith('file:./')) {
      const relPath = process.env.DATABASE_URL.replace('file:', '');
      return `file:${path.resolve(process.cwd(), relPath)}`;
    }
    return process.env.DATABASE_URL;
  }

  // Vercel Serverless environment
  if (process.env.VERCEL) {
    const tmpDbPath = '/tmp/dev.db';

    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.join(__dirname, '..', '..', '..', 'prisma', 'dev.db'),
        path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
        path.join(__dirname, 'prisma', 'dev.db'),
      ];

      let copied = false;
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            copied = true;
            console.log(`[PRISMA] Initialized /tmp/dev.db from: ${candidate}`);
            break;
          } catch (err) {
            console.warn(`[PRISMA] Failed to copy from ${candidate}:`, err);
          }
        }
      }

      if (!copied) {
        console.log('[PRISMA] Source dev.db not found, /tmp/dev.db will be created');
      }
    }

    return `file:${tmpDbPath}`;
  }

  // Default local development
  return `file:${path.resolve(process.cwd(), 'prisma', 'dev.db')}`;
}

const dbUrl = resolveDatabaseUrl();
process.env.DATABASE_URL = dbUrl;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
