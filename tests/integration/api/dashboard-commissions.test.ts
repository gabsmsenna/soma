import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { GET } from "@/app/api/dashboard/commissions/route";
import { generateAuthToken } from "@/lib/generate-auth-token";
import type { CommissionsChartResponse } from "@/dtos/dashboard.dto";
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

describe("Dashboard Commissions API (GET /api/dashboard/commissions)", () => {
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
        name: "Commissions User",
        email: "commissions@example.com",
        password: hashedPassword,
        cpf: "12345678909",
      },
    });

    validToken = await generateAuthToken(testUser.id, testUser.email);
  });

  it("deve agrupar dados por mês corretamente", async () => {
    const operation = await prisma.operation.create({
      data: {
        name: "Op Chart",
        userId: testUser.id,
        freelancerCutPercentage: new Prisma.Decimal("10.00"),
      },
    });

    // Criativos em meses diferentes
    await prisma.creative.create({
      data: {
        name: "Jan Criativo",
        totalProfit: new Prisma.Decimal("1000.00"),
        freelancerCut: new Prisma.Decimal("100.00"),
        operationId: operation.id,
        createdAt: new Date(2026, 0, 15), // Janeiro
      },
    });

    await prisma.creative.create({
      data: {
        name: "Fev Criativo",
        totalProfit: new Prisma.Decimal("2000.00"),
        freelancerCut: new Prisma.Decimal("200.00"),
        operationId: operation.id,
        createdAt: new Date(2026, 1, 15), // Fevereiro
      },
    });

    const request = createMockRequest(
      "http://localhost/api/dashboard/commissions?period=monthly",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${validToken}` },
      },
    );

    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await parseJsonResponse<CommissionsChartResponse>(response);

    expect(body.period).toBe("monthly");
    expect(body.data.length).toBe(2);
    expect(body.data[0].totalProfit).toBe(1000);
    expect(body.data[0].myProfit).toBe(100);
    expect(body.data[1].totalProfit).toBe(2000);
    expect(body.data[1].myProfit).toBe(200);
  });

  it("deve agrupar dados por semana corretamente", async () => {
    const operation = await prisma.operation.create({
      data: {
        name: "Op Weekly",
        userId: testUser.id,
        freelancerCutPercentage: new Prisma.Decimal("10.00"),
      },
    });

    // Duas semanas diferentes no mesmo mês
    await prisma.creative.create({
      data: {
        name: "Semana 1",
        totalProfit: new Prisma.Decimal("500.00"),
        freelancerCut: new Prisma.Decimal("50.00"),
        operationId: operation.id,
        createdAt: new Date(2026, 0, 5), // primeira semana Jan
      },
    });

    await prisma.creative.create({
      data: {
        name: "Semana 2",
        totalProfit: new Prisma.Decimal("800.00"),
        freelancerCut: new Prisma.Decimal("80.00"),
        operationId: operation.id,
        createdAt: new Date(2026, 0, 19), // terceira semana Jan
      },
    });

    const request = createMockRequest(
      "http://localhost/api/dashboard/commissions?period=weekly",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${validToken}` },
      },
    );

    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await parseJsonResponse<CommissionsChartResponse>(response);

    expect(body.period).toBe("weekly");
    expect(body.data.length).toBeGreaterThanOrEqual(2);
  });

  it("deve retornar 400 com period inválido", async () => {
    const request = createMockRequest(
      "http://localhost/api/dashboard/commissions?period=invalid",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${validToken}` },
      },
    );

    const response = await GET(request);
    expect(response.status).toBe(400);
  });

  it("deve retornar 401 sem token", async () => {
    const request = createMockRequest(
      "http://localhost/api/dashboard/commissions?period=monthly",
      { method: "GET" },
    );

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
