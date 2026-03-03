# AGENTS.md - Agentic Coding Guidelines

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

## Code Style Guidelines

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
