import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as ProfitReportService from "@/services/profit-report.service";
import {
  type createMockPrismaClient,
  mockPrismaFindMany,
} from "../../utils/mocks/prisma.mock";

vi.mock("@/lib/prisma", async () => {
  const { createMockPrismaClient } = await import(
    "../../utils/mocks/prisma.mock"
  );
  return {
    default: createMockPrismaClient(),
  };
});

const prisma = await import("@/lib/prisma");
const mockPrisma = prisma.default as unknown as ReturnType<
  typeof createMockPrismaClient
>;

const userId = "user-123";
const startDate = new Date("2026-03-01");
const endDate = new Date("2026-03-31");

function makeProfitEntry(overrides: Record<string, unknown> = {}) {
  return {
    id: "entry-1",
    totalProfit: 1000,
    commission: 100,
    creativeId: "creative-1",
    paidAt: new Date("2026-03-15"),
    creative: {
      id: "creative-1",
      name: "Criativo A",
      totalProfit: new Prisma.Decimal(0),
      freelancerCut: new Prisma.Decimal(0),
      isActive: true,
      operationId: "op-1",
      operation: {
        id: "op-1",
        name: "Operação Alpha",
        userId,
        freelancerCutPercentage: new Prisma.Decimal(10),
        active: true,
      },
    },
    ...overrides,
  };
}

function makeUnpaidCreative(overrides: Record<string, unknown> = {}) {
  return {
    id: "creative-unpaid",
    name: "Criativo Unpaid",
    totalProfit: new Prisma.Decimal(500),
    freelancerCut: new Prisma.Decimal(50),
    isActive: true,
    operationId: "op-1",
    operation: {
      id: "op-1",
      name: "Operação Alpha",
      userId,
      freelancerCutPercentage: new Prisma.Decimal(10),
      active: true,
    },
    ...overrides,
  };
}

describe("ProfitReportService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProfitReport", () => {
    it("deve retornar KPIs corretos a partir de entries pagos", async () => {
      const entries = [
        makeProfitEntry({ totalProfit: 1000, commission: 100 }),
        makeProfitEntry({
          id: "entry-2",
          creativeId: "creative-2",
          totalProfit: 2000,
          commission: 200,
          creative: {
            ...makeProfitEntry().creative,
            id: "creative-2",
            name: "Criativo B",
          },
        }),
      ];

      // Current period entries
      mockPrisma.profitEntry.findMany
        .mockResolvedValueOnce(entries) // current period
        .mockResolvedValueOnce([]); // previous period

      // Unpaid creatives
      mockPrisma.creative.findMany = mockPrismaFindMany([]);

      const result = await ProfitReportService.getProfitReport(
        userId,
        startDate,
        endDate,
      );

      expect(result.kpis.totalProfit).toBe(3000);
      expect(result.kpis.myProfit).toBe(300);
    });

    it("deve calcular percentChange comparando período atual vs anterior", async () => {
      const currentEntries = [
        makeProfitEntry({ totalProfit: 1000, commission: 100 }),
      ];
      const previousEntries = [
        makeProfitEntry({ totalProfit: 500, commission: 50 }),
      ];

      mockPrisma.profitEntry.findMany
        .mockResolvedValueOnce(currentEntries)
        .mockResolvedValueOnce(previousEntries);

      mockPrisma.creative.findMany = mockPrismaFindMany([]);

      const result = await ProfitReportService.getProfitReport(
        userId,
        startDate,
        endDate,
      );

      // (1000 - 500) / 500 * 100 = 100%
      expect(result.kpis.percentChange).toBe(100);
    });

    it("deve identificar topCreative (max profit) e bottomCreative (min profit)", async () => {
      const entries = [
        makeProfitEntry({
          totalProfit: 5000,
          commission: 500,
          creativeId: "c-top",
          creative: {
            ...makeProfitEntry().creative,
            id: "c-top",
            name: "Top Creative",
          },
        }),
        makeProfitEntry({
          totalProfit: 100,
          commission: 10,
          creativeId: "c-bottom",
          creative: {
            ...makeProfitEntry().creative,
            id: "c-bottom",
            name: "Bottom Creative",
          },
        }),
      ];

      mockPrisma.profitEntry.findMany
        .mockResolvedValueOnce(entries)
        .mockResolvedValueOnce([]);

      mockPrisma.creative.findMany = mockPrismaFindMany([]);

      const result = await ProfitReportService.getProfitReport(
        userId,
        startDate,
        endDate,
      );

      expect(result.kpis.topCreative).toEqual({
        name: "Top Creative",
        operationName: "Operação Alpha",
        totalProfit: 5000,
      });
      expect(result.kpis.bottomCreative).toEqual({
        name: "Bottom Creative",
        operationName: "Operação Alpha",
        totalProfit: 100,
      });
    });

    it("deve retornar null para top/bottom quando não há entries", async () => {
      mockPrisma.profitEntry.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      mockPrisma.creative.findMany = mockPrismaFindMany([]);

      const result = await ProfitReportService.getProfitReport(
        userId,
        startDate,
        endDate,
      );

      expect(result.kpis.topCreative).toBeNull();
      expect(result.kpis.bottomCreative).toBeNull();
    });

    it("deve agrupar entries pagos por operação", async () => {
      const entries = [
        makeProfitEntry({ totalProfit: 1000, commission: 100 }),
        makeProfitEntry({
          id: "entry-2",
          creativeId: "creative-2",
          totalProfit: 2000,
          commission: 200,
          creative: {
            id: "creative-2",
            name: "Criativo B",
            totalProfit: new Prisma.Decimal(0),
            freelancerCut: new Prisma.Decimal(0),
            isActive: true,
            operationId: "op-2",
            operation: {
              id: "op-2",
              name: "Operação Beta",
              userId,
              freelancerCutPercentage: new Prisma.Decimal(15),
              active: true,
            },
          },
        }),
      ];

      mockPrisma.profitEntry.findMany
        .mockResolvedValueOnce(entries)
        .mockResolvedValueOnce([]);

      mockPrisma.creative.findMany = mockPrismaFindMany([]);

      const result = await ProfitReportService.getProfitReport(
        userId,
        startDate,
        endDate,
      );

      expect(result.operations).toHaveLength(2);
      expect(result.operations[0].operationName).toBe("Operação Alpha");
      expect(result.operations[1].operationName).toBe("Operação Beta");
    });

    it("deve incluir criativos não pagos (totalProfit > 0) com isPaid: false", async () => {
      mockPrisma.profitEntry.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const unpaidCreative = makeUnpaidCreative();
      mockPrisma.creative.findMany = mockPrismaFindMany([unpaidCreative]);

      const result = await ProfitReportService.getProfitReport(
        userId,
        startDate,
        endDate,
      );

      expect(result.operations).toHaveLength(1);
      const creative = result.operations[0].creatives[0];
      expect(creative.isPaid).toBe(false);
      expect(creative.paidAt).toBeNull();
      expect(creative.totalProfit).toBe(500);
      expect(creative.commission).toBe(50);
    });

    it("deve calcular tendência por criativo via comparação de períodos", async () => {
      const currentEntries = [
        makeProfitEntry({
          creativeId: "c-1",
          totalProfit: 2000,
          commission: 200,
          creative: {
            ...makeProfitEntry().creative,
            id: "c-1",
            name: "Creative Rising",
          },
        }),
      ];
      const previousEntries = [
        makeProfitEntry({
          creativeId: "c-1",
          totalProfit: 1000,
          commission: 100,
          creative: {
            ...makeProfitEntry().creative,
            id: "c-1",
            name: "Creative Rising",
          },
        }),
      ];

      mockPrisma.profitEntry.findMany
        .mockResolvedValueOnce(currentEntries)
        .mockResolvedValueOnce(previousEntries);

      mockPrisma.creative.findMany = mockPrismaFindMany([]);

      const result = await ProfitReportService.getProfitReport(
        userId,
        startDate,
        endDate,
      );

      const creative = result.operations[0].creatives[0];
      expect(creative.trend).toBe("ascensao");
    });

    it('deve retornar "estavel" para criativos sem dados no período anterior', async () => {
      const currentEntries = [
        makeProfitEntry({ totalProfit: 1000, commission: 100 }),
      ];

      mockPrisma.profitEntry.findMany
        .mockResolvedValueOnce(currentEntries)
        .mockResolvedValueOnce([]); // no previous data

      mockPrisma.creative.findMany = mockPrismaFindMany([]);

      const result = await ProfitReportService.getProfitReport(
        userId,
        startDate,
        endDate,
      );

      const creative = result.operations[0].creatives[0];
      expect(creative.trend).toBe("estavel");
    });

    it("deve mesclar criativos pagos e não pagos na mesma operação", async () => {
      const paidEntry = makeProfitEntry({
        totalProfit: 1000,
        commission: 100,
      });

      const unpaidCreative = makeUnpaidCreative({
        id: "creative-unpaid",
        name: "Criativo Unpaid",
      });

      mockPrisma.profitEntry.findMany
        .mockResolvedValueOnce([paidEntry])
        .mockResolvedValueOnce([]);

      mockPrisma.creative.findMany = mockPrismaFindMany([unpaidCreative]);

      const result = await ProfitReportService.getProfitReport(
        userId,
        startDate,
        endDate,
      );

      // Both should be in the same operation group
      const opGroup = result.operations.find((op) => op.operationId === "op-1");
      expect(opGroup).toBeDefined();
      expect(opGroup?.creatives).toHaveLength(2);

      const paid = opGroup?.creatives.find((c) => c.isPaid);
      const unpaid = opGroup?.creatives.find((c) => !c.isPaid);
      expect(paid).toBeDefined();
      expect(unpaid).toBeDefined();
      expect(unpaid?.paidAt).toBeNull();
    });
  });
});
