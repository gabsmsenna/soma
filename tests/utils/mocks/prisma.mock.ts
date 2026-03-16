import type { PrismaClient } from "@prisma/client";
import { vi } from "vitest";

export type MockPrismaClient = {
  [K in keyof PrismaClient]: PrismaClient[K] extends object
    ? {
        // biome-ignore lint/complexity/noBannedTypes: Prisma client methods are functions
        [M in keyof PrismaClient[K]]: PrismaClient[K][M] extends Function
          ? ReturnType<typeof vi.fn>
          : PrismaClient[K][M];
      }
    : PrismaClient[K];
};

export function createMockPrismaClient(): MockPrismaClient {
  return {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    operation: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    creative: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    profitEntry: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
    profitLog: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
  } as unknown as MockPrismaClient;
}

export function mockPrismaFindUnique<T>(data: T | null) {
  return vi.fn().mockResolvedValue(data);
}

export function mockPrismaFindFirst<T>(data: T | null) {
  return vi.fn().mockResolvedValue(data);
}

export function mockPrismaFindMany<T>(data: T[]) {
  return vi.fn().mockResolvedValue(data);
}

export function mockPrismaCreate<T>(data: T) {
  return vi.fn().mockResolvedValue(data);
}

export function mockPrismaUpdate<T>(data: T) {
  return vi.fn().mockResolvedValue(data);
}

export function mockPrismaDelete<T>(data: T) {
  return vi.fn().mockResolvedValue(data);
}

export function mockPrismaCount(count: number) {
  return vi.fn().mockResolvedValue(count);
}
