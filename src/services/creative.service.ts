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
