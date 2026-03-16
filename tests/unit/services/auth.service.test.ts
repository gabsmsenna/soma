import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateAuthToken } from "@/lib/generate-auth-token";
import { problems } from "@/lib/problem-registry";
import { login, register, verifyToken } from "@/services/auth.service";
import {
  type createMockPrismaClient,
  mockPrismaCreate,
  mockPrismaFindUnique,
} from "../../utils/mocks/prisma.mock";

vi.mock("@/lib/prisma", async () => {
  const { createMockPrismaClient } = await import(
    "../../utils/mocks/prisma.mock"
  );
  return {
    default: createMockPrismaClient(),
  };
});

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("@/lib/generate-auth-token", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/generate-auth-token")>();
  return {
    ...actual,
    generateAuthToken: vi.fn(actual.generateAuthToken),
  };
});

const prisma = await import("@/lib/prisma");
const mockPrisma = prisma.default as unknown as ReturnType<
  typeof createMockPrismaClient
>;
const mockBcrypt = bcrypt as unknown as {
  hash: ReturnType<typeof vi.fn>;
  compare: ReturnType<typeof vi.fn>;
};
const mockGenerateAuthToken = generateAuthToken as ReturnType<typeof vi.fn>;

describe("AuthService", () => {
  const JWT_SECRET = "test-secret-key-for-testing";

  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", JWT_SECRET);
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("deve registrar um novo usuário com sucesso", async () => {
      const registerData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        cpf: "12345678900",
      };

      const mockCreatedUser = {
        id: "user-123",
        name: registerData.name,
        email: registerData.email,
        cpf: registerData.cpf,
        password: "hashedPassword123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique = mockPrismaFindUnique(null);
      mockBcrypt.hash.mockResolvedValue("hashedPassword123");
      mockPrisma.user.create = mockPrismaCreate(mockCreatedUser);
      mockGenerateAuthToken.mockImplementation(async () => "fake-jwt-token");

      const result = await register(registerData);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerData.email },
      });
      expect(mockBcrypt.hash).toHaveBeenCalledWith(registerData.password, 10);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: registerData.name,
          email: registerData.email,
          cpf: registerData.cpf,
          password: "hashedPassword123",
        },
      });
      expect(mockGenerateAuthToken).toHaveBeenCalledWith(
        "user-123",
        registerData.email,
        registerData.name,
      );

      expect(result).toEqual({
        user: {
          id: "user-123",
          name: registerData.name,
          email: registerData.email,
          cpf: registerData.cpf,
          createdAt: mockCreatedUser.createdAt,
          updatedAt: mockCreatedUser.updatedAt,
        },
        token: "fake-jwt-token",
      });
    });

    it("deve lançar erro se o email já estiver cadastrado", async () => {
      const registerData = {
        name: "Test User",
        email: "existing@example.com",
        password: "password123",
        cpf: "12345678900",
      };

      mockPrisma.user.findUnique = mockPrismaFindUnique({
        id: "existing-user",
      });

      await expect(register(registerData)).rejects.toThrow(
        problems.emailAlreadyExists(),
      );
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("deve realizar login com sucesso e retornar token", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const mockUser = {
        id: "user-123",
        name: "Test User",
        email: loginData.email,
        cpf: "12345678900",
        password: "hashedPassword123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique = mockPrismaFindUnique(mockUser);
      mockBcrypt.compare.mockResolvedValue(true);
      mockGenerateAuthToken.mockImplementation(async () => "fake-jwt-token");

      const result = await login(loginData);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password,
      );
      expect(mockGenerateAuthToken).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email,
        mockUser.name,
      );
      expect(result).toEqual({
        user: {
          id: "user-123",
          name: mockUser.name,
          email: mockUser.email,
          cpf: mockUser.cpf,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        },
        token: "fake-jwt-token",
      });
    });

    it("deve lançar erro se o usuário não for encontrado", async () => {
      mockPrisma.user.findUnique = mockPrismaFindUnique(null);

      await expect(
        login({ email: "notfound@example.com", password: "password" }),
      ).rejects.toThrow(problems.invalidCredentials());
    });

    it("deve lançar erro se a senha estiver incorreta", async () => {
      mockPrisma.user.findUnique = mockPrismaFindUnique({
        password: "hashedPassword123",
      });
      mockBcrypt.compare.mockResolvedValue(false);

      await expect(
        login({ email: "test@example.com", password: "wrongpassword" }),
      ).rejects.toThrow(problems.invalidCredentials());
    });
  });

  describe("verifyToken", () => {
    it("deve validar um token válido e retornar userId e email", async () => {
      const userId = "user-123";
      const email = "test@example.com";
      const name = "Test User";

      mockGenerateAuthToken.mockRestore(); // Restore the original implementation locally

      const { generateAuthToken: realGenerate } = await import(
        "@/lib/generate-auth-token"
      );
      const token = await realGenerate(userId, email, name);
      const result = await verifyToken(token);

      expect(result).toEqual({
        userId,
        email,
        name,
      });
    });

    it("deve lançar erro se JWT_SECRET não estiver definido", async () => {
      mockGenerateAuthToken.mockRestore(); // Restore the original implementation locally
      vi.unstubAllEnvs(); // Remove JWT_SECRET
      const { generateAuthToken: realGenerate } = await import(
        "@/lib/generate-auth-token"
      );
      vi.stubEnv("JWT_SECRET", JWT_SECRET); // Set temporarily to generate
      const tokenString = await realGenerate(
        "user-123",
        "test@example.com",
        "Test User",
      );
      vi.unstubAllEnvs(); // Remove again for verification test
      delete process.env.JWT_SECRET;

      await expect(verifyToken(tokenString)).rejects.toThrow(
        "JWT_SECRET not defined",
      );
      vi.stubEnv("JWT_SECRET", JWT_SECRET); // Restore for other tests
    });

    it("deve lançar erro com token inválido", async () => {
      const invalidToken = "invalid.token.here";

      await expect(verifyToken(invalidToken)).rejects.toThrow(
        problems.invalidToken(),
      );
    });

    it("deve lançar erro com token expirado", async () => {
      mockGenerateAuthToken.mockRestore(); // Restore the original implementation locally
      const userId = "user-123";
      const email = "expired@example.com";
      const name = "Expired User";

      vi.useFakeTimers();
      const now = new Date();
      vi.setSystemTime(now);

      const { generateAuthToken: realGenerate } = await import(
        "@/lib/generate-auth-token"
      );
      const token = await realGenerate(userId, email, name);

      // Advance time by 25 hours (beyond the 1 day expiration)
      vi.setSystemTime(new Date(now.getTime() + 25 * 60 * 60 * 1000));

      await expect(verifyToken(token)).rejects.toThrow(problems.invalidToken());

      vi.useRealTimers();
    });
  });
});
