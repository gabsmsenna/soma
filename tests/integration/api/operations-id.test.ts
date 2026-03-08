import bcrypt from "bcryptjs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { DELETE, GET, PUT } from "@/app/api/operations/[operationId]/route";
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

describe("Operations API Endpoints (/api/operations/[operationId])", () => {
  const prisma = getTestPrismaClient();
  let testUser: any;
  let otherUser: any;
  let validToken: string;
  let otherToken: string;
  let testOperation: any;

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

    validToken = await generateAuthToken(
      testUser.id,
      testUser.email,
      testUser.name,
    );
    otherToken = await generateAuthToken(
      otherUser.id,
      otherUser.email,
      otherUser.name,
    );

    testOperation = await prisma.operation.create({
      data: {
        name: "Operação Específica",
        userId: testUser.id,
      },
    });
  });

  describe("GET /api/operations/[operationId]", () => {
    it("deve buscar uma operação pelo ID", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        },
      );

      const response = await GET(request, {
        params: { operationId: testOperation.id },
      });

      expect(response.status).toBe(200);
      const responseData = await parseJsonResponse<any>(response);
      expect(responseData.id).toBe(testOperation.id);
      expect(responseData.name).toBe(testOperation.name);
    });

    it("deve retornar 404 para operação inexistente", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const request = createMockRequest(
        `http://localhost/api/operations/${fakeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        },
      );

      const response = await GET(request, { params: { operationId: fakeId } });

      expect(response.status).toBe(404);
    });

    it("deve retornar 404 ao tentar acessar operação de outro usuário", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${otherToken}`,
          },
        },
      );

      const response = await GET(request, {
        params: { operationId: testOperation.id },
      });

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/operations/[operationId]", () => {
    it("deve atualizar uma operação existente com dados válidos", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
          body: {
            name: "Operação Atualizada",
          },
        },
      );

      const response = await PUT(request, {
        params: { operationId: testOperation.id },
      });

      expect(response.status).toBe(200);

      const responseData = await parseJsonResponse<any>(response);
      expect(responseData.id).toBe(testOperation.id);
      expect(responseData.name).toBe("Operação Atualizada");

      const inDb = await prisma.operation.findUnique({
        where: { id: testOperation.id },
      });
      expect(inDb?.name).toBe("Operação Atualizada");
    });

    it("deve retornar 400 ao tentar atualizar com dados inválidos", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
          body: {
            name: "", // nome vazio
          },
        },
      );

      const response = await PUT(request, {
        params: { operationId: testOperation.id },
      });

      expect(response.status).toBe(400);
    });

    it("deve retornar 404 ao tentar atualizar operação de outro usuário", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${otherToken}`,
          },
          body: {
            name: "Hacked Name",
          },
        },
      );

      const response = await PUT(request, {
        params: { operationId: testOperation.id },
      });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/operations/[operationId]", () => {
    it("deve desativar uma operação existente do usuário (soft delete)", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        },
      );

      const response = await DELETE(request, {
        params: { operationId: testOperation.id },
      });

      expect(response.status).toBe(200);

      const inDb = await prisma.operation.findUnique({
        where: { id: testOperation.id },
      });
      expect(inDb).not.toBeNull();
      expect(inDb?.active).toBe(false);
    });

    it("deve retornar 404 ao tentar excluir operação de outro usuário", async () => {
      const request = createMockRequest(
        `http://localhost/api/operations/${testOperation.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${otherToken}`,
          },
        },
      );

      const response = await DELETE(request, {
        params: { operationId: testOperation.id },
      });

      expect(response.status).toBe(404);

      const inDb = await prisma.operation.findUnique({
        where: { id: testOperation.id },
      });
      expect(inDb).not.toBeNull();
    });
  });
});
