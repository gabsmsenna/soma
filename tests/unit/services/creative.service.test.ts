import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { problems } from "@/lib/problem-registry";
import * as CreativeService from "@/services/creative.service";
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
const mockPrisma = prisma.default as unknown as ReturnType<
  typeof createMockPrismaClient
>;

describe("CreativeService", () => {
  const projectId = "project-123";
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
        projectId,
      };

      const mockProject = {
        id: projectId,
        name: "Projeto 1",
        operationId: "op-1",
        freelancerCutPercentage: new Prisma.Decimal(10), // 10%
        isActive: true,
        isPaid: false,
        paidAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCreatedCreative = {
        id: creativeId,
        name: "Novo Criativo",
        projectId,
        totalProfit: new Prisma.Decimal(100),
        freelancerCut: new Prisma.Decimal(10),
        isPaid: false,
        paidAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.project.findUnique = mockPrismaFindUnique(mockProject);
      mockPrisma.creative.create = mockPrismaCreate(mockCreatedCreative);

      const result = await CreativeService.create(createData);

      expect(result).toEqual(mockCreatedCreative);
      expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: projectId },
      });
      expect(mockPrisma.creative.create).toHaveBeenCalledWith({
        data: {
          name: createData.name,
          totalProfit: createData.totalProfit,
          freelancerCut: new Prisma.Decimal(10),
          projectId: createData.projectId, // wait, data in creative.service: projectId data.projectId
        },
      });
    });

    it("deve lançar erro se projeto não existir", async () => {
      const createData = {
        name: "Novo Criativo",
        totalProfit: new Prisma.Decimal(100),
        projectId,
      };
      mockPrisma.project.findUnique = mockPrismaFindUnique(null);

      await expect(CreativeService.create(createData)).rejects.toThrow(
        problems.resourceNotFound("Projeto não encontrado"),
      );
    });
  });

  describe("findById", () => {
    it("deve retornar um criativo por ID com projeto e operação", async () => {
      const mockCreative = {
        id: creativeId,
        name: "Criativo 1",
        projectId,
        totalProfit: new Prisma.Decimal(100),
        freelancerCut: new Prisma.Decimal(10),
        isPaid: false,
        paidAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        project: {} as any,
      };

      mockPrisma.creative.findUnique = mockPrismaFindUnique(mockCreative);

      const result = await CreativeService.findById(creativeId);

      expect(result).toEqual(mockCreative);
      expect(mockPrisma.creative.findUnique).toHaveBeenCalledWith({
        where: { id: creativeId },
        include: { project: { include: { operation: true } } },
      });
    });

    it("deve lançar erro quando criativo não existe", async () => {
      mockPrisma.creative.findUnique = mockPrismaFindUnique(null);

      await expect(CreativeService.findById(creativeId)).rejects.toThrow(
        problems.resourceNotFound("Criativo não encontrado"),
      );
    });
  });

  describe("findByProjectId", () => {
    it("deve retornar criativos de um projeto", async () => {
      const mockCreatives = [
        {
          id: creativeId,
          name: "Criativo 1",
          projectId,
          totalProfit: new Prisma.Decimal(100),
          freelancerCut: new Prisma.Decimal(10),
          isPaid: false,
          paidAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      ];

      mockPrisma.creative.findMany = mockPrismaFindMany(mockCreatives);

      const result = await CreativeService.findByProjectId(projectId);

      expect(result).toEqual(mockCreatives);
      expect(mockPrisma.creative.findMany).toHaveBeenCalledWith({
        where: { projectId },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("findByProjectIdPaginated", () => {
    it("deve retornar criativos paginados", async () => {
      const mockCreatives = [
        {
          id: creativeId,
          name: "Criativo 1",
          projectId,
          totalProfit: new Prisma.Decimal(100),
          freelancerCut: new Prisma.Decimal(10),
          isPaid: false,
          paidAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      ];
      const page = 1;
      const limit = 10;
      const total = 1;

      mockPrisma.creative.findMany = mockPrismaFindMany(mockCreatives);
      mockPrisma.creative.count = mockPrismaCount(total);

      const result = await CreativeService.findByProjectIdPaginated(
        projectId,
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
        where: { projectId },
        skip: 0,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
      expect(mockPrisma.creative.count).toHaveBeenCalledWith({
        where: { projectId },
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
        projectId,
        totalProfit: new Prisma.Decimal(200),
        freelancerCut: new Prisma.Decimal(20),
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

  describe("verifyProjectOwnership", () => {
    it("deve verificar se projeto pertence à operação do usuário", async () => {
      const mockProject = {
        id: projectId,
      };

      mockPrisma.project.findFirst = mockPrismaFindFirst(mockProject);

      await expect(
        CreativeService.verifyProjectOwnership(projectId, userId),
      ).resolves.toBeUndefined();

      expect(mockPrisma.project.findFirst).toHaveBeenCalledWith({
        where: {
          id: projectId,
          operation: { userId },
        },
        include: { operation: true },
      });
    });

    it("deve lançar erro se projeto não pertence ou não for encontrado", async () => {
      mockPrisma.project.findFirst = mockPrismaFindFirst(null);

      await expect(
        CreativeService.verifyProjectOwnership(projectId, userId),
      ).rejects.toThrow(problems.resourceNotFound("Projeto não encontrado"));
    });
  });
});
