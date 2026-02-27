# Test Database Setup

This directory contains the test database configuration and setup utilities for Vitest.

## Files

- **test-db.ts**: Core database utilities for test setup, cleanup, and teardown
- **vitest-setup.ts**: Global Vitest configuration that runs before/after tests
- **test-db.test.ts**: Tests to verify the database setup works correctly

## Setup Instructions

1. **Create .env.test file** in the project root:
   ```bash
   cp .env.test.example .env.test
   ```

2. **Update DATABASE_URL_TEST** with your test database credentials:
   ```
   DATABASE_URL_TEST="postgresql://user:password@localhost:5432/soma_test"
   ```

3. **Create the test database**:
   ```bash
   createdb soma_test
   ```

4. **Push the schema to test database**:
   ```bash
   DATABASE_URL=$DATABASE_URL_TEST pnpm run db:push
   ```

## Usage

The setup is automatically loaded by Vitest through `vitest.config.ts`. All tests will:

1. Connect to the test database before all tests run
2. Clean all data before each individual test
3. Disconnect and cleanup after all tests complete

### Writing Tests

Simply import the Prisma client in your tests:

```typescript
import { describe, it, expect } from "vitest";
import { getTestPrismaClient } from "../utils/setup/test-db";

describe("My Feature", () => {
  it("should work with database", async () => {
    const prisma = getTestPrismaClient();
    
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "hashed",
        cpf: "12345678900",
      },
    });
    
    expect(user).toBeDefined();
  });
});
```

## Functions

### getTestPrismaClient()
Returns the Prisma client instance configured for testing.

### setupTestDatabase()
Connects to the test database. Called automatically in `beforeAll`.

### cleanTestDatabase()
Deletes all data from all tables. Called automatically in `beforeEach`.

### teardownTestDatabase()
Disconnects from the database and closes connections. Called automatically in `afterAll`.
