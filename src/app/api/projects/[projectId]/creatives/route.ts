import { NextResponse } from "next/server";
import z from "zod";
import { createCreativeSchema } from "@/dtos/creative.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { create, verifyProjectOwnership } from "@/services/creative.service";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { projectId } = await params;

    const { userId } = await authenticate(request);
    await verifyProjectOwnership(projectId, userId);

    const body = await request.json();
    const parsedData = createCreativeSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }

    const creative = await create({
      ...parsedData.data,
      projectId,
    });
    return NextResponse.json(creative, { status: 201 });
  } catch (error) {
    return handleError(error, "Erro ao criar criativo:");
  }
}
