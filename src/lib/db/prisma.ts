import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

declare global {
  var __trustflowPrisma: PrismaClient | undefined;
  var __trustflowPgPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is required to initialize Prisma and Better Auth persistence.",
  );
}

const pool =
  globalThis.__trustflowPgPool ??
  new Pool({
    connectionString,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalThis.__trustflowPrisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.__trustflowPgPool = pool;
  globalThis.__trustflowPrisma = prisma;
}
