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

Or run a single test:
```bash
npx vitest run -t "test name" src/services/auth.service.test.ts
```

## Code Style Guidelines

### Formatting (Biome)
- **Indent**: 2 spaces (no tabs)
- **Indent style**: space
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
- Example:
```typescript
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateAuthToken } from "@/lib/generate-auth-token";
import prisma from "@/lib/prisma";
```

### Naming Conventions
- **Files**: kebab-case (e.g., `auth.service.ts`, `login.dto.ts`)
- **Components/Classes**: PascalCase (e.g., `AuthService`, `RootLayout`)
- **Functions/Variables**: camelCase (e.g., `generateAuthToken`, `loginSchema`)
- **Constants**: SCREAMING_SNAKE_CASE for env vars, camelCase for others

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/
│   │       ├── login/route.ts
│   │       └── register/route.ts
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/                # shadcn/ui components
├── dtos/                  # Zod validation schemas
│   ├── login.dto.ts
│   └── register.dto.ts
├── lib/                   # Utilities and configs
│   ├── prisma.ts          # Prisma client instance
│   ├── utils.ts           # cn() utility
│   └── generate-auth-token.ts
└── services/              # Business logic (static methods)
    └── auth.service.ts
```

### Validation (Zod)
- Define Zod schemas in `src/dtos/` files
- Export both the schema and inferred TypeScript type
- Example from `src/dtos/login.dto.ts`:
```typescript
import z from "zod";

export const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export type LoginDto = z.infer<typeof loginSchema>;
```

### Error Handling

#### API Routes
- Wrap logic in try/catch blocks
- Return appropriate HTTP status codes:
  - `400` for validation errors
  - `401` for unauthorized
  - `409` for conflicts
  - `500` for internal errors
- Log errors with `console.error`
- Example:
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = loginSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }
    const { user, token } = await AuthService.login(parsedData.data);
    return NextResponse.json({ user, token }, { status: 200 });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
```

#### Services (Business Logic)
- Use static methods on service classes
- Throw errors with meaningful messages
- Return clean data (strip passwords)
```typescript
export class AuthService {
  static async login({ email, password }: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }
    // ... validation logic
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}
```

### Database (Prisma)

- Use Prisma client from `@/lib/prisma` (singleton pattern)
- Define models in `prisma/schema.prisma`
- Use services layer for all DB operations
- Follow Prisma naming: singular model names, PascalCase

### UI Components

#### shadcn/ui
- Add components via CLI:
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```
- Components are installed in `src/components/ui/`

#### Tailwind CSS
- Use `cn()` utility from `@/lib/utils` for class merging:
```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-class", condition && "conditional-class")} />
```
- Base color: `zinc`
- All colors should support dark mode via `dark:` prefix

### Git Conventions
- Commit messages: concise, imperative mood
- Branch naming: `feature/`, `fix/`, `refactor/` prefixes
- Run `pnpm run lint` and `pnpm run format` before committing

### Environment Variables
- Never commit secrets to repository
- Use `.env` for local development (gitignored)
- Required vars: `DATABASE_URL`, `DIRECT_URL` (for Prisma)
- JWT secret: `AUTH_SECRET`

## Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Biome Docs](https://biomejs.dev)
- [Prisma Docs](https://prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Zod Docs](https://zod.dev)
