import { NextResponse } from "next/server";
import z from "zod";
import { createProjectSchema } from "@/dtos/project.dto";
import prisma from "@/lib/prisma";
import { AuthService } from "@/services/auth.service";
import { ProjectService } from "@/services/project.service";

function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

export async function GET(
  request: Request,
  { params }: { params: { operationId: string } },
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId } = await AuthService.verifyToken(token);

    // Verificar se a operação pertence ao usuário
    const operation = await prisma.operation.findUnique({
      where: { id: params.operationId, userId },
    });
    if (!operation) {
      return NextResponse.json(
        { error: "Operação não encontrada" },
        { status: 404 },
      );
    }

    const projects = await ProjectService.findByOperationId(params.operationId);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Erro ao listar projetos:", error);
    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { operationId: string } },
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId } = await AuthService.verifyToken(token);

    // Verificar se a operação pertence ao usuário
    const operation = await prisma.operation.findUnique({
      where: { id: params.operationId, userId },
    });
    if (!operation) {
      return NextResponse.json(
        { error: "Operação não encontrada" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsedData = createProjectSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }

    const project = await ProjectService.create({
      ...parsedData.data,
      operationId: params.operationId,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
