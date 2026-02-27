import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { problems } from "@/lib/problem-registry";
import * as ProjectService from "@/services/project.service";
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

describe("ProjectService", () => {
  const operationId = "operation-123";
  const projectId = "project-456";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar um novo projeto", async () => {
      const createData = {
        name: "Novo Projeto",
        operationId,
        freelancerCutPercentage: 10,
        isActive: true,
      };
      const mockCreatedProject = {
        id: projectId,
        name: "Novo Projeto",
        operationId,
        freelancerCutPercentage: new Prisma.Decimal(10),
        isActive: true,
        isPaid: false,
        paidAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.project.create = mockPrismaCreate(mockCreatedProject);

      const result = await ProjectService.create(createData);

      expect(result).toEqual(mockCreatedProject);
      expect(mockPrisma.project.create).toHaveBeenCalledWith({
        data: createData,
      });
    });
  });

  describe("findById", () => {
    it("deve retornar um projeto por ID com operação e creatives", async () => {
      const mockProject = {
        id: projectId,
        name: "Projeto 1",
        operationId,
        freelancerCutPercentage: new Prisma.Decimal(10),
        isActive: true,
        isPaid: false,
        paidAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        operation: {} as any,
        creatives: [],
      };

      mockPrisma.project.findUnique = mockPrismaFindUnique(mockProject);

      const result = await ProjectService.findById(projectId);

      expect(result).toEqual(mockProject);
      expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: projectId },
        include: { operation: true, creatives: true },
      });
    });

    it("deve lançar erro quando projeto não existe", async () => {
      mockPrisma.project.findUnique = mockPrismaFindUnique(null);

      await expect(ProjectService.findById(projectId)).rejects.toThrow(
        problems.resourceNotFound("Projeto não encontrado"),
      );
    });
  });

  describe("findByOperationId", () => {
    it("deve retornar projetos de uma operação", async () => {
      const mockProjects = [
        {
          id: projectId,
          name: "Projeto 1",
          operationId,
          freelancerCutPercentage: new Prisma.Decimal(10),
          isActive: true,
          isPaid: false,
          paidAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatives: [],
        } as any,
      ];

      mockPrisma.project.findMany = mockPrismaFindMany(mockProjects);

      const result = await ProjectService.findByOperationId(operationId);

      expect(result).toEqual(mockProjects);
      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: { operationId },
        include: { creatives: true },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("findByOperationIdPaginated", () => {
    it("deve retornar projetos paginados", async () => {
      const mockProjects = [
        {
          id: projectId,
          name: "Projeto 1",
          operationId,
          freelancerCutPercentage: new Prisma.Decimal(10),
          isActive: true,
          isPaid: false,
          paidAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatives: [],
        } as any,
      ];
      const page = 1;
      const limit = 10;
      const total = 1;

      mockPrisma.project.findMany = mockPrismaFindMany(mockProjects);
      mockPrisma.project.count = mockPrismaCount(total);

      const result = await ProjectService.findByOperationIdPaginated(
        operationId,
        page,
        limit,
      );

      expect(result).toEqual({
        data: mockProjects,
        pagination: {
          page,
          limit,
          total,
          totalPages: 1,
        },
      });
      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: { operationId },
        include: { creatives: true },
        skip: 0,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
      expect(mockPrisma.project.count).toHaveBeenCalledWith({
        where: { operationId },
      });
    });
  });

  describe("update", () => {
    it("deve atualizar um projeto", async () => {
      const updateData = { name: "Projeto Atualizado" };
      const mockUpdatedProject = {
        id: projectId,
        name: "Projeto Atualizado",
        operationId,
        freelancerCutPercentage: new Prisma.Decimal(10),
        isActive: true,
        isPaid: false,
        paidAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.project.update = mockPrismaUpdate(mockUpdatedProject);

      const result = await ProjectService.update(projectId, updateData);

      expect(result).toEqual(mockUpdatedProject);
      expect(mockPrisma.project.update).toHaveBeenCalledWith({
        where: { id: projectId },
        data: updateData,
      });
    });
  });

  describe("deleteProject", () => {
    it("deve deletar um projeto", async () => {
      mockPrisma.project.delete = mockPrismaDelete({ id: projectId });

      await ProjectService.deleteProject(projectId);

      expect(mockPrisma.project.delete).toHaveBeenCalledWith({
        where: { id: projectId },
      });
    });
  });
});
