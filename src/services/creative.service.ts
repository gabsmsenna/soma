import type { Creative } from "@prisma/client";
import { Prisma } from "@prisma/client";
import type { CreateCreativeDto, UpdateCreativeDto } from "@/dtos/creative.dto";
import prisma from "@/lib/prisma";

export async function create(
  data: CreateCreativeDto & { projectId: string },
): Promise<Creative> {
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const totalProfit = data.totalProfit ?? new Prisma.Decimal("0");
  const freelancerCutPercentage = project.freelancerCutPercentage;
  const freelancerCut = totalProfit.mul(freelancerCutPercentage).div(100);

  return prisma.creative.create({
    data: {
      name: data.name,
      totalProfit,
      freelancerCut,
      projectId: data.projectId,
    },
  });
}

export async function findById(id: string) {
  const creative = await prisma.creative.findUnique({
    where: { id },
    include: { project: { include: { operation: true } } },
  });

  if (!creative) throw new Error("CREATIVE_NOT_FOUND");

  return creative;
}

export async function findByProjectId(projectId: string) {
  return prisma.creative.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
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

export async function verifyProjectOwnership(
  projectId: string,
  userId: string,
): Promise<void> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      operation: { userId },
    },
    include: { operation: true },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }
}
