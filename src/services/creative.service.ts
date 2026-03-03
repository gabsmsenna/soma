import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { problems } from "@/lib/problem-registry";

export async function create(data: {
  name: string;
  totalProfit: Prisma.Decimal;
  projectId: string;
}) {
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
  });

  if (!project) throw problems.resourceNotFound("Projeto não encontrado");

  const freelancerCut = data.totalProfit
    .mul(project.freelancerCutPercentage)
    .div(100);

  return prisma.creative.create({
    data: {
      name: data.name,
      totalProfit: data.totalProfit,
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

  if (!creative) throw problems.resourceNotFound("Criativo não encontrado");

  return creative;
}

export async function findByProjectId(projectId: string) {
  return prisma.creative.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findByProjectIdPaginated(
  projectId: string,
  page: number,
  limit: number,
) {
  const [data, total] = await Promise.all([
    prisma.creative.findMany({
      where: { projectId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.creative.count({ where: { projectId } }),
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

export async function update(id: string, data: Prisma.CreativeUpdateInput) {
  return prisma.creative.update({ where: { id }, data });
}

export async function deleteCreative(id: string): Promise<void> {
  await prisma.creative.delete({ where: { id } });
}

export async function findAllByUserId(
  userId: string,
  page: number,
  limit: number,
  search?: string,
) {
  const where = {
    project: { operation: { userId } },
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.creative.findMany({
      where,
      include: { project: { include: { operation: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.creative.count({ where }),
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

export async function verifyProjectOwnership(
  projectId: string,
  userId: string,
): Promise<void> {
  const project = await prisma.project.findFirst({
    where: { id: projectId, operation: { userId } },
    include: { operation: true },
  });

  if (!project) throw problems.resourceNotFound("Projeto não encontrado");
}
