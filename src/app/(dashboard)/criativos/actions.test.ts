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
  verifyProjectOwnership: vi.fn(),
}));

describe("criativos/actions", () => {
  const userId = "user-123";
  const projectId = "project-456";
  const creativeId = "creative-789";

  const mockSession = { userId, email: "test@test.com" };

  const mockCreativeFromDB = {
    id: creativeId,
    name: "Test Creative",
    projectId,
    totalProfit: new Prisma.Decimal(1000),
    freelancerCut: new Prisma.Decimal(100),
    isPaid: false,
    paidAt: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    project: {
      id: projectId,
      name: "Test Project",
      freelancerCutPercentage: new Prisma.Decimal(10),
      isActive: true,
      isPaid: false,
      paidAt: null,
      operationId: "op-1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      operation: {
        id: "op-1",
        name: "Test Operation",
        userId,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createCreative", () => {
    it("returns success with CreativeViewModel on valid input", async () => {
      const { getServerSession } = await import("@/lib/session");
      const CreativeService = await import("@/services/creative.service");

      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(CreativeService.verifyProjectOwnership).mockResolvedValue();
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
        projectId,
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
        projectId,
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
        projectId,
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
        project: {
          ...mockCreativeFromDB.project,
          operation: {
            ...mockCreativeFromDB.project.operation,
            userId: "other-user",
          },
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
