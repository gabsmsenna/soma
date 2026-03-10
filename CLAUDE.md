# CLAUDE.md - Agentic Coding Guidelines

This document provides guidelines for agentic coding agents operating in this repository.

## Project Overview

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Linter/Formatter**: Biome 2.2.0
- **Database**: PostgreSQL with Prisma ORM
- **UI**: shadcn/ui + Tailwind CSS v4
- **Validation**: Zod

## Test-Driven Development (TDD) Protocol

You **MUST** strictly follow the Test-Driven Development (TDD) methodology for all feature implementations, refactors, and bug fixes. Do not write production code before writing the corresponding test.



### The Red-Green-Refactor Cycle
1. **🔴 RED (Write Test):** Write a failing test for the specific behavior, validation, or function you are about to implement. 
2. **🟢 GREEN (Write Code):** Write the *minimum* amount of production code required to make the test pass. Do not add speculative features or over-engineer at this stage.
3. **🔵 REFACTOR (Improve Code):** Refactor the implementation for better readability, performance, and adherence to the guidelines below, ensuring the tests remain green.

### Rules for AI TDD Execution
- Always propose the test code first.
- When writing tests for services or API routes, ensure you are testing the standard RFC 9457 `AppError` exceptions (e.g., expecting a 404 or 401 error).
- Only provide the implementation code *after* generating the test.

## Code Review, Architecture & Clean Code Guidelines

As an AI assistant and code reviewer, your primary objective is to maintain a pristine, scalable, and highly performant Next.js 16 codebase. You must rigorously evaluate all code against Clean Code standards, SOLID principles, and modern React/Next.js paradigms. 

### 1. Next.js 16 & React Paradigms
* **Default to Server Components (RSC):** All components must be Server Components by default to optimize performance and SEO. Only use the `"use client"` directive at the very top of the file when interactivity (React hooks like `useState`/`useEffect`, event listeners like `onClick`, or browser-only APIs) is strictly required.
* **Data Fetching and Mutation Pattern:** * **Mutations:** Use **Server Actions strictly and exclusively for data mutation** (create, update, delete). Keep them entirely decoupled from UI components, placing them in dedicated `actions/` or `services/` directories.
  * **Fetching:** It is strictly forbidden to use Server Actions for data fetching. Always prefer fetching data directly within Server Components using standard async functions. If client-side fetching is mandatory, build and utilize dedicated **API Routes (Route Handlers)** optimized for `GET` methods.
* **Package Management:** Always use `pnpm` for any dependency additions, removals, or script executions. Never default to `npm` or `yarn`.

### 2. SOLID Principles Enforcement
* **Single Responsibility Principle (SRP):** Components, functions, and Server Actions must do exactly one thing. Extract complex business logic into pure TypeScript functions or custom hooks.
* **Open/Closed Principle (OCP):** Design UI components to be open for extension but closed for modification. Use composition, `children` props, and polymorphic components over adding endless boolean flags.
* **Liskov Substitution Principle (LSP):** Ensure TypeScript interfaces and types are strictly adhered to. Extended interfaces must not break the base types' expected behavior.
* **Interface Segregation Principle (ISP):** Avoid "fat" interfaces. Pick or omit fields, or define tightly scoped prop interfaces for each component instead of passing massive data objects.
* **Dependency Inversion Principle (DIP):** Abstract database access (like Prisma) behind repository or service layers, passing them as dependencies where possible. High-level modules should not depend on direct database calls.

### 3. Mandatory Clean Code Principles
These rules address recurring violations in this codebase and are **mandatory**:

* **Meaningful Naming:** Use descriptive, intent-revealing names (e.g., `isUserAuthenticated` instead of `auth`).
* **Error Handling:** Never swallow errors. Use standard try/catch blocks and rely on the project's API Problem Details (RFC 9457) standard via the `AppError` and `problems` registry. Implement Next.js `error.tsx` boundaries for UI degradation.
* **Date Calculations (Use `date-fns`):** Always use `date-fns` functions for any date arithmetic. Never use raw millisecond math (e.g., `Date.getTime()`, division by `86400000`).
* **Aggregation Before Derived Computation:** When computing derived values (trends, percentages) from a list of entries, **always aggregate first** into a `Map`, then compute. Never compare individual raw entries against an aggregated total.
* **Data Consolidation (One Output Row Per Entity):** When multiple DB rows represent separate events for the same logical entity, consolidate them into a **single output row** using a `Set` to track seen IDs and pre-aggregated `Map`s for summed values before returning from a service.
* **DRY (Extract Shared Logic):** When two or more code paths perform the same initialization or lookup pattern, extract it into a named helper function. Do not duplicate logic inline.
* **Immutability & Pure Functions:** Favor immutable data structures and pure functions, especially when transforming backend data for the client.

## Commands

### Development
```bash
pnpm run dev        # Start development server
pnpm run build      # Production build
pnpm run start      # Start production server

```

### Linting & Formatting

```bash
pnpm run lint       # Run Biome linter
pnpm run format     # Format code with Biome (writes in-place)

```

### Database

```bash
pnpm run db:generate    # Generate Prisma client
pnpm run db:push       # Push schema to database
pnpm run db:migrate    # Run migrations (creates migration named "init")
pnpm run db:studio     # Open Prisma Studio

```

### Testing (Required per TDD)

Run a single test file:

```bash
pnpm vitest run src/services/auth.service.test.ts

```

Run a single test by name:

```bash
pnpm vitest run -t "test name" src/services/auth.service.test.ts

```

#### Date Calculations — use `date-fns`, never raw milliseconds

Always use `date-fns` functions for any date arithmetic. Raw millisecond math (`Date.getTime()`, division by `86400000`) is error-prone and calendar-unaware (DST, leap years).

```typescript
// FORBIDDEN
const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
const prevStart = new Date(startDate.getTime() - daysDiff * 86400000);

// CORRECT
import { differenceInDays, subDays } from "date-fns";
const daysDiff = differenceInDays(endDate, startDate);
const prevStart = subDays(startDate, daysDiff);
```

#### Aggregation Before Derived Computation

When computing derived values (trends, percentages, comparisons) from a list of entries that may have multiple rows per entity, **always aggregate first** into a `Map`, then compute. Never compare individual raw entries against an aggregated total.

```typescript
// FORBIDDEN — compares each entry's value against an aggregated previous total
for (const entry of currentEntries) {
  const trend = entry.totalProfit > prevTotal ? "ascensao" : "queda"; // WRONG
}

// CORRECT — aggregate first, then compare aggregated vs aggregated
const currentTotals = aggregateByCreative(currentEntries, (e) => e.totalProfit);
const prevTotals = aggregateByCreative(previousEntries, (e) => e.totalProfit);
for (const [creativeId, currentTotal] of currentTotals) {
  const trend = computeTrend(currentTotal, prevTotals.get(creativeId));
}
```

#### DRY — Extract Shared Logic Into Helpers

When two or more code paths perform the same initialization or lookup pattern, extract it into a named helper function. Do not duplicate the logic inline.

```typescript
// FORBIDDEN — duplicate group initialization in two places
// ...in paid loop: if (!map.has(id)) { map.set(id, { operationId, ... }) }
// ...in unpaid loop: if (!map.has(id)) { map.set(id, { operationId, ... }) }

// CORRECT — single helper used in both places
function getOrCreateGroup(map, operation) { ... }
```

#### Data Consolidation — One Output Row Per Entity

When multiple DB rows represent separate events for the same logical entity (e.g., multiple `ProfitEntry` rows for one `Creative`), consolidate them into a **single output row** before returning from a service. Use a `Set` to track seen IDs and pre-aggregated `Map`s for summed values.

```typescript
// FORBIDDEN — pushes one output row per DB entry, causing duplicates in the UI
for (const entry of currentEntries) {
  group.creatives.push({ totalProfit: entry.totalProfit, ... });
}

// CORRECT — consolidate using Set + pre-aggregated Maps
const seen = new Set<string>();
for (const entry of currentEntries) {
  if (seen.has(entry.creativeId)) continue;
  seen.add(entry.creativeId);
  group.creatives.push({
    totalProfit: aggregatedTotals.get(entry.creativeId) ?? 0,
    ...
  });
}
```

### Formatting (Biome)

* **Indent**: 2 spaces (no tabs)
* **Line endings**: LF (Git default)
* Biome is configured in `biome.json` at project root

### TypeScript

* **Strict mode**: Enabled in `tsconfig.json`
* Always define return types for functions when obvious
* Use `type` for simple type aliases, `interface` for object shapes
* Avoid `any`, use `unknown` when type is truly unknown

### Imports

* Use path alias `@/` for all internal imports (configured in tsconfig.json)
* Order imports per Biome auto-organize:
1. External libraries (React, Next.js, etc.)
2. Internal imports (`@/` paths)
3. Relative imports (`./` or `../`)



### Naming Conventions

* **Files**: kebab-case (e.g., `auth.service.ts`)
* **Components/Classes**: PascalCase (e.g., `AuthService`)
* **Functions/Variables**: camelCase (e.g., `generateAuthToken`)
* **Constants**: SCREAMING_SNAKE_CASE for env vars

### Project Structure

```text
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (auth/login, auth/register)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/ui/         # shadcn/ui components
├── dtos/                  # Zod validation schemas
├── lib/                   # Utilities (prisma.ts, utils.ts)
└── services/              # Business logic (static methods)

```

### Validation (Zod)

Define Zod schemas in `src/dtos/` files. Export both schema and inferred type:

```typescript
export const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});
export type LoginDto = z.infer<typeof loginSchema>;

```

### Error Handling

This project uses **API Problem Details (RFC 9457)** for standardized error responses.

#### Architecture

* **`AppError`** (`src/lib/app-error.ts`): Custom exception class carrying `type`, `title`, `status`, `detail`, and optional `extensions`
* **`problems`** (`src/lib/problem-registry.ts`): Factory functions to create `AppError` instances for each domain error
* **`handleError`** (`src/lib/error-handler.ts`): Centralized handler that converts `AppError` to `application/problem+json` responses

#### Services

Throw errors using factory functions from `problems`:

```typescript
import { problems } from "@/lib/problem-registry";

// 404
throw problems.resourceNotFound("Projeto não encontrado");
// 401
throw problems.invalidCredentials();
throw problems.invalidToken();
// 409
throw problems.emailAlreadyExists();

```

#### API Routes

Use `handleError(error, request)` in catch blocks:

```typescript
import { handleError } from "@/lib/error-handler";

export async function GET(request: Request) {
  try {
    // ...
  } catch (error) {
    return handleError(error, request);
  }
}

```

#### Response Format

All errors return `Content-Type: application/problem+json`:

```json
{
  "type": "[https://soma.api/problems/resource-not-found](https://soma.api/problems/resource-not-found)",
  "title": "Recurso não encontrado",
  "status": 404,
  "detail": "Projeto não encontrado",
  "instance": "/api/operations/abc/projects/xyz"
}

```

### Database (Prisma)

* Use Prisma client from `@/lib/prisma` (singleton pattern)
* Define models in `prisma/schema.prisma`
* Use services layer for all DB operations
* Follow Prisma naming: singular model names, PascalCase

### UI Components
Keep components as Server Components by default. Only add "use client" directive at the very top of the file when using React hooks (useState, useEffect), event listeners (onClick), or browser-only APIs

#### shadcn/ui

Add components via CLI:

```bash
pnpm dlx shadcn@latest add button

```

Components are installed in `src/components/ui/`

#### Tailwind CSS

* Use `cn()` utility from `@/lib/utils` for class merging
* Base color: `zinc`
* All colors should support dark mode via `dark:` prefix

## Workflow & Git Rules

Whenever you successfully complete a requested task, implement a feature, or fix a bug, you must automatically execute the following version control steps before asking for the next prompt:

1. **Review Changes:** Run `git status` and `git diff` to analyze the exact modifications made.
2. **Stage Files:** Stage the relevant modified or new files using `git add <files>` or `git add .` if appropriate.
3. **Commit:** Create a commit using the Conventional Commits specification. 
   - Use appropriate prefixes (e.g., `feat:`, `fix:`, `refactor:`, `chore:`).
   - Write a concise, clear imperative summary of the changes.
   - Execute the commit command (e.g., `git commit -m "feat: add user authentication"`).
4. **Report:** Briefly confirm to the user that the changes have been committed and display the commit message used.

### Git Conventions

* Commit messages: concise, imperative mood
* Branch naming: `feature/`, `fix/`, `refactor/` prefixes
* Run `pnpm run lint` and `pnpm run format` before committing

### Environment Variables

* Never commit secrets to repository
* Use `.env` for local development (gitignored)
* Required vars: `DATABASE_URL`, `DIRECT_URL` (for Prisma), `AUTH_SECRET` (JWT)

## Database Environment Constraints

> **Important:** There is **no local PostgreSQL instance** available on this machine due to hardware limitations. The only database is a **Supabase cloud instance** configured via environment variables in `.env` (development) and `.env.test` (tests).

### Supabase Connection Pooler Notes

Supabase exposes two pooler endpoints:

| Mode | Port | Used by |
|------|------|---------|
| Session pooler | 5432 | `pg.Pool` in `@/lib/prisma` and `test-db.ts` |
| Transaction pooler | 6543 | Prisma CLI only (`db:push`, `db:generate`) |

**Critical rules:**
- `pg.Pool` (used by `@prisma/adapter-pg`) **must connect to port 5432** (session pooler). Port 6543 (transaction pooler) causes TCP timeout when used with `pg.Pool` directly.
- Supabase free tier session pooler has a limited number of concurrent sessions (~10). Running too many pools simultaneously causes `MaxClientsInSessionMode` errors.
- In `.env.test`, keep `DATABASE_URL` set to the port-5432 session-pooler URL. Leave `DIRECT_URL` unset so `@/lib/prisma` falls through to `DATABASE_URL`.
- To stay within session limits during test runs: `@/lib/prisma` uses `max: 3` in test mode (`NODE_ENV=test`), `test-db.ts` uses `max: 3`, and `vitest-setup.ts` disconnects `globalThis.prismaGlobal` in `afterAll` so sessions are released before the next test file starts.

## Additional Resources

* [Next.js Docs](https://nextjs.org/docs)
* [Biome Docs](https://biomejs.dev)
* [Prisma Docs](https://prisma.io/docs)
* [shadcn/ui](https://ui.shadcn.com)
* [Zod Docs](https://zod.dev)
