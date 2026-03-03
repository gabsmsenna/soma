import { NextResponse } from "next/server";
import z from "zod";
import { updateProjectSchema } from "@/dtos/project.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { problems } from "@/lib/problem-registry";
import { verifyOperationOwnership } from "@/services/operation.service";
import { deleteProject, findById, update } from "@/services/project.service";

type RouteContext = {
  params: Promise<{ operationId: string; projectId: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { userId } = await authenticate(request);
    const { operationId, projectId } = await params;

    await verifyOperationOwnership(operationId, userId);

    const project = await findById(projectId);

    if (project.operationId !== operationId) {
      throw problems.resourceNotFound("Projeto não encontrado");
    }

    return NextResponse.json(project);
  } catch (error) {
    return handleError(error, request);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { userId } = await authenticate(request);
    const { operationId, projectId } = await params;

    await verifyOperationOwnership(operationId, userId);

    const project = await findById(projectId);

    if (project.operationId !== operationId) {
      throw problems.resourceNotFound("Projeto não encontrado");
    }

    const body = await request.json();
    const parsedData = updateProjectSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }

    const updatedProject = await update(projectId, parsedData.data);
    return NextResponse.json(updatedProject);
  } catch (error) {
    return handleError(error, request);
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { userId } = await authenticate(request);
    const { operationId, projectId } = await params;

    await verifyOperationOwnership(operationId, userId);

    const project = await findById(projectId);

    if (project.operationId !== operationId) {
      throw problems.resourceNotFound("Projeto não encontrado");
    }

    const deletedProject = await deleteProject(projectId);
    return NextResponse.json(deletedProject);
  } catch (error) {
    return handleError(error, request);
  }
}
