import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    profitEntry: { findMany: vi.fn() },
    creative: { findMany: vi.fn() },
  },
}));

import prisma from "@/lib/prisma";
import { getProfitReport } from "./profit-report.service";

const mockProfitEntryFindMany = vi.mocked(prisma.profitEntry.findMany);
const mockCreativeFindMany = vi.mocked(prisma.creative.findMany);

describe("getProfitReport", () => {
  const userId = "user-1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty kpis and operations when no data exists", async () => {
    mockProfitEntryFindMany.mockResolvedValue([]);
    mockCreativeFindMany.mockResolvedValue([]);

    const result = await getProfitReport(
      userId,
      new Date("2026-03-01"),
      new Date("2026-03-08"),
    );

    expect(result.kpis.totalProfit).toBe(0);
    expect(result.kpis.myProfit).toBe(0);
    expect(result.kpis.percentChange).toBe(0);
    expect(result.kpis.topCreative).toBeNull();
    expect(result.kpis.bottomCreative).toBeNull();
    expect(result.operations).toHaveLength(0);
  });

  it("should use date-fns subDays for previous period calculation", async () => {
    mockProfitEntryFindMany.mockResolvedValue([]);
    mockCreativeFindMany.mockResolvedValue([]);

    const start = new Date("2026-03-01");
    const end = new Date("2026-03-08");

    await getProfitReport(userId, start, end);

    // Previous period query (second call) should use correct calendar dates
    const prevCall = mockProfitEntryFindMany.mock.calls[1];
    const prevWhere = prevCall[0]?.where as {
      paidAt: { gte: Date; lte: Date };
    };

    // 7 days period → previous should be Feb 22 to Mar 01
    expect(prevWhere.paidAt.gte).toEqual(new Date("2026-02-22"));
    expect(prevWhere.paidAt.lte).toEqual(new Date("2026-03-01"));
  });

  it("should consolidate multiple entries per creative into a single row", async () => {
    const operation = {
      id: "op-1",
      name: "Op 1",
      freelancerCutPercentage: 50,
      userId,
    };
    const creative = { id: "c-1", name: "Creative 1", operation };

    mockProfitEntryFindMany
      .mockResolvedValueOnce([
        // Current period: two entries for the same creative
        {
          id: "e-1",
          creativeId: "c-1",
          totalProfit: 100,
          commission: 50,
          paidAt: new Date("2026-03-02"),
          creative,
        },
        {
          id: "e-2",
          creativeId: "c-1",
          totalProfit: 200,
          commission: 100,
          paidAt: new Date("2026-03-03"),
          creative,
        },
      ] as never)
      .mockResolvedValueOnce([] as never);

    mockCreativeFindMany.mockResolvedValue([]);

    const result = await getProfitReport(
      userId,
      new Date("2026-03-01"),
      new Date("2026-03-08"),
    );

    // Should have one operation group with ONE creative entry (consolidated)
    expect(result.operations).toHaveLength(1);
    expect(result.operations[0].creatives).toHaveLength(1);
    expect(result.operations[0].creatives[0].totalProfit).toBe(300);
    expect(result.operations[0].creatives[0].commission).toBe(150);
  });

  it("should compute trend using aggregated current total vs aggregated previous total", async () => {
    const operation = {
      id: "op-1",
      name: "Op 1",
      freelancerCutPercentage: 50,
      userId,
    };
    const creative = { id: "c-1", name: "Creative 1", operation };

    mockProfitEntryFindMany
      .mockResolvedValueOnce([
        // Current: two entries summing to 500 (each individually > 200 prev)
        {
          id: "e-1",
          creativeId: "c-1",
          totalProfit: 250,
          commission: 125,
          paidAt: new Date("2026-03-02"),
          creative,
        },
        {
          id: "e-2",
          creativeId: "c-1",
          totalProfit: 250,
          commission: 125,
          paidAt: new Date("2026-03-03"),
          creative,
        },
      ] as never)
      .mockResolvedValueOnce([
        // Previous: total of 200
        {
          id: "e-3",
          creativeId: "c-1",
          totalProfit: 200,
          commission: 100,
          paidAt: new Date("2026-02-25"),
          creative,
        },
      ] as never);

    mockCreativeFindMany.mockResolvedValue([]);

    const result = await getProfitReport(
      userId,
      new Date("2026-03-01"),
      new Date("2026-03-08"),
    );

    // 500 (aggregated current) > 200 (previous) → ascensao
    // Bug: old code would compare each entry (250) vs 200 individually
    expect(result.operations[0].creatives[0].trend).toBe("ascensao");
  });

  it("should compute KPIs correctly with percentChange", async () => {
    const operation = {
      id: "op-1",
      name: "Op 1",
      freelancerCutPercentage: 50,
      userId,
    };
    const creative = { id: "c-1", name: "Creative 1", operation };

    mockProfitEntryFindMany
      .mockResolvedValueOnce([
        {
          id: "e-1",
          creativeId: "c-1",
          totalProfit: 300,
          commission: 150,
          paidAt: new Date("2026-03-02"),
          creative,
        },
      ] as never)
      .mockResolvedValueOnce([
        {
          id: "e-2",
          creativeId: "c-1",
          totalProfit: 200,
          commission: 100,
          paidAt: new Date("2026-02-25"),
          creative,
        },
      ] as never);

    mockCreativeFindMany.mockResolvedValue([]);

    const result = await getProfitReport(
      userId,
      new Date("2026-03-01"),
      new Date("2026-03-08"),
    );

    expect(result.kpis.totalProfit).toBe(300);
    expect(result.kpis.myProfit).toBe(150);
    expect(result.kpis.percentChange).toBe(50); // (300-200)/200 * 100 = 50%
  });

  it("should not duplicate unpaid creatives that already have paid entries", async () => {
    const operation = {
      id: "op-1",
      name: "Op 1",
      freelancerCutPercentage: 50,
      userId,
    };
    const creative = { id: "c-1", name: "Creative 1", operation };

    mockProfitEntryFindMany
      .mockResolvedValueOnce([
        {
          id: "e-1",
          creativeId: "c-1",
          totalProfit: 100,
          commission: 50,
          paidAt: new Date("2026-03-02"),
          creative,
        },
      ] as never)
      .mockResolvedValueOnce([] as never);

    // Same creative appears as unpaid too
    mockCreativeFindMany.mockResolvedValue([
      {
        id: "c-1",
        name: "Creative 1",
        totalProfit: 100,
        freelancerCut: 50,
        isActive: true,
        operationId: "op-1",
        operation,
      },
    ] as never);

    const result = await getProfitReport(
      userId,
      new Date("2026-03-01"),
      new Date("2026-03-08"),
    );

    // Should only have 1 creative entry (paid), not duplicated
    expect(result.operations[0].creatives).toHaveLength(1);
    expect(result.operations[0].creatives[0].isPaid).toBe(true);
  });

  it("should add unpaid creatives to their operation group", async () => {
    const operation = {
      id: "op-1",
      name: "Op 1",
      freelancerCutPercentage: 50,
      userId,
    };

    mockProfitEntryFindMany
      .mockResolvedValueOnce([] as never)
      .mockResolvedValueOnce([] as never);

    mockCreativeFindMany.mockResolvedValue([
      {
        id: "c-1",
        name: "Unpaid Creative",
        totalProfit: 500,
        freelancerCut: 250,
        isActive: true,
        operationId: "op-1",
        operation,
      },
    ] as never);

    const result = await getProfitReport(
      userId,
      new Date("2026-03-01"),
      new Date("2026-03-08"),
    );

    expect(result.operations).toHaveLength(1);
    expect(result.operations[0].creatives[0].isPaid).toBe(false);
    expect(result.operations[0].creatives[0].totalProfit).toBe(500);
    expect(result.operations[0].creatives[0].trend).toBe("estavel");
  });

  it("should identify top and bottom creatives", async () => {
    const operation = {
      id: "op-1",
      name: "Op 1",
      freelancerCutPercentage: 50,
      userId,
    };

    mockProfitEntryFindMany
      .mockResolvedValueOnce([
        {
          id: "e-1",
          creativeId: "c-1",
          totalProfit: 100,
          commission: 50,
          paidAt: new Date("2026-03-02"),
          creative: { id: "c-1", name: "Low", operation },
        },
        {
          id: "e-2",
          creativeId: "c-2",
          totalProfit: 500,
          commission: 250,
          paidAt: new Date("2026-03-03"),
          creative: { id: "c-2", name: "High", operation },
        },
      ] as never)
      .mockResolvedValueOnce([] as never);

    mockCreativeFindMany.mockResolvedValue([]);

    const result = await getProfitReport(
      userId,
      new Date("2026-03-01"),
      new Date("2026-03-08"),
    );

    expect(result.kpis.topCreative?.name).toBe("High");
    expect(result.kpis.topCreative?.totalProfit).toBe(500);
    expect(result.kpis.bottomCreative?.name).toBe("Low");
    expect(result.kpis.bottomCreative?.totalProfit).toBe(100);
  });
});
