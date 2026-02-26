import type {
  CreateOperationDto,
  UpdateOperationDto,
} from "@/dtos/operation.dto";
import prisma from "@/lib/prisma";

export async function getAll(userId: string) {
  return prisma.operation.findMany({
    where: { userId },
    include: { projects: true }, // opcional, incluir projetos se quiser
  });
}

export async function createOperation(userId: string, data: CreateOperationDto) {
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
    throw new Error("OPERATION_NOT_FOUND");
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
    throw new Error("OPERATION_NOT_FOUND");
  }
  return prisma.operation.delete({
    where: { id },
  });
}
