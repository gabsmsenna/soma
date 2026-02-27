# Design Document: Comprehensive Test Suite

## Overview

This design document outlines the technical architecture for implementing a comprehensive test suite for the Soma application. The test suite will provide automated testing coverage across all layers of the application using Vitest as the testing framework.

The test suite addresses the need for reliable, maintainable automated tests that verify:
- Business logic correctness in the service layer
- Data validation in Zod schemas
- End-to-end request handling in API routes
- Error handling and RFC 9457 compliance
- Utility function behavior

The implementation will follow industry best practices for test organization, use property-based testing for validation schemas, and provide comprehensive mocking strategies for database operations.

## Architecture

### Testing Framework Stack

The test suite will use the following technology stack:

**Core Framework:**
- Vitest 2.x - Fast unit test framework with native ESM support
- @vitejs/plugin-react - React component testing support
- jsdom - DOM environment simulation for component tests

**Testing Utilities:**
- @vitest/ui - Interactive test UI (optional)
- vitest/coverage - Code coverage reporting
- fast-check - Property-based testing library for validation schemas

**Mocking Strategy:**
- vi.mock() for Prisma client mocking
- vi.fn() for function mocking (bcrypt, jsonwebtoken)
- Manual mocks in __mocks__ directory for complex dependencies

### Test Organization Structure

Tests will be co-located with source files using the `.test.ts` extension:

```
src/
├── services/
│   ├── auth.service.ts
│   ├── auth.service.test.ts
│   ├── operation.service.ts
│   ├── operation.service.test.ts
│   ├── project.service.ts
│   ├── project.service.test.ts
│   ├── creative.service.ts
│   └── creative.service.test.ts
├── dtos/
│   ├── auth.dto.ts
│   ├── auth.dto.test.ts
│   ├── operation.dto.ts
│   ├── operation.dto.test.ts
│   ├── project.dto.ts
│   ├── project.dto.test.ts
│   ├── creative.dto.ts
│   └── creative.dto.test.ts
├── lib/
│   ├── app-error.ts
│   ├── app-error.test.ts
│   ├── error-handler.ts
│   ├── error-handler.test.ts
│   ├── utils.ts
│   └── utils.test.ts
└── app/api/
    └── [route]/
        └── route.test.ts
```

### Configuration Architecture

**vitest.config.ts:**
- TypeScript path alias resolution (@/ imports)
- jsdom environment for DOM testing
- Coverage configuration with thresholds
- Test file pattern matching
- Global setup/teardown hooks

**Test Execution Modes:**
1. Single run: `vitest run` - CI/CD pipeline execution
2. Watch mode: `vitest` - Development with hot reload
3. Coverage mode: `vitest run --coverage` - Coverage reporting
4. Single file: `vitest run <file>` - Focused testing
5. Single test: `vitest run -t "<name>"` - Specific test execution

## Components and Interfaces

### 1. Vitest Configuration Module

**File:** `vitest.config.ts`

**Purpose:** Configure Vitest with TypeScript support, path aliases, and coverage settings.

**Interface:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.ts',
        '**/*.config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 2. Test Setup Module

**File:** `src/test/setup.ts`

**Purpose:** Global test configuration, mock setup, and cleanup utilities.

**Interface:**
```typescript
import { beforeEach, afterEach, vi } from 'vitest';

// Reset all mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Global test utilities
export const mockPrismaClient = () => {
  return {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    operation: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    project: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    creative: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
};
```

### 3. Service Test Modules

**Pattern:** Each service gets a corresponding test file with mocked dependencies.

**Example Interface (auth.service.test.ts):**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { mockPrismaClient } from '@/test/setup';

// Mock external dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: mockPrismaClient(),
}));

vi.mock('bcrypt', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(),
  verify: vi.fn(),
}));

describe('AuthService', () => {
  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 4. DTO Property Test Modules

**Pattern:** Each DTO schema gets property-based tests using fast-check.

**Example Interface (auth.dto.test.ts):**
```typescript
import { describe, it, expect } from 'vitest';
import { fc } from 'fast-check';
import { loginSchema, registerSchema } from './auth.dto';

describe('loginSchema', () => {
  it('should accept valid email addresses', () => {
    fc.assert(
      fc.property(fc.emailAddress(), (email) => {
        const result = loginSchema.safeParse({
          email,
          password: 'password123',
        });
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
```

### 5. API Route Test Modules

**Pattern:** Integration tests that simulate HTTP requests to API routes.

**Example Interface (route.test.ts):**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';

describe('POST /api/auth/register', () => {
  it('should return 201 with user data on successful registration', async () => {
    // Arrange
    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        cpf: '12345678900',
        password: 'password123',
      }),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(201);
  });
});
```

### 6. Error Handling Test Module

**File:** `src/lib/error-handler.test.ts`

**Purpose:** Verify RFC 9457 compliance and error transformation.

**Interface:**
```typescript
import { describe, it, expect } from 'vitest';
import { handleError } from './error-handler';
import { AppError } from './app-error';
import { problems } from './problem-registry';

describe('handleError', () => {
  it('should return RFC 9457 compliant response', async () => {
    // Arrange
    const error = problems.resourceNotFound('User not found');
    const request = new Request('http://localhost/api/users/123');

    // Act
    const response = await handleError(error, request);
    const body = await response.json();

    // Assert
    expect(response.headers.get('Content-Type')).toBe('application/problem+json');
    expect(body).toHaveProperty('type');
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('detail');
    expect(body).toHaveProperty('instance');
  });
});
```

### 7. Utility Test Module

**File:** `src/lib/utils.test.ts`

**Purpose:** Test utility functions like cn() and extractBearerToken().

**Interface:**
```typescript
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });
});
```

## Data Models

### Test Data Factories

To support consistent test data generation, we'll create factory functions:

**File:** `src/test/factories.ts`

```typescript
import { User, Operation, Project, Creative } from '@prisma/client';

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  cpf: '12345678900',
  password: 'hashed-password',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockOperation = (overrides?: Partial<Operation>): Operation => ({
  id: 'op-123',
  name: 'Test Operation',
  userId: 'user-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockProject = (overrides?: Partial<Project>): Project => ({
  id: 'proj-123',
  name: 'Test Project',
  operationId: 'op-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockCreative = (overrides?: Partial<Creative>): Creative => ({
  id: 'creative-123',
  name: 'Test Creative',
  projectId: 'proj-123',
  investment: 1000.00,
  result: 5000.00,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
```

### Mock Prisma Client Type

```typescript
export type MockPrismaClient = {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  operation: {
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  project: {
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  creative: {
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The test suite itself has correctness properties that ensure validation schemas and data transformations work correctly across all inputs. These properties will be implemented using property-based testing with the fast-check library.

### Property 1: Valid Email Acceptance

*For any* valid email address string, parsing with loginSchema should succeed and return the email unchanged.

**Validates: Requirements 3.1**

### Property 2: Invalid Email Rejection

*For any* invalid email string (missing @, invalid domain, etc.), parsing with loginSchema should fail and return a validation error indicating the email is invalid.

**Validates: Requirements 3.2**

### Property 3: Valid CPF Acceptance

*For any* valid CPF string (11 digits with correct check digits), parsing with registerSchema should succeed and accept the CPF.

**Validates: Requirements 3.3**

### Property 4: Invalid CPF Rejection

*For any* invalid CPF string (wrong length, invalid check digits, all same digits), parsing with registerSchema should fail and return a validation error indicating the CPF is invalid.

**Validates: Requirements 3.4**

### Property 5: Valid Decimal Acceptance

*For any* decimal value within the valid range (0 to 999999999.99), parsing with createCreativeSchema should succeed and preserve the decimal precision.

**Validates: Requirements 3.5**

### Property 6: Valid Pagination Acceptance

*For any* pagination parameters where page >= 1 and limit is between 1 and 100, parsing with paginationSchema should succeed and return the parameters unchanged.

**Validates: Requirements 3.6**

### Property 7: Invalid Pagination Rejection

*For any* pagination parameters where page < 1 or limit > 100, parsing with paginationSchema should fail and return appropriate validation errors.

**Validates: Requirements 3.7**

### Property 8: RegisterDto JSON Round-Trip

*For any* valid RegisterDto object, serializing to JSON and then deserializing should produce an object equivalent to the original (same name, email, cpf, password).

**Validates: Requirements 4.1**

### Property 9: Decimal Transform Round-Trip

*For any* valid decimal value, transforming with decimalTransform (string to Decimal) and then converting back to string should preserve the original value.

**Validates: Requirements 4.2**

### Property 10: JWT Token Round-Trip

*For any* valid payload object, generating a JWT token with auth.service and then verifying it should return a payload equivalent to the original (same userId, email, etc.).

**Validates: Requirements 4.3**

## Error Handling

The test suite will handle errors in the following ways:

### Test Execution Errors

**Syntax Errors:**
- Vitest will report syntax errors with file location and line number
- Tests will fail fast on syntax errors
- Error messages will include the problematic code snippet

**Runtime Errors:**
- Uncaught exceptions in tests will be captured by Vitest
- Stack traces will be displayed with source maps for TypeScript
- Tests will be marked as failed with error details

**Assertion Failures:**
- Failed assertions will display expected vs actual values
- Vitest will show the assertion location in the test file
- Diff output will be provided for complex objects

### Mock Configuration Errors

**Missing Mock Setup:**
- If a mock is not configured, tests will throw errors indicating which mock is missing
- Setup functions will validate that required mocks are present
- Clear error messages will guide developers to fix mock configuration

**Mock Return Value Errors:**
- If a mock returns unexpected data types, TypeScript will catch type errors
- Runtime type mismatches will cause test failures with descriptive messages
- Mock factories will validate return values match expected types

### Test Isolation Failures

**Side Effect Detection:**
- Global state changes between tests will be detected by setup/teardown hooks
- Mocks that aren't reset will be flagged in test output
- beforeEach/afterEach hooks will ensure clean state for each test

**Database Mock Leaks:**
- Mock call history will be cleared between tests
- Assertions will verify mocks are called with expected parameters
- Test failures will indicate if previous test state affected current test

### Coverage Reporting Errors

**Missing Coverage:**
- Coverage reports will highlight untested code paths
- Threshold violations will cause CI/CD pipeline failures
- Reports will identify specific functions/branches needing tests

**Configuration Errors:**
- Invalid coverage configuration will be caught during test setup
- Vitest will report configuration errors with helpful messages
- Coverage provider errors will be logged with troubleshooting guidance

## Testing Strategy

The comprehensive test suite will employ a dual testing approach combining unit tests and property-based tests to ensure thorough coverage and correctness verification.

### Unit Testing Approach

**Purpose:** Verify specific examples, edge cases, and integration points between components.

**Scope:**
- Service layer business logic (auth, operations, projects, creatives)
- API route handlers and request/response handling
- Error handling and RFC 9457 compliance
- Utility functions (cn, extractBearerToken)
- Authentication middleware

**Testing Framework:** Vitest with jsdom environment

**Key Principles:**
- Focus on concrete examples that demonstrate correct behavior
- Test integration points between components (service → Prisma, API → service)
- Verify edge cases and error conditions explicitly
- Use mocks to isolate units under test
- Follow Arrange-Act-Assert pattern for clarity

**Example Unit Tests:**
- AuthService.register creates user with hashed password
- POST /api/auth/login returns 401 for invalid credentials
- handleError returns RFC 9457 compliant JSON response
- cn() merges conditional class names correctly
- authenticate() throws invalidToken for missing Authorization header

### Property-Based Testing Approach

**Purpose:** Verify universal properties hold across all possible inputs through randomized testing.

**Scope:**
- Zod validation schemas (email, CPF, decimals, pagination)
- Data transformation round-trips (JSON serialization, JWT encoding, decimal transforms)
- Input validation boundaries and edge cases

**Testing Library:** fast-check for property-based test generation

**Configuration:**
- Minimum 100 iterations per property test (configurable via numRuns)
- Shrinking enabled to find minimal failing examples
- Seed-based reproduction for debugging failures

**Key Principles:**
- Each correctness property maps to exactly one property-based test
- Tests generate random inputs within specified constraints
- Properties verify invariants that must hold for all inputs
- Tag each test with feature name and property number for traceability

**Property Test Tag Format:**
```typescript
// Feature: comprehensive-test-suite, Property 1: Valid Email Acceptance
it('should accept all valid email addresses', () => {
  fc.assert(
    fc.property(fc.emailAddress(), (email) => {
      // test implementation
    }),
    { numRuns: 100 }
  );
});
```

### Test Organization

**File Structure:**
- Co-locate test files with source files using `.test.ts` extension
- Group related tests using `describe` blocks
- Use descriptive test names that explain the scenario being tested

**Test Lifecycle:**
- `beforeEach`: Reset mocks, clear state
- `afterEach`: Restore mocks, cleanup resources
- Global setup in `src/test/setup.ts` for shared configuration

### Mocking Strategy

**Prisma Client:**
- Mock entire Prisma client using vi.mock()
- Provide mock implementations for CRUD operations
- Configure return values per test case
- Verify correct parameters passed to Prisma methods

**External Libraries:**
- Mock bcrypt for password hashing (deterministic test data)
- Mock jsonwebtoken for JWT operations (controlled token generation)
- Mock Next.js request/response objects for API route tests

**Mock Factories:**
- Create reusable factory functions for test data (users, operations, projects, creatives)
- Support partial overrides for flexibility
- Ensure type safety with TypeScript

### Coverage Goals

**Target Coverage:**
- Line coverage: 80% minimum
- Branch coverage: 75% minimum
- Function coverage: 85% minimum

**Exclusions:**
- Test files (*.test.ts)
- Configuration files (*.config.ts)
- Type definition files (*.d.ts)
- Generated Prisma client

**Coverage Reporting:**
- Generate HTML reports for detailed analysis
- Include JSON reports for CI/CD integration
- Display text summary in terminal after test runs

### Test Execution Workflow

**Development:**
1. Run tests in watch mode: `vitest`
2. Tests re-run automatically on file changes
3. Focus on specific tests using `.only()` or `-t` flag
4. Debug failing tests with `console.log` or debugger

**CI/CD Pipeline:**
1. Run all tests once: `vitest run`
2. Generate coverage report: `vitest run --coverage`
3. Fail build if coverage thresholds not met
4. Fail build if any tests fail

**Pre-Commit:**
1. Run tests for changed files
2. Verify no test failures
3. Check code formatting with Biome
4. Lint code with Biome

### Test Maintenance

**Adding New Tests:**
- Create test file adjacent to source file
- Follow existing test patterns and structure
- Include both unit tests and property tests where applicable
- Update coverage thresholds if needed

**Updating Existing Tests:**
- Modify tests when requirements change
- Ensure backward compatibility where possible
- Update mock data to reflect schema changes
- Re-run full test suite to catch regressions

**Debugging Test Failures:**
- Check mock configuration and return values
- Verify test isolation (no side effects from other tests)
- Use Vitest UI for interactive debugging
- Review property test shrinking output for minimal failing case

