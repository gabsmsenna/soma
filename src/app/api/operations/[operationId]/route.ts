import { NextResponse } from "next/server";
import z from "zod";
import { updateOperationSchema } from "@/dtos/operation.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import {
  deleteOperation,
  getById,
  updateOperation,
  verifyOperationOwnership,
} from "@/services/operation.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ operationId: string }> },
) {
  try {
    const { userId } = await authenticate(request);
    const { operationId } = await params;

    const operation = await getById(operationId, userId);
    return NextResponse.json(operation);
  } catch (error) {
    return handleError(error, request);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ operationId: string }> },
) {
  try {
    const { userId } = await authenticate(request);
    const { operationId } = await params;

    await verifyOperationOwnership(operationId, userId);

    const body = await request.json();
    const parsedData = updateOperationSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }

    const operation = await updateOperation(
      operationId,
      userId,
      parsedData.data,
    );
    return NextResponse.json(operation);
  } catch (error) {
    return handleError(error, request);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ operationId: string }> },
) {
  try {
    const { userId } = await authenticate(request);
    const { operationId } = await params;

    await verifyOperationOwnership(operationId, userId);

    const operation = await deleteOperation(operationId, userId);
    return NextResponse.json(operation);
  } catch (error) {
    return handleError(error, request);
  }
}
