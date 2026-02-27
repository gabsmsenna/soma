# AGENTS.md - Agentic Coding Guidelines

This document provides guidelines for agentic coding agents operating in this repository.

## Project Overview

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Linter/Formatter**: Biome 2.2.0
- **Database**: PostgreSQL with Prisma ORM
- **UI**: shadcn/ui + Tailwind CSS v4
- **Validation**: Zod

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

### Testing (Recommended)
This project does not currently have a test framework. To add tests:
```bash
pnpm install -D vitest @vitejs/plugin-react jsdom
```

Run a single test file:
```bash
npx vitest run src/services/auth.service.test.ts
```

Run a single test:
```bash
npx vitest run -t "test name" src/services/auth.service.test.ts
```

## Code Style Guidelines

### Formatting (Biome)
- **Indent**: 2 spaces (no tabs)
- **Line endings**: LF (Git default)
- Biome is configured in `biome.json` at project root

### TypeScript
- **Strict mode**: Enabled in `tsconfig.json`
- Always define return types for functions when obvious
- Use `type` for simple type aliases, `interface` for object shapes
- Avoid `any`, use `unknown` when type is truly unknown

### Imports
- Use path alias `@/` for all internal imports (configured in tsconfig.json)
- Order imports per Biome auto-organize:
  1. External libraries (React, Next.js, etc.)
  2. Internal imports (`@/` paths)
  3. Relative imports (`./` or `../`)

### Naming Conventions
- **Files**: kebab-case (e.g., `auth.service.ts`)
- **Components/Classes**: PascalCase (e.g., `AuthService`)
- **Functions/Variables**: camelCase (e.g., `generateAuthToken`)
- **Constants**: SCREAMING_SNAKE_CASE for env vars

### Project Structure
```
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
- **`AppError`** (`src/lib/app-error.ts`): Custom exception class carrying `type`, `title`, `status`, `detail`, and optional `extensions`
- **`problems`** (`src/lib/problem-registry.ts`): Factory functions to create `AppError` instances for each domain error
- **`handleError`** (`src/lib/error-handler.ts`): Centralized handler that converts `AppError` to `application/problem+json` responses

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
  "type": "https://soma.api/problems/resource-not-found",
  "title": "Recurso não encontrado",
  "status": 404,
  "detail": "Projeto não encontrado",
  "instance": "/api/operations/abc/projects/xyz"
}
```

### Database (Prisma)
- Use Prisma client from `@/lib/prisma` (singleton pattern)
- Define models in `prisma/schema.prisma`
- Use services layer for all DB operations
- Follow Prisma naming: singular model names, PascalCase

### UI Components

#### shadcn/ui
Add components via CLI:
```bash
npx shadcn@latest add button
```
Components are installed in `src/components/ui/`

#### Tailwind CSS
- Use `cn()` utility from `@/lib/utils` for class merging
- Base color: `zinc`
- All colors should support dark mode via `dark:` prefix

### Git Conventions
- Commit messages: concise, imperative mood
- Branch naming: `feature/`, `fix/`, `refactor/` prefixes
- Run `pnpm run lint` and `pnpm run format` before committing

### Environment Variables
- Never commit secrets to repository
- Use `.env` for local development (gitignored)
- Required vars: `DATABASE_URL`, `DIRECT_URL` (for Prisma), `AUTH_SECRET` (JWT)

## Additional Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Biome Docs](https://biomejs.dev)
- [Prisma Docs](https://prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Zod Docs](https://zod.dev)
