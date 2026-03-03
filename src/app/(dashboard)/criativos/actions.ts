"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import { AppError } from "@/lib/app-error";
import { getServerSession } from "@/lib/session";
import * as CreativeService from "@/services/creative.service";
import { Prisma } from "@prisma/client";
import { toCreativeViewModel } from "./_mappers";
import type { ActionResult, CreativeViewModel } from "./_types";

const createCreativeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  totalProfit: z.number().positive("Lucro deve ser positivo"),
  projectId: z.string().min(1, "Projeto é obrigatório"),
});

const updateCreativeSchema = z.object({
  name: z.string().min(1).optional(),
  totalProfit: z.number().positive().optional(),
  isPaid: z.boolean().optional(),
});

function errorResult(error: unknown): ActionResult<never> {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        title: error.title,
        detail: error.detail ?? error.title,
        status: error.status,
      },
    };
  }
  return {
    success: false,
    error: {
      title: "Erro interno",
      detail: "Ocorreu um erro inesperado",
      status: 500,
    },
  };
}

export async function createCreative(input: {
  name: string;
  totalProfit: number;
  projectId: string;
}): Promise<ActionResult<CreativeViewModel>> {
  try {
    const session = await getServerSession();
    if (!session) {
      return {
        success: false,
        error: {
          title: "Não autorizado",
          detail: "Autenticação necessária",
          status: 401,
        },
      };
    }

    const parsed = createCreativeSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          title: "Dados inválidos",
          detail: parsed.error.issues[0]?.message ?? "Dados inválidos",
          status: 400,
        },
      };
    }

    await CreativeService.verifyProjectOwnership(
      parsed.data.projectId,
      session.userId,
    );

    const created = await CreativeService.create({
      name: parsed.data.name,
      totalProfit: new Prisma.Decimal(parsed.data.totalProfit),
      projectId: parsed.data.projectId,
    });

    const full = await CreativeService.findById(created.id);
    revalidatePath("/criativos");
    return { success: true, data: toCreativeViewModel(full) };
  } catch (error) {
    return errorResult(error);
  }
}

export async function updateCreative(
  id: string,
  input: { name?: string; totalProfit?: number; isPaid?: boolean },
): Promise<ActionResult<CreativeViewModel>> {
  try {
    const session = await getServerSession();
    if (!session) {
      return {
        success: false,
        error: {
          title: "Não autorizado",
          detail: "Autenticação necessária",
          status: 401,
        },
      };
    }

    const parsed = updateCreativeSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          title: "Dados inválidos",
          detail: parsed.error.issues[0]?.message ?? "Dados inválidos",
          status: 400,
        },
      };
    }

    const existing = await CreativeService.findById(id);
    if (existing.project.operation.userId !== session.userId) {
      return {
        success: false,
        error: {
          title: "Recurso não encontrado",
          detail: "Criativo não encontrado",
          status: 404,
        },
      };
    }

    await CreativeService.update(id, {
      ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
      ...(parsed.data.isPaid !== undefined
        ? { isPaid: parsed.data.isPaid }
        : {}),
      ...(parsed.data.totalProfit !== undefined
        ? { totalProfit: new Prisma.Decimal(parsed.data.totalProfit) }
        : {}),
    });

    const updated = await CreativeService.findById(id);
    revalidatePath("/criativos");
    return { success: true, data: toCreativeViewModel(updated) };
  } catch (error) {
    return errorResult(error);
  }
}

export async function deleteCreative(id: string): Promise<ActionResult<void>> {
  try {
    const session = await getServerSession();
    if (!session) {
      return {
        success: false,
        error: {
          title: "Não autorizado",
          detail: "Autenticação necessária",
          status: 401,
        },
      };
    }

    const existing = await CreativeService.findById(id);
    if (existing.project.operation.userId !== session.userId) {
      return {
        success: false,
        error: {
          title: "Recurso não encontrado",
          detail: "Criativo não encontrado",
          status: 404,
        },
      };
    }

    await CreativeService.deleteCreative(id);
    revalidatePath("/criativos");
    return { success: true, data: undefined };
  } catch (error) {
    return errorResult(error);
  }
}

export async function markAsPaid(
  id: string,
): Promise<ActionResult<CreativeViewModel>> {
  try {
    const session = await getServerSession();
    if (!session) {
      return {
        success: false,
        error: {
          title: "Não autorizado",
          detail: "Autenticação necessária",
          status: 401,
        },
      };
    }

    const existing = await CreativeService.findById(id);
    if (existing.project.operation.userId !== session.userId) {
      return {
        success: false,
        error: {
          title: "Recurso não encontrado",
          detail: "Criativo não encontrado",
          status: 404,
        },
      };
    }

    await CreativeService.update(id, { isPaid: true, paidAt: new Date() });
    const updated = await CreativeService.findById(id);
    revalidatePath("/criativos");
    return { success: true, data: toCreativeViewModel(updated) };
  } catch (error) {
    return errorResult(error);
  }
}
