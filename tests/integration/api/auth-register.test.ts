import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/auth/register/route";
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

describe("POST /api/auth/register", () => {
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

  it("deve registrar um novo usuário com dados válidos e retornar 201", async () => {
    const registerData = {
      name: "User Test",
      email: "test.integration@example.com",
      password: "StrongPassword123!",
      cpf: "74557440134",
    };

    const request = createMockRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: registerData,
    });

    const response = await POST(request);

    if (response.status !== 201) {
      console.log(await response.clone().json());
    }
    expect(response.status).toBe(201);

    const responseData = await parseJsonResponse<any>(response);

    // Verificar retorno
    expect(responseData.user).toBeDefined();
    expect(responseData.user.name).toBe(registerData.name);
    expect(responseData.user.email).toBe(registerData.email);
    expect(responseData.user.cpf).toBe(registerData.cpf);
    expect(responseData.user.password).toBeUndefined(); // a senha não deve ser retornada
    expect(responseData.token).toBeDefined();

    // Verificar se salvou no banco
    const userInDb = await prisma.user.findUnique({
      where: { email: registerData.email },
    });
    expect(userInDb).toBeDefined();
    expect(userInDb?.name).toBe(registerData.name);
  });

  it("deve retornar erro 409 quando o email já existe", async () => {
    const existingUser = {
      name: "Existing User",
      email: "existing@example.com",
      password: "hashedPassword123",
      cpf: "24240191858",
    };

    await prisma.user.create({ data: existingUser });

    const request = createMockRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: {
        name: "Another User",
        email: existingUser.email,
        password: "NewPassword123!",
        cpf: "74557440134",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(409);
    const errorData = await parseJsonResponse<any>(response);

    expect(errorData.status).toBe(409);
    expect(errorData.title).toBe("E-mail já cadastrado"); // Error format of Problem Details
  });

  it("deve retornar erro 400 com dados inválidos (validação Zod)", async () => {
    const request = createMockRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: {
        name: "", // Nome inválido (min: 1)
        email: "not-an-email", // Email inválido
        password: "short", // Senha inválida
        // missing cpf
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);

    const errorData = await parseJsonResponse<any>(response);
    expect(errorData.error).toBe("Dados inválidos");
    expect(errorData.details).toBeDefined();
  });
});
