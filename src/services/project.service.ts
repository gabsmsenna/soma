import type { CreateProjectDto, UpdateProjectDto } from "@/dtos/project.dto";
import prisma from "@/lib/prisma";

export class ProjectService {
  static async create(data: CreateProjectDto) {
    const project = await prisma.project.create({
      data,
    });
    return project;
  }

  static async findById(id: string) {
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

  static async findByOperationId(operationId: string) {
    const projects = await prisma.project.findMany({
      where: { operationId },
      include: {
        creatives: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return projects;
  }

  static async update(id: string, data: UpdateProjectDto) {
    const project = await prisma.project.update({
      where: { id },
      data,
    });
    return project;
  }

  static async delete(id: string) {
    await prisma.project.delete({
      where: { id },
    });
  }
}
