import { NextResponse } from "next/server";
import z from "zod";
import { createProjectSchema } from "@/dtos/project.dto";
import { paginationSchema } from "@/dtos/operation.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { verifyOperationOwnership } from "@/services/operation.service";
import { create, findByOperationIdPaginated } from "@/services/project.service";

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
    const parsedData = createProjectSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }

    const project = await create({ ...parsedData.data, operationId });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return handleError(error, request);
  }
}
