import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/dashboard/goals/route";
import { generateAuthToken } from "@/lib/generate-auth-token";
import type { GoalResponse } from "@/dtos/dashboard.dto";
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

describe("Dashboard Goals API (/api/dashboard/goals)", () => {
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
                name: "Goals User",
                email: "goals@example.com",
                password: hashedPassword,
                cpf: "12345678909",
            },
        });

        validToken = await generateAuthToken(testUser.id, testUser.email);
    });

    describe("POST /api/dashboard/goals", () => {
        it("deve criar nova meta mensal", async () => {
            const request = createMockRequest(
                "http://localhost/api/dashboard/goals",
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${validToken}` },
                    body: { amount: 10000 },
                },
            );

            const response = await POST(request);
            expect(response.status).toBe(200);

            const body = await parseJsonResponse<any>(response);
            expect(Number(body.amount)).toBe(10000);

            // Tem que persistir no banco
            const goal = await prisma.monthlyGoal.findFirst({
                where: { userId: testUser.id },
            });
            expect(goal).toBeDefined();
            expect(Number(goal!.amount)).toBe(10000);
        });

        it("deve atualizar meta existente via upsert", async () => {
            // Criar meta primeiro
            const now = new Date();
            await prisma.monthlyGoal.create({
                data: {
                    userId: testUser.id,
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                    amount: new Prisma.Decimal("5000.00"),
                },
            });

            // Atualizar via POST
            const request = createMockRequest(
                "http://localhost/api/dashboard/goals",
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${validToken}` },
                    body: { amount: 15000 },
                },
            );

            const response = await POST(request);
            expect(response.status).toBe(200);

            const body = await parseJsonResponse<any>(response);
            expect(Number(body.amount)).toBe(15000);

            // Verificar que não duplicou
            const goals = await prisma.monthlyGoal.findMany({
                where: { userId: testUser.id },
            });
            expect(goals.length).toBe(1);
        });

        it("deve retornar 401 sem token", async () => {
            const request = createMockRequest(
                "http://localhost/api/dashboard/goals",
                {
                    method: "POST",
                    body: { amount: 10000 },
                },
            );

            const response = await POST(request);
            expect(response.status).toBe(401);
        });
    });

    describe("GET /api/dashboard/goals", () => {
        it("deve retornar meta e progresso calculado", async () => {
            const now = new Date();
            const currentMonth = new Date(now.getFullYear(), now.getMonth(), 15);

            // Criar meta
            await prisma.monthlyGoal.create({
                data: {
                    userId: testUser.id,
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                    amount: new Prisma.Decimal("10000.00"),
                },
            });

            // Criar criativos no mês atual
            const operation = await prisma.operation.create({
                data: { name: "Op Goals", userId: testUser.id },
            });

            const project = await prisma.project.create({
                data: {
                    name: "Projeto Goals",
                    freelancerCutPercentage: new Prisma.Decimal("10.00"),
                    isActive: true,
                    operationId: operation.id,
                },
            });

            await prisma.creative.create({
                data: {
                    name: "Criativo Meta",
                    totalProfit: new Prisma.Decimal("50000.00"),
                    freelancerCut: new Prisma.Decimal("7500.00"),
                    projectId: project.id,
                    createdAt: currentMonth,
                },
            });

            const request = createMockRequest(
                "http://localhost/api/dashboard/goals",
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${validToken}` },
                },
            );

            const response = await GET(request);
            expect(response.status).toBe(200);

            const body = await parseJsonResponse<GoalResponse>(response);

            expect(body.goal).toBe(10000);
            expect(body.achieved).toBe(7500);
            expect(body.remaining).toBe(2500);
            expect(body.percentAchieved).toBe(75);
        });

        it("deve retornar goal null quando não há meta cadastrada", async () => {
            const request = createMockRequest(
                "http://localhost/api/dashboard/goals",
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${validToken}` },
                },
            );

            const response = await GET(request);
            expect(response.status).toBe(200);

            const body = await parseJsonResponse<GoalResponse>(response);

            expect(body.goal).toBeNull();
            expect(body.achieved).toBe(0);
            expect(body.remaining).toBe(0);
            expect(body.percentAchieved).toBe(0);
        });

        it("deve retornar 401 sem token", async () => {
            const request = createMockRequest(
                "http://localhost/api/dashboard/goals",
                { method: "GET" },
            );

            const response = await GET(request);
            expect(response.status).toBe(401);
        });
    });
});
