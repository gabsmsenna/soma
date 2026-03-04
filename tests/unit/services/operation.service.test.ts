import { beforeEach, describe, expect, it, vi } from "vitest";
import { problems } from "@/lib/problem-registry";
import * as OperationService from "@/services/operation.service";
import {
  type createMockPrismaClient,
  mockPrismaCount,
  mockPrismaCreate,
  mockPrismaDelete,
  mockPrismaFindFirst,
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
const mockPrisma = prisma.default as ReturnType<typeof createMockPrismaClient>;

describe("OperationService", () => {
  const userId = "user-123";
  const operationId = "operation-456";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("deve retornar todas as operações do usuário com criativos", async () => {
      const mockOperations = [
        {
          id: "op-1",
          name: "Operação 1",
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatives: [],
        },
        {
          id: "op-2",
          name: "Operação 2",
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatives: [],
        },
      ];

      mockPrisma.operation.findMany = mockPrismaFindMany(mockOperations);

      const result = await OperationService.getAll(userId);

      expect(result).toEqual(mockOperations);
      expect(mockPrisma.operation.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { creatives: true },
      });
    });
  });

  describe("getAllPaginated", () => {
    it("deve retornar operações paginadas com metadados de paginação", async () => {
      const mockOperations = [
        {
          id: "op-1",
          name: "Operação 1",
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatives: [],
        },
      ];
      const page = 1;
      const limit = 10;
      const total = 15;

      mockPrisma.operation.findMany = mockPrismaFindMany(mockOperations);
      mockPrisma.operation.count = mockPrismaCount(total);

      const result = await OperationService.getAllPaginated(
        userId,
        page,
        limit,
      );

      expect(result).toEqual({
        data: mockOperations,
        pagination: {
          page,
          limit,
          total,
          totalPages: 2,
        },
      });
      expect(mockPrisma.operation.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { creatives: true },
        skip: 0,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
      expect(mockPrisma.operation.count).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it("deve calcular corretamente o skip para páginas diferentes", async () => {
      const page = 3;
      const limit = 10;

      mockPrisma.operation.findMany = mockPrismaFindMany([]);
      mockPrisma.operation.count = mockPrismaCount(0);

      await OperationService.getAllPaginated(userId, page, limit);

      expect(mockPrisma.operation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10,
        }),
      );
    });
  });

  describe("createOperation", () => {
    it("deve criar uma nova operação", async () => {
      const createData = { name: "Nova Operação" };
      const mockCreatedOperation = {
        id: operationId,
        name: createData.name,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.operation.create = mockPrismaCreate(mockCreatedOperation);

      const result = await OperationService.createOperation(userId, createData);

      expect(result).toEqual(mockCreatedOperation);
      expect(mockPrisma.operation.create).toHaveBeenCalledWith({
        data: { ...createData, userId },
      });
    });
  });

  describe("updateOperation", () => {
    it("deve atualizar uma operação existente", async () => {
      const updateData = { name: "Operação Atualizada" };
      const mockExistingOperation = {
        id: operationId,
        name: "Operação Antiga",
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockUpdatedOperation = {
        ...mockExistingOperation,
        ...updateData,
      };

      mockPrisma.operation.findFirst = mockPrismaFindFirst(
        mockExistingOperation,
      );
      mockPrisma.operation.update = mockPrismaUpdate(mockUpdatedOperation);

      const result = await OperationService.updateOperation(
        operationId,
        userId,
        updateData,
      );

      expect(result).toEqual(mockUpdatedOperation);
      expect(mockPrisma.operation.findFirst).toHaveBeenCalledWith({
        where: { id: operationId, userId },
      });
      expect(mockPrisma.operation.update).toHaveBeenCalledWith({
        where: { id: operationId },
        data: updateData,
      });
    });

    it("deve lançar erro quando operação não existe", async () => {
      const updateData = { name: "Operação Atualizada" };

      mockPrisma.operation.findFirst = mockPrismaFindFirst(null);

      await expect(
        OperationService.updateOperation(operationId, userId, updateData),
      ).rejects.toThrow(problems.resourceNotFound("Operação não encontrada"));

      expect(mockPrisma.operation.update).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando operação pertence a outro usuário", async () => {
      const updateData = { name: "Operação Atualizada" };

      mockPrisma.operation.findFirst = mockPrismaFindFirst(null);

      await expect(
        OperationService.updateOperation(operationId, "other-user", updateData),
      ).rejects.toThrow(problems.resourceNotFound("Operação não encontrada"));
    });
  });

  describe("deleteOperation", () => {
    it("deve deletar uma operação existente", async () => {
      const mockOperation = {
        id: operationId,
        name: "Operação para Deletar",
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.operation.findFirst = mockPrismaFindFirst(mockOperation);
      mockPrisma.operation.delete = mockPrismaDelete(mockOperation);

      const result = await OperationService.deleteOperation(
        operationId,
        userId,
      );

      expect(result).toEqual(mockOperation);
      expect(mockPrisma.operation.findFirst).toHaveBeenCalledWith({
        where: { id: operationId, userId },
      });
      expect(mockPrisma.operation.delete).toHaveBeenCalledWith({
        where: { id: operationId },
      });
    });

    it("deve lançar erro quando operação não existe", async () => {
      mockPrisma.operation.findFirst = mockPrismaFindFirst(null);

      await expect(
        OperationService.deleteOperation(operationId, userId),
      ).rejects.toThrow(problems.resourceNotFound("Operação não encontrada"));

      expect(mockPrisma.operation.delete).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando operação pertence a outro usuário", async () => {
      mockPrisma.operation.findFirst = mockPrismaFindFirst(null);

      await expect(
        OperationService.deleteOperation(operationId, "other-user"),
      ).rejects.toThrow(problems.resourceNotFound("Operação não encontrada"));
    });
  });

  describe("verifyOperationOwnership", () => {
    it("deve verificar propriedade sem lançar erro quando operação existe", async () => {
      const mockOperation = {
        id: operationId,
        name: "Operação",
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.operation.findUnique = mockPrismaFindUnique(mockOperation);

      await expect(
        OperationService.verifyOperationOwnership(operationId, userId),
      ).resolves.toBeUndefined();

      expect(mockPrisma.operation.findUnique).toHaveBeenCalledWith({
        where: { id: operationId, userId },
      });
    });

    it("deve lançar erro quando operação não existe", async () => {
      mockPrisma.operation.findUnique = mockPrismaFindUnique(null);

      await expect(
        OperationService.verifyOperationOwnership(operationId, userId),
      ).rejects.toThrow(problems.resourceNotFound("Operação não encontrada"));
    });

    it("deve lançar erro quando operação pertence a outro usuário", async () => {
      mockPrisma.operation.findUnique = mockPrismaFindUnique(null);

      await expect(
        OperationService.verifyOperationOwnership(operationId, "other-user"),
      ).rejects.toThrow(problems.resourceNotFound("Operação não encontrada"));
    });
  });
});
