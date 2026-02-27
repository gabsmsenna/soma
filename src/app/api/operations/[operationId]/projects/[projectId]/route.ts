import { NextResponse } from "next/server";
import z from "zod";
import { updateProjectSchema } from "@/dtos/project.dto";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/services/auth.service";
import { deleteProject, findById, update } from "@/services/project.service";

function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

type RouteContext = {
  params: Promise<{ operationId: string; projectId: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { operationId, projectId } = await params;

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId } = await verifyToken(token);

    const operation = await prisma.operation.findUnique({
      where: { id: operationId, userId },
    });
    if (!operation) {
      return NextResponse.json(
        { error: "Operação não encontrada" },
        { status: 404 },
      );
    }

    const project = await findById(projectId);
    if (project.operationId !== operationId) {
      return NextResponse.json(
        { error: "Projeto não pertence à operação" },
        { status: 404 },
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Erro ao buscar projeto:", error);
    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "PROJECT_NOT_FOUND") {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { operationId, projectId } = await params;

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId } = await verifyToken(token);

    const operation = await prisma.operation.findUnique({
      where: { id: operationId, userId },
    });
    if (!operation) {
      return NextResponse.json(
        { error: "Operação não encontrada" },
        { status: 404 },
      );
    }

    const project = await findById(projectId);
    if (project.operationId !== operationId) {
      return NextResponse.json(
        { error: "Projeto não pertence à operação" },
        { status: 404 },
      );
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
    console.error("Erro ao atualizar projeto:", error);
    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "PROJECT_NOT_FOUND") {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { operationId, projectId } = await params;

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId } = await verifyToken(token);

    const operation = await prisma.operation.findUnique({
      where: { id: operationId, userId },
    });
    if (!operation) {
      return NextResponse.json(
        { error: "Operação não encontrada" },
        { status: 404 },
      );
    }

    const project = await findById(projectId);
    if (project.operationId !== operationId) {
      return NextResponse.json(
        { error: "Projeto não pertence à operação" },
        { status: 404 },
      );
    }

    await deleteProject(projectId);

    return NextResponse.json({ message: "Projeto deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar projeto:", error);
    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "PROJECT_NOT_FOUND") {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
