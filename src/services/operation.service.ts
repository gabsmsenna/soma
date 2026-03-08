import type { Creative, Operation, Prisma } from "@prisma/client";
import type {
  CreateOperationDto,
  UpdateOperationDto,
} from "@/dtos/operation.dto";
import prisma from "@/lib/prisma";
import { problems } from "@/lib/problem-registry";

type OperationWithRelations = Operation & {
  creatives: Creative[];
};

function serializeOperation(operation: OperationWithRelations) {
  return {
    id: operation.id,
    name: operation.name,
    freelancerCutPercentage: operation.freelancerCutPercentage.toString(),
    active: operation.active,
    userId: operation.userId,
    createdAt: operation.createdAt.toISOString(),
    updatedAt: operation.updatedAt.toISOString(),
    creatives: operation.creatives.map((c) => ({
      id: c.id,
      name: c.name,
      totalProfit: c.totalProfit.toString(),
      freelancerCut: c.freelancerCut.toString(),
      isActive: c.isActive,
      isPaid: c.isPaid,
      paidAt: c.paidAt ? c.paidAt.toISOString() : null,
      operationId: c.operationId,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
  };
}

export async function getAll(userId: string) {
  const operations = await prisma.operation.findMany({
    where: { userId, active: true },
    include: { creatives: true },
  });
  return operations.map(serializeOperation);
}

export async function getAllPaginated(
  userId: string,
  page: number,
  limit: number,
  search?: string,
  status: string = "active",
) {
  const where: Prisma.OperationWhereInput = {
    userId,
    ...(status === "active"
      ? { active: true }
      : status === "inactive"
        ? { active: false }
        : {}),
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.operation.findMany({
      where,
      include: { creatives: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.operation.count({ where }),
  ]);

  return {
    data: data.map(serializeOperation),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function createOperation(
  userId: string,
  data: CreateOperationDto,
) {
  return prisma.operation.create({
    data: { ...data, userId },
  });
}

export async function updateOperation(
  id: string,
  userId: string,
  data: UpdateOperationDto,
) {
  const operation = await prisma.operation.findFirst({
    where: { id, userId, active: true },
  });
  if (!operation) {
    throw problems.resourceNotFound("Operação não encontrada");
  }
  return prisma.operation.update({
    where: { id },
    data,
  });
}

export async function deleteOperation(id: string, userId: string) {
  const operation = await prisma.operation.findFirst({
    where: { id, userId, active: true },
  });
  if (!operation) {
    throw problems.resourceNotFound("Operação não encontrada");
  }
  return prisma.operation.update({
    where: { id },
    data: { active: false },
  });
}

export async function verifyOperationOwnership(
  operationId: string,
  userId: string,
): Promise<void> {
  const operation = await prisma.operation.findUnique({
    where: { id: operationId, userId },
  });

  if (!operation) {
    throw problems.resourceNotFound("Operação não encontrada");
  }
}
