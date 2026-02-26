import type {
  CreateOperationDto,
  UpdateOperationDto,
} from "@/dtos/operation.dto";
import prisma from "@/lib/prisma";

export class OperationService {
  static async getAll(userId: string) {
    return prisma.operation.findMany({
      where: { userId },
      include: { projects: true }, // opcional, incluir projetos se quiser
    });
  }

  static async create(userId: string, data: CreateOperationDto) {
    return prisma.operation.create({
      data: { ...data, userId },
    });
  }

  static async update(id: string, userId: string, data: UpdateOperationDto) {
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

  static async delete(id: string, userId: string) {
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
}
