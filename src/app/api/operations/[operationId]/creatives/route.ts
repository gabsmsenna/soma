import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import z from "zod";
import { createCreativeSchema } from "@/dtos/creative.dto";
import { paginationSchema } from "@/dtos/operation.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import {
  create,
  findByOperationIdPaginated,
} from "@/services/creative.service";
import { verifyOperationOwnership } from "@/services/operation.service";

type RouteContext = { params: Promise<{ operationId: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { operationId } = await params;
    const { userId } = await authenticate(request);
    await verifyOperationOwnership(operationId, userId);

    const { searchParams } = new URL(request.url);
    const queryParams = {
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    };
    const parsedParams = paginationSchema.safeParse(queryParams);

    if (!parsedParams.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: z.treeifyError(parsedParams.error),
        },
        { status: 400 },
      );
    }

    const { page, limit } = parsedParams.data;
    const result = await findByOperationIdPaginated(operationId, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error, request);
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { operationId } = await params;
    const { userId } = await authenticate(request);
    await verifyOperationOwnership(operationId, userId);

    const body = await request.json();
    const parsedData = createCreativeSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }

    const creative = await create({
      name: parsedData.data.name,
      totalProfit: new Prisma.Decimal(String(parsedData.data.totalProfit)),
      operationId,
    });
    return NextResponse.json(creative, { status: 201 });
  } catch (error) {
    return handleError(error, request);
  }
}
