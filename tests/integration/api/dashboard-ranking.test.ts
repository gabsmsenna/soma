import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { GET } from "@/app/api/dashboard/ranking/route";
import type { RankingResponse } from "@/dtos/dashboard.dto";
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

describe("Dashboard Ranking API (GET /api/dashboard/ranking)", () => {
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

    const hashedPassword = await bcrypt.hash("Password123!", 10);
    testUser = await prisma.user.create({
      data: {
        name: "Ranking User",
        email: "ranking@example.com",
        password: hashedPassword,
        cpf: "12345678909",
      },
    });

    validToken = await generateAuthToken(testUser.id, testUser.email, testUser.name);
  });

  it("deve retornar top 5 operações ordenadas por lucro DESC", async () => {
    const amounts = [500, 1000, 200, 3000, 800, 1500];

    for (let i = 0; i < amounts.length; i++) {
      const op = await prisma.operation.create({
        data: {
          name: `Operação ${i + 1}`,
          userId: testUser.id,
          freelancerCutPercentage: new Prisma.Decimal("10.00"),
        },
      });

      await prisma.creative.create({
        data: {
          name: `Criativo ${i + 1}`,
          totalProfit: new Prisma.Decimal(`${amounts[i] * 10}.00`),
          freelancerCut: new Prisma.Decimal(`${amounts[i]}.00`),
          operationId: op.id,
        },
      });
    }

    const request = createMockRequest(
      "http://localhost/api/dashboard/ranking",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${validToken}` },
      },
    );

    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await parseJsonResponse<RankingResponse>(response);

    // Deve retornar apenas 5
    expect(body.data.length).toBe(5);

    // Deve estar ordenado DESC
    expect(body.data[0].operationName).toBe("Operação 4"); // 3000
    expect(body.data[0].totalProfit).toBe(3000);
    expect(body.data[1].operationName).toBe("Operação 6"); // 1500
    expect(body.data[2].operationName).toBe("Operação 2"); // 1000

    // Verifica que os valores estão em ordem decrescente
    for (let i = 0; i < body.data.length - 1; i++) {
      expect(body.data[i].totalProfit).toBeGreaterThanOrEqual(
        body.data[i + 1].totalProfit,
      );
    }
  });

  it("deve retornar menos de 5 quando há poucas operações", async () => {
    const op = await prisma.operation.create({
      data: {
        name: "Única Operação",
        userId: testUser.id,
        freelancerCutPercentage: new Prisma.Decimal("10.00"),
      },
    });

    await prisma.creative.create({
      data: {
        name: "Único Criativo",
        totalProfit: new Prisma.Decimal("5000.00"),
        freelancerCut: new Prisma.Decimal("500.00"),
        operationId: op.id,
      },
    });

    const request = createMockRequest(
      "http://localhost/api/dashboard/ranking",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${validToken}` },
      },
    );

    const response = await GET(request);
    const body = await parseJsonResponse<RankingResponse>(response);

    expect(body.data.length).toBe(1);
    expect(body.data[0].operationName).toBe("Única Operação");
    expect(body.data[0].totalProfit).toBe(500);
  });

  it("deve retornar 401 sem token", async () => {
    const request = createMockRequest(
      "http://localhost/api/dashboard/ranking",
      { method: "GET" },
    );

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
