"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import z from "zod";
import { AppError } from "@/lib/app-error";
import { getServerSession } from "@/lib/session";
import * as CreativeService from "@/services/creative.service";
import { verifyOperationOwnership } from "@/services/operation.service";
import { toCreativeViewModel } from "./_mappers";
import type { ActionResult, CreativeViewModel } from "./_types";

const createCreativeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  totalProfit: z.number().positive("Lucro deve ser positivo"),
  operationId: z.string().min(1, "Operação é obrigatória"),
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
  operationId: string;
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

    await verifyOperationOwnership(
      parsed.data.operationId,
      session.userId,
    );

    const created = await CreativeService.create({
      name: parsed.data.name,
      totalProfit: new Prisma.Decimal(parsed.data.totalProfit),
      operationId: parsed.data.operationId,
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
    if (existing.operation.userId !== session.userId) {
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
    if (existing.operation.userId !== session.userId) {
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
    if (existing.operation.userId !== session.userId) {
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
