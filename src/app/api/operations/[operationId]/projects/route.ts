import { NextResponse } from "next/server";
import z from "zod";
import { createProjectSchema } from "@/dtos/project.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { verifyOperationOwnership } from "@/services/operation.service";
import { create, findByOperationId } from "@/services/project.service";

type RouteContext = { params: Promise<{ operationId: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { operationId } = await params;

    const { userId } = await authenticate(request);
    await verifyOperationOwnership(operationId, userId);

    const projects = await findByOperationId(operationId);
    return NextResponse.json(projects);
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

    const project = await create({
      ...parsedData.data,
      operationId,
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return handleError(error, request);
  }
}
