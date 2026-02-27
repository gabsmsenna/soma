import type {
  CreateOperationDto,
  UpdateOperationDto,
} from "@/dtos/operation.dto";
import { problems } from "@/lib/problem-registry";
import prisma from "@/lib/prisma";

export async function getAll(userId: string) {
  return prisma.operation.findMany({
    where: { userId },
    include: { projects: true },
  });
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
