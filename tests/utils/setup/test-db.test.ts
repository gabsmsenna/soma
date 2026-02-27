import { describe, expect, it } from "vitest";
import {
  cleanTestDatabase,
  getTestPrismaClient,
  setupTestDatabase,
  teardownTestDatabase,
} from "./test-db";

describe("Test Database Setup", () => {
  it("should connect to test database", async () => {
    await setupTestDatabase();
    const prisma = getTestPrismaClient();
    expect(prisma).toBeDefined();
  });

  it("should clean test database", async () => {
    const prisma = getTestPrismaClient();

    // Create test data
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        cpf: "12345678900",
      },
    });

    expect(user).toBeDefined();

    // Clean database
    await cleanTestDatabase();

    // Verify data is deleted
    const users = await prisma.user.findMany();
    expect(users).toHaveLength(0);
  });

  it("should teardown test database", async () => {
    await teardownTestDatabase();
    // After teardown, getting client should create a new instance
    const prisma = getTestPrismaClient();
    expect(prisma).toBeDefined();
  });
});
