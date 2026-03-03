import type { Creative } from "@prisma/client";
import { Prisma } from "@prisma/client";
import type { CreateCreativeDto, UpdateCreativeDto } from "@/dtos/creative.dto";
import prisma from "@/lib/prisma";
import { problems } from "@/lib/problem-registry";

export async function create(
  data: CreateCreativeDto & { operationId: string },
): Promise<Creative> {
  const operation = await prisma.operation.findUnique({
    where: { id: data.operationId },
  });

  if (!operation) {
    throw problems.resourceNotFound("Operação não encontrada");
  }

  const totalProfit = data.totalProfit ?? new Prisma.Decimal("0");
  const freelancerCutPercentage = operation.freelancerCutPercentage;
  const freelancerCut = totalProfit.mul(freelancerCutPercentage).div(100);

  return prisma.creative.create({
    data: {
      name: data.name,
      totalProfit,
      freelancerCut,
      isActive: data.isActive ?? true,
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

export async function update(
  id: string,
  data: UpdateCreativeDto,
): Promise<Creative> {
  return prisma.creative.update({ where: { id }, data });
}

export async function deleteCreative(id: string): Promise<void> {
  await prisma.creative.delete({ where: { id } });
}

export async function verifyOperationOwnership(
  operationId: string,
  userId: string,
): Promise<void> {
  const operation = await prisma.operation.findFirst({
    where: {
      id: operationId,
      userId,
    },
  });

  if (!operation) {
    throw problems.resourceNotFound("Operação não encontrada");
  }
}
