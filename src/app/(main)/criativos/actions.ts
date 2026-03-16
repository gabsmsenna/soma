"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { ZodSchema } from "zod";
import { AppError } from "@/lib/app-error";
import { getServerSession } from "@/lib/session";
import * as CreativeService from "@/services/creative.service";
import { verifyOperationOwnership } from "@/services/operation.service";
import type { ActionResult } from "@/types/action-result";
import { toCreativeViewModel } from "./_mappers";
import {
  createCreativeSchema,
  registerProfitSchema,
  updateCreativeSchema,
} from "./_schemas";
import type { CreativeViewModel } from "./_types";

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

async function requireSession(): Promise<
  ActionResult<never> | { userId: string }
> {
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
  return session;
}

function isErrorResult<T>(
  result: ActionResult<never> | T,
): result is ActionResult<never> {
  return (
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    (result as ActionResult<never>).success === false
  );
}

async function verifyCreativeOwnership(
  creativeId: string,
  userId: string,
): Promise<
  ActionResult<never> | Awaited<ReturnType<typeof CreativeService.findById>>
> {
  const existing = await CreativeService.findById(creativeId);
  if (existing.operation.userId !== userId) {
    return {
      success: false,
      error: {
        title: "Recurso não encontrado",
        detail: "Criativo não encontrado",
        status: 404,
      },
    };
  }
  return existing;
}

function validateInput<T>(
  schema: ZodSchema<T>,
  input: unknown,
): ActionResult<never> | T {
  const parsed = schema.safeParse(input);
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
  return parsed.data;
}

export async function createCreative(input: {
  name: string;
  totalProfit: number;
  operationId: string;
}): Promise<ActionResult<CreativeViewModel>> {
  try {
    const session = await requireSession();
    if (isErrorResult(session)) return session;

    const data = validateInput(createCreativeSchema, input);
    if (isErrorResult(data)) return data;

    await verifyOperationOwnership(data.operationId, session.userId);

    const created = await CreativeService.create({
      name: data.name,
      totalProfit: new Prisma.Decimal(data.totalProfit),
      operationId: data.operationId,
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
  input: { name?: string; totalProfit?: number },
): Promise<ActionResult<CreativeViewModel>> {
  try {
    const session = await requireSession();
    if (isErrorResult(session)) return session;

    const data = validateInput(updateCreativeSchema, input);
    if (isErrorResult(data)) return data;

    const ownership = await verifyCreativeOwnership(id, session.userId);
    if (isErrorResult(ownership)) return ownership;

    await CreativeService.update(id, {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.totalProfit !== undefined
        ? { totalProfit: new Prisma.Decimal(data.totalProfit) }
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
    const session = await requireSession();
    if (isErrorResult(session)) return session;

    const ownership = await verifyCreativeOwnership(id, session.userId);
    if (isErrorResult(ownership)) return ownership;

    await CreativeService.deleteCreative(id);
    revalidatePath("/criativos");
    return { success: true, data: undefined };
  } catch (error) {
    return errorResult(error);
  }
}

export async function deactivateCreative(
  id: string,
): Promise<ActionResult<CreativeViewModel>> {
  try {
    const session = await requireSession();
    if (isErrorResult(session)) return session;

    const ownership = await verifyCreativeOwnership(id, session.userId);
    if (isErrorResult(ownership)) return ownership;

    await CreativeService.update(id, { isActive: false });
    const updated = await CreativeService.findById(id);
    revalidatePath("/criativos");
    return { success: true, data: toCreativeViewModel(updated) };
  } catch (error) {
    return errorResult(error);
  }
}

export async function registerProfit(
  id: string,
  input: { amount: number },
): Promise<ActionResult<CreativeViewModel>> {
  try {
    const session = await requireSession();
    if (isErrorResult(session)) return session;

    const data = validateInput(registerProfitSchema, input);
    if (isErrorResult(data)) return data;

    const ownership = await verifyCreativeOwnership(id, session.userId);
    if (isErrorResult(ownership)) return ownership;

    const updated = await CreativeService.registerProfit(
      id,
      new Prisma.Decimal(data.amount),
    );

    revalidatePath("/criativos");
    return { success: true, data: toCreativeViewModel(updated) };
  } catch (error) {
    return errorResult(error);
  }
}

export async function registerProfitPayment(
  id: string,
): Promise<ActionResult<void>> {
  try {
    const session = await requireSession();
    if (isErrorResult(session)) return session;

    const ownership = await verifyCreativeOwnership(id, session.userId);
    if (isErrorResult(ownership)) return ownership;

    await CreativeService.registerProfitPayment(id);
    revalidatePath("/criativos");
    return { success: true, data: undefined };
  } catch (error) {
    return errorResult(error);
  }
}
