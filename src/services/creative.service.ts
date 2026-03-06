import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { problems } from "@/lib/problem-registry";

export async function create(data: {
  name: string;
  totalProfit: Prisma.Decimal;
  operationId: string;
}) {
  const operation = await prisma.operation.findUnique({
    where: { id: data.operationId },
  });

  if (!operation) throw problems.resourceNotFound("Operação não encontrada");

  const freelancerCut = data.totalProfit
    .mul(operation.freelancerCutPercentage)
    .div(100);

  return prisma.creative.create({
    data: {
      name: data.name,
      totalProfit: data.totalProfit,
      freelancerCut,
      operationId: data.operationId,
    },
  });
}

export async function findById(id: string) {
  const creative = await prisma.creative.findUnique({
    where: { id },
    include: { operation: true },
  });

  if (!creative) throw problems.resourceNotFound("Criativo não encontrado");

  return creative;
}

export async function findByOperationId(operationId: string) {
  return prisma.creative.findMany({
    where: { operationId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findByOperationIdPaginated(
  operationId: string,
  page: number,
  limit: number,
) {
  const [data, total] = await Promise.all([
    prisma.creative.findMany({
      where: { operationId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.creative.count({ where: { operationId } }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function update(id: string, data: Prisma.CreativeUpdateInput) {
  return prisma.creative.update({ where: { id }, data });
}

export async function deleteCreative(id: string): Promise<void> {
  await prisma.creative.delete({ where: { id } });
}

export async function registerProfit(id: string, amount: Prisma.Decimal) {
  return prisma.$transaction(async (tx) => {
    const creative = await tx.creative.findUnique({
      where: { id },
      include: { operation: true },
    });

    if (!creative) throw problems.resourceNotFound("Criativo não encontrado");

    const previousTotal = creative.totalProfit;
    const newTotal = previousTotal.add(amount);
    const newFreelancerCut = newTotal
      .mul(creative.operation.freelancerCutPercentage)
      .div(100);

    await tx.profitEntry.create({
      data: {
        amount,
        previousTotal,
        newTotal,
        creativeId: id,
      },
    });

    return tx.creative.update({
      where: { id },
      data: {
        totalProfit: newTotal,
        freelancerCut: newFreelancerCut,
      },
      include: { operation: true },
    });
  });
}

export async function registerProfitPayment(
  creativeId: string,
  userId: string,
) {
  return prisma.$transaction(async (tx) => {
    const creative = await tx.creative.findUnique({
      where: { id: creativeId },
      include: { operation: true },
    });

    if (!creative) throw problems.resourceNotFound("Criativo não encontrado");

    const payment = await tx.profitPayment.create({
      data: {
        userId,
        creativeId,
        totalComissaoPaga: creative.freelancerCut.toNumber(),
        lucreTotalCriativo: creative.totalProfit.toNumber(),
        dataPagamento: new Date(),
      },
    });

    await tx.creative.update({
      where: { id: creativeId },
      data: { freelancerCut: new Prisma.Decimal(0) },
    });

    return payment;
  });
}

export async function findProfitPaymentsGroupedByOperation(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  const payments = await prisma.profitPayment.findMany({
    where: {
      userId,
      dataPagamento: { gte: startDate, lte: endDate },
    },
    include: {
      creative: { include: { operation: true } },
    },
    orderBy: { dataPagamento: "desc" },
  });

  const grouped = new Map<
    string,
    {
      operationId: string;
      operationName: string;
      totalLucro: number;
      totalComissao: number;
      creatives: {
        creativeId: string;
        creativeName: string;
        lucreTotalCriativo: number;
        totalComissaoPaga: number;
        dataPagamento: Date;
      }[];
    }
  >();

  for (const payment of payments) {
    const opId = payment.creative.operation.id;
    const opName = payment.creative.operation.name;

    if (!grouped.has(opId)) {
      grouped.set(opId, {
        operationId: opId,
        operationName: opName,
        totalLucro: 0,
        totalComissao: 0,
        creatives: [],
      });
    }

    const group = grouped.get(opId)!;
    group.totalLucro += payment.lucreTotalCriativo;
    group.totalComissao += payment.totalComissaoPaga;
    group.creatives.push({
      creativeId: payment.creativeId,
      creativeName: payment.creative.name,
      lucreTotalCriativo: payment.lucreTotalCriativo,
      totalComissaoPaga: payment.totalComissaoPaga,
      dataPagamento: payment.dataPagamento,
    });
  }

  return Array.from(grouped.values());
}

export async function findAllByUserId(
  userId: string,
  page: number,
  limit: number,
  search?: string,
  status: string = "active",
  operation: string = "all",
) {
  const where: Prisma.CreativeWhereInput = {
    operation: { userId },
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
    ...(status === "active"
      ? { isActive: true }
      : status === "inactive"
        ? { isActive: false }
        : {}),
    ...(operation !== "all" && operation ? { operationId: operation } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.creative.findMany({
      where,
      include: { operation: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.creative.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
