import { Prisma } from "@prisma/client";
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

  return prisma.$transaction(async (tx) => {
    const creative = await tx.creative.create({
      data: {
        name: data.name,
        totalProfit: data.totalProfit,
        freelancerCut,
        operationId: data.operationId,
      },
    });

    if (Number(data.totalProfit) > 0) {
      await tx.profitLog.create({
        data: {
          amount: data.totalProfit,
          creativeId: creative.id,
        },
      });
    }

    return creative;
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

    const newTotal = creative.totalProfit.add(amount);
    const newFreelancerCut = newTotal
      .mul(creative.operation.freelancerCutPercentage)
      .div(100);

    await tx.profitLog.create({
      data: {
        amount,
        creativeId: id,
      },
    });

    return tx.creative.update({
      where: { id },
      data: {
        totalProfit: newTotal,
        freelancerCut: newFreelancerCut,
        isPaid: false,
      },
      include: { operation: true },
    });
  });
}

export async function registerProfitPayment(creativeId: string) {
  return prisma.$transaction(async (tx) => {
    const creative = await tx.creative.findUnique({
      where: { id: creativeId },
      include: { operation: true },
    });

    if (!creative) throw problems.resourceNotFound("Criativo não encontrado");

    const payment = await tx.profitEntry.create({
      data: {
        lucreTotalCriativo: creative.totalProfit.toNumber(),
        comissaoFreelancer: creative.freelancerCut.toNumber(),
        creativeId,
        dataPagamento: new Date(),
      },
    });

    await tx.creative.update({
      where: { id: creativeId },
      data: {
        totalProfit: new Prisma.Decimal(0),
        freelancerCut: new Prisma.Decimal(0),
        isPaid: true,
      },
    });

    return payment;
  });
}

export async function findProfitPaymentsGroupedByOperation(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  const entries = await prisma.profitEntry.findMany({
    where: {
      dataPagamento: { gte: startDate, lte: endDate },
      creative: { operation: { userId } },
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
        comissaoFreelancer: number;
        dataPagamento: Date;
      }[];
    }
  >();

  for (const entry of entries) {
    const opId = entry.creative.operation.id;
    const opName = entry.creative.operation.name;

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
    group.totalLucro += entry.lucreTotalCriativo;
    group.totalComissao += entry.comissaoFreelancer;
    group.creatives.push({
      creativeId: entry.creativeId,
      creativeName: entry.creative.name,
      lucreTotalCriativo: entry.lucreTotalCriativo,
      comissaoFreelancer: entry.comissaoFreelancer,
      dataPagamento: entry.dataPagamento,
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
  paymentStatus: string = "all",
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
    ...(paymentStatus === "paid"
      ? { isPaid: true }
      : paymentStatus === "unpaid"
        ? { isPaid: false }
        : {}),
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
