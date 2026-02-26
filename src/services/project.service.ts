import type { CreateProjectDto, UpdateProjectDto } from "@/dtos/project.dto";
import prisma from "@/lib/prisma";

export async function create(data: CreateProjectDto) {
  const project = await prisma.project.create({
    data,
  });
  return project;
}

export async function findById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      operation: true,
      creatives: true,
    },
  });
  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }
  return project;
}

export async function findByOperationId(operationId: string) {
  const projects = await prisma.project.findMany({
    where: { operationId },
    include: {
      creatives: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return projects;
}

export async function update(id: string, data: UpdateProjectDto) {
  const project = await prisma.project.update({
    where: { id },
    data,
  });
  return project;
}

export async function deleteProject(id: string) {
  await prisma.project.delete({
    where: { id },
  });
}
