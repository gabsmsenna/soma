import { NextResponse } from "next/server";
import z from "zod";
import { createOperationSchema, paginationSchema } from "@/dtos/operation.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { createOperation, getAllPaginated } from "@/services/operation.service";

export async function GET(request: Request) {
  try {
    const { userId } = await authenticate(request);

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
    const result = await getAllPaginated(userId, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error, request);
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await authenticate(request);
    const body = await request.json();
    const parsedData = createOperationSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }
    const operation = await createOperation(userId, parsedData.data);
    return NextResponse.json(operation, { status: 201 });
  } catch (error) {
    return handleError(error, request);
  }
}
