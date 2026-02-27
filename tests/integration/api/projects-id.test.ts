import bcrypt from "bcryptjs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  DELETE,
  GET,
  PUT,
} from "@/app/api/operations/[operationId]/projects/[projectId]/route";
import { generateAuthToken } from "@/lib/generate-auth-token";
import {
  createMockRequest,
  parseJsonResponse,
} from "../../utils/helpers/request.helper";
import {
  cleanTestDatabase,
  getTestPrismaClient,
  setupTestDatabase,
  teardownTestDatabase,
} from "../../utils/setup/test-db";

describe("Projects ID API Endpoints (/api/operations/[operationId]/projects/[projectId])", () => {
  const prisma = getTestPrismaClient();
  let testUser: any;
  let otherUser: any;
  let validToken: string;
  let testOperation: any;
  let testProject: any;
  let otherProject: any;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanTestDatabase();

    const hashedPassword = await bcrypt.hash("Password123!", 10);
    testUser = await prisma.user.create({
      data: {
        name: "Test Ops User",
        email: "ops.user@example.com",
        password: hashedPassword,
        cpf: "12345678909",
      },
    });

    otherUser = await prisma.user.create({
      data: {
        name: "Other Ops User",
        email: "other.user@example.com",
        password: hashedPassword,
        cpf: "09876543210",
      },
    });

    validToken = await generateAuthToken(testUser.id, testUser.email);

    testOperation = await prisma.operation.create({
      data: {
        name: "Operação Específica",
        userId: testUser.id,
      },
    });

    const otherOperation = await prisma.operation.create({
      data: {
        name: "Operação Other User",
        userId: otherUser.id,
      },
    });

    testProject = await prisma.project.create({
      data: {
        name: "Projeto Teste",
        operationId: testOperation.id,
        freelancerCutPercentage: 20.0,
      },
    });

    otherProject = await prisma.project.create({
      data: {
        name: "Projeto Other",
        operationId: otherOperation.id,
        freelancerCutPercentage: 10.0,
      },
    });
  });

  describe("GET /api/operations/[operationId]/projects/[projectId]", () => {
    it("deve buscar um projeto por ID com sucesso", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}/projects/${testProject.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        },
      );

      const response = await GET(request, {
        params: Promise.resolve({
          operationId: testOperation.id,
          projectId: testProject.id,
        }),
      });

      expect(response.status).toBe(200);
      const responseData = await parseJsonResponse<any>(response);
      expect(responseData.id).toBe(testProject.id);
      expect(responseData.name).toBe(testProject.name);
    });

    it("deve retornar 404 para projeto não existente na base", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}/projects/${fakeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        },
      );

      const response = await GET(request, {
        params: Promise.resolve({
          operationId: testOperation.id,
          projectId: fakeId,
        }),
      });

      expect(response.status).toBe(404);
    });

    it("deve retornar 404 se tentar acessar projeto de outra operação", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}/projects/${otherProject.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        },
      );

      const response = await GET(request, {
        params: Promise.resolve({
          operationId: testOperation.id,
          projectId: otherProject.id,
        }),
      });

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/operations/[operationId]/projects/[projectId]", () => {
    it("deve atualizar um projeto existente com dados válidos", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}/projects/${testProject.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
          body: {
            name: "Projeto Nome Modificado",
            freelancerCutPercentage: 15,
          },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({
          operationId: testOperation.id,
          projectId: testProject.id,
        }),
      });

      expect(response.status).toBe(200);
      const responseData = await parseJsonResponse<any>(response);
      expect(responseData.id).toBe(testProject.id);
      expect(responseData.name).toBe("Projeto Nome Modificado");
      expect(parseFloat(responseData.freelancerCutPercentage)).toBe(15.0);

      const inDb = await prisma.project.findUnique({
        where: { id: testProject.id },
      });
      expect(inDb?.name).toBe("Projeto Nome Modificado");
      expect(inDb?.freelancerCutPercentage.toNumber()).toBe(15.0);
    });
  });

  describe("DELETE /api/operations/[operationId]/projects/[projectId]", () => {
    it("deve excluir um projeto existente", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}/projects/${testProject.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        },
      );

      const response = await DELETE(request, {
        params: Promise.resolve({
          operationId: testOperation.id,
          projectId: testProject.id,
        }),
      });

      expect(response.status).toBe(200);

      const inDb = await prisma.project.findUnique({
        where: { id: testProject.id },
      });
      expect(inDb).toBeNull();
    });

    it("deve retornar 404 ao tentar deletar projeto de outra operação", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}/projects/${otherProject.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        },
      );

      const response = await DELETE(request, {
        params: Promise.resolve({
          operationId: testOperation.id,
          projectId: otherProject.id,
        }),
      });

      expect(response.status).toBe(404);
      const inDb = await prisma.project.findUnique({
        where: { id: otherProject.id },
      });
      expect(inDb).toBeDefined();
    });
  });
});
