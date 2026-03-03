import type { Prisma } from "@prisma/client";
import type { UpdateProjectDto } from "@/dtos/project.dto";
import prisma from "@/lib/prisma";
import { problems } from "@/lib/problem-registry";

export async function create(data: Prisma.ProjectUncheckedCreateInput) {
  return prisma.project.create({ data });
}

export async function findById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { operation: true, creatives: true },
  });

  if (!project) throw problems.resourceNotFound("Projeto não encontrado");

  return project;
}

export async function findByOperationId(operationId: string) {
  return prisma.project.findMany({
    where: { operationId },
    include: { creatives: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function findByOperationIdPaginated(
  operationId: string,
  page: number,
  limit: number,
) {
  const [data, total] = await Promise.all([
    prisma.project.findMany({
      where: { operationId },
      include: { creatives: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.count({ where: { operationId } }),
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

export async function update(id: string, data: UpdateProjectDto) {
  return prisma.project.update({ where: { id }, data });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}
