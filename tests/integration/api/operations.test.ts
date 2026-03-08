import bcrypt from "bcryptjs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/operations/route";
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

describe("Operations API Endpoints (/api/operations)", () => {
  const prisma = getTestPrismaClient();
  let testUser: any;
  let validToken: string;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanTestDatabase();

    // Create a test user for auth
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    testUser = await prisma.user.create({
      data: {
        name: "Test Ops User",
        email: "ops.user@example.com",
        password: hashedPassword,
        cpf: "12345678909",
      },
    });

    validToken = await generateAuthToken(
      testUser.id,
      testUser.email,
      testUser.name,
    );
  });

  describe("POST /api/operations", () => {
    it("deve criar uma nova operation com dados válidos e token", async () => {
      const request = createMockRequest("http://localhost/api/operations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
        body: {
          name: "Nova Operação Teste",
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(201);

      const responseData = await parseJsonResponse<any>(response);
      expect(responseData.id).toBeDefined();
      expect(responseData.name).toBe("Nova Operação Teste");
      expect(responseData.userId).toBe(testUser.id);

      // Verifica no banco
      const operationInDb = await prisma.operation.findUnique({
        where: { id: responseData.id },
      });
      expect(operationInDb).toBeDefined();
      expect(operationInDb?.name).toBe("Nova Operação Teste");
    });

    it("deve retornar erro 401 sem token de autenticação", async () => {
      const request = createMockRequest("http://localhost/api/operations", {
        method: "POST",
        body: {
          name: "Operação Sem Auth",
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(401);

      const errorData = await parseJsonResponse<any>(response);
      expect(errorData.status).toBe(401);
    });

    it("deve retornar erro 400 com dados inválidos (Zod)", async () => {
      const request = createMockRequest("http://localhost/api/operations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
        body: {
          name: "", // Nome vazio (inválido)
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);

      const errorData = await parseJsonResponse<any>(response);
      expect(errorData.error).toBe("Dados inválidos");
    });
  });

  describe("GET /api/operations", () => {
    beforeEach(async () => {
      // Seed some operations for the test user
      await prisma.operation.createMany({
        data: [
          { name: "Op 1", userId: testUser.id },
          { name: "Op 2", userId: testUser.id },
          { name: "Op 3", userId: testUser.id },
        ],
      });
    });

    it("deve retornar operações paginadas para o usuário autenticado", async () => {
      const request = createMockRequest(
        "http://localhost/api/operations?page=1&limit=2",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        },
      );

      const response = await GET(request);

      expect(response.status).toBe(200);

      const responseData = await parseJsonResponse<any>(response);
      expect(responseData.data).toBeDefined();
      expect(responseData.data.length).toBe(2);
      expect(responseData.pagination).toBeDefined();
      expect(responseData.pagination.total).toBe(3);
      expect(responseData.pagination.page).toBe(1);
      expect(responseData.pagination.limit).toBe(2);
    });

    it("deve retornar operações com paginação padrão se não fornecidos via query", async () => {
      const request = createMockRequest("http://localhost/api/operations", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      const response = await GET(request);

      expect(response.status).toBe(200);

      const responseData = await parseJsonResponse<any>(response);
      expect(responseData.data.length).toBe(3);
      expect(responseData.pagination.page).toBe(1);
      expect(responseData.pagination.limit).toBe(10);
    });

    it("deve retornar erro 401 sem token de autenticação", async () => {
      const request = createMockRequest("http://localhost/api/operations", {
        method: "GET",
      });

      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it("não deve retornar operações de outro usuário", async () => {
      // Create another user and an operation for them
      const otherUser = await prisma.user.create({
        data: {
          name: "Other User",
          email: "other@example.com",
          password: "hashedPassword123",
          cpf: "09876543210",
        },
      });

      await prisma.operation.create({
        data: { name: "Other User Op", userId: otherUser.id },
      });

      const request = createMockRequest("http://localhost/api/operations", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${validToken}`, // Login as testUser
        },
      });

      const response = await GET(request);
      const responseData = await parseJsonResponse<any>(response);

      // Verify that the operation created by otherUser is not included
      expect(responseData.pagination.total).toBe(3); // Original 3 operations of testUser
      const opNames = responseData.data.map((op: any) => op.name);
      expect(opNames).not.toContain("Other User Op");
    });
  });
});
