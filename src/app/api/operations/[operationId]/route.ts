import { NextResponse } from "next/server";
import z from "zod";
import { updateOperationSchema } from "@/dtos/operation.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import prisma from "@/lib/prisma";
import { problems } from "@/lib/problem-registry";
import {
  deleteOperation,
  updateOperation,
  verifyOperationOwnership,
} from "@/services/operation.service";

export async function GET(
  request: Request,
  { params }: { params: { operationId: string } },
) {
  try {
    const { userId } = await authenticate(request);

    // Instead of duplicating verifyOperationOwnership which expects existence,
    // we use prisma direct so we can return the payload
    const operation = await prisma.operation.findUnique({
      where: { id: params.operationId, userId },
      include: { projects: true },
    });

    if (!operation) {
      throw problems.resourceNotFound("Operação não encontrada");
    }

    return NextResponse.json(operation);
  } catch (error) {
    return handleError(error, request);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { operationId: string } },
) {
  try {
    const { userId } = await authenticate(request);

    // Auth-checks implicitly verifying ownership
    await verifyOperationOwnership(params.operationId, userId);

    const body = await request.json();
    const parsedData = updateOperationSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }

    const operation = await updateOperation(
      params.operationId,
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
  { params }: { params: { operationId: string } },
) {
  try {
    const { userId } = await authenticate(request);

    // check explicitly verifying ownership handles NOT FOUND for deleted items
    await verifyOperationOwnership(params.operationId, userId);

    const operation = await deleteOperation(params.operationId, userId);
    return NextResponse.json(operation);
  } catch (error) {
    return handleError(error, request);
  }
}
