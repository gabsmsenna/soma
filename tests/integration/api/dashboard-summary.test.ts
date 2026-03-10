import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { GET } from "@/app/api/dashboard/summary/route";
import type { SummaryResponse } from "@/dtos/dashboard.dto";
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

describe("Dashboard Summary API (GET /api/dashboard/summary)", () => {
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
        name: "Dashboard User",
        email: "dashboard@example.com",
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

  it("deve retornar métricas com trend up quando mês atual > mês anterior", async () => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 15);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

    const operation = await prisma.operation.create({
      data: {
        name: "Op Dashboard",
        userId: testUser.id,
        freelancerCutPercentage: new Prisma.Decimal("10.00"),
      },
    });

    // Mês anterior: totalProfit=1000, freelancerCut=100
    await prisma.creative.create({
      data: {
        name: "Criativo Anterior",
        totalProfit: new Prisma.Decimal("1000.00"),
        freelancerCut: new Prisma.Decimal("100.00"),
        isActive: true,
        operationId: operation.id,
        createdAt: lastMonth,
      },
    });

    // Mês atual: totalProfit=2000, freelancerCut=200
    await prisma.creative.create({
      data: {
        name: "Criativo Atual",
        totalProfit: new Prisma.Decimal("2000.00"),
        freelancerCut: new Prisma.Decimal("200.00"),
        isActive: true,
        operationId: operation.id,
        createdAt: currentMonth,
      },
    });

    const request = createMockRequest(
      "http://localhost/api/dashboard/summary",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${validToken}` },
      },
    );

    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await parseJsonResponse<SummaryResponse>(response);

    // totalProfit: current=2000, previous=1000 → +100%
    expect(body.totalProfit.value).toBe(2000);
    expect(body.totalProfit.percentChange).toBe(100);
    expect(body.totalProfit.trend).toBe("up");

    // myProfit (freelancerCut): current=200, previous=100 → +100%
    expect(body.myProfit.value).toBe(200);
    expect(body.myProfit.percentChange).toBe(100);
    expect(body.myProfit.trend).toBe("up");

    // activeCreatives: 2 ativos
    expect(body.activeCreatives.value).toBe(2);
  });

  it("deve retornar trend down quando mês atual < mês anterior", async () => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 15);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

    const operation = await prisma.operation.create({
      data: {
        name: "Op Down",
        userId: testUser.id,
        freelancerCutPercentage: new Prisma.Decimal("10.00"),
      },
    });

    // Mês anterior: mais lucro
    await prisma.creative.create({
      data: {
        name: "Criativo Anterior Grande",
        totalProfit: new Prisma.Decimal("5000.00"),
        freelancerCut: new Prisma.Decimal("500.00"),
        isActive: true,
        operationId: operation.id,
        createdAt: lastMonth,
      },
    });

    // Mês atual: menos lucro
    await prisma.creative.create({
      data: {
        name: "Criativo Atual Menor",
        totalProfit: new Prisma.Decimal("2000.00"),
        freelancerCut: new Prisma.Decimal("200.00"),
        isActive: true,
        operationId: operation.id,
        createdAt: currentMonth,
      },
    });

    const request = createMockRequest(
      "http://localhost/api/dashboard/summary",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${validToken}` },
      },
    );

    const response = await GET(request);
    const body = await parseJsonResponse<SummaryResponse>(response);

    expect(body.totalProfit.trend).toBe("down");
    expect(body.totalProfit.percentChange).toBe(-60);

    expect(body.myProfit.trend).toBe("down");
    expect(body.myProfit.percentChange).toBe(-60);
  });

  it("deve retornar zeros quando não há dados", async () => {
    const request = createMockRequest(
      "http://localhost/api/dashboard/summary",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${validToken}` },
      },
    );

    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await parseJsonResponse<SummaryResponse>(response);

    expect(body.totalProfit.value).toBe(0);
    expect(body.totalProfit.percentChange).toBe(0);
    expect(body.totalProfit.trend).toBe("neutral");

    expect(body.myProfit.value).toBe(0);
    expect(body.myProfit.percentChange).toBe(0);
    expect(body.myProfit.trend).toBe("neutral");

    expect(body.activeCreatives.value).toBe(0);
  });

  it("deve retornar 401 sem token", async () => {
    const request = createMockRequest(
      "http://localhost/api/dashboard/summary",
      { method: "GET" },
    );

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
