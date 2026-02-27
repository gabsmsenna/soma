import bcrypt from "bcryptjs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/operations/[operationId]/projects/route";
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

describe("Projects API Endpoints (/api/operations/[operationId]/projects)", () => {
  const prisma = getTestPrismaClient();
  let testUser: any;
  let otherUser: any;
  let validToken: string;
  let testOperation: any;
  let otherOperation: any;

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
        name: "Test Project User",
        email: "project.user@example.com",
        password: hashedPassword,
        cpf: "12345678909",
      },
    });

    otherUser = await prisma.user.create({
      data: {
        name: "Other User",
        email: "other@example.com",
        password: hashedPassword,
        cpf: "09876543210",
      },
    });

    validToken = await generateAuthToken(testUser.id, testUser.email);

    testOperation = await prisma.operation.create({
      data: {
        name: "Op 1",
        userId: testUser.id,
      },
    });

    otherOperation = await prisma.operation.create({
      data: {
        name: "Op 2 (Other User)",
        userId: otherUser.id,
      },
    });
  });

  describe("POST /api/operations/[operationId]/projects", () => {
    it("deve criar um novo projeto em uma operação existente com dados válidos", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}/projects`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
          body: {
            name: "Novo Projeto",
            freelancerCutPercentage: 25.5,
          },
        },
      );

      const response = await POST(request, {
        params: Promise.resolve({ operationId: testOperation.id }),
      });

      expect(response.status).toBe(201);

      const responseData = await parseJsonResponse<any>(response);
      expect(responseData.id).toBeDefined();
      expect(responseData.name).toBe("Novo Projeto");
      expect(responseData.operationId).toBe(testOperation.id);
      expect(parseFloat(responseData.freelancerCutPercentage)).toBe(25.5);

      const inDb = await prisma.project.findUnique({
        where: { id: responseData.id },
      });
      expect(inDb).toBeDefined();
    });

    it("deve retornar 404 ao tentar criar projeto em uma operação que não pertence ao usuário", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${otherOperation.id}/projects`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
          body: {
            name: "Projeto Hack",
          },
        },
      );

      const response = await POST(request, {
        params: Promise.resolve({ operationId: otherOperation.id }),
      });

      expect(response.status).toBe(404);
    });

    it("deve retornar 400 com dados inválidos", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}/projects`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
          body: {
            name: "",
            freelancerCutPercentage: 105,
          },
        },
      );

      const response = await POST(request, {
        params: Promise.resolve({ operationId: testOperation.id }),
      });

      expect(response.status).toBe(400);

      const errorData = await parseJsonResponse<any>(response);
      expect(errorData.error).toBe("Dados inválidos");
    });
  });

  describe("GET /api/operations/[operationId]/projects", () => {
    beforeEach(async () => {
      await prisma.project.createMany({
        data: [
          { name: "Proj 1", operationId: testOperation.id },
          { name: "Proj 2", operationId: testOperation.id },
          { name: "Proj Other", operationId: otherOperation.id },
        ],
      });
    });

    it("deve retornar projetos da operação paginados para o proprietário da operação", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}/projects?page=1&limit=10`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        },
      );

      const response = await GET(request, {
        params: Promise.resolve({ operationId: testOperation.id }),
      });

      expect(response.status).toBe(200);

      const responseData = await parseJsonResponse<any>(response);
      expect(responseData.data).toBeDefined();
      expect(responseData.data.length).toBe(2);
      expect(responseData.pagination.total).toBe(2);
    });

    it("deve retornar 404 se tentar listar projetos de operação que não pertence ao usuário", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${otherOperation.id}/projects`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        },
      );

      const response = await GET(request, {
        params: Promise.resolve({ operationId: otherOperation.id }),
      });

      expect(response.status).toBe(404);
    });
  });
});
