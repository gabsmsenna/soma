import bcrypt from "bcryptjs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/auth/login/route";
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

describe("POST /api/auth/login", () => {
  const prisma = getTestPrismaClient();

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  it("deve realizar login com credenciais válidas e retornar token", async () => {
    const password = "ValidPassword123!";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: "Test Login",
        email: "test.login@example.com",
        password: hashedPassword,
        cpf: "98765432100",
      },
    });

    const request = createMockRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: {
        email: "test.login@example.com",
        password,
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);

    const responseData = await parseJsonResponse<any>(response);

    expect(responseData.user).toBeDefined();
    expect(responseData.user.id).toBe(user.id);
    expect(responseData.user.email).toBe(user.email);
    expect(responseData.user.password).toBeUndefined();
    expect(responseData.token).toBeDefined();
    expect(typeof responseData.token).toBe("string");
  });

  it("deve retornar erro 401 com email não existente", async () => {
    const request = createMockRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: {
        email: "nonexistent@example.com",
        password: "anyPassword123!",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(401);

    const errorData = await parseJsonResponse<any>(response);
    expect(errorData.status).toBe(401);
    expect(errorData.title).toBe("Credenciais inválidas");
  });

  it("deve retornar erro 401 com senha incorreta", async () => {
    const password = "ValidPassword123!";
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: "Test Wrong Pass",
        email: "wrongpass@example.com",
        password: hashedPassword,
        cpf: "11122233344",
      },
    });

    const request = createMockRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: {
        email: "wrongpass@example.com",
        password: "WrongPassword123!",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(401);

    const errorData = await parseJsonResponse<any>(response);
    expect(errorData.status).toBe(401);
    expect(errorData.title).toBe("Credenciais inválidas");
  });

  it("deve retornar erro 400 com dados inválidos (validação Zod)", async () => {
    const request = createMockRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: {
        email: "not-an-email",
        // missing password
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);

    const errorData = await parseJsonResponse<any>(response);
    expect(errorData.error).toBe("Dados inválidos");
    expect(errorData.details).toBeDefined();
  });
});
