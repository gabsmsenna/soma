import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock next/cache revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock session
vi.mock("@/lib/session", () => ({
  getServerSession: vi.fn(),
}));

// Mock creative service
vi.mock("@/services/creative.service", () => ({
  create: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  deleteCreative: vi.fn(),
  registerProfit: vi.fn(),
}));

// Mock operation service
vi.mock("@/services/operation.service", () => ({
  verifyOperationOwnership: vi.fn(),
}));

describe("criativos/actions", () => {
  const userId = "user-123";
  const operationId = "op-1";
  const creativeId = "creative-789";

  const mockSession = { userId, email: "test@test.com" };

  const mockCreativeFromDB = {
    id: creativeId,
    name: "Test Creative",
    operationId,
    totalProfit: new Prisma.Decimal(1000),
    freelancerCut: new Prisma.Decimal(100),
    isActive: true,
    isPaid: false,
    paidAt: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    operation: {
      id: operationId,
      name: "Test Operation",
      freelancerCutPercentage: new Prisma.Decimal(10),
      userId,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("createCreative", () => {
    it("returns success with CreativeViewModel on valid input", async () => {
      const { getServerSession } = await import("@/lib/session");
      const CreativeService = await import("@/services/creative.service");
      const { verifyOperationOwnership } = await import(
        "@/services/operation.service"
      );

      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(verifyOperationOwnership).mockResolvedValue();
      vi.mocked(CreativeService.create).mockResolvedValue(
        mockCreativeFromDB as any,
      );
      vi.mocked(CreativeService.findById).mockResolvedValue(
        mockCreativeFromDB as any,
      );

      const { createCreative } = await import("./actions");
      const result = await createCreative({
        name: "Test Creative",
        totalProfit: 1000,
        operationId,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(creativeId);
        expect(result.data.totalProfit).toBe("1000");
      }
    });

    it("returns 401 error when not authenticated", async () => {
      const { getServerSession } = await import("@/lib/session");
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { createCreative } = await import("./actions");
      const result = await createCreative({
        name: "Test Creative",
        totalProfit: 1000,
        operationId,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.status).toBe(401);
      }
    });

    it("returns validation error for invalid input", async () => {
      const { getServerSession } = await import("@/lib/session");
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const { createCreative } = await import("./actions");
      const result = await createCreative({
        name: "",
        totalProfit: -1,
        operationId,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.status).toBe(400);
      }
    });
  });

  describe("deleteCreative", () => {
    it("returns success after deleting owned creative", async () => {
      const { getServerSession } = await import("@/lib/session");
      const CreativeService = await import("@/services/creative.service");

      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(CreativeService.findById).mockResolvedValue(
        mockCreativeFromDB as any,
      );
      vi.mocked(CreativeService.deleteCreative).mockResolvedValue();

      const { deleteCreative } = await import("./actions");
      const result = await deleteCreative(creativeId);

      expect(result.success).toBe(true);
    });

    it("returns 401 when not authenticated", async () => {
      const { getServerSession } = await import("@/lib/session");
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { deleteCreative } = await import("./actions");
      const result = await deleteCreative(creativeId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.status).toBe(401);
      }
    });

    it("returns 404 when creative belongs to different user", async () => {
      const { getServerSession } = await import("@/lib/session");
      const CreativeService = await import("@/services/creative.service");

      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const otherUserCreative = {
        ...mockCreativeFromDB,
        operation: {
          ...mockCreativeFromDB.operation,
          userId: "other-user",
        },
      };
      vi.mocked(CreativeService.findById).mockResolvedValue(
        otherUserCreative as any,
      );

      const { deleteCreative } = await import("./actions");
      const result = await deleteCreative(creativeId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.status).toBe(404);
      }
    });
  });

  describe("deactivateCreative", () => {
    it("returns updated creative with isActive=false for owned creative", async () => {
      const { getServerSession } = await import("@/lib/session");
      const CreativeService = await import("@/services/creative.service");

      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const inactiveCreative = { ...mockCreativeFromDB, isActive: false };
      vi.mocked(CreativeService.findById)
        .mockResolvedValueOnce(mockCreativeFromDB as any)
        .mockResolvedValueOnce(inactiveCreative as any);
      vi.mocked(CreativeService.update).mockResolvedValue(
        inactiveCreative as any,
      );

      const { deactivateCreative } = await import("./actions");
      const result = await deactivateCreative(creativeId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });

    it("returns 401 when not authenticated", async () => {
      const { getServerSession } = await import("@/lib/session");
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { deactivateCreative } = await import("./actions");
      const result = await deactivateCreative(creativeId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.status).toBe(401);
      }
    });

    it("returns 404 when creative belongs to different user", async () => {
      const { getServerSession } = await import("@/lib/session");
      const CreativeService = await import("@/services/creative.service");

      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const otherUserCreative = {
        ...mockCreativeFromDB,
        operation: { ...mockCreativeFromDB.operation, userId: "other-user" },
      };
      vi.mocked(CreativeService.findById).mockResolvedValue(
        otherUserCreative as any,
      );

      const { deactivateCreative } = await import("./actions");
      const result = await deactivateCreative(creativeId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.status).toBe(404);
      }
    });
  });

  describe("registerProfit", () => {
    it("returns updated creative with increased totalProfit", async () => {
      const { getServerSession } = await import("@/lib/session");
      const CreativeService = await import("@/services/creative.service");

      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(CreativeService.findById).mockResolvedValue(
        mockCreativeFromDB as any,
      );

      const updatedCreative = {
        ...mockCreativeFromDB,
        totalProfit: new Prisma.Decimal(1500),
        freelancerCut: new Prisma.Decimal(150),
      };
      vi.mocked(CreativeService.registerProfit).mockResolvedValue(
        updatedCreative as any,
      );
      vi.mocked(CreativeService.findById)
        .mockResolvedValueOnce(mockCreativeFromDB as any)
        .mockResolvedValueOnce(updatedCreative as any);

      const { registerProfit } = await import("./actions");
      const result = await registerProfit(creativeId, { amount: 500 });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.totalProfit).toBe("1500");
      }
    });

    it("returns 401 when not authenticated", async () => {
      const { getServerSession } = await import("@/lib/session");
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { registerProfit } = await import("./actions");
      const result = await registerProfit(creativeId, { amount: 500 });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.status).toBe(401);
      }
    });

    it("returns 400 for invalid amount (negative)", async () => {
      const { getServerSession } = await import("@/lib/session");
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const { registerProfit } = await import("./actions");
      const result = await registerProfit(creativeId, { amount: -100 });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.status).toBe(400);
      }
    });

    it("returns 404 when creative belongs to different user", async () => {
      const { getServerSession } = await import("@/lib/session");
      const CreativeService = await import("@/services/creative.service");

      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const otherUserCreative = {
        ...mockCreativeFromDB,
        operation: { ...mockCreativeFromDB.operation, userId: "other-user" },
      };
      vi.mocked(CreativeService.findById).mockResolvedValue(
        otherUserCreative as any,
      );

      const { registerProfit } = await import("./actions");
      const result = await registerProfit(creativeId, { amount: 500 });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.status).toBe(404);
      }
    });
  });

  describe("markAsPaid", () => {
    it("returns updated creative marked as paid", async () => {
      const { getServerSession } = await import("@/lib/session");
      const CreativeService = await import("@/services/creative.service");

      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(CreativeService.findById).mockResolvedValue(
        mockCreativeFromDB as any,
      );

      const paidCreative = {
        ...mockCreativeFromDB,
        isPaid: true,
        paidAt: new Date("2024-01-02"),
      };
      vi.mocked(CreativeService.update).mockResolvedValue(paidCreative as any);
      vi.mocked(CreativeService.findById)
        .mockResolvedValueOnce(mockCreativeFromDB as any)
        .mockResolvedValueOnce(paidCreative as any);

      const { markAsPaid } = await import("./actions");
      const result = await markAsPaid(creativeId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isPaid).toBe(true);
      }
    });
  });
});
