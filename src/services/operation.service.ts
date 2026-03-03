import type {
  CreateOperationDto,
  UpdateOperationDto,
} from "@/dtos/operation.dto";
import prisma from "@/lib/prisma";
import { problems } from "@/lib/problem-registry";

export async function getAll(userId: string) {
  return prisma.operation.findMany({
    where: { userId },
    include: { projects: true },
  });
}

export async function getAllPaginated(
  userId: string,
  page: number,
  limit: number,
) {
  const [data, total] = await Promise.all([
    prisma.operation.findMany({
      where: { userId },
      include: { projects: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.operation.count({ where: { userId } }),
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
    where: { id, userId },
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
    where: { id, userId },
  });
  if (!operation) {
    throw problems.resourceNotFound("Operação não encontrada");
  }
  return prisma.operation.delete({
    where: { id },
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
