import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

let testPrisma: PrismaClient | null = null;
let testPool: Pool | null = null;

/**
 * Get or create a Prisma client instance for testing
 * Uses DATABASE_URL_TEST environment variable
 */
export function getTestPrismaClient(): PrismaClient {
  if (testPrisma) {
    return testPrisma;
  }

  const connectionString = process.env.DATABASE_URL_TEST;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL_TEST environment variable is not set. Please create a .env.test file.",
    );
  }

  const parsedUrl = new URL(connectionString);
  testPool = new Pool({
    user: parsedUrl.username,
    password: parsedUrl.password,
    host: parsedUrl.hostname,
    port: parseInt(parsedUrl.port || "5432", 10),
    database: parsedUrl.pathname.slice(1),
  });

  const adapter = new PrismaPg(testPool);
  testPrisma = new PrismaClient({ adapter });

  return testPrisma;
}

/**
 * Setup test database - ensures connection is ready
 */
export async function setupTestDatabase(): Promise<void> {
  const prisma = getTestPrismaClient();
  await prisma.$connect();
}

/**
 * Clean all data from test database tables
 * Deletes in correct order to respect foreign key constraints
 */
export async function cleanTestDatabase(): Promise<void> {
  const prisma = getTestPrismaClient();

  // Delete in order: child tables first, then parent tables
  await prisma.creative.deleteMany();
  await prisma.project.deleteMany();
  await prisma.operation.deleteMany();
  await prisma.user.deleteMany();
}

/**
 * Teardown test database - closes connections and cleans up
 */
export async function teardownTestDatabase(): Promise<void> {
  if (testPrisma) {
    await testPrisma.$disconnect();
    testPrisma = null;
  }
}
