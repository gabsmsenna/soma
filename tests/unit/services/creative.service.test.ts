import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { problems } from "@/lib/problem-registry";
import * as CreativeService from "@/services/creative.service";
import {
  type createMockPrismaClient,
  mockPrismaCount,
  mockPrismaCreate,
  mockPrismaDelete,
  mockPrismaFindMany,
  mockPrismaFindUnique,
  mockPrismaUpdate,
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

describe("CreativeService", () => {
  const operationId = "operation-123";
  const creativeId = "creative-456";
  const userId = "user-789";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar um novo criativo calculando freelancerCut", async () => {
      const createData = {
        name: "Novo Criativo",
        totalProfit: new Prisma.Decimal(100),
        operationId,
      };

      const mockOperation = {
        id: operationId,
        name: "Operação 1",
        userId,
        freelancerCutPercentage: new Prisma.Decimal(10), // 10%
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCreatedCreative = {
        id: creativeId,
        name: "Novo Criativo",
        operationId,
        totalProfit: new Prisma.Decimal(100),
        freelancerCut: new Prisma.Decimal(10),
        isActive: true,
        isPaid: false,
        paidAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.operation.findUnique = mockPrismaFindUnique(mockOperation);

      // $transaction executes the callback passing the mock prisma as tx
      (
        mockPrisma.$transaction as unknown as ReturnType<typeof vi.fn>
      ).mockImplementation(async (cb: (tx: unknown) => Promise<unknown>) =>
        cb(mockPrisma),
      );
      mockPrisma.creative.create = mockPrismaCreate(mockCreatedCreative);
      mockPrisma.profitLog.create = vi.fn().mockResolvedValue({});

      const result = await CreativeService.create(createData);

      expect(result).toEqual(mockCreatedCreative);
      expect(mockPrisma.operation.findUnique).toHaveBeenCalledWith({
        where: { id: operationId },
      });
      expect(mockPrisma.creative.create).toHaveBeenCalledWith({
        data: {
          name: createData.name,
          totalProfit: createData.totalProfit,
          freelancerCut: new Prisma.Decimal(10),
          operationId: createData.operationId,
        },
      });
    });

    it("deve lançar erro se operação não existir", async () => {
      const createData = {
        name: "Novo Criativo",
        totalProfit: new Prisma.Decimal(100),
        operationId,
      };
      mockPrisma.operation.findUnique = mockPrismaFindUnique(null);

      await expect(CreativeService.create(createData)).rejects.toThrow(
        problems.resourceNotFound("Operação não encontrada"),
      );
    });
  });

  describe("findById", () => {
    it("deve retornar um criativo por ID com operação", async () => {
      const mockCreative = {
        id: creativeId,
        name: "Criativo 1",
        operationId,
        totalProfit: new Prisma.Decimal(100),
        freelancerCut: new Prisma.Decimal(10),
        isActive: true,
        isPaid: false,
        paidAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        operation: {} as unknown,
      };

      mockPrisma.creative.findUnique = mockPrismaFindUnique(mockCreative);

      const result = await CreativeService.findById(creativeId);

      expect(result).toEqual(mockCreative);
      expect(mockPrisma.creative.findUnique).toHaveBeenCalledWith({
        where: { id: creativeId },
        include: { operation: true },
      });
    });

    it("deve lançar erro quando criativo não existe", async () => {
      mockPrisma.creative.findUnique = mockPrismaFindUnique(null);

      await expect(CreativeService.findById(creativeId)).rejects.toThrow(
        problems.resourceNotFound("Criativo não encontrado"),
      );
    });
  });

  describe("findByOperationId", () => {
    it("deve retornar criativos de uma operação", async () => {
      const mockCreatives = [
        {
          id: creativeId,
          name: "Criativo 1",
          operationId,
          totalProfit: new Prisma.Decimal(100),
          freelancerCut: new Prisma.Decimal(10),
          isActive: true,
          isPaid: false,
          paidAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as unknown,
      ];

      mockPrisma.creative.findMany = mockPrismaFindMany(mockCreatives);

      const result = await CreativeService.findByOperationId(operationId);

      expect(result).toEqual(mockCreatives);
      expect(mockPrisma.creative.findMany).toHaveBeenCalledWith({
        where: { operationId },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("findByOperationIdPaginated", () => {
    it("deve retornar criativos paginados", async () => {
      const mockCreatives = [
        {
          id: creativeId,
          name: "Criativo 1",
          operationId,
          totalProfit: new Prisma.Decimal(100),
          freelancerCut: new Prisma.Decimal(10),
          isActive: true,
          isPaid: false,
          paidAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as unknown,
      ];
      const page = 1;
      const limit = 10;
      const total = 1;

      mockPrisma.creative.findMany = mockPrismaFindMany(mockCreatives);
      mockPrisma.creative.count = mockPrismaCount(total);

      const result = await CreativeService.findByOperationIdPaginated(
        operationId,
        page,
        limit,
      );

      expect(result).toEqual({
        data: mockCreatives,
        pagination: {
          page,
          limit,
          total,
          totalPages: 1,
        },
      });
      expect(mockPrisma.creative.findMany).toHaveBeenCalledWith({
        where: { operationId },
        skip: 0,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
      expect(mockPrisma.creative.count).toHaveBeenCalledWith({
        where: { operationId },
      });
    });
  });

  describe("update", () => {
    it("deve atualizar um criativo", async () => {
      const updateData = {
        name: "Criativo Atualizado",
        totalProfit: new Prisma.Decimal(200),
        freelancerCut: new Prisma.Decimal(20),
      };
      const mockUpdatedCreative = {
        id: creativeId,
        name: "Criativo Atualizado",
        operationId,
        totalProfit: new Prisma.Decimal(200),
        freelancerCut: new Prisma.Decimal(20),
        isActive: true,
        isPaid: false,
        paidAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.creative.update = mockPrismaUpdate(mockUpdatedCreative);

      const result = await CreativeService.update(creativeId, updateData);

      expect(result).toEqual(mockUpdatedCreative);
      expect(mockPrisma.creative.update).toHaveBeenCalledWith({
        where: { id: creativeId },
        data: updateData,
      });
    });
  });

  describe("deleteCreative", () => {
    it("deve deletar um criativo", async () => {
      mockPrisma.creative.delete = mockPrismaDelete({ id: creativeId });

      await CreativeService.deleteCreative(creativeId);

      expect(mockPrisma.creative.delete).toHaveBeenCalledWith({
        where: { id: creativeId },
      });
    });
  });
});
