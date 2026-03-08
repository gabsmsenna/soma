"use server";

import { revalidatePath } from "next/cache";
import {
  createOperationSchema,
  updateOperationSchema,
} from "@/dtos/operation.dto";
import { AppError } from "@/lib/app-error";
import { getServerSession } from "@/lib/session";
import * as OperationService from "@/services/operation.service";
import type { ActionResult } from "@/types/action-result";

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

export async function createOperation(input: {
  name: string;
  freelancerCutPercentage: number;
}): Promise<ActionResult<{ id: string }>> {
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

    const parsed = createOperationSchema.safeParse(input);
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

    const created = await OperationService.createOperation(
      session.userId,
      parsed.data,
    );

    revalidatePath("/operacoes");
    return { success: true, data: { id: created.id } };
  } catch (error) {
    return errorResult(error);
  }
}

export async function updateOperation(
  id: string,
  input: { name?: string; freelancerCutPercentage?: number },
): Promise<ActionResult<{ id: string }>> {
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

    const parsed = updateOperationSchema.safeParse(input);
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

    const updated = await OperationService.updateOperation(
      id,
      session.userId,
      parsed.data,
    );

    revalidatePath("/operacoes");
    return { success: true, data: { id: updated.id } };
  } catch (error) {
    return errorResult(error);
  }
}

export async function deleteOperation(id: string): Promise<ActionResult<void>> {
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

    await OperationService.deleteOperation(id, session.userId);

    revalidatePath("/operacoes");
    return { success: true, data: undefined };
  } catch (error) {
    return errorResult(error);
  }
}
