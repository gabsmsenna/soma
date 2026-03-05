import { NextResponse } from "next/server";
import z from "zod";
import { updateCreativeSchema } from "@/dtos/creative.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { problems } from "@/lib/problem-registry";
import { deleteCreative, findById, update } from "@/services/creative.service";

type RouteContext = { params: Promise<{ creativeId: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { userId } = await authenticate(request);
    const { creativeId } = await params;

    const creative = await findById(creativeId);

    if (creative.operation.userId !== userId) {
      throw problems.resourceNotFound("Criativo não encontrado");
    }

    return NextResponse.json(creative);
  } catch (error) {
    return handleError(error, request);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { userId } = await authenticate(request);
    const { creativeId } = await params;

    const existing = await findById(creativeId);

    if (existing.operation.userId !== userId) {
      throw problems.resourceNotFound("Criativo não encontrado");
    }

    const body = await request.json();
    const parsedData = updateCreativeSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }

    const creative = await update(creativeId, parsedData.data);
    return NextResponse.json(creative);
  } catch (error) {
    return handleError(error, request);
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { userId } = await authenticate(request);
    const { creativeId } = await params;

    const existing = await findById(creativeId);

    if (existing.operation.userId !== userId) {
      throw problems.resourceNotFound("Criativo não encontrado");
    }

    await deleteCreative(creativeId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error, request);
  }
}
