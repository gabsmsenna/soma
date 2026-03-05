import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as CreativeService from "@/services/creative.service";
import {
  type createMockPrismaClient,
  mockPrismaCount,
  mockPrismaFindMany,
} from "../../utils/mocks/prisma.mock";

vi.mock("@/lib/prisma", async () => {
  const { createMockPrismaClient } = await import(
    "../../utils/mocks/prisma.mock"
  );
  return {
    default: createMockPrismaClient(),
  };
});

const prisma = await import("@/lib/prisma");
const mockPrisma = prisma.default as unknown as ReturnType<
  typeof createMockPrismaClient
>;

describe("CreativeService.findAllByUserId", () => {
  const userId = "user-123";
  const operationId = "operation-456";

  const mockCreative = {
    id: "creative-1",
    name: "Test Creative",
    operationId,
    totalProfit: new Prisma.Decimal(1000),
    freelancerCut: new Prisma.Decimal(100),
    isActive: true,
    isPaid: false,
    paidAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    operation: {
      id: operationId,
      name: "Test Operation",
      freelancerCutPercentage: new Prisma.Decimal(10),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated creatives for a user", async () => {
    mockPrisma.creative.findMany = mockPrismaFindMany([mockCreative]);
    mockPrisma.creative.count = mockPrismaCount(1);

    const result = await CreativeService.findAllByUserId(userId, 1, 12);

    expect(result.data).toHaveLength(1);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 12,
      total: 1,
      totalPages: 1,
    });
    expect(mockPrisma.creative.findMany).toHaveBeenCalledWith({
      where: { operation: { userId }, isActive: true },
      include: { operation: true },
      skip: 0,
      take: 12,
      orderBy: { createdAt: "desc" },
    });
  });

  it("filters by search term (case-insensitive)", async () => {
    mockPrisma.creative.findMany = mockPrismaFindMany([mockCreative]);
    mockPrisma.creative.count = mockPrismaCount(1);

    await CreativeService.findAllByUserId(userId, 1, 12, "banner");

    expect(mockPrisma.creative.findMany).toHaveBeenCalledWith({
      where: {
        operation: { userId },
        name: { contains: "banner", mode: "insensitive" },
        isActive: true,
      },
      include: { operation: true },
      skip: 0,
      take: 12,
      orderBy: { createdAt: "desc" },
    });
  });

  it("calculates correct skip for page 2", async () => {
    mockPrisma.creative.findMany = mockPrismaFindMany([]);
    mockPrisma.creative.count = mockPrismaCount(20);

    await CreativeService.findAllByUserId(userId, 2, 12);

    expect(mockPrisma.creative.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 12, take: 12 }),
    );
  });

  it("returns correct totalPages", async () => {
    mockPrisma.creative.findMany = mockPrismaFindMany([]);
    mockPrisma.creative.count = mockPrismaCount(25);

    const result = await CreativeService.findAllByUserId(userId, 1, 12);

    expect(result.pagination.totalPages).toBe(3);
  });
});
