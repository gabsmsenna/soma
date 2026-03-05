import { NextResponse } from "next/server";
import z from "zod";
import { paginationSchema } from "@/dtos/creative.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { findAllByUserId } from "@/services/creative.service";

export async function GET(request: Request) {
  try {
    const { userId } = await authenticate(request);

    const { searchParams } = new URL(request.url);
    const queryParams = {
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      operation: searchParams.get("operation") ?? undefined,
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

    const { page, limit, search, status, operation } = parsedParams.data;

    const result = await findAllByUserId(
      userId,
      page,
      limit,
      search,
      status,
      operation,
    );
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error, request);
  }
}
